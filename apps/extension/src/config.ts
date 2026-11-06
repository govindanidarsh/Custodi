/**
 * Where the popup's "Open CUSTODI Website" action (and its help links) point.
 *
 * ▶ When the website is deployed, set PRODUCTION_WEB_URL below to its https address
 *   (for example "https://custodi.vercel.app") — or build with
 *   VITE_CUSTODI_WEB_URL=https://… npm run build:extension
 *   — then rebuild the extension and reload it in chrome://extensions.
 *
 * Until a production URL is set, the popup opens the local development server instead and says so.
 */
const FROM_ENV = (import.meta.env.VITE_CUSTODI_WEB_URL as string | undefined)?.trim() ?? "";

export const PRODUCTION_WEB_URL: string = FROM_ENV || ""; // ← paste the deployed https URL between the quotes

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

/** Absolute URL of a page on the CUSTODI website, e.g. websiteUrl("/extension"). */
export function websiteUrl(path = "/"): string {
  return websiteTarget().base + (path.startsWith("/") ? path : `/${path}`);
}
