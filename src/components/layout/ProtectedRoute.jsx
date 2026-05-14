import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { motion } from 'framer-motion'

export function ProtectedRoute({ children, allowedRoles = [] }) {
  const { user, role, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-void">
        <motion.div
          className="flex flex-col items-center gap-5"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="relative w-14 h-14">
            <div className="absolute inset-0 rounded-full bg-accent-glow/20 animate-ping" />
            <div className="absolute inset-2 rounded-full bg-accent-glow animate-pulse" />
            <span className="absolute inset-0 flex items-center justify-center text-white font-bold text-sm">PF</span>
          </div>
          <p className="text-label text-fg-tertiary uppercase tracking-[0.25em]">Synchronizing session…</p>
        </motion.div>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(role)) {
    if (role === 'mentor')  return <Navigate to="/dashboard" replace />
    if (role === 'student') return <Navigate to="/portal" replace />
    return <Navigate to="/login" replace />
  }

  return children
}
