import { createClient } from '@supabase/supabase-js';

/**
 * Creates a Supabase admin client with service role key
 * Use this only in server-side code where you need to bypass RLS
 * DO NOT expose this client to the client-side
 */
export function createAdminClient() {
  return createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
