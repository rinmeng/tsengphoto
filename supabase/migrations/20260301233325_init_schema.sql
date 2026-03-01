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

CREATE EXTENSION IF NOT EXISTS "pg_net" WITH SCHEMA "extensions";

COMMENT ON SCHEMA "public" IS 'standard public schema';

CREATE EXTENSION IF NOT EXISTS "pg_graphql" WITH SCHEMA "graphql";

CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";

CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";

CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA "vault";

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";

SET
    default_tablespace = '';

SET
    default_table_access_method = "heap";

CREATE TABLE IF NOT EXISTS "public"."event_images" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "event_id" "uuid" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "image_url" "text",
    "order" bigint
);

ALTER TABLE
    "public"."event_images" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."events" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "title" "text",
    "date" timestamp with time zone,
    "location" "text",
    "description" "text",
    "cover_image" "text",
    "is_published" boolean,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "modified_at" timestamp with time zone DEFAULT "now"()
);

ALTER TABLE
    "public"."events" OWNER TO "postgres";

ALTER TABLE
    ONLY "public"."event_images"
ADD
    CONSTRAINT "event_images_pkey" PRIMARY KEY ("id");

ALTER TABLE
    ONLY "public"."events"
ADD
    CONSTRAINT "events_pkey" PRIMARY KEY ("id");

ALTER TABLE
    ONLY "public"."event_images"
ADD
    CONSTRAINT "event_images_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "public"."events"("id") ON UPDATE CASCADE ON DELETE CASCADE;

CREATE POLICY "Authenticated user can modify all events" ON "public"."event_images" USING (("auth"."role"() = 'authenticated' :: "text")) WITH CHECK (("auth"."role"() = 'authenticated' :: "text"));

CREATE POLICY "Authenticated user can modify all events" ON "public"."events" USING (("auth"."role"() = 'authenticated' :: "text")) WITH CHECK (("auth"."role"() = 'authenticated' :: "text"));

CREATE POLICY "Public can read event images" ON "public"."event_images" FOR
SELECT
    USING (true);

CREATE POLICY "Public can read published events" ON "public"."events" FOR
SELECT
    USING (("is_published" = true));

ALTER TABLE
    "public"."event_images" ENABLE ROW LEVEL SECURITY;

ALTER TABLE
    "public"."events" ENABLE ROW LEVEL SECURITY;

ALTER PUBLICATION "supabase_realtime" OWNER TO "postgres";

GRANT USAGE ON SCHEMA "public" TO "postgres";

GRANT USAGE ON SCHEMA "public" TO "anon";

GRANT USAGE ON SCHEMA "public" TO "authenticated";

GRANT USAGE ON SCHEMA "public" TO "service_role";

GRANT ALL ON TABLE "public"."event_images" TO "anon";

GRANT ALL ON TABLE "public"."event_images" TO "authenticated";

GRANT ALL ON TABLE "public"."event_images" TO "service_role";

GRANT ALL ON TABLE "public"."events" TO "anon";

GRANT ALL ON TABLE "public"."events" TO "authenticated";

GRANT ALL ON TABLE "public"."events" TO "service_role";

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