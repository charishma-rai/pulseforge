import React from 'react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

export function Card({ className, children, hero = false, hoverEffect = true, ...props }) {
  return (
    <motion.div
      whileHover={hoverEffect ? { y: -4, transition: { duration: 0.2, ease: "easeOut" } } : undefined}
      className={cn(
        "relative overflow-hidden bg-surface bg-card-gradient shadow-card border border-border-subtle backdrop-blur-md transition-shadow",
        hoverEffect && "hover:shadow-raised hover:border-border-default",
        hero ? "rounded-2xl p-10" : "rounded-xl p-6 md:p-8",
        className
      )}
      {...props}
    >
      {children}
    </motion.div>
  );
}

export function StatCard({ label, value, icon: Icon, accent = false }) {
  return (
    <Card className={`p-5 flex flex-col ${accent ? 'bg-accent-glow/5 border-accent-glow/30' : 'bg-surface/30'} h-full justify-between gap-4`} hoverEffect={false}>
      <div className="flex justify-between items-start">
        <div className={`p-2 rounded-lg ${accent ? 'bg-accent-glow text-void' : 'bg-surface-raised text-fg-tertiary'}`}>
          {Icon && <Icon size={18} />}
        </div>
      </div>
      <div>
        <h3 className="text-display-sm text-white font-display mb-1 leading-none">{value}</h3>
        <p className="text-label-sm text-fg-tertiary uppercase tracking-wider">{label}</p>
      </div>
    </Card>
  );
}
