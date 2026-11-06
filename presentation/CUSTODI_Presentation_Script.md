# CUSTODI — Presentation Script (10 slides)

**Deck:** `CUSTODI_Hackathon_Presentation.pptx` (10 slides, 16:9). The same words are in each slide's speaker notes. Slide previews are in `presentation/slide-previews/`.
**Length:** about 30–45 seconds per slide, roughly 6–7 minutes in total.
**Delivery:** the slides are deliberately light on text. The visuals carry the story and your voice carries the detail, so slow down on slides 4 and 5.

> Every message, name, number and web address is fictional. The device screens are real CUSTODI screenshots. Every score and test count comes from a real run of the CUSTODI engine and its Test Lab.

---

### 1 · Launch (≈20 s)
*Visual: the official emblem, lit, with its reflection.*

> "Think before you trust. Verify before you act.
> We're team CUSTODI — Antriksh, Darsh and Kushagri — and we chose PS 5, *The Fake HR Email*.
> CUSTODI is an on-device check for placement, internship and recruiter messages."

**→** "Let's look at what a fake HR message really looks like."

---

### 2 · The problem (≈45 s)
*Visual: a phone with a fictional fake offer, four callouts, CUSTODI's verdict.*

> "PS 5 asks for exactly this: a student pastes a suspicious message and instantly gets a risk level, the reasons, a clear next step, and a reminder to verify through the placement cell. It names three dangers: OTP theft, ignored training and alert fatigue.
> Here's a fictional message on a student's phone. It doesn't look like a scam. It looks like a first job offer.
> But look closer. It promises selection with no interview. It asks for a registration fee. It wants bank details by message. And it sets a two-hour deadline.
> Under that pressure, training is forgotten, and the student has only the message. CUSTODI scores this exact message 100 out of 100, High."

**→** "So we built the thing students can check with."

---

### 3 · Meet CUSTODI (≈35 s)
*Visual: the real website on a MacBook, a real scan result on an iPhone.*

> "This is CUSTODI, the real product on a laptop and a phone.
> There are three ways in. The message scanner checks anything you paste. The website checker reads an address without opening it. And the Chrome extension checks the page you're on, when you click.
> Whichever way in, you get a risk level, the exact words behind it, and one recommended action. It helps students decide; it never guarantees a message is safe."

**→** "Here's how it's built."

---

### 4 · Technical architecture (≈45 s)
*Visual: a silver-white engineering diagram with a single spine.*

> "Both surfaces — the React and Vite website, which also installs as an app, and the Manifest V3 Chrome extension — import one shared TypeScript package, custodi-core.
> Input flows through the shared analyzer, then detection and context: thirteen checks in English and common Hinglish, with negation and official-channel handling. Then comes a deterministic score, then an explainable output. Results are saved in local storage.
> Because it's deterministic and local, it's testable, it costs nothing per scan, it sends nothing anywhere, and the website, app and extension can never disagree."

**→** "The clever part is how it reads context."

---

### 5 · The intelligence (≈50 s, the key slide)
*Visual: three phones showing real results of 70, 40 and 0.*

> "All three of these messages ask for the same bank details, and these are real CUSTODI results.
> On WhatsApp, before any offer: **70, High**.
> By email after accepting, but from a Gmail address: **40, Caution**. Verify it.
> Through the official onboarding portal after accepting: **zero, Low**. That's normal payroll onboarding.
> Context changes the verdict, not keywords. The engine also handles negation: 'never share your OTP' is advice, not a request, and a stipend isn't a fee.
> One honest limit: CUSTODI reads the wording. It can't confirm a portal is genuinely official."

**→** "Can this actually run in the real world?"

---

### 6 · Feasibility (≈40 s)
*Visual: MacBook showing the Test Lab, the real extension popup, the app on a phone.*

> "It runs on what students already have: a laptop browser, a phone, and Chrome.
> It's built on mature open tools: React, Vite, TypeScript and a Manifest V3 extension, around one shared engine. There's no server, no cloud and no paid API, just static hosting. It scans only when asked and never reads inboxes.
> The laptop is showing our Test Lab: 83 of 83 cases behave as designed. On top of that, 120 unit tests pass, 110 production page loads ran with no errors, and we drove the extension in real Chrome.
> Those cases are our own fictional ones, so this isn't a real-world accuracy claim."

**→** "Building it is one thing. Sustaining it is another."

---

### 7 · Business viability (≈40 s)
*Visual: a silver-white ecosystem with CUSTODI at the centre and the proposed revenue model.*

> "This is a proposed model, not existing revenue, and the slide says so.
> Students and job seekers get free core checks. Colleges and universities are the payers, through institutional subscriptions, in return for placement-cell tools, awareness campaigns and, only with consent, anonymised trends. Recruitment organisations are a second segment, through enterprise licensing and custom integrations.
> The argument: preventing even one student from losing money or identity documents can justify a college's subscription.
> The starred features aren't built, and we have no customers or pricing yet. A pilot is how we'd validate it."

**→** "And if it works, it grows outward."

---

### 8 · Scalability (≈35 s)
*Visual: rings expanding from one student to wider markets.*

> "CUSTODI grows outward like ripples. The solid inner ring is the only one that exists today: the 13-check engine, website checker, extension and installable app, running fully locally.
> Next are colleges: a placement-cell pilot and a Chrome Web Store release, with more rules and an optional, opt-in backend for institutions.
> Later come universities, the recruitment ecosystem, and new languages and regions. A shared engine means every new rule reaches every surface at once.
> We have no partnerships or customers yet. This is the path, not a claim."

**→** "Why build this when other tools exist?"

---

### 9 · Why CUSTODI (≈40 s)
*Visual: a silver-white comparison with CUSTODI in a dark column.*

> "We kept this fair. Spam filters, URL reputation checkers and browser security are good at something CUSTODI deliberately doesn't do: knowing which senders and links are already known to be bad. Manual verification through the placement cell can check anything, but not instantly, and not at midnight.
> CUSTODI's difference is the combination: it's built for recruitment scams, reads context rather than just keywords, explains every point, checks messages and websites in one place, and runs locally.
> Others ask if something is known to be bad. CUSTODI asks if it makes sense."

**→** "Here's where we go from here."

---

### 10 · Close (≈25 s)
*Visual: the emblem and the closing line.*

> "Our next step is a pilot with one placement cell: introduce CUSTODI at placement orientation, then measure false alarms on genuine messages, scams reported and time to verify, and grow from there.
> Because the cost of trusting the wrong message is far greater than the time it takes to verify it.
> CUSTODI. Think before you trust. Verify before you act. Thank you."

---

## If you're asked for a live demo

1. `npm install && npm run dev` → http://localhost:5173
2. **Slide 2's message:** paste it into **Scan** (WhatsApp). Expect **100/100 · High**.
3. **Slide 5:** open **Test Lab** (`/lab`) and press **Run all tests**. Expect **83/83**. Find R10 (40) and M42 (0).
4. **Website:** `https://campus-offer-verify-portal.xyz/login` → **45/100 · Suspicious**.
