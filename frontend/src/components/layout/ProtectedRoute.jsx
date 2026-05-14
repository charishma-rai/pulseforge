import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

export const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { user, role, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-void text-fg-primary">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-accent-glow animate-pulse" />
          <p className="text-label text-fg-tertiary uppercase tracking-widest">Synchronizing Session...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    console.log('[ProtectedRoute] No user session - redirecting to login');
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Handle intermediate state: User exists but profile/role hasn't hydrated yet
  if (!role && user) {
    console.log('[ProtectedRoute] Session active, awaiting role hydration...');
    return (
      <div className="h-screen w-full flex items-center justify-center bg-void text-fg-primary">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-full border-2 border-accent-glow border-t-transparent animate-spin" />
          <p className="text-label text-fg-tertiary uppercase tracking-widest">Finalizing Session...</p>
        </div>
      </div>
    );
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(role)) {
    console.warn(`[ProtectedRoute] Role ${role} not authorized for this route. Redirecting...`);
    if (role === 'mentor') return <Navigate to="/dashboard" replace />;
    if (role === 'student') return <Navigate to="/portal" replace />;
    return <Navigate to="/login" replace />;
  }


  return children;
};
