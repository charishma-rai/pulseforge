import React from 'react';
import { motion } from 'framer-motion';

export function AmbientBackground() {
  return (
    <div className="fixed inset-0 z-[-1] overflow-hidden bg-void pointer-events-none">
      {/* Subtle Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff04_1px,transparent_1px),linear-gradient(to_bottom,#ffffff04_1px,transparent_1px)] bg-[size:48px_48px] mix-blend-screen" />
      
      {/* Drifting Orbs */}
      <motion.div
        animate={{
          x: [0, 80, 0, -80, 0],
          y: [0, 60, 100, 40, 0],
          scale: [1, 1.05, 1, 0.95, 1],
        }}
        transition={{
          duration: 30,
          repeat: Infinity,
          ease: "linear"
        }}
        className="absolute top-[-20%] left-[-10%] w-[50%] h-[60%] rounded-full bg-accent-glow/10 blur-[140px]"
      />
      
      <motion.div
        animate={{
          x: [0, -60, 0, 60, 0],
          y: [0, -40, -80, -40, 0],
          scale: [1, 0.95, 1, 1.05, 1],
        }}
        transition={{
          duration: 35,
          repeat: Infinity,
          ease: "linear"
        }}
        className="absolute bottom-[-20%] right-[-10%] w-[40%] h-[50%] rounded-full bg-info/10 blur-[120px]"
      />
      
      {/* Top Cosmic Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[1200px] h-[500px] bg-cosmic-glow opacity-60 mix-blend-screen" />
      
      {/* Overlay to fade out grid at bottom */}
      <div className="absolute inset-0 bg-gradient-to-t from-void via-transparent to-transparent opacity-90" />
    </div>
  );
}
