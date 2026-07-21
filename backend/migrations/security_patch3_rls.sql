-- ============================================================
-- SECURITY PATCH 3: Fix rls_auto_enable Security Definer warning
-- Run in: https://supabase.com/dashboard/project/mfvybvvfmuenmshatrkj/sql/new
-- ============================================================

-- The linter detected that `public.rls_auto_enable()` is a SECURITY DEFINER function 
-- exposed to the public REST API (/rest/v1/rpc/rls_auto_enable).
-- This allows anyone to call it. To fix this, we revoke EXECUTE from the REST API roles.

REVOKE EXECUTE ON FUNCTION public.rls_auto_enable() FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.rls_auto_enable() FROM anon;
REVOKE EXECUTE ON FUNCTION public.rls_auto_enable() FROM authenticated;
