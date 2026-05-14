-- ============================================================================
-- PulseForge v2 - Academic Operations Schema
-- Adds Sessions, Attendance, Assignments, Activity Logs
-- ============================================================================

-- ============================================================================
-- SESSIONS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.sessions (
    id SERIAL PRIMARY KEY,
    mentor_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    subject TEXT,
    branch TEXT,
    year INTEGER,
    section TEXT,
    start_time TIMESTAMPTZ NOT NULL,
    end_time TIMESTAMPTZ NOT NULL,
    room TEXT,
    meeting_link TEXT,
    notes TEXT,
    attendance_enabled BOOLEAN DEFAULT true,
    status TEXT DEFAULT 'scheduled',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Mentors can manage their own sessions"
    ON public.sessions FOR ALL
    USING (auth.uid() = mentor_id);

CREATE POLICY "Students can view sessions for their cohort"
    ON public.sessions FOR SELECT
    USING (
        branch = (SELECT branch FROM public.profiles WHERE id = auth.uid())
        AND year = (SELECT year FROM public.profiles WHERE id = auth.uid())
    );

CREATE POLICY "Everyone can view all sessions (temporary for dashboard)"
    ON public.sessions FOR SELECT USING (true);


-- ============================================================================
-- ATTENDANCE TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.attendance (
    id SERIAL PRIMARY KEY,
    mentor_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    student_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    session_id INTEGER REFERENCES public.sessions(id) ON DELETE CASCADE NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('present', 'absent', 'late', 'pending')),
    date DATE NOT NULL,
    marked_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(student_id, session_id)
);

ALTER TABLE public.attendance ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Mentors can manage attendance"
    ON public.attendance FOR ALL
    USING (auth.uid() = mentor_id);

CREATE POLICY "Students can view their own attendance"
    ON public.attendance FOR SELECT
    USING (auth.uid() = student_id);


-- ============================================================================
-- ASSIGNMENTS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.assignments (
    id SERIAL PRIMARY KEY,
    mentor_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    branch TEXT,
    year INTEGER,
    due_date TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.assignments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Mentors can manage assignments"
    ON public.assignments FOR ALL
    USING (auth.uid() = mentor_id);

CREATE POLICY "Students can view their assignments"
    ON public.assignments FOR SELECT
    USING (true);


-- ============================================================================
-- ACTIVITY LOGS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.activity_logs (
    id SERIAL PRIMARY KEY,
    mentor_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    event_type TEXT NOT NULL,
    description TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Mentors can view their own activity logs"
    ON public.activity_logs FOR SELECT
    USING (auth.uid() = mentor_id);

CREATE POLICY "Mentors can insert activity logs"
    ON public.activity_logs FOR INSERT
    WITH CHECK (auth.uid() = mentor_id);
