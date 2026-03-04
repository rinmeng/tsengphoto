-- Grant SELECT on auth.users to authenticated role for RLS policy checks
-- This allows RLS policies to verify user existence
GRANT
SELECT
    ON TABLE auth.users TO authenticated;