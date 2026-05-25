-- Initial Supabase Schema for Collaborative Knowledge Hub (CKH)

-- Create custom schema and configure API access
CREATE SCHEMA IF NOT EXISTS asc_ckh;
GRANT USAGE ON SCHEMA asc_ckh TO anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA asc_ckh TO anon, authenticated, service_role;
GRANT ALL ON ALL ROUTINES IN SCHEMA asc_ckh TO anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA asc_ckh TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA asc_ckh GRANT ALL ON TABLES TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA asc_ckh GRANT ALL ON ROUTINES TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA asc_ckh GRANT ALL ON SEQUENCES TO anon, authenticated, service_role;

-- Expose asc_ckh to PostgREST API
ALTER ROLE authenticator SET pgrst.db_schemas = 'public, storage, graphql_public, asc_ckh';
NOTIFY pgrst, 'reload config';

CREATE EXTENSION IF NOT EXISTS vector WITH SCHEMA public;

-- 1. Create Enums
CREATE TYPE asc_ckh.user_role AS ENUM ('member', 'moderator', 'manager', 'admin');
CREATE TYPE asc_ckh.resource_type AS ENUM ('glossary_term', 'publication', 'event');
CREATE TYPE asc_ckh.resource_status AS ENUM ('draft', 'review', 'published');
CREATE TYPE asc_ckh.provenance_type AS ENUM ('declared', 'curated', 'behavioral');
CREATE TYPE asc_ckh.report_status AS ENUM ('pending', 'resolved', 'dismissed');

-- 2. Profiles Table (Extends auth.users)
CREATE TABLE asc_ckh.user_profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  role asc_ckh.user_role DEFAULT 'member'::asc_ckh.user_role NOT NULL,
  bio TEXT,
  discoverability_opt_in BOOLEAN DEFAULT false NOT NULL,
  stripe_customer_id TEXT UNIQUE,
  stripe_subscription_id TEXT UNIQUE,
  subscription_status TEXT DEFAULT 'inactive',
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 3. Resources Table (Glossary, Publications, etc.)
CREATE TABLE asc_ckh.knowledge_resources (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  type asc_ckh.resource_type NOT NULL,
  author_id UUID REFERENCES asc_ckh.user_profiles(id) ON DELETE SET NULL,
  status asc_ckh.resource_status DEFAULT 'draft'::asc_ckh.resource_status NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 4. Tags Table
CREATE TABLE asc_ckh.semantic_tags (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  description TEXT
);

-- 5. Provenanced Relationships Table (The "Graph-Ready" Foundation)
CREATE TABLE asc_ckh.provenance_graph_edges (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  source_id UUID NOT NULL,
  target_id UUID NOT NULL,
  relation_type TEXT NOT NULL,
  provenance asc_ckh.provenance_type NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  UNIQUE(source_id, target_id, relation_type)
);

-- 6. Row Level Security (RLS) Policies
ALTER TABLE asc_ckh.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE asc_ckh.knowledge_resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE asc_ckh.provenance_graph_edges ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Profiles are viewable by opted-in members or self" ON asc_ckh.user_profiles
  FOR SELECT USING (discoverability_opt_in = true OR auth.uid() = id);

CREATE POLICY "Users can update own profile" ON asc_ckh.user_profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Resources are viewable if published or author" ON asc_ckh.knowledge_resources
  FOR SELECT USING (status = 'published'::asc_ckh.resource_status OR auth.uid() = author_id);

-- 7. Moderation Reports Table
CREATE TABLE asc_ckh.safety_reports (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  reporter_id UUID REFERENCES asc_ckh.user_profiles(id) ON DELETE SET NULL,
  resource_id UUID REFERENCES asc_ckh.knowledge_resources(id) ON DELETE CASCADE,
  reason TEXT NOT NULL,
  status asc_ckh.report_status DEFAULT 'pending'::asc_ckh.report_status NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

ALTER TABLE asc_ckh.safety_reports ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can submit reports" ON asc_ckh.safety_reports
  FOR INSERT WITH CHECK (auth.uid() = reporter_id);

-- 8. Events Table
CREATE TYPE asc_ckh.event_status AS ENUM ('draft', 'published', 'cancelled');

CREATE TABLE asc_ckh.community_events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  short_description TEXT,
  long_description TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  embedding public.vector(1536),
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ NOT NULL,
  location TEXT,
  url TEXT,
  organizer_id UUID REFERENCES asc_ckh.user_profiles(id) ON DELETE SET NULL,
  status asc_ckh.event_status DEFAULT 'draft'::asc_ckh.event_status NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

ALTER TABLE asc_ckh.community_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Events are viewable if published" ON asc_ckh.community_events
  FOR SELECT USING (status = 'published'::asc_ckh.event_status);

-- 9. Semantic Search Functions
CREATE OR REPLACE FUNCTION asc_ckh.match_events(
  query_embedding public.vector(1536),
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
    community_events.id,
    community_events.title,
    community_events.short_description,
    1 - (community_events.embedding <=> query_embedding) AS similarity
  FROM asc_ckh.community_events
  WHERE status = 'published'::asc_ckh.event_status
    AND 1 - (community_events.embedding <=> query_embedding) > match_threshold
  ORDER BY similarity DESC
  LIMIT match_count;
$$;
