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
      <header className="px-6 md:px-10 pt-6 flex items-center justify-between">
        <Logo />
        <nav className="flex items-center gap-2 text-sm">
          <Link to="/auth" className="px-3 py-1.5" style={{ color: "#6B6B67" }}>Sign in</Link>
          <Link to="/auth" className="qp-btn qp-btn-primary !h-9 !px-4">Get started</Link>
        </nav>
      </header>

      <section className="flex-1 px-6 md:px-10 max-w-5xl mx-auto w-full pt-24 pb-32">
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
            Quote on the drive home. Auto follow-ups while you sleep. One tap from accepted quote
            to paid invoice. No software bloat. No per-text fees.
          </p>
          <div className="mt-9 flex items-center gap-3">
            <Link to="/auth" className="qp-btn qp-btn-primary">Start free</Link>
            <span className="text-sm" style={{ color: "#6B6B67" }}>5 quotes / month · no card</span>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={120} className="mt-24">
          <div className="qp-glass p-8 md:p-10 grid md:grid-cols-3 gap-8">
            {[
              { k: "Quote", v: "Stepped builder. No 30-field form. Save drafts on every blur." },
              { k: "Follow up", v: "Day 3, 7, and pre-expiry nudges. Toggle off per document." },
              { k: "Get paid", v: "One click converts an accepted quote into an invoice." },
            ].map((f) => (
              <div key={f.k}>
                <p className="text-sm" style={{ color: "#2B7A6F", fontWeight: 500 }}>{f.k}</p>
                <p className="mt-2 text-[0.95rem] leading-relaxed" style={{ color: "#1C1C1A" }}>{f.v}</p>
              </div>
            ))}
          </div>
        </ScrollReveal>

        <ScrollReveal delay={200} className="mt-20">
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { t: "Free", p: "$0", s: "5 quotes / month · watermark · native share links" },
              { t: "Starter", p: "$9", s: "50 quotes · invoice conversion · email reminders" },
              { t: "Pro", p: "$19", s: "Unlimited · white-label · full reminder workflows" },
            ].map((p) => (
              <div key={p.t} className="qp-glass p-6">
                <p className="text-sm" style={{ color: "#6B6B67" }}>{p.t}</p>
                <p className="mt-2 text-3xl" style={{ color: "#1C1C1A", fontWeight: 500 }}>
                  {p.p}<span className="text-base" style={{ color: "#6B6B67" }}>/mo</span>
                </p>
                <p className="mt-3 text-sm" style={{ color: "#6B6B67" }}>{p.s}</p>
              </div>
            ))}
          </div>
        </ScrollReveal>
      </section>

      <footer className="px-6 md:px-10 py-8 flex items-center justify-between text-xs" style={{ color: "#9b9b96" }}>
        <Logo />
        <span>© {new Date().getFullYear()} QuotePage</span>
      </footer>
    </div>
  );
}
