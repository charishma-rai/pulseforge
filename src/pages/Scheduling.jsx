import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '@/context/AuthContext'
import { supabase } from '@/lib/supabase'
import { PageContainer, PageHeader } from '@/components/layout/PageContainer'
import { Card } from '@/components/core/Card'
import { Button } from '@/components/core/Button'
import { Modal } from '@/components/core/Modal'
import { Input } from '@/components/core/Input'
import { StatusPill } from '@/components/core/StatusPill'
import { formatDate, formatTime } from '@/lib/utils'
import { Plus, Filter, Calendar, Clock, Video, Check, X } from 'lucide-react'

export function Scheduling() {
  const { role, user } = useAuth()
  const [meetings, setMeetings] = useState([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [form, setForm] = useState({ title: '', description: '', start_time: '', end_time: '', meeting_link: '' })

  useEffect(() => { fetchMeetings() }, [user?.id])

  const fetchMeetings = async () => {
    if (!user?.id) return
    setLoading(true)
    try {
      const query = supabase
        .from('meetings')
        .select('*, mentor:profiles!mentor_id(full_name), student:profiles!student_id(full_name)')
        .order('start_time', { ascending: true })

      const { data, error } = role === 'mentor'
        ? await query.eq('mentor_id', user.id)
        : await query.or(`mentor_id.eq.${user.id},student_id.eq.${user.id}`)

      if (!error) setMeetings(data ?? [])
    } catch (err) {
      console.error('[Scheduling]', err)
    } finally {
      setLoading(false)
    }
  }

  const handleCreate = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      const payload = {
        ...form,
        mentor_id: role === 'mentor' ? user.id : undefined,
        student_id: role === 'student' ? user.id : undefined,
        type: role === 'mentor' ? 'slot' : 'request',
        status: 'pending',
      }
      const { error } = await supabase.from('meetings').insert([payload])
      if (!error) {
        setIsModalOpen(false)
        setForm({ title: '', description: '', start_time: '', end_time: '', meeting_link: '' })
        fetchMeetings()
      }
    } catch (err) {
      console.error('[Scheduling] create error:', err)
    } finally {
      setSubmitting(false)
    }
  }

  const stats = [
    { label: 'Upcoming',  value: meetings.filter(m => m.status === 'accepted').length,  color: 'text-success' },
    { label: 'Pending',   value: meetings.filter(m => m.status === 'pending').length,    color: 'text-warning' },
    { label: 'Completed', value: meetings.filter(m => m.status === 'completed').length,  color: 'text-fg-secondary' },
  ]

  return (
    <PageContainer>
      <PageHeader
        title="Scheduling"
        subtitle={role === 'mentor' ? 'Manage your availability and student requests.' : 'Book sessions and manage your mentorship appointments.'}
        actions={
          <>
            <Button variant="secondary" size="sm"><Filter size={15} className="mr-1.5" />Filter</Button>
            <Button size="sm" onClick={() => setIsModalOpen(true)}>
              <Plus size={15} className="mr-1.5" />
              {role === 'mentor' ? 'Create Slot' : 'Request Meeting'}
            </Button>
          </>
        }
      />

      {/* Stats strip */}
      <div className="flex gap-6 mb-10 p-5 rounded-xl bg-surface border border-border-subtle">
        {stats.map(s => (
          <div key={s.label} className="flex items-center gap-3">
            <span className={`text-display-sm tabular-nums font-bold ${s.color}`}>{s.value}</span>
            <span className="text-label text-fg-tertiary uppercase tracking-widest">{s.label}</span>
          </div>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {loading ? (
          [1,2,3].map(i => <div key={i} className="h-52 rounded-2xl bg-surface/50 shimmer" />)
        ) : meetings.length === 0 ? (
          <div className="col-span-full py-20 text-center rounded-2xl border border-dashed border-border-subtle bg-surface/30">
            <Calendar size={48} className="mx-auto text-fg-tertiary opacity-20 mb-4" />
            <h3 className="text-h3 text-fg-secondary mb-2">No sessions scheduled</h3>
            <p className="text-body text-fg-tertiary">
              {role === 'mentor' ? 'Create a slot so students can book time with you.' : 'Browse available slots or request a custom meeting.'}
            </p>
          </div>
        ) : (
          meetings.map((m, i) => (
            <motion.div
              key={m.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              className="p-5 rounded-2xl bg-surface border border-border-subtle hover:border-border-default transition-all group"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-10 h-10 rounded-xl bg-accent-glow/10 flex items-center justify-center text-accent-glow">
                  <Calendar size={18} />
                </div>
                <StatusPill status={m.status} />
              </div>
              <h3 className="text-h3 text-fg-primary mb-1 truncate">{m.title || (m.type === 'slot' ? 'Open Slot' : 'Meeting Request')}</h3>
              <p className="text-caption text-fg-tertiary mb-4 line-clamp-2">{m.description || 'No description provided.'}</p>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-micro text-fg-secondary">
                  <Clock size={12} className="text-fg-tertiary" />
                  {formatDate(m.start_time)} · {formatTime(m.start_time)} – {formatTime(m.end_time)}
                </div>
                {m.meeting_link && (
                  <div className="flex items-center gap-2 text-micro text-accent-glow">
                    <Video size={12} />
                    <a href={m.meeting_link} target="_blank" rel="noopener noreferrer" className="hover:underline truncate">Join Meeting</a>
                  </div>
                )}
                {role === 'mentor' && m.student?.full_name && (
                  <p className="text-micro text-fg-tertiary">Student: {m.student.full_name}</p>
                )}
                {role === 'student' && m.mentor?.full_name && (
                  <p className="text-micro text-fg-tertiary">Mentor: {m.mentor.full_name}</p>
                )}
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Create modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={role === 'mentor' ? 'Create Available Slot' : 'Request a Meeting'}>
        <form onSubmit={handleCreate} className="space-y-5">
          <Input name="title" label="Title" placeholder="e.g. Office Hours" required value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} />
          <div className="space-y-1.5">
            <label className="text-label text-fg-secondary uppercase tracking-wider">Description</label>
            <textarea
              value={form.description}
              onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
              placeholder="What is this meeting about?"
              rows={3}
              className="w-full rounded-md border border-border-default bg-surface-inset px-4 py-3 text-[14px] text-fg-primary placeholder:text-fg-tertiary focus:border-accent-glow/60 focus:outline-none transition-all resize-none"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input name="start_time" type="datetime-local" label="Start Time" required value={form.start_time} onChange={e => setForm(f => ({ ...f, start_time: e.target.value }))} />
            <Input name="end_time" type="datetime-local" label="End Time" required value={form.end_time} onChange={e => setForm(f => ({ ...f, end_time: e.target.value }))} />
          </div>
          <Input name="meeting_link" label="Meeting Link (optional)" placeholder="https://meet.google.com/..." value={form.meeting_link} onChange={e => setForm(f => ({ ...f, meeting_link: e.target.value }))} />
          <div className="flex gap-3 pt-2">
            <Button type="button" variant="secondary" className="flex-1" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="submit" className="flex-1" disabled={submitting}>
              {submitting ? 'Creating…' : 'Create'}
            </Button>
          </div>
        </form>
      </Modal>
    </PageContainer>
  )
}
