import React from 'react'
import { Sidebar } from './Sidebar'
import { AmbientBackground } from './AmbientBackground'
import { motion, AnimatePresence } from 'framer-motion'
import { useLocation } from 'react-router-dom'

export function AppShell({ children }) {
  const location = useLocation()

  return (
    <div className="flex h-screen w-full bg-canvas overflow-hidden text-fg-primary font-body relative">
      <AmbientBackground />
      <Sidebar />
      <main className="flex-1 h-full overflow-y-auto relative z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="min-h-full"
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  )
}
