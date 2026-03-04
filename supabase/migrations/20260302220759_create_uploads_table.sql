-- Create uploads table to store UploadThing file metadata
-- Uses polymorphic relationship pattern (entity_type + entity_id)
CREATE TABLE IF NOT EXISTS "public"."uploads" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "file_url" "text" NOT NULL,
    "file_name" "text" NOT NULL,
    "file_size" bigint NOT NULL,
    "file_type" "text",
    "entity_type" "text",
    "entity_id" "uuid",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL
);

ALTER TABLE
    "public"."uploads" OWNER TO "postgres";

-- Add primary key constraint
ALTER TABLE
    ONLY "public"."uploads"
ADD
    CONSTRAINT "uploads_pkey" PRIMARY KEY ("id");

-- Add foreign key to auth.users
ALTER TABLE
    ONLY "public"."uploads"
ADD
    CONSTRAINT "uploads_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON UPDATE CASCADE ON DELETE CASCADE;

-- Enable Row Level Security
ALTER TABLE
    "public"."uploads" ENABLE ROW LEVEL SECURITY;

-- Policy: Public can read all uploads
CREATE POLICY "Public can read all uploads" ON "public"."uploads" FOR
SELECT
    USING (true);

-- Policy: Authenticated users can insert uploads
CREATE POLICY "Authenticated users can insert uploads" ON "public"."uploads" FOR
INSERT
    TO authenticated WITH CHECK ("auth"."uid"() = "user_id");

-- Policy: Users can update their own uploads
CREATE POLICY "Users can update their own uploads" ON "public"."uploads" FOR
UPDATE
    TO authenticated USING ("auth"."uid"() = "user_id") WITH CHECK ("auth"."uid"() = "user_id");

-- Policy: Users can delete their own uploads
CREATE POLICY "Users can delete their own uploads" ON "public"."uploads" FOR DELETE TO authenticated USING ("auth"."uid"() = "user_id");

-- Grant permissions
GRANT ALL ON TABLE "public"."uploads" TO "anon";

GRANT ALL ON TABLE "public"."uploads" TO "authenticated";

GRANT ALL ON TABLE "public"."uploads" TO "service_role";