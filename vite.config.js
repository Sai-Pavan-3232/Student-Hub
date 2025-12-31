// Vite configuration for Vanilla JS projects
// This file ensures Vite loads .env files and exposes VITE_* variables to client code.
import { defineConfig, loadEnv } from 'vite'
import path from 'path'

export default defineConfig(({ mode }) => {
  // Load .env, .env.local, .env.[mode]
  const env = loadEnv(mode, process.cwd(), '')

  // Basic validation (development only)
  if (mode !== 'production' && (!env.VITE_SUPABASE_URL || !env.VITE_SUPABASE_ANON_KEY)) {
    // eslint-disable-next-line no-console
    console.warn('VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY is missing. Ensure .env.local is created.')
  }

  return {
    root: path.resolve(process.cwd(), 'client'),
    build: {
      outDir: path.resolve(process.cwd(), 'dist/public'),
      emptyOutDir: true,
    },
    resolve: {
      alias: {
        '@': path.resolve(process.cwd(), 'client', 'src'),
      },
    },
    define: {
      // Provide compatibility mapping if some libs expect process.env.VITE_*
      'process.env': {
        VITE_SUPABASE_URL: JSON.stringify(env.VITE_SUPABASE_URL),
        VITE_SUPABASE_ANON_KEY: JSON.stringify(env.VITE_SUPABASE_ANON_KEY),
      },
    },
  }
})