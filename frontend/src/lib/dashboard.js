import { supabase } from './supabase';

/**
 * Fetches summary statistics for the Mentor Dashboard
 */
export async function getMentorStats(mentorId) {
  try {
    // 1. Total Active Students
    const { count: studentCount, error: studentError } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true })
      .eq('mentor_id', mentorId)
      .eq('role', 'student');

    // 2. Total Sessions Conducted (Unique dates/sessions in attendance)
    // For MVP, we'll count total attendance entries grouped by date/title if available
    const { data: sessions, error: sessionError } = await supabase
      .from('attendance')
      .select('date')
      .eq('mentor_id', mentorId);
    
    const uniqueSessions = new Set((sessions || []).map(s => s.date)).size;

    // 3. Average Attendance
    const totalPossible = sessions?.length || 0;
    const presentCount = sessions?.filter(s => s.status === 'present' || s.status === 'late').length || 0;
    const avgAttendance = totalPossible > 0 ? Math.round((presentCount / totalPossible) * 100) : 0;

    // 4. Pending Verifications
    const { count: pendingCount } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true })
      .eq('mentor_id', mentorId)
      .eq('role', 'student')
      .eq('is_verified', false);

    // 4. Real Metrics for Tasks and Meetings
    const [assignments, meetings] = await Promise.all([
      supabase.from('assignments').select('id', { count: 'exact', head: true }).eq('mentor_id', mentorId),
      supabase.from('meetings').select('id', { count: 'exact', head: true }).eq('mentor_id', mentorId).eq('status', 'accepted')
    ]);

    return {
      studentCount: studentCount || 0,
      sessionCount: uniqueSessions || 0,
      avgAttendance: avgAttendance || 0,
      pendingVerifications: pendingCount || 0,
      assignmentCount: assignments.count || 0,
      meetingCount: meetings.count || 0
    };
  } catch (err) {
    console.error('Error fetching mentor stats:', err);
    return null;
  }
}

/**
 * Fetches students for an attendance session based on branch/year
 */
export async function getStudentsForSession(mentorId, branch, year) {
  const { data, error } = await supabase
    .from('profiles')
    .select('id, full_name, usn')
    .eq('mentor_id', mentorId)
    .eq('branch', branch)
    .eq('year', year)
    .eq('role', 'student');

  if (error) {
    console.error('Error fetching session students:', error);
    return [];
  }
  return data;
}

/**
 * Saves a bulk attendance session
 */
export async function saveAttendanceSession(mentorId, records) {
  // records: [{ student_id, status, date }]
  const { data, error } = await supabase
    .from('attendance')
    .insert(records.map(r => ({
      ...r,
      mentor_id: mentorId
    })));

  if (error) throw error;
  return data;
}

/**
 * Fetches today's agenda for the mentor
 */
export async function getMentorAgenda(mentorId) {
  const today = new Date().toISOString().split('T')[0];
  const { data, error } = await supabase
    .from('meetings')
    .select('*')
    .eq('mentor_id', mentorId)
    .gte('start_time', today);

  if (error) return [];
  return data;
}

/**
 * Creates a new learning session
 */
export async function createSession(sessionData) {
  const { data, error } = await supabase
    .from('sessions')
    .insert([sessionData])
    .select();

  if (error) throw error;
  return data[0];
}

/**
 * Fetches sessions for a mentor
 */
export async function getSessions(mentorId) {
  const { data, error } = await supabase
    .from('sessions')
    .select('*')
    .eq('mentor_id', mentorId)
    .order('start_time', { ascending: true });

  if (error) throw error;
  return data;
}

/**
 * Cancels a session
 */
export async function cancelSession(sessionId) {
  const { error } = await supabase
    .from('sessions')
    .delete()
    .eq('id', sessionId);

  if (error) throw error;
  return true;
}

/**
 * Fetches today's expanded agenda (Sessions, Meetings, Deadlines)
 */
export async function getTodayAgenda(mentorId) {
  try {
    const today = new Date().toISOString().split('T')[0];
    const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];
    
    const [sessions, meetings, assignments] = await Promise.all([
      supabase.from('sessions').select('*').eq('mentor_id', mentorId).gte('start_time', today).lt('start_time', tomorrow),
      supabase.from('meetings').select('*').eq('mentor_id', mentorId).eq('status', 'accepted').gte('start_time', today).lt('start_time', tomorrow),
      supabase.from('assignments').select('*').eq('mentor_id', mentorId).gte('due_date', today).lt('due_date', tomorrow)
    ]);

    return [
      ...(sessions.data || []).map(s => ({ ...s, type: 'session' })),
      ...(meetings.data || []).map(m => ({ ...m, type: 'meeting' })),
      ...(assignments.data || []).map(a => ({ ...a, type: 'assignment' }))
    ].sort((a, b) => new Date(a.start_time || a.due_date) - new Date(b.start_time || b.due_date));
  } catch (err) {
    console.error('Error fetching today agenda:', err);
    return [];
  }
}

/**
 * Fetches recent activity for the mentor
 */
export async function getRecentActivity(mentorId) {
  try {
    const { data, error } = await supabase
      .from('activity_logs')
      .select('*')
      .eq('mentor_id', mentorId)
      .order('created_at', { ascending: false })
      .limit(5);
    
    if (error) throw error;
    return data || [];
  } catch (err) {
    console.error('Error fetching activity:', err);
    return [];
  }
}

/**
 * Functional creation of new Assignment
 */
export async function createAssignment(assignmentData) {
  const { data, error } = await supabase.from('assignments').insert([assignmentData]).select();
  if (error) throw error;
  
  // Log activity
  await logActivity(assignmentData.mentor_id, 'assignment_created', `Created assignment: ${assignmentData.title}`);
  return data[0];
}

/**
 * Log activity for the mentor
 */
export async function logActivity(mentorId, type, description) {
  try {
    await supabase.from('activity_logs').insert([{ mentor_id: mentorId, event_type: type, description }]);
  } catch (err) {
    console.error('Activity logging failed:', err);
  }
}
