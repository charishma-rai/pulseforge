import React from 'react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

export const Button = React.forwardRef(({ 
  className, 
  variant = 'primary', 
  size = 'default', 
  asChild = false,
  children,
  ...props 
}, ref) => {
  const Comp = asChild ? motion.div : motion.button;
  
  const variants = {
    primary: "bg-fg-primary text-void hover:bg-[#E5E5E7] hover:shadow-glow",
    secondary: "bg-surface-raised text-fg-primary border border-border-default hover:bg-surface hover:border-border-strong",
    destructive: "bg-surface-raised text-danger border border-danger-border hover:bg-danger-bg",
    ghost: "text-fg-secondary hover:text-fg-primary hover:bg-surface-raised",
    icon: "bg-surface-raised text-fg-secondary hover:text-fg-primary flex items-center justify-center p-0",
  };
  
  const sizes = {
    sm: "h-8 px-3 text-[13px]",
    default: "h-10 px-5 text-[14px]",
    lg: "h-12 px-6 text-[16px]",
    icon: "h-10 w-10",
  };

  return (
    <Comp
      ref={ref}
      whileTap={{ scale: 0.98 }}
      whileHover={{ y: -1 }}
      className={cn(
        "inline-flex items-center justify-center whitespace-nowrap rounded-md font-medium tracking-tight transition-all duration-300 focus-visible:outline-none focus-visible:shadow-focus disabled:pointer-events-none disabled:opacity-50 relative overflow-hidden group",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {variant === 'primary' && (
        <div className="absolute inset-0 -translate-x-[150%] bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:animate-shine" />
      )}
      <span className="relative z-10">{children}</span>
    </Comp>
  );
});
Button.displayName = 'Button';
