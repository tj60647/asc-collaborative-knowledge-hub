-- Initial Supabase Schema for Collaborative Knowledge Hub (CKH)
CREATE EXTENSION IF NOT EXISTS vector;

-- 1. Create Enums
CREATE TYPE public.user_role AS ENUM ('member', 'moderator', 'manager', 'admin');
CREATE TYPE public.resource_type AS ENUM ('glossary_term', 'publication', 'event');
CREATE TYPE public.resource_status AS ENUM ('draft', 'review', 'published');
CREATE TYPE public.provenance_type AS ENUM ('declared', 'curated', 'behavioral');

CREATE TYPE public.report_status AS ENUM ('pending', 'resolved', 'dismissed');

-- 2. Profiles Table (Extends auth.users)
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  role public.user_role DEFAULT 'member'::public.user_role NOT NULL,
  bio TEXT,
  discoverability_opt_in BOOLEAN DEFAULT false NOT NULL, -- Strict privacy toggle
  stripe_customer_id TEXT UNIQUE,
  stripe_subscription_id TEXT UNIQUE,
  subscription_status TEXT DEFAULT 'inactive',
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 3. Resources Table (Glossary, Publications, etc.)
CREATE TABLE public.resources (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  type public.resource_type NOT NULL,
  author_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  status public.resource_status DEFAULT 'draft'::public.resource_status NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 4. Tags Table
CREATE TABLE public.tags (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  description TEXT
);

-- 5. Provenanced Relationships Table (The "Graph-Ready" Foundation)
CREATE TABLE public.relationships (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  source_id UUID NOT NULL, -- Can be profile_id or resource_id
  target_id UUID NOT NULL, -- Can be resource_id or tag_id
  relation_type TEXT NOT NULL, -- e.g., 'bookmarked', 'authored', 'tagged_with'
  provenance public.provenance_type NOT NULL, -- 'declared', 'curated', 'behavioral'
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  UNIQUE(source_id, target_id, relation_type)
);

-- 6. Row Level Security (RLS) Policies
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.relationships ENABLE ROW LEVEL SECURITY;

-- Profiles: Viewable if discoverability is ON, or if it's the current user
CREATE POLICY "Profiles are viewable by opted-in members or self" ON public.profiles
  FOR SELECT USING (discoverability_opt_in = true OR auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- Resources: Viewable if published, or if current user is the author
CREATE POLICY "Resources are viewable if published or author" ON public.resources
  FOR SELECT USING (status = 'published'::public.resource_status OR auth.uid() = author_id);

-- 7. Moderation Reports Table
CREATE TABLE public.moderation_reports (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  reporter_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  resource_id UUID REFERENCES public.resources(id) ON DELETE CASCADE,
  reason TEXT NOT NULL,
  status public.report_status DEFAULT 'pending'::public.report_status NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

ALTER TABLE public.moderation_reports ENABLE ROW LEVEL SECURITY;

-- Reports: Members can insert reports. Only moderators/admins can view.
-- (For MVP, we allow authenticated users to insert, but no SELECT policy is provided so standard users cannot read reports).
CREATE POLICY "Users can submit reports" ON public.moderation_reports
  FOR INSERT WITH CHECK (auth.uid() = reporter_id);

-- 8. Events Table (Phase 6: Native Calendar)
CREATE TYPE public.event_status AS ENUM ('draft', 'published', 'cancelled');

CREATE TABLE public.events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  short_description TEXT,
  long_description TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  embedding vector(1536),
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ NOT NULL,
  location TEXT,
  url TEXT,
  organizer_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  status public.event_status DEFAULT 'draft'::public.event_status NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

-- Events: Viewable if published
CREATE POLICY "Events are viewable if published" ON public.events
  FOR SELECT USING (status = 'published'::public.event_status);

-- We assume inserts/updates are handled via the secure server-side admin portal,
-- so we do not expose direct INSERT/UPDATE policies to regular users for events yet.

-- 9. Semantic Search Functions
CREATE OR REPLACE FUNCTION match_events(
  query_embedding vector(1536),
  match_threshold float,
  match_count int
)
RETURNS TABLE (
  id UUID,
  title TEXT,
  short_description TEXT,
  similarity float
)
LANGUAGE sql STABLE
AS $$
  SELECT
    events.id,
    events.title,
    events.short_description,
    1 - (events.embedding <=> query_embedding) AS similarity
  FROM public.events
  WHERE status = 'published'::public.event_status
    AND 1 - (events.embedding <=> query_embedding) > match_threshold
  ORDER BY similarity DESC
  LIMIT match_count;
$$;
