import React from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/core/Card';
import { UserX, CheckCircle2, Clock, Loader2 } from 'lucide-react';

export function AttendancePulse({ avgAttendance, isLoading }) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10 animate-pulse">
        <Card className="lg:col-span-2 p-8 border-border-subtle bg-surface/30 flex flex-col items-center justify-center min-h-[300px]">
          <Loader2 className="w-10 h-10 text-accent-glow animate-spin mb-4" />
          <p className="text-label uppercase tracking-widest text-fg-tertiary">Analyzing Pulse Analytics...</p>
        </Card>
        <Card className="p-6 border-border-subtle bg-surface/30" />
      </div>
    );
  }

  const percent = avgAttendance ?? 0;
  const hasData = percent > 0;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
      {/* Attendance Summary */}
      <Card className="lg:col-span-2 p-8 border-border-subtle bg-surface/30">
        {!hasData ? (
          <div className="h-full flex flex-col items-center justify-center py-10 text-center">
            <Clock size={40} className="text-fg-tertiary opacity-20 mb-4" />
            <h3 className="text-h3 text-white mb-2">Aggregate Pulse Inactive</h3>
            <p className="text-body-sm text-fg-tertiary max-w-sm">
              Start marking attendance in your scheduled sessions to generate real-time analytics.
            </p>
          </div>
        ) : (
          <div className="flex flex-col md:flex-row gap-10 items-center">
            {/* Circular Progress */}
            <div className="relative w-48 h-48 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90">
                <circle
                  cx="96"
                  cy="96"
                  r="88"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="12"
                  className="text-surface-raised"
                />
                <motion.circle
                  cx="96"
                  cy="96"
                  r="88"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="12"
                  strokeDasharray={552.92}
                  initial={{ strokeDashoffset: 552.92 }}
                  animate={{ strokeDashoffset: 552.92 * (1 - percent / 100) }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                  className="text-accent-glow"
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-display-md text-white font-display leading-none">{percent}%</span>
                <span className="text-micro text-fg-tertiary uppercase mt-2">Avg Pulse</span>
              </div>
            </div>

            <div className="flex-1 w-full">
              <div className="flex justify-between items-end mb-6">
                <div>
                  <h3 className="text-h3 text-white mb-1">Performance Pulse</h3>
                  <p className="text-body text-fg-secondary">Cohort Average Attendance</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-micro text-fg-secondary uppercase tracking-widest">
                    <span>Aggregate Presence</span>
                    <span>{percent}%</span>
                  </div>
                  <div className="h-2 w-full bg-surface-raised rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${percent}%` }}
                      className="h-full bg-accent-glow"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </Card>

      {/* Real Activity List (Placeholder for real data mapping) */}
      <Card className="p-6 border-border-subtle bg-surface/30">
        <div className="flex items-center gap-2 mb-6 text-accent-glow">
          <CheckCircle2 size={18} />
          <h3 className="text-label uppercase tracking-widest font-semibold">Attendance Health</h3>
        </div>
        <div className="flex flex-col items-center justify-center h-[200px] text-center border border-dashed border-border-subtle rounded-2xl bg-void/20">
          <p className="text-micro text-fg-tertiary uppercase tracking-widest px-6 leading-relaxed">
            No attendance <br />insights available <br />yet.
          </p>
        </div>
      </Card>
    </div>
  );
}
