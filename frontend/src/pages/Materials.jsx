import React, { useState, useEffect } from 'react';
import { PageContainer } from '@/components/layout/PageContainer';
import { Card } from '@/components/core/Card';
import { Button } from '@/components/core/Button';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';
import { 
  Plus, 
  FileText, 
  Link as LinkIcon, 
  Download, 
  Trash2, 
  Folder,
  Search,
  BookOpen,
  Loader2,
  ExternalLink
} from 'lucide-react';
import { motion } from 'framer-motion';

export function Materials() {
  const { user } = useAuth();
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Material groups for visual separation
  const groups = ['Lecture Notes', 'Assignments', 'Reference Material', 'Past Papers'];

  useEffect(() => {
    if (user) {
      fetchMaterials();
    }
  }, [user]);

  const fetchMaterials = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('materials') // Assuming a materials table
        .select('*')
        .eq('mentor_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        // Table might not exist yet, fallback to empty
        setMaterials([]);
      } else {
        setMaterials(data);
      }
    } catch (err) {
      console.error('Error fetching materials:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredMaterials = materials.filter(m => 
    m.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.subject?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <PageContainer>
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div>
          <h1 className="text-display-lg text-white mb-2">Knowledge Base</h1>
          <p className="text-body-lg text-fg-secondary">Distribute resources, assignments, and study materials to your students.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button onClick={() => setIsModalOpen(true)}>
            <Plus size={18} className="mr-2" />
            Upload Material
          </Button>
        </div>
      </div>

      {/* Stats/Quick Info */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
        <Card className="p-6 bg-surface/20 border-border-subtle flex items-center gap-4">
          <div className="p-3 rounded-xl bg-accent-glow/10 text-accent-glow">
            <BookOpen size={24} />
          </div>
          <div>
            <p className="text-micro text-fg-tertiary uppercase tracking-widest font-bold">Total Files</p>
            <p className="text-h3 text-white">{materials.length}</p>
          </div>
        </Card>
        {/* Placeholder for other stats */}
      </div>

      {/* Toolbar */}
      <Card className="p-4 mb-8 bg-surface/20 border-border-subtle flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-fg-tertiary" size={18} />
          <input 
            type="text" 
            placeholder="Search resources by title or subject..." 
            className="w-full h-12 pl-12 pr-4 rounded-xl bg-surface-inset border border-border-subtle text-white focus:outline-none focus:border-accent-glow transition-all"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
        </div>
      </Card>

      {/* Materials Grid */}
      <div className="space-y-12">
        {groups.map(group => {
          const groupItems = filteredMaterials.filter(m => m.category === group);
          return (
            <section key={group}>
              <h2 className="text-h3 text-white mb-6 flex items-center gap-3">
                <Folder size={20} className="text-info" />
                {group}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {loading ? (
                  [1,2,3].map(i => <div key={i} className="h-40 rounded-2xl bg-surface/10 animate-pulse" />)
                ) : groupItems.length > 0 ? (
                  groupItems.map(item => (
                    <Card key={item.id} className="p-6 border-border-subtle bg-surface/10 hover:bg-surface/30 transition-all group overflow-hidden">
                      <div className="flex justify-between items-start mb-4">
                        <div className={`p-2.5 rounded-lg ${item.type === 'link' ? 'bg-info/10 text-info' : 'bg-success/10 text-success'}`}>
                          {item.type === 'link' ? <LinkIcon size={20} /> : <FileText size={20} />}
                        </div>
                        <button className="text-fg-tertiary hover:text-danger transition-colors opacity-0 group-hover:opacity-100">
                          <Trash2 size={16} />
                        </button>
                      </div>
                      
                      <h4 className="text-body text-white font-medium mb-1 line-clamp-1 group-hover:text-accent-glow transition-colors">{item.title}</h4>
                      <p className="text-micro text-fg-tertiary uppercase tracking-widest mb-6">{item.subject}</p>
                      
                      <div className="flex items-center justify-between mt-auto pt-4 border-t border-border-subtle/50">
                        <p className="text-[10px] text-fg-tertiary font-mono">
                          {new Date(item.created_at).toLocaleDateString()}
                        </p>
                        <a 
                          href={item.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center gap-1.5 text-micro text-accent-glow font-bold uppercase tracking-widest hover:underline"
                        >
                          {item.type === 'link' ? 'Open Link' : 'Download'} 
                          {item.type === 'link' ? <ExternalLink size={12} /> : <Download size={12} />}
                        </a>
                      </div>
                    </Card>
                  ))
                ) : (
                  <div className="col-span-full py-12 text-center bg-surface/5 rounded-2xl border border-dashed border-border-subtle">
                    <p className="text-body-sm text-fg-tertiary">No materials in this category.</p>
                  </div>
                )}
              </div>
            </section>
          );
        })}
      </div>

      {/* Upload Modal Stub */}
      {/* (In Phase 3 we'll add real storage upload) */}
    </PageContainer>
  );
}
