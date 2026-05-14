import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react'
import { supabase } from '@/lib/supabase'

const AuthContext = createContext({})

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  const lastUserIdRef     = useRef(null)
  const subscriptionRef   = useRef(null)
  const isMountedRef      = useRef(true)

  // ─── Fetch profile from DB ──────────────────────────────────────────────────
  const fetchProfile = useCallback(async (userId) => {
    if (!userId) return null
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()

      if (error) {
        if (error.code !== 'PGRST116') {
          console.error('[AuthContext] Profile fetch error:', error.message)
        }
        return null
      }
      return data
    } catch (err) {
      console.error('[AuthContext] fetchProfile threw:', err)
      return null
    }
  }, [])

  // ─── Handle auth state events ────────────────────────────────────────────────
  const handleAuthEvent = useCallback(async (event, session) => {
    const currentUser   = session?.user ?? null
    const currentUserId = currentUser?.id ?? null

    const isNewUser      = currentUserId !== lastUserIdRef.current
    const isSpecialEvent = event === 'TOKEN_REFRESHED' || event === 'USER_UPDATED' || event === 'INITIAL_SESSION'

    if (!isNewUser && !isSpecialEvent) return

    lastUserIdRef.current = currentUserId

    try {
      if (!currentUser) {
        if (isMountedRef.current) {
          setUser(null)
          setProfile(null)
        }
        return
      }

      if (isMountedRef.current) {
        setUser(currentUser)
        const profileData = await fetchProfile(currentUserId)
        if (isMountedRef.current) setProfile(profileData)
      }
    } catch (err) {
      console.error('[AuthContext] handleAuthEvent error:', err)
    } finally {
      if (isMountedRef.current) setLoading(false)
    }
  }, [fetchProfile])

  // ─── Initialize on mount ─────────────────────────────────────────────────────
  useEffect(() => {
    isMountedRef.current = true

    // Fail-safe: release loading after 8 s no matter what
    const failSafe = setTimeout(() => {
      if (isMountedRef.current) setLoading(false)
    }, 8000)

    const init = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        await handleAuthEvent('INITIAL_SESSION', session)

        if (!subscriptionRef.current) {
          const { data: { subscription } } = supabase.auth.onAuthStateChange(
            async (event, session) => {
              await handleAuthEvent(event, session)
            }
          )
          subscriptionRef.current = subscription
        }
      } catch (err) {
        console.error('[AuthContext] init error:', err)
        if (isMountedRef.current) setLoading(false)
      } finally {
        clearTimeout(failSafe)
      }
    }

    init()

    return () => {
      isMountedRef.current = false
      clearTimeout(failSafe)
      subscriptionRef.current?.unsubscribe()
      subscriptionRef.current = null
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) // intentionally empty — handleAuthEvent is stable via useCallback

  // ─── Manual profile refresh ──────────────────────────────────────────────────
  const refreshProfile = useCallback(async () => {
    if (!user?.id) return
    const data = await fetchProfile(user.id)
    if (isMountedRef.current) setProfile(data)
  }, [user?.id, fetchProfile])

  // ─── Auth actions ─────────────────────────────────────────────────────────────
  const signUp = (payload) => supabase.auth.signUp(payload)

  const signIn = (payload) => supabase.auth.signInWithPassword(payload)

  const signOut = async () => {
    lastUserIdRef.current = null
    await supabase.auth.signOut()
    if (isMountedRef.current) {
      setUser(null)
      setProfile(null)
    }
  }

  const value = {
    user,
    profile,
    loading,
    role: profile?.role ?? null,
    signUp,
    signIn,
    signOut,
    refreshProfile,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext)
