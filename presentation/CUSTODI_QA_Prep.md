# CUSTODI — Judge Q&A Prep

Every answer below matches the code in `packages/core` and the real Test Lab run (83/83 cases, TP 49 · TN 34 · FP 0 · FN 0; 120 unit tests passing). If a question goes beyond what's built, say so. Don't guess.

---

## Problem and user

**Q: Who is the target user?**
College students who receive placement, internship and recruiter messages over email, SMS and WhatsApp. That's mainly people applying for their first job, who are hopeful, under time pressure and unsure what a genuine HR process looks like.

**Q: Why not just tell students "never share bank details"?**
Because genuine employers *do* need bank details, after an offer is accepted and through an official payroll or onboarding portal. A blanket rule either gets ignored or blocks real onboarding. CUSTODI checks the context: who is asking, through which channel, and at what stage.

**Q: Do you have statistics on how common these scams are?**
We deliberately didn't put statistics we can't source on the slides. The problem is the shape of the message on slide 2, which is designed to look like good news. If asked, say we focused on building and validating the detector rather than quoting numbers we haven't verified.

---

## How it works

**Q: How is the risk score calculated?**
Every check produces findings. Each *category* of warning adds fixed points **once**, however many phrases trigger it, and the total is capped at 100 (`scoring.ts`):
OTP/PIN/password request +35 · payment or fee +30 · app install or remote access +30 · impersonation or domain mismatch +20 · account threat +15 · secrecy +15 · suspicious link +15 · urgency +10 · unrealistic reward +10 · unexpected contact +5.
These categories add +20 each: ID documents over chat, job promised with no assessment, bank-account details requested, a sensitive request you report, hidden instructions aimed at AI checkers, and moving you off the record (Telegram, phone call, informal channel).
Context bonuses: +20 if a fee appears in a job context; +30 if bank details are requested back by message before any accepted offer.
Bands: **0–19 Low risk · 20–49 Caution · 50–100 Suspicious.**

**Q: What's the critical override?**
Three patterns force **High** whatever the total: a direct OTP/PIN/password (or card/UPI secret) request, a remote-access tool such as AnyDesk, and an app file sent outside a store (.apk, .exe, .scr, .bat, .msi, .cmd, .jar).

**Q: Where do the weights come from? Are they a probability?**
They're hand-set and calibrated only against our fictional Test Lab cases. They are **not** a statistically validated probability of fraud, and the app says so in its own risk-calculation check.

**Q: Why rules and not machine learning or an LLM?**
Three reasons. Rules are **explainable**: every point maps to quoted words. They run **fully offline on the device**, with no data leaving it. And they're **testable**: 83 cases and 120 unit tests pin the behaviour down. We have no real, consented dataset to train on, and training on invented data would just teach a model our assumptions. A model could later be an *optional* second opinion, but the rules engine would still own the final score.

**Q: What are the 13 checks?**
Message received & parsed → OTP, password & PIN requests → payment & registration fees → artificial urgency & threats → secrecy & manipulation → apps, remote access & documents → sender indicators → your answers (context) → link extraction & structure → look-alike & impersonation → threat intelligence & reputation → risk calculation → assessment & recommendations. (`MESSAGE_STAGES` in `pipeline.ts`.)

**Q: Does it handle Hinglish?**
Yes, for common phrasing. Test Lab includes Hinglish cases, e.g. a registration fee and an OTP request written in Hinglish. Other Indian languages aren't supported yet; that's on the roadmap.

---

## False positives and context

**Q: Why doesn't every message with a bank-account request get flagged?**
A bank-detail request scores +20 on its own (Caution). What pushes it to Suspicious is context: +30 if it's asked back **by message before any accepted offer**, and +20 if the reply route is informal (WhatsApp, SMS, "this number"). If the details are directed to an **official portal or payroll system** and *not* asked back by message, the finding becomes a zero-point note. From the Test Lab:
- WhatsApp, before any offer (demo message): **70 · Suspicious**
- R10, email after accepting but from a Gmail address: **40 · Caution**
- M42, official onboarding portal after accepting: **0 · Low risk**

**Q: How do contextual exceptions work exactly?**
`applyMessageContext()` turns a warning into an *info note* (0 points, still shown) in three cases:
1. **Awareness notices:** scam wording that only appears inside quotes in a message warning about scams ("Students received 'share the OTP…'. Do not respond.").
2. **Genuine OTP delivery:** "Enter OTP 482913 on the portal… never share it" is a code sent *to you*, not a request to share one.
3. **Official-portal onboarding:** bank details directed to an official/payroll/HR portal and not requested back by message.
The exceptions are narrow on purpose. A familiar sender, for example, **never** cancels a serious request, because accounts get hijacked.

**Q: How do you avoid false positives in general?**
- 23 of the 83 Test Lab cases are genuine college and job messages that must stay calm. All of them do.
- Each category counts once, so repeated wording can't inflate the score.
- A personal email address is only a warning when the message claims to speak for an organisation or a job.
- "Sale ends today" on a shopping page doesn't raise risk; urgency only matters in a scam context.
- A login word alone on an unknown site stays Low (case U14), so users don't get alert fatigue.
- When live testing in real Chrome flagged a genuine payroll message, we fixed the rule and added that exact message as regression case **R01**.

**Q: What about false negatives?**
New scam wording our rules don't cover can slip through. We say this in the app and on slide 12. A Low result is worded as "no obvious warning indicators detected. This does not guarantee the message is safe."

---

## Missing information

**Q: What happens when sender or threat-intelligence information is unavailable?**
CUSTODI reports it rather than guessing:
- **Reputation check:** always "unavailable" ("No reputation database or sender-verification service is connected"). It never pretends it looked anything up.
- **Sender:** if no sender is given, the check shows as unavailable. Sender status is reported separately as *verified* (only if the domain is on the user's own trusted list), *unverified*, or *unknown*. Phone numbers can't be verified.
- **Context questions skipped:** shown as unavailable; CUSTODI judges the text alone.
- **Confidence** is reported separately (low/medium/high) based on message length, whether a sender was given, the channel, and how many questions were answered. It describes how much CUSTODI had to work with, not how likely fraud is.

**Q: Can a website ever be marked "safe"?**
No. A site is **Verified** only if its domain is on the user's own trusted list. Otherwise it's **Suspicious** (tricks found) or **Unknown** (no tricks found, but no proof either).

---

## Chrome extension

**Q: What does the extension actually do?**
- **This page:** one click scans the current tab, reading its visible text, its address and the *kinds* of form fields (e.g. password, card, OTP), never what you type.
- **Message:** paste a message into the popup and get the same analysis as the website.
- **Live Observe:** a session *you* start for 15, 30 or 60 minutes. While it runs, each page you switch to is checked, and the icon shows **ON**. It stops on the timer or on "Stop now", then shows a summary and gives the site permission back.

**Q: What permissions does it ask for?**
`activeTab` (the current tab, only when clicked), `scripting` (to read page text and field types when you scan), `storage` (results on your computer) and `alarms` (to end Live Observe on time). "Read and change data on all websites" is **optional** and only requested when you start Live Observe. It's removed when the session stops.

**Q: Can it read WhatsApp, Gmail or SMS?**
No. It can't read inboxes or apps. You paste the message, or share it into the installed web app on a phone.

**Q: Is it on the Chrome Web Store?**
Not yet. It's loaded "unpacked" in developer mode. A Web Store release is on the proposed roadmap.

**Q: Is "right-click → scan selected text" available?**
No. It's proposed, not built.

---

## Privacy and architecture

**Q: What data is processed locally? Does anything leave the device?**
Everything is processed locally. There is **no server, no AI service, no outside lookups, no uploads and no accounts.** The website, the installable app and the extension all import the same TypeScript package, `@custodi/core`, and run it in the browser.

**Q: What's stored?**
By default, only the analysis result with short evidence quotes, kept in browser storage (web app) or `chrome.storage.local` (extension). Saving the full message text is an opt-in setting. Users can export (JSON/CSV) or clear their history.

**Q: Do you open the links in a message?**
Never. Links are read as text. CUSTODI never opens, fetches or previews them.

**Q: What if a scammer hides instructions for AI tools inside the message?**
CUSTODI uses no AI, so there's nothing to hijack. It *detects* such text anyway ("Hidden instructions aimed at AI checkers", +20), because hiding instructions is itself a warning sign.

**Q: Does it work offline?**
Yes, once loaded. The installable app caches its app shell with a service worker, and the analysis needs no network.

**Q: What's the tech stack?**
npm-workspaces monorepo. `packages/core`: TypeScript, tested with Vitest. `apps/web`: React 19, Vite, Tailwind CSS v4, Framer Motion, GSAP, PWA. `apps/extension`: Manifest V3 with a Vite multi-entry build.

---

## Validation and limits

**Q: Is 100% accuracy real?**
Only on **our own fictional cases**. All 83 behave as designed (49 true positives, 34 true negatives, 0 false positives, 0 false negatives), which shows the engine does what we designed. It is **not** a real-world accuracy figure, and the Test Lab says so on screen. Real-world performance needs a pilot with real, consented messages.

**Q: How can judges verify the numbers?**
Open the Test Lab (`/lab`) and press **Run all tests**. Every case runs live through the same engine, with its expected result, actual result and reason. `npm test` runs the 120 unit tests.

**Q: What are the main limitations?**
It can't read inboxes. It has no reputation, domain-age or sender-authentication lookups. It's rules-based, so new wording can slip through. Low never means safe. It covers English and common Hinglish only. The weights are tuned on our own cases. The extension isn't on the Web Store.

**Q: How would you measure real-world performance?**
With a pilot alongside a placement cell: students voluntarily submit messages they received, anonymised and with consent, and the placement cell labels them. We'd measure false alarms on genuine messages first, because alert fatigue is what makes people ignore safety tools.

---

## Differentiation and next steps

**Q: How is this different from a spam filter or Google Safe Browsing?**
Spam filters and blocklists judge *senders and URLs* that are already known to be bad. CUSTODI judges *what the message asks you to do*: share an OTP, pay a fee, send bank details on WhatsApp. It works on a brand-new number or domain, explains each point in plain language, and runs privately on the device. They complement each other; we don't claim to replace them.

**Q: What would you build next?**
In order: a placement-cell pilot, a recruiter-domain list verified by the placement cell (feeding the trusted list), a Chrome Web Store release, opt-in reputation lookups, and more Indian languages. All of these are proposed, not built.

**Q: Could colleges use it?**
That's the plan for the pilot. There's a fictional "college demo" page in the app, but nothing has been deployed with a real college yet.
