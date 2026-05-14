import React, { useState, useEffect } from 'react';
import { PageContainer } from '@/components/layout/PageContainer';
import { StatsStrip } from '@/components/shared/StatsStrip';
import { MeetingCard } from '@/components/features/scheduling/MeetingCard';
import { CreateSessionModal } from '@/components/features/scheduling/CreateSessionModal';
import { Button } from '@/components/core/Button';
import { Modal } from '@/components/core/Modal';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';
import { getSessions } from '@/lib/dashboard';
import { Plus, Calendar as CalendarIcon, Filter, Layers, Clock } from 'lucide-react';
import { Card } from '@/components/core/Card';

export function Scheduling() {
  const { role, user } = useAuth();
  const [sessions, setSessions] = useState([]);
  const [meetings, setMeetings] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadAllData();
    }
  }, [user]);

  const loadAllData = async () => {
    setLoading(true);
    try {
      if (role === 'mentor') {
        const sessionData = await getSessions(user.id);
        setSessions(sessionData);
      }
      // Still fetch meetings for the request system
      const { data: meetingData } = await supabase
        .from('meetings')
        .select(`
          *,
          mentor:profiles!mentor_id(full_name),
          student:profiles!student_id(full_name)
        `)
        .or(`mentor_id.eq.${user.id},student_id.eq.${user.id}`);
      
      setMeetings(meetingData || []);
    } catch (err) {
      console.error('Scheduling load error:', err);
    } finally {
      setLoading(false);
    }
  };

  const stats = [
    { label: 'Total Sessions', value: sessions.length },
    { label: 'Upcoming Meetings', value: meetings.filter(m => m.status === 'accepted').length },
    { label: 'Pending Requests', value: meetings.filter(m => m.status === 'pending').length },
  ];

  return (
    <PageContainer>
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div>
          <h1 className="text-display-lg text-white mb-2">Scheduling</h1>
          <p className="text-body-lg text-fg-secondary">
            {role === 'mentor' 
              ? 'Architect your learning sessions and manage availability.' 
              : 'Book sessions and manage your mentorship appointments.'}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="secondary">
            <Filter size={18} className="mr-2" />
            Filter
          </Button>
          <Button onClick={() => setIsModalOpen(true)}>
            <Plus size={18} className="mr-2" />
            {role === 'mentor' ? 'Create Session' : 'Request Meeting'}
          </Button>
        </div>
      </div>

      <StatsStrip items={stats} className="mb-12" />

      <div className="space-y-12">
        {/* SESSIONS SECTION (Mentor only for now) */}
        {role === 'mentor' && (
          <section>
            <h2 className="text-h3 text-white mb-6 flex items-center gap-2">
              <Layers size={20} className="text-accent-glow" />
              Learning Sessions
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {loading ? (
                [1,2,3].map(i => <div key={i} className="h-48 rounded-2xl bg-surface/50 animate-pulse" />)
              ) : sessions.length > 0 ? (
                sessions.map(session => (
                  <Card key={session.id} className="p-6 border-border-subtle bg-surface/20 group hover:bg-surface/40 transition-all">
                    <div className="flex justify-between items-start mb-4">
                      <div className="p-2 rounded-lg bg-accent-glow/10 text-accent-glow">
                        <Clock size={20} />
                      </div>
                      <div className="px-2 py-1 rounded text-[10px] font-bold bg-surface-raised border border-border-subtle text-fg-tertiary">
                        {session.branch}-{session.year}{session.section}
                      </div>
                    </div>
                    <h4 className="text-body text-white font-medium mb-1">{session.title}</h4>
                    <p className="text-micro text-fg-tertiary uppercase tracking-widest mb-4">{session.subject || 'Academic Session'}</p>
                    
                    <div className="flex items-center justify-between mt-auto pt-4 border-t border-border-subtle/50">
                      <div className="text-micro text-fg-secondary">
                        {new Date(session.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {new Date(session.end_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                      <button className="text-micro text-accent-glow hover:underline">Edit</button>
                    </div>
                  </Card>
                ))
              ) : (
                <div className="col-span-full py-12 text-center bg-surface/10 rounded-2xl border border-dashed border-border-subtle">
                  <p className="text-body-sm text-fg-tertiary">No sessions created yet.</p>
                </div>
              )}
            </div>
          </section>
        )}

        {/* MEETINGS SECTION */}
        <section>
          <h2 className="text-h3 text-white mb-6 flex items-center gap-2">
            <CalendarIcon size={20} className="text-info" />
            Mentorship Meetings
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {loading ? (
              [1,2,3].map(i => <div key={i} className="h-64 rounded-2xl bg-surface/50 animate-pulse" />)
            ) : meetings.length > 0 ? (
              meetings.map(meeting => (
                <MeetingCard 
                  key={meeting.id} 
                  meeting={meeting} 
                  role={role} 
                  onAction={() => loadAllData()} 
                />
              ))
            ) : (
              <div className="col-span-full py-20 text-center bg-surface/30 rounded-3xl border border-dashed border-border-subtle">
                <CalendarIcon size={48} className="mx-auto text-fg-tertiary mb-4 opacity-20" />
                <h3 className="text-h3 text-fg-secondary">No meetings scheduled</h3>
                <p className="text-body text-fg-tertiary max-w-sm mx-auto mt-2">
                  {role === 'mentor' 
                    ? 'Student meeting requests will appear here.' 
                    : 'Browse available mentor slots or send a custom meeting request.'}
                </p>
              </div>
            )}
          </div>
        </section>
      </div>

      <CreateSessionModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        onSuccess={loadAllData}
      />
    </PageContainer>
  );
}

