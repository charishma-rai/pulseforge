import React from 'react';
import { Card } from '@/components/core/Card';
import { StatusPill } from '@/components/core/StatusPill';
import { Button } from '@/components/core/Button';
import { Calendar, Clock, User, Video, MoreHorizontal } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

export function MeetingCard({ meeting, role, onAction }) {
  const { 
    title, 
    start_time, 
    end_time, 
    status, 
    type, 
    student, 
    mentor, 
    notes,
    meeting_link 
  } = meeting;

  const isPending = status === 'pending';
  const isAccepted = status === 'accepted';
  
  const startTime = new Date(start_time);
  const endTime = new Date(end_time);

  return (
    <Card className="group relative overflow-visible">
      <div className="flex justify-between items-start mb-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2 mb-1">
            <StatusPill status={
              status === 'accepted' ? 'success' : 
              status === 'pending' ? 'warning' : 
              status === 'rejected' ? 'danger' : 'neutral'
            }>
              {status}
            </StatusPill>
            <span className="text-micro text-fg-tertiary uppercase tracking-widest">{type}</span>
          </div>
          <h4 className="text-h3 text-white font-display">{title || 'General Mentorship'}</h4>
        </div>
        <Button variant="icon" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
          <MoreHorizontal size={16} />
        </Button>
      </div>

      <div className="space-y-3 mb-8">
        <div className="flex items-center gap-3 text-body-sm text-fg-secondary">
          <Calendar size={14} className="text-accent-glow" />
          {format(startTime, 'EEEE, MMM do')}
        </div>
        <div className="flex items-center gap-3 text-body-sm text-fg-secondary">
          <Clock size={14} className="text-accent-glow" />
          {format(startTime, 'hh:mm a')} - {format(endTime, 'hh:mm a')}
        </div>
        <div className="flex items-center gap-3 text-body-sm text-fg-secondary">
          <User size={14} className="text-accent-glow" />
          {role === 'mentor' ? (student?.full_name || 'Open Slot') : mentor?.full_name}
        </div>
      </div>

      {notes && (
        <div className="p-3 rounded-lg bg-surface-inset border border-border-subtle mb-6">
          <p className="text-caption text-fg-tertiary italic">"{notes}"</p>
        </div>
      )}

      <div className="flex gap-2">
        {role === 'mentor' && isPending && type === 'request' && (
          <>
            <Button size="sm" className="flex-1" onClick={() => onAction('accept', meeting.id)}>Approve</Button>
            <Button variant="secondary" size="sm" onClick={() => onAction('reject', meeting.id)}>Reject</Button>
          </>
        )}
        
        {isAccepted && meeting_link && (
          <Button size="sm" className="flex-1 bg-info text-white hover:bg-info/80">
            <Video size={14} className="mr-2" />
            Join Meeting
          </Button>
        )}

        {role === 'student' && isPending && (
          <Button variant="secondary" size="sm" className="flex-1" onClick={() => onAction('reschedule', meeting.id)}>
            Reschedule
          </Button>
        )}
      </div>
    </Card>
  );
}
