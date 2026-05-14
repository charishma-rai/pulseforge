-- ============================================================================
-- PulseForge v2 - Initial Schema
-- Run this in your Supabase SQL Editor (Dashboard → SQL Editor → New Query)
-- ============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- PROFILES TABLE
-- Stores extended user info for both Mentors and Students.
-- Linked to Supabase auth.users (auth is handled by Supabase GoTrue).
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.profiles (
    id          UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
    role        TEXT NOT NULL CHECK (role IN ('mentor', 'student')),
    full_name   TEXT NOT NULL,
    email       TEXT NOT NULL UNIQUE,

    -- Mentor-specific fields
    department  TEXT,

    -- Student-specific fields
    usn         TEXT UNIQUE,
    branch      TEXT,
    year        INTEGER CHECK (year BETWEEN 1 AND 4),

    onboarding_completed BOOLEAN DEFAULT FALSE,
    created_at  TIMESTAMPTZ DEFAULT NOW(),
    updated_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ── RLS for Profiles ─────────────────────────────────────────────────────────
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Anyone can read profiles (needed for mentor names on meetings, etc.)
CREATE POLICY "Profiles are publicly readable."
    ON public.profiles FOR SELECT USING (true);

-- Users can only insert their OWN profile row
CREATE POLICY "Users can insert their own profile."
    ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Users can only update their OWN profile row
CREATE POLICY "Users can update their own profile."
    ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- ============================================================================
-- MEETINGS TABLE
-- Handles mentor availability slots and student meeting requests.
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.meetings (
    id          UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    mentor_id   UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    student_id  UUID REFERENCES public.profiles(id) ON DELETE SET NULL,   -- NULL = open slot

    title       TEXT,
    description TEXT,
    start_time  TIMESTAMPTZ NOT NULL,
    end_time    TIMESTAMPTZ NOT NULL,
    status      TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','accepted','rejected','rescheduled','completed')),
    type        TEXT NOT NULL CHECK (type IN ('slot','request')),     -- 'slot' = mentor created, 'request' = student created
    notes       TEXT,
    meeting_link TEXT,

    created_at  TIMESTAMPTZ DEFAULT NOW(),
    updated_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ── RLS for Meetings ─────────────────────────────────────────────────────────
ALTER TABLE public.meetings ENABLE ROW LEVEL SECURITY;

-- Mentors can do anything with their own meetings
CREATE POLICY "Mentors can fully manage their meetings."
    ON public.meetings FOR ALL
    USING (auth.uid() = mentor_id);

-- Students see open slots OR their own meeting requests
CREATE POLICY "Students see open slots and their own meetings."
    ON public.meetings FOR SELECT
    USING (
        (type = 'slot' AND status = 'pending' AND student_id IS NULL)
        OR (auth.uid() = student_id)
    );

-- Students can create meeting requests
CREATE POLICY "Students can create meeting requests."
    ON public.meetings FOR INSERT
    WITH CHECK (
        auth.uid() = student_id
        AND (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'student'
    );

-- Students can update their own requests (e.g., cancel)
CREATE POLICY "Students can update their own requests."
    ON public.meetings FOR UPDATE
    USING (auth.uid() = student_id);

-- ============================================================================
-- AUTO-UPDATE updated_at TRIGGER
-- ============================================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_meetings_updated_at
    BEFORE UPDATE ON public.meetings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- NOTE: Profile creation is handled EXPLICITLY by the frontend during signup.
-- There are NO database triggers for auto-creating profiles.
-- This is intentional: frontend-managed = more control + better error handling.
-- ============================================================================
