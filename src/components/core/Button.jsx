import React from 'react'
import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'

const variants = {
  primary:     'bg-fg-primary text-void hover:bg-[#E5E5E7] hover:shadow-glow',
  secondary:   'bg-surface-raised text-fg-primary border border-border-default hover:bg-surface hover:border-border-strong',
  destructive: 'bg-surface-raised text-danger border border-danger-border hover:bg-danger-bg',
  ghost:       'text-fg-secondary hover:text-fg-primary hover:bg-surface-raised',
  accent:      'bg-accent-glow text-white hover:bg-indigo-500 shadow-glow',
}

const sizes = {
  sm:      'h-8 px-3 text-[13px] rounded-md',
  default: 'h-10 px-5 text-[14px] rounded-md',
  lg:      'h-12 px-7 text-[15px] rounded-lg',
  xl:      'h-14 px-10 text-base  rounded-xl',
  icon:    'h-10 w-10 rounded-md flex items-center justify-center p-0',
}

export const Button = React.forwardRef(function Button(
  { className, variant = 'primary', size = 'default', children, disabled, ...props },
  ref
) {
  return (
    <motion.button
      ref={ref}
      whileTap={{ scale: 0.97 }}
      whileHover={disabled ? {} : { y: -1 }}
      disabled={disabled}
      className={cn(
        'inline-flex items-center justify-center whitespace-nowrap font-semibold tracking-tight',
        'transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-glow/50',
        'disabled:pointer-events-none disabled:opacity-40',
        'relative overflow-hidden group',
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {variant === 'primary' && (
        <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/15 to-transparent group-hover:animate-shine pointer-events-none" />
      )}
      <span className="relative z-10 flex items-center gap-2">{children}</span>
    </motion.button>
  )
})
Button.displayName = 'Button'
