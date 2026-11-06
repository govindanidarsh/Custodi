import { analyzeMessage, analyzeUrl, buildSegments, DEFAULT_SCORING, runTestSuite, SAMPLE_MESSAGES, TEST_CASES, type MessageCase, type MessageReport } from "@custodi/core";
import { motion, useReducedMotion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight, Check, ScanLine, X } from "lucide-react";
import { useLayoutEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router";
import { Anatomy, ConnectionAndTrust } from "../components/WebsiteChecker";
import { useHistory } from "../lib/store";
import { Emblem } from "../ui/Art";
import { RiskBadge, Tag } from "../ui/Badge";
import { ButtonLink } from "../ui/Button";
import { Container, Reveal } from "../ui/Layout";

gsap.registerPlugin(ScrollTrigger);

/**
 * Landing page. One fictional message is followed from arrival to verdict, and every number on the
 * page is computed live by @custodi/core — nothing here is a scripted result.
 */

// The fictional WhatsApp message used throughout the story (same one as the pitch deck).
const DEMO = {
  channel: "whatsapp" as const,
  text: "Hi, this is HR from Northwind Placements. You have been selected for the internship. Please send your bank account number and IFSC code on WhatsApp to this number today so we can process your joining.",
};
const caseById = (id: string) => TEST_CASES.find((c) => c.id === id) as MessageCase;

const TONE = { high: "text-high", medium: "text-medium", low: "text-low" } as const;
const BAR = { high: "bg-high", medium: "bg-medium", low: "bg-low" } as const;

function Eyebrow({ n, children, onDark = false }: { n: string; children: React.ReactNode; onDark?: boolean }) {
  return (
    <p className={`t-eyebrow flex items-center gap-3 ${onDark ? "text-[#8fb4e6]" : "text-accent"}`}>
      <span className={onDark ? "text-white/45" : "text-muted"}>{n}</span>
      <span className="h-px w-8 bg-current" />
      {children}
    </p>
  );
}

/* ================================================================ HERO — what, who, why */
function Hero() {
  return (
    <section className="dark relative overflow-hidden border-b border-line bg-bg text-ink">
      <Container wide className="grid min-h-[calc(100svh-4rem)] grid-cols-1 items-center gap-6 py-10 sm:gap-10 sm:py-14 lg:grid-cols-[1.15fr_0.85fr] lg:py-0">
        <div className="order-2 lg:order-1">
          <p className="t-eyebrow text-accent">For students facing placement, internship &amp; recruiter messages</p>
          <h1 className="mt-6 font-display text-[clamp(3rem,7vw,6.2rem)] leading-[0.92] tracking-[-0.02em] text-ink">
            Think before you trust.
            <span className="mt-3 block text-[0.6em] text-muted italic">Verify before you act.</span>
          </h1>
          <p className="t-body-lg mt-7 max-w-xl text-ink-2">
            CUSTODI checks a suspicious message — or the link inside it — for the moves scammers rely on, then quotes the exact words behind every warning and tells
            you the one safe next step.
          </p>
          <div className="mt-9 flex flex-wrap items-center gap-3">
            <ButtonLink to="/scan" size="lg">
              <ScanLine className="h-5 w-5" /> Scan a message
            </ButtonLink>
            <ButtonLink to="/website" size="lg" variant="secondary">
              Check a website
            </ButtonLink>
            <Link to="/extension" className="px-2 py-3 text-sm text-ink-2 underline decoration-line-strong underline-offset-4 hover:text-accent">
              Get the Chrome extension
            </Link>
          </div>
          <dl className="mt-12 grid max-w-xl grid-cols-1 gap-5 border-t border-line pt-6 sm:grid-cols-3">
            {[
              ["Runs on your device", "No server, no account, no uploads."],
              ["Shows its working", "Every point traced to quoted words."],
              ["Never says “safe”", "Missing checks are labelled unavailable."],
            ].map(([t, d]) => (
              <div key={t}>
                <dt className="text-sm font-semibold text-ink">{t}</dt>
                <dd className="mt-1 text-sm leading-snug text-muted">{d}</dd>
              </div>
            ))}
          </dl>
        </div>
        <div className="order-1 flex justify-center lg:order-2 lg:justify-end">
          <Emblem className="h-[18svh] min-h-[130px] w-auto aspect-[262/334] sm:h-[26svh] lg:h-[min(62svh,520px)]" alt="CUSTODI emblem" sizes="(min-width: 1024px) 420px, 50vw" />
        </div>
      </Container>
    </section>
  );
}

/* ================================================================ 01 — the message (human levers) */
const LEVERS = [
  { n: "1", label: "The lure", quote: "You have been selected", why: "A reward with no test, interview or process." },
  { n: "2", label: "The ask", quote: "bank account number and IFSC code", why: "Financial details, before any offer is accepted." },
  { n: "3", label: "The channel", quote: "on WhatsApp to this number", why: "No official record, and nobody to check with." },
  { n: "4", label: "The clock", quote: "today", why: "No time to ask the placement cell first." },
];
function Problem() {
  const parts = useMemo(() => {
    // Split the demo text around each lever quote so the numbers sit exactly on the words.
    const out: { text: string; lever?: string }[] = [];
    let rest = DEMO.text;
    for (const l of LEVERS) {
      const i = rest.indexOf(l.quote);
      out.push({ text: rest.slice(0, i) }, { text: l.quote, lever: l.n });
      rest = rest.slice(i + l.quote.length);
    }
    out.push({ text: rest });
    return out;
  }, []);
  return (
    <section id="story" className="scroll-mt-16 bg-[#070c18] py-24 text-[#eef0f5] sm:py-32">
      <Container wide>
        <Reveal>
          <Eyebrow n="01" onDark>
            The problem
          </Eyebrow>
          <h2 className="t-h1 mt-6 max-w-4xl">Fake offers don't look fake. They look like good news.</h2>
        </Reveal>
        <div className="mt-14 grid grid-cols-1 gap-12 lg:grid-cols-[1fr_1fr] lg:gap-20">
          <Reveal>
            <figure className="rounded-[var(--radius-card)] border border-white/10 bg-[#0f1a2e] p-5 sm:p-6">
              <figcaption className="flex items-center gap-3 border-b border-white/10 pb-4">
                <span className="grid h-10 w-10 place-items-center rounded-full bg-[#15223a] font-display text-lg text-[#c9d1dc]">N</span>
                <span>
                  <span className="block text-sm font-semibold">Northwind Placements HR</span>
                  <span className="font-mono text-[11px] text-white/50">+91 9XXXX XXXXX · WhatsApp</span>
                </span>
              </figcaption>
              <blockquote className="mt-5 rounded-xl bg-[#15223a] p-4 text-[1.02rem] leading-relaxed sm:p-5">
                {parts.map((p, i) =>
                  p.lever ? (
                    <span key={i} className="font-semibold text-[#f2b544]">
                      {p.text}
                      <sup className="ml-0.5 font-mono text-[0.7em] text-[#8fb4e6]">{p.lever}</sup>
                    </span>
                  ) : (
                    <span key={i}>{p.text}</span>
                  ),
                )}
              </blockquote>
              <p className="mt-4 font-mono text-[11px] tracking-wider text-white/45 uppercase">Fictional · written by the CUSTODI team</p>
            </figure>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="t-eyebrow text-white/55">How it works on a student</p>
            <ol className="mt-5 divide-y divide-white/10 border-y border-white/10">
              {LEVERS.map((l) => (
                <li key={l.n} className="grid grid-cols-[2.5rem_1fr] gap-x-3 py-4">
                  <span className="font-display text-3xl leading-none text-[#8fb4e6]">{l.n}</span>
                  <div>
                    <p className="font-mono text-[11px] tracking-[0.16em] text-white/50 uppercase">{l.label}</p>
                    <p className="mt-1 font-display text-xl">“{l.quote.charAt(0).toUpperCase() + l.quote.slice(1)}”</p>
                    <p className="mt-1 text-sm text-white/65">{l.why}</p>
                  </div>
                </li>
              ))}
            </ol>
            <p className="mt-6 max-w-md text-sm text-white/70">
              Nothing here is obviously malicious. That's the point — and why “be careful” isn't enough. Next: what CUSTODI actually finds in it.
            </p>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}

/* ================================================================ 02 — the analysis, run for real as you scroll */
function AnalysisScene() {
  const reduce = useReducedMotion();
  const wrap = useRef<HTMLDivElement>(null);
  const report = useMemo(() => analyzeMessage({ text: DEMO.text, channel: DEMO.channel }), []);
  const checks = report.checks ?? [];
  const [shown, setShown] = useState(reduce ? checks.length : 0);

  useLayoutEffect(() => {
    if (reduce || !wrap.current) return;
    if (!window.matchMedia("(min-width: 1024px)").matches) {
      setShown(checks.length);
      return;
    }
    const st = ScrollTrigger.create({
      trigger: wrap.current,
      start: "top top",
      end: "bottom bottom",
      onUpdate: (s) => setShown(Math.min(checks.length, Math.round(s.progress * (checks.length + 1)))),
    });
    return () => st.kill();
  }, [reduce, checks.length]);

  const revealed = new Set(checks.slice(0, shown).flatMap((c) => c.findingIds));
  const visible = report.findings.filter((f) => revealed.has(f.id));
  const segs = buildSegments(DEMO.text, visible);
  const done = shown >= checks.length;

  return (
    <div ref={wrap} className="relative lg:h-[260vh]">
      <section className="lg:sticky lg:top-0 lg:flex lg:h-[100svh] lg:items-center">
        <Container wide className="grid grid-cols-1 gap-10 py-24 lg:grid-cols-[0.8fr_1.2fr] lg:py-0">
          <div className="min-w-0">
            <Eyebrow n="02">How CUSTODI reads it</Eyebrow>
            <h2 className="t-h2 mt-5">
              {checks.length} checks, on your device.
              <span className="block text-muted italic">Links never opened.</span>
            </h2>
            <ol className="mt-6 space-y-0.5" aria-label="Checks run on the message">
              {checks.map((c, i) => {
                const on = i < shown;
                const warn = c.status === "warning";
                return (
                  <li key={c.id} className={`flex items-center gap-3 px-1 py-1 text-sm transition-colors duration-300 ${on ? "text-ink" : "text-muted/55"}`}>
                    <span className="w-5 font-mono text-[10px] text-muted">{String(i + 1).padStart(2, "0")}</span>
                    <span
                      className={`h-2 w-2 flex-none rounded-full transition-colors ${!on ? "bg-line" : warn ? "bg-medium" : c.status === "passed" ? "bg-low" : "bg-line-strong"}`}
                      aria-hidden
                    />
                    <span className="flex-1 truncate">{c.name}</span>
                    {on && <span className={`font-mono text-[10.5px] tracking-wider uppercase ${warn ? "text-medium" : "text-muted"}`}>{c.status}</span>}
                  </li>
                );
              })}
            </ol>
            <p className="mt-4 text-xs text-muted">The list is the analyzer's actual output for this message — scroll to step through it.</p>
          </div>

          <div className="panel relative min-w-0 overflow-hidden shadow-card">
            <div className="flex items-center justify-between border-b border-line px-5 py-3 text-xs text-muted">
              <span>WhatsApp · fictional</span>
              <span className="font-mono">
                {shown}/{checks.length} checks
              </span>
            </div>
            <div className="h-0.5 bg-surface-2">
              <div className="h-full bg-accent transition-[width] duration-300" style={{ width: `${(shown / Math.max(1, checks.length)) * 100}%` }} />
            </div>
            <p className="px-5 py-5 text-[0.98rem] leading-relaxed text-ink-2">
              {segs.map((s, i) =>
                s.severity ? (
                  <mark key={`${i}-${s.text}`} className={`mark-${s.severity} px-0.5`}>
                    {s.text}
                  </mark>
                ) : (
                  <span key={i}>{s.text}</span>
                ),
              )}
            </p>
            <motion.div initial={false} animate={{ height: visible.length ? "auto" : 0, opacity: visible.length ? 1 : 0 }} className="overflow-hidden border-t border-line bg-surface-2">
              <ul className="space-y-2 px-5 py-4 text-sm">
                {visible.map((f) => (
                  <li key={f.id} className="flex gap-2">
                    <span className={f.severity === "strong" ? "text-high" : "text-medium"} aria-hidden>
                      ●
                    </span>
                    <span>
                      <b className="font-medium text-ink">{f.title}.</b> <span className="text-ink-2">{f.explanation.split(". ")[0]}.</span>
                    </span>
                  </li>
                ))}
              </ul>
            </motion.div>
            <motion.div initial={false} animate={{ height: done ? "auto" : 0, opacity: done ? 1 : 0 }} className="overflow-hidden border-t border-line">
              <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1 px-5 pt-4">
                <span className={`font-display text-4xl ${TONE[report.riskLevel]}`}>{report.verdict.label}</span>
                <span className="font-mono text-sm text-ink">{report.score}/100</span>
              </div>
              <p className="px-5 pt-2 pb-4 text-sm font-medium text-accent">→ {report.nextSteps[0]}</p>
            </motion.div>
          </div>
        </Container>
      </section>
    </div>
  );
}

/* ================================================================ 03 — scoring, with real weights */
function Scoring({ demo }: { demo: MessageReport }) {
  const cats = DEFAULT_SCORING.categories.slice(0, 10);
  const max = Math.max(...cats.map((c) => c.points));
  const { medium, high } = DEFAULT_SCORING.thresholds;
  return (
    <section className="py-24 sm:py-32">
      <Container wide>
        <div className="grid grid-cols-1 gap-14 lg:grid-cols-[0.9fr_1.1fr]">
          <Reveal>
            <Eyebrow n="03">How the score is built</Eyebrow>
            <h2 className="t-h2 mt-5">No black box. Every point is accounted for.</h2>
            <p className="t-body-lg mt-5 max-w-lg text-ink-2">Each kind of warning adds fixed points — once, however often it appears. The total is capped at 100.</p>

            <div className="mt-10" role="img" aria-label={`Risk scale: Low risk 0 to ${medium - 1}, Caution ${medium} to ${high - 1}, Suspicious ${high} to 100. This message scores ${demo.score}.`}>
              <div className="relative">
                <div className="flex h-2.5 overflow-hidden rounded-sm">
                  <span className="bg-low" style={{ width: `${medium}%` }} />
                  <span className="bg-medium" style={{ width: `${high - medium}%` }} />
                  <span className="flex-1 bg-high" />
                </div>
                <span className="absolute -top-2 h-6.5 w-0.5 bg-ink" style={{ left: `${demo.score}%` }} />
              </div>
              <div className="relative mt-2 h-4 font-mono text-[11px] text-muted">
                <span className="absolute left-0">0</span>
                <span className="absolute" style={{ left: `${medium}%` }}>
                  {medium}
                </span>
                <span className="absolute" style={{ left: `${high}%` }}>
                  {high}
                </span>
                <span className="absolute right-0">100</span>
              </div>
              <div className="mt-1 grid font-mono text-[11px]" style={{ gridTemplateColumns: `${medium}fr ${high - medium}fr ${100 - high}fr` }}>
                <span className="text-low">Low risk</span>
                <span className="text-medium">Caution</span>
                <span className="text-high">Suspicious</span>
              </div>
            </div>

            <div className="mt-10 border-t border-line pt-6">
              <p className="t-eyebrow text-muted">The WhatsApp message</p>
              <p className="mt-2 font-display text-5xl">
                {(demo.contributions ?? []).map((c) => c.points).join(" + ")} = <span className="text-high">{demo.score}</span>
              </p>
              <ul className="mt-4 space-y-1.5 text-sm text-ink-2">
                {(demo.contributions ?? []).map((c) => (
                  <li key={c.id} className="flex gap-3">
                    <span className="w-9 font-mono text-ink">+{c.points}</span>
                    {c.label}
                  </li>
                ))}
              </ul>
            </div>
            <p className="mt-8 max-w-lg text-sm text-ink-2">
              <b className="font-semibold text-high">Critical override.</b> A direct OTP, PIN or password request, a remote-access tool or an .apk/.exe install is High —
              whatever the total.
            </p>
            <p className="mt-3 text-xs text-muted">Hand-set weights, calibrated on our fictional test cases. Not a probability of fraud.</p>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="t-eyebrow text-muted">Points per kind of warning</p>
            <ol className="mt-4 border-t border-line">
              {cats.map((c) => (
                <li key={c.id} className="grid grid-cols-[1fr_3rem] items-center gap-4 border-b border-line py-3 sm:grid-cols-[13rem_1fr_3rem]">
                  <span className="text-sm text-ink">{c.label}</span>
                  <span className="hidden h-1.5 bg-surface-2 sm:block">
                    <span className={`block h-full ${c.points >= 30 ? "bg-accent" : "bg-line-strong"}`} style={{ width: `${(c.points / max) * 100}%` }} />
                  </span>
                  <span className="text-right font-mono text-sm text-ink">+{c.points}</span>
                </li>
              ))}
            </ol>
            <p className="mt-4 text-xs text-muted">
              Plus +20 each for ID documents over chat, a job with no assessment, bank-detail requests, hidden AI instructions and moving you off the record — and
              documented context modifiers. Full list in the Test Lab and the source.
            </p>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}

/* ================================================================ 04 — context: same request, different answers */
function Context({ demo }: { demo: MessageReport }) {
  const rows = useMemo(() => {
    const r10 = caseById("R10");
    const m42 = caseById("M42");
    return [
      { tag: "WhatsApp · before any offer", src: "Our demo message", quote: "…send your bank account number and IFSC code on WhatsApp to this number today…", r: demo },
      { tag: "Email · after accepting · Gmail sender", src: "Test Lab case R10", quote: r10.text, r: analyzeMessage({ text: r10.text, channel: r10.channel, sender: r10.sender }) },
      { tag: "Email · after accepting · official portal", src: "Test Lab case M42", quote: m42.text, r: analyzeMessage({ text: m42.text, channel: m42.channel, sender: m42.sender }) },
    ];
  }, [demo]);
  return (
    <section className="border-y border-line bg-surface py-24 sm:py-32">
      <Container wide>
        <Reveal>
          <Eyebrow n="04">Why context matters</Eyebrow>
          <h2 className="t-h2 mt-5 max-w-3xl">Same request for bank details. Three different answers.</h2>
          <p className="t-body-lg mt-5 max-w-2xl text-ink-2">
            Real employers do need your account number — after you accept, through an official portal. CUSTODI weighs who is asking, how, and when.
          </p>
        </Reveal>
        <div className="mt-14 grid grid-cols-1 divide-y divide-line border-y border-line lg:grid-cols-3 lg:divide-x lg:divide-y-0">
          {rows.map(({ tag, src, quote, r }) => (
            <Reveal key={src} className="flex flex-col px-0 py-8 lg:px-8 lg:first:pl-0 lg:last:pr-0">
              <p className="font-mono text-[11px] tracking-[0.12em] text-muted uppercase">{tag}</p>
              <p className="mt-4 flex-1 font-display text-xl leading-snug text-ink-2 italic">“{quote}”</p>
              <p className={`mt-6 font-display text-7xl leading-none ${TONE[r.riskLevel]}`}>
                {r.score}
                <span className="ml-2 font-mono text-base text-muted not-italic">/100</span>
              </p>
              <p className={`mt-2 font-semibold ${TONE[r.riskLevel]}`}>{r.verdict.label}</p>
              <ul className="mt-3 space-y-1 text-sm text-ink-2">
                {(r.contributions ?? []).length ? (
                  (r.contributions ?? []).map((c) => (
                    <li key={c.id}>
                      <span className="font-mono text-ink">+{c.points}</span> {c.label}
                    </li>
                  ))
                ) : (
                  <li>Bank request shown as a note: official portal, not asked back by message — 0 points.</li>
                )}
              </ul>
              <p className="mt-5 font-mono text-[11px] text-muted">{src}</p>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}

/* ================================================================ 05 — try the real scanner */
function TryScanner() {
  const samples = SAMPLE_MESSAGES.filter((s) => ["M02", "M05", "M09", "M13"].includes(s.id));
  const [text, setText] = useState(samples[0]!.text);
  const [active, setActive] = useState(samples[0]!.id);
  const report = useMemo(() => analyzeMessage({ text }), [text]);
  const warnings = report.findings.filter((f) => f.severity !== "info");

  return (
    <section className="py-24 sm:py-32">
      <Container wide>
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[0.75fr_1.25fr]">
          <Reveal>
            <Eyebrow n="05">Try it</Eyebrow>
            <h2 className="t-h2 mt-5">Edit the message. Watch the verdict change.</h2>
            <p className="t-body-lg mt-5 text-ink-2">
              This is the real analyzer, running in your browser as you type. Delete the fee and its warning disappears. Type “share the OTP” and it turns critical.
            </p>
            <ButtonLink to="/scan" className="mt-8">
              Open the full scanner <ArrowRight className="h-4 w-4" />
            </ButtonLink>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="panel overflow-hidden shadow-card">
              <div className="flex flex-wrap items-center gap-1 border-b border-line p-2" role="group" aria-label="Fictional samples">
                {samples.map((s) => (
                  <button
                    key={s.id}
                    aria-pressed={active === s.id}
                    onClick={() => {
                      setText(s.text);
                      setActive(s.id);
                    }}
                    className={`min-h-10 rounded-md px-3 text-xs transition-colors ${active === s.id ? "bg-ink text-bg" : "text-muted hover:bg-surface-2 hover:text-ink"}`}
                  >
                    {s.label}
                  </button>
                ))}
                <span className="ml-auto pr-1">
                  <Tag>fictional</Tag>
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2">
                <div className="border-b border-line p-4 md:border-r md:border-b-0">
                  <label htmlFor="try" className="t-eyebrow text-muted">
                    Edit me
                  </label>
                  <textarea
                    id="try"
                    value={text}
                    onChange={(e) => {
                      setText(e.target.value);
                      setActive("");
                    }}
                    rows={8}
                    className="mt-2 w-full resize-none rounded-lg bg-surface-2 p-3 text-sm leading-relaxed text-ink focus:ring-2 focus:ring-accent/30 focus:outline-none"
                  />
                </div>
                <div className="p-4" aria-live="polite">
                  <div className="flex items-center gap-2">
                    <RiskBadge level={report.riskLevel} />
                    <span className="font-mono text-xs text-muted">score {report.score}/100</span>
                  </div>
                  <p className={`mt-3 font-display text-4xl leading-none ${TONE[report.riskLevel]}`}>{report.verdict.label}</p>
                  <ul className="mt-4 space-y-2 text-sm">
                    {warnings.slice(0, 4).map((f) => (
                      <li key={f.id} className="flex gap-2 text-ink-2">
                        <span className={f.severity === "strong" ? "text-high" : "text-medium"} aria-hidden>
                          ●
                        </span>
                        <span>
                          {f.title}
                          {f.evidence[0] && <q className={`ml-1 font-mono text-xs mark-${f.severity}`}>{f.evidence[0].text}</q>}
                        </span>
                      </li>
                    ))}
                    {warnings.length === 0 && <li className="text-ink-2">No warning signs found — still not a guarantee. Verify real offers with your placement cell.</li>}
                  </ul>
                  <p className="mt-4 border-t border-line pt-3 text-sm font-medium text-accent">→ {report.nextSteps[0]}</p>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}

/* ================================================================ 06 — website check */
const URLS = [
  { label: "Look-alike", url: "https://g00gle-careers.top/apply" },
  { label: "@ trick", url: "https://careers.northwind.example@203.0.113.9/login" },
  { label: "Short link", url: "https://bit.ly/3offerDemo" },
  { label: "Ordinary", url: "https://www.demo-college.example/placements" },
];
function WebsiteScene() {
  const [url, setUrl] = useState(URLS[0]!.url);
  const r = useMemo(() => analyzeUrl(url), [url]);
  const signs = r.findings.filter((f) => f.severity !== "info");
  return (
    <section className="border-y border-line bg-surface py-24 sm:py-32">
      <Container wide>
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[0.75fr_1.25fr]">
          <Reveal>
            <Eyebrow n="06">Website check</Eyebrow>
            <h2 className="t-h2 mt-5">A padlock is not a promise.</h2>
            <p className="t-body-lg mt-5 text-ink-2">
              CUSTODI reads a link as text — it never opens it — shows who really owns it, and keeps “is it encrypted?” apart from “is it genuine?”.
            </p>
            <p className="mt-4 text-sm text-ink-2">
              <b className="font-semibold text-ink">Verified</b> only for domains on your own trusted list. Otherwise <b className="font-semibold text-ink">Suspicious</b>{" "}
              or <b className="font-semibold text-ink">Unknown</b> — never “safe”.
            </p>
            <div className="mt-8 flex flex-wrap gap-1" role="group" aria-label="Fictional links">
              {URLS.map((u) => (
                <button
                  key={u.url}
                  aria-pressed={url === u.url}
                  onClick={() => setUrl(u.url)}
                  className={`min-h-10 rounded-md border px-3 text-xs transition-colors ${url === u.url ? "border-ink bg-ink text-bg" : "border-line text-ink-2 hover:border-ink"}`}
                >
                  {u.label}
                </button>
              ))}
            </div>
            <ButtonLink to="/website" variant="secondary" className="mt-6">
              Check your own link <ArrowRight className="h-4 w-4" />
            </ButtonLink>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="space-y-3">
              <Anatomy r={r} />
              <ConnectionAndTrust r={r} />
              <div className="panel p-5">
                <div className="flex items-center gap-2">
                  <RiskBadge level={r.riskLevel} />
                  <span className="text-sm text-muted">
                    {signs.length} warning sign{signs.length === 1 ? "" : "s"}
                  </span>
                </div>
                <ul className="mt-3 space-y-1.5 text-sm text-ink-2">
                  {signs.map((f) => (
                    <li key={f.id}>
                      <span className={f.severity === "strong" ? "text-high" : "text-medium"} aria-hidden>
                        ●
                      </span>{" "}
                      {f.title}
                    </li>
                  ))}
                  {r.status === "unknown" && <li>No tricks found. CUSTODI still can't confirm the owner — so it says Unknown, not Safe.</li>}
                </ul>
              </div>
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}

/* ================================================================ 07 — Chrome extension (real popup + real flow) */
const EXT_FLOW = [
  ["You click", "the CUSTODI icon → Scan this page."],
  ["Chrome lends", "this tab only, at this moment (activeTab)."],
  ["CUSTODI reads", "the address, visible text and field types — never what you type."],
  ["The same engine", "as this website scores it, on your computer."],
  ["You see", "the verdict, the evidence and a badge on the icon."],
];
function ExtensionScene() {
  return (
    <section className="py-24 sm:py-32">
      <Container wide>
        <div className="grid grid-cols-1 items-start gap-14 lg:grid-cols-[auto_1fr] lg:gap-20">
          <Reveal className="mx-auto w-full max-w-[400px]">
            <figure>
              <img
                src="/assets/extension-popup.png"
                width={780}
                height={1456}
                loading="lazy"
                decoding="async"
                alt="The CUSTODI Chrome extension popup: Open CUSTODI Website, Scan this page, quick actions and the latest result."
                className="w-full rounded-[var(--radius-card)] border border-line shadow-card"
              />
              <figcaption className="mt-3 text-center font-mono text-[11px] text-muted">Real popup, loaded in Chrome</figcaption>
            </figure>
          </Reveal>
          <Reveal delay={0.1}>
            <Eyebrow n="07">Chrome extension</Eyebrow>
            <h2 className="t-h2 mt-5">It looks only when you ask.</h2>
            <ol className="mt-8 border-t border-line">
              {EXT_FLOW.map(([a, b], i) => (
                <li key={a} className="grid grid-cols-[2rem_1fr] gap-3 border-b border-line py-3.5 text-[0.95rem]">
                  <span className="font-mono text-xs text-accent">{String(i + 1).padStart(2, "0")}</span>
                  <span className="text-ink-2">
                    <b className="font-semibold text-ink">{a}</b> {b}
                  </span>
                </li>
              ))}
            </ol>
            <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <p className="t-eyebrow text-muted">Live Observe — optional</p>
                <p className="mt-2 text-sm text-ink-2">
                  A session you start for 15, 30 or 60 minutes. The icon shows <b className="font-semibold text-ink">ON</b> the whole time; site access is handed back when
                  it ends.
                </p>
              </div>
              <div>
                <p className="t-eyebrow text-muted">It can't</p>
                <p className="mt-2 text-sm text-ink-2">Read WhatsApp, SMS or email inboxes, or anything you type. You paste messages in yourself.</p>
              </div>
            </div>
            <div className="mt-9 flex flex-wrap gap-3">
              <ButtonLink to="/extension">Install the extension</ButtonLink>
              <ButtonLink to="/live" variant="secondary">
                How Live Observe works
              </ButtonLink>
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}

/* ================================================================ 08 — proof: Test Lab + dashboard */
function ProofScene() {
  const { metrics: m } = useMemo(() => runTestSuite(), []); // real run of every Test Lab case, in this browser
  const history = useHistory();
  return (
    <section className="border-y border-line bg-surface py-24 sm:py-32">
      <Container wide>
        <div className="grid grid-cols-1 gap-14 lg:grid-cols-[1.1fr_0.9fr]">
          <Reveal>
            <Eyebrow n="08">Validation</Eyebrow>
            <h2 className="t-h2 mt-5">Our homework, in the open.</h2>
            <div className="mt-10 flex flex-wrap items-end gap-x-12 gap-y-8">
              <div>
                <p className="font-display text-8xl leading-none">
                  {m.passed}
                  <span className="text-4xl text-muted">/{m.total}</span>
                </p>
                <p className="mt-2 text-sm text-ink-2">fictional cases behave as designed — just ran in your browser.</p>
              </div>
              <table className="text-sm" aria-label="Confusion matrix">
                <thead>
                  <tr className="font-mono text-[10.5px] tracking-wider text-muted uppercase">
                    <th className="pr-4 pb-2 text-left font-normal" />
                    <th className="px-3 pb-2 text-left font-normal">Warned</th>
                    <th className="px-3 pb-2 text-left font-normal">Didn't warn</th>
                  </tr>
                </thead>
                <tbody className="font-display text-4xl">
                  <tr className="border-t border-line">
                    <th className="py-2 pr-4 text-left font-mono text-[10.5px] font-normal tracking-wider text-muted uppercase">Risky</th>
                    <td className="px-3 py-2 text-low">{m.truePositives}</td>
                    <td className="px-3 py-2">{m.falseNegatives}</td>
                  </tr>
                  <tr className="border-t border-line">
                    <th className="py-2 pr-4 text-left font-mono text-[10.5px] font-normal tracking-wider text-muted uppercase">Harmless</th>
                    <td className="px-3 py-2">{m.falsePositives}</td>
                    <td className="px-3 py-2 text-low">{m.trueNegatives}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="mt-8 max-w-xl text-sm text-ink-2">
              Every case shows its expected result, actual result and why. These are cases we wrote — they prove the engine does what we designed,{" "}
              <b className="font-semibold text-ink">not real-world accuracy</b>.
            </p>
            <ButtonLink to="/lab" variant="secondary" className="mt-6">
              Run the tests yourself <ArrowRight className="h-4 w-4" />
            </ButtonLink>
          </Reveal>
          <Reveal delay={0.1} className="lg:border-l lg:border-line lg:pl-14">
            <p className="t-eyebrow text-muted">Your dashboard</p>
            <p className="mt-4 font-display text-6xl leading-none">{history.length}</p>
            <p className="mt-2 text-ink-2">{history.length === 1 ? "scan" : "scans"} saved on this device. Nothing is invented and nothing leaves it.</p>
            {history.length > 0 && (
              <div className="mt-6 flex h-2 overflow-hidden rounded-sm bg-surface-2" aria-label="Scans by risk level">
                {(["high", "medium", "low"] as const).map((l) => {
                  const n = history.filter((h) => h.report.riskLevel === l).length;
                  return n ? <div key={l} className={`h-full ${BAR[l]}`} style={{ width: `${(n / history.length) * 100}%` }} /> : null;
                })}
              </div>
            )}
            <p className="mt-6 text-sm text-ink-2">Risk trend, warning categories, full reports, CSV / JSON export and delete.</p>
            <ButtonLink to="/dashboard" variant="secondary" className="mt-6">
              Open dashboard <ArrowRight className="h-4 w-4" />
            </ButtonLink>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}

/* ================================================================ 09 — privacy & limits */
function Limits() {
  const cols = [
    {
      h: "It does",
      icon: <Check className="h-4 w-4 text-low" aria-hidden />,
      items: [
        "Analyse messages and links on your device — nothing is uploaded",
        "Quote the exact words behind every warning and the points they add",
        "Check the Chrome tab you choose, only on click or during a timed Live Observe session",
        "Keep results (not full messages, by default) in this browser, with export and delete",
      ],
    },
    {
      h: "It cannot",
      icon: <X className="h-4 w-4 text-high" aria-hidden />,
      items: [
        "Read your WhatsApp, SMS or email inbox — you paste or share messages yourself",
        "Look up blocklists, domain age or sender authentication — those checks say “unavailable”",
        "See phone calls, images, attachments or voice notes",
        "Guarantee a message is safe — Low risk means no obvious signs, nothing more",
      ],
    },
  ];
  return (
    <section className="py-24 sm:py-32">
      <Container wide>
        <Reveal>
          <Eyebrow n="09">Privacy &amp; limits</Eyebrow>
          <h2 className="t-h2 mt-5 max-w-3xl">What CUSTODI does — and what it will never pretend to do.</h2>
        </Reveal>
        <div className="mt-12 grid grid-cols-1 gap-x-16 gap-y-10 md:grid-cols-2">
          {cols.map((col) => (
            <Reveal key={col.h}>
              <h3 className="font-mono text-xs tracking-[0.18em] text-muted uppercase">{col.h}</h3>
              <ul className="mt-4 border-t border-line">
                {col.items.map((t) => (
                  <li key={t} className="flex gap-3 border-b border-line py-4 text-[0.95rem] leading-relaxed text-ink-2">
                    <span className="mt-1">{col.icon}</span>
                    {t}
                  </li>
                ))}
              </ul>
            </Reveal>
          ))}
        </div>
        <Link to="/help#limits" className="mt-8 inline-block py-2 text-sm text-accent underline underline-offset-4">
          Read the full limitations
        </Link>
      </Container>
    </section>
  );
}

/* ================================================================ FINAL */
function Finale() {
  return (
    <section className="dark border-t border-line bg-[#070c18] py-28 text-[#eef0f5] sm:py-36">
      <Container className="text-center">
        <Reveal>
          <Emblem className="mx-auto h-24 w-auto aspect-[262/334]" />
          <p className="t-display mt-8">Think before you trust.</p>
          <p className="t-display text-[#8c9ab0] italic">Verify before you act.</p>
          <div className="mt-12 flex flex-wrap justify-center gap-3">
            <ButtonLink to="/scan" size="lg">
              <ScanLine className="h-5 w-5" /> Scan a message
            </ButtonLink>
            <ButtonLink to="/website" size="lg" variant="secondary" className="!border-white/25 !bg-transparent !text-white hover:!border-white/60">
              Check a website
            </ButtonLink>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}

export default function Home() {
  const demo = useMemo(() => analyzeMessage({ text: DEMO.text, channel: DEMO.channel }), []);
  return (
    <>
      <Hero />
      <Problem />
      <AnalysisScene />
      <Scoring demo={demo} />
      <Context demo={demo} />
      <TryScanner />
      <WebsiteScene />
      <ExtensionScene />
      <ProofScene />
      <Limits />
      <Finale />
    </>
  );
}
