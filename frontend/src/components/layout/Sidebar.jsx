import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { 
  LayoutDashboard, 
  CheckSquare, 
  History, 
  BookOpen, 
  Upload, 
  Settings, 
  LogOut,
  Calendar,
  Sparkles,
  Users
} from 'lucide-react';

export function Sidebar({ className }) {
  const { profile, role, signOut } = useAuth();
  const navigate = useNavigate();

  const mentorLinks = [
    { label: 'Intelligence', items: [
      { name: 'Dashboard', icon: LayoutDashboard, to: '/dashboard' },
      { name: 'Scheduling', icon: Calendar, to: '/scheduling' },
      { name: 'Mark Attendance', icon: CheckSquare, to: '/attendance' },
    ]},
    { label: 'Management', items: [
      { name: 'Students', icon: Users, to: '/students' },
      { name: 'Materials', icon: BookOpen, to: '/materials' },
      { name: 'Upload CSV', icon: Upload, to: '/upload' },
    ]}
  ];

  const studentLinks = [
    { label: 'Portal', items: [
      { name: 'My Journey', icon: LayoutDashboard, to: '/portal' },
      { name: 'Scheduling', icon: Calendar, to: '/scheduling' },
    ]},
    { label: 'Academic', items: [
      { name: 'Attendance', icon: CheckSquare, to: '/attendance' },
      { name: 'Materials', icon: BookOpen, to: '/materials' },
    ]}
  ];

  const links = role === 'mentor' ? mentorLinks : studentLinks;

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <aside className={cn("w-[280px] h-screen border-r border-border-subtle bg-canvas/50 backdrop-blur-xl flex-col hidden lg:flex relative z-20", className)}>
      <div className="p-8 flex items-center gap-3">
        <motion.div 
          whileHover={{ scale: 1.05, rotate: -5 }}
          className="w-9 h-9 rounded-full bg-accent-glow flex items-center justify-center shadow-focus relative overflow-hidden cursor-pointer"
          onClick={() => navigate('/')}
        >
          <div className="absolute inset-0 bg-gradient-to-tr from-accent-glow via-white/10 to-transparent" />
          <span className="text-void font-bold tracking-tighter text-sm relative z-10">PF</span>
        </motion.div>
        <span className="font-display font-bold text-xl tracking-tight text-white cursor-default">PulseForge</span>
      </div>
      
      <div className="mx-6 p-5 rounded-xl bg-surface/50 border border-border-subtle mb-8">
        <p className="text-label text-fg-tertiary uppercase tracking-[0.1em] mb-1">{role} Access</p>
        <p className="text-body font-semibold text-fg-primary truncate">{profile?.full_name || 'Loading...'}</p>
        <div className="flex items-center gap-2 mt-2">
          <div className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
          <span className="text-micro text-fg-tertiary">Secured Session</span>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto px-4 space-y-8 custom-scrollbar">
        {links.map((group, idx) => (
          <div key={idx}>
            <h4 className="text-micro text-fg-tertiary mb-4 px-4 font-bold uppercase tracking-[0.2em]">{group.label}</h4>
            <div className="space-y-1">
              {group.items.map((item, iIdx) => (
                <NavLink
                  key={iIdx}
                  to={item.to}
                  className={({ isActive }) => cn(
                    "flex items-center gap-3 px-4 py-2.5 rounded-lg text-body transition-all duration-300 relative group",
                    isActive 
                      ? "text-fg-primary" 
                      : "text-fg-tertiary hover:text-fg-secondary"
                  )}
                >
                  {({ isActive }) => (
                    <>
                      {isActive && (
                        <motion.div 
                          layoutId="sidebar-active"
                          className="absolute inset-0 bg-surface-raised border border-border-subtle rounded-lg -z-10"
                          transition={{ type: "spring", stiffness: 400, damping: 30 }}
                        />
                      )}
                      {isActive && (
                        <motion.div 
                          layoutId="sidebar-accent"
                          className="absolute left-0 top-2 bottom-2 w-[2px] bg-accent-glow rounded-full" 
                          transition={{ type: "spring", stiffness: 400, damping: 30 }}
                        />
                      )}
                      <item.icon size={18} className={cn("shrink-0 transition-colors duration-300", isActive ? "text-accent-glow" : "group-hover:text-fg-secondary")} />
                      <span className="font-medium tracking-tight">{item.name}</span>
                    </>
                  )}
                </NavLink>
              ))}
            </div>
          </div>
        ))}
      </nav>

      <div className="p-6 border-t border-border-subtle space-y-2">
        <NavLink to="/settings" className={({ isActive }) => cn(
          "flex w-full items-center gap-3 px-4 py-2 rounded-lg text-body transition-all duration-300",
          isActive ? "text-fg-primary bg-surface/50" : "text-fg-tertiary hover:text-fg-primary hover:bg-surface/50"
        )}>
          <Settings size={18} />
          <span className="font-medium">Settings</span>
        </NavLink>
        <button 
          onClick={handleSignOut}
          className="flex w-full items-center gap-3 px-4 py-2 rounded-lg text-body text-danger/80 hover:text-danger hover:bg-danger/20 transition-all duration-300"
        >
          <LogOut size={18} />
          <span className="font-medium">Logout</span>
        </button>
      </div>

    </aside>
  );
}
