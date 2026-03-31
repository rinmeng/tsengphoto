ALTER TABLE
    public.collections
ADD
    COLUMN IF NOT EXISTS collection_group TEXT;

COMMENT ON COLUMN public.collections.collection_group IS 'Optional label for grouping related collections (e.g. club name, series, trip)';