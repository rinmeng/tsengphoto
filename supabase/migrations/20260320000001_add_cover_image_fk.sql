-- Add foreign key relationship from collections.cover_image_id to uploads.id
-- This allows proper deletion of cover images from UploadThing storage
-- Add cover_image_id column to collections table
ALTER TABLE
    "public"."collections"
ADD
    COLUMN IF NOT EXISTS "cover_image_id" "uuid";

-- Add foreign key constraint
-- ON DELETE SET NULL: if the upload is deleted, null out the cover_image_id
-- ON UPDATE CASCADE: if the upload id changes, update the reference
ALTER TABLE
    "public"."collections"
ADD
    CONSTRAINT "collections_cover_image_id_fkey" FOREIGN KEY ("cover_image_id") REFERENCES "public"."uploads"("id") ON UPDATE CASCADE ON DELETE
SET
    NULL;

-- Add index for faster lookups
CREATE INDEX IF NOT EXISTS "collections_cover_image_id_idx" ON "public"."collections" USING btree ("cover_image_id");

-- Note: Keeping `cover_image` text column for backward compatibility
-- When querying, prefer joining with uploads table using cover_image_id
-- The cover_image URL can be populated from uploads.file_url for convenience