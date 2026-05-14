import React from 'react';
import { cn } from '@/lib/utils';

export function StatusPill({ children, status = 'success', className }) {
  const statusStyles = {
    success: 'bg-success-bg text-success border-success-border',
    danger: 'bg-danger-bg text-danger border-danger-border',
    warning: 'bg-warning-bg text-warning border-warning-border',
    info: 'bg-info-bg text-info border-info-border',
    neutral: 'bg-surface-raised text-fg-secondary border-border-default'
  };

  return (
    <span className={cn(
      "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full font-body text-[12px] font-semibold tabular-nums border",
      statusStyles[status],
      className
    )}>
      {children}
    </span>
  );
}
