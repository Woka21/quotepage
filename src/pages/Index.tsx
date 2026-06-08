import { Link } from 'react-router-dom'
import { Logo } from '@/components/qp/Logo'
import { ScrollReveal } from '@/components/qp/ScrollReveal'

export default function Index() {
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
  )
}
