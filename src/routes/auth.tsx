import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Logo } from "@/components/qp/Logo";
import { toast } from "sonner";

export const Route = createFileRoute("/auth")({
  head: () => ({ meta: [{ title: "Sign in — QuotePage" }] }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [code, setCode] = useState("");
  const [verifying, setVerifying] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) navigate({ to: "/dashboard", replace: true });
    });
  }, [navigate]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setLoading(true);
    const { error } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: {
        shouldCreateUser: true,
        emailRedirectTo:
          typeof window !== "undefined" ? `${window.location.origin}/auth` : undefined,
      },
    });
    setLoading(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    setSent(true);
  }

  async function onVerify(e: React.FormEvent) {
    e.preventDefault();
    const token = code.trim();
    if (token.length < 6) return;
    setVerifying(true);
    const { error } = await supabase.auth.verifyOtp({
      email: email.trim(),
      token,
      type: "email",
    });
    setVerifying(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    navigate({ to: "/dashboard", replace: true });
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="px-6 md:px-10 pt-6"><Logo /></header>
      <div className="flex-1 flex items-center justify-center px-6">
        <div className="qp-glass-strong w-full max-w-md p-8">
          {!sent ? (
            <>
              <h1 className="text-2xl" style={{ color: "#1C1C1A" }}>Sign in</h1>
              <p className="mt-2 text-sm" style={{ color: "#6B6B67" }}>
                Enter your email — we'll send a 6-digit code and a one-tap link. Use either. No password.
              </p>
              <form onSubmit={onSubmit} className="mt-6 space-y-3">
                <input
                  type="email"
                  required
                  autoFocus
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@business.com"
                  className="qp-input"
                />
                <button type="submit" disabled={loading} className="qp-btn qp-btn-primary w-full disabled:opacity-60">
                  {loading ? "Sending…" : "Send magic link"}
                </button>
              </form>
            </>
          ) : (
            <>
              <h1 className="text-2xl" style={{ color: "#1C1C1A" }}>Check your inbox</h1>
              <p className="mt-2 text-sm" style={{ color: "#6B6B67" }}>
                We sent a 6-digit code <em>and</em> a one-tap link to{" "}
                <span style={{ color: "#1C1C1A" }}>{email}</span>. Use whichever you prefer.
              </p>
              <form onSubmit={onVerify} className="mt-6 space-y-3">
                <input
                  inputMode="numeric"
                  pattern="[0-9]*"
                  autoComplete="one-time-code"
                  maxLength={6}
                  required
                  autoFocus
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
                  placeholder="123456"
                  className="qp-input text-center tracking-[0.5em] text-lg"
                />
                <button type="submit" disabled={verifying || code.length < 6} className="qp-btn qp-btn-primary w-full disabled:opacity-60">
                  {verifying ? "Verifying…" : "Verify code"}
                </button>
              </form>
              <button onClick={() => { setSent(false); setCode(""); }} className="qp-btn qp-btn-ghost mt-3 w-full">
                Use a different email
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}