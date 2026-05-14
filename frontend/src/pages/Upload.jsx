import React, { useState } from 'react';
import { PageContainer } from '@/components/layout/PageContainer';
import { Card } from '@/components/core/Card';
import { Button } from '@/components/core/Button';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';
import Papa from 'papaparse';
import * as XLSX from 'xlsx';
import { 
  Upload as UploadIcon, 
  FileText, 
  Users, 
  CheckSquare, 
  AlertCircle, 
  CheckCircle2,
  Loader2,
  Info,
  Sparkles,
  ArrowRight
} from 'lucide-react';

export function Upload() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('students'); // students, attendance
  const [isUploading, setIsUploading] = useState(false);
  const [result, setResult] = useState(null); // { success: boolean, count: number, errors: [] }
  const [pendingData, setPendingData] = useState(null);
  const [mapping, setMapping] = useState(null);
  const [isMapping, setIsMapping] = useState(false);

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsUploading(true);
    setResult(null);
    setPendingData(null);
    setMapping(null);

    const reader = new FileReader();
    reader.onload = async (evt) => {
      try {
        let data = [];
        const fileName = file.name.toLowerCase();
        
        console.info('📂 Processing file:', file.name, 'Size:', file.size);

        if (fileName.endsWith('.csv')) {
          const text = evt.target.result;
          const parsed = Papa.parse(text, { header: true, skipEmptyLines: true });
          data = parsed.data;
          console.log('✅ CSV Parsed. Rows:', data.length);
        } else {
          const dataArray = new Uint8Array(evt.target.result);
          const wb = XLSX.read(dataArray, { type: 'array' });
          const wsname = wb.SheetNames[0];
          const ws = wb.Sheets[wsname];
          data = XLSX.utils.sheet_to_json(ws);
          console.log('✅ Excel Parsed. Rows:', data.length);
        }

        if (!data || data.length === 0) {
          throw new Error('File appears to be empty or in an invalid format.');
        }

        const headers = Object.keys(data[0]);
        const standardHeaders = activeTab === 'students' 
          ? ['full_name', 'usn', 'branch', 'year', 'section']
          : ['usn', 'status', 'date'];

        const isStandard = standardHeaders.every(h => headers.includes(h));

        if (!isStandard) {
          console.info('🤖 Non-standard headers detected. Triggering AI Ingestion layer.');
          setPendingData(data);
          await runAIMapping(headers, data.slice(0, 3));
        } else {
          if (activeTab === 'students') {
            await importStudents(data);
          } else {
            await importAttendance(data);
          }
        }
      } catch (err) {
        console.error('❌ Upload Pipeline Error:', err);
        setResult({ success: false, message: err.message || 'Fatal error during processing' });
      } finally {
        setIsUploading(false);
      }
    };

    if (file.name.toLowerCase().endsWith('.csv')) {
      reader.readAsText(file);
    } else {
      reader.readAsArrayBuffer(file);
    }
  };

  const runAIMapping = async (headers, samples) => {
    setIsMapping(true);
    try {
      const resp = await fetch('/api/ingest-mapping', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ headers, samples, type: activeTab })
      });
      const aiMapping = await resp.json();
      setMapping(aiMapping);
    } catch (err) {
      console.error('AI Mapping failed:', err);
    } finally {
      setIsMapping(false);
    }
  };

  const confirmMapping = async () => {
    if (!pendingData || !mapping) return;
    setIsUploading(true);
    try {
      const normalizedData = pendingData.map(row => {
        const normalized = {};
        Object.entries(mapping).forEach(([target, source]) => {
          normalized[target] = row[source];
        });
        return normalized;
      });

      if (activeTab === 'students') {
        await importStudents(normalizedData);
      } else {
        await importAttendance(normalizedData);
      }
      setPendingData(null);
      setMapping(null);
    } catch (err) {
      setResult({ success: false, message: err.message });
    } finally {
      setIsUploading(false);
    }
  };

  const importStudents = async (data) => {
    // Expected fields: name, usn, branch, year, section
    const formatted = data.map(row => ({
      full_name: row.name || row.full_name,
      usn: row.usn?.toUpperCase(),
      branch: row.branch,
      year: parseInt(row.year, 10),
      section: row.section || 'A',
      mentor_id: user.id
    })).filter(row => row.usn && row.full_name);

    const { error } = await supabase
      .from('allowed_students')
      .upsert(formatted, { onConflict: 'usn' });

    if (error) throw error;
    setResult({ success: true, count: formatted.length, type: 'Student Whitelist' });
  };

  const importAttendance = async (data) => {
    // Expected fields: usn, status, date, session_id (optional)
    const usns = [...new Set(data.map(row => row.usn?.toUpperCase()).filter(Boolean))];
    
    // 1. Map USNs to Profile IDs
    const { data: profiles, error: profileError } = await supabase
      .from('profiles')
      .select('id, usn')
      .in('usn', usns);

    if (profileError) throw profileError;

    const usnMap = profiles.reduce((acc, p) => {
      acc[p.usn] = p.id;
      return acc;
    }, {});

    // 2. Format attendance records
    const today = new Date().toISOString().split('T')[0];
    const records = data.map(row => {
      const studentId = usnMap[row.usn?.toUpperCase()];
      if (!studentId) return null;
      
      return {
        student_id: studentId,
        mentor_id: user.id,
        status: row.status?.toLowerCase() || 'present',
        date: row.date || today,
        session_id: row.session_id || null
      };
    }).filter(Boolean);

    if (records.length === 0) {
      throw new Error('No matching students found for the provided USNs.');
    }

    // 3. Batch insert
    const { error } = await supabase.from('attendance').insert(records);
    if (error) throw error;

    setResult({ success: true, count: records.length, type: 'Bulk Attendance Sync' });
  };

  return (
    <PageContainer>
      <div className="mb-12">
        <h1 className="text-display-lg text-white mb-2">Data Import Engine</h1>
        <p className="text-body-lg text-fg-secondary">Onboard students or sync attendance logs via CSV/Excel.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        
        {/* Type Selection */}
        <div className="space-y-4">
          <button 
            onClick={() => setActiveTab('students')}
            className={`w-full p-6 rounded-2xl border transition-all text-left group ${
              activeTab === 'students' 
                ? 'bg-accent-glow/10 border-accent-glow shadow-focus' 
                : 'bg-surface/20 border-border-subtle hover:bg-surface/40'
            }`}
          >
            <div className={`p-3 rounded-xl mb-4 w-fit transition-colors ${activeTab === 'students' ? 'bg-accent-glow text-void' : 'bg-surface-raised text-fg-tertiary group-hover:text-white'}`}>
              <Users size={24} />
            </div>
            <h3 className={`text-h3 mb-1 ${activeTab === 'students' ? 'text-white' : 'text-fg-secondary'}`}>Student Whitelist</h3>
            <p className="text-body-sm text-fg-tertiary">Pre-verify students for signup using USN and Branch data.</p>
          </button>

          <button 
            onClick={() => setActiveTab('attendance')}
            className={`w-full p-6 rounded-2xl border transition-all text-left group ${
              activeTab === 'attendance' 
                ? 'bg-info/10 border-info shadow-[0_0_20px_rgba(14,165,233,0.2)]' 
                : 'bg-surface/20 border-border-subtle hover:bg-surface/40'
            }`}
          >
            <div className={`p-3 rounded-xl mb-4 w-fit transition-colors ${activeTab === 'attendance' ? 'bg-info text-void' : 'bg-surface-raised text-fg-tertiary group-hover:text-white'}`}>
              <CheckSquare size={24} />
            </div>
            <h3 className={`text-h3 mb-1 ${activeTab === 'attendance' ? 'text-white' : 'text-fg-secondary'}`}>Bulk Attendance</h3>
            <p className="text-body-sm text-fg-tertiary">Sync external attendance logs directly to the database.</p>
          </button>
        </div>

        {/* Upload Zone */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-10 border-dashed border-2 border-border-subtle bg-surface/10 hover:bg-surface/20 transition-all relative flex flex-col items-center justify-center text-center">
            <input 
              type="file" 
              accept=".csv,.xlsx,.xls" 
              className="absolute inset-0 opacity-0 cursor-pointer z-20" 
              onChange={handleFileUpload}
              disabled={isUploading}
            />
            
            {isUploading ? (
              <div className="py-10 flex flex-col items-center">
                <Loader2 className="w-12 h-12 text-accent-glow animate-spin mb-4" />
                <h3 className="text-h3 text-white">Parsing Data...</h3>
                <p className="text-body-sm text-fg-tertiary mt-2">Validating rows and performing batch upserts.</p>
              </div>
            ) : (
              <div className="py-10 flex flex-col items-center">
                <div className="w-20 h-20 rounded-full bg-surface-raised flex items-center justify-center text-fg-tertiary mb-6 group-hover:scale-110 transition-transform">
                  <UploadIcon size={40} />
                </div>
                <h3 className="text-h3 text-white mb-2">Drop files here or click to browse</h3>
                <p className="text-body-sm text-fg-tertiary mb-8">Support for .csv, .xlsx, and .xls files (Max 5MB)</p>
                
                <div className="flex gap-4">
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-surface-raised border border-border-subtle text-[10px] font-bold text-fg-tertiary uppercase tracking-widest">
                    <FileText size={14} /> CSV Template
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-surface-raised border border-border-subtle text-[10px] font-bold text-fg-tertiary uppercase tracking-widest">
                    <Info size={14} /> Format Guide
                  </div>
                </div>
              </div>
            )}
          </Card>

          {/* AI Mapping Layer */}
          {pendingData && (
            <Card className="p-8 border-accent-glow bg-accent-glow/5 animate-in fade-in slide-in-from-bottom-4">
              <div className="flex items-center gap-4 mb-8">
                <div className="p-3 rounded-xl bg-accent-glow text-void">
                  <Sparkles size={24} />
                </div>
                <div>
                  <h3 className="text-h3 text-white">AI Schema Inference</h3>
                  <p className="text-body-sm text-fg-tertiary">We've automatically mapped your file headers to our system.</p>
                </div>
              </div>

              {isMapping ? (
                <div className="py-12 flex flex-col items-center">
                  <Loader2 className="w-10 h-10 text-accent-glow animate-spin mb-4" />
                  <p className="text-label text-fg-tertiary uppercase tracking-widest">Analyzing Data Structure...</p>
                </div>
              ) : mapping ? (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.entries(mapping).map(([target, source]) => (
                      <div key={target} className="flex items-center justify-between p-4 rounded-xl bg-surface/40 border border-border-subtle">
                        <span className="text-micro text-fg-tertiary uppercase font-bold">{target.replace('_', ' ')}</span>
                        <div className="flex items-center gap-2 text-accent-glow">
                          <ArrowRight size={14} />
                          <span className="text-body-sm font-mono">{source}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="flex gap-4 pt-4">
                    <Button variant="secondary" className="flex-1" onClick={() => setPendingData(null)}>Cancel</Button>
                    <Button className="flex-1" onClick={confirmMapping} disabled={isUploading}>
                      {isUploading ? <Loader2 className="animate-spin" /> : 'Confirm & Import'}
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="p-6 rounded-xl bg-danger/5 border border-danger/20 text-center">
                  <p className="text-body-sm text-danger font-medium mb-4">Inference failed for this file structure.</p>
                  <Button variant="secondary" onClick={() => setPendingData(null)}>Try Manual Upload</Button>
                </div>
              )}
            </Card>
          )}

          {/* Results Area */}
          {result && !pendingData && (
            <Card className={`p-6 border ${result.success ? 'bg-success/5 border-success/30' : 'bg-danger/5 border-danger/30'}`}>
              <div className="flex items-start gap-4">
                {result.success ? (
                  <CheckCircle2 className="text-success mt-1" size={24} />
                ) : (
                  <AlertCircle className="text-danger mt-1" size={24} />
                )}
                <div>
                  <h4 className={`text-h4 ${result.success ? 'text-success' : 'text-danger'}`}>
                    {result.success ? 'Import Successful' : 'Import Failed'}
                  </h4>
                  <p className="text-body-sm text-white mt-1">
                    {result.success 
                      ? `Successfully processed ${result.count} rows for ${result.type}.` 
                      : result.message}
                  </p>
                </div>
              </div>
            </Card>
          )}

          {/* Requirements Card */}
          <Card className="p-6 bg-surface/30 border-border-subtle">
            <h4 className="text-label text-fg-tertiary uppercase tracking-widest mb-4">Required Column Headers</h4>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {['full_name', 'usn', 'branch', 'year', 'section'].map(col => (
                <div key={col} className="p-3 rounded-xl bg-void/30 border border-border-subtle font-mono text-micro text-accent-glow">
                  {col}
                </div>
              ))}
            </div>
            <p className="text-micro text-fg-tertiary mt-6 leading-relaxed italic">
              * The USN column is used as a unique identifier. Existing records will be updated automatically.
            </p>
          </Card>
        </div>
      </div>
    </PageContainer>
  );
}
