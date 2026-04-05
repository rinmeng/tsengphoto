-- Add file_key column to uploads table
-- This stores the UploadThing file key for reliable file deletion
-- The file key is the last segment of the UploadThing URL (e.g., the '12345.webp' in 'https://utfs.io/f/12345.webp')
ALTER TABLE
    "public"."uploads"
ADD
    COLUMN IF NOT EXISTS "file_key" "text";

-- Add index for faster lookups when deleting files
CREATE INDEX IF NOT EXISTS "uploads_file_key_idx" ON "public"."uploads" USING btree ("file_key");

-- Backfill existing records by extracting file_key from file_url
-- URL format: https://{UPLOADTHING_APP_ID}.ufs.sh/f/{fileKey}
UPDATE
    "public"."uploads"
SET
    "file_key" = SUBSTRING(
        "file_url"
        FROM
            '/f/(.+)$'
    )
WHERE
    "file_key" IS NULL
    AND "file_url" LIKE '%/f/%';

-- Add comment explaining the column
COMMENT ON COLUMN "public"."uploads"."file_key" IS 'UploadThing file key extracted from URL for reliable file deletion';