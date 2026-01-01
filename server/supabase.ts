import 'dotenv/config';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const url = process.env.SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export let supabaseAdmin: SupabaseClient | null = null;

if (!url || !serviceKey) {
  console.warn('SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY missing - server Supabase client disabled.');
} else {
  supabaseAdmin = createClient(url, serviceKey, {
    auth: { persistSession: false },
  });
}

export default supabaseAdmin;
