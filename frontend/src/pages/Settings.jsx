import React, { useState, useEffect } from 'react';
import { PageContainer } from '@/components/layout/PageContainer';
import { Card } from '@/components/core/Card';
import { Button } from '@/components/core/Button';
import { Input } from '@/components/core/Input';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';
import { 
  User, 
  Mail, 
  Building2, 
  Shield, 
  Bell, 
  Lock, 
  Globe,
  Loader2,
  CheckCircle2
} from 'lucide-react';
import { motion } from 'framer-motion';

export function Settings() {
  const { user, profile, refreshProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    full_name: '',
    branch: '',
    department: 'Computer Science & Engineering',
    email: '',
    notifications_enabled: true
  });

  useEffect(() => {
    if (profile) {
      setFormData({
        full_name: profile.full_name || '',
        branch: profile.branch || '',
        department: profile.department || 'Computer Science & Engineering',
        email: user.email || '',
        notifications_enabled: true
      });
    }
  }, [profile, user]);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: formData.full_name,
          branch: formData.branch
        })
        .eq('id', user.id);

      if (error) throw error;
      
      await refreshProfile();
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error('Update profile error:', err);
      alert('Failed to update profile.');
    } finally {
      setLoading(false);
    }
  };

  const sections = [
    { id: 'profile', label: 'Mentor Profile', icon: User },
    { id: 'security', label: 'Security & Access', icon: Lock },
    { id: 'notifications', label: 'Preferences', icon: Bell },
  ];

  const [activeSection, setActiveSection] = useState('profile');

  return (
    <PageContainer>
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div>
          <h1 className="text-display-lg text-white mb-2">System Settings</h1>
          <p className="text-body-lg text-fg-secondary">Manage your mentor identity and platform configuration.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
        {/* Navigation */}
        <div className="space-y-2">
          {sections.map(section => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`w-full flex items-center gap-3 px-6 py-4 rounded-2xl transition-all font-medium ${
                activeSection === section.id 
                ? 'bg-accent-glow/10 text-accent-glow border border-accent-glow/20 shadow-glow-sm' 
                : 'text-fg-tertiary hover:text-white hover:bg-surface/30 border border-transparent'
              }`}
            >
              <section.icon size={18} />
              {section.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="lg:col-span-3">
          <motion.div
            key={activeSection}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {activeSection === 'profile' && (
              <form onSubmit={handleUpdateProfile} className="space-y-8">
                <Card className="p-8 border-border-subtle bg-surface/20 space-y-8">
                  <div className="flex items-center gap-6 pb-8 border-b border-border-subtle/50">
                    <div className="w-20 h-20 rounded-3xl bg-accent-glow/10 border border-accent-glow/20 flex items-center justify-center text-accent-glow font-bold text-3xl">
                      {formData.full_name?.[0]}
                    </div>
                    <div>
                      <h3 className="text-h3 text-white mb-1">Mentor Identity</h3>
                      <p className="text-body-sm text-fg-tertiary">Your public profile info as seen by students.</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input 
                      label="Full Professional Name"
                      icon={User}
                      required
                      value={formData.full_name}
                      onChange={e => setFormData({...formData, full_name: e.target.value})}
                    />
                    <Input 
                      label="Email Address (Login)"
                      icon={Mail}
                      disabled
                      value={formData.email}
                    />
                    <Input 
                      label="Designated Branch"
                      icon={Building2}
                      placeholder="e.g. Computer Science"
                      value={formData.branch}
                      onChange={e => setFormData({...formData, branch: e.target.value})}
                    />
                    <Input 
                      label="Institution Department"
                      icon={Shield}
                      disabled
                      value={formData.department}
                    />
                  </div>

                  <div className="pt-6 flex items-center justify-between">
                    <div className="space-y-1">
                      {success && (
                        <div className="flex items-center gap-2 text-success text-body-sm font-bold animate-in fade-in slide-in-from-left-2">
                          <CheckCircle2 size={16} />
                          Changes saved successfully
                        </div>
                      )}
                    </div>
                    <Button type="submit" disabled={loading} className="min-w-[160px]">
                      {loading ? <Loader2 className="animate-spin" /> : 'Save Changes'}
                    </Button>
                  </div>
                </Card>

                <Card className="p-8 border-border-subtle bg-surface/20">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="p-3 rounded-xl bg-info/10 text-info">
                        <Globe size={20} />
                      </div>
                      <div>
                        <h4 className="text-body font-bold text-white">Public Directory</h4>
                        <p className="text-caption text-fg-tertiary">Allow students to find you in the mentor directory.</p>
                      </div>
                    </div>
                    <div className="w-12 h-6 rounded-full bg-accent-glow p-1 flex justify-end cursor-pointer">
                      <div className="w-4 h-4 rounded-full bg-void" />
                    </div>
                  </div>
                </Card>
              </form>
            )}

            {activeSection === 'security' && (
              <Card className="p-8 border-border-subtle bg-surface/20 space-y-8">
                <h3 className="text-h3 text-white">Security Controls</h3>
                <div className="space-y-4">
                  <div className="p-6 rounded-2xl bg-surface-raised/50 border border-border-subtle flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <Lock size={20} className="text-fg-tertiary" />
                      <div>
                        <p className="text-body font-medium text-white">Update Password</p>
                        <p className="text-caption text-fg-tertiary">Secure your account with a new high-entropy password.</p>
                      </div>
                    </div>
                    <Button variant="secondary" size="sm">Manage</Button>
                  </div>
                  <div className="p-6 rounded-2xl bg-surface-raised/50 border border-border-subtle flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <Shield size={20} className="text-fg-tertiary" />
                      <div>
                        <p className="text-body font-medium text-white">Two-Factor Auth</p>
                        <p className="text-caption text-fg-tertiary">Add an extra layer of security via authenticator app.</p>
                      </div>
                    </div>
                    <Button variant="secondary" size="sm">Enable</Button>
                  </div>
                </div>
              </Card>
            )}

            {activeSection === 'notifications' && (
              <Card className="p-8 border-border-subtle bg-surface/20 space-y-8">
                <h3 className="text-h3 text-white">Notification Preferences</h3>
                <div className="space-y-6">
                  {[
                    { label: 'New Student Signup', desc: 'Alert when a student registers with your USN prefix.' },
                    { label: 'Session Reminders', desc: 'Notify 15 mins before your scheduled session starts.' },
                    { label: 'Assignment Submissions', desc: 'Daily digest of student assignment uploads.' },
                    { label: 'System Updates', desc: 'Announcements about new PulseForge features.' },
                  ].map((pref, i) => (
                    <div key={i} className="flex items-center justify-between py-4 border-b border-border-subtle/30 last:border-0">
                      <div>
                        <p className="text-body font-medium text-white">{pref.label}</p>
                        <p className="text-caption text-fg-tertiary">{pref.desc}</p>
                      </div>
                      <div className="w-12 h-6 rounded-full bg-accent-glow p-1 flex justify-end cursor-pointer">
                        <div className="w-4 h-4 rounded-full bg-void" />
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </motion.div>
        </div>
      </div>
    </PageContainer>
  );
}
