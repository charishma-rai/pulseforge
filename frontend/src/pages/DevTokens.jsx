import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/core/Card';
import { Button } from '@/components/core/Button';
import { Input } from '@/components/core/Input';
import { StatusPill } from '@/components/core/StatusPill';
import { Modal } from '@/components/core/Modal';
import { Skeleton } from '@/components/core/LoadingSkeleton';
import { EmptyState } from '@/components/core/EmptyState';
import { StatsStrip } from '@/components/shared/StatsStrip';
import { PageContainer } from '@/components/layout/PageContainer';
import { AnimatedCounter } from '@/components/shared/AnimatedCounter';
import { LayoutDashboard, AlertCircle, ArrowUpRight, ShieldCheck, Zap, Sparkles } from 'lucide-react';

export function DevTokens() {
  const [modalOpen, setModalOpen] = useState(false);

  const statItems = [
    { label: 'Total Sessions', value: 42 },
    { label: 'Overall Attendance', value: '86.4%', icon: <ArrowUpRight className="text-success" size={18} /> },
    { label: 'Active Students', value: 24 },
    { label: 'Last Session', value: 'Oct 24' },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <PageContainer>
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-20"
      >
        {/* Cinematic Hero Section */}
        <section className="relative pt-12 pb-8 overflow-hidden">
          <motion.div variants={itemVariants} className="relative z-10">
            <div className="flex items-center gap-3 mb-6">
              <div className="px-3 py-1 rounded-full bg-accent-glow/10 border border-accent-glow/20 flex items-center gap-2">
                <Sparkles size={14} className="text-accent-glow" />
                <span className="text-micro font-bold text-accent-glow uppercase tracking-widest">v2.0 Design Language</span>
              </div>
            </div>
            <h1 className="text-display-hero text-white mb-6 max-w-4xl leading-[0.95]">
              Living Intelligence <br />
              <span className="text-fg-tertiary">Interface.</span>
            </h1>
            <p className="text-body-lg text-fg-secondary max-w-2xl leading-relaxed">
              PulseForge leverages cinematic storytelling and spatial interactions to transform 
              fragmented attendance data into actionable learning intelligence.
            </p>
          </motion.div>
        </section>

        {/* Dynamic Metric Ticker */}
        <motion.section variants={itemVariants}>
          <h2 className="text-label text-fg-tertiary mb-6 uppercase tracking-[0.2em] flex items-center gap-2">
            <Zap size={14} className="text-warning" />
            Real-time Metrics
          </h2>
          <StatsStrip items={statItems} />
        </motion.section>

        {/* Component Showcase */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
          {/* Typography & Status */}
          <motion.section variants={itemVariants} className="space-y-12">
            <div>
              <h2 className="text-label text-fg-tertiary mb-8 uppercase tracking-[0.2em]">Typography Architecture</h2>
              <div className="space-y-8">
                <div className="flex items-baseline gap-4">
                  <span className="text-display-md text-white tabular-nums"><AnimatedCounter value={98.2} />%</span>
                  <span className="text-label text-fg-tertiary uppercase tracking-widest">Engagement Rate</span>
                </div>
                <div className="space-y-4">
                  <h3 className="text-h1 text-white">Refined Hierarchy</h3>
                  <p className="text-body text-fg-secondary leading-relaxed">
                    Cinematic interfaces rely on extreme contrast between display-sized headings 
                    and microscopic labels. This creates a spatial map that users can navigate instantly.
                  </p>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-label text-fg-tertiary mb-6 uppercase tracking-[0.2em]">Semantic Intelligence</h2>
              <div className="flex flex-wrap gap-4">
                <StatusPill status="success"><ShieldCheck size={14} /> Verified</StatusPill>
                <StatusPill status="danger">Critical Risk</StatusPill>
                <StatusPill status="warning">Review Needed</StatusPill>
                <StatusPill status="info">Synchronizing</StatusPill>
              </div>
            </div>
          </motion.section>

          {/* Interaction Lab */}
          <motion.section variants={itemVariants} className="space-y-12">
            <div>
              <h2 className="text-label text-fg-tertiary mb-8 uppercase tracking-[0.2em]">Interaction Quality</h2>
              <div className="flex flex-wrap items-center gap-6">
                <Button variant="primary">Launch Module</Button>
                <Button variant="secondary">Configure Settings</Button>
                <Button variant="ghost">Secondary Action</Button>
                <Button variant="icon" size="icon" className="rounded-full"><LayoutDashboard size={18} /></Button>
              </div>
            </div>

            <div className="space-y-6">
              <h2 className="text-label text-fg-tertiary mb-6 uppercase tracking-[0.2em]">Fluid Forms</h2>
              <div className="space-y-4">
                <Input label="Session Key" placeholder="A12-X90-L42" />
                <Input label="Search Workspace" placeholder="Find students, projects, or sessions..." disabled />
              </div>
            </div>
          </motion.section>
        </div>

        {/* Spatial Surfaces */}
        <motion.section variants={itemVariants}>
          <h2 className="text-label text-fg-tertiary mb-8 uppercase tracking-[0.2em]">Spatial Surfaces</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="group relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-accent-glow/5 blur-3xl -mr-16 -mt-16 rounded-full group-hover:bg-accent-glow/10 transition-colors duration-500" />
              <div className="text-label text-accent-glow mb-4 tracking-widest font-bold">Intelligent Module</div>
              <h3 className="text-h2 text-white mb-4">Engagement Scoring</h3>
              <p className="text-body text-fg-secondary mb-8 leading-relaxed">
                Automated scoring system that evaluates student participation across multiple 
                data points in real-time.
              </p>
              <Button variant="secondary" size="sm">Explore Analytics</Button>
            </Card>
            <Card hero className="bg-gradient-to-br from-surface to-surface-raised">
              <div className="text-label text-fg-tertiary mb-4 tracking-widest uppercase">Hero Component</div>
              <h3 className="text-display-sm text-white mb-6">Attendance Risk <br />Prediction</h3>
              <div className="flex items-center gap-4 mb-8">
                <div className="flex -space-x-2">
                  {[1,2,3,4].map(i => (
                    <div key={i} className="w-8 h-8 rounded-full border-2 border-void bg-surface-raised flex items-center justify-center text-[10px] font-bold text-fg-tertiary">
                      JD
                    </div>
                  ))}
                </div>
                <span className="text-caption text-fg-secondary">4 students at critical risk</span>
              </div>
              <Button className="w-full">Open Risk Dashboard</Button>
            </Card>
          </div>
        </motion.section>

        {/* State Experience */}
        <motion.section variants={itemVariants}>
          <h2 className="text-label text-fg-tertiary mb-8 uppercase tracking-[0.2em]">State Orchestration</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <EmptyState 
              icon={AlertCircle}
              title="No Active Cohorts"
              description="Start by importing your historical attendance data to initialize AI predictions."
              action={<Button variant="secondary">Initialize System</Button>}
              className="md:col-span-2"
            />
            <Card className="flex flex-col justify-center gap-6">
              <div className="space-y-4">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
                <Skeleton className="h-4 w-1/2" />
              </div>
              <Button variant="ghost" onClick={() => setModalOpen(true)}>Preview Dialog System</Button>
            </Card>
          </div>
        </motion.section>

        <Modal 
          isOpen={modalOpen} 
          onClose={() => setModalOpen(false)}
          title="PulseForge Environment"
        >
          <div className="space-y-6">
            <p className="text-body-lg text-fg-secondary leading-relaxed">
              This sandbox allows you to verify the cinematic interaction quality and visual 
              fidelity of the PulseForge design system. Every interaction is tuned for high-performance 
              emotional feedback.
            </p>
            <div className="p-4 rounded-lg bg-surface border border-border-subtle flex items-center justify-between">
              <span className="text-label text-fg-tertiary">System Health</span>
              <StatusPill status="success">Operational</StatusPill>
            </div>
            <div className="flex justify-end gap-3 pt-4">
              <Button variant="secondary" onClick={() => setModalOpen(false)}>Dismiss</Button>
              <Button onClick={() => setModalOpen(false)}>Acknowledge</Button>
            </div>
          </div>
        </Modal>
      </motion.div>
    </PageContainer>
  );
}
