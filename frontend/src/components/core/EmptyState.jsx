import React from 'react';
import { cn } from '@/lib/utils';

export function EmptyState({ icon: Icon, title, description, action, className }) {
  return (
    <div className={cn("flex flex-col items-center justify-center text-center p-12 rounded-xl border border-dashed border-border-default bg-surface/50", className)}>
      {Icon && (
        <div className="h-12 w-12 rounded-full bg-surface-raised flex items-center justify-center text-fg-secondary mb-4">
          <Icon size={24} />
        </div>
      )}
      <h3 className="text-h3 text-fg-primary mb-2">{title}</h3>
      {description && <p className="text-body text-fg-secondary max-w-md mb-6">{description}</p>}
      {action}
    </div>
  );
}
