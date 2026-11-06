#!/usr/bin/env node
/**
 * Production build for deployment (used by Vercel: `npm run build:deploy`).
 *
 * 1. Builds the website into apps/web/dist.
 * 2. Builds the Chrome extension pointed at the deployed website:
 *      CUSTODI_WEB_URL (explicit override)  or  https://$VERCEL_PROJECT_PRODUCTION_URL (set by Vercel).
 *    Without either, it uses DEFAULT_PRODUCTION_URL from apps/extension/vite.config.ts.
 * 3. Zips apps/extension/dist into apps/web/dist/downloads/custodi-extension.zip (folder "custodi-extension/")
 *    and writes custodi-extension.json (version, size, SHA-256, website URL) for the download page.
 *
 * No dependencies: the ZIP is written with Node's zlib (deflate) and a CRC-32 table.
 */
import { execSync } from "node:child_process";
import { createHash } from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import zlib from "node:zlib";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const extDist = path.join(root, "apps/extension/dist");
const outDir = path.join(root, "apps/web/dist/downloads");

function websiteUrl() {
  const explicit = process.env.CUSTODI_WEB_URL?.trim();
  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL?.trim();
  const raw = explicit || (vercel ? `https://${vercel}` : "");
  if (!raw) return "";
  const u = new URL(raw);
  if (u.protocol !== "https:") throw new Error(`Website URL must be https: ${raw}`);
  return u.origin;
}

const run = (cmd, env = {}) => execSync(cmd, { cwd: root, stdio: "inherit", env: { ...process.env, ...env } });

const override = websiteUrl();
console.log(`\n[release] website URL override: ${override || "(none — using DEFAULT_PRODUCTION_URL in apps/extension/vite.config.ts)"}\n`);

run("npm run build:web");
run("npm run build:extension", override ? { VITE_CUSTODI_WEB_URL: override } : {});

// ---- verify the extension build before packaging ----
const manifest = JSON.parse(fs.readFileSync(path.join(extDist, "manifest.json"), "utf8"));
const required = ["manifest.json", "popup.html", "popup.js", "background.js", "welcome.html", "assets/custodi-emblem.png", ...Object.values(manifest.icons ?? {})];
for (const f of required) if (!fs.existsSync(path.join(extDist, f))) throw new Error(`Extension build is missing ${f}`);
if (manifest.manifest_version !== 3) throw new Error("Expected a Manifest V3 extension");
// The https origin the extension was actually built for (written into externally_connectable by its vite config).
const url = (manifest.externally_connectable?.matches ?? []).find((m) => m.startsWith("https://"))?.replace(/\/\*$/, "") ?? "";
if (!url) throw new Error("No https production origin in the extension's externally_connectable — check DEFAULT_PRODUCTION_URL");
if (override && url !== override) throw new Error(`Extension was built for ${url}, expected ${override}`);
console.log(`[release] extension built for ${url}`);

// ---- zip ----
const CRC = new Uint32Array(256).map((_, n) => {
  let c = n;
  for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  return c >>> 0;
});
const crc32 = (buf) => {
  let c = 0xffffffff;
  for (const b of buf) c = CRC[(c ^ b) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
};
const walk = (dir) => fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? walk(path.join(dir, e.name)) : [path.join(dir, e.name)]));

const files = walk(extDist).sort();
const PREFIX = "custodi-extension/";
const chunks = [], central = [];
let offset = 0;
const DOS_TIME = 0, DOS_DATE = (2026 - 1980) << 9 | 1 << 5 | 1; // fixed timestamp → reproducible archive
for (const file of files) {
  const name = Buffer.from(PREFIX + path.relative(extDist, file).split(path.sep).join("/"));
  const data = fs.readFileSync(file);
  const comp = zlib.deflateRawSync(data, { level: 9 });
  const crc = crc32(data);
  const local = Buffer.alloc(30);
  local.writeUInt32LE(0x04034b50, 0); local.writeUInt16LE(20, 4); local.writeUInt16LE(0x0800, 6); local.writeUInt16LE(8, 8);
  local.writeUInt16LE(DOS_TIME, 10); local.writeUInt16LE(DOS_DATE, 12); local.writeUInt32LE(crc, 14);
  local.writeUInt32LE(comp.length, 18); local.writeUInt32LE(data.length, 22); local.writeUInt16LE(name.length, 26); local.writeUInt16LE(0, 28);
  chunks.push(local, name, comp);
  const cen = Buffer.alloc(46);
  cen.writeUInt32LE(0x02014b50, 0); cen.writeUInt16LE(20, 4); cen.writeUInt16LE(20, 6); cen.writeUInt16LE(0x0800, 8); cen.writeUInt16LE(8, 10);
  cen.writeUInt16LE(DOS_TIME, 12); cen.writeUInt16LE(DOS_DATE, 14); cen.writeUInt32LE(crc, 16); cen.writeUInt32LE(comp.length, 20);
  cen.writeUInt32LE(data.length, 24); cen.writeUInt16LE(name.length, 28); cen.writeUInt32LE(offset, 42);
  central.push(cen, name);
  offset += local.length + name.length + comp.length;
}
const cenBuf = Buffer.concat(central);
const end = Buffer.alloc(22);
end.writeUInt32LE(0x06054b50, 0); end.writeUInt16LE(files.length, 8); end.writeUInt16LE(files.length, 10);
end.writeUInt32LE(cenBuf.length, 12); end.writeUInt32LE(offset, 16);
const zip = Buffer.concat([...chunks, cenBuf, end]);

fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(path.join(outDir, "custodi-extension.zip"), zip);
const meta = {
  name: manifest.name,
  version: manifest.version,
  file: "custodi-extension.zip",
  bytes: zip.length,
  sha256: createHash("sha256").update(zip).digest("hex"),
  files: files.length,
  websiteUrl: url || null,
  builtAt: new Date().toISOString(),
};
fs.writeFileSync(path.join(outDir, "custodi-extension.json"), JSON.stringify(meta, null, 2) + "\n");
console.log(`\n[release] wrote downloads/custodi-extension.zip — ${files.length} files, ${(zip.length / 1024).toFixed(0)} KB, v${meta.version}\n`);
