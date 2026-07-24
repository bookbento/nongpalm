'use client';

import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { SUPABASE_ANON_KEY, SUPABASE_URL } from './env';

/**
 * Browser Supabase client, anon-keyed. Used for two things only:
 *  - email/password auth (issues the JWT the API guard verifies)
 *  - uploading files to a signed storage URL minted by the API
 * All product writes go through the NestJS API, never directly to Postgres.
 */
export const supabase: SupabaseClient = createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: false,
    },
  },
);
