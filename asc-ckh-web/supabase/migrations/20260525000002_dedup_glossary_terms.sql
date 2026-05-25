-- Migration: Remove duplicate glossary terms created by running seed.sql twice.
-- The seed was executed twice: once with no profiles (author_id = NULL, created at 04:24)
-- and once with profiles (author_id set, created at 04:31). 
-- Strategy: for each (title, type, status) group, keep the newest row (highest created_at).

DELETE FROM asc_ckh.knowledge_resources
WHERE id IN (
  SELECT id
  FROM (
    SELECT
      id,
      ROW_NUMBER() OVER (
        PARTITION BY title, type, status
        ORDER BY created_at DESC  -- keep newest; it has correct author_id
      ) AS rn
    FROM asc_ckh.knowledge_resources
    WHERE type = 'glossary_term'
      AND status = 'published'
  ) ranked
  WHERE rn > 1  -- delete all rows that are NOT the newest per (title, type, status)
);

-- Also add a UNIQUE constraint to prevent future duplicates from double-seeding
-- (title + type + status combination should be unique for curated terms)
-- Note: Using a partial unique index for flexibility (allows drafts with same title)
CREATE UNIQUE INDEX IF NOT EXISTS knowledge_resources_title_type_published_unique
  ON asc_ckh.knowledge_resources (title, type)
  WHERE status = 'published';
