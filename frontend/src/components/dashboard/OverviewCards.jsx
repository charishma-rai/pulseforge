import React from 'react';
import { motion } from 'framer-motion';
import { Users, BookOpen, Activity, AlertCircle } from 'lucide-react';
import { Card } from '@/components/core/Card';

const stats = [
  { 
    label: 'Total Sessions', 
    value: '42', 
    change: '+3 this week', 
    icon: BookOpen, 
    color: 'text-accent-glow',
    bg: 'bg-accent-glow/10'
  },
  { 
    label: 'Avg Attendance', 
    value: '87%', 
    change: '-2% from last month', 
    icon: Activity, 
    color: 'text-info',
    bg: 'bg-info/10'
  },
  { 
    label: 'Active Students', 
    value: '64', 
    change: '2 pending verification', 
    icon: Users, 
    color: 'text-success',
    bg: 'bg-success/10'
  },
  { 
    label: 'Pending Tasks', 
    value: '08', 
    change: 'Requires attention', 
    icon: AlertCircle, 
    color: 'text-danger',
    bg: 'bg-danger/10'
  },
];

export function OverviewCards({ stats, isLoading }) {
  const displayStats = [
    { 
      label: 'Academic Sessions', 
      value: stats?.sessionCount ?? '0', 
      change: 'Lifetime Sync', 
      icon: BookOpen, 
      color: 'text-accent-glow',
      bg: 'bg-accent-glow/10'
    },
    { 
      label: 'Avg Attendance', 
      value: `${stats?.avgAttendance ?? 0}%`, 
      change: 'Cohort Performance', 
      icon: Activity, 
      color: 'text-info',
      bg: 'bg-info/10'
    },
    { 
      label: 'Active Students', 
      value: stats?.studentCount ?? '0', 
      change: 'Assigned to you', 
      icon: Users, 
      color: 'text-success',
      bg: 'bg-success/10'
    },
    { 
      label: 'Active Assignments', 
      value: stats?.assignmentCount ?? '0', 
      change: 'In circulation', 
      icon: AlertCircle, 
      color: 'text-warning',
      bg: 'bg-warning/10'
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
      {displayStats.map((stat, idx) => (
        <motion.div
          key={idx}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: idx * 0.1 }}
        >
          <Card className="p-6 h-full border-border-subtle bg-surface/30 backdrop-blur-md hover:bg-surface/50 transition-all group">
            {isLoading ? (
              <div className="animate-pulse space-y-4">
                <div className="w-12 h-12 bg-surface-raised rounded-xl" />
                <div className="space-y-2">
                  <div className="h-4 bg-surface-raised rounded w-20" />
                  <div className="h-8 bg-surface-raised rounded w-16" />
                </div>
              </div>
            ) : (
              <>
                <div className="flex justify-between items-start mb-4">
                  <div className={`p-3 rounded-xl ${stat.bg} ${stat.color} group-hover:scale-110 transition-transform`}>
                    <stat.icon size={24} />
                  </div>
                </div>
                <div>
                  <p className="text-label text-fg-tertiary uppercase tracking-wider mb-1">{stat.label}</p>
                  <h3 className="text-display-sm text-white font-display mb-1">{stat.value}</h3>
                  <p className={`text-micro font-medium ${stat.color} opacity-80`}>{stat.change}</p>
                </div>
              </>
            )}
          </Card>
        </motion.div>
      ))}
    </div>
  );
}

