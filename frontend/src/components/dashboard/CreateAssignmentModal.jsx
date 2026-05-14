import React, { useState } from 'react';
import { Modal } from '@/components/core/Modal';
import { Button } from '@/components/core/Button';
import { Input } from '@/components/core/Input';
import { createAssignment } from '@/lib/dashboard';
import { BookOpen, Calendar, Users, FileText, Loader2 } from 'lucide-react';

export function CreateAssignmentModal({ isOpen, onClose, onSuccess, mentorId }) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    due_date: '',
    branch: 'Computer Science',
    year: '3',
    section: 'A'
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await createAssignment({
        ...formData,
        mentor_id: mentorId,
        year: parseInt(formData.year, 10),
        due_date: new Date(formData.due_date).toISOString()
      });
      onSuccess?.();
      onClose();
    } catch (err) {
      console.error('Assignment creation failed:', err);
      alert('Failed to create assignment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create Assignment" size="lg">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <Input 
            label="Assignment Title"
            icon={BookOpen}
            placeholder="e.g. Analysis of Algorithms - Lab 4"
            required
            value={formData.title}
            onChange={e => setFormData({ ...formData, title: e.target.value })}
          />

          <div className="space-y-1.5">
            <label className="text-micro text-fg-tertiary uppercase tracking-widest font-bold flex items-center gap-2">
              <FileText size={14} />
              Description & Instructions
            </label>
            <textarea 
              className="w-full min-h-[120px] p-4 rounded-xl bg-surface-inset border border-border-subtle text-white focus:outline-none focus:border-accent-glow transition-all resize-none text-body-sm"
              placeholder="Detail out the requirements, submission format, and objectives..."
              value={formData.description}
              onChange={e => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input 
              type="datetime-local"
              label="Submission Deadline"
              icon={Calendar}
              required
              value={formData.due_date}
              onChange={e => setFormData({ ...formData, due_date: e.target.value })}
            />
            <div className="space-y-1.5">
              <label className="text-micro text-fg-tertiary uppercase tracking-widest font-bold flex items-center gap-2">
                <Users size={14} />
                Target Cohort
              </label>
              <div className="flex gap-2">
                <select 
                  className="flex-1 h-12 px-4 rounded-xl bg-surface-inset border border-border-subtle text-white focus:outline-none focus:border-accent-glow appearance-none cursor-pointer text-body-sm"
                  value={formData.branch}
                  onChange={e => setFormData({ ...formData, branch: e.target.value })}
                >
                  <option>Computer Science</option>
                  <option>Information Science</option>
                  <option>Electronics</option>
                </select>
                <select 
                  className="w-20 h-12 px-4 rounded-xl bg-surface-inset border border-border-subtle text-white focus:outline-none focus:border-accent-glow appearance-none cursor-pointer text-body-sm text-center"
                  value={formData.year}
                  onChange={e => setFormData({ ...formData, year: e.target.value })}
                >
                  <option>1</option>
                  <option>2</option>
                  <option>3</option>
                  <option>4</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-3 pt-4">
          <Button variant="secondary" className="flex-1" type="button" onClick={onClose}>
            Cancel
          </Button>
          <Button className="flex-1" type="submit" disabled={loading}>
            {loading ? <Loader2 className="animate-spin" /> : 'Distribute Assignment'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
