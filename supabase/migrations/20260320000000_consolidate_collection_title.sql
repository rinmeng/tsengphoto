-- Consolidate collections.name into collections.title
-- Migration to remove the redundant 'name' column and use 'title' exclusively
-- Step 1: Copy any name values to title where title is null or empty
UPDATE
    public.collections
SET
    title = name
WHERE
    title IS NULL
    OR title = '';

-- Step 2: For any remaining records where title is still null (shouldn't happen), set to name
UPDATE
    public.collections
SET
    title = name
WHERE
    title IS NULL;

-- Step 3: Make title column NOT NULL now that all values are populated
ALTER TABLE
    public.collections
ALTER COLUMN
    title
SET
    NOT NULL;

-- Step 4: Drop the name column
ALTER TABLE
    public.collections DROP COLUMN name;

-- Add comment to document the change
COMMENT ON COLUMN public.collections.title IS 'Display name for the collection (consolidated from previous name/title split)';