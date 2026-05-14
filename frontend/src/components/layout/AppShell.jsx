import React from 'react';
import { Sidebar } from './Sidebar';
import { AmbientBackground } from './AmbientBackground';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Calendar, 
  CheckSquare, 
  Users, 
  BookOpen, 
  Settings 
} from 'lucide-react';

export function AppShell({ children }) {
  const location = useLocation();

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Scheduling', href: '/scheduling', icon: Calendar },
    { name: 'Mark Attendance', href: '/attendance', icon: CheckSquare },
    { name: 'Students', href: '/students', icon: Users },
    { name: 'Materials', href: '/materials', icon: BookOpen },
    { name: 'Settings', href: '/settings', icon: Settings },
  ];

  return (
    <div className="flex h-screen w-full bg-canvas overflow-hidden text-fg-primary font-body relative z-0">
      <AmbientBackground />
      <Sidebar className="z-20 relative" navigation={navigation} />
      <main className="flex-1 h-full overflow-y-auto relative z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="min-h-full"
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
