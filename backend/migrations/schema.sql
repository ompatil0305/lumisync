-- Ensure extensions schema exists and is in search path
CREATE SCHEMA IF NOT EXISTS extensions;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp" SCHEMA extensions;
CREATE EXTENSION IF NOT EXISTS "vector" SCHEMA extensions;
SET search_path TO public, extensions;

-- 1. Buildings Table
CREATE TABLE IF NOT EXISTS buildings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT UNIQUE NOT NULL,
  official_number TEXT,
  name TEXT NOT NULL,
  aliases TEXT[],
  category TEXT NOT NULL, -- academic, dining, parking, residence, recreation, library, admin, other
  latitude DOUBLE PRECISION NOT NULL,
  longitude DOUBLE PRECISION NOT NULL,
  footprint JSONB, -- GeoJSON polygon if available
  entrances JSONB,
  hours JSONB,
  wheelchair_entrance BOOLEAN DEFAULT false,
  elevator_available BOOLEAN DEFAULT false,
  photos TEXT[],
  last_verified DATE,
  needs_verification BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Faculty Table
CREATE TABLE IF NOT EXISTS faculty (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  full_name TEXT NOT NULL,
  title TEXT,
  department TEXT NOT NULL,
  college TEXT,
  email TEXT,
  phone TEXT,
  office_building_id UUID REFERENCES buildings(id) ON DELETE SET NULL,
  office_room TEXT,
  office_hours TEXT,
  profile_url TEXT, -- link to official department profile page
  source_department_page TEXT, -- provenance scraping source
  last_verified DATE,
  needs_verification BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Issue Reports Table
CREATE TABLE IF NOT EXISTS issue_reports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  entity_type TEXT NOT NULL, -- 'building' or 'faculty'
  entity_id UUID NOT NULL,
  issue_description TEXT NOT NULL,
  reporter_contact TEXT,
  status TEXT DEFAULT 'open', -- open, resolved, dismissed
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 4. TTU Knowledge Chunks Table (for RAG)
CREATE TABLE IF NOT EXISTS ttu_knowledge_chunks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  content TEXT NOT NULL,
  embedding vector(768), -- Gemini text-embedding-004
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS buildings_slug_idx ON buildings(slug);
CREATE INDEX IF NOT EXISTS faculty_dept_idx ON faculty(department);
CREATE INDEX IF NOT EXISTS ttu_knowledge_embedding_idx ON ttu_knowledge_chunks USING hnsw (embedding vector_cosine_ops);

-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- Our backend connects via the postgres service role (DATABASE_URL)
-- which bypasses RLS automatically. These policies allow the
-- Supabase PostgREST layer to also serve reads safely.
-- ============================================================

-- Enable RLS on all tables
ALTER TABLE buildings ENABLE ROW LEVEL SECURITY;
ALTER TABLE faculty ENABLE ROW LEVEL SECURITY;
ALTER TABLE issue_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE ttu_knowledge_chunks ENABLE ROW LEVEL SECURITY;

-- Buildings: allow public anonymous read (campus map data is public info)
CREATE POLICY IF NOT EXISTS "buildings_public_read"
  ON buildings FOR SELECT
  USING (true);

-- Faculty: allow public anonymous read (directory data is public info)
CREATE POLICY IF NOT EXISTS "faculty_public_read"
  ON faculty FOR SELECT
  USING (true);

-- Issue Reports: allow anonymous INSERT (students submit reports)
-- but block SELECT (reports are private, only viewable by admins via service role)
CREATE POLICY IF NOT EXISTS "issue_reports_public_insert"
  ON issue_reports FOR INSERT
  WITH CHECK (true);

-- TTU Knowledge Chunks: completely block PostgREST access (internal RAG use only)
-- Backend uses service role which bypasses RLS, so RAG still works.
-- No SELECT/INSERT policies = denied to anon/authenticated roles via PostgREST.

-- 5. Waitlist Signups Table
CREATE TABLE IF NOT EXISTS waitlist_signups (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  university TEXT NOT NULL,
  year TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE waitlist_signups ENABLE ROW LEVEL SECURITY;

CREATE POLICY "waitlist_signups_public_insert"
  ON waitlist_signups FOR INSERT
  WITH CHECK (
    char_length(name) BETWEEN 2 AND 100
    AND email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'
  );
