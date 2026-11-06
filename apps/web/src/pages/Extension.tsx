import { ArrowRight, CheckCircle2, ChevronDown, Copy, Download, Globe, ScanLine } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router";
import { copyText } from "../lib/download";
import { EXTENSION_FOLDER, useExtension } from "../lib/extension";
import { setFlag } from "../lib/store";
import { Button, ButtonLink, buttonClass } from "../ui/Button";
import { Notice, useToast } from "../ui/Feedback";
import { Container, PageHeader } from "../ui/Layout";

function Cmd({ children }: { children: string }) {
  const toast = useToast();
  return (
    <div className="mt-2 flex items-center gap-2 rounded-xl bg-ink px-4 py-3 font-mono text-sm text-bg">
      <span className="flex-1 overflow-x-auto whitespace-nowrap">{children}</span>
      <button
        type="button"
        aria-label={`Copy: ${children}`}
        onClick={async () => toast((await copyText(children)) ? "Copied" : "Couldn't copy — select the text instead", "success")}
        className="-m-1.5 rounded-md p-2.5 opacity-70 hover:opacity-100"
      >
        <Copy className="h-4 w-4" />
      </button>
    </div>
  );
}

function Step({ n, title, children, id }: { n: number; title: string; children: React.ReactNode; id?: string }) {
  return (
    <li id={id} className="grid scroll-mt-24 grid-cols-[2.5rem_1fr] gap-4 border-t border-line py-7 first:border-t-0">
      <span className="font-display text-4xl leading-none text-accent">{n}</span>
      <div className="min-w-0">
        <h3 className="t-h3">{title}</h3>
        <div className="mt-2 space-y-2 text-[0.95rem] leading-relaxed text-ink-2">{children}</div>
      </div>
    </li>
  );
}

const FAQ: [string, React.ReactNode][] = [
  [
    "“Load unpacked” is missing",
    "Turn on Developer mode with the switch in the top-right corner of chrome://extensions. The buttons appear on the left.",
  ],
  [
    "Chrome says “Manifest file is missing or unreadable”",
    <>
      You picked the wrong folder. Unzip the download first, then choose the <code className="font-mono">custodi-extension</code> folder — the one that directly contains{" "}
      <code className="font-mono">manifest.json</code>. Chrome can't load the ZIP file itself. (Building from source? Choose <code className="font-mono">{EXTENSION_FOLDER}</code>.)
    </>,
  ],
  ["“This page can't be scanned”", "Chrome blocks every extension from reading its own pages (chrome://…, the new-tab page, the Chrome Web Store). Open a normal website."],
  [
    "I changed the code but the extension didn't update",
    "Run the build command again, then click the ↻ reload arrow on the CUSTODI card in chrome://extensions. Close and reopen the popup.",
  ],
  [
    "The Live Observe page says “Extension not detected”",
    "The extension only talks to this website's own address (and to localhost, for developers). Make sure you installed the version downloaded from this page, that it's switched on in chrome://extensions, then reload this page.",
  ],
  [
    "Chrome shows a notice about developer-mode extensions",
    "That's expected for extensions loaded with “Load unpacked” — CUSTODI isn't on the Chrome Web Store yet. You can dismiss it; the extension keeps working.",
  ],
  ["I denied the permission by mistake", "Just press Start again — Chrome will ask again. Nothing starts without it."],
  ["Does it work on my phone?", "No. Mobile Chrome doesn't support extensions. Use the CUSTODI web app on your phone (it can be installed to your home screen)."],
];

interface ReleaseMeta {
  version: string;
  bytes: number;
  sha256: string;
  files: number;
  websiteUrl: string | null;
}
const ZIP_URL = "/downloads/custodi-extension.zip";

/** Reads the details the production build publishes next to the ZIP (scripts/build-release.mjs). */
function useRelease() {
  const [meta, setMeta] = useState<ReleaseMeta | null | "missing">(null);
  useEffect(() => {
    let alive = true;
    fetch("/downloads/custodi-extension.json", { cache: "no-store" })
      .then((r) => (r.ok && r.headers.get("content-type")?.includes("json") ? r.json() : Promise.reject()))
      .then((m: ReleaseMeta) => alive && setMeta(m))
      .catch(() => alive && setMeta("missing"));
    return () => {
      alive = false;
    };
  }, []);
  return meta;
}

function DownloadPanel() {
  const meta = useRelease();
  const ready = meta && meta !== "missing";
  return (
    <div className="panel p-6 sm:p-8">
      <p className="t-eyebrow text-accent">Chrome extension · Manifest V3</p>
      <h2 className="t-h2 mt-3">Download CUSTODI for Chrome</h2>
      <p className="mt-3 max-w-xl text-ink-2">A ZIP of the ready-built extension. Unzip it, then load the folder in Chrome — four steps below.</p>
      {meta === "missing" ? (
        <Notice tone="warning" title="The download isn't built on this copy of the site">
          The ZIP is created by the production build (<code className="font-mono">npm run build:deploy</code>). Developers can build the extension instead — see the last
          step below.
        </Notice>
      ) : (
        <div className="mt-6 flex flex-wrap items-center gap-4">
          <a href={ZIP_URL} download="custodi-extension.zip" className={buttonClass("primary", "lg")} aria-disabled={!ready}>
            <Download className="h-5 w-5" /> Download extension (.zip)
          </a>
          {ready && (
            <dl className="grid grid-cols-3 gap-x-6 gap-y-1 font-mono text-xs text-muted">
              <dt>Version</dt>
              <dt>Size</dt>
              <dt>Files</dt>
              <dd className="text-ink">{meta.version}</dd>
              <dd className="text-ink">{Math.round(meta.bytes / 1024)} KB</dd>
              <dd className="text-ink">{meta.files}</dd>
            </dl>
          )}
        </div>
      )}
      {ready && (
        <p className="mt-4 font-mono text-[11px] break-all text-muted">
          SHA-256 {meta.sha256}
          {meta.websiteUrl ? ` · opens ${new URL(meta.websiteUrl).host}` : ""}
        </p>
      )}
    </div>
  );
}

export default function Extension() {
  const { state } = useExtension();
  useEffect(() => setFlag({ visitedExtension: true }), []);

  return (
    <Container className="pt-10 md:pt-14">
      <PageHeader
        eyebrow="Get CUSTODI"
        title="Use it here. Add it to Chrome."
        description="Everything works in this website — nothing to install. Add the Chrome extension to check the page you're on with one click."
        actions={
          <a href="#download" className={buttonClass("primary", "md")}>
            <Download className="h-4 w-4" /> Download the extension
          </a>
        }
      />

      <nav aria-label="Start here" className="mt-8 grid grid-cols-1 border-y border-line sm:grid-cols-3 sm:divide-x sm:divide-line">
        {[
          { to: "/scan", icon: ScanLine, t: "Scan a message", d: "Paste an email, SMS or WhatsApp text" },
          { to: "/website", icon: Globe, t: "Check a website", d: "Read an address without opening it" },
          { to: "#download", icon: Download, t: "Get the Chrome extension", d: "Download, unzip, load — 2 minutes" },
        ].map(({ to, icon: I, t, d }) => {
          const inner = (
            <>
              <I className="h-5 w-5 flex-none text-accent" aria-hidden />
              <span className="flex-1">
                <span className="block font-medium text-ink">{t}</span>
                <span className="block text-sm text-muted">{d}</span>
              </span>
              <ArrowRight className="h-4 w-4 text-muted transition-transform group-hover:translate-x-0.5" aria-hidden />
            </>
          );
          const cls = "group flex items-center gap-4 border-b border-line px-1 py-5 last:border-b-0 hover:text-accent sm:border-b-0 sm:px-5";
          return to.startsWith("#") ? (
            <a key={t} href={to} className={cls}>
              {inner}
            </a>
          ) : (
            <Link key={t} to={to} className={cls}>
              {inner}
            </Link>
          );
        })}
      </nav>

      <div className="mt-6">
        {state.kind === "connected" ? (
          <Notice tone="success" title="The CUSTODI extension is installed and connected">
            Version {state.version}. You're all set — see <Link className="underline" to="/live">Live Observe</Link>.
          </Notice>
        ) : state.kind === "unsupported" ? (
          <Notice tone="warning" title="This browser can't run the CUSTODI extension">
            Use desktop Google Chrome (or Edge / Brave). On phones, use the web app instead.
          </Notice>
        ) : state.kind === "not-connected" ? (
          <Notice tone="info">Not detected in this browser yet. Follow the steps below — this page will tell you once it's connected (after a reload).</Notice>
        ) : null}
      </div>

      <section className="mt-12 grid grid-cols-1 gap-10 lg:grid-cols-[1fr_1.6fr]">
        <div>
          <h2 className="t-h2">What it does</h2>
          <p className="mt-3 text-muted">Everything runs inside the extension on your computer, using the same analyzer as this website.</p>
        </div>
        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {[
            ["Scan this page", "Click once to check the current tab: its address, visible text and whether it asks for OTPs, PINs or card details."],
            ["Message", "Paste a suspicious message right in the popup and get the same verdict, evidence and next steps."],
            ["Website", "Check any web address — or this tab's — without opening it. Also: the latest result and a link to this website."],
            ["Live Observe", "Start a 15, 30 or 60-minute session. CUSTODI checks each page you view and shows a risk badge. Stop any time."],
          ].map(([t, d]) => (
            <li key={t} className="border-t-2 border-ink pt-4">
              <p className="font-medium">{t}</p>
              <p className="mt-1 text-sm text-muted">{d}</p>
            </li>
          ))}
        </ul>
      </section>

      <section id="download" className="mt-12 scroll-mt-24">
        <DownloadPanel />
      </section>

      <section id="install" className="mt-14 scroll-mt-24">
        <h2 className="t-h2">Install it in Chrome</h2>
        <div className="mt-4">
          <Notice tone="info">
            CUSTODI isn't on the Chrome Web Store yet, so you add it with Chrome's <b>Load unpacked</b> option. It's safe, needs no account, and you can remove it any
            time from chrome://extensions. Works in desktop Chrome, Edge and Brave — not on phones.
          </Notice>
        </div>
        <ol className="mt-4">
          <Step n={1} title="Download and unzip">
            <p>
              Download <code className="font-mono text-ink">custodi-extension.zip</code> above and unzip it — on a Mac, double-click it; on Windows, right-click →{" "}
              <b>Extract All</b>. You get a folder called <code className="font-mono text-ink">custodi-extension</code> with <code className="font-mono text-ink">manifest.json</code>{" "}
              inside. Keep that folder; Chrome loads the extension from it.
            </p>
          </Step>
          <Step n={2} title="Open Chrome's extension page">
            <p>
              Type this into Chrome's address bar and press Enter, then switch on <b>Developer mode</b> (top-right):
            </p>
            <Cmd>chrome://extensions</Cmd>
          </Step>
          <Step n={3} title="Load CUSTODI">
            <p>
              Click <b>Load unpacked</b> and choose the unzipped <code className="font-mono text-ink">custodi-extension</code> folder (not the ZIP).
            </p>
            <p className="text-sm text-muted">A CUSTODI card appears. Its ID should be hbhalijjblgneikgjipkleckcpemmlkj.</p>
          </Step>
          <Step n={4} title="Pin it to the toolbar" id="pin">
            <p>
              Click the puzzle-piece icon to the right of the address bar, find <b>CUSTODI</b> and click the pin. The CUSTODI icon now sits in your toolbar, where
              you'll see its <b>ON</b> and risk badges. Open it and choose <b>Open CUSTODI Website</b> to come back here any time.
            </p>
          </Step>
        </ol>
        <details className="group mt-2 border-t border-line pt-4">
          <summary className="flex cursor-pointer list-none items-center gap-2 text-sm font-medium text-ink-2 [&::-webkit-details-marker]:hidden">
            <ChevronDown className="h-4 w-4 transition-transform group-open:rotate-180" /> Developers: build it from the source instead
          </summary>
          <div className="mt-3 text-sm text-ink-2">
            <p>In the project folder run:</p>
            <Cmd>npm run build:extension</Cmd>
            <p className="mt-2">
              then load <code className="font-mono text-ink">{EXTENSION_FOLDER}</code>. The website address it opens is set in{" "}
              <code className="font-mono">apps/extension/vite.config.ts</code> (or override it with <code className="font-mono">VITE_CUSTODI_WEB_URL</code>).
            </p>
          </div>
        </details>
      </section>

      <section className="mt-12 grid grid-cols-1 gap-10 lg:grid-cols-2">
        <div id="this-page" className="scroll-mt-24">
          <h2 className="t-h2">Scan the current page</h2>
          <ol className="mt-4 list-decimal space-y-2 pl-5 text-ink-2">
            <li>Open the website you want to check.</li>
            <li>Click the CUSTODI icon → <b>Home</b> → <b>Scan this page</b>.</li>
            <li>Read the verdict, the warning signs and what to do next. The icon shows <b className="text-high">!</b> (high) or <b className="text-medium">?</b> (medium) for that tab.</li>
          </ol>
        </div>
        <div id="live" className="scroll-mt-24">
          <h2 className="t-h2">Live Observe sessions</h2>
          <ol className="mt-4 list-decimal space-y-2 pl-5 text-ink-2">
            <li>Click the CUSTODI icon → <b>Live Observe</b>.</li>
            <li>Pick 15, 30 or 60 minutes and press <b>Start Live Observe</b>.</li>
            <li>Chrome asks to let CUSTODI read sites. Allow it — Live Observe can't check pages without it.</li>
            <li>The toolbar icon shows <b className="text-lime">ON</b> and the popup shows a countdown and every page checked.</li>
          </ol>
          <h3 className="t-h3 mt-6" id="stop">
            Stopping a session
          </h3>
          <p className="mt-2 text-ink-2">
            Press <b>Stop now</b> in the popup (or on the <Link to="/live" className="text-accent underline">Live Observe page</Link>). It also stops by itself when
            the timer ends. Either way you get a summary, and CUSTODI hands back the site permission.
          </p>
        </div>
      </section>

      <section id="permissions" className="mt-16 scroll-mt-24">
        <h2 className="t-h2">Permissions, in plain English</h2>
        <div className="panel mt-6 divide-y divide-line">
          {[
            ["activeTab", "Asked at install", "Lets CUSTODI look at the current tab only at the moment you click it. Nothing in the background."],
            ["scripting", "Asked at install", "Lets CUSTODI read the visible text and the kinds of form fields on that page when you scan. It never reads what you type."],
            ["storage", "Asked at install", "Saves your results and settings inside Chrome on your computer."],
            ["alarms", "Asked at install", "Ends a Live Observe session exactly when its timer runs out."],
            [
              "Read and change data on all websites",
              "Only when you start Live Observe",
              "Needed so CUSTODI can check each page you switch to during a session. CUSTODI removes this permission again when the session stops.",
            ],
          ].map(([p, when, why]) => (
            <div key={p} className="grid grid-cols-1 gap-1 p-5 sm:grid-cols-[14rem_10rem_1fr] sm:gap-4">
              <p className="font-mono text-sm text-ink">{p}</p>
              <p className="text-xs text-muted sm:text-sm">{when}</p>
              <p className="text-sm text-ink-2">{why}</p>
            </div>
          ))}
        </div>
        <p className="mt-3 flex items-center gap-2 text-sm text-muted">
          <CheckCircle2 className="h-4 w-4 text-low" /> No account, no server, no tracking. The extension never sends page content anywhere.
        </p>
        <h3 className="t-h3 mt-10" id="limits">
          What it can't do
        </h3>
        <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm text-ink-2">
          <li>Read WhatsApp, SMS or email inboxes, or anything you type.</li>
          <li>Run in the background — it scans only when you click, or during a Live Observe session you start.</li>
          <li>Look up blocklists, domain age or sender authentication — those checks say “unavailable”.</li>
          <li>Guarantee a page is safe. A low result means no obvious warning signs, nothing more.</li>
        </ul>
        <p className="mt-3 text-sm">
          <Link to="/help#limits" className="text-accent underline underline-offset-4">
            Full limitations
          </Link>{" "}
          ·{" "}
          <Link to="/help#privacy" className="text-accent underline underline-offset-4">
            Privacy
          </Link>
        </p>
      </section>

      <section id="troubleshooting" className="mt-16 scroll-mt-24">
        <h2 className="t-h2">Troubleshooting</h2>
        <div className="mt-6 divide-y divide-line border-y border-line">
          {FAQ.map(([q, a]) => (
            <details key={q} className="group py-4">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-medium text-ink [&::-webkit-details-marker]:hidden">
                {q}
                <ChevronDown className="h-4 w-4 text-muted transition-transform group-open:rotate-180" />
              </summary>
              <div className="mt-2 text-sm leading-relaxed text-ink-2">{a}</div>
            </details>
          ))}
        </div>
        <div className="mt-8 flex flex-wrap gap-2">
          <ButtonLink to="/live">Go to Live Observe</ButtonLink>
          <Button variant="secondary" onClick={() => window.location.reload()}>
            I've installed it — check again
          </Button>
        </div>
      </section>
    </Container>
  );
}
