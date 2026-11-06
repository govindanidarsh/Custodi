import { websiteTarget, websiteUrl } from "./config";

// Same central website URL as the popup (see src/config.ts).
const target = websiteTarget();
const host = document.getElementById("site-host");
if (host) host.textContent = target.isProduction ? new URL(target.base).host : "localhost:5173 · development";
document.getElementById("open-site")?.addEventListener("click", () => void chrome.tabs.create({ url: websiteUrl("/") }));
