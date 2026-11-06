# CUSTODI — Judge Q&A

Every answer here matches the code in `packages/core` and the real test runs: 120/120 unit tests, and 83/83 Test Lab cases (TP 49 · TN 34 · FP 0 · FN 0). When a question goes beyond what's built, say so plainly. Honesty scores better than a confident guess.

---

### Why is this not just another spam filter?

Spam filters mostly ask *"is this sender or link known to be bad?"*, using reputation data and bulk patterns. They're good at that, and CUSTODI doesn't replace them. CUSTODI asks *"what is this message asking the student to do, and does that make sense here?"*

It's built specifically for recruitment scams: OTP requests, fees, bank details, app installs and pressure. It explains every point, and it works on a brand-new number or domain that no blocklist has seen yet.

### How does the scoring engine work?

There are 13 checks. Each finding belongs to a category with a fixed weight, and **each category counts once**, so repetition can't inflate the score:
- OTP/PIN/password request: +35
- payment or fee: +30
- app install or remote access: +30
- impersonation, bank-detail request, moving you off the record, ID documents over chat, job with no assessment, hidden AI instructions: +20 each
- threat, secrecy, suspicious link: +15 each
- urgency, unrealistic reward: +10 each
- unexpected contact: +5

There are two context bonuses: +20 for a fee in a job context, and +30 for bank details requested by message before any accepted offer. The score is capped at 100.

The bands are **0–19 Low · 20–49 Caution · 50–100 Suspicious (High)**.

A **critical override** makes the result High whatever the score, for three things: a direct OTP/PIN/password request, a remote-access tool, or an `.apk`/`.exe` install.

The weights are hand-set and calibrated on our fictional cases. They are **not** a probability of fraud.

### Why not use an LLM?

1. **Explainability.** Every point maps to quoted words. An LLM verdict is hard to audit.
2. **Privacy and cost.** CUSTODI runs fully on the device: no API key, no per-scan cost, nothing uploaded.
3. **Predictability.** The same input always gives the same result, so 120 unit tests and 83 Test Lab cases can pin its behaviour down.
4. **Safety.** Scam messages can contain instructions aimed at AI tools. CUSTODI has no AI to hijack, and it *flags* those instructions (+20).

A model could later be an optional second opinion, but the rules engine would still own the score.

### How do you avoid false positives?

- 23 of the 83 Test Lab cases are genuine college and job messages, and all of them stay calm.
- **Negation:** "never share your OTP" is treated as advice, not a request (case M14). Hinglish negations like "mat" and "nahi" are handled too.
- **Not a fee:** stipends and salaries aren't fees, and an offer letter saying "no fee" stays Low (M15).
- **Quoted warnings:** scam text quoted inside a placement-cell alert becomes a note (R07).
- **Official channel:** bank details for an official portal, not asked back by message, become a note (M42).
- A personal email address is only a warning when the message claims to speak for a company or job.
- When real-Chrome testing found a false alarm on a genuine payroll message, we fixed it and kept it as regression case R01.

We do **not** claim zero real-world false positives. We've only measured our own cases.

### What happens when a scammer imitates an official portal?

**This is a real weakness, and we tested it.** If a scam message says "official onboarding portal" and links to a fake site, the bank-detail request is treated like legitimate onboarding:
- With a suspicious `.xyz` link and no sender, it scores **15/100, Low**. Only the link adds points.
- With a personal Gmail sender, it scores **35/100, Caution**.
- "Official HR portal" wording before any offer, with no link, currently scores **0/100, Low**.

What still protects the student:
- the link checks still run (look-alikes, risky endings, hidden destinations);
- sender checks still run;
- the advice on every result is to reach the organisation through your placement cell or an address you type yourself;
- a site is only ever "Verified" if it's on the student's own trusted list.

The fix we'd make next: only apply the portal exception after an accepted offer, and only when the portal's domain is on a trusted list. **CUSTODI reads wording. It cannot confirm a portal is genuinely official.**

### What happens if a legitimate company sends a suspicious-looking message?

CUSTODI will flag what it sees, such as a fee demand or an OTP request, because genuine companies shouldn't ask for those either. If a legitimate message uses scam-like wording, the result is Caution or Suspicious with the exact reason shown, and the next step is to verify through the placement cell. That's the right outcome: the student loses a minute, not their money. A Low result is never presented as "safe".

### How is it feasible without cloud infrastructure?

The analyzer is plain TypeScript that runs in the browser. The website is static files, and the repo includes a Vercel config: install with `npm ci`, build with `npm run build:web`, and serve `apps/web/dist`. The extension bundles the same analyzer. There's no database, no server and no paid API. The installable app caches its app shell, so analysis works offline once the site has loaded.

### How will you make money? Who will pay?

This is an **illustrative** model, and nothing is validated yet.
- **Students:** free core checks, with optional premium features later.
- **Colleges and universities:** an institutional subscription for placement-cell tools, awareness campaigns, and anonymised trends (only with consent). These features are not built yet.
- **Recruitment firms and placement partners:** an enterprise licence or custom integrations.

The value argument: preventing even one student from losing money or identity documents can justify a college's subscription. We have no customers, pricing or validated willingness to pay. The pilot is how we'd find out.

### How will you scale?

- **Product:** more rules, contexts, formats and languages.
- **Technical:** the shared, modular core works the same everywhere. An optional, opt-in backend would only be added for institutions.
- **Adoption:** placement-cell pilot, then the Chrome Web Store, then university partnerships.
- **Geography:** Indian student recruitment scams first, then wider job-seeker protection, then other languages and regions.

Adding a rule doesn't require a server, and every user gets the same engine.

### What are your limitations?

- It can't read WhatsApp, SMS or email inboxes. The student pastes or shares the message in.
- No blocklist, domain-age or sender-authentication lookups. Those checks show as **unavailable**, never faked.
- It's rules-based, so new scam wording can slip through, and the official-portal wording can be abused (see above).
- It covers English and common Hinglish only.
- The weights are tuned on our own fictional cases. There's no real-world accuracy figure yet.
- The extension is loaded unpacked and isn't on the Chrome Web Store yet.

### How do you measure real-world impact?

Through a pilot with one placement cell, with consent:
1. **False alarms** on genuine messages, measured first, because alert fatigue kills safety tools.
2. Scams reported to the placement cell that CUSTODI flagged, or missed.
3. How long students take to verify a message.
4. Self-reported decisions: did the student pause and verify before acting?

We'd publish these as measured, not assumed.

### How do you protect user privacy?

- There's no server, account, analytics or upload path.
- Messages are analysed in memory on the device. Links are read as text and never opened.
- Only results and short evidence quotes are stored, locally. Saving full text is opt-in, and users can export or delete their data.
- The extension reads a page only when the user clicks (`activeTab`) or during a Live Observe session they start. The extra site permission is removed when the session ends.
- CUSTODI never asks for OTPs, PINs, passwords or bank details.

### What is implemented versus planned?

**Implemented and tested:**
- message scanner with 13 checks, scoring, context and negation handling
- website checker
- Chrome extension (Home, Message, Website, Live Observe, History; "Open CUSTODI Website")
- installable app
- dashboard with export and delete
- Test Lab (83 cases)
- 120 unit tests
- deployment config

**Planned, not built:**
- placement-cell pilot
- Chrome Web Store release
- institution dashboards and verified recruiter lists
- optional institutional backend
- opt-in reputation lookups
- more languages
- a fix for the official-portal exception

### Is the 100% Test Lab result real?

Yes, but only for **our own fictional cases**. It shows the engine does what we designed. It is **not** a real-world accuracy figure, and the Test Lab says so on screen. Judges can press **Run all tests** at `/lab` and see every case's expected result, actual result and reason.

### Why should a student trust CUSTODI?

They don't have to trust a verdict. CUSTODI shows its working: the quoted words, the points and the checks that couldn't run. The final step always sends them to a human source they already trust: their placement cell.
