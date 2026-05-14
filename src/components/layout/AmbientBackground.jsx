import React from 'react'
import { motion } from 'framer-motion'

export function AmbientBackground() {
  return (
    <div className="fixed inset-0 z-[-1] overflow-hidden bg-void pointer-events-none select-none">
      {/* Subtle grid lines */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:56px_56px]" />

      {/* Drifting orb - top left (indigo) */}
      <motion.div
        animate={{
          x: [0, 90, 0, -70, 0],
          y: [0, 55, 110, 40, 0],
          scale: [1, 1.06, 0.97, 1.04, 1],
        }}
        transition={{ duration: 32, repeat: Infinity, ease: 'linear' }}
        className="absolute -top-[20%] -left-[12%] w-[55%] h-[65%] rounded-full bg-accent-glow/[0.08] blur-[160px]"
      />

      {/* Drifting orb - bottom right (blue) */}
      <motion.div
        animate={{
          x: [0, -65, 0, 55, 0],
          y: [0, -45, -85, -30, 0],
          scale: [1, 0.94, 1.03, 0.98, 1],
        }}
        transition={{ duration: 38, repeat: Infinity, ease: 'linear' }}
        className="absolute -bottom-[25%] -right-[12%] w-[45%] h-[55%] rounded-full bg-info/[0.07] blur-[140px]"
      />

      {/* Subtle center top glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[1400px] h-[600px] bg-cosmic-glow opacity-50 mix-blend-screen" />

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-64 bg-gradient-to-t from-void to-transparent" />
    </div>
  )
}
