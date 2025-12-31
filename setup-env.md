# Environment Setup (Supabase + Vite)

This document explains how to create and configure your local environment for developing Student Hub with a Supabase backend.

---

## 1) Create your local env file

1. Copy the example file into `.env.local`:

- macOS / Linux:

  cp .env.example .env.local

- Windows (PowerShell):

  Copy-Item .env.example .env.local

- Or use the convenience npm script:

  npm run dev:env

2. Edit `.env.local` and replace the placeholder values with your Supabase project details (see below how to get them).

> Do NOT commit `.env.local` to git. It is already listed in `.gitignore`.

---

## 2) Where to get Supabase values

1. Go to https://app.supabase.com and sign in.
2. Open your project.
3. Go to **Settings → API**.
4. Copy the **Project URL** (paste into `VITE_SUPABASE_URL`).
5. Copy the **anon/public** key (paste into `VITE_SUPABASE_ANON_KEY`).

**Important:** Use the anon/public key in client-side code. Never put the `service_role` key in the browser or in `.env.local`.

---

## 3) How the variables are used in the project

- `.env.local` defines `VITE_*` variables.
- Vite automatically exposes `VITE_` variables to client-side code via `import.meta.env`.
- `vite.config.ts`/`vite.config.js` loads environment files and validates presence of the required vars during dev.
- `client/index.html` contains a small `type="module"` script that reads `import.meta.env.VITE_SUPABASE_URL` and `import.meta.env.VITE_SUPABASE_ANON_KEY` and exposes them on `window.SUPABASE_URL` and `window.SUPABASE_KEY` as a fallback for non-module/vanilla usage.

---

## 4) Common mistakes & how to avoid them

- Forgetting to restart the dev server after editing `.env.local` (Vite reads env at server start). Restart `npm run dev:web`.
- Committing `.env.local` accidentally. Make sure `.gitignore` correctly lists `.env.local` and `.env.*`.
- Using the `service_role` key in client-side code — that key has elevated permissions and must be kept server-side only.
- Using `process.env.VITE_*` directly in client code when using ESM; prefer `import.meta.env.VITE_*`.

---

## 5) Troubleshooting

- If you see `Supabase configuration missing` message in the console:
  - Verify `.env.local` exists at the project root and has the required keys.
  - Restart the Vite dev server.
  - Run `npm run dev:env` to copy the example and re-edit values.

- If the client can't connect to Supabase:
  - Ensure `VITE_SUPABASE_URL` matches the Project URL in Supabase.
  - Verify your Supabase project's API and auth settings (CORS, allowed origins) permit the app’s URL (e.g., `http://localhost:5173`).

- If builds fail in CI/CD with missing env vars:
  - Make sure CI injects required env vars (set secrets in CI service) and do not commit `.env.local`.

---

## 6) Quick verification steps

1. Create `.env.local` (or run `npm run dev:env` then edit it).
4. Run the web dev server: `npm run dev:web` or start the full app server: `npm run dev`.
   - To run the full server and client together on a custom port (e.g., 5174):
     - macOS / Linux: `PORT=5174 npm run dev` or `npm run dev:full:5174`
     - Windows PowerShell: `$env:PORT='5174'; $env:NODE_ENV='development'; tsx server/index.ts` or `npm run dev:full:5174`
5. Open the app in your browser (e.g., `http://localhost:5173` for Vite-only, or `http://localhost:5174` if you started on 5174).
4. Open the browser console and check for a warning message. If no warning and Supabase-dependent features work, connection is OK.

---

## 7) Security notes

- Keep infrastructure secrets (service_role keys, DB admin keys) **only** in server-side environments or secret managers (CI/CD secrets, HashiCorp Vault, etc.).
- Rotate keys periodically and after any suspected leakage.

---

If you still have issues, include the exact console errors and a copy of your `.env.local` (without secret keys) when asking for help.
