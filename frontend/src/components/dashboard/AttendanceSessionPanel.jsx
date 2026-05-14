import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/core/Card';
import { Button } from '@/components/core/Button';
import { Input } from '@/components/core/Input';
import { useAuth } from '@/context/AuthContext';
import { getStudentsForSession, saveAttendanceSession } from '@/lib/dashboard';
import { 
  Check, 
  X, 
  Clock, 
  ArrowLeft, 
  Save, 
  Users, 
  Search,
  CheckCircle2,
  Loader2
} from 'lucide-react';

export function AttendanceSessionPanel({ session, onComplete }) {
  const { user } = useAuth();
  const [stage, setStage] = useState('marking'); // marking, success
  const [searchQuery, setSearchQuery] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isLoadingStudents, setIsLoadingStudents] = useState(false);
  const [students, setStudents] = useState([]);

  useEffect(() => {
    if (session) {
      loadStudents();
    }
  }, [session]);

  const loadStudents = async () => {
    setIsLoadingStudents(true);
    try {
      const data = await getStudentsForSession(user.id, session.branch, session.year);
      setStudents(data.map(s => ({ ...s, status: 'pending' })));
    } catch (err) {
      console.error('Error loading students:', err);
    } finally {
      setIsLoadingStudents(false);
    }
  };

  const finishSession = async () => {
    if (students.some(s => s.status === 'pending')) {
      if (!confirm('Some students are still pending. Mark them as absent?')) return;
    }

    setIsSaving(true);
    try {
      const records = students.map(s => ({
        student_id: s.id,
        session_id: session.id,
        status: s.status === 'pending' ? 'absent' : s.status,
        date: new Date().toISOString().split('T')[0]
      }));

      await saveAttendanceSession(user.id, records);
      setStage('success');
    } catch (err) {
      alert('Error saving attendance: ' + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleStatusChange = (id, status) => {
    setStudents(students.map(s => s.id === id ? { ...s, status } : s));
  };

  const filteredStudents = students.filter(s => 
    s.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
    s.usn?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Card className="min-h-[500px] border-border-subtle bg-surface/30 backdrop-blur-2xl p-0 overflow-hidden shadow-2xl">
      <AnimatePresence mode="wait">
        
        {/* STAGE: MARKING */}
        {stage === 'marking' && (
          <motion.div 
            key="marking"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex flex-col h-[650px]"
          >
            {/* Header */}
            <div className="p-6 border-b border-border-subtle bg-surface/40 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div>
                  <h3 className="text-h3 text-white font-display leading-none">{session?.title || 'Loading Session...'}</h3>
                  <p className="text-micro text-accent-glow uppercase tracking-widest mt-1">
                    {session?.branch}-{session?.year}{session?.section} | Live Marking
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="px-3 py-1.5 rounded-lg bg-surface-raised border border-border-subtle text-white text-micro font-bold flex items-center gap-2">
                  <Users size={14} />
                  {students.filter(s => s.status === 'present' || s.status === 'late').length} / {students.length}
                </div>
                <Button 
                  variant="secondary" 
                  className="h-9 px-4 text-micro" 
                  onClick={finishSession}
                  disabled={isSaving || isLoadingStudents}
                >
                  {isSaving ? <Loader2 className="w-3 h-3 animate-spin mr-2" /> : <Save size={14} className="mr-2" />}
                  FINISH SESSION
                </Button>
              </div>
            </div>

            {/* Search */}
            <div className="px-6 py-4 border-b border-border-subtle bg-surface/20">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-fg-tertiary" size={16} />
                <input 
                  type="text" 
                  placeholder="Search student name or USN..." 
                  className="w-full h-11 pl-11 pr-4 rounded-xl bg-surface-inset border border-border-subtle text-body-sm text-white focus:outline-none focus:border-accent-glow transition-all"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            {/* Student List */}
            <div className="flex-1 overflow-y-auto p-6 space-y-3 custom-scrollbar bg-void/20">
              {isLoadingStudents ? (
                <div className="flex flex-col items-center justify-center h-full gap-4 text-fg-tertiary">
                  <Loader2 className="w-8 h-8 animate-spin text-accent-glow" />
                  <p className="text-label uppercase tracking-widest">Hydrating Student List...</p>
                </div>
              ) : filteredStudents.length > 0 ? (
                filteredStudents.map((student) => (
                  <div 
                    key={student.id} 
                    className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                      student.status === 'present' ? 'bg-success/5 border-success/30' : 
                      student.status === 'absent' ? 'bg-danger/5 border-danger/30' : 
                      student.status === 'late' ? 'bg-info/5 border-info/30' :
                      'bg-surface-raised/40 border-border-subtle'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-sm ${
                        student.status === 'present' ? 'bg-success text-void' : 
                        student.status === 'absent' ? 'bg-danger text-white' : 
                        'bg-surface/50 text-fg-tertiary'
                      }`}>
                        {student.full_name?.[0] || 'S'}
                      </div>
                      <div>
                        <p className="text-body text-white font-semibold">{student.full_name}</p>
                        <p className="text-micro text-fg-tertiary font-mono tracking-wider">{student.usn}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => handleStatusChange(student.id, 'present')}
                        className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-[11px] font-bold tracking-tight transition-all ${
                          student.status === 'present' ? 'bg-success text-void shadow-lg shadow-success/20' : 'bg-surface-inset border border-border-subtle text-fg-tertiary hover:bg-success/20'
                        }`}
                      >
                        <Check size={16} /> PRESENT
                      </button>
                      <button 
                        onClick={() => handleStatusChange(student.id, 'late')}
                        className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-[11px] font-bold tracking-tight transition-all ${
                          student.status === 'late' ? 'bg-info text-void shadow-lg shadow-info/20' : 'bg-surface-inset border border-border-subtle text-fg-tertiary hover:bg-info/20'
                        }`}
                      >
                        <Clock size={16} /> LATE
                      </button>
                      <button 
                        onClick={() => handleStatusChange(student.id, 'absent')}
                        className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-[11px] font-bold tracking-tight transition-all ${
                          student.status === 'absent' ? 'bg-danger text-white shadow-lg shadow-danger/20' : 'bg-surface-inset border border-border-subtle text-fg-tertiary hover:bg-danger/20'
                        }`}
                      >
                        <X size={16} /> ABSENT
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-fg-tertiary opacity-40">
                  <p>No students found in this cohort.</p>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* STAGE: SUCCESS */}
        {stage === 'success' && (
          <motion.div 
            key="success"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center p-12 text-center h-[650px]"
          >
            <div className="w-24 h-24 rounded-full bg-success/10 border border-success/20 flex items-center justify-center text-success mb-8 shadow-[0_0_40px_rgba(34,197,94,0.2)]">
              <CheckCircle2 size={48} />
            </div>
            <h2 className="text-h2 text-white mb-2 font-display tracking-tight">Intelligence Captured</h2>
            <p className="text-body text-fg-secondary mb-10 max-w-sm">
              Attendance for <b>{session?.title}</b> has been locked and synchronized with the student portal.
            </p>
            
            <div className="grid grid-cols-3 gap-6 w-full max-w-md mb-12">
              {[
                { label: 'Present', val: students.filter(s => s.status === 'present').length, color: 'text-success' },
                { label: 'Late', val: students.filter(s => s.status === 'late').length, color: 'text-info' },
                { label: 'Absent', val: students.filter(s => s.status === 'absent').length, color: 'text-danger' },
              ].map((m, i) => (
                <div key={i} className="p-4 rounded-2xl bg-surface/20 border border-border-subtle">
                  <p className="text-micro text-fg-tertiary uppercase tracking-[0.15em] mb-1 font-bold">{m.label}</p>
                  <p className={`text-h2 ${m.color} font-display`}>{m.val}</p>
                </div>
              ))}
            </div>

            <Button className="px-12 h-12 text-void font-bold shadow-focus" onClick={onComplete}>
              DONE
            </Button>
          </motion.div>
        )}

      </AnimatePresence>
    </Card>
  );
}

