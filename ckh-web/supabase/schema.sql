-- Initial Supabase Schema for Collaborative Knowledge Hub (CKH)

-- 1. Create Enums
CREATE TYPE public.user_role AS ENUM ('member', 'moderator', 'manager', 'admin');
CREATE TYPE public.resource_type AS ENUM ('glossary_term', 'publication', 'event');
CREATE TYPE public.resource_status AS ENUM ('draft', 'review', 'published');
CREATE TYPE public.provenance_type AS ENUM ('declared', 'curated', 'behavioral');

-- 2. Profiles Table (Extends auth.users)
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  role public.user_role DEFAULT 'member'::public.user_role NOT NULL,
  bio TEXT,
  discoverability_opt_in BOOLEAN DEFAULT false NOT NULL, -- Strict privacy toggle
  stripe_customer_id TEXT UNIQUE,
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
