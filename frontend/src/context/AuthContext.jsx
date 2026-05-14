import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react';
import { supabase } from '@/lib/supabase';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Refs to prevent recursive loops and redundant fetches
  const lastUserId = useRef(null);
  const subscriptionRef = useRef(null);
  const isMountedRef = useRef(true);

  const fetchProfile = useCallback(async (userId) => {
    if (!userId) return null;

    console.log(`[AuthContext] fetchProfile triggered for: ${userId}`);
    try {
      const profilePromise = supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Profile fetch timeout')), 5000)
      );

      const { data, error } = await Promise.race([profilePromise, timeoutPromise]);

      if (error) {
        if (error.code === 'PGRST116') {
          console.log('[AuthContext] Profile not found (PGRST116) - expected during signup.');
        } else {
          console.error('[AuthContext] Profile fetch error:', error);
        }
        return null;
      }

      console.log(`[AuthContext] Profile successfully hydrated: ${data?.role}`);
      return data;
    } catch (err) {
      console.error('[AuthContext] Profile fetch failed or timed out:', err);
      return null;
    }
  }, []);

  useEffect(() => {
    isMountedRef.current = true;

    // Fail-safe: resolve loading even if everything hangs
    const failSafeTimeout = setTimeout(() => {
      if (isMountedRef.current) {
        console.warn('[AuthContext] Initialization fail-safe triggered');
        setLoading(false);
      }
    }, 8000);

    const handleAuthEvent = async (event, session) => {
      const currentUser = session?.user ?? null;
      const currentUserId = currentUser?.id ?? null;

      console.log(`[AuthState] Event: ${event} | User: ${currentUserId || 'None'}`);

      try {
        // Guard: skip redundant events unless the user actually changed or it's a token/update event
        const isNewUser = currentUserId !== lastUserId.current;
        const isRefreshEvent = event === 'TOKEN_REFRESHED' || event === 'USER_UPDATED';

        if (!isNewUser && !isRefreshEvent && event !== 'INITIAL_SESSION') {
          console.log('[AuthState] Skipping redundant auth event processing');
          return;
        }

        lastUserId.current = currentUserId;

        if (!currentUser) {
          console.log('[AuthState] No user found - clearing states');
          if (isMountedRef.current) {
            setUser(null);
            setProfile(null);
            setLoading(false);
          }
          return;
        }

        if (isMountedRef.current) {
          console.log('[AuthState] Setting user state:', currentUser.id);
          setUser(currentUser);
          
          // Hydrate profile
          const profileData = await fetchProfile(currentUserId);
          
          if (isMountedRef.current) {
            if (profileData) {
              console.log('[AuthState] Profile hydrated successfully');
              setProfile(profileData);
            } else {
              console.warn('[AuthState] Profile fetch returned NULL - using metadata fallback');
              // Optional: Construct a minimal profile from user_metadata if DB is slow
              setProfile({
                id: currentUser.id,
                role: currentUser.user_metadata?.role || 'student',
                full_name: currentUser.user_metadata?.full_name || 'User',
                is_verified: currentUser.user_metadata?.is_verified || false
              });
            }
          }
        }
      } catch (err) {
        console.error('[AuthContext] Error in handleAuthEvent:', err);
      } finally {
        // Always resolve loading
        if (isMountedRef.current) {
          console.log('[AuthContext] Loading state resolved');
          setLoading(false);
        }
      }
    };

    const initialize = async () => {
      console.log('[AuthContext] Starting initialization lifecycle...');
      try {
        // 1. Get the current session
        const { data: { session } } = await supabase.auth.getSession();
        await handleAuthEvent('INITIAL_SESSION', session);

        // 2. Subscribe to future auth changes
        if (!subscriptionRef.current) {
          const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
            await handleAuthEvent(event, session);
          });
          subscriptionRef.current = subscription;
        }
      } catch (err) {
        console.error('[AuthContext] Critical initialization error:', err);
        if (isMountedRef.current) setLoading(false);
      } finally {
        clearTimeout(failSafeTimeout);
      }
    };

    initialize();

    return () => {
      isMountedRef.current = false;
      clearTimeout(failSafeTimeout);
      if (subscriptionRef.current) {
        subscriptionRef.current.unsubscribe();
        subscriptionRef.current = null;
      }
    };
  // ⚠️ CRITICAL: Do NOT add `loading` to this dependency array.
  // Including `loading` would cause the effect to re-run every time loading
  // changes, creating an infinite initialization loop after sign-in.
  }, [fetchProfile]);

  const refreshProfile = useCallback(async () => {
    if (!user?.id) return;
    console.log('[AuthContext] Manual profile refresh requested');
    const data = await fetchProfile(user.id);
    setProfile(data);
  }, [user?.id, fetchProfile]);

  const value = {
    signUp: (data) => supabase.auth.signUp(data),
    signIn: (data) => supabase.auth.signInWithPassword(data),
    signOut: async () => {
      console.log('[AuthContext] Signing out...');
      lastUserId.current = null;
      const { error } = await supabase.auth.signOut();
      if (error) console.error('Sign out error:', error);
      setUser(null);
      setProfile(null);
    },
    refreshProfile,
    user,
    profile,
    loading,
    role: profile?.role ?? null,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
