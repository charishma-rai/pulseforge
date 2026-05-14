import React from 'react';
import { cn } from '@/lib/utils';

export function PageContainer({ children, className }) {
  return (
    <div className={cn("w-full max-w-[1440px] mx-auto px-6 md:px-8 lg:px-12 pt-8 pb-24", className)}>
      {children}
    </div>
  );
}
