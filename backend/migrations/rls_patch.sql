-- Run this in your Supabase SQL Editor to fix the RLS security warnings.
-- Go to: https://supabase.com/dashboard/project/mfvybvvfmuenmshatrkj/sql/new

-- Enable RLS on all tables
ALTER TABLE buildings ENABLE ROW LEVEL SECURITY;
ALTER TABLE faculty ENABLE ROW LEVEL SECURITY;
ALTER TABLE issue_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE ttu_knowledge_chunks ENABLE ROW LEVEL SECURITY;

-- Buildings: allow public read (campus map data is public)
CREATE POLICY "buildings_public_read"
  ON buildings FOR SELECT
  USING (true);

-- Faculty: allow public read (directory is public info)
CREATE POLICY "faculty_public_read"
  ON faculty FOR SELECT
  USING (true);

-- Issue Reports: allow anonymous insert only (no public read)
CREATE POLICY "issue_reports_public_insert"
  ON issue_reports FOR INSERT
  WITH CHECK (true);

-- ttu_knowledge_chunks: no policies = fully locked from PostgREST
-- (backend service role bypasses RLS, so RAG still works fine)
