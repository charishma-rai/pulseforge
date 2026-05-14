import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
import { Bell, Info, CheckCircle2, AlertTriangle, AlertCircle, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

export function NotificationBell() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      fetchNotifications();
      // Subscribe to real-time notifications
      const channel = supabase
        .channel('schema-db-changes')
        .on('postgres_changes', { 
          event: 'INSERT', 
          schema: 'public', 
          table: 'notifications',
          filter: `user_id=eq.${user.id}`
        }, (payload) => {
          setNotifications(prev => [payload.new, ...prev]);
        })
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [user]);

  const fetchNotifications = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(10);
    setNotifications(data || []);
    setLoading(false);
  };

  const markAllAsRead = async () => {
    await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('user_id', user.id);
    setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
  };

  const unreadCount = notifications.filter(n => !n.is_read).length;

  const getIcon = (type) => {
    switch (type) {
      case 'success': return CheckCircle2;
      case 'warning': return AlertTriangle;
      case 'danger': return AlertCircle;
      default: return Info;
    }
  };

  const getColor = (type) => {
    switch (type) {
      case 'success': return 'text-success';
      case 'warning': return 'text-warning';
      case 'danger': return 'text-danger';
      default: return 'text-info';
    }
  };

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-xl hover:bg-surface/50 transition-colors group"
      >
        <Bell size={20} className={cn("text-fg-tertiary group-hover:text-white transition-colors", unreadCount > 0 && "text-accent-glow")} />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 w-4 h-4 bg-accent-glow text-void text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-void">
            {unreadCount}
          </span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="absolute right-0 mt-3 w-80 max-h-[480px] bg-surface-raised border border-border-subtle rounded-3xl shadow-2xl z-50 overflow-hidden flex flex-col"
            >
              <div className="p-5 border-b border-border-subtle flex justify-between items-center bg-surface/50">
                <h4 className="text-body font-bold text-white">Notifications</h4>
                {unreadCount > 0 && (
                  <button onClick={markAllAsRead} className="text-micro text-accent-glow hover:underline uppercase font-bold tracking-widest">
                    Mark Read
                  </button>
                )}
              </div>

              <div className="flex-1 overflow-y-auto custom-scrollbar">
                {loading ? (
                  <div className="p-10 flex flex-col items-center justify-center gap-3">
                    <Loader2 className="animate-spin text-accent-glow" />
                    <span className="text-micro text-fg-tertiary uppercase">Syncing Alerts...</span>
                  </div>
                ) : notifications.length > 0 ? (
                  notifications.map((n, i) => {
                    const Icon = getIcon(n.type);
                    const color = getColor(n.type);
                    return (
                      <div 
                        key={n.id} 
                        className={cn(
                          "p-4 border-b border-border-subtle/50 hover:bg-surface/40 transition-colors flex gap-4",
                          !n.is_read && "bg-accent-glow/5"
                        )}
                      >
                        <div className={cn("p-2 rounded-lg bg-surface flex-shrink-0 h-fit", color)}>
                          <Icon size={16} />
                        </div>
                        <div className="space-y-1">
                          <p className="text-body-sm font-medium text-white leading-tight">{n.title}</p>
                          <p className="text-caption text-fg-secondary leading-normal">{n.message}</p>
                          <p className="text-micro text-fg-tertiary uppercase font-mono mt-2">Just Now</p>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="p-12 text-center">
                    <Bell size={32} className="mx-auto text-fg-tertiary mb-3 opacity-20" />
                    <p className="text-body-sm text-fg-tertiary italic">No notifications yet.</p>
                  </div>
                )}
              </div>

              <button className="p-4 text-micro text-center text-fg-tertiary uppercase font-bold tracking-widest hover:bg-surface/50 transition-colors border-t border-border-subtle">
                View All Notifications
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
