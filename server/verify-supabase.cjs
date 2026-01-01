require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const url = process.env.SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

(async () => {
  if (!url || !key) {
    console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in environment');
    process.exit(2);
  }

  const supabase = createClient(url, key, { auth: { persistSession: false } });

  try {
    // Try an admin API call which does not require any DB tables to exist
    const res = await supabase.auth.admin.listUsers({ per_page: 1 });
    if (res.error) {
      console.error('Supabase verification failed:', res.error);
      process.exit(1);
    }
    console.log('Supabase admin API reachable.');
    process.exit(0);
  } catch (err) {
    console.error('Supabase verification error:', err);
    process.exit(1);
  }
})();
