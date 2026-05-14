import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { AmbientBackground } from '@/components/layout/AmbientBackground'
import { Card } from '@/components/core/Card'
import { Button } from '@/components/core/Button'
import { Input } from '@/components/core/Input'
import { useAuth } from '@/context/AuthContext'
import { supabase } from '@/lib/supabase'
import { cn } from '@/lib/utils'
import {
  Zap, Activity, Users, CheckSquare, Presentation, BookOpen,
  AlertCircle, Mail, Lock, Hash,
} from 'lucide-react'

const featureList = [
  { icon: Activity,     text: 'AI Attendance Intelligence' },
  { icon: Users,        text: 'Mentor Collaboration' },
  { icon: CheckSquare,  text: 'Assignment Tracking' },
  { icon: Presentation, text: 'Project Workspaces' },
  { icon: BookOpen,     text: 'Engagement Analytics' },
]

export function Login() {
  const [tab, setTab]         = useState('mentor')
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState(null)
  const [form, setForm]       = useState({ email: '', password: '', usn: '' })

  const navigate  = useNavigate()
  const location  = useLocation()
  const { signIn } = useAuth()

  const successMsg = location.state?.message

  const onChange = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const email =
        tab === 'mentor'
          ? form.email
          : form.email || `${form.usn.toLowerCase()}@pulseforge.student`

      const { data, error: signInErr } = await signIn({ email, password: form.password })
      if (signInErr) throw signInErr

      // Smart redirect based on role
      let dest = '/dashboard'
      const userId = data?.user?.id
      if (userId) {
        const { data: prof } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', userId)
          .single()

        if (prof?.role === 'student') dest = '/portal'
      }

      const from = location.state?.from?.pathname
      navigate(from || dest, { replace: true })
    } catch (err) {
      setError(err.message || 'Sign in failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative min-h-screen w-full flex bg-void text-fg-primary overflow-hidden font-body">
      <AmbientBackground />

      {/* Left panel */}
      <div className="hidden lg:flex flex-1 flex-col justify-center px-16 xl:px-24 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-lg"
        >
          <Link to="/" className="inline-flex items-center gap-3 mb-10 group">
            <div className="w-11 h-11 rounded-xl bg-accent-glow flex items-center justify-center shadow-glow">
              <Zap size={18} className="text-white" />
            </div>
            <span className="text-display-sm font-bold tracking-tight text-white group-hover:text-accent-glow transition-colors">
              PulseForge
            </span>
          </Link>

          <h2 className="text-display-md font-bold leading-[1.1] text-white mb-5">
            Transforming attendance into{' '}
            <span className="text-gradient-accent">actionable intelligence.</span>
          </h2>

          <div className="space-y-4 mt-10">
            {featureList.map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + i * 0.1 }}
                className="flex items-center gap-4 group cursor-default"
              >
                <div className="w-9 h-9 rounded-lg bg-surface border border-border-subtle flex items-center justify-center text-accent-glow group-hover:bg-accent-glow/10 group-hover:border-accent-glow/30 transition-all">
                  <f.icon size={16} />
                </div>
                <span className="text-body text-fg-secondary group-hover:text-fg-primary transition-colors">{f.text}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-[420px]"
        >
          <Card hero hoverEffect={false} glass className="relative">
            {/* Glow backdrop */}
            <div className="absolute inset-0 rounded-2xl bg-accent-glow/5 blur-3xl -z-10 scale-110" />

            <div className="text-center mb-8">
              <h3 className="text-h2 text-white mb-1.5">Welcome Back</h3>
              <p className="text-body text-fg-secondary">Sign in to your PulseForge account</p>
            </div>

            {successMsg && (
              <div className="mb-6 p-3.5 rounded-lg bg-success-bg border border-success-border flex items-center gap-2.5 text-success text-[13px]">
                <Activity size={15} />
                {successMsg}
              </div>
            )}

            {/* Tab switcher */}
            <div className="relative flex p-1 mb-7 bg-surface-inset border border-border-subtle rounded-xl">
              {['mentor', 'student'].map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTab(t)}
                  className={cn(
                    'relative flex-1 py-2.5 text-[13px] font-semibold capitalize transition-colors z-20 rounded-lg',
                    tab === t ? 'text-white' : 'text-fg-tertiary hover:text-fg-secondary'
                  )}
                >
                  {t}
                </button>
              ))}
              <motion.div
                className="absolute top-1 bottom-1 w-[calc(50%-4px)] bg-surface-raised border border-border-default rounded-lg z-10"
                animate={{ left: tab === 'mentor' ? '4px' : 'calc(50%)' }}
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              />
            </div>

            <form onSubmit={handleLogin} className="space-y-5">
              <AnimatePresence mode="wait">
                <motion.div
                  key={tab}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-5"
                >
                  {tab === 'mentor' ? (
                    <Input
                      name="email"
                      type="email"
                      label="Email Address"
                      placeholder="mentor@theforge.local"
                      icon={Mail}
                      required
                      value={form.email}
                      onChange={onChange}
                    />
                  ) : (
                    <Input
                      name="usn"
                      type="text"
                      label="Student USN"
                      placeholder="e.g. 4SH24CS001"
                      icon={Hash}
                      required
                      value={form.usn}
                      onChange={onChange}
                      className="uppercase font-mono"
                    />
                  )}

                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="text-label text-fg-secondary uppercase tracking-wider">Password</label>
                      <a href="#" className="text-micro text-accent-glow hover:text-white transition-colors">Forgot?</a>
                    </div>
                    <Input
                      name="password"
                      type="password"
                      placeholder="••••••••"
                      icon={Lock}
                      required
                      value={form.password}
                      onChange={onChange}
                    />
                  </div>
                </motion.div>
              </AnimatePresence>

              {error && (
                <div className="p-3 rounded-lg bg-danger-bg border border-danger-border flex items-center gap-2 text-danger text-micro">
                  <AlertCircle size={14} />
                  {error}
                </div>
              )}

              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full mt-2 shadow-glow"
                disabled={loading}
              >
                {loading ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 0.9, ease: 'linear' }}
                    className="w-5 h-5 border-2 border-void border-t-transparent rounded-full"
                  />
                ) : 'Sign In'}
              </Button>
            </form>

            <div className="mt-7 text-center border-t border-border-subtle pt-6">
              <p className="text-[13px] text-fg-tertiary">
                New to PulseForge?{' '}
                <Link to="/signup" className="text-accent-glow hover:text-white transition-colors font-medium">
                  Create Account
                </Link>
              </p>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
