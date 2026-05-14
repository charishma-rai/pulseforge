import React, { useState, useEffect } from 'react';
import { PageContainer } from '@/components/layout/PageContainer';
import { Card } from '@/components/core/Card';
import { Button } from '@/components/core/Button';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';
import { getSessions } from '@/lib/dashboard';
import { AttendanceSessionPanel } from '@/components/dashboard/AttendanceSessionPanel';
import { 
  CheckSquare, 
  Clock, 
  Users, 
  ChevronRight, 
  Calendar,
  AlertCircle 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function Attendance() {
  const { user, role } = useAuth();
  const [sessions, setSessions] = useState([]);
  const [studentAttendance, setStudentAttendance] = useState([]);
  const [selectedSession, setSelectedSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadSessions();
    }
  }, [user]);

  const loadSessions = async () => {
    setLoading(true);
    try {
      if (role === 'mentor') {
        const data = await getSessions(user.id);
        setSessions(data);
      } else {
        // Fetch student attendance
        const { data } = await supabase
          .from('attendance')
          .select('*, session:sessions(title, start_time, subject, branch, year)')
          .eq('student_id', user.id)
          .order('date', { ascending: false });
        setStudentAttendance(data || []);
      }
    } catch (err) {
      console.error('Error loading attendance:', err);
    } finally {
      setLoading(false);
    }
  };

  if (role === 'student') {
    return (
      <PageContainer>
        <div className="mb-12">
          <h1 className="text-display-lg text-white mb-2">Attendance History</h1>
          <p className="text-body-lg text-fg-secondary">Track your session presence and analyze trends.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            [1, 2, 3].map(i => <div key={i} className="h-48 rounded-2xl bg-surface/30 animate-pulse" />)
          ) : studentAttendance.length > 0 ? (
            studentAttendance.map(record => (
              <Card key={record.id} className="p-6 border-border-subtle bg-surface/20 transition-all">
                <div className="flex justify-between items-start mb-6">
                  <div className={`p-3 rounded-xl ${record.status === 'present' ? 'bg-success/10 text-success' : record.status === 'late' ? 'bg-warning/10 text-warning' : 'bg-danger/10 text-danger'}`}>
                    <CheckSquare size={24} />
                  </div>
                  <div className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${record.status === 'present' ? 'text-success border border-success/30' : record.status === 'late' ? 'text-warning border border-warning/30' : 'text-danger border border-danger/30'}`}>
                    {record.status}
                  </div>
                </div>
                
                <h3 className="text-h3 text-white mb-1">{record.session?.title}</h3>
                <p className="text-micro text-fg-tertiary uppercase tracking-widest mb-6">{record.session?.subject || 'General Session'}</p>
                
                <div className="flex items-center justify-between mt-auto pt-4 border-t border-border-subtle/50">
                  <div className="flex items-center gap-2 text-micro text-fg-secondary uppercase tracking-widest">
                    <Calendar size={14} />
                    {new Date(record.date).toLocaleDateString()}
                  </div>
                </div>
              </Card>
            ))
          ) : (
            <div className="col-span-full py-20 text-center bg-surface/10 rounded-3xl border border-dashed border-border-subtle">
              <AlertCircle size={48} className="mx-auto text-fg-tertiary mb-4 opacity-20" />
              <h3 className="text-h3 text-fg-secondary">No attendance recorded</h3>
              <p className="text-body text-fg-tertiary max-w-sm mx-auto mt-2">
                Attend your first session to start building your record.
              </p>
            </div>
          )}
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div>
          <h1 className="text-display-lg text-white mb-2">Mark Attendance</h1>
          <p className="text-body-lg text-fg-secondary">Select a scheduled session to begin marking attendance.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="secondary" onClick={loadSessions}>
            <Clock size={18} className="mr-2" />
            Refresh Sessions
          </Button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {!selectedSession ? (
          <motion.div 
            key="list"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {loading ? (
              [1, 2, 3].map(i => <div key={i} className="h-48 rounded-2xl bg-surface/30 animate-pulse" />)
            ) : sessions.length > 0 ? (
              sessions.map(session => (
                <Card 
                  key={session.id} 
                  className="p-6 border-border-subtle bg-surface/20 hover:bg-surface/40 transition-all cursor-pointer group"
                  onClick={() => setSelectedSession(session)}
                >
                  <div className="flex justify-between items-start mb-6">
                    <div className="p-3 rounded-xl bg-accent-glow/10 text-accent-glow group-hover:scale-110 transition-transform">
                      <CheckSquare size={24} />
                    </div>
                    <div className="px-2 py-1 rounded text-[10px] font-bold bg-surface-raised border border-border-subtle text-fg-tertiary">
                      {session.branch}-{session.year}{session.section}
                    </div>
                  </div>
                  
                  <h3 className="text-h3 text-white mb-1 group-hover:text-accent-glow transition-colors">{session.title}</h3>
                  <p className="text-micro text-fg-tertiary uppercase tracking-widest mb-6">{session.subject || 'General Session'}</p>
                  
                  <div className="flex items-center justify-between mt-auto pt-4 border-t border-border-subtle/50">
                    <div className="flex items-center gap-2 text-micro text-fg-secondary uppercase tracking-widest">
                      <Calendar size={14} />
                      {new Date(session.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                    <ChevronRight size={18} className="text-fg-tertiary group-hover:translate-x-1 transition-transform" />
                  </div>
                </Card>
              ))
            ) : (
              <div className="col-span-full py-20 text-center bg-surface/10 rounded-3xl border border-dashed border-border-subtle">
                <AlertCircle size={48} className="mx-auto text-fg-tertiary mb-4 opacity-20" />
                <h3 className="text-h3 text-fg-secondary">No active sessions</h3>
                <p className="text-body text-fg-tertiary max-w-sm mx-auto mt-2">
                  You must create a session in the <b>Scheduling</b> tab before you can mark attendance.
                </p>
                <Button className="mt-8" onClick={() => window.location.href = '/scheduling'}>
                  Go to Scheduling
                </Button>
              </div>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="marking"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="max-w-5xl mx-auto"
          >
            <div className="mb-6">
              <button 
                onClick={() => setSelectedSession(null)}
                className="flex items-center gap-2 text-label text-fg-tertiary hover:text-white transition-colors"
              >
                <ChevronRight size={16} className="rotate-180" />
                Back to Session List
              </button>
            </div>
            <AttendanceSessionPanel 
              session={selectedSession} 
              onComplete={() => {
                setSelectedSession(null);
                loadSessions();
              }} 
            />
          </motion.div>
        )}
      </AnimatePresence>
    </PageContainer>
  );
}
