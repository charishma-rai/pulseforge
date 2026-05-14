import React from 'react'
import { cn } from '@/lib/utils'

export function PageContainer({ children, className }) {
  return (
    <div className={cn('px-8 py-10 max-w-7xl mx-auto', className)}>
      {children}
    </div>
  )
}

export function PageHeader({ title, subtitle, actions, className }) {
  return (
    <div className={cn('flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10', className)}>
      <div>
        <h1 className="text-display-md text-white leading-tight tracking-tight">{title}</h1>
        {subtitle && <p className="text-body-lg text-fg-secondary mt-2 max-w-xl">{subtitle}</p>}
      </div>
      {actions && <div className="flex items-center gap-3 shrink-0">{actions}</div>}
    </div>
  )
}
