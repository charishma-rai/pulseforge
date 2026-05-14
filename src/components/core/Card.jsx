import React from 'react'
import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'

export function Card({ className, children, hero = false, hoverEffect = true, glass = false, ...props }) {
  return (
    <motion.div
      whileHover={hoverEffect ? { y: -3, transition: { duration: 0.2, ease: 'easeOut' } } : undefined}
      className={cn(
        'relative overflow-hidden',
        'bg-surface bg-card-gradient',
        'border border-border-subtle shadow-card',
        'transition-shadow duration-300',
        hoverEffect && 'hover:shadow-raised hover:border-border-default',
        glass && 'glass-card',
        hero ? 'rounded-2xl p-8 md:p-10' : 'rounded-xl p-6',
        className
      )}
      {...props}
    >
      {/* Top shine line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/8 to-transparent pointer-events-none" />
      {children}
    </motion.div>
  )
}

export function StatCard({ label, value, delta, icon: Icon, accent = false, className }) {
  return (
    <Card className={cn('flex flex-col gap-3', className)} hoverEffect>
      <div className="flex items-center justify-between">
        <p className="text-label text-fg-tertiary uppercase tracking-widest">{label}</p>
        {Icon && (
          <div className={cn(
            'w-8 h-8 rounded-lg flex items-center justify-center',
            accent ? 'bg-accent-glow/15 text-accent-glow' : 'bg-surface-raised text-fg-tertiary'
          )}>
            <Icon size={15} />
          </div>
        )}
      </div>
      <p className="text-display-sm text-fg-primary tabular-nums leading-none">{value}</p>
      {delta !== undefined && (
        <p className={cn('text-micro', delta >= 0 ? 'text-success' : 'text-danger')}>
          {delta >= 0 ? '↑' : '↓'} {Math.abs(delta)}% vs last week
        </p>
      )}
    </Card>
  )
}
