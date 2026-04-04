/**
 * Supabase Client Configuration
 * 
 * Creates a Supabase client for server-side and client-side usage.
 * Uses environment variables for configuration.
 */

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    "Supabase environment variables not set. Dashboard will use mock data."
  );
}

export const supabase = createClient(supabaseUrl || "", supabaseAnonKey || "");

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);
