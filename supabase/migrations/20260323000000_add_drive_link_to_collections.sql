-- Add drive_link field to collections table
-- This allows collections to reference a Google Drive folder for additional images
ALTER TABLE
    "public"."collections"
ADD
    COLUMN IF NOT EXISTS "drive_link" "text";

COMMENT ON COLUMN "public"."collections"."drive_link" IS 'Optional Google Drive folder URL for additional images';