import React, { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '@/context/AuthContext'
import {
  LayoutDashboard,
  CheckSquare,
  History,
  BookOpen,
  Upload,
  Settings,
  LogOut,
  Calendar,
  Users,
  ChevronLeft,
  ChevronRight,
  Zap,
  Activity,
} from 'lucide-react'

const mentorNav = [
  {
    label: 'Overview',
    items: [
      { name: 'Dashboard',   icon: LayoutDashboard, to: '/dashboard' },
      { name: 'Scheduling',  icon: Calendar,        to: '/scheduling' },
      { name: 'Analytics',   icon: Activity,        to: '/analytics' },
    ],
  },
  {
    label: 'Activity',
    items: [
      { name: 'Mark Attendance', icon: CheckSquare, to: '/attendance' },
      { name: 'Student History', icon: History,     to: '/history' },
      { name: 'Materials',       icon: BookOpen,    to: '/materials' },
    ],
  },
  {
    label: 'Data',
    items: [
      { name: 'Upload CSV', icon: Upload, to: '/upload' },
    ],
  },
]

const studentNav = [
  {
    label: 'Portal',
    items: [
      { name: 'My Journey',  icon: LayoutDashboard, to: '/portal' },
      { name: 'Scheduling',  icon: Calendar,        to: '/scheduling' },
    ],
  },
  {
    label: 'Academic',
    items: [
      { name: 'Attendance', icon: CheckSquare, to: '/attendance' },
      { name: 'Materials',  icon: BookOpen,    to: '/materials' },
    ],
  },
]

export function Sidebar() {
  const { profile, role, signOut } = useAuth()
  const navigate = useNavigate()
  const [collapsed, setCollapsed] = useState(false)

  const links = role === 'mentor' ? mentorNav : studentNav

  const handleSignOut = async () => {
    await signOut()
    navigate('/')
  }

  return (
    <motion.aside
      animate={{ width: collapsed ? 72 : 272 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className="h-screen flex-shrink-0 border-r border-border-subtle bg-canvas/60 backdrop-blur-xl flex flex-col relative z-20 hidden lg:flex overflow-hidden"
    >
      {/* Logo */}
      <div className="p-5 flex items-center gap-3 relative">
        <motion.div
          whileHover={{ scale: 1.08, rotate: -6 }}
          onClick={() => navigate('/')}
          className="w-9 h-9 rounded-xl bg-accent-glow flex items-center justify-center shadow-glow relative shrink-0 cursor-pointer"
        >
          <div className="absolute inset-0 rounded-xl bg-gradient-to-tr from-accent-glow via-indigo-400/20 to-transparent" />
          <Zap size={16} className="text-white relative z-10" />
        </motion.div>
        <AnimatePresence>
          {!collapsed && (
            <motion.span
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="font-display font-bold text-[17px] tracking-tight text-white whitespace-nowrap cursor-default"
            >
              PulseForge
            </motion.span>
          )}
        </AnimatePresence>

        {/* Collapse toggle */}
        <button
          onClick={() => setCollapsed(c => !c)}
          className="absolute -right-3.5 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-surface border border-border-default flex items-center justify-center text-fg-tertiary hover:text-fg-primary hover:border-border-strong transition-all z-30"
        >
          {collapsed ? <ChevronRight size={13} /> : <ChevronLeft size={13} />}
        </button>
      </div>

      {/* Profile pill */}
      {!collapsed && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="mx-4 mb-5 p-4 rounded-xl bg-surface/60 border border-border-subtle"
        >
          <p className="text-label text-fg-tertiary uppercase tracking-[0.12em] mb-1">
            {role ?? '—'} Access
          </p>
          <p className="text-body font-semibold text-fg-primary truncate">
            {profile?.full_name || 'Loading…'}
          </p>
          <div className="flex items-center gap-1.5 mt-2">
            <div className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
            <span className="text-micro text-fg-tertiary">Secured Session</span>
          </div>
        </motion.div>
      )}

      {/* Nav links */}
      <nav className="flex-1 overflow-y-auto px-3 space-y-6 pb-4">
        {links.map((group, gi) => (
          <div key={gi}>
            {!collapsed && (
              <h4 className="text-micro text-fg-tertiary mb-2.5 px-3 font-bold uppercase tracking-[0.22em]">
                {group.label}
              </h4>
            )}
            <div className="space-y-0.5">
              {group.items.map((item, ii) => (
                <NavLink
                  key={ii}
                  to={item.to}
                  title={collapsed ? item.name : undefined}
                  className={({ isActive }) => cn(
                    'flex items-center gap-3 px-3 py-2.5 rounded-lg text-body transition-all duration-200 relative group',
                    collapsed && 'justify-center px-0',
                    isActive
                      ? 'text-fg-primary'
                      : 'text-fg-tertiary hover:text-fg-secondary'
                  )}
                >
                  {({ isActive }) => (
                    <>
                      {isActive && (
                        <motion.div
                          layoutId="sidebar-bg"
                          className="absolute inset-0 bg-surface-raised border border-border-subtle rounded-lg -z-10"
                          transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                        />
                      )}
                      {isActive && !collapsed && (
                        <motion.div
                          layoutId="sidebar-bar"
                          className="absolute left-0 top-2 bottom-2 w-0.5 bg-accent-glow rounded-full"
                        />
                      )}
                      <item.icon
                        size={17}
                        className={cn(
                          'shrink-0 transition-colors duration-200',
                          isActive ? 'text-accent-glow' : 'group-hover:text-fg-secondary'
                        )}
                      />
                      {!collapsed && (
                        <span className="font-medium tracking-tight text-[13.5px]">{item.name}</span>
                      )}
                    </>
                  )}
                </NavLink>
              ))}
            </div>
          </div>
        ))}
      </nav>

      {/* Footer actions */}
      <div className={cn('p-3 border-t border-border-subtle space-y-0.5', collapsed && 'flex flex-col items-center')}>
        <button
          className={cn(
            'flex items-center gap-3 px-3 py-2.5 rounded-lg text-body text-fg-tertiary hover:text-fg-primary hover:bg-surface-raised transition-all w-full',
            collapsed && 'justify-center px-0 w-10'
          )}
          title="Settings"
        >
          <Settings size={17} />
          {!collapsed && <span className="font-medium text-[13.5px]">Settings</span>}
        </button>
        <button
          onClick={handleSignOut}
          className={cn(
            'flex items-center gap-3 px-3 py-2.5 rounded-lg text-body text-danger/70 hover:text-danger hover:bg-danger-bg transition-all w-full',
            collapsed && 'justify-center px-0 w-10'
          )}
          title="Logout"
        >
          <LogOut size={17} />
          {!collapsed && <span className="font-medium text-[13.5px]">Logout</span>}
        </button>
      </div>
    </motion.aside>
  )
}
