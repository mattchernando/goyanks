/**
 * Supabase Client Configuration
 * 
 * Creates a Supabase client for server-side and client-side usage.
 * Uses environment variables for configuration.
 */

import { createClient, SupabaseClient } from "@supabase/supabase-js";

let supabaseInstance: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient {
  if (supabaseInstance) return supabaseInstance;
  
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  if (!url || !key) {
    throw new Error("Supabase environment variables not configured");
  }
  
  supabaseInstance = createClient(url, key);
  return supabaseInstance;
}

// For backwards compatibility
export const supabase = {
  from: (table: string) => getSupabase().from(table),
  storage: { from: (bucket: string) => getSupabase().storage.from(bucket) },
};
