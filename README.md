# StudentHubConnect (local dev)

Quick notes to run the project locally for development.

## Run the client (Vite)

```
cd client
npm install
npm run dev
```

Open http://localhost:5176 in your browser.

## Run the server (API)

The server normally attempts to connect to the database specified by `DATABASE_URL` in your `.env`.
For local development you may prefer to avoid hitting a remote DB. You can force an in-memory mock DB with:

```
# PowerShell
$env:USE_MOCK_DB='true'; npm run dev:server

# or in UNIX shells
USE_MOCK_DB=true npm run dev:server
```

If you don't set `USE_MOCK_DB`, the server will try to connect to the host in `DATABASE_URL` and may fail if DNS or network access is blocked.

## Run both client and server together

From the repository root you can start both the client and server concurrently:

```
npm run dev:all
```

This uses `concurrently` to run the Vite dev server plus the Node server in parallel.

## Ports
- Client (Vite): 5176 (default)
- Server (Express): 5000 (default) — you can change PORT environment variable to run on a different port.

---

## Supabase setup (quick)

1. Create a Supabase project at https://app.supabase.com and follow the project setup steps.
2. In the Supabase dashboard go to **Settings → API** and copy the **Project URL** and the **Anon** and **Service Role** keys.
3. Add the **Service Role** key and Project URL to your local server `.env` as `SUPABASE_SERVICE_ROLE_KEY` and `SUPABASE_URL`. These keys are **private** and must not be checked into git.
4. Add the public keys to the client by creating `client/.env.local` containing `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.
5. Verify the server-side client can reach Supabase:

```
# Example (PowerShell)
$env:SUPABASE_URL='https://<project>.supabase.co'; $env:SUPABASE_SERVICE_ROLE_KEY='<service-role-key>'; npm run verify:supabase
```

If verification succeeds you'll see `Supabase admin API reachable.` — if it fails, verify the keys and network connectivity.

#### Admin routes
You can enable server-side admin-only routes by setting `ENABLE_ADMIN_ROUTES=true` in your `.env` (and providing `SUPABASE_SERVICE_ROLE_KEY`). When enabled, the server exposes:

- `GET /api/admin/users` — lists users (paginated, server-only)
- `GET /api/admin/stats` — combines local stats with an optional remote function call

**Warning:** these routes expose admin capabilities and should not be enabled in a public production environment.


### Migrations (Drizzle)

Drizzle is configured using `drizzle.config.ts` and reads `DATABASE_URL` from the environment. To run migrations against your Supabase Postgres:

1. Set `DATABASE_URL` in your local `.env` to your Supabase Postgres connection string (Settings → Database → Connection string).
2. Generate a migration (edit your `shared/schema.ts` or migrations):

```
# create a migration file (name optional)
npm run migrate:generate -- --name add_some_table
```

3. Push migrations to the DB:

```
npm run migrate:push
```

4. Check migration status:

```
npm run migrate:status
```

> Note: the `drizzle.config.ts` will throw if `DATABASE_URL` is missing. Only run migrations when you intend to apply them to a real DB.

If you'd like, I can run migrations for you (requires the DB connection string) or create a sample migration to add an example table.