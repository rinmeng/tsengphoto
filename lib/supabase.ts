import { createClient } from '@/utils/supabase/client';
import { Logger } from '@/lib/logger';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabasePublishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl) {
  Logger.warn(
    '⚠️  NEXT_PUBLIC_SUPABASE_URL is not set. Please add it to your env vars to enable Supabase features.'
  );
}
if (!supabasePublishableKey) {
  Logger.warn(
    '⚠️  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY is not set. Please add it to your env vars to enable Supabase features.'
  );
}

export const supabase = createClient();
