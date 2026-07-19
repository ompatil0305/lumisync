-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "vector";

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
