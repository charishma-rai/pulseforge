import React, { useState, useEffect } from 'react';
import { PageContainer } from '@/components/layout/PageContainer';
import { Card } from '@/components/core/Card';
import { Button } from '@/components/core/Button';
import { Input } from '@/components/core/Input';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';
import { 
  Search, 
  Filter, 
  UserCheck, 
  UserX, 
  MoreVertical, 
  GraduationCap,
  TrendingUp,
  Mail,
  Loader2,
  ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function Students() {
  const { user } = useAuth();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState({ branch: 'All', year: 'All' });

  useEffect(() => {
    if (user) {
      fetchStudents();
    }
  }, [user, filter]);

  const fetchStudents = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('profiles')
        .select('*')
        .eq('mentor_id', user.id)
        .eq('role', 'student');

      if (filter.branch !== 'All') query = query.eq('branch', filter.branch);
      if (filter.year !== 'All') query = query.eq('year', parseInt(filter.year, 10));

      const { data, error } = await query.order('full_name');

      if (error) throw error;
      setStudents(data);
    } catch (err) {
      console.error('Error fetching students:', err);
    } finally {
      setLoading(false);
    }
  };

  const toggleVerification = async (studentId, currentStatus) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ is_verified: !currentStatus })
        .eq('id', studentId);

      if (error) throw error;
      
      // Log activity
      await supabase.from('activity_logs').insert([{
        mentor_id: user.id,
        event_type: 'student_verified',
        description: `${!currentStatus ? 'Verified' : 'Unverified'} student: ${studentId}`
      }]);

      fetchStudents();
    } catch (err) {
      console.error('Verification toggle failed:', err);
    }
  };

  const filteredStudents = students.filter(s => 
    s.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.usn?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <PageContainer>
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div>
          <h1 className="text-display-lg text-white mb-2">Student Registry</h1>
          <p className="text-body-lg text-fg-secondary">Manage your assigned cohorts and track academic progress.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="secondary" onClick={() => window.location.href = '/upload'}>
            <TrendingUp size={18} className="mr-2" />
            Import Students
          </Button>
        </div>
      </div>

      {/* Filters & Search */}
      <Card className="p-4 mb-8 bg-surface/20 border-border-subtle flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-fg-tertiary" size={18} />
          <input 
            type="text" 
            placeholder="Search name or USN..." 
            className="w-full h-12 pl-12 pr-4 rounded-xl bg-surface-inset border border-border-subtle text-white focus:outline-none focus:border-accent-glow transition-all"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-3">
          <select 
            className="h-12 px-4 rounded-xl bg-surface-inset border border-border-subtle text-white focus:outline-none focus:border-accent-glow appearance-none cursor-pointer min-w-[140px]"
            value={filter.branch}
            onChange={e => setFilter({...filter, branch: e.target.value})}
          >
            <option>All Branches</option>
            <option>Computer Science</option>
            <option>Information Science</option>
            <option>Electronics</option>
          </select>
          <select 
            className="h-12 px-4 rounded-xl bg-surface-inset border border-border-subtle text-white focus:outline-none focus:border-accent-glow appearance-none cursor-pointer min-w-[120px]"
            value={filter.year}
            onChange={e => setFilter({...filter, year: e.target.value})}
          >
            <option>All Years</option>
            <option>1</option>
            <option>2</option>
            <option>3</option>
            <option>4</option>
          </select>
        </div>
      </Card>

      {/* Student Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {loading ? (
          [1,2,3,4,5,6].map(i => <div key={i} className="h-40 rounded-2xl bg-surface/30 animate-pulse" />)
        ) : filteredStudents.length > 0 ? (
          filteredStudents.map((student, idx) => (
            <motion.div
              key={student.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
            >
              <Card className="p-6 border-border-subtle bg-surface/10 hover:bg-surface/30 transition-all group relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4">
                  <button className="text-fg-tertiary hover:text-white transition-colors">
                    <MoreVertical size={18} />
                  </button>
                </div>

                <div className="flex items-center gap-4 mb-6">
                  <div className="w-14 h-14 rounded-2xl bg-surface-raised flex items-center justify-center text-accent-glow font-bold text-xl border border-border-subtle group-hover:scale-110 transition-transform">
                    {student.full_name?.[0]}
                  </div>
                  <div>
                    <h3 className="text-h4 text-white group-hover:text-accent-glow transition-colors">{student.full_name}</h3>
                    <p className="text-micro text-fg-tertiary font-mono tracking-widest">{student.usn}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="p-3 rounded-xl bg-void/30 border border-border-subtle">
                    <p className="text-[10px] text-fg-tertiary uppercase mb-1">Branch</p>
                    <p className="text-body-sm text-white font-medium truncate">{student.branch}</p>
                  </div>
                  <div className="p-3 rounded-xl bg-void/30 border border-border-subtle">
                    <p className="text-[10px] text-fg-tertiary uppercase mb-1">Status</p>
                    <button 
                      onClick={() => toggleVerification(student.id, student.is_verified)}
                      className="flex items-center gap-1.5 hover:opacity-80 transition-opacity"
                    >
                      {student.is_verified ? (
                        <>
                          <UserCheck size={12} className="text-success" />
                          <span className="text-[10px] text-success font-bold">VERIFIED</span>
                        </>
                      ) : (
                        <>
                          <UserX size={12} className="text-danger" />
                          <span className="text-[10px] text-danger font-bold">PENDING</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-border-subtle/50">
                  <div className="flex gap-2">
                    <button className="p-2 rounded-lg bg-surface-raised text-fg-tertiary hover:text-white transition-colors">
                      <Mail size={16} />
                    </button>
                    <button className="p-2 rounded-lg bg-surface-raised text-fg-tertiary hover:text-white transition-colors">
                      <GraduationCap size={16} />
                    </button>
                  </div>
                  <button className="flex items-center gap-1 text-micro text-accent-glow font-bold uppercase tracking-widest hover:underline">
                    View Profile <ChevronRight size={12} />
                  </button>
                </div>
              </Card>
            </motion.div>
          ))
        ) : (
          <div className="col-span-full py-20 text-center bg-surface/10 rounded-3xl border border-dashed border-border-subtle">
            <GraduationCap size={48} className="mx-auto text-fg-tertiary mb-4 opacity-20" />
            <h3 className="text-h3 text-fg-secondary">No students found</h3>
            <p className="text-body text-fg-tertiary max-w-sm mx-auto mt-2">
              Try adjusting your filters or import new students via the CSV upload engine.
            </p>
          </div>
        )}
      </div>
    </PageContainer>
  );
}
