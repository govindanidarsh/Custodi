/**
 * Where the popup's "Open CUSTODI Website" action (and its help links) point.
 *
 * ▶ The production address is set once, in DEFAULT_PRODUCTION_URL in ../vite.config.ts
 *   (currently https://custodi-phi.vercel.app). A build can override it with
 *   VITE_CUSTODI_WEB_URL=https://… npm run build:extension. The same origin is written into the
 *   manifest's externally_connectable at build time.
 *
 * If no valid https address is configured, the popup opens the local development server instead and says so.
 */
const FROM_ENV = (import.meta.env.VITE_CUSTODI_WEB_URL as string | undefined)?.trim() ?? "";

export const PRODUCTION_WEB_URL: string = FROM_ENV;

/** `npm run dev` serves the website here (apps/web, Vite). Development only. */
export const DEV_WEB_URL = "http://localhost:5173";

function validProduction(u: string): string | null {
  try {
    const url = new URL(u);
    return url.protocol === "https:" ? url.origin : null;
  } catch {
    return null;
  }
}

export interface WebsiteTarget {
  /** Origin to open, without a trailing slash. */
  base: string;
  /** False while no valid https production URL is configured (the dev server is used instead). */
  isProduction: boolean;
}

export function websiteTarget(): WebsiteTarget {
  const prod = validProduction(PRODUCTION_WEB_URL);
  return prod ? { base: prod, isProduction: true } : { base: DEV_WEB_URL, isProduction: false };
}

/** localhost / 127.0.0.1 on any port — development only. */
const DEV_ORIGIN = /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/;

/**
 * Origins allowed to talk to the extension (Live Observe status, stop, trusted-domain sync): the configured
 * production website plus localhost for development. Must match `externally_connectable` in the built
 * manifest, which the build writes from the same setting (see vite.config.ts).
 */
export function isAllowedWebOrigin(origin: string | undefined): boolean {
  if (!origin) return false;
  const prod = validProduction(PRODUCTION_WEB_URL);
  return origin === prod || DEV_ORIGIN.test(origin);
}

/** Absolute URL of a page on the CUSTODI website, e.g. websiteUrl("/extension"). */
export function websiteUrl(path = "/"): string {
  return websiteTarget().base + (path.startsWith("/") ? path : `/${path}`);
}
