import { createClient, SupabaseClient } from "@supabase/supabase-js";

// Read from Vite's env at build time, then fall back to globals for non-module usage
const SUPABASE_URL: string | undefined = (import.meta as any).env?.VITE_SUPABASE_URL || (window as any).SUPABASE_URL;
const SUPABASE_ANON_KEY: string | undefined = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || (window as any).SUPABASE_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  // Avoid throwing during SSR; just warn during development
  if (import.meta.env.MODE !== "production") {
    // eslint-disable-next-line no-console
    console.warn("Supabase environment variables are missing. Make sure .env.local is configured and the dev server has been restarted.");
  }
}

export const supabase: SupabaseClient = createClient(SUPABASE_URL ?? "", SUPABASE_ANON_KEY ?? "");

export default supabase;
