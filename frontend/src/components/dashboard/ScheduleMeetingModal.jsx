import React, { useState } from 'react';
import { Modal } from '@/components/core/Modal';
import { Button } from '@/components/core/Button';
import { Input } from '@/components/core/Input';
import { supabase } from '@/lib/supabase';
import { logActivity } from '@/lib/dashboard';
import { Video, Calendar, Clock, Link as LinkIcon, Loader2, AlignLeft } from 'lucide-react';

export function ScheduleMeetingModal({ isOpen, onClose, onSuccess, mentorId }) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    date: '',
    time: '',
    duration: '30',
    type: 'online',
    meeting_link: '',
    notes: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const startTime = new Date(`${formData.date}T${formData.time}`);
      const endTime = new Date(startTime.getTime() + parseInt(formData.duration) * 60000);

      const { error } = await supabase.from('meetings').insert([{
        mentor_id: mentorId,
        title: formData.title,
        start_time: startTime.toISOString(),
        end_time: endTime.toISOString(),
        type: formData.type,
        meeting_link: formData.meeting_link,
        notes: formData.notes,
        status: 'accepted' // Mentors auto-accept their own scheduled meetings
      }]);

      if (error) throw error;

      await logActivity(mentorId, 'meeting_scheduled', `Scheduled meeting: ${formData.title}`);
      
      onSuccess?.();
      onClose();
    } catch (err) {
      console.error('Meeting scheduling failed:', err);
      alert('Failed to schedule meeting.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Schedule Mentorship Meeting" size="lg">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <Input 
            label="Meeting Subject"
            icon={Video}
            placeholder="e.g. Project Review - Batch B"
            required
            value={formData.title}
            onChange={e => setFormData({ ...formData, title: e.target.value })}
          />

          <div className="grid grid-cols-2 gap-4">
            <Input 
              type="date"
              label="Date"
              icon={Calendar}
              required
              value={formData.date}
              onChange={e => setFormData({ ...formData, date: e.target.value })}
            />
            <Input 
              type="time"
              label="Start Time"
              icon={Clock}
              required
              value={formData.time}
              onChange={e => setFormData({ ...formData, time: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-micro text-fg-tertiary uppercase tracking-widest font-bold">Duration (min)</label>
              <select 
                className="w-full h-12 px-4 rounded-xl bg-surface-inset border border-border-subtle text-white focus:outline-none focus:border-accent-glow appearance-none cursor-pointer"
                value={formData.duration}
                onChange={e => setFormData({ ...formData, duration: e.target.value })}
              >
                <option value="15">15 Minutes</option>
                <option value="30">30 Minutes</option>
                <option value="60">1 Hour</option>
                <option value="90">1.5 Hours</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-micro text-fg-tertiary uppercase tracking-widest font-bold">Meeting Type</label>
              <select 
                className="w-full h-12 px-4 rounded-xl bg-surface-inset border border-border-subtle text-white focus:outline-none focus:border-accent-glow appearance-none cursor-pointer"
                value={formData.type}
                onChange={e => setFormData({ ...formData, type: e.target.value })}
              >
                <option value="online">Online (Video Call)</option>
                <option value="physical">Physical (In-Person)</option>
              </select>
            </div>
          </div>

          <Input 
            label="Meeting Link / Location"
            icon={LinkIcon}
            placeholder="Google Meet Link or Office Room #"
            value={formData.meeting_link}
            onChange={e => setFormData({ ...formData, meeting_link: e.target.value })}
          />

          <div className="space-y-1.5">
            <label className="text-micro text-fg-tertiary uppercase tracking-widest font-bold flex items-center gap-2">
              <AlignLeft size={14} />
              Private Notes
            </label>
            <textarea 
              className="w-full min-h-[80px] p-4 rounded-xl bg-surface-inset border border-border-subtle text-white focus:outline-none focus:border-accent-glow transition-all resize-none text-body-sm"
              placeholder="Any specific context for this meeting..."
              value={formData.notes}
              onChange={e => setFormData({ ...formData, notes: e.target.value })}
            />
          </div>
        </div>

        <div className="flex gap-3 pt-4">
          <Button variant="secondary" className="flex-1" type="button" onClick={onClose}>
            Cancel
          </Button>
          <Button className="flex-1" type="submit" disabled={loading}>
            {loading ? <Loader2 className="animate-spin" /> : 'Schedule Meeting'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
