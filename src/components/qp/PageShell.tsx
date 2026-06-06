import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { useEffect, useState, type ReactNode } from "react";
import { Logo } from "./Logo";
import { supabase } from "@/integrations/supabase/client";

export function PageShell({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setEmail(data.user?.email ?? null));
  }, []);

  async function signOut() {
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-30">
        <div className="qp-glass mx-4 mt-4 px-5 py-3 flex items-center justify-between">
          <Logo to="/dashboard" />
          <nav className="flex items-center gap-1 text-sm">
            <Link to="/dashboard" className="px-3 py-1.5 rounded-md transition-colors"
              style={{ color: pathname === "/dashboard" ? "#1C1C1A" : "#6B6B67", fontWeight: pathname === "/dashboard" ? 500 : 400 }}>
              Documents
            </Link>
            <Link to="/quotes/new" className="px-3 py-1.5 rounded-md transition-colors"
              style={{ color: pathname.startsWith("/quotes/new") ? "#1C1C1A" : "#6B6B67" }}>
              New quote
            </Link>
            <Link to="/settings" className="px-3 py-1.5 rounded-md transition-colors"
              style={{ color: pathname === "/settings" ? "#1C1C1A" : "#6B6B67" }}>
              Settings
            </Link>
            <span className="mx-2 h-5 w-px" style={{ backgroundColor: "#E5E4E0" }} />
            <span className="text-xs" style={{ color: "#6B6B67" }}>{email}</span>
            <button onClick={signOut} className="ml-2 text-xs px-2 py-1 rounded-md" style={{ color: "#6B6B67" }}>Sign out</button>
          </nav>
        </div>
      </header>
      <main className="flex-1 px-4 pb-16 pt-8">{children}</main>
      <footer className="px-4 py-6 text-xs text-center" style={{ color: "#9b9b96" }}>
        QuotePage · Win the job. Get paid.
      </footer>
    </div>
  );
}