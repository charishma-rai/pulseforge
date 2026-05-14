import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '@/context/AuthContext'
import { supabase } from '@/lib/supabase'
import { PageContainer } from '@/components/layout/PageContainer'
import { Card, StatCard } from '@/components/core/Card'
import { StatusPill } from '@/components/core/StatusPill'
import { formatDate, formatTime } from '@/lib/utils'
import { Calendar, CheckSquare, BookOpen, TrendingUp, Clock, ArrowRight } from 'lucide-react'

export function StudentPortal() {
  const { profile, user } = useAuth()
  const [meetings, setMeetings] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      if (!user?.id) return
      setLoading(true)
      try {
        const { data } = await supabase
          .from('meetings')
          .select('*, mentor:profiles!mentor_id(full_name)')
          .eq('student_id', user.id)
          .order('start_time', { ascending: true })
          .limit(5)

        setMeetings(data ?? [])
      } catch (err) {
        console.error('[StudentPortal] load error:', err)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [user?.id])

  return (
    <PageContainer>
      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-10"
      >
        <div className="flex items-center gap-2 mb-3">
          <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
          <span className="text-micro text-fg-tertiary uppercase tracking-widest">Student Portal</span>
        </div>
        <h1 className="text-display-md text-white tracking-tight">
          Welcome back,{' '}
          <span className="text-gradient-accent">{profile?.full_name?.split(' ')[0] ?? 'Student'}</span>
        </h1>
        {profile?.usn && (
          <p className="text-body text-fg-tertiary mt-2 font-mono uppercase">{profile.usn} · {profile.branch} · Year {profile.year}</p>
        )}
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
        <StatCard label="My Meetings"  value={meetings.length} icon={Calendar} accent />
        <StatCard label="Pending"      value={meetings.filter(m => m.status === 'pending').length}  icon={Clock} />
        <StatCard label="Accepted"     value={meetings.filter(m => m.status === 'accepted').length} icon={CheckSquare} />
        <StatCard label="Completed"    value={meetings.filter(m => m.status === 'completed').length} icon={TrendingUp} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* My meetings */}
        <div className="lg:col-span-2">
          <h2 className="text-h3 text-fg-primary font-semibold mb-5">My Meetings</h2>
          {loading ? (
            <div className="space-y-3">
              {[1,2,3].map(i => <div key={i} className="h-20 rounded-xl bg-surface/50 shimmer" />)}
            </div>
          ) : meetings.length === 0 ? (
            <Card className="py-12 text-center border-dashed">
              <Calendar size={40} className="mx-auto text-fg-tertiary opacity-25 mb-3" />
              <p className="text-body text-fg-tertiary">No meetings yet. Book a session in Scheduling.</p>
            </Card>
          ) : (
            <div className="space-y-3">
              {meetings.map(m => (
                <div key={m.id} className="flex items-center gap-4 p-4 rounded-xl bg-surface border border-border-subtle hover:border-border-default transition-all">
                  <div className="w-10 h-10 rounded-lg bg-info/10 flex items-center justify-center text-info shrink-0">
                    <Calendar size={17} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-body font-semibold text-fg-primary truncate">{m.title || 'Meeting'}</p>
                    <p className="text-caption text-fg-tertiary">{m.mentor?.full_name ?? 'Mentor'} · {formatDate(m.start_time)} {formatTime(m.start_time)}</p>
                  </div>
                  <StatusPill status={m.status} />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick links */}
        <div>
          <h2 className="text-h3 text-fg-primary font-semibold mb-5">Navigate</h2>
          <div className="space-y-3">
            {[
              { icon: Calendar, label: 'Book a Session', to: '/scheduling', color: 'accent-glow' },
              { icon: CheckSquare, label: 'My Attendance',  to: '/attendance', color: 'success' },
              { icon: BookOpen,   label: 'Materials',       to: '/materials',  color: 'info' },
            ].map(({ icon: Icon, label, to, color }) => (
              <a key={label} href={to}
                className="flex items-center gap-3.5 p-4 rounded-xl bg-surface border border-border-subtle hover:border-border-default hover:bg-surface-raised transition-all group"
              >
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center text-${color} bg-${color}/10 shrink-0`}>
                  <Icon size={16} />
                </div>
                <span className="flex-1 text-body font-semibold text-fg-primary text-[13.5px]">{label}</span>
                <ArrowRight size={14} className="text-fg-tertiary group-hover:translate-x-0.5 transition-all" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </PageContainer>
  )
}
