import React from 'react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

export const Input = React.forwardRef(({ className, type, label, error, ...props }, ref) => {
  return (
    <div className="w-full space-y-2 group">
      {label && (
        <label className="block text-label text-fg-tertiary group-focus-within:text-accent-glow transition-colors uppercase tracking-wider">
          {label}
        </label>
      )}
      <div className="relative">
        <input
          type={type}
          className={cn(
            "flex h-11 w-full rounded-md border border-border-default bg-surface-inset px-4 py-3 text-[14px] text-fg-primary placeholder:text-fg-tertiary focus:border-accent-glow/50 focus:shadow-focus focus:outline-none transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-50",
            error && "border-danger-border focus:border-danger-border focus:shadow-none",
            className
          )}
          ref={ref}
          {...props}
        />
        {/* Subtle bottom glow line on focus */}
        <motion.div 
          initial={{ scaleX: 0 }}
          whileFocus={{ scaleX: 1 }}
          className="absolute bottom-0 left-0 right-0 h-[1px] bg-accent-glow origin-left pointer-events-none"
        />
      </div>
      {error && <p className="text-micro text-danger">{error}</p>}
    </div>
  );
});
Input.displayName = "Input";
