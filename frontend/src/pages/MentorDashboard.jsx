import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { OverviewCards } from '@/components/dashboard/OverviewCards';
import { AttendancePulse } from '@/components/dashboard/AttendancePulse';
import { AgendaSection } from '@/components/dashboard/AgendaSection';
import { QuickActions } from '@/components/dashboard/QuickActions';
import RecentActivity from '@/components/dashboard/RecentActivity';
import { useAuth } from '@/context/AuthContext';
import { getMentorStats } from '@/lib/dashboard';

console.info('🛠️ Dashboard Component Registry Loaded');

export default function MentorDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleRefresh = () => setRefreshKey(prev => prev + 1);

  useEffect(() => {
    async function loadData() {
      if (!user?.id) return;
      console.info('📊 Hydrating Mentor Dashboard for:', user.id);
      setIsLoading(true);
      try {
        const data = await getMentorStats(user.id);
        console.info('✅ Dashboard stats retrieved:', data);
        setStats(data);
      } catch (err) {
        console.error('❌ Failed to load dashboard stats:', err);
        setStats({
          studentCount: 0,
          sessionCount: 0,
          avgAttendance: 0,
          pendingVerifications: 0
        });
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, [user?.id, refreshKey]);

  return (
    <div className="max-w-[1400px] mx-auto px-6 py-8">
      {/* Welcome & Header */}
      <DashboardHeader />

      {/* Main Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
        
        {/* Main Content (3/4) */}
        <div className="xl:col-span-3">
          {/* Summary Stats */}
          <OverviewCards stats={stats} isLoading={isLoading} />

          {/* Core Analytics: Attendance Pulse */}
          <section className="mb-12">
            <div className="flex items-center justify-between mb-6 px-2">
              <h2 className="text-h2 text-white font-display">Intelligence Pulse</h2>
              <button 
                onClick={handleRefresh}
                className="text-label-sm text-fg-tertiary hover:text-white transition-colors flex items-center gap-2"
              >
                <div className={isLoading ? "animate-spin" : ""}>↻</div> Refresh Data
              </button>
            </div>
            <AttendancePulse 
              avgAttendance={stats?.avgAttendance} 
              isLoading={isLoading} 
            />
          </section>

          {/* Today's Agenda (Visible on mobile/mid screens here) */}
          <div className="xl:hidden mb-12">
            <AgendaSection refreshKey={refreshKey} />
          </div>
        </div>

        {/* Sidebar (1/4) - Visible on Desktop */}
        <div className="hidden xl:block space-y-12">
          {/* Quick Actions */}
          <section>
            <h3 className="text-micro text-fg-tertiary uppercase tracking-[0.2em] font-bold mb-6 px-2">Quick Commands</h3>
            <QuickActions onUpdate={handleRefresh} />
          </section>

          {/* Agenda Sidebar */}
          <AgendaSection refreshKey={refreshKey} />
          
          {/* Recent Activity Feed */}
          {RecentActivity ? (
            <RecentActivity refreshKey={refreshKey} />
          ) : (
            <div className="p-6 rounded-3xl bg-surface/10 border border-dashed border-border-subtle text-center text-fg-tertiary">
              Activity Feed Loading...
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
