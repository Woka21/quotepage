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
      options: { emailRedirectTo: typeof window !== "undefined" ? window.location.origin + "/dashboard" : undefined },
    });
    setLoading(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    setSent(true);
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
                Enter your email — we'll send a one-time link. No password.
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
                We sent a sign-in link to <span style={{ color: "#1C1C1A" }}>{email}</span>. Open it on this device.
              </p>
              <button onClick={() => setSent(false)} className="qp-btn qp-btn-ghost mt-6 w-full">
                Use a different email
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}