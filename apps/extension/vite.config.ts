import fs from "node:fs";
import path from "node:path";
import { defineConfig, type Plugin } from "vite";

/**
 * The deployed CUSTODI website. One place to change it; a build can override it with
 * VITE_CUSTODI_WEB_URL (scripts/build-release.mjs passes Vercel's production domain).
 */
const DEFAULT_PRODUCTION_URL = "https://custodi-phi.vercel.app";

/** The website's https origin used by this build (null if the value isn't a valid https URL). */
function productionOrigin(): string | null {
  const raw = process.env.VITE_CUSTODI_WEB_URL?.trim() || DEFAULT_PRODUCTION_URL;
  try {
    const u = new URL(raw);
    return u.protocol === "https:" ? u.origin : null;
  } catch {
    return null;
  }
}

/**
 * Lets the deployed website (and localhost in development) talk to the extension: adds the production
 * origin to externally_connectable in the built manifest. No new permissions are added.
 */
function productionManifest(): Plugin {
  return {
    name: "custodi-production-manifest",
    apply: "build",
    writeBundle(opts) {
      const file = path.join(opts.dir ?? "dist", "manifest.json");
      const manifest = JSON.parse(fs.readFileSync(file, "utf8"));
      const origin = productionOrigin();
      if (origin) {
        const matches: string[] = manifest.externally_connectable?.matches ?? [];
        manifest.externally_connectable = { matches: Array.from(new Set([`${origin}/*`, ...matches])) };
      }
      fs.writeFileSync(file, JSON.stringify(manifest, null, 2) + "\n");
    },
  };
}

// Builds the popup page and the background service worker into dist/ (load that folder in chrome://extensions).
export default defineConfig({
  base: "./",
  plugins: [productionManifest()],
  // src/config.ts reads this; the manifest plugin above uses the same origin.
  define: { "import.meta.env.VITE_CUSTODI_WEB_URL": JSON.stringify(productionOrigin() ?? "") },
  build: {
    outDir: "dist",
    emptyOutDir: true,
    modulePreload: false,
    target: "chrome110",
    rollupOptions: {
      input: {
        popup: "popup.html",
        welcome: "welcome.html",
        background: "src/background.ts",
      },
      output: {
        entryFileNames: "[name].js",
        chunkFileNames: "chunks/[name].js",
        assetFileNames: "assets/[name][extname]",
      },
    },
  },
});
