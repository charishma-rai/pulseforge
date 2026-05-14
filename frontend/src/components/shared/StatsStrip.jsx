import React from 'react';
import { cn } from '@/lib/utils';
import { AnimatedCounter } from './AnimatedCounter';

export function StatsStrip({ items, className }) {
  return (
    <div className={cn("flex items-center overflow-x-auto hide-scrollbar border-y border-border-subtle py-4 bg-surface/30 backdrop-blur-sm", className)}>
      {items.map((item, index) => (
        <React.Fragment key={index}>
          <div className="flex items-center gap-3 px-6 shrink-0 group">
            {item.icon && <div className="text-fg-secondary group-hover:text-fg-primary group-hover:scale-110 transition-all duration-300">{item.icon}</div>}
            <div className="flex flex-col gap-0.5">
              <span className="text-label text-fg-tertiary uppercase tracking-wider">{item.label}</span>
              <span className="text-body-lg font-semibold text-fg-primary tabular-nums">
                {typeof item.value === 'number' || (typeof item.value === 'string' && item.value.match(/[\d]/)) 
                  ? <AnimatedCounter value={item.value} />
                  : item.value}
              </span>
            </div>
          </div>
          {index < items.length - 1 && (
            <div className="w-[1px] h-8 bg-border-subtle shrink-0" />
          )}
        </React.Fragment>
      ))}
    </div>
  );
}
