// Run with: node script/verify-supabase-env.cjs
require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const url = process.env.VITE_SUPABASE_URL;
const key = process.env.VITE_SUPABASE_ANON_KEY;

if (!url || !key) {
  console.error('Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY in .env.local');
  process.exitCode = 2;
} else {
  try {
    const client = createClient(url, key);
    console.log('Supabase client initialized. URL:', url);
    process.exitCode = 0;
  } catch (err) {
    console.error('Failed to initialize Supabase client:', err.message || err);
    process.exitCode = 3;
  }
}
