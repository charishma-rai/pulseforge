import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { AmbientBackground } from '@/components/layout/AmbientBackground';
import { Button } from '@/components/core/Button';
import { Sparkles, ArrowRight } from 'lucide-react';

export function Landing() {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen w-full bg-void flex flex-col items-center justify-center overflow-hidden font-body">
      <AmbientBackground />
      
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 text-center px-6 max-w-5xl"
      >
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
          className="flex items-center justify-center gap-3 mb-10"
        >
          <div className="px-4 py-1.5 rounded-full bg-accent-glow/10 border border-accent-glow/20 flex items-center gap-2 backdrop-blur-md">
            <Sparkles size={14} className="text-accent-glow" />
            <span className="text-[10px] font-bold text-accent-glow uppercase tracking-[0.2em]">PulseForge Platform v2.0</span>
          </div>
        </motion.div>

        <h1 className="text-display-hero text-white mb-8 leading-[0.9] tracking-tighter">
          The operating system for <br />
          <span className="text-fg-tertiary">learning intelligence.</span>
        </h1>
        
        <p className="text-body-lg text-fg-secondary mb-12 max-w-2xl mx-auto leading-relaxed">
          PulseForge combines attendance intelligence, mentor collaboration, and 
          predictive analytics into a single cinematic interface for modern education.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
          <Button 
            size="lg" 
            className="w-full sm:w-auto h-14 px-10 text-base font-bold shadow-focus group" 
            onClick={() => navigate('/signup')}
          >
            Get Started
            <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
          <Button 
            variant="secondary" 
            size="lg" 
            className="w-full sm:w-auto h-14 px-10 text-base font-bold" 
            onClick={() => navigate('/login')}
          >
            Sign In
          </Button>
        </div>
      </motion.div>
      
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
        className="absolute bottom-12 left-1/2 -translate-x-1/2 flex items-center gap-8 text-micro text-fg-tertiary uppercase tracking-[0.3em]"
      >
        <span>Attendance</span>
        <div className="w-1 h-1 rounded-full bg-border-strong" />
        <span>Mentorship</span>
        <div className="w-1 h-1 rounded-full bg-border-strong" />
        <span>Analytics</span>
      </motion.div>
    </div>
  );
}
