import React, { useState, useEffect } from 'react';
import { Card } from '@/components/core/Card';
import { getTodayAgenda } from '@/lib/dashboard';
import { useAuth } from '@/context/AuthContext';
import { 
  Calendar, 
  Clock, 
  Video, 
  BookOpen, 
  CheckSquare, 
  ChevronRight,
  Plus,
  Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function AgendaSection({ refreshKey }) {
  const { user } = useAuth();
  const [agenda, setAgenda] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadAgenda();
    }
  }, [user, refreshKey]);

  const loadAgenda = async () => {
    setIsLoading(true);
    try {
      const data = await getTodayAgenda(user.id);
      setAgenda(data);
    } catch (err) {
      console.error('Agenda load error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const getIcon = (type) => {
    switch (type) {
      case 'session': return CheckSquare;
      case 'meeting': return Video;
      case 'assignment': return BookOpen;
      default: return Calendar;
    }
  };

  const getColor = (type) => {
    switch (type) {
      case 'session': return 'text-accent-glow bg-accent-glow/10';
      case 'meeting': return 'text-info bg-info/10';
      case 'assignment': return 'text-warning bg-warning/10';
      default: return 'text-fg-tertiary bg-surface/50';
    }
  };

  return (
    <section>
      <div className="flex items-center justify-between mb-6 px-2">
        <h3 className="text-micro text-fg-tertiary uppercase tracking-[0.2em] font-bold">Today's Agenda</h3>
        {!isLoading && agenda.length > 0 && (
          <span className="px-2 py-1 rounded text-[10px] font-bold bg-accent-glow/10 text-accent-glow border border-accent-glow/20">
            {agenda.length} EVENTS
          </span>
        )}
      </div>

      <div className="space-y-3">
        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div key="loading" className="space-y-3">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-20 rounded-2xl bg-surface/10 animate-pulse border border-border-subtle/30" />
              ))}
            </motion.div>
          ) : agenda.length > 0 ? (
            agenda.map((item, idx) => {
              const Icon = getIcon(item.type);
              const colorClass = getColor(item.type);
              const time = new Date(item.start_time || item.due_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                >
                  <Card className="p-4 bg-surface/10 border-border-subtle/30 hover:bg-surface/20 hover:border-accent-glow/30 transition-all cursor-pointer group">
                    <div className="flex items-center gap-4">
                      <div className={`p-3 rounded-xl ${colorClass} group-hover:scale-110 transition-transform`}>
                        <Icon size={18} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-body-sm font-medium text-white truncate group-hover:text-accent-glow transition-colors">
                          {item.title}
                        </h4>
                        <div className="flex items-center gap-3 mt-1">
                          <span className="text-[10px] text-fg-tertiary uppercase tracking-wider flex items-center gap-1">
                            <Clock size={10} />
                            {item.type === 'assignment' ? 'Due ' : ''}{time}
                          </span>
                          <span className="text-[10px] text-fg-tertiary uppercase tracking-wider">
                            • {item.branch || 'General'}
                          </span>
                        </div>
                      </div>
                      <ChevronRight size={14} className="text-fg-tertiary opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                    </div>
                  </Card>
                </motion.div>
              );
            })
          ) : (
            <motion.div 
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="py-12 px-6 text-center rounded-3xl bg-surface/5 border border-dashed border-border-subtle"
            >
              <Calendar size={32} className="mx-auto text-fg-tertiary mb-3 opacity-20" />
              <p className="text-body-sm text-fg-tertiary italic">No upcoming events today.</p>
              <button 
                onClick={() => window.location.href = '/scheduling'}
                className="mt-4 text-[10px] font-bold text-accent-glow uppercase tracking-widest hover:underline flex items-center justify-center gap-1 mx-auto"
              >
                <Plus size={10} /> Add Session
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
