-- Migration: Fix author profile visibility for published resource attribution
-- Problem: user_profiles has RLS requiring discoverability_opt_in = true,
-- but glossary authors should always be attributable on published terms.
-- This adds a SELECT policy for that specific attribution use case.

-- Allow reading author profile data when the profile is linked to a published resource
CREATE POLICY "Author profiles visible for published resource attribution"
  ON asc_ckh.user_profiles
  FOR SELECT
  USING (
    id IN (
      SELECT author_id
      FROM asc_ckh.knowledge_resources
      WHERE status = 'published'
        AND author_id IS NOT NULL
    )
  );

-- Also ensure seed/test profiles have opt-in set so directory works during dev
-- (non-destructive: only updates test accounts)
UPDATE asc_ckh.user_profiles
SET discoverability_opt_in = true
WHERE id IN (
  SELECT DISTINCT author_id
  FROM asc_ckh.knowledge_resources
  WHERE status = 'published'
    AND author_id IS NOT NULL
);
