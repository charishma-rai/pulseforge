import React, { useState } from 'react';
import { Card } from '@/components/core/Card';
import { 
  Plus, 
  Upload, 
  CheckCircle, 
  Calendar,
  FileText
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { CreateAssignmentModal } from './CreateAssignmentModal';
import { ScheduleMeetingModal } from './ScheduleMeetingModal';

export function QuickActions({ onUpdate }) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeModal, setActiveModal] = useState(null); // 'assignment', 'meeting'

  const actions = [
    { 
      id: 'assignment',
      label: 'Create Assignment', 
      icon: FileText, 
      color: 'text-accent-glow', 
      bg: 'bg-accent-glow/10',
      action: () => setActiveModal('assignment')
    },
    { 
      id: 'upload',
      label: 'Bulk Import CSV', 
      icon: Upload, 
      color: 'text-info', 
      bg: 'bg-info/10',
      action: () => navigate('/upload')
    },
    { 
      id: 'verify',
      label: 'Verify Students', 
      icon: CheckCircle, 
      color: 'text-success', 
      bg: 'bg-success/10',
      action: () => navigate('/students')
    },
    { 
      id: 'meeting',
      label: 'Schedule Meeting', 
      icon: Calendar, 
      color: 'text-warning', 
      bg: 'bg-warning/10',
      action: () => setActiveModal('meeting')
    }
  ];

  return (
    <div className="grid grid-cols-1 gap-4">
      {actions.map((action) => (
        <button
          key={action.id}
          onClick={action.action}
          className="flex items-center gap-4 p-4 rounded-2xl bg-surface/20 border border-border-subtle hover:bg-surface/40 hover:border-accent-glow/50 transition-all group text-left"
        >
          <div className={`p-3 rounded-xl ${action.bg} ${action.color} group-hover:scale-110 transition-transform`}>
            <action.icon size={20} />
          </div>
          <span className="text-body-sm font-medium text-white group-hover:translate-x-1 transition-transform">{action.label}</span>
          <Plus size={16} className="ml-auto text-fg-tertiary opacity-0 group-hover:opacity-100 transition-all" />
        </button>
      ))}

      <CreateAssignmentModal 
        isOpen={activeModal === 'assignment'}
        onClose={() => setActiveModal(null)}
        onSuccess={onUpdate}
        mentorId={user?.id}
      />

      <ScheduleMeetingModal 
        isOpen={activeModal === 'meeting'}
        onClose={() => setActiveModal(null)}
        onSuccess={onUpdate}
        mentorId={user?.id}
      />
    </div>
  );
}
