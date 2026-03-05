-- Initial schema for TsengPhoto
-- Sets up collections (events, videos, series, etc.) and uploads system
SET
    statement_timeout = 0;

SET
    lock_timeout = 0;

SET
    idle_in_transaction_session_timeout = 0;

SET
    client_encoding = 'UTF8';

SET
    standard_conforming_strings = on;

SELECT
    pg_catalog.set_config('search_path', '', false);

SET
    check_function_bodies = false;

SET
    xmloption = content;

SET
    client_min_messages = warning;

SET
    row_security = off;

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "pg_net" WITH SCHEMA "extensions";

CREATE EXTENSION IF NOT EXISTS "pg_graphql" WITH SCHEMA "graphql";

CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";

CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";

CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA "vault";

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";

COMMENT ON SCHEMA "public" IS 'standard public schema';

SET
    default_tablespace = '';

SET
    default_table_access_method = "heap";

-- =====================================================
-- Collections Table
-- Generic container for different types of content (events, videos, series, etc.)
-- =====================================================
CREATE TABLE IF NOT EXISTS "public"."collections" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "name" "text" NOT NULL,
    "type" "text" NOT NULL,
    -- 'event', 'video', 'series', etc.
    "title" "text",
    "date" timestamp with time zone,
    "location" "text",
    "description" "text",
    "cover_image" "text",
    "is_published" boolean DEFAULT false,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "modified_at" timestamp with time zone DEFAULT "now"()
);

ALTER TABLE
    "public"."collections" OWNER TO "postgres";

-- =====================================================
-- Collection Images Table
-- Images/media associated with collections
-- =====================================================
CREATE TABLE IF NOT EXISTS "public"."collection_images" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "collection_id" "uuid" NOT NULL,
    "image_url" "text",
    "order" bigint,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL
);

ALTER TABLE
    "public"."collection_images" OWNER TO "postgres";

-- =====================================================
-- Uploads Table
-- Stores UploadThing file metadata
-- Uses polymorphic relationship (entity_type + entity_id) to link to collections or other entities
-- =====================================================
CREATE TABLE IF NOT EXISTS "public"."uploads" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "file_url" "text" NOT NULL,
    "file_name" "text" NOT NULL,
    "file_size" bigint NOT NULL,
    "file_type" "text",
    "entity_type" "text",
    -- e.g., 'collection', 'event', etc.
    "entity_id" "uuid",
    -- links to collections.id or other entities
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL
);

ALTER TABLE
    "public"."uploads" OWNER TO "postgres";

-- =====================================================
-- Primary Keys
-- =====================================================
ALTER TABLE
    ONLY "public"."collections"
ADD
    CONSTRAINT "collections_pkey" PRIMARY KEY ("id");

ALTER TABLE
    ONLY "public"."collection_images"
ADD
    CONSTRAINT "collection_images_pkey" PRIMARY KEY ("id");

ALTER TABLE
    ONLY "public"."uploads"
ADD
    CONSTRAINT "uploads_pkey" PRIMARY KEY ("id");

-- =====================================================
-- Foreign Keys
-- =====================================================
ALTER TABLE
    ONLY "public"."collection_images"
ADD
    CONSTRAINT "collection_images_collection_id_fkey" FOREIGN KEY ("collection_id") REFERENCES "public"."collections"("id") ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE
    ONLY "public"."uploads"
ADD
    CONSTRAINT "uploads_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON UPDATE CASCADE ON DELETE CASCADE;

-- =====================================================
-- Indexes
-- =====================================================
CREATE INDEX IF NOT EXISTS "collections_type_idx" ON "public"."collections" USING btree ("type");

CREATE INDEX IF NOT EXISTS "collections_is_published_idx" ON "public"."collections" USING btree ("is_published");

CREATE INDEX IF NOT EXISTS "uploads_entity_idx" ON "public"."uploads" USING btree ("entity_type", "entity_id");

-- =====================================================
-- Row Level Security
-- =====================================================
ALTER TABLE
    "public"."collections" ENABLE ROW LEVEL SECURITY;

ALTER TABLE
    "public"."collection_images" ENABLE ROW LEVEL SECURITY;

ALTER TABLE
    "public"."uploads" ENABLE ROW LEVEL SECURITY;

-- Collections Policies
CREATE POLICY "Public can read published collections" ON "public"."collections" FOR
SELECT
    USING ("is_published" = true);

CREATE POLICY "Authenticated users can modify all collections" ON "public"."collections" FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Collection Images Policies
CREATE POLICY "Public can read collection images" ON "public"."collection_images" FOR
SELECT
    USING (true);

CREATE POLICY "Authenticated users can modify all collection images" ON "public"."collection_images" FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Uploads Policies
CREATE POLICY "Public can read all uploads" ON "public"."uploads" FOR
SELECT
    USING (true);

CREATE POLICY "Authenticated users can insert uploads" ON "public"."uploads" FOR
INSERT
    TO authenticated WITH CHECK ("auth"."uid"() = "user_id");

CREATE POLICY "Users can update their own uploads" ON "public"."uploads" FOR
UPDATE
    TO authenticated USING ("auth"."uid"() = "user_id") WITH CHECK ("auth"."uid"() = "user_id");

CREATE POLICY "Users can delete their own uploads" ON "public"."uploads" FOR DELETE TO authenticated USING ("auth"."uid"() = "user_id");

-- =====================================================
-- Grant Permissions
-- =====================================================
-- Grant SELECT on auth.users for RLS policy checks
GRANT
SELECT
    ON TABLE auth.users TO authenticated;

-- Grant permissions on collections
GRANT ALL ON TABLE "public"."collections" TO "anon";

GRANT ALL ON TABLE "public"."collections" TO "authenticated";

GRANT ALL ON TABLE "public"."collections" TO "service_role";

-- Grant permissions on collection_images
GRANT ALL ON TABLE "public"."collection_images" TO "anon";

GRANT ALL ON TABLE "public"."collection_images" TO "authenticated";

GRANT ALL ON TABLE "public"."collection_images" TO "service_role";

-- Grant permissions on uploads
GRANT ALL ON TABLE "public"."uploads" TO "anon";

GRANT ALL ON TABLE "public"."uploads" TO "authenticated";

GRANT ALL ON TABLE "public"."uploads" TO "service_role";

-- =====================================================
-- Default Privileges
-- =====================================================
GRANT USAGE ON SCHEMA "public" TO "postgres";

GRANT USAGE ON SCHEMA "public" TO "anon";

GRANT USAGE ON SCHEMA "public" TO "authenticated";

GRANT USAGE ON SCHEMA "public" TO "service_role";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "postgres";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "anon";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "authenticated";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "service_role";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "postgres";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "anon";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "authenticated";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "service_role";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "postgres";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "anon";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "authenticated";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "service_role";

ALTER PUBLICATION "supabase_realtime" OWNER TO "postgres";