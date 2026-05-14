import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AppShell } from '@/components/layout/AppShell';
import { Landing } from '@/pages/Landing';
import { Login } from '@/pages/Login';
import { SignUp } from '@/pages/SignUp';
import { ProtectedRoute } from '@/components/layout/ProtectedRoute';
import { DevTokens } from '@/pages/DevTokens';
import { Scheduling } from '@/pages/Scheduling';
import { Attendance } from '@/pages/Attendance';
import { Students } from '@/pages/Students';
import { Materials } from '@/pages/Materials';
import { Upload } from '@/pages/Upload';
import { StudentPortal } from '@/pages/StudentPortal';
import MentorDashboard from '@/pages/MentorDashboard';
import { AttendanceSessionPanel } from '@/components/dashboard/AttendanceSessionPanel';
import { useAuth } from '@/context/AuthContext';
import { ErrorBoundary } from '@/components/shared/ErrorBoundary';

console.info('🚀 PulseForge V2 Production Architecture Initialized');

// Simple Button internal fallback
const Button = ({ children, onClick, className }) => (
  <button 
    onClick={onClick}
    className={`px-8 py-3 bg-accent-glow text-void font-bold rounded-lg ${className}`}
  >
    {children}
  </button>
);


const PlaceholderPage = ({ title }) => (
  <div className="p-12">
    <h1 className="text-display-md text-white">{title}</h1>
    <p className="text-body-lg text-fg-secondary mt-4">Module under development.</p>
  </div>
);

function App() {
  return (
    <ErrorBoundary>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />

        {/* Protected Routes - Mentor Only */}
        <Route path="/dashboard" element={
          <ProtectedRoute allowedRoles={['mentor']}>
            <AppShell>
              <MentorDashboard />
            </AppShell>
          </ProtectedRoute>
        } />

        {/* Protected Routes - Student Only */}
        <Route path="/portal" element={
          <ProtectedRoute allowedRoles={['student']}>
            <AppShell>
              <StudentPortal />
            </AppShell>
          </ProtectedRoute>
        } />

        {/* Shared Protected Routes */}
        <Route path="/scheduling" element={
          <ProtectedRoute>
            <AppShell>
              <Scheduling />
            </AppShell>
          </ProtectedRoute>
        } />

        <Route path="/attendance" element={
          <ProtectedRoute>
            <AppShell>
              <Attendance />
            </AppShell>
          </ProtectedRoute>
        } />

        <Route path="/students" element={
          <ProtectedRoute allowedRoles={['mentor']}>
            <AppShell>
              <Students />
            </AppShell>
          </ProtectedRoute>
        } />

        <Route path="/materials" element={
          <ProtectedRoute>
            <AppShell>
              <Materials />
            </AppShell>
          </ProtectedRoute>
        } />

        <Route path="/upload" element={
          <ProtectedRoute allowedRoles={['mentor']}>
            <AppShell>
              <Upload />
            </AppShell>
          </ProtectedRoute>
        } />

        <Route path="/settings" element={
          <ProtectedRoute>
            <AppShell>
              <PlaceholderPage title="Settings" />
            </AppShell>
          </ProtectedRoute>
        } />

        {/* Internal/Dev */}
        <Route path="/dev-tokens" element={
          <ProtectedRoute allowedRoles={['mentor']}>
            <AppShell>
              <DevTokens />
            </AppShell>
          </ProtectedRoute>
        } />

        {/* 404 Route */}
        <Route path="*" element={
          <div className="flex flex-col items-center justify-center h-screen bg-void text-fg-primary">
            <h1 className="text-display-lg text-white mb-4">404</h1>
            <p className="text-body-lg text-fg-secondary mb-8 text-center px-6">Page lost in deep space. Returning to safety...</p>
            <Button onClick={() => window.location.href = '/'}>Return Home</Button>
          </div>
        } />
      </Routes>
    </ErrorBoundary>
  );
}

export default App;
