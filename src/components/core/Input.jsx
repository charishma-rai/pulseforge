import React from 'react'
import { cn } from '@/lib/utils'

export const Input = React.forwardRef(function Input(
  { className, type = 'text', label, error, icon: Icon, ...props },
  ref
) {
  return (
    <div className="w-full space-y-1.5 group">
      {label && (
        <label className="block text-label text-fg-tertiary group-focus-within:text-accent-glow transition-colors uppercase tracking-wider">
          {label}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-fg-tertiary group-focus-within:text-accent-glow transition-colors pointer-events-none">
            <Icon size={15} />
          </div>
        )}
        <input
          ref={ref}
          type={type}
          className={cn(
            'flex h-11 w-full rounded-md',
            'border border-border-default bg-surface-inset',
            'px-4 py-3 text-[14px] text-fg-primary',
            'placeholder:text-fg-tertiary',
            'focus:border-accent-glow/60 focus:shadow-focus focus:outline-none',
            'transition-all duration-200',
            'disabled:cursor-not-allowed disabled:opacity-50',
            Icon && 'pl-10',
            error && 'border-danger-border focus:border-danger-border focus:shadow-none',
            className
          )}
          {...props}
        />
        {/* Focus glow bar */}
        <div className="absolute bottom-0 left-2 right-2 h-px bg-accent-glow scale-x-0 group-focus-within:scale-x-100 transition-transform duration-300 origin-left rounded-full pointer-events-none" />
      </div>
      {error && <p className="text-micro text-danger mt-1">{error}</p>}
    </div>
  )
})
Input.displayName = 'Input'
