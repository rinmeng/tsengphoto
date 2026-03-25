-- Add video_collections and video tables
-- Mirrors the structure of collections/collection_image for video content
-- Videos link to YouTube URLs with extracted video IDs for efficient embedding
-- =====================================================
-- Video Collections Table
-- Container for YouTube video playlists/collections
-- =====================================================
CREATE TABLE IF NOT EXISTS "public"."video_collections" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "slug" "text" NOT NULL,
    -- URL-friendly identifier
    "title" "text" NOT NULL,
    "date" timestamp with time zone,
    "location" "text",
    "description" "text",
    "cover_image" "text",
    -- URL to cover image
    "cover_image_id" "uuid",
    -- FK to uploads.id
    "is_published" boolean DEFAULT false,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "modified_at" timestamp with time zone DEFAULT "now"()
);

ALTER TABLE
    "public"."video_collections" OWNER TO "postgres";

COMMENT ON TABLE "public"."video_collections" IS 'Collections of YouTube videos organized by event, series, or topic';

-- =====================================================
-- Video Table
-- Individual YouTube videos within a collection
-- =====================================================
CREATE TABLE IF NOT EXISTS "public"."video" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "video_collection_id" "uuid" NOT NULL,
    "youtube_video_id" "text" NOT NULL,
    -- Extracted video ID (e.g., 'W_HfxcvlDZE')
    "youtube_url" "text" NOT NULL,
    -- Original full URL
    "thumbnail_url" "text",
    -- YouTube thumbnail (e.g., https://img.youtube.com/vi/{id}/maxresdefault.jpg)
    "title" "text",
    -- Optional user-provided title
    "description" "text",
    -- Optional user-provided description
    "order" bigint,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL
);

ALTER TABLE
    "public"."video" OWNER TO "postgres";

COMMENT ON TABLE "public"."video" IS 'Individual YouTube videos linked to video collections';

COMMENT ON COLUMN "public"."video"."youtube_video_id" IS 'Extracted video ID for efficient iframe embedding';

COMMENT ON COLUMN "public"."video"."thumbnail_url" IS 'YouTube default thumbnail URL';

COMMENT ON COLUMN "public"."video"."description" IS 'Optional user-provided description for the video';

-- =====================================================
-- Primary Keys
-- =====================================================
ALTER TABLE
    ONLY "public"."video_collections"
ADD
    CONSTRAINT "video_collections_pkey" PRIMARY KEY ("id");

ALTER TABLE
    ONLY "public"."video"
ADD
    CONSTRAINT "video_pkey" PRIMARY KEY ("id");

-- =====================================================
-- Foreign Keys
-- =====================================================
-- Link video to video_collection (cascade delete)
ALTER TABLE
    ONLY "public"."video"
ADD
    CONSTRAINT "video_video_collection_id_fkey" FOREIGN KEY ("video_collection_id") REFERENCES "public"."video_collections"("id") ON UPDATE CASCADE ON DELETE CASCADE;

-- Link cover image to uploads (set null on delete)
ALTER TABLE
    ONLY "public"."video_collections"
ADD
    CONSTRAINT "video_collections_cover_image_id_fkey" FOREIGN KEY ("cover_image_id") REFERENCES "public"."uploads"("id") ON UPDATE CASCADE ON DELETE
SET
    NULL;

-- =====================================================
-- Indexes
-- =====================================================
CREATE UNIQUE INDEX IF NOT EXISTS "video_collections_slug_idx" ON "public"."video_collections" USING btree ("slug");

CREATE INDEX IF NOT EXISTS "video_collections_is_published_idx" ON "public"."video_collections" USING btree ("is_published");

CREATE INDEX IF NOT EXISTS "video_collections_cover_image_id_idx" ON "public"."video_collections" USING btree ("cover_image_id");

CREATE INDEX IF NOT EXISTS "video_video_collection_id_idx" ON "public"."video" USING btree ("video_collection_id");

-- =====================================================
-- Row Level Security
-- =====================================================
ALTER TABLE
    "public"."video_collections" ENABLE ROW LEVEL SECURITY;

ALTER TABLE
    "public"."video" ENABLE ROW LEVEL SECURITY;

-- Video Collections Policies
CREATE POLICY "Public can read published video collections" ON "public"."video_collections" FOR
SELECT
    USING ("is_published" = true);

CREATE POLICY "Authenticated users can modify all video collections" ON "public"."video_collections" FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Video Policies
CREATE POLICY "Public can read videos from published collections" ON "public"."video" FOR
SELECT
    USING (
        EXISTS (
            SELECT
                1
            FROM
                "public"."video_collections"
            WHERE
                "video_collections"."id" = "video"."video_collection_id"
                AND "video_collections"."is_published" = true
        )
    );

CREATE POLICY "Authenticated users can modify all videos" ON "public"."video" FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- =====================================================
-- Grant Permissions
-- =====================================================
GRANT ALL ON TABLE "public"."video_collections" TO "anon";

GRANT ALL ON TABLE "public"."video_collections" TO "authenticated";

GRANT ALL ON TABLE "public"."video_collections" TO "service_role";

GRANT ALL ON TABLE "public"."video" TO "anon";

GRANT ALL ON TABLE "public"."video" TO "authenticated";

GRANT ALL ON TABLE "public"."video" TO "service_role";