import React, { useState, useEffect } from 'react';
import { Card } from '@/components/core/Card';
import { getRecentActivity } from '@/lib/dashboard';
import { useAuth } from '@/context/AuthContext';
import { 
  Activity, 
  CheckCircle2, 
  FileText, 
  Users, 
  Calendar,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';

export default function RecentActivity({ refreshKey }) {
  const { user } = useAuth();
  const [activities, setActivities] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadActivity();
    }
  }, [user, refreshKey]);

  const loadActivity = async () => {
    setIsLoading(true);
    try {
      const data = await getRecentActivity(user.id);
      setActivities(data);
    } catch (err) {
      console.error('Activity load error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const getIcon = (type) => {
    switch (type) {
      case 'attendance_marked': return CheckCircle2;
      case 'assignment_created': return FileText;
      case 'student_verified': return Users;
      case 'meeting_scheduled': return Calendar;
      case 'csv_uploaded': return Activity;
      default: return Activity;
    }
  };

  const getColor = (type) => {
    switch (type) {
      case 'attendance_marked': return 'text-success';
      case 'assignment_created': return 'text-warning';
      case 'student_verified': return 'text-info';
      case 'meeting_scheduled': return 'text-accent-glow';
      default: return 'text-fg-tertiary';
    }
  };

  return (
    <section className="p-6 rounded-3xl bg-surface/10 border border-border-subtle/30 h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-micro text-fg-tertiary uppercase tracking-widest font-bold">Live Pulse Feed</h3>
        <Activity size={14} className="text-fg-tertiary opacity-40" />
      </div>

      <div className="space-y-6 flex-1 overflow-y-auto">
        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div key="loading" className="space-y-6">
              {[1, 2, 3].map(i => (
                <div key={i} className="flex gap-4 animate-pulse">
                  <div className="w-2 h-2 rounded-full bg-surface-raised mt-1.5" />
                  <div className="space-y-2 flex-1">
                    <div className="h-3 bg-surface-raised rounded w-3/4" />
                    <div className="h-2 bg-surface-raised rounded w-1/4" />
                  </div>
                </div>
              ))}
            </motion.div>
          ) : activities.length > 0 ? (
            activities.map((log, idx) => {
              const Icon = getIcon(log.event_type);
              const colorClass = getColor(log.event_type);
              
              return (
                <motion.div 
                  key={log.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="flex gap-4 group"
                >
                  <div className={`mt-1.5 w-1.5 h-1.5 rounded-full ${colorClass} bg-current flex-shrink-0 relative`}>
                    <div className={`absolute inset-0 rounded-full ${colorClass} bg-current animate-ping opacity-20`} />
                  </div>
                  <div className="space-y-1 min-w-0">
                    <p className="text-body-sm text-fg-secondary leading-snug group-hover:text-white transition-colors">
                      {log.description}
                    </p>
                    <p className="text-[10px] text-fg-tertiary uppercase font-mono tracking-wider">
                      {formatDistanceToNow(new Date(log.created_at), { addSuffix: true })}
                    </p>
                  </div>
                </motion.div>
              );
            })
          ) : (
            <motion.div 
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="h-full flex flex-col items-center justify-center py-8 text-center"
            >
              <AlertCircle size={24} className="text-fg-tertiary mb-3 opacity-20" />
              <p className="text-body-sm text-fg-tertiary italic">No recent activity detected.</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
