import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { getMyBusiness, listQuotes } from "@/lib/qp.functions";
import { PageShell } from "@/components/qp/PageShell";
import { StatusPill } from "@/components/qp/StatusPill";

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({ meta: [{ title: "Documents — QuotePage" }] }),
  component: Dashboard,
});

function fmtMoney(n: number) {
  return "$" + n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}
function fmtDate(s: string) {
  return new Date(s).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
}

function Dashboard() {
  const navigate = useNavigate();
  const getBiz = useServerFn(getMyBusiness);
  const listQ = useServerFn(listQuotes);
  const [tab, setTab] = useState<"quotes" | "invoices">("quotes");
  const [search, setSearch] = useState("");

  const biz = useQuery({ queryKey: ["business"], queryFn: () => getBiz() });
  const quotes = useQuery({
    queryKey: ["quotes"],
    queryFn: () => listQ(),
    enabled: !!biz.data,
  });

  if (biz.isLoading) return <PageShell><LoadingState /></PageShell>;
  if (!biz.data) {
    if (typeof window !== "undefined") navigate({ to: "/onboarding", replace: true });
    return <PageShell><LoadingState /></PageShell>;
  }

  const filtered = (quotes.data ?? []).filter((q) =>
    !search.trim() ? true : q.customer_name.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <PageShell>
      <div className="max-w-6xl mx-auto">
        <div className="flex items-end justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl" style={{ color: "#1C1C1A" }}>Documents</h1>
            <p className="text-sm mt-1" style={{ color: "#6B6B67" }}>
              {biz.data.name} · {String(biz.data.trade_type).toUpperCase()}
            </p>
          </div>
          <Link to="/quotes/new" className="qp-btn qp-btn-primary">+ New quote</Link>
        </div>

        <div className="qp-glass p-1.5 inline-flex gap-1 mb-5">
          <TabBtn active={tab === "quotes"} onClick={() => setTab("quotes")}>Quotes</TabBtn>
          <TabBtn active={tab === "invoices"} onClick={() => setTab("invoices")}>Invoices</TabBtn>
        </div>

        <div className="mb-4">
          <input
            className="qp-input max-w-sm"
            placeholder="Search by customer name…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {tab === "quotes" ? (
          <div className="qp-glass overflow-hidden">
            <div className="grid grid-cols-12 px-5 py-3 text-xs uppercase tracking-wider" style={{ color: "#6B6B67", borderBottom: "1px solid #E5E4E0" }}>
              <div className="col-span-2">Ref</div>
              <div className="col-span-3">Customer</div>
              <div className="col-span-3">Job</div>
              <div className="col-span-2 text-right">Total</div>
              <div className="col-span-1">Date</div>
              <div className="col-span-1 text-right">Status</div>
            </div>
            {quotes.isLoading ? (
              <div className="px-5 py-12 text-center text-sm" style={{ color: "#6B6B67" }}>Loading…</div>
            ) : filtered.length === 0 ? (
              <EmptyQuotes />
            ) : (
              filtered.map((q) => (
                <Link
                  key={q.id}
                  to="/q/$token"
                  params={{ token: q.token }}
                  target="_blank"
                  className="grid grid-cols-12 px-5 py-4 items-center text-sm hover:bg-white/30 transition-colors"
                  style={{ borderBottom: "1px solid #E5E4E0", color: "#1C1C1A" }}
                >
                  <div className="col-span-2" style={{ fontWeight: 500 }}>{q.quote_number}</div>
                  <div className="col-span-3">{q.customer_name}</div>
                  <div className="col-span-3" style={{ color: "#6B6B67" }}>{q.job_type}</div>
                  <div className="col-span-2 text-right tabular-nums">{fmtMoney(q.total)}</div>
                  <div className="col-span-1 text-xs" style={{ color: "#6B6B67" }}>{fmtDate(q.created_at)}</div>
                  <div className="col-span-1 flex justify-end"><StatusPill kind="quote" status={q.status} /></div>
                </Link>
              ))
            )}
          </div>
        ) : (
          <div className="qp-glass p-12 text-center">
            <p style={{ color: "#1C1C1A", fontWeight: 500 }}>Invoices land here</p>
            <p className="mt-2 text-sm" style={{ color: "#6B6B67" }}>
              Once a quote is accepted you'll be able to convert it to an invoice in one click.
              Coming in the next release.
            </p>
          </div>
        )}
      </div>
    </PageShell>
  );
}

function TabBtn({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className="px-4 py-1.5 text-sm rounded-md transition-colors"
      style={{
        backgroundColor: active ? "rgba(255,255,255,0.7)" : "transparent",
        color: active ? "#1C1C1A" : "#6B6B67",
        fontWeight: active ? 500 : 400,
      }}
    >
      {children}
    </button>
  );
}

function LoadingState() {
  return <div className="qp-glass p-10 text-center text-sm" style={{ color: "#6B6B67" }}>Loading…</div>;
}

function EmptyQuotes() {
  return (
    <div className="px-5 py-16 text-center">
      <p style={{ color: "#1C1C1A", fontWeight: 500 }}>No quotes yet</p>
      <p className="mt-2 text-sm" style={{ color: "#6B6B67" }}>Create your first quote — it takes about a minute.</p>
      <Link to="/quotes/new" className="qp-btn qp-btn-primary mt-5 inline-flex">Create your first quote →</Link>
    </div>
  );
}