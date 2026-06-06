import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { getMyBusiness, upsertBusiness } from "@/lib/qp.functions";
import { supabase } from "@/integrations/supabase/client";
import { PageShell } from "@/components/qp/PageShell";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/onboarding")({
  head: () => ({ meta: [{ title: "Welcome — QuotePage" }] }),
  component: Onboarding,
});

const TRADES = [
  { v: "hvac", l: "HVAC" },
  { v: "plumbing", l: "Plumbing" },
  { v: "roofing", l: "Roofing" },
  { v: "solar", l: "Solar" },
  { v: "other", l: "Other" },
] as const;

function Onboarding() {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const getBiz = useServerFn(getMyBusiness);
  const saveBiz = useServerFn(upsertBusiness);

  const biz = useQuery({ queryKey: ["business"], queryFn: () => getBiz() });

  const [step, setStep] = useState(0);
  const [name, setName] = useState("");
  const [trade, setTrade] = useState<typeof TRADES[number]["v"]>("hvac");
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [accent, setAccent] = useState("#2B7A6F");
  const [terms, setTerms] = useState("Payment due within 14 days of invoice. Thank you for your business.");
  const [taxEnabled, setTaxEnabled] = useState(false);
  const [taxRate, setTaxRate] = useState(0);
  const [bank, setBank] = useState("");
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (biz.data) navigate({ to: "/dashboard", replace: true });
  }, [biz.data, navigate]);

  async function uploadLogo(file: File) {
    setUploading(true);
    const { data: u } = await supabase.auth.getUser();
    if (!u.user) return;
    const ext = file.name.split(".").pop() || "png";
    const path = `${u.user.id}/logo-${Date.now()}.${ext}`;
    const { error } = await supabase.storage.from("logos").upload(path, file, { upsert: true });
    setUploading(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    const { data } = supabase.storage.from("logos").getPublicUrl(path);
    setLogoUrl(data.publicUrl);
  }

  async function finish() {
    setSaving(true);
    try {
      await saveBiz({
        data: {
          name: name.trim(),
          trade_type: trade,
          logo_url: logoUrl,
          accent_color: accent,
          tax_enabled: taxEnabled,
          tax_rate: taxRate,
          default_terms: terms,
          bank_details: bank || null,
        },
      });
      await qc.invalidateQueries({ queryKey: ["business"] });
      navigate({ to: "/dashboard", replace: true });
    } catch (e: any) {
      toast.error(e?.message ?? "Could not save");
    } finally {
      setSaving(false);
    }
  }

  const progress = ((step + 1) / 3) * 100;

  return (
    <PageShell>
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl mb-1" style={{ color: "#1C1C1A" }}>Set up your business</h1>
        <p className="text-sm mb-6" style={{ color: "#6B6B67" }}>
          A minute now, and every quote you make will be pre-filled.
        </p>

        <div className="qp-glass-strong overflow-hidden">
          <div className="h-[2px]" style={{ backgroundColor: "#E5E4E0" }}>
            <div className="h-full transition-all" style={{ width: `${progress}%`, backgroundColor: "#2B7A6F" }} />
          </div>

          {step >= 1 && (
            <Summary onEdit={() => setStep(0)} label="Business">
              {name} · {TRADES.find((t) => t.v === trade)?.l}
            </Summary>
          )}
          {step >= 2 && (
            <Summary onEdit={() => setStep(1)} label="Brand">
              <span className="inline-block w-3 h-3 rounded-full mr-2 align-middle" style={{ backgroundColor: accent }} />
              {logoUrl ? "Logo uploaded" : "No logo"} · {accent}
            </Summary>
          )}

          <div className="p-8">
            {step === 0 && (
              <div className="space-y-4">
                <label className="block">
                  <span className="text-sm" style={{ color: "#6B6B67" }}>Business name</span>
                  <input className="qp-input mt-1.5" value={name} onChange={(e) => setName(e.target.value)} placeholder="Acme HVAC" autoFocus />
                </label>
                <label className="block">
                  <span className="text-sm" style={{ color: "#6B6B67" }}>Trade</span>
                  <select className="qp-input mt-1.5" value={trade} onChange={(e) => setTrade(e.target.value as any)}>
                    {TRADES.map((t) => <option key={t.v} value={t.v}>{t.l}</option>)}
                  </select>
                </label>
                <div className="flex justify-end pt-2">
                  <button onClick={() => name.trim() && setStep(1)} disabled={!name.trim()} className="qp-btn qp-btn-primary disabled:opacity-50">Continue →</button>
                </div>
              </div>
            )}

            {step === 1 && (
              <div className="space-y-4">
                <label className="block">
                  <span className="text-sm" style={{ color: "#6B6B67" }}>Logo (optional)</span>
                  <div className="mt-1.5 flex items-center gap-3">
                    {logoUrl ? (
                      <img src={logoUrl} alt="Logo" className="w-12 h-12 object-contain rounded-md bg-white/60" style={{ border: "1px solid #E5E4E0" }} />
                    ) : (
                      <div className="w-12 h-12 rounded-md flex items-center justify-center text-xs" style={{ border: "1px dashed #E5E4E0", color: "#9b9b96" }}>—</div>
                    )}
                    <label className="qp-btn qp-btn-ghost cursor-pointer">
                      <input type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && uploadLogo(e.target.files[0])} />
                      {uploading ? "Uploading…" : logoUrl ? "Replace" : "Upload"}
                    </label>
                  </div>
                </label>
                <label className="block">
                  <span className="text-sm" style={{ color: "#6B6B67" }}>Accent color</span>
                  <div className="mt-1.5 flex items-center gap-3">
                    <input type="color" value={accent} onChange={(e) => setAccent(e.target.value)} className="w-12 h-10 rounded-md cursor-pointer" style={{ border: "1px solid #E5E4E0" }} />
                    <span className="text-sm tabular-nums" style={{ color: "#6B6B67" }}>{accent}</span>
                  </div>
                </label>
                <div className="flex justify-between pt-2">
                  <button onClick={() => setStep(0)} className="qp-btn qp-btn-ghost">← Back</button>
                  <button onClick={() => setStep(2)} className="qp-btn qp-btn-primary">Continue →</button>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4">
                <label className="block">
                  <span className="text-sm" style={{ color: "#6B6B67" }}>Default payment terms</span>
                  <textarea className="qp-input mt-1.5 !h-24 py-2" value={terms} onChange={(e) => setTerms(e.target.value)} />
                </label>
                <div className="flex items-center justify-between qp-glass p-3">
                  <div>
                    <p className="text-sm" style={{ color: "#1C1C1A" }}>Charge tax / VAT</p>
                    <p className="text-xs" style={{ color: "#6B6B67" }}>Adds a tax line to every document.</p>
                  </div>
                  <input type="checkbox" checked={taxEnabled} onChange={(e) => setTaxEnabled(e.target.checked)} className="w-5 h-5 accent-[#2B7A6F]" />
                </div>
                {taxEnabled && (
                  <label className="block">
                    <span className="text-sm" style={{ color: "#6B6B67" }}>Tax rate %</span>
                    <input type="number" min={0} max={100} step={0.1} className="qp-input mt-1.5" value={taxRate} onChange={(e) => setTaxRate(parseFloat(e.target.value) || 0)} />
                  </label>
                )}
                <label className="block">
                  <span className="text-sm" style={{ color: "#6B6B67" }}>Bank / payment details (shown on invoices, optional)</span>
                  <textarea className="qp-input mt-1.5 !h-24 py-2" value={bank} onChange={(e) => setBank(e.target.value)} placeholder={"Account name\nIBAN / Account number\nRouting / Sort code"} />
                </label>
                <div className="flex justify-between pt-2">
                  <button onClick={() => setStep(1)} className="qp-btn qp-btn-ghost">← Back</button>
                  <button onClick={finish} disabled={saving} className="qp-btn qp-btn-primary disabled:opacity-60">
                    {saving ? "Saving…" : "Finish setup"}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </PageShell>
  );
}

function Summary({ label, children, onEdit }: { label: string; children: React.ReactNode; onEdit: () => void }) {
  return (
    <div className="px-6 py-3 flex items-center justify-between text-sm" style={{ borderBottom: "1px solid #E5E4E0", backgroundColor: "rgba(255,255,255,0.35)" }}>
      <div>
        <span className="text-xs uppercase tracking-wider mr-3" style={{ color: "#6B6B67" }}>{label}</span>
        <span style={{ color: "#1C1C1A" }}>{children}</span>
      </div>
      <button onClick={onEdit} className="text-xs" style={{ color: "#2B7A6F" }}>Edit</button>
    </div>
  );
}