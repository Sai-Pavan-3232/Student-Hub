import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";

// Use function form so we can load environment variables depending on the mode (dev/prod)
export default defineConfig(({ mode }) => {
  // Load all env vars and don't restrict the prefix (we'll still use VITE_ prefix in code)
  const env = loadEnv(mode, process.cwd(), "");

  // Optionally, you can validate presence of required env vars here and warn.
  if (!env.VITE_SUPABASE_URL || !env.VITE_SUPABASE_ANON_KEY) {
    if (mode !== "production") {
      // During development, warn developer to set .env.local
      // (This avoids failing the build unexpectedly in CI while allowing explicit management there.)
      // eslint-disable-next-line no-console
      console.warn("VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY not set. Make sure .env.local is configured.");
    }
  }

  return {
    plugins: [
      react(),
      runtimeErrorOverlay(),
      ...(process.env.NODE_ENV !== "production" && process.env.REPL_ID !== undefined
        ? [
            import("@replit/vite-plugin-cartographer").then((m) => m.cartographer()),
            import("@replit/vite-plugin-dev-banner").then((m) => m.devBanner()),
          ]
        : []),
    ],

    resolve: {
      alias: {
        "@": path.resolve(import.meta.dirname, "client", "src"),
        "@shared": path.resolve(import.meta.dirname, "shared"),
        "@assets": path.resolve(import.meta.dirname, "attached_assets"),
      },
    },

    // ensure the client folder is served as the root
    root: path.resolve(import.meta.dirname, "client"),

    build: {
      outDir: path.resolve(import.meta.dirname, "dist/public"),
      emptyOutDir: true,
    },

    server: {
      fs: {
        strict: true,
        deny: ["**/.*"],
      },
    },

    // Expose env to define if you need process.env.* style usage in older libs
    define: {
      // Keep process.env compatibility by mapping VITE_ vars if needed
      'process.env': {
        VITE_SUPABASE_URL: JSON.stringify(env.VITE_SUPABASE_URL),
        VITE_SUPABASE_ANON_KEY: JSON.stringify(env.VITE_SUPABASE_ANON_KEY),
      },
    },
  };
});

