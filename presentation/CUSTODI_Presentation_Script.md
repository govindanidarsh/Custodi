# CUSTODI — Presentation Script (10 slides)

**Deck:** `CUSTODI_Hackathon_Presentation.pptx` (10 slides, 16:9). The same words are in each slide's speaker notes.
**Length:** about 30–45 seconds per slide, roughly 6–7 minutes in total.
**Tone:** speak to the judges like you're explaining it to a friend. Slow down on slides 4 and 5.

> Every message, name, number and web address in the deck is fictional. Every score and test count comes from a real run of the CUSTODI engine and its Test Lab.

---

### Slide 1 — CUSTODI (≈25 s)

> "Think before you trust. Verify before you act.
> We're team CUSTODI — Antriksh, Darsh and Kushagri — and we chose PS 5, *The Fake HR Email*.
> CUSTODI is an on-device check that tells a student whether a placement, internship or recruiter message is safe to act on — and shows exactly why."

**Transition:** "Let's start with what the problem statement actually asks for."

---

### Slide 2 — Understanding the problem statement (≈45 s)

> "This is PS 5, quoted as it appears in our brief. A student pastes a suspicious message and must instantly get a risk level, the reasons, a clear next step, and a reminder to verify through the official placement cell. The brief names three dangers: OTP theft, ignored training and alert fatigue.
> On the right is a fictional fake HR email. It looks professional, but it comes from a personal Gmail, asks the student to share an OTP, and adds a 15-minute deadline with a threat. CUSTODI scores it 65 out of 100, High. The OTP request alone forces High.
> Why isn't 'be careful' enough? Training is forgotten under deadline pressure, constant warnings get ignored, and between receiving a message and verifying it, the student has only the message itself."

**Transition:** "That gap is exactly where CUSTODI sits."

---

### Slide 3 — Our solution (≈40 s)

> "CUSTODI is a defensive verification tool with three ways in.
> The **message scanner**: paste email, SMS or WhatsApp text and get a risk score, the exact words behind it, and what to do next.
> The **website checker** reads an address without ever opening it, flags structural tricks, and says 'unavailable' when reputation is unknown.
> The **Chrome extension** scans the page you're on, but only when you click.
> The journey is always the same: message received, CUSTODI analysis, an assessment you can understand, and one recommended action.
> One honest line: CUSTODI helps students decide. It never guarantees a message is safe."

**Transition:** "So how does it actually work under the hood?"

---

### Slide 4 — How CUSTODI works (≈45 s)

> "Every check runs through the same seven-stage pipeline: input, parsing, thirteen indicator checks written for English and common Hinglish, then context and negation handling, scoring, classification, and an explainable report.
> The website and the Chrome extension both import one TypeScript package, custodi-core, so they can never disagree. Results are saved in local browser storage.
> There's no server and no AI API. That means it costs nothing per scan, nothing leaves the device, and the same input always gives the same result, so we can test it properly."

**Transition:** "The interesting part is how it decides."

---

### Slide 5 — The intelligence (≈50 s, the key slide)

> "Each kind of warning has a fixed weight and counts once. An OTP request is 35, a fee is 30, a bank-detail request is 20. Repeating a phrase can't inflate the score. Under 20 is Low, 20 to 49 is Caution, and 50 and above is High.
> But keywords aren't enough. Context matters. All three of these messages ask for the same bank details.
> On WhatsApp before any offer: **70, High.**
> By email after accepting, but from a Gmail address: **40, Caution**. Verify it.
> Directed to the official onboarding portal after accepting: **zero, Low**. That's normal payroll onboarding.
> Negation matters too: 'never share your OTP' is advice, not a request; a stipend isn't a fee; scam text quoted inside a placement-cell warning becomes a note.
> And one honest limit: CUSTODI reads the wording. It can't confirm that a portal really is official."

**Transition:** "Is this realistic to run? Yes. Here's the evidence."

---

### Slide 6 — Feasibility (≈40 s)

> "Technically, it's built on mature open tools — React, Vite, TypeScript and Chrome's Manifest V3 — around one shared engine.
> Operationally, it needs no cloud and no paid API, and results are in plain language, so no security training is needed.
> On privacy, it only scans when the student acts, never reads inboxes, and keeps results on the device.
> And it's tested: all 120 unit tests pass, all 83 Test Lab cases behave as designed, the production build was checked across 110 page loads with no errors, and we loaded and drove the extension in real Chrome.
> The caveat: those 83 cases are ours and fictional. They're not a real-world accuracy figure."

**Transition:** "Building it is one thing. Sustaining it is another."

---

### Slide 7 — Viability (≈40 s)

> "This is an illustrative business model, and we say so on the slide. Nothing here is validated yet.
> Students get the core checks free and private. The payer is the institution: colleges and universities, through a subscription, in return for placement-cell tools, awareness campaigns and, only with consent, anonymised trends. Recruitment firms are a second segment, through enterprise licences and integrations.
> The argument is simple: preventing even one student from losing money or identity documents can justify a college's subscription.
> The starred items aren't built, and we have no customers or prices yet. That's exactly what a pilot is for."

**Transition:** "And if it works, here's how it grows."

---

### Slide 8 — Scalability and roadmap (≈35 s)

> "We grow in four directions: product, technology, adoption and geography. Only the highlighted column exists today: the 13-check engine, website checker, extension and installable app, running fully locally.
> Next comes more rules and message formats, an optional opt-in backend for institutions, a placement-cell pilot and a Chrome Web Store release.
> Long term: more Indian languages, university and recruiter partnerships, then other regions. We start where the problem is sharpest, with Indian students facing recruitment scams."

**Transition:** "But other tools already exist. Why CUSTODI?"

---

### Slide 9 — Why CUSTODI? (≈40 s)

> "We tried to be fair here. Spam filters, antivirus and URL reputation checkers are good at something CUSTODI deliberately doesn't do: knowing which senders and links are already known to be bad. A placement cell can verify anything, but not instantly, and not at midnight.
> CUSTODI's combination is different: it's built for recruitment scams, reads context rather than just keywords, explains every point, checks messages and websites in one place, and runs locally.
> Other tools ask 'is this sender or link known to be bad?' CUSTODI asks 'what is this message asking me to do, and does that make sense here?'"

**Transition:** "So what happens next?"

---

### Slide 10 — Impact and close (≈40 s)

> "Today it's a working prototype, open on GitHub. Next, we deploy the website, point the extension at it and submit it to the Chrome Web Store. Then a pilot with one placement cell: we introduce it at placement orientation and pin it in the official groups. We'll measure false alarms on genuine messages, scams reported, and how long verification takes. Then we scale through recruiter lists verified by placement cells.
> Our goal is fewer students acting on fake offers before they verify, and we'll measure that, not assume it.
> CUSTODI. Think before you trust. Verify before you act. Because the cost of trusting the wrong message can be much greater than the time it takes to verify it. Thank you."

---

## If you're asked for a live demo

1. `npm install && npm run dev` → http://localhost:5173
2. **Scan:** paste the slide-2 email, choose Email, and enter the sender `hr.northwind.careers@gmail.com`. Expect **65/100 · High (Suspicious)**.
3. **Context:** open the Test Lab (`/lab`) and press **Run all tests**. Expect **83/83**. Find R10 (40) and M42 (0).
4. **Website:** `https://campus-offer-verify-portal.xyz/login` → **45/100 · Suspicious**.
