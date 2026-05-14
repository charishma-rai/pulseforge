import React from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { AmbientBackground } from '@/components/layout/AmbientBackground'
import { Button } from '@/components/core/Button'
import { Zap, ArrowRight, Activity, Users, CheckSquare, Calendar, Brain } from 'lucide-react'

const features = [
  { icon: Activity,    label: 'Attendance Intelligence', desc: 'AI-powered risk prediction and engagement tracking' },
  { icon: Users,       label: 'Mentor Collaboration',    desc: 'Seamless scheduling and mentorship workflows' },
  { icon: CheckSquare, label: 'Assignment Tracking',     desc: 'Manage submissions, grades, and deadlines' },
  { icon: Calendar,    label: 'Smart Scheduling',        desc: 'Book and manage sessions effortlessly' },
  { icon: Brain,       label: 'AI Insights',             desc: 'Gemini-powered learning analytics and recommendations' },
]

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.6 } },
}
const item = {
  hidden: { opacity: 0, y: 20 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
}

export function Landing() {
  const navigate = useNavigate()

  return (
    <div className="relative min-h-screen w-full bg-void flex flex-col overflow-hidden font-body">
      <AmbientBackground />

      {/* Navbar */}
      <header className="relative z-10 flex items-center justify-between px-8 py-6 max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-accent-glow flex items-center justify-center shadow-glow">
            <Zap size={15} className="text-white" />
          </div>
          <span className="font-bold text-[17px] tracking-tight text-white">PulseForge</span>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={() => navigate('/login')}>Sign In</Button>
          <Button variant="accent" size="sm" onClick={() => navigate('/signup')}>Get Started</Button>
        </div>
      </header>

      {/* Hero */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center text-center px-6 pt-8 pb-24">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-8"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent-glow/10 border border-accent-glow/25 backdrop-blur-sm">
            <div className="w-1.5 h-1.5 rounded-full bg-accent-glow animate-pulse" />
            <span className="text-[11px] font-bold text-accent-glow uppercase tracking-[0.2em]">
              AI-Powered Learning Platform
            </span>
          </div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="text-display-hero text-white max-w-4xl leading-[1.0] tracking-tighter mb-6"
        >
          The operating system for{' '}
          <span className="text-gradient-accent">learning intelligence.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="text-body-lg text-fg-secondary max-w-2xl leading-relaxed mb-12"
        >
          PulseForge combines attendance intelligence, mentor collaboration, and AI-driven
          predictive analytics into a single cinematic interface for modern education.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="flex flex-col sm:flex-row items-center gap-4"
        >
          <Button size="xl" variant="primary" onClick={() => navigate('/signup')} className="w-full sm:w-auto group">
            Start for Free
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </Button>
          <Button size="xl" variant="secondary" onClick={() => navigate('/login')} className="w-full sm:w-auto">
            Sign In
          </Button>
        </motion.div>

        {/* Feature pills */}
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="mt-20 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl w-full"
        >
          {features.map((f) => (
            <motion.div
              key={f.label}
              variants={item}
              className="flex items-start gap-4 p-5 rounded-xl bg-surface/50 border border-border-subtle hover:border-border-default hover:bg-surface transition-all group cursor-default text-left"
            >
              <div className="w-9 h-9 rounded-lg bg-accent-glow/10 border border-accent-glow/20 flex items-center justify-center text-accent-glow shrink-0 group-hover:scale-110 transition-transform">
                <f.icon size={17} />
              </div>
              <div>
                <p className="text-body font-semibold text-fg-primary mb-0.5">{f.label}</p>
                <p className="text-caption text-fg-tertiary">{f.desc}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-border-subtle py-6 px-8 text-center">
        <p className="text-micro text-fg-tertiary uppercase tracking-widest">
          PulseForge &copy; {new Date().getFullYear()} · Built for modern education
        </p>
      </footer>
    </div>
  )
}
