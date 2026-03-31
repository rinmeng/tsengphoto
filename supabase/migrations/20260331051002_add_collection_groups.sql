-- Create collection_groups lookup table
CREATE TABLE IF NOT EXISTS "public"."collection_groups" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "name" "text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL
);

ALTER TABLE
    "public"."collection_groups" OWNER TO "postgres";

-- Primary key
ALTER TABLE
    ONLY "public"."collection_groups"
ADD
    CONSTRAINT "collection_groups_pkey" PRIMARY KEY ("id");

-- Unique name to prevent duplicates
CREATE UNIQUE INDEX IF NOT EXISTS "collection_groups_name_idx" ON "public"."collection_groups" USING btree ("name");

-- Add FK column to collections
ALTER TABLE
    "public"."collections"
ADD
    COLUMN IF NOT EXISTS "collection_group_id" "uuid";

ALTER TABLE
    ONLY "public"."collections"
ADD
    CONSTRAINT "collections_collection_group_id_fkey" FOREIGN KEY ("collection_group_id") REFERENCES "public"."collection_groups"("id") ON UPDATE CASCADE ON DELETE
SET
    NULL;

CREATE INDEX IF NOT EXISTS "collections_collection_group_id_idx" ON "public"."collections" USING btree ("collection_group_id");

-- RLS
ALTER TABLE
    "public"."collection_groups" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read collection groups" ON "public"."collection_groups" FOR
SELECT
    USING (true);

CREATE POLICY "Authenticated users can modify collection groups" ON "public"."collection_groups" FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Grants
GRANT ALL ON TABLE "public"."collection_groups" TO "anon";

GRANT ALL ON TABLE "public"."collection_groups" TO "authenticated";

GRANT ALL ON TABLE "public"."collection_groups" TO "service_role";