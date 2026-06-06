import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { createQuote, getMyBusiness } from "@/lib/qp.functions";
import { PageShell } from "@/components/qp/PageShell";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/quotes/new")({
  head: () => ({ meta: [{ title: "New quote — QuotePage" }] }),
  component: NewQuote,
});

type Suggestion = { properties: { name?: string; street?: string; city?: string; country?: string; postcode?: string; housenumber?: string }; geometry: any };
type Item = { description: string; quantity: number; unit_price: number };

function NewQuote() {
  const navigate = useNavigate();
  const getBiz = useServerFn(getMyBusiness);
  const create = useServerFn(createQuote);
  const biz = useQuery({ queryKey: ["business"], queryFn: () => getBiz() });

  const [step, setStep] = useState(0);
  const [completed, setCompleted] = useState<number[]>([]);

  const [custName, setCustName] = useState("");
  const [custEmail, setCustEmail] = useState("");
  const [custPhone, setCustPhone] = useState("");
  const [address, setAddress] = useState("");
  const [addressSuggestions, setAddressSuggestions] = useState<Suggestion[]>([]);
  const [jobType, setJobType] = useState("");
  const [items, setItems] = useState<Item[]>([{ description: "", quantity: 1, unit_price: 0 }]);
  const [notes, setNotes] = useState("");
  const [validity, setValidity] = useState(30);
  const [submitting, setSubmitting] = useState(false);

  const stepRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (biz.data?.default_terms && !notes) setNotes(biz.data.default_terms);
  }, [biz.data, notes]);

  useEffect(() => {
    if (biz.isSuccess && !biz.data) navigate({ to: "/onboarding", replace: true });
  }, [biz.isSuccess, biz.data, navigate]);

  // Photon autocomplete
  useEffect(() => {
    if (step !== 0 || address.trim().length < 3) {
      setAddressSuggestions([]);
      return;
    }
    const c = new AbortController();
    const t = setTimeout(async () => {
      try {
        const r = await fetch(`https://photon.komoot.io/api/?q=${encodeURIComponent(address)}&limit=5`, { signal: c.signal });
        const j = await r.json();
        setAddressSuggestions(j.features ?? []);
      } catch {}
    }, 250);
    return () => { clearTimeout(t); c.abort(); };
  }, [address, step]);

  function advance(to: number) {
    setCompleted((c) => Array.from(new Set([...c, step])));
    setStep(to);
    setTimeout(() => stepRefs.current[to]?.scrollIntoView({ behavior: "smooth", block: "center" }), 60);
  }

  function fmtAddr(s: Suggestion) {
    const p = s.properties;
    return [p.housenumber, p.street, p.city, p.postcode, p.country].filter(Boolean).join(", ");
  }

  const subtotal = items.reduce((s, it) => s + (Number(it.quantity) || 0) * (Number(it.unit_price) || 0), 0);
  const taxAmt = biz.data?.tax_enabled ? subtotal * (Number(biz.data.tax_rate) / 100) : 0;
  const total = subtotal + taxAmt;

  async function submit(status: "draft" | "sent") {
    if (!custName.trim()) return toast.error("Customer name required");
    if (!jobType.trim()) return toast.error("Job type required");
    if (items.length === 0 || !items[0].description.trim()) return toast.error("Add at least one line item");
    setSubmitting(true);
    try {
      const res = await create({
        data: {
          customer: { name: custName.trim(), email: custEmail.trim() || null, phone: custPhone.trim() || null, address: address.trim() || null },
          job_type: jobType.trim(),
          validity_days: validity,
          notes: notes || null,
          items: items.filter((i) => i.description.trim()),
          status,
        },
      });
      toast.success(`Quote ${res.quote_number} created`);
      navigate({ to: "/dashboard" });
    } catch (e: any) {
      toast.error(e?.message ?? "Could not create quote");
    } finally {
      setSubmitting(false);
    }
  }

  const steps: { title: string; render: () => React.ReactNode }[] = [
    {
      title: "Customer",
      render: () => (
        <div className="space-y-3">
          <input className="qp-input" placeholder="Customer name" value={custName} onChange={(e) => setCustName(e.target.value)} autoFocus />
          <div className="grid grid-cols-2 gap-3">
            <input className="qp-input" placeholder="Email (optional)" value={custEmail} onChange={(e) => setCustEmail(e.target.value)} />
            <input className="qp-input" placeholder="Phone (optional)" value={custPhone} onChange={(e) => setCustPhone(e.target.value)} />
          </div>
          <div className="relative">
            <input className="qp-input" placeholder="Job address" value={address} onChange={(e) => setAddress(e.target.value)} />
            {addressSuggestions.length > 0 && (
              <div className="absolute z-20 mt-1 w-full qp-glass-strong max-h-60 overflow-auto">
                {addressSuggestions.map((s, i) => (
                  <button key={i} type="button" onClick={() => { setAddress(fmtAddr(s)); setAddressSuggestions([]); }}
                    className="w-full text-left px-4 py-2 text-sm hover:bg-white/50" style={{ color: "#1C1C1A", borderBottom: i < addressSuggestions.length - 1 ? "1px solid #E5E4E0" : "none" }}>
                    {fmtAddr(s)}
                  </button>
                ))}
              </div>
            )}
          </div>
          <NextBtn onClick={() => custName.trim() && advance(1)} disabled={!custName.trim()} />
        </div>
      ),
    },
    {
      title: "Job type",
      render: () => (
        <div className="space-y-3">
          <input className="qp-input" placeholder={biz.data?.trade_type === "hvac" ? "e.g. AC install — 3-ton split system" : "Describe the job"} value={jobType} onChange={(e) => setJobType(e.target.value)} autoFocus onKeyDown={(e) => e.key === "Enter" && jobType.trim() && advance(2)} />
          <NextBtn onClick={() => jobType.trim() && advance(2)} disabled={!jobType.trim()} />
        </div>
      ),
    },
    {
      title: "Line items",
      render: () => (
        <div className="space-y-3">
          <div className="grid grid-cols-12 gap-2 text-xs uppercase tracking-wider px-1" style={{ color: "#6B6B67" }}>
            <div className="col-span-6">Description</div>
            <div className="col-span-2 text-right">Qty</div>
            <div className="col-span-3 text-right">Unit price</div>
            <div className="col-span-1" />
          </div>
          {items.map((it, idx) => (
            <div key={idx} className="grid grid-cols-12 gap-2 items-center">
              <input className="qp-input col-span-6" placeholder="What's included" value={it.description} onChange={(e) => setItems((arr) => arr.map((x, i) => i === idx ? { ...x, description: e.target.value } : x))} />
              <input type="number" min={0} step={0.5} className="qp-input col-span-2 text-right tabular-nums" value={it.quantity} onChange={(e) => setItems((arr) => arr.map((x, i) => i === idx ? { ...x, quantity: parseFloat(e.target.value) || 0 } : x))} />
              <input type="number" min={0} step={0.01} className="qp-input col-span-3 text-right tabular-nums" value={it.unit_price} onChange={(e) => setItems((arr) => arr.map((x, i) => i === idx ? { ...x, unit_price: parseFloat(e.target.value) || 0 } : x))} />
              <button type="button" onClick={() => setItems((a) => a.length > 1 ? a.filter((_, i) => i !== idx) : a)} className="col-span-1 text-sm" style={{ color: "#9b9b96" }}>×</button>
            </div>
          ))}
          <button type="button" onClick={() => setItems((a) => [...a, { description: "", quantity: 1, unit_price: 0 }])} className="text-sm" style={{ color: "#2B7A6F", fontWeight: 500 }}>+ Add line</button>
          <div className="flex items-center justify-between pt-3" style={{ borderTop: "1px solid #E5E4E0" }}>
            <span className="text-sm" style={{ color: "#6B6B67" }}>Subtotal</span>
            <span className="text-lg tabular-nums" style={{ color: "#1C1C1A", fontWeight: 500 }}>${subtotal.toFixed(2)}</span>
          </div>
          <NextBtn onClick={() => items.some((i) => i.description.trim()) && advance(3)} disabled={!items.some((i) => i.description.trim())} />
        </div>
      ),
    },
    {
      title: "Notes & terms",
      render: () => (
        <div className="space-y-3">
          <textarea className="qp-input !h-32 py-2" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Terms shown to the customer" />
          <NextBtn onClick={() => advance(4)} />
        </div>
      ),
    },
    {
      title: "Validity",
      render: () => (
        <div className="space-y-3">
          <select className="qp-input" value={validity} onChange={(e) => setValidity(parseInt(e.target.value))}>
            {[7, 14, 30, 60, 90].map((d) => <option key={d} value={d}>{d} days</option>)}
          </select>
          <NextBtn onClick={() => advance(5)} />
        </div>
      ),
    },
    {
      title: "Preview",
      render: () => (
        <div className="space-y-4">
          <PreviewDocument biz={biz.data} customer={{ name: custName, address }} jobType={jobType} items={items} subtotal={subtotal} taxAmt={taxAmt} total={total} notes={notes} validity={validity} />
          <div className="flex items-center gap-3 justify-end pt-2">
            <button onClick={() => submit("draft")} disabled={submitting} className="qp-btn qp-btn-ghost">Save as draft</button>
            <button onClick={() => submit("sent")} disabled={submitting} className="qp-btn qp-btn-primary">{submitting ? "Saving…" : "Create & share"}</button>
          </div>
        </div>
      ),
    },
  ];

  return (
    <PageShell>
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl mb-1" style={{ color: "#1C1C1A" }}>New quote</h1>
        <p className="text-sm mb-8" style={{ color: "#6B6B67" }}>One step at a time. Press Enter to continue.</p>

        <div className="space-y-4">
          {steps.map((s, i) => {
            const isActive = i === step;
            const isDone = completed.includes(i) && !isActive;
            return (
              <div key={i} ref={(el) => { stepRefs.current[i] = el; }}
                className={isActive ? "qp-glass-strong p-6" : isDone ? "qp-glass px-5 py-3" : "qp-glass p-5 opacity-60"}>
                <div className="flex items-center justify-between">
                  <p className="text-xs uppercase tracking-wider" style={{ color: isActive ? "#2B7A6F" : "#6B6B67" }}>
                    Step {i + 1} · {s.title}
                  </p>
                  {isDone && (
                    <button onClick={() => setStep(i)} className="text-xs" style={{ color: "#2B7A6F" }}>Edit</button>
                  )}
                </div>
                {isActive && <div className="mt-4">{s.render()}</div>}
                {isDone && <SummaryLine i={i} state={{ custName, address, jobType, items, notes, validity, subtotal }} />}
              </div>
            );
          })}
        </div>
      </div>
    </PageShell>
  );
}

function NextBtn({ onClick, disabled }: { onClick: () => void; disabled?: boolean }) {
  return (
    <div className="flex justify-end pt-2">
      <button onClick={onClick} disabled={disabled} className="qp-btn qp-btn-primary disabled:opacity-50">Next →</button>
    </div>
  );
}

function SummaryLine({ i, state }: { i: number; state: any }) {
  const text =
    i === 0 ? `${state.custName}${state.address ? " · " + state.address : ""}` :
    i === 1 ? state.jobType :
    i === 2 ? `${state.items.filter((x: Item) => x.description.trim()).length} items · $${state.subtotal.toFixed(2)}` :
    i === 3 ? (state.notes ? state.notes.slice(0, 80) + (state.notes.length > 80 ? "…" : "") : "No notes") :
    `${state.validity} days`;
  return <p className="text-sm mt-1" style={{ color: "#1C1C1A" }}>{text}</p>;
}

function PreviewDocument({ biz, customer, jobType, items, subtotal, taxAmt, total, notes, validity }: any) {
  return (
    <div className="rounded-lg overflow-hidden bg-white" style={{ border: "1px solid #E5E4E0" }}>
      <div className="h-2" style={{ backgroundColor: biz?.accent_color || "#2B7A6F" }} />
      <div className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            {biz?.logo_url && <img src={biz.logo_url} className="w-10 h-10 object-contain" alt="logo" />}
            <div>
              <p style={{ fontWeight: 500, color: "#1C1C1A" }}>{biz?.name}</p>
              <p className="text-xs" style={{ color: "#6B6B67" }}>{String(biz?.trade_type || "").toUpperCase()}</p>
            </div>
          </div>
          <div className="text-right text-xs" style={{ color: "#6B6B67" }}>
            <p style={{ color: "#1C1C1A", fontWeight: 500 }}>QUOTE</p>
            <p>Valid for {validity} days</p>
          </div>
        </div>
        <div className="mt-6 pt-4" style={{ borderTop: "1px solid #E5E4E0" }}>
          <p className="text-xs" style={{ color: "#6B6B67" }}>Bill to</p>
          <p style={{ color: "#1C1C1A" }}>{customer.name || "—"}</p>
          {customer.address && <p className="text-sm" style={{ color: "#6B6B67" }}>{customer.address}</p>}
          <p className="mt-3 text-xs" style={{ color: "#6B6B67" }}>Job</p>
          <p style={{ color: "#1C1C1A" }}>{jobType || "—"}</p>
        </div>
        <table className="w-full mt-6 text-sm">
          <thead>
            <tr style={{ color: "#6B6B67" }}>
              <th className="text-left pb-2 font-normal">Description</th>
              <th className="text-right pb-2 font-normal">Qty</th>
              <th className="text-right pb-2 font-normal">Unit</th>
              <th className="text-right pb-2 font-normal">Total</th>
            </tr>
          </thead>
          <tbody>
            {items.filter((i: Item) => i.description.trim()).map((it: Item, i: number) => (
              <tr key={i} style={{ borderTop: "1px solid #E5E4E0" }}>
                <td className="py-2" style={{ color: "#1C1C1A" }}>{it.description}</td>
                <td className="py-2 text-right tabular-nums" style={{ color: "#1C1C1A" }}>{it.quantity}</td>
                <td className="py-2 text-right tabular-nums" style={{ color: "#1C1C1A" }}>${it.unit_price.toFixed(2)}</td>
                <td className="py-2 text-right tabular-nums" style={{ color: "#1C1C1A" }}>${(it.quantity * it.unit_price).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="mt-4 ml-auto w-64 text-sm space-y-1">
          <div className="flex justify-between"><span style={{ color: "#6B6B67" }}>Subtotal</span><span className="tabular-nums" style={{ color: "#1C1C1A" }}>${subtotal.toFixed(2)}</span></div>
          {biz?.tax_enabled && (
            <div className="flex justify-between"><span style={{ color: "#6B6B67" }}>Tax ({biz.tax_rate}%)</span><span className="tabular-nums" style={{ color: "#1C1C1A" }}>${taxAmt.toFixed(2)}</span></div>
          )}
          <div className="flex justify-between pt-2" style={{ borderTop: "1px solid #E5E4E0" }}>
            <span style={{ color: "#1C1C1A", fontWeight: 500 }}>Total</span>
            <span className="tabular-nums" style={{ color: "#1C1C1A", fontWeight: 500 }}>${total.toFixed(2)}</span>
          </div>
        </div>
        {notes && (
          <div className="mt-6 pt-4 text-xs" style={{ borderTop: "1px solid #E5E4E0", color: "#6B6B67" }}>
            <p style={{ color: "#1C1C1A", fontWeight: 500 }}>Terms</p>
            <p className="mt-1 whitespace-pre-line">{notes}</p>
          </div>
        )}
        <p className="mt-8 text-[10px] text-center" style={{ color: "#9b9b96" }}>Made with QuotePage</p>
      </div>
    </div>
  );
}