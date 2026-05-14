import React from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { Calendar } from 'lucide-react';
import { NotificationBell } from './NotificationBell';

export function DashboardHeader() {
  const { profile } = useAuth();
  const firstName = profile?.full_name?.split(' ')[0] || 'Mentor';
  const today = new Date().toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-display-sm md:text-display-md text-white font-display tracking-tight mb-2">
          Welcome back, <span className="text-accent-glow underline decoration-accent-glow/30 underline-offset-8">{firstName}</span>
        </h1>
        <div className="flex items-center gap-3 text-fg-tertiary">
          <Calendar size={16} className="text-accent-glow/60" />
          <span className="text-label tracking-wide uppercase">{today}</span>
          <span className="w-1 h-1 rounded-full bg-border-default mx-1" />
          <span className="text-body-sm italic">"Intelligence is the ability to adapt to change."</span>
        </div>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex items-center gap-4"
      >
        <NotificationBell />
        
        <div className="flex items-center gap-4 p-1.5 pr-4 rounded-2xl bg-surface/40 border border-border-subtle">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-accent-glow to-info flex items-center justify-center text-void font-bold shadow-sm">
            {firstName[0] || 'M'}
          </div>
          <div className="hidden sm:block">
            <p className="text-label-sm text-white font-medium">{profile?.full_name || 'Pulse Mentor'}</p>
            <p className="text-[10px] text-fg-tertiary uppercase tracking-widest">{profile?.department || 'Academic Dept'}</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
