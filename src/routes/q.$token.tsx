import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { getPublicQuote, acceptPublicQuote } from "@/lib/qp-public.functions";
import { Logo } from "@/components/qp/Logo";
import { StatusPill } from "@/components/qp/StatusPill";
import { toast } from "sonner";

export const Route = createFileRoute("/q/$token")({
  head: ({ params }) => ({ meta: [{ title: `Quote ${params.token.slice(0, 6)} — QuotePage` }] }),
  component: PublicQuotePage,
});

function PublicQuotePage() {
  const { token } = Route.useParams();
  const fetchQuote = useServerFn(getPublicQuote);
  const accept = useServerFn(acceptPublicQuote);
  const [copied, setCopied] = useState(false);

  const q = useQuery({
    queryKey: ["public-quote", token],
    queryFn: () => fetchQuote({ data: { token } }),
  });

  const acceptMut = useMutation({
    mutationFn: (decision: "accepted" | "declined") => accept({ data: { token, decision } }),
    onSuccess: () => { toast.success("Thanks — your contractor has been notified."); q.refetch(); },
    onError: (e: any) => toast.error(e?.message ?? "Could not record response"),
  });

  if (q.isLoading) {
    return <div className="min-h-screen flex items-center justify-center text-sm" style={{ color: "#6B6B67" }}>Loading quote…</div>;
  }
  if (q.error || !q.data) {
    return <div className="min-h-screen flex items-center justify-center text-sm" style={{ color: "#6B6B67" }}>Quote not found.</div>;
  }

  const quote = q.data as any;
  const biz = quote.business;
  const cust = quote.customer;
  const items = quote.line_items ?? [];
  const subtotal = items.reduce((s: number, it: any) => s + Number(it.quantity) * Number(it.unit_price), 0);
  const taxAmt = biz.tax_enabled ? subtotal * (Number(biz.tax_rate) / 100) : 0;
  const total = subtotal + taxAmt;
  const expired = (() => {
    const created = new Date(quote.created_at).getTime();
    return Date.now() > created + quote.validity_days * 86400000;
  })();
  const finalized = quote.status === "accepted" || quote.status === "declined";

  function copyLink() {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <div className="min-h-screen px-4 py-10">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <Logo />
          <StatusPill kind="quote" status={expired && !finalized ? "expired" : quote.status} />
        </div>

        <div className="qp-glass-strong overflow-hidden">
          <div className="h-2" style={{ backgroundColor: biz.accent_color || "#2B7A6F" }} />
          <div className="p-8 md:p-10 bg-white/40">
            <div className="flex items-start justify-between gap-6 flex-wrap">
              <div className="flex items-center gap-3">
                {biz.logo_url && <img src={biz.logo_url} className="w-12 h-12 object-contain" alt="" />}
                <div>
                  <p style={{ fontWeight: 500, color: "#1C1C1A", fontSize: "1.1rem" }}>{biz.name}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs uppercase tracking-wider" style={{ color: "#6B6B67" }}>Quote</p>
                <p style={{ color: "#1C1C1A", fontWeight: 500 }}>{quote.quote_number}</p>
                <p className="text-xs mt-1" style={{ color: "#6B6B67" }}>
                  Valid {quote.validity_days} days · issued {new Date(quote.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>

            <div className="mt-8 grid md:grid-cols-2 gap-6" style={{ borderTop: "1px solid #E5E4E0", paddingTop: "1.5rem" }}>
              <div>
                <p className="text-xs uppercase tracking-wider" style={{ color: "#6B6B67" }}>Bill to</p>
                <p className="mt-1" style={{ color: "#1C1C1A" }}>{cust.name}</p>
                {cust.address && <p className="text-sm" style={{ color: "#6B6B67" }}>{cust.address}</p>}
                {cust.email && <p className="text-sm" style={{ color: "#6B6B67" }}>{cust.email}</p>}
              </div>
              <div>
                <p className="text-xs uppercase tracking-wider" style={{ color: "#6B6B67" }}>Job</p>
                <p className="mt-1" style={{ color: "#1C1C1A" }}>{quote.job_type}</p>
              </div>
            </div>

            <table className="w-full mt-8 text-sm">
              <thead>
                <tr style={{ color: "#6B6B67" }}>
                  <th className="text-left pb-2 font-normal">Description</th>
                  <th className="text-right pb-2 font-normal">Qty</th>
                  <th className="text-right pb-2 font-normal">Unit</th>
                  <th className="text-right pb-2 font-normal">Total</th>
                </tr>
              </thead>
              <tbody>
                {items.map((it: any) => (
                  <tr key={it.id} style={{ borderTop: "1px solid #E5E4E0" }}>
                    <td className="py-3" style={{ color: "#1C1C1A" }}>{it.description}</td>
                    <td className="py-3 text-right tabular-nums" style={{ color: "#1C1C1A" }}>{Number(it.quantity)}</td>
                    <td className="py-3 text-right tabular-nums" style={{ color: "#1C1C1A" }}>${Number(it.unit_price).toFixed(2)}</td>
                    <td className="py-3 text-right tabular-nums" style={{ color: "#1C1C1A" }}>${(Number(it.quantity) * Number(it.unit_price)).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="mt-4 ml-auto w-full max-w-xs text-sm space-y-1">
              <div className="flex justify-between"><span style={{ color: "#6B6B67" }}>Subtotal</span><span className="tabular-nums" style={{ color: "#1C1C1A" }}>${subtotal.toFixed(2)}</span></div>
              {biz.tax_enabled && (
                <div className="flex justify-between"><span style={{ color: "#6B6B67" }}>Tax ({biz.tax_rate}%)</span><span className="tabular-nums" style={{ color: "#1C1C1A" }}>${taxAmt.toFixed(2)}</span></div>
              )}
              <div className="flex justify-between pt-2 text-base" style={{ borderTop: "1px solid #E5E4E0" }}>
                <span style={{ color: "#1C1C1A", fontWeight: 500 }}>Total</span>
                <span className="tabular-nums" style={{ color: "#1C1C1A", fontWeight: 500 }}>${total.toFixed(2)}</span>
              </div>
            </div>

            {quote.notes && (
              <div className="mt-8 pt-4 text-sm" style={{ borderTop: "1px solid #E5E4E0", color: "#6B6B67" }}>
                <p style={{ color: "#1C1C1A", fontWeight: 500 }}>Terms</p>
                <p className="mt-1 whitespace-pre-line">{quote.notes}</p>
              </div>
            )}
          </div>

          {!finalized && !expired && (
            <div className="p-6 md:p-8 flex flex-wrap items-center justify-between gap-3" style={{ borderTop: "1px solid #E5E4E0", backgroundColor: "rgba(255,255,255,0.5)" }}>
              <p className="text-sm" style={{ color: "#6B6B67" }}>Ready to move forward?</p>
              <div className="flex items-center gap-2">
                <button onClick={() => acceptMut.mutate("declined")} disabled={acceptMut.isPending} className="qp-btn qp-btn-ghost">Decline</button>
                <button onClick={() => acceptMut.mutate("accepted")} disabled={acceptMut.isPending} className="qp-btn qp-btn-primary">
                  {acceptMut.isPending ? "Saving…" : "Accept quote"}
                </button>
              </div>
            </div>
          )}
          {finalized && (
            <div className="p-6 text-sm text-center" style={{ borderTop: "1px solid #E5E4E0", color: "#6B6B67" }}>
              {quote.status === "accepted"
                ? `Accepted ${quote.accepted_at ? "on " + new Date(quote.accepted_at).toLocaleDateString() : ""}. Your contractor will be in touch.`
                : "This quote has been declined."}
            </div>
          )}
        </div>

        <div className="flex items-center justify-between mt-4">
          <p className="text-[10px]" style={{ color: "#9b9b96" }}>Made with QuotePage</p>
          <button onClick={copyLink} className="text-xs" style={{ color: "#6B6B67" }}>{copied ? "Copied" : "Copy link"}</button>
        </div>
      </div>
    </div>
  );
}