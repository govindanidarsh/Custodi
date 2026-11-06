# CUSTODI — Frontend design audit (2026-11-06)

What was wrong, what changed, and how it was verified. Scoring logic, thresholds, the 13 checks, routes, PWA,
intro videos, the official emblem and all privacy safeguards are unchanged.

## Findings → fixes

| Area | Finding | Fix |
|---|---|---|
| Landing — accuracy | Analysis scene said “Twelve real checks”; the engine runs 13. Proof section said “the failure is shown” with 0 failures. | All counts and copy now come from the live engine run; no hard-coded numbers. |
| Landing — hero | Generic split hero: pointer-tilt emblem, radial glow, dot grid, scroll parallax. Never said *who* it protects. | Static official emblem; eyebrow names the audience (students facing placement/internship/recruiter messages); one-sentence *what*; three *why* facts. Glow, tilt and parallax removed. |
| Landing — problem | “The digital world is full of hidden threats” over blurred floating pills (decorative motion, stock copy). | Editorial section with one realistic fictional WhatsApp offer and the four levers it pulls (lure, ask, channel, clock). |
| Landing — story | Three unrelated sample messages. | One message followed end-to-end: problem → 13 checks run live as you scroll → score built from real weights → the same bank request in three contexts (70 / 40 / 0, from Test Lab cases R10 and M42). |
| Landing — extension | Fake browser mock with skeleton bars, a countdown timer that ticked for show, and a “Stop now” that looked like a button but did nothing. | Real popup screenshot captured from the extension loaded in Chrome, plus the actual five-step flow and permissions. |
| Landing — proof | Two identical card boxes. | Asymmetric: live 83/83 result with a real confusion matrix; dashboard count from this device. |
| Design system | Pill buttons and 20px cards everywhere (generic SaaS feel); light theme was warm ivory/beige, off-brand. | 10px button radius, 14px cards, segmented controls instead of pills; light theme moved to cool silver-white with navy ink. Hero and closing are navy brand bands in both themes so the official emblem always sits on navy (its edges were cut from a navy background). |
| Extension | No way to reach the website; no website check in the popup; latest result hidden in History; system fonts — looked like a different product. | New **Home**: *Open CUSTODI Website* (central `src/config.ts`, https-only production URL, localhost fallback labelled), *Scan this page*, quick routes, latest result (expands to full report), “can and can't see”, help links. New **Website** tab (address check, *Use this tab*). History rows expand. Same tokens and fonts (Instrument Serif, Inter, JetBrains Mono) as the website; dark by default, light with the system. |
| Docs | README was a plain text list. | Rewritten: problem, features, scoring with the context example, Mermaid architecture + workflow, setup, extension install + URL config, validation scope, privacy, limits, roadmap, real screenshots. |

## Verification (real browsers, not assumed)

- `npm run check` — typecheck (all workspaces), 120/120 unit tests, website + extension builds; repeated from a clean `npm ci`.
- Website, production build: 11 routes × 320 / 390 / 768 / 1280 / 1920 px × dark and light = 110 loads, **0 horizontal overflow, 0 console errors**.
- Motion on: analysis scene steps 0 → 5 → 10 → 13 of 13 checks while scrolling; intro video plays and Esc closes it. Reduced motion: everything rendered without animation.
- Keyboard: skip link first, logical tab order, visible 2px accent focus ring.
- Extension: loaded unpacked into Chrome (`Extensions.loadUnpacked`), popup driven for real in dark and light — message scan 70/100, website check 45/100, latest result and history expand, *Open CUSTODI Website* → `http://localhost:5173/`, website guide → `/extension`, help guide → bundled `welcome.html`; with `VITE_CUSTODI_WEB_URL=https://…` it opens that origin; a non-https value is rejected. 0 console errors.

## Not covered / remaining

- *Scan this page* and Live Observe need a real toolbar click (activeTab), which headless Chrome can't perform; their code is unchanged from the previously tested version.
- The production website URL isn't known yet — set it in `apps/extension/src/config.ts` when the deployment is live.
- The extension only connects to the website on `localhost` (Live Observe status); the production origin would need adding to `externally_connectable`.
