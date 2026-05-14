import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'

import { AppShell } from '@/components/layout/AppShell'
import { ProtectedRoute } from '@/components/layout/ProtectedRoute'

import { Landing }          from '@/pages/Landing'
import { Login }            from '@/pages/Login'
import { SignUp }           from '@/pages/SignUp'
import { MentorDashboard }  from '@/pages/MentorDashboard'
import { StudentPortal }    from '@/pages/StudentPortal'
import { Scheduling }       from '@/pages/Scheduling'
import { Placeholder }      from '@/pages/Placeholder'

// ─── 404 ────────────────────────────────────────────────────────────────────
function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-void text-fg-primary gap-6 px-6 text-center">
      <div className="text-display-hero text-fg-tertiary font-bold tracking-tighter">404</div>
      <h1 className="text-display-sm text-white">Page lost in deep space</h1>
      <p className="text-body-lg text-fg-secondary">The route you're looking for doesn't exist.</p>
      <a href="/" className="text-accent-glow hover:text-white transition-colors text-body font-medium">← Return Home</a>
    </div>
  )
}

function App() {
  return (
    <Routes>
      {/* ── Public ─────────────────────────── */}
      <Route path="/"       element={<Landing />} />
      <Route path="/login"  element={<Login />} />
      <Route path="/signup" element={<SignUp />} />

      {/* ── Mentor only ───────────────────── */}
      <Route path="/dashboard" element={
        <ProtectedRoute allowedRoles={['mentor']}>
          <AppShell><MentorDashboard /></AppShell>
        </ProtectedRoute>
      } />
      <Route path="/history" element={
        <ProtectedRoute allowedRoles={['mentor']}>
          <AppShell><Placeholder title="Student History" description="Full attendance history and trajectory for each student." /></AppShell>
        </ProtectedRoute>
      } />
      <Route path="/upload" element={
        <ProtectedRoute allowedRoles={['mentor']}>
          <AppShell><Placeholder title="CSV Data Ingestion" description="Upload CSV files for AI-powered attendance mapping." /></AppShell>
        </ProtectedRoute>
      } />
      <Route path="/analytics" element={
        <ProtectedRoute allowedRoles={['mentor']}>
          <AppShell><Placeholder title="Analytics & Insights" description="AI-generated engagement scores and dropout risk predictions." /></AppShell>
        </ProtectedRoute>
      } />

      {/* ── Student only ──────────────────── */}
      <Route path="/portal" element={
        <ProtectedRoute allowedRoles={['student']}>
          <AppShell><StudentPortal /></AppShell>
        </ProtectedRoute>
      } />

      {/* ── Shared protected ──────────────── */}
      <Route path="/scheduling" element={
        <ProtectedRoute>
          <AppShell><Scheduling /></AppShell>
        </ProtectedRoute>
      } />
      <Route path="/attendance" element={
        <ProtectedRoute>
          <AppShell><Placeholder title="Attendance Intelligence" description="Mark and review session attendance records." /></AppShell>
        </ProtectedRoute>
      } />
      <Route path="/materials" element={
        <ProtectedRoute>
          <AppShell><Placeholder title="Learning Materials" description="Upload and access class resources and recordings." /></AppShell>
        </ProtectedRoute>
      } />

      {/* ── 404 ───────────────────────────── */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default App
