import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '@/context/AuthContext'
import { supabase } from '@/lib/supabase'
import { PageContainer, PageHeader } from '@/components/layout/PageContainer'
import { Card, StatCard } from '@/components/core/Card'
import { StatusPill } from '@/components/core/StatusPill'
import { Button } from '@/components/core/Button'
import { formatDate, formatTime } from '@/lib/utils'
import {
  Users, CheckSquare, Calendar, TrendingUp, Clock, BookOpen,
  ArrowRight, AlertTriangle, Activity, Zap,
} from 'lucide-react'

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  show:   (i) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.5, ease: [0.16, 1, 0.3, 1] } }),
}

export function MentorDashboard() {
  const { profile } = useAuth()
  const [stats, setStats]     = useState({ meetings: 0, pending: 0 })
  const [meetings, setMeetings] = useState([])
  const [loadingData, setLoadingData] = useState(true)

  useEffect(() => {
    const load = async () => {
      setLoadingData(true)
      try {
        const { data: meetingsData } = await supabase
          .from('meetings')
          .select('*, student:profiles!student_id(full_name)')
          .eq('mentor_id', (await supabase.auth.getUser()).data.user?.id)
          .order('start_time', { ascending: true })
          .limit(5)

        const all = meetingsData ?? []
        setMeetings(all)
        setStats({
          meetings: all.filter(m => m.status === 'accepted').length,
          pending:  all.filter(m => m.status === 'pending').length,
        })
      } catch (err) {
        console.error('[Dashboard] load error:', err)
      } finally {
        setLoadingData(false)
      }
    }
    load()
  }, [])

  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'

  return (
    <PageContainer>
      {/* Hero greeting */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-10"
      >
        <div className="flex items-center gap-2 mb-3">
          <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
          <span className="text-micro text-fg-tertiary uppercase tracking-widest">Live Dashboard</span>
        </div>
        <h1 className="text-display-md text-white leading-tight tracking-tight">
          {greeting}, <span className="text-gradient-accent">{profile?.full_name?.split(' ')[0] ?? 'Mentor'}</span> 👋
        </h1>
        <p className="text-body-lg text-fg-secondary mt-2">
          Here's what's happening in your cohort today.
        </p>
      </motion.div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
        {[
          { label: 'Upcoming Sessions', value: stats.meetings, icon: Calendar, accent: true },
          { label: 'Pending Requests', value: stats.pending,   icon: Clock },
          { label: 'Total Meetings',   value: meetings.length, icon: CheckSquare },
          { label: 'Engagement',       value: '—',             icon: TrendingUp },
        ].map((s, i) => (
          <motion.div key={s.label} custom={i} variants={cardVariants} initial="hidden" animate="show">
            <StatCard {...s} />
          </motion.div>
        ))}
      </div>

      {/* Two-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upcoming meetings */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-h3 text-fg-primary font-semibold">Upcoming Meetings</h2>
            <Button variant="ghost" size="sm" onClick={() => window.location.href = '/scheduling'}>
              View all <ArrowRight size={14} className="ml-1" />
            </Button>
          </div>

          {loadingData ? (
            <div className="space-y-3">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-20 rounded-xl bg-surface/50 shimmer" />
              ))}
            </div>
          ) : meetings.length === 0 ? (
            <Card className="py-12 text-center border-dashed">
              <Calendar size={40} className="mx-auto text-fg-tertiary opacity-25 mb-3" />
              <p className="text-body text-fg-tertiary">No upcoming meetings. Create a slot in Scheduling.</p>
            </Card>
          ) : (
            <div className="space-y-3">
              {meetings.map((m, i) => (
                <motion.div
                  key={m.id}
                  custom={i}
                  variants={cardVariants}
                  initial="hidden"
                  animate="show"
                  className="flex items-center gap-4 p-4 rounded-xl bg-surface border border-border-subtle hover:border-border-default transition-all group"
                >
                  <div className="w-10 h-10 rounded-lg bg-accent-glow/10 flex items-center justify-center text-accent-glow shrink-0">
                    <Calendar size={17} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-body font-semibold text-fg-primary truncate">{m.title || 'Meeting Slot'}</p>
                    <p className="text-caption text-fg-tertiary">{m.student?.full_name ?? 'Open slot'} · {formatDate(m.start_time)} {formatTime(m.start_time)}</p>
                  </div>
                  <StatusPill status={m.status} />
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Quick actions */}
        <div>
          <h2 className="text-h3 text-fg-primary font-semibold mb-5">Quick Actions</h2>
          <div className="space-y-3">
            {[
              { icon: CheckSquare, label: 'Mark Attendance', desc: 'Record today\'s session', to: '/attendance', color: 'success' },
              { icon: Calendar,    label: 'Schedule Meeting', desc: 'Create an available slot', to: '/scheduling', color: 'accent-glow' },
              { icon: BookOpen,    label: 'Add Materials',    desc: 'Upload session resources', to: '/materials', color: 'info' },
              { icon: Activity,    label: 'View Analytics',   desc: 'AI-driven insights', to: '/analytics', color: 'warning' },
            ].map(({ icon: Icon, label, desc, to, color }) => (
              <a key={label} href={to} className="block group">
                <div className="flex items-center gap-3.5 p-4 rounded-xl bg-surface border border-border-subtle hover:border-border-default hover:bg-surface-raised transition-all">
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 text-${color} bg-${color}/10`}>
                    <Icon size={16} />
                  </div>
                  <div className="flex-1">
                    <p className="text-body font-semibold text-fg-primary text-[13.5px]">{label}</p>
                    <p className="text-micro text-fg-tertiary">{desc}</p>
                  </div>
                  <ArrowRight size={14} className="text-fg-tertiary group-hover:text-fg-primary group-hover:translate-x-0.5 transition-all" />
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* AI insights teaser */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.6 }}
        className="mt-8 p-6 rounded-2xl bg-gradient-to-r from-accent-glow/10 to-info/10 border border-accent-glow/20 flex items-center gap-5"
      >
        <div className="w-12 h-12 rounded-xl bg-accent-glow/20 flex items-center justify-center text-accent-glow shrink-0">
          <Zap size={22} />
        </div>
        <div className="flex-1">
          <p className="text-body font-semibold text-white mb-0.5">AI Intelligence Ready</p>
          <p className="text-caption text-fg-secondary">Upload a CSV to generate AI-powered attendance insights and dropout risk predictions.</p>
        </div>
        <Button variant="secondary" size="sm" onClick={() => window.location.href = '/upload'}>
          Upload CSV
        </Button>
      </motion.div>
    </PageContainer>
  )
}
