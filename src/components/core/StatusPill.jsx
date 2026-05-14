import React from 'react'
import { cn } from '@/lib/utils'

const statusMap = {
  pending:     { label: 'Pending',    cls: 'bg-warning-bg text-warning border border-warning/30' },
  accepted:    { label: 'Accepted',   cls: 'bg-success-bg text-success border border-success/30' },
  completed:   { label: 'Completed',  cls: 'bg-surface-raised text-fg-secondary border border-border-subtle' },
  rejected:    { label: 'Rejected',   cls: 'bg-danger-bg text-danger border border-danger/30' },
  rescheduled: { label: 'Rescheduled',cls: 'bg-info-bg text-info border border-info/30' },
  mentor:      { label: 'Mentor',     cls: 'bg-accent-glow/15 text-accent-glow border border-accent-glow/30' },
  student:     { label: 'Student',    cls: 'bg-info-bg text-info border border-info/30' },
  active:      { label: 'Active',     cls: 'bg-success-bg text-success border border-success/30' },
  inactive:    { label: 'Inactive',   cls: 'bg-surface-raised text-fg-tertiary border border-border-subtle' },
}

export function StatusPill({ status, className }) {
  const config = statusMap[status] ?? { label: status, cls: 'bg-surface-raised text-fg-secondary border border-border-subtle' }
  return (
    <span className={cn(
      'inline-flex items-center px-2.5 py-0.5 rounded-full text-micro font-bold uppercase tracking-widest',
      config.cls,
      className
    )}>
      {config.label}
    </span>
  )
}
