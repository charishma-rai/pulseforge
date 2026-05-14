import React, { useEffect, useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '@/context/AuthContext'
import { supabase } from '@/lib/supabase'
import { PageContainer } from '@/components/layout/PageContainer'
import { Card, StatCard } from '@/components/core/Card'
import { askGemini } from '@/lib/gemini'
import { StatusPill } from '@/components/core/StatusPill'
import { formatDate, formatTime } from '@/lib/utils'
import { Calendar, CheckSquare, BookOpen, TrendingUp, Clock, ArrowRight, XCircle, FileText, Sparkles } from 'lucide-react'

export function StudentPortal() {
  const { profile, user } = useAuth()
  const [data, setData] = useState({
    meetings: [],
    attendance: [],
    assignments: []
  })
  const [loading, setLoading] = useState(true)
  const [aiInsight, setAiInsight] = useState("Analyzing your academic pulse...")

  useEffect(() => {
    const load = async () => {
      if (!user?.id) return
      setLoading(true)
      try {
        const [meetingsRes, attendanceRes, assignmentsRes] = await Promise.all([
          supabase
            .from('meetings')
            .select('*, mentor:profiles!mentor_id(full_name)')
            .eq('student_id', user.id)
            .order('start_time', { ascending: true })
            .limit(5),
          supabase
            .from('attendance')
            .select('*, session:sessions(title, start_time)')
            .eq('student_id', user.id)
            .order('date', { ascending: false }),
          supabase
            .from('assignments')
            .select('*')
            .order('due_date', { ascending: true })
            .limit(5)
        ]);

        setData({
          meetings: meetingsRes.data || [],
          attendance: attendanceRes.data || [],
          assignments: assignmentsRes.data || []
        });
      } catch (err) {
        console.error('[StudentPortal] load error:', err)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [user?.id])

  const stats = useMemo(() => {
    const total = data.attendance.length;
    const present = data.attendance.filter(a => a.status === 'present' || a.status === 'late').length;
    const pct = total === 0 ? 0 : Math.round((present / total) * 100);
    
    return {
      totalAttendance: total,
      presentAttendance: present,
      attendancePct: pct,
      pendingMeetings: data.meetings.filter(m => m.status === 'pending').length,
      upcomingAssignments: data.assignments.length
    }
  }, [data]);

  useEffect(() => {
    const fetchInsight = async () => {
      if (stats.totalAttendance === 0 && stats.upcomingAssignments === 0 && stats.pendingMeetings === 0) {
        setAiInsight("Start attending sessions and engaging with the platform to unlock personalized AI insights.");
        return;
      }
      try {
        const prompt = `You are an AI mentor for an academic platform. The student's attendance is ${stats.attendancePct}%. They have ${stats.upcomingAssignments} assignments and ${stats.pendingMeetings} pending meetings. Write a very brief, encouraging 1-2 sentence insight. Be professional and actionable.`;
        const response = await askGemini(prompt);
        setAiInsight(response);
      } catch (err) {
        console.error("Failed to fetch AI insight", err);
        setAiInsight("Your academic data is currently syncing. Check back shortly for insights.");
      }
    };
    if (!loading) fetchInsight();
  }, [stats, loading]);

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

      {/* AI Insight */}
      <div className="mb-10 p-5 rounded-2xl bg-surface border border-accent-glow/30 flex items-start gap-4">
        <div className="w-10 h-10 rounded-xl bg-accent-glow/20 text-accent-glow flex items-center justify-center shrink-0">
          <Sparkles size={20} />
        </div>
        <div>
          <h3 className="text-body font-semibold text-white mb-1">PulseForge AI Insight</h3>
          <p className="text-body-sm text-fg-secondary">{aiInsight}</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
        <StatCard label="Attendance" value={`${stats.attendancePct}%`} icon={CheckSquare} accent />
        <StatCard label="Assignments" value={stats.upcomingAssignments} icon={FileText} />
        <StatCard label="My Meetings" value={data.meetings.length} icon={Calendar} />
        <StatCard label="Pending Requests" value={stats.pendingMeetings} icon={Clock} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Recent Attendance */}
          <div>
            <h2 className="text-h3 text-fg-primary font-semibold mb-5 flex items-center justify-between">
              Recent Attendance
            </h2>
            {loading ? (
              <div className="space-y-3">
                {[1,2].map(i => <div key={i} className="h-20 rounded-xl bg-surface/50 shimmer" />)}
              </div>
            ) : data.attendance.length === 0 ? (
              <Card className="py-12 text-center border-dashed">
                <CheckSquare size={40} className="mx-auto text-fg-tertiary opacity-25 mb-3" />
                <p className="text-body text-fg-tertiary">No attendance recorded yet.</p>
              </Card>
            ) : (
              <div className="space-y-3">
                {data.attendance.slice(0, 3).map(a => (
                  <div key={a.id} className="flex items-center gap-4 p-4 rounded-xl bg-surface border border-border-subtle hover:border-border-default transition-all">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
                      a.status === 'present' ? 'bg-success/10 text-success' : 
                      a.status === 'late' ? 'bg-warning/10 text-warning' : 
                      'bg-danger/10 text-danger'
                    }`}>
                      {a.status === 'present' ? <CheckSquare size={17} /> : a.status === 'late' ? <Clock size={17} /> : <XCircle size={17} />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-body font-semibold text-fg-primary truncate">{a.session?.title || 'Session'}</p>
                      <p className="text-caption text-fg-tertiary">{formatDate(a.date)}</p>
                    </div>
                    <span className={`text-micro uppercase tracking-widest font-bold ${
                      a.status === 'present' ? 'text-success' : 
                      a.status === 'late' ? 'text-warning' : 
                      'text-danger'
                    }`}>
                      {a.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Assignments */}
          <div>
            <h2 className="text-h3 text-fg-primary font-semibold mb-5 flex items-center justify-between">
              Assignments
            </h2>
            {loading ? (
              <div className="space-y-3">
                {[1,2].map(i => <div key={i} className="h-20 rounded-xl bg-surface/50 shimmer" />)}
              </div>
            ) : data.assignments.length === 0 ? (
              <Card className="py-12 text-center border-dashed">
                <FileText size={40} className="mx-auto text-fg-tertiary opacity-25 mb-3" />
                <p className="text-body text-fg-tertiary">No upcoming assignments.</p>
              </Card>
            ) : (
              <div className="space-y-3">
                {data.assignments.map(a => (
                  <div key={a.id} className="flex items-center gap-4 p-4 rounded-xl bg-surface border border-border-subtle hover:border-border-default transition-all">
                    <div className="w-10 h-10 rounded-lg bg-info/10 flex items-center justify-center text-info shrink-0">
                      <FileText size={17} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-body font-semibold text-fg-primary truncate">{a.title}</p>
                      <p className="text-caption text-fg-tertiary">Due: {formatDate(a.due_date)}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* My meetings */}
          <div>
            <h2 className="text-h3 text-fg-primary font-semibold mb-5">Meetings</h2>
            {loading ? (
              <div className="space-y-3">
                {[1,2].map(i => <div key={i} className="h-20 rounded-xl bg-surface/50 shimmer" />)}
              </div>
            ) : data.meetings.length === 0 ? (
              <Card className="py-12 text-center border-dashed">
                <Calendar size={40} className="mx-auto text-fg-tertiary opacity-25 mb-3" />
                <p className="text-body text-fg-tertiary">No meetings yet.</p>
              </Card>
            ) : (
              <div className="space-y-3">
                {data.meetings.map(m => (
                  <div key={m.id} className="flex flex-col gap-2 p-4 rounded-xl bg-surface border border-border-subtle">
                    <div className="flex justify-between items-start">
                      <p className="text-body font-semibold text-fg-primary truncate">{m.title || 'Meeting'}</p>
                      <StatusPill status={m.status} />
                    </div>
                    <p className="text-caption text-fg-tertiary">{m.mentor?.full_name ?? 'Mentor'} · {formatDate(m.start_time)}</p>
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
      </div>
    </PageContainer>
  )
}
