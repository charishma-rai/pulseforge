import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AmbientBackground } from '@/components/layout/AmbientBackground';
import { Card } from '@/components/core/Card';
import { Button } from '@/components/core/Button';
import { Input } from '@/components/core/Input';
import { CheckSquare, Users, BookOpen, Presentation, Activity, AlertCircle } from 'lucide-react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';

export function Login() {
  const [activeTab, setActiveTab] = useState('mentor');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    usn: '',
  });

  const navigate = useNavigate();
  const location = useLocation();
  const { signIn } = useAuth();
  
  const successMessage = location.state?.message;

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const loginEmail = activeTab === 'mentor'
        ? formData.email
        : formData.email || `${formData.usn.toLowerCase()}@pulseforge.student`;

      console.log('[Login] Attempting sign in for:', loginEmail);

      const { data: signInData, error: signInError } = await signIn({
        email: loginEmail,
        password: formData.password,
      });

      if (signInError) {
        console.error('[Login] Auth Error:', signInError);
        throw signInError;
      }

      const user = signInData?.user;
      console.log('[Login] Sign-in successful. User ID:', user?.id);

      // --- NEW: Profile Polling & Role Detection Guard ---
      let userRole = user?.user_metadata?.role; // Instant fallback from metadata
      let isVerified = user?.user_metadata?.is_verified || false;
      let destination = userRole === 'student' ? '/portal' : '/dashboard';

      if (user?.id) {
        console.log('[Login] Detecting role from metadata:', userRole);
        
        // Polling loop: Wait up to 3 seconds for the DB trigger to finish
        console.log('[Login] Polling for DB profile synchronization...');
        for (let i = 0; i < 5; i++) {
          const { data: profileData } = await supabase
            .from('profiles')
            .select('role, is_verified')
            .eq('id', user.id)
            .single();

          if (profileData) {
            console.log('[Login] Profile sync complete (DB matched)');
            userRole = profileData.role;
            isVerified = profileData.is_verified;
            destination = userRole === 'student' ? '/portal' : '/dashboard';
            break;
          }
          console.log(`[Login] Profile not ready yet, retrying... (${i+1}/5)`);
          await new Promise(r => setTimeout(r, 600)); // wait 600ms
        }
      }

      const from = location.state?.from?.pathname;
      const finalDest = from || destination;
      
      console.log('[Login] Redirecting to:', finalDest, 'with role:', userRole);
      navigate(finalDest, { replace: true });

    } catch (err) {
      console.error('[Login] Caught Exception:', err);
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }


  };

  const features = [
    { icon: Activity, text: "AI Attendance Intelligence" },
    { icon: Users, text: "Mentor Collaboration" },
    { icon: CheckSquare, text: "Assignment Tracking" },
    { icon: Presentation, text: "Project Workspaces" },
    { icon: BookOpen, text: "Engagement Analytics" },
  ];

  return (
    <div className="relative min-h-screen w-full flex bg-void text-fg-primary overflow-hidden font-body">
      <AmbientBackground />
      
      {/* LEFT PANEL */}
      <div className="hidden lg:flex flex-1 flex-col justify-center px-16 xl:px-24 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-xl"
        >
          <Link to="/" className="flex items-center gap-4 mb-8 group">
            <div className="w-12 h-12 rounded-full bg-accent-glow flex items-center justify-center shadow-focus relative">
              <div className="absolute inset-0 rounded-full bg-accent-glow animate-pulse blur-sm" />
              <span className="text-white font-bold text-xl tracking-tighter relative z-10">PF</span>
            </div>
            <h1 className="text-display-sm tracking-tight font-display text-white group-hover:text-accent-glow transition-colors">PulseForge</h1>
          </Link>

          <h2 className="text-display-md font-display leading-[1.1] text-white mb-6">
            Transforming attendance into <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-glow to-info">actionable learning intelligence.</span>
          </h2>
          
          <div className="space-y-5 mt-12">
            {features.map((item, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.4 + idx * 0.1 }}
                className="flex items-center gap-4 group cursor-default"
              >
                <div className="w-8 h-8 rounded-full bg-surface-raised border border-border-subtle flex items-center justify-center text-accent-glow group-hover:bg-accent-glow/10 group-hover:border-accent-glow/30 transition-all">
                  <item.icon size={16} />
                </div>
                <span className="text-body font-medium text-fg-secondary tracking-wide group-hover:text-fg-primary transition-colors">{item.text}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* RIGHT PANEL */}
      <div className="flex-1 flex items-center justify-center p-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-[420px]"
        >
          <Card hero hoverEffect={false} className="backdrop-blur-2xl bg-surface/60 border-border-default shadow-raised p-8 md:p-10 relative overflow-visible">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-accent-glow/10 blur-[80px] -z-10 rounded-full opacity-50" />
            
            <div className="text-center mb-8 relative z-10">
              <h3 className="text-h2 font-display text-white mb-2">Welcome Back</h3>
              <p className="text-body text-fg-secondary">Sign in to your PulseForge account</p>
            </div>

            {successMessage && (
              <div className="mb-6 p-4 rounded-lg bg-success-bg border border-success-border flex items-center gap-3 text-success text-[13px]">
                <Activity size={16} />
                {successMessage}
              </div>
            )}

            <div className="relative flex p-1 mb-8 bg-surface-inset border border-border-subtle rounded-xl z-10">
              {['mentor', 'student'].map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveTab(tab)}
                  className={cn(
                    "relative flex-1 py-2.5 text-[13px] font-medium tracking-wide capitalize transition-colors z-20 rounded-lg outline-none",
                    activeTab === tab ? "text-white" : "text-fg-tertiary hover:text-fg-secondary"
                  )}
                >
                  {tab}
                </button>
              ))}
              <motion.div
                className="absolute top-1 bottom-1 w-[calc(50%-4px)] bg-surface-raised border border-border-default rounded-lg shadow-sm z-10"
                initial={false}
                animate={{ left: activeTab === 'mentor' ? "4px" : "calc(50%)" }}
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              />
            </div>

            <form onSubmit={handleLogin} className="space-y-5 relative z-10">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-5"
                >
                  {activeTab === 'mentor' ? (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="block text-label text-fg-secondary uppercase tracking-wider">Email Address</label>
                        <Input name="email" type="email" placeholder="mentor@theforge.local" required value={formData.email} onChange={handleInputChange} />
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="block text-label text-fg-secondary uppercase tracking-wider">Student USN</label>
                        <Input name="usn" type="text" placeholder="e.g. 4SH24CS001" required value={formData.usn} onChange={handleInputChange} className="uppercase font-mono" />
                      </div>
                    </div>
                  )}
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-label text-fg-secondary uppercase tracking-wider">Password</label>
                      <a href="#" className="text-micro text-accent-glow hover:text-white transition-colors">Forgot?</a>
                    </div>
                    <Input name="password" type="password" placeholder="••••••••" required value={formData.password} onChange={handleInputChange} />
                  </div>
                </motion.div>
              </AnimatePresence>

              {error && (
                <div className="p-3 rounded-lg bg-danger-bg border border-danger-border flex items-center gap-2 text-danger text-micro">
                  <AlertCircle size={14} />
                  {error}
                </div>
              )}

              <Button 
                type="submit" 
                className="w-full mt-6 h-11 text-[15px] font-bold shadow-focus transition-all overflow-hidden relative"
                disabled={isLoading}
              >
                {isLoading ? (
                  <motion.div 
                    animate={{ rotate: 360 }} 
                    transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                    className="w-5 h-5 border-2 border-void border-t-transparent rounded-full mx-auto"
                  />
                ) : (
                  <span className="relative z-10 text-void">Sign In</span>
                )}
              </Button>
            </form>
            
            <div className="mt-8 text-center border-t border-border-subtle pt-6">
              <p className="text-[13px] text-fg-tertiary">
                New to PulseForge? <Link to="/signup" className="text-accent-glow hover:text-white transition-colors">Create Account</Link>
              </p>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
