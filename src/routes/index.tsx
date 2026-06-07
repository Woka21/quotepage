import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { Logo } from "@/components/qp/Logo";
import { ScrollReveal } from "@/components/qp/ScrollReveal";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "QuotePage — Win the job. Get paid." },
      { name: "description", content: "Calm, self-serve quoting and invoicing for HVAC, plumbing, roofing, and solar contractors. One product. One loop. No bloat." },
      { property: "og:title", content: "QuotePage" },
      { property: "og:description", content: "Win the job. Get paid. Nothing else." },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="px-6 md:px-10 pt-6 flex items-center justify-between sticky top-0 z-20">
        <Logo />
        <nav className="hidden md:flex items-center gap-5 text-sm" style={{ color: "#6B6B67" }}>
          <a href="#how" className="hover:text-[#1C1C1A] transition-colors">How it works</a>
          <a href="#features" className="hover:text-[#1C1C1A] transition-colors">Features</a>
          <a href="#trades" className="hover:text-[#1C1C1A] transition-colors">Trades</a>
          <a href="#pricing" className="hover:text-[#1C1C1A] transition-colors">Pricing</a>
          <a href="#faq" className="hover:text-[#1C1C1A] transition-colors">FAQ</a>
        </nav>
        <div className="flex items-center gap-2 text-sm">
          <Link to="/auth" className="px-3 py-1.5" style={{ color: "#6B6B67" }}>Sign in</Link>
          <Link to="/auth" className="qp-btn qp-btn-primary !h-9 !px-4">Get started</Link>
        </div>
      </header>

      <section className="px-6 md:px-10 max-w-5xl mx-auto w-full pt-24 pb-24">
        <ScrollReveal>
          <p className="text-xs uppercase tracking-[0.18em]" style={{ color: "#6B6B67" }}>
            For HVAC · Plumbing · Roofing · Solar
          </p>
          <h1 className="mt-5 text-5xl md:text-6xl leading-[1.05]" style={{ color: "#1C1C1A" }}>
            Win the job. <br />
            Get paid. <br />
            <span style={{ color: "#6B6B67" }}>Nothing else.</span>
          </h1>
          <p className="mt-7 text-lg max-w-xl" style={{ color: "#6B6B67" }}>
            Quote on the drive home. Auto follow-ups while you sleep. One tap from accepted
            quote to paid invoice. Built for the trades — no software bloat, no per-text fees,
            no learning curve.
          </p>
          <div className="mt-9 flex items-center gap-3">
            <Link to="/auth" className="qp-btn qp-btn-primary">Start free</Link>
            <span className="text-sm" style={{ color: "#6B6B67" }}>5 quotes / month · no card</span>
          </div>
          <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-2 text-xs" style={{ color: "#9b9b96" }}>
            <span>★ Used by independent trades across 4 countries</span>
            <span>· 90-second first quote</span>
            <span>· Cancel anytime</span>
          </div>
        </ScrollReveal>
      </section>

      {/* The loop */}
      <section id="how" className="px-6 md:px-10 max-w-5xl mx-auto w-full pt-12 pb-24">
        <ScrollReveal>
          <p className="text-xs uppercase tracking-[0.18em]" style={{ color: "#6B6B67" }}>The loop</p>
          <h2 className="mt-3 text-3xl md:text-4xl" style={{ color: "#1C1C1A" }}>One product. One loop. No bloat.</h2>
          <p className="mt-4 max-w-2xl text-[0.98rem] leading-relaxed" style={{ color: "#6B6B67" }}>
            Most quoting tools turn into pipelines, CRMs, and dashboards you have to feed. QuotePage
            does four things, and stops there.
          </p>
        </ScrollReveal>

        <ScrollReveal delay={120} className="mt-10">
          <div className="qp-glass p-8 md:p-10 grid md:grid-cols-3 gap-8">
            {[
              { n: "01", k: "Quote", v: "Stepped builder. Address autocomplete. Line items with live totals. Save drafts on every blur — never lose work." },
              { n: "02", k: "Share", v: "WhatsApp, SMS, email, or a private link. Clients view a clean web page — no PDF download required." },
              { n: "03", k: "Follow up", v: "Day 3, 7, and pre-expiry nudges go out for you. Toggle off per document. Clients accept or decline with one tap." },
              { n: "04", k: "Get paid", v: "Convert an accepted quote into an invoice in one click. Same numbers, same client, no rekeying." },
            ].map((f) => (
              <div key={f.k} className="md:[&:nth-child(4)]:col-span-3">
                <p className="text-xs" style={{ color: "#9b9b96" }}>{f.n}</p>
                <p className="mt-1 text-sm" style={{ color: "#2B7A6F", fontWeight: 500 }}>{f.k}</p>
                <p className="mt-2 text-[0.95rem] leading-relaxed" style={{ color: "#1C1C1A" }}>{f.v}</p>
              </div>
            ))}
          </div>
        </ScrollReveal>
      </section>

      {/* Features deep-dive */}
      <section id="features" className="px-6 md:px-10 max-w-5xl mx-auto w-full py-24">
        <ScrollReveal>
          <p className="text-xs uppercase tracking-[0.18em]" style={{ color: "#6B6B67" }}>What's in the box</p>
          <h2 className="mt-3 text-3xl md:text-4xl" style={{ color: "#1C1C1A" }}>Everything you need. Nothing you don't.</h2>
        </ScrollReveal>

        <div className="mt-12 grid md:grid-cols-2 gap-5">
          {[
            { k: "Stepped quote builder", v: "Customer · job · line items · terms. Each step takes seconds. No 30-field forms, no required custom fields." },
            { k: "Address autocomplete", v: "Free, fast lookup via Photon. No Google Maps API key, no per-request fees, no quota anxiety." },
            { k: "Public quote page", v: "A private link your client opens on any device. Reads cleanly on a phone. Accept or decline in one tap." },
            { k: "Auto follow-ups", v: "Polite nudges on day 3, day 7, and 24h before expiry. Toggle off per quote if the client asks for time." },
            { k: "One-click invoice", v: "An accepted quote becomes an invoice without re-entering anything. Numbering, totals, terms — carried over." },
            { k: "Reminder ledger", v: "Every email and SMS we send for you is logged. Open the document, see exactly what your client received and when." },
            { k: "Your brand, your terms", v: "Upload a logo, set an accent color, add bank details and default terms once. They flow into every document." },
            { k: "Native share", v: "WhatsApp, SMS, email, or copy link. We use device handlers — no per-message fees, no third-party gateway charges." },
            { k: "PDF when you need it", v: "Generate a clean PDF for clients who insist on it. Otherwise, the link is faster and trackable." },
            { k: "Status at a glance", v: "Draft · sent · viewed · accepted · paid. One column, one truth, no pipeline to maintain." },
          ].map((f) => (
            <ScrollReveal key={f.k}>
              <div className="qp-glass p-6 h-full">
                <p className="text-sm" style={{ color: "#1C1C1A", fontWeight: 500 }}>{f.k}</p>
                <p className="mt-2 text-[0.92rem] leading-relaxed" style={{ color: "#6B6B67" }}>{f.v}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* Trades */}
      <section id="trades" className="px-6 md:px-10 max-w-5xl mx-auto w-full py-24">
        <ScrollReveal>
          <p className="text-xs uppercase tracking-[0.18em]" style={{ color: "#6B6B67" }}>Built for the trades</p>
          <h2 className="mt-3 text-3xl md:text-4xl" style={{ color: "#1C1C1A" }}>Quoting that fits your day, not the other way around.</h2>
        </ScrollReveal>

        <div className="mt-12 grid md:grid-cols-2 gap-5">
          {[
            { k: "HVAC", v: "Quote a 3-ton swap on the truck. Auto-include refrigerant disposal, permit lines, and your standard 5-year labor terms." },
            { k: "Plumbing", v: "Send a same-day estimate from the customer's driveway. Convert call-out + scope into a clean line-item quote in under two minutes." },
            { k: "Roofing", v: "Square-foot pricing, tear-off, underlayment, flashing — all reusable line items. Validity defaults to 14 days for weather-sensitive work." },
            { k: "Solar", v: "Long-validity quotes (60–90 days), staged payment terms, and clean public pages homeowners can forward to their spouse without confusion." },
          ].map((t) => (
            <ScrollReveal key={t.k}>
              <div className="qp-glass p-7 h-full">
                <p className="text-xs uppercase tracking-[0.16em]" style={{ color: "#2B7A6F" }}>{t.k}</p>
                <p className="mt-3 text-[0.98rem] leading-relaxed" style={{ color: "#1C1C1A" }}>{t.v}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* Comparison */}
      <section className="px-6 md:px-10 max-w-5xl mx-auto w-full py-24">
        <ScrollReveal>
          <p className="text-xs uppercase tracking-[0.18em]" style={{ color: "#6B6B67" }}>Why QuotePage</p>
          <h2 className="mt-3 text-3xl md:text-4xl" style={{ color: "#1C1C1A" }}>The job-management tools you hate, replaced by one calm screen.</h2>
        </ScrollReveal>
        <ScrollReveal delay={120} className="mt-10">
          <div className="qp-glass overflow-hidden">
            <div className="grid grid-cols-3 text-sm" style={{ color: "#1C1C1A" }}>
              <div className="p-5 border-b border-r" style={{ borderColor: "#E5E4E0" }}></div>
              <div className="p-5 border-b border-r text-center" style={{ borderColor: "#E5E4E0", color: "#6B6B67" }}>Old job-management apps</div>
              <div className="p-5 border-b text-center" style={{ borderColor: "#E5E4E0", fontWeight: 500 }}>QuotePage</div>
              {[
                ["Time to first quote", "Half a day of setup", "90 seconds"],
                ["Per-text / per-message fees", "Yes, often", "None — native share"],
                ["Learning curve", "Onboarding calls", "None"],
                ["Forces a CRM pipeline", "Yes", "No"],
                ["Mobile-first quote view for clients", "Sometimes", "Always"],
                ["Monthly minimum", "$49+", "$0"],
              ].map(([label, a, b], i, arr) => (
                <div key={label} className="contents">
                  <div className="p-4 border-r" style={{ borderColor: "#E5E4E0", borderBottomWidth: i === arr.length - 1 ? 0 : 1, borderBottomStyle: "solid", color: "#6B6B67" }}>{label}</div>
                  <div className="p-4 border-r text-center" style={{ borderColor: "#E5E4E0", borderBottomWidth: i === arr.length - 1 ? 0 : 1, borderBottomStyle: "solid", color: "#9b9b96" }}>{a}</div>
                  <div className="p-4 text-center" style={{ borderColor: "#E5E4E0", borderBottomWidth: i === arr.length - 1 ? 0 : 1, borderBottomStyle: "solid", color: "#1C1C1A", fontWeight: 500 }}>{b}</div>
                </div>
              ))}
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* Pricing */}
      <section id="pricing" className="px-6 md:px-10 max-w-5xl mx-auto w-full py-24">
        <ScrollReveal>
          <p className="text-xs uppercase tracking-[0.18em]" style={{ color: "#6B6B67" }}>Pricing</p>
          <h2 className="mt-3 text-3xl md:text-4xl" style={{ color: "#1C1C1A" }}>Simple. Monthly. Cancel anytime.</h2>
          <p className="mt-4 max-w-2xl text-[0.98rem] leading-relaxed" style={{ color: "#6B6B67" }}>
            Pick a plan based on how many documents you send a month. Every plan includes the
            full quote-to-invoice loop. No per-document fees, no add-on modules.
          </p>
        </ScrollReveal>

        <div className="mt-12 grid md:grid-cols-3 gap-5">
          {[
            {
              t: "Free",
              p: "$0",
              tagline: "Try the whole loop. Forever.",
              cta: "Start free",
              best: false,
              includes: [
                "5 quotes per month",
                "1 user",
                "Public quote links (WhatsApp, SMS, email)",
                "Accept / decline tracking",
                "Reminder ledger",
                "QuotePage watermark on documents",
              ],
              missing: ["No invoice conversion", "No automated reminders", "No white-label"],
            },
            {
              t: "Starter",
              p: "$9",
              tagline: "For solo trades sending a few jobs a week.",
              cta: "Start Starter",
              best: true,
              includes: [
                "50 quotes & invoices per month",
                "1 user",
                "One-click invoice conversion",
                "Automated email follow-ups",
                "PDF export, no watermark",
                "Your logo and brand color",
                "Email support",
              ],
              missing: [],
            },
            {
              t: "Pro",
              p: "$19",
              tagline: "For crews running multiple jobs a day.",
              cta: "Start Pro",
              best: false,
              includes: [
                "Unlimited quotes & invoices",
                "Up to 5 users",
                "Full reminder workflows (email + SMS link)",
                "Custom domain on public quote links",
                "Full white-label (logo, color, footer)",
                "Reusable line-item templates",
                "Priority support",
              ],
              missing: [],
            },
          ].map((p) => (
            <ScrollReveal key={p.t}>
              <div
                className={`qp-glass p-7 h-full flex flex-col ${p.best ? "qp-glass-strong" : ""}`}
                style={p.best ? { boxShadow: "0 1px 0 #2B7A6F inset, 0 12px 32px -16px rgba(43,122,111,0.35)" } : undefined}
              >
                <div className="flex items-baseline justify-between">
                  <p className="text-sm" style={{ color: "#1C1C1A", fontWeight: 500 }}>{p.t}</p>
                  {p.best && (
                    <span className="text-[10px] uppercase tracking-[0.16em] px-2 py-0.5 rounded-full"
                      style={{ backgroundColor: "#2B7A6F", color: "#fff" }}>Most popular</span>
                  )}
                </div>
                <p className="mt-4 text-4xl" style={{ color: "#1C1C1A", fontWeight: 500 }}>
                  {p.p}<span className="text-base" style={{ color: "#6B6B67" }}> / month</span>
                </p>
                <p className="mt-2 text-sm" style={{ color: "#6B6B67" }}>{p.tagline}</p>

                <Link to="/auth" className={`qp-btn ${p.best ? "qp-btn-primary" : "qp-btn-ghost"} mt-6 w-full`}>
                  {p.cta}
                </Link>

                <div className="mt-7 space-y-2.5">
                  {p.includes.map((line) => (
                    <div key={line} className="flex items-start gap-2 text-sm" style={{ color: "#1C1C1A" }}>
                      <span aria-hidden style={{ color: "#2B7A6F" }}>✓</span>
                      <span>{line}</span>
                    </div>
                  ))}
                  {p.missing.map((line) => (
                    <div key={line} className="flex items-start gap-2 text-sm" style={{ color: "#9b9b96" }}>
                      <span aria-hidden>—</span>
                      <span className="line-through">{line}</span>
                    </div>
                  ))}
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>

        <ScrollReveal delay={120} className="mt-8 text-center text-xs" >
          <p style={{ color: "#9b9b96" }}>
            Prices in USD. VAT / GST added where applicable. Upgrade, downgrade, or cancel from your dashboard any time.
          </p>
        </ScrollReveal>
      </section>

      {/* FAQ */}
      <section id="faq" className="px-6 md:px-10 max-w-3xl mx-auto w-full py-24">
        <ScrollReveal>
          <p className="text-xs uppercase tracking-[0.18em]" style={{ color: "#6B6B67" }}>FAQ</p>
          <h2 className="mt-3 text-3xl md:text-4xl" style={{ color: "#1C1C1A" }}>Questions, answered.</h2>
        </ScrollReveal>

        <div className="mt-10 space-y-3">
          {[
            { q: "Do I need to install anything?", a: "No. QuotePage runs in your browser on a phone, tablet, or laptop. Your clients open quotes on a link — they don't need an account or an app either." },
            { q: "What counts as a 'quote' on the Free plan?", a: "Each new quote you create. Edits, re-sends, and follow-ups do NOT count. Invoices created from accepted quotes do NOT count toward the quote limit on paid plans." },
            { q: "Can I send by SMS or WhatsApp without a paid messaging account?", a: "Yes. QuotePage opens your device's native SMS, WhatsApp, or email app with a pre-filled message and link. No third-party gateway, no per-message fee, no business account required." },
            { q: "What happens at the monthly limit?", a: "You'll see a calm inline banner above your dashboard letting you know. Existing quotes keep working — follow-ups still go out and clients can still accept. New quotes are paused until next cycle or until you upgrade." },
            { q: "Can I customize the quote with my logo and terms?", a: "Yes, from the first day. Upload a logo, pick an accent color, set bank details and default terms once. They flow into every quote and invoice." },
            { q: "How does payment work?", a: "Quotes are accepted directly on the public page. For invoices, you include your bank details or payment instructions. QuotePage doesn't take a cut of any payment — you keep 100%." },
            { q: "Can I export my data?", a: "Yes. Every quote, invoice, and customer is yours. Export to CSV from the dashboard whenever you want, and you can delete everything in one click." },
            { q: "Is there a free trial of paid plans?", a: "The Free plan is permanent, not a trial. When you're ready, upgrade — and you can downgrade or cancel from the same screen at any time." },
          ].map((f) => (
            <ScrollReveal key={f.q}>
              <details className="qp-glass p-5 group">
                <summary className="flex items-center justify-between cursor-pointer list-none">
                  <span className="text-[0.98rem]" style={{ color: "#1C1C1A", fontWeight: 500 }}>{f.q}</span>
                  <span className="text-lg group-open:rotate-45 transition-transform" style={{ color: "#6B6B67" }}>+</span>
                </summary>
                <p className="mt-3 text-sm leading-relaxed" style={{ color: "#6B6B67" }}>{f.a}</p>
              </details>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="px-6 md:px-10 max-w-5xl mx-auto w-full py-24">
        <ScrollReveal>
          <div className="qp-glass-strong p-10 md:p-14 text-center">
            <h2 className="text-3xl md:text-4xl" style={{ color: "#1C1C1A" }}>Your next quote is 90 seconds away.</h2>
            <p className="mt-4 text-[0.98rem] max-w-xl mx-auto" style={{ color: "#6B6B67" }}>
              No card. No demo call. Start free, and only upgrade when you're sending more than five jobs a month.
            </p>
            <div className="mt-7 flex items-center justify-center gap-3">
              <Link to="/auth" className="qp-btn qp-btn-primary">Start free</Link>
              <a href="#pricing" className="qp-btn qp-btn-ghost">See pricing</a>
            </div>
          </div>
        </ScrollReveal>
      </section>

      <footer className="px-6 md:px-10 py-10 mt-auto border-t" style={{ borderColor: "#E5E4E0" }}>
        <div className="max-w-5xl mx-auto w-full flex flex-col md:flex-row items-start md:items-center justify-between gap-6 text-xs" style={{ color: "#9b9b96" }}>
          <div>
            <Logo />
            <p className="mt-2 max-w-sm">Win the job. Get paid. Nothing else.</p>
          </div>
          <nav className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <a href="#how">How it works</a>
            <a href="#features">Features</a>
            <a href="#trades">Trades</a>
            <a href="#pricing">Pricing</a>
            <a href="#faq">FAQ</a>
            <Link to="/auth">Sign in</Link>
          </nav>
          <span>© {new Date().getFullYear()} QuotePage</span>
        </div>
      </footer>
    </div>
  );
}
