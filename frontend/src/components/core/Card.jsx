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
