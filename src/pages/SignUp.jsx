import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link, useNavigate } from 'react-router-dom'
import { AmbientBackground } from '@/components/layout/AmbientBackground'
import { Card } from '@/components/core/Card'
import { Button } from '@/components/core/Button'
import { Input } from '@/components/core/Input'
import { useAuth } from '@/context/AuthContext'
import { supabase } from '@/lib/supabase'
import { cn } from '@/lib/utils'
import { ArrowLeft, ChevronRight, UserCircle, GraduationCap, AlertCircle, Mail, Lock, User, Hash, Building, GitBranch } from 'lucide-react'

export function SignUp() {
  const [step, setStep] = useState(1)
  const [role, setRole] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const navigate = useNavigate()
  const { signUp } = useAuth()

  const [form, setForm] = useState({
    fullName: '', email: '', password: '',
    department: '', branch: '', year: '', usn: '',
  })

  const onChange = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      // 1. Auth signup
      const { data: authData, error: authErr } = await signUp({
        email: form.email,
        password: form.password,
      })
      if (authErr) throw authErr
      if (!authData?.user) throw new Error('Auth failed — no user returned.')

      const userId = authData.user.id

      // 2. Insert profile
      const profilePayload = {
        id: userId,
        role,
        full_name: form.fullName,
        email: form.email,
        department: role === 'mentor' ? form.department || null : null,
        branch:     role === 'student' ? form.branch || null : null,
        year:       role === 'student' ? (parseInt(form.year, 10) || null) : null,
        usn:        role === 'student' ? form.usn || null : null,
        onboarding_completed: true,
      }

      const { error: profileErr } = await supabase.from('profiles').insert([profilePayload])

      if (profileErr) {
        if (profileErr.code === '23505') throw new Error('A profile with this USN or Email already exists.')
        if (profileErr.code === '42501') throw new Error('Profile creation blocked by database policy. Ensure email confirmation is off in Supabase.')
        throw new Error(profileErr.message)
      }

      navigate('/login', { replace: true, state: { message: 'Account created! Sign in with your credentials.' } })
    } catch (err) {
      setError(err.message || 'Unexpected error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative min-h-screen w-full bg-void text-fg-primary flex items-center justify-center p-6 overflow-hidden font-body">
      <AmbientBackground />

      <div className="relative z-10 w-full max-w-[500px]">
        <AnimatePresence mode="wait">
          {step === 1 ? (
            <motion.div
              key="step1"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.03 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="text-center mb-10">
                <h1 className="text-display-sm text-white mb-3">Choose Your Path</h1>
                <p className="text-body-lg text-fg-secondary">Select your role to begin your PulseForge journey.</p>
              </div>

              <div className="space-y-4">
                {[
                  { role: 'mentor',  Icon: UserCircle,    title: 'Mentor / Teacher',  sub: 'Manage cohorts & learning intelligence',  color: 'accent-glow' },
                  { role: 'student', Icon: GraduationCap, title: 'Student / Mentee',   sub: 'Track progress & assignments',            color: 'info' },
                ].map(({ role: r, Icon, title, sub, color }) => (
                  <motion.button
                    key={r}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => { setRole(r); setStep(2) }}
                    className="group w-full p-6 rounded-2xl bg-surface/50 border border-border-subtle hover:border-border-default hover:bg-surface-raised transition-all flex items-center gap-5 text-left"
                  >
                    <div className={cn(
                      'w-14 h-14 rounded-xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform',
                      color === 'accent-glow' ? 'bg-accent-glow/10 border border-accent-glow/20 text-accent-glow' : 'bg-info/10 border border-info/20 text-info'
                    )}>
                      <Icon size={26} />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-h3 text-white mb-1">{title}</h3>
                      <p className="text-caption text-fg-tertiary uppercase tracking-wider">{sub}</p>
                    </div>
                    <ChevronRight size={20} className={cn(
                      'text-fg-tertiary group-hover:translate-x-1 transition-all',
                      color === 'accent-glow' ? 'group-hover:text-accent-glow' : 'group-hover:text-info'
                    )} />
                  </motion.button>
                ))}
              </div>

              <div className="mt-8 text-center">
                <p className="text-body text-fg-secondary">
                  Already have an account?{' '}
                  <Link to="/login" className="text-accent-glow hover:text-white transition-colors font-medium">Sign In</Link>
                </p>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -24 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            >
              <button
                onClick={() => setStep(1)}
                className="flex items-center gap-2 text-label text-fg-tertiary hover:text-white transition-colors mb-8 group"
              >
                <ArrowLeft size={15} className="group-hover:-translate-x-1 transition-transform" />
                Back to Selection
              </button>

              <Card hero glass hoverEffect={false}>
                <div className="mb-7">
                  <h2 className="text-h2 text-white mb-1.5 capitalize">{role} Account</h2>
                  <p className="text-body text-fg-secondary">Complete your profile details below.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                  <Input name="fullName" label="Full Name" placeholder="Your full name" icon={User}
                    required value={form.fullName} onChange={onChange} />
                  <Input name="email" type="email" label="Email Address" placeholder="you@example.com" icon={Mail}
                    required value={form.email} onChange={onChange} />
                  <Input name="password" type="password" label="Password" placeholder="Min 8 characters" icon={Lock}
                    required value={form.password} onChange={onChange} />

                  {role === 'mentor' ? (
                    <Input name="department" label="Department" placeholder="e.g. Computer Science" icon={Building}
                      required value={form.department} onChange={onChange} />
                  ) : (
                    <>
                      <Input name="usn" label="USN / Roll Number" placeholder="e.g. 4SH24CS001" icon={Hash}
                        required value={form.usn} onChange={onChange} className="uppercase font-mono" />
                      <div className="grid grid-cols-2 gap-4">
                        <Input name="branch" label="Branch" placeholder="CSE" icon={GitBranch}
                          required value={form.branch} onChange={onChange} />
                        <Input name="year" type="number" label="Year" placeholder="2024"
                          required value={form.year} onChange={onChange} min={1} max={4} />
                      </div>
                    </>
                  )}

                  {error && (
                    <div className="p-3 rounded-lg bg-danger-bg border border-danger-border flex items-center gap-2 text-danger text-micro">
                      <AlertCircle size={14} />
                      {error}
                    </div>
                  )}

                  <Button type="submit" variant="primary" size="lg" className="w-full mt-2" disabled={loading}>
                    {loading ? 'Creating Account…' : 'Create Account'}
                  </Button>
                </form>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
