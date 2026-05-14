import React, { useState } from 'react';
import { Modal } from '@/components/core/Modal';
import { Input } from '@/components/core/Input';
import { Button } from '@/components/core/Button';
import { useAuth } from '@/context/AuthContext';
import { createSession } from '@/lib/dashboard';
import { Loader2 } from 'lucide-react';

export function CreateSessionModal({ isOpen, onClose, onSuccess }) {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    subject: '',
    branch: 'Computer Science',
    year: '3',
    section: 'A',
    start_time: '',
    end_time: '',
    room: '',
    meeting_link: '',
    notes: '',
    attendance_enabled: true
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await createSession({
        ...formData,
        mentor_id: user.id,
        year: parseInt(formData.year, 10),
        start_time: new Date(formData.start_time).toISOString(),
        end_time: new Date(formData.end_time).toISOString(),
        status: 'scheduled'
      });
      onSuccess();
      onClose();
    } catch (err) {
      alert('Failed to create session: ' + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create New Session">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2 col-span-2">
            <label className="text-label text-fg-tertiary uppercase tracking-widest">Session Title</label>
            <Input 
              required 
              placeholder="e.g. Data Structures Lecture" 
              value={formData.title} 
              onChange={e => setFormData({...formData, title: e.target.value})} 
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-label text-fg-tertiary uppercase tracking-widest">Subject</label>
            <Input 
              placeholder="e.g. CS301" 
              value={formData.subject} 
              onChange={e => setFormData({...formData, subject: e.target.value})} 
            />
          </div>

          <div className="space-y-2">
            <label className="text-label text-fg-tertiary uppercase tracking-widest">Branch</label>
            <select 
              className="w-full h-11 px-4 rounded-xl bg-surface-inset border border-border-subtle text-white focus:outline-none focus:border-accent-glow"
              value={formData.branch}
              onChange={e => setFormData({...formData, branch: e.target.value})}
            >
              <option>Computer Science</option>
              <option>Information Science</option>
              <option>Electronics</option>
              <option>Mechanical</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-label text-fg-tertiary uppercase tracking-widest">Year</label>
            <select 
              className="w-full h-11 px-4 rounded-xl bg-surface-inset border border-border-subtle text-white focus:outline-none focus:border-accent-glow"
              value={formData.year}
              onChange={e => setFormData({...formData, year: e.target.value})}
            >
              <option>1</option>
              <option>2</option>
              <option>3</option>
              <option>4</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-label text-fg-tertiary uppercase tracking-widest">Section</label>
            <Input 
              placeholder="e.g. A" 
              value={formData.section} 
              onChange={e => setFormData({...formData, section: e.target.value})} 
            />
          </div>

          <div className="space-y-2">
            <label className="text-label text-fg-tertiary uppercase tracking-widest">Start Time</label>
            <Input 
              type="datetime-local" 
              required 
              value={formData.start_time} 
              onChange={e => setFormData({...formData, start_time: e.target.value})} 
            />
          </div>

          <div className="space-y-2">
            <label className="text-label text-fg-tertiary uppercase tracking-widest">End Time</label>
            <Input 
              type="datetime-local" 
              required 
              value={formData.end_time} 
              onChange={e => setFormData({...formData, end_time: e.target.value})} 
            />
          </div>

          <div className="space-y-2 col-span-2">
            <label className="text-label text-fg-tertiary uppercase tracking-widest">Room / Physical Location</label>
            <Input 
              placeholder="e.g. Room 204 or Seminar Hall" 
              value={formData.room} 
              onChange={e => setFormData({...formData, room: e.target.value})} 
            />
          </div>

          <div className="space-y-2 col-span-2">
            <label className="text-label text-fg-tertiary uppercase tracking-widest">Meeting Link (Optional)</label>
            <Input 
              placeholder="e.g. https://meet.google.com/xyz" 
              value={formData.meeting_link} 
              onChange={e => setFormData({...formData, meeting_link: e.target.value})} 
            />
          </div>

          <div className="space-y-2 col-span-2">
            <label className="text-label text-fg-tertiary uppercase tracking-widest">Additional Notes</label>
            <textarea 
              className="w-full h-24 px-4 py-3 rounded-xl bg-surface-inset border border-border-subtle text-white focus:outline-none focus:border-accent-glow"
              placeholder="Optional session context..."
              value={formData.notes}
              onChange={e => setFormData({...formData, notes: e.target.value})}
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <input 
            type="checkbox" 
            id="attendance" 
            checked={formData.attendance_enabled} 
            onChange={e => setFormData({...formData, attendance_enabled: e.target.checked})}
            className="w-4 h-4 accent-accent-glow"
          />
          <label htmlFor="attendance" className="text-body-sm text-fg-secondary cursor-pointer">Enable Attendance Marking for this session</label>
        </div>

        <Button type="submit" className="w-full h-12 text-void font-bold" disabled={isLoading}>
          {isLoading ? <Loader2 className="animate-spin" /> : 'CREATE SESSION'}
        </Button>
      </form>
    </Modal>
  );
}
