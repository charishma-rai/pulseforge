import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { AmbientBackground } from '@/components/layout/AmbientBackground';
import { Card } from '@/components/core/Card';
import { Button } from '@/components/core/Button';
import { Input } from '@/components/core/Input';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';
import { ArrowLeft, UserCircle, GraduationCap, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

export function SignUp() {
  const [step, setStep] = useState(1); // 1: Role Selection, 2: Form
  const [role, setRole] = useState(null); // 'mentor' or 'student'
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { signUp } = useAuth();

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    department: '', // mentor
    branch: '', // student
    year: '', // student
    usn: '', // student
  });

  const handleRoleSelect = (selectedRole) => {
    setRole(selectedRole);
    setStep(2);
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    console.log('--- PulseForge Auth: Signup Process Started ---');
    console.log('Role:', role);
    console.log('Target Email:', formData.email);

    try {
      console.log('[SignUp] Starting account creation...');
      
      // 1. Strictly Role-Conditional Payload Construction
      const signupMetadata = {
        role: role,
        full_name: formData.fullName,
      };

      // Only add student-specific fields if the role is student
      if (role === 'student') {
        signupMetadata.usn = formData.usn;
        signupMetadata.branch = formData.branch;
        signupMetadata.year = formData.year ? parseInt(formData.year, 10) : null;
      }

      const signupPayload = {
        email: formData.email,
        password: formData.password,
        options: {
          data: signupMetadata
        }
      };

      console.log('[SignUp] Pre-flight Check - Role:', role);
      console.log('[SignUp] Final Payload:', signupPayload);

      const { data: authData, error: signUpError } = await signUp(signupPayload);

      if (signUpError) {
        console.error('[SignUp] Supabase Auth rejected request:', signUpError.message);
        throw signUpError;
      }

      console.log('[SignUp] Auth successful. User ID:', authData?.user?.id);
      console.log('[SignUp] Handing off profile creation to database trigger...');

      // 2. Success Redirect
      // We don't wait for the profile to appear here because the trigger is asynchronous.
      // The user will see their profile data after they log in.
      navigate('/login', { 
        replace: true,
        state: { message: 'Account created! You can now sign in.' } 
      });

    } catch (err) {
      console.error('[SignUp] Workflow Exception:', err.message);
      setError(err.message || 'An unexpected error occurred during signup.');
    } finally {
      setIsLoading(false);
    }

  };

  return (
    <div className="relative min-h-screen w-full bg-void text-fg-primary flex items-center justify-center p-6 overflow-hidden font-body">
      <AmbientBackground />
      
      <div className="relative z-10 w-full max-w-[480px]">
        <AnimatePresence mode="wait">
          {step === 1 ? (
            <motion.div
              key="step1"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="text-center mb-12">
                <h1 className="text-display-sm text-white mb-4">Choose Your Path</h1>
                <p className="text-body-lg text-fg-secondary">Select your role to begin your PulseForge experience.</p>
              </div>

              <div className="space-y-4">
                <button
                  onClick={() => handleRoleSelect('mentor')}
                  className="group w-full p-6 rounded-2xl bg-surface/50 border border-border-subtle hover:border-accent-glow/50 hover:bg-surface-raised transition-all flex items-center gap-6 text-left"
                >
                  <div className="w-14 h-14 rounded-full bg-accent-glow/10 border border-accent-glow/20 flex items-center justify-center text-accent-glow group-hover:scale-110 transition-transform">
                    <UserCircle size={28} />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-h3 text-white mb-1">Mentor / Teacher</h3>
                    <p className="text-caption text-fg-tertiary uppercase tracking-wider">Manage cohorts & intelligence</p>
                  </div>
                  <ChevronRight size={20} className="text-fg-tertiary group-hover:text-accent-glow group-hover:translate-x-1 transition-all" />
                </button>

                <button
                  onClick={() => handleRoleSelect('student')}
                  className="group w-full p-6 rounded-2xl bg-surface/50 border border-border-subtle hover:border-accent-glow/50 hover:bg-surface-raised transition-all flex items-center gap-6 text-left"
                >
                  <div className="w-14 h-14 rounded-full bg-info/10 border border-info/20 flex items-center justify-center text-info group-hover:scale-110 transition-transform">
                    <GraduationCap size={28} />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-h3 text-white mb-1">Student / Mentee</h3>
                    <p className="text-caption text-fg-tertiary uppercase tracking-wider">Track progress & assignments</p>
                  </div>
                  <ChevronRight size={20} className="text-fg-tertiary group-hover:text-info group-hover:translate-x-1 transition-all" />
                </button>
              </div>
              
              <div className="mt-8 text-center">
                <p className="text-body text-fg-secondary">
                  Already have an account? <Link to="/login" className="text-accent-glow hover:text-white transition-colors">Sign In</Link>
                </p>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            >
              <button 
                onClick={() => setStep(1)}
                className="flex items-center gap-2 text-label text-fg-tertiary hover:text-white transition-colors mb-8 group"
              >
                <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                Back to Selection
              </button>

              <Card hero className="backdrop-blur-2xl bg-surface/60 border-border-default shadow-raised p-8 md:p-10">
                <div className="mb-8">
                  <h2 className="text-h2 text-white mb-2 capitalize">{role} Account</h2>
                  <p className="text-body text-fg-secondary">Complete your profile details below.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="space-y-2">
                    <label className="block text-label text-fg-secondary uppercase tracking-wider">Full Name</label>
                    <Input name="fullName" placeholder="Nischay B K" required value={formData.fullName} onChange={handleInputChange} />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-label text-fg-secondary uppercase tracking-wider">Email Address</label>
                    <Input name="email" type="email" placeholder="you@theforge.local" required value={formData.email} onChange={handleInputChange} />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-label text-fg-secondary uppercase tracking-wider">Password</label>
                    <Input name="password" type="password" placeholder="••••••••" required value={formData.password} onChange={handleInputChange} />
                  </div>

                  {role === 'mentor' ? (
                    <div className="space-y-2">
                      <label className="block text-label text-fg-secondary uppercase tracking-wider">Department</label>
                      <Input name="department" placeholder="e.g. Computer Science" required value={formData.department} onChange={handleInputChange} />
                    </div>
                  ) : (
                    <>
                      <div className="space-y-2">
                        <label className="block text-label text-fg-secondary uppercase tracking-wider">USN / Roll Number</label>
                        <Input name="usn" placeholder="e.g. 4SH24CS001" required value={formData.usn} onChange={handleInputChange} className="uppercase font-mono" />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="block text-label text-fg-secondary uppercase tracking-wider">Branch</label>
                          <Input name="branch" placeholder="CSE" required value={formData.branch} onChange={handleInputChange} />
                        </div>
                        <div className="space-y-2">
                          <label className="block text-label text-fg-secondary uppercase tracking-wider">Year</label>
                          <Input name="year" type="number" placeholder="2024" required value={formData.year} onChange={handleInputChange} />
                        </div>
                      </div>
                    </>
                  )}

                  {error && <p className="text-micro text-danger text-center bg-danger-bg p-3 rounded-lg border border-danger-border">{error}</p>}

                  <Button type="submit" className="w-full h-12 mt-4 text-void font-bold" disabled={isLoading}>
                    {isLoading ? "Creating Account..." : "Create Account"}
                  </Button>
                </form>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
