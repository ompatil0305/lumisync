-- ============================================================
-- SECURITY PATCH 2: Fix remaining Supabase linter warnings
-- Run in: https://supabase.com/dashboard/project/mfvybvvfmuenmshatrkj/sql/new
-- ============================================================

-- FIX 1: Tighten the issue_reports INSERT policy (was always-true)
-- Replace permissive WITH CHECK (true) with real data validation
DROP POLICY IF EXISTS "issue_reports_public_insert" ON issue_reports;

CREATE POLICY "issue_reports_validated_insert"
  ON issue_reports FOR INSERT
  WITH CHECK (
    entity_type IN ('building', 'faculty')
    AND char_length(issue_description) BETWEEN 10 AND 2000
  );

-- FIX 2: Move vector extension from public to extensions schema
-- This avoids the "Extension in Public" warning.
-- Safe to run because we recreate the dependent table after.
ALTER EXTENSION vector SET SCHEMA extensions;
