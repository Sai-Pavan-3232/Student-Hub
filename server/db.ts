import 'dotenv/config';
import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';

/**
 * Server-side DB initialization
 * - Exports `pool` (pg Pool) and `db` (Drizzle instance) when DATABASE_URL is present.
 * - Leaves them undefined when no DATABASE_URL is provided so the app can run with MockStorage.
 */
const connectionString = process.env.DATABASE_URL;

let pool: Pool | undefined;
let db: ReturnType<typeof drizzle> | undefined;

// Allow local developers to force in-memory mock DB to avoid external DNS/network
// failures during development: set `USE_MOCK_DB=true` in your environment.
if (process.env.USE_MOCK_DB === 'true') {
  console.warn('USE_MOCK_DB=true: skipping database initialization and using MockStorage.');
} else if (connectionString) {
  const testPool = new Pool({
    connectionString,
    // support basic SSL detection for hosting providers that require it
    ssl: /sslmode=require/.test(connectionString) || process.env.DATABASE_SSL === 'true' ? { rejectUnauthorized: false } : undefined,
    max: parseInt(process.env.PG_MAX_POOL_SIZE || '10', 10),
  });

  // Attach a harmless error handler to avoid uncaught errors from the pool
  testPool.on('error', (err) => {
    console.warn('Postgres pool emitted an error (ignored):', err?.message || err);
  });

  // Only promote the pool -> db after a successful health check to avoid
  // exporting an unusable pool when the DATABASE_URL is invalid or unreachable.
  (async () => {
    try {
      const client = await testPool.connect();
      try {
        await client.query('SELECT 1');
      } finally {
        client.release();
      }

      // promote to live pool and initialize Drizzle
      pool = testPool;
      db = drizzle(pool);

      // protect promoted pool with error handler as well
      pool.on('error', (err) => {
        console.warn('Postgres pool error:', err?.message || err);
      });

      console.log('Database connection OK');
    } catch (err: any) {
      console.warn('Database health check failed:', err?.message || err);
      try { await testPool.end(); } catch (_) {}
      pool = undefined;
      db = undefined;
    }
  })();
} else {
  console.warn('No DATABASE_URL provided; running with MockStorage (development only).');
}

export { pool, db };
