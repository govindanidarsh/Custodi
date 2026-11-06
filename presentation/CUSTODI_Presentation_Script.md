# CUSTODI — Presentation Script

**Deck:** `CUSTODI_Hackathon_Presentation.pptx` (15 slides, 16:9). The same notes are in each slide's speaker notes.
**Target length:** about 8–9 minutes, plus questions. Times are a guide; slides 8–10 carry the technical case, so don't rush them.

> Every message, name, phone number and web address in the deck is fictional. Every score, check and test number is copied from a real run of the CUSTODI engine and its Test Lab.

---

### 1 · Cover — *Think before you trust. Verify before you act.* (≈20 s)

> "Think before you trust. Verify before you act."
> *(pause)*
> "We're team CUSTODI. CUSTODI helps a student decide whether a placement, internship or recruiter message is safe to act on. It runs on the student's own device and shows its evidence."

---

### 2 · The problem — *It doesn't look like a scam. It looks like good news.* (≈45 s)

> "This is the kind of message we built CUSTODI around. It's fictional, but it's realistic.
> Nothing in it looks dangerous. It says you've been selected. It asks for your bank account and IFSC so it can 'process your joining'. It wants them on WhatsApp, today.
> It works on four levers: **the lure** of a selection with no process, **the ask** for financial details before any offer is accepted, **the channel**, with no official record and nobody to check with, and **the clock**, which leaves no time to ask the placement cell.
> A student doesn't need to be careless to fall for this. They only need to be hopeful."

*Note: the four levers describe how the message works on a person. Slide 3 shows what CUSTODI actually detects.*

---

### 3 · The difference — *Same message. Two very different next steps.* (≈40 s)

> "On the left is what usually happens: a chain of reasonable thoughts that ends with bank details sent over an unrecorded chat.
> On the right is the same message pasted into CUSTODI. This is a real screenshot. It returns **Suspicious, 70 out of 100**, and lists every point: plus 20 for a bank-detail request, plus 20 for moving the conversation off the record, and plus 30 because it asks by message before any offer was accepted.
> The student gets a reason they can understand, not just a red light."

---

### 4 · The product — *One analyzer. Three ways to reach it.* (≈35 s)

> "CUSTODI is one analyzer that you can reach three ways.
> **One:** scan a message, from email, SMS, WhatsApp or anything else. **Two:** check a website address without opening it. **Three:** check the page you're on, using our Chrome extension.
> The website installs as an app, and on a phone you can share a message straight into it. There's also a scan dashboard and a Test Lab, which I'll come back to."

---

### 5 · Flow A — *From doubt to a safe next step* (≈45 s)

> "Here's the student's journey. They get the message and open CUSTODI, either in the browser, as the installed app, or by sharing the message in. They paste it. Adding the sender and answering three quick questions is optional.
> Thirteen checks run on the device. Links are never opened.
> The result is a score and a verdict, then the evidence: the exact words that raised concern, explained in plain language. Last comes one safe next step: verify through your placement cell, never through a number or link inside the message.
> All three screenshots are from that real run."

---

### 6 · Flow B — *Checking a link without opening it* (≈45 s)

> "The website checker reads an address as text. It never opens it, fetches it or previews it.
> It splits the address into three parts: the connection, the **real owner** (the part that matters), and the path. Then it runs nine checks.
> For this fictional address, the domain-pattern check fires: words like 'verify' and 'login' on a cheap .xyz domain. The result is 45 out of 100, Suspicious.
> Look at the two grey rows. Your trusted list is empty, and there's no reputation service connected, so CUSTODI says 'unavailable' rather than pretending. A site is only 'Verified' if it's on your own trusted list. CUSTODI never calls a site 'safe'."

---

### 7 · Flow C — *In Chrome, CUSTODI looks only when you ask* (≈45 s)

> "The extension never watches in the background on its own.
> You click the icon and choose 'This page'. Chrome gives it the current tab, only at that moment. That's the activeTab permission. It reads the page text, the address and what kinds of form fields exist, never what you type. The same analyzer the website uses scores it. The popup shows the verdict and evidence, and the icon gets a badge. You decide what to do.
> The only continuous mode is **Live Observe**. You start it for 15, 30 or 60 minutes and allow site access for that session. Each page you switch to is checked, and the badge says ON the whole time. When the timer ends or you press Stop, you get a summary and the permission is handed back.
> The dashed items, scanning selected text with a right-click and a Chrome Web Store release, are ideas. They're not built yet."

---

### 8 · Flow D — *How the engine reaches a verdict* (≈60 s)

> "Five stages.
> **Read:** the message is treated as untrusted text.
> **Detect:** thirteen checks look for signals: OTP and password requests, fees, urgency, secrecy, app installs, the sender, your answers, links and look-alike domains. The rules cover English and common Hinglish. The reputation check honestly reports 'unavailable'.
> **Apply context** is the highlighted stage, and it's what stops CUSTODI from crying wolf. A warning becomes a zero-point note when it's quoted inside a scam-awareness notice, when it's an OTP sent *to you* with 'never share', or when bank details go to an official portal and aren't asked back by message. Notes are still shown, never hidden.
> **Score:** each category counts once, the weights run from 5 to 35, and the total is capped at 100. Three patterns are so dangerous they force High on their own.
> **Explain:** a band, plus confidence and sender status reported separately, then quoted evidence and a next step."

---

### 9 · Scoring — *Every point is earned — and shown* (≈45 s)

> "These are the actual weights from our scoring code. An OTP, PIN or password request is worth 35. A payment demand and an app install or remote-access request are worth 30 each, and so on down to 5 for unexpected contact.
> Each category counts once, so repeating a phrase can't inflate the score.
> Under 20 is Low risk, 20 to 49 is Caution, and 50 and above is Suspicious. Our WhatsApp message scores 20 plus 20 plus 30: seventy.
> The critical override means a direct OTP, PIN or password request, a remote-access tool, or an .apk or .exe install is High whatever the total.
> And we say it plainly: these are hand-set weights tuned on our own fictional cases. They are not a probability of fraud."

---

### 10 · Why context matters — *Same request. Different context. Different answer.* (≈50 s)

> "Judges usually ask: does every request for bank details get flagged? No. All three of these ask for the same thing.
> **Left:** WhatsApp, before any offer. Seventy, Suspicious.
> **Middle:** an email after the student accepted an offer, but from a Gmail address and asking for details by email. Forty, Caution: verify it first. There's no plus-30, because the offer was already accepted.
> **Right:** after accepting, directed to the official onboarding portal, with 'do not email these details'. Zero, Low risk. That's normal payroll onboarding, and CUSTODI shows the request as a note instead of a warning.
> CUSTODI doesn't flag the words 'bank account'. It weighs who's asking, how, and when.
> The middle and right messages are real Test Lab cases, R10 and M42. The left one is our demo message."

---

### 11 · Flow E — *Built so messages never leave the device* (≈40 s)

> "Two front doors, one engine. The web app (which is also the installable app) and the Chrome extension both import the same TypeScript package, `@custodi/core`. That's why the website, the phone app and the extension always agree.
> Everything sits inside the device boundary. There's no server, no AI service, no outside lookups, no uploads and no accounts.
> Results are stored locally, and full message text is off by default. The extension only talks to the website on localhost, to show Live Observe status."

---

### 12 · Privacy and honest limits — *What CUSTODI won't pretend to know* (≈40 s)

> "Zero messages uploaded, because there's nowhere to upload them to. Messages are analysed in memory, links are only read as text, and results can be exported or deleted.
> On the right are the limits we state ourselves. CUSTODI can't read inboxes; you paste or share the message in. It does no blocklist, domain-age or sender-authentication lookups. It's rules-based, so new scam wording can slip through. A Low result means no signs were found, not that the message is safe. It covers English and common Hinglish. And our weights are tuned on our own cases.
> The screenshot is real: checks that can't run say 'unavailable'."

---

### 13 · Validation — *Tested on 83 cases — 34 of them must stay calm* (≈45 s)

> "The Test Lab is inside the product. Anyone can press 'Run all tests'.
> There are 83 fictional cases: placement scams, 23 genuine college and job messages, website addresses and page scans. All 83 behave as designed. That's 49 risky cases caught, 34 harmless ones left calm, no false alarms and no misses. On top of that, 120 automated unit tests pass.
> The honest caveat: we wrote these cases, so this proves the engine does what we designed. It is **not** a real-world accuracy figure.
> When we tested in a real Chrome browser, CUSTODI flagged a genuine payroll message by mistake. We fixed the rule and added that exact message as regression case R01."

---

### 14 · Why CUSTODI — *What's different today, and what comes next* (≈35 s)

> "What's different is how CUSTODI behaves. It shows its working. It understands context. It's honest about what it can't check. And it's private by design.
> On the right, clearly marked as proposed: a pilot with a placement cell to measure CUSTODI on real, consented and anonymised messages, which is the most important next step. After that: verified recruiter domains supplied by the placement cell, a Chrome Web Store release, opt-in reputation lookups, and more Indian languages."

---

### 15 · Close — *Think before you trust. Verify before you act.* (≈15 s)

> "Paste any message into CUSTODI, or open the Test Lab and press 'Run all tests'.
> Think before you trust. Verify before you act. Thank you."

---

## Live-demo fallback

If the projector or laptop can't run the app, every product screen in the deck is a real screenshot. To demo live:

1. `npm install && npm run dev` → open http://localhost:5173
2. **Scan:** paste the slide-2 message, choose WhatsApp, and press **Analyse message**. Expect **70/100 · Suspicious**.
3. **Test Lab:** press **Run all tests**. Expect **83/83**, TP 49 · TN 34 · FP 0 · FN 0.
4. **Website check:** enter `https://campus-offer-verify-portal.xyz/login`. Expect **45/100 · Suspicious**.
