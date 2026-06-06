import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { getMyBusiness, upsertBusiness } from "@/lib/qp.functions";
import { PageShell } from "@/components/qp/PageShell";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/settings")({
  head: () => ({ meta: [{ title: "Settings — QuotePage" }] }),
  component: Settings,
});

function Settings() {
  const qc = useQueryClient();
  const getBiz = useServerFn(getMyBusiness);
  const save = useServerFn(upsertBusiness);
  const biz = useQuery({ queryKey: ["business"], queryFn: () => getBiz() });

  const [name, setName] = useState("");
  const [accent, setAccent] = useState("#2B7A6F");
  const [terms, setTerms] = useState("");
  const [bank, setBank] = useState("");
  const [taxEnabled, setTaxEnabled] = useState(false);
  const [taxRate, setTaxRate] = useState(0);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (biz.data) {
      setName(biz.data.name);
      setAccent(biz.data.accent_color);
      setTerms(biz.data.default_terms ?? "");
      setBank(biz.data.bank_details ?? "");
      setTaxEnabled(biz.data.tax_enabled);
      setTaxRate(Number(biz.data.tax_rate));
    }
  }, [biz.data]);

  async function onSave() {
    if (!biz.data) return;
    setSaving(true);
    try {
      await save({
        data: {
          name,
          trade_type: biz.data.trade_type,
          logo_url: biz.data.logo_url,
          accent_color: accent,
          default_terms: terms,
          bank_details: bank,
          tax_enabled: taxEnabled,
          tax_rate: taxRate,
        },
      });
      await qc.invalidateQueries({ queryKey: ["business"] });
      toast.success("Saved");
    } catch (e: any) {
      toast.error(e?.message ?? "Could not save");
    } finally {
      setSaving(false);
    }
  }

  return (
    <PageShell>
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl mb-6" style={{ color: "#1C1C1A" }}>Settings</h1>
        <div className="qp-glass-strong p-8 space-y-4">
          <label className="block">
            <span className="text-sm" style={{ color: "#6B6B67" }}>Business name</span>
            <input className="qp-input mt-1.5" value={name} onChange={(e) => setName(e.target.value)} />
          </label>
          <label className="block">
            <span className="text-sm" style={{ color: "#6B6B67" }}>Accent color</span>
            <div className="mt-1.5 flex items-center gap-3">
              <input type="color" value={accent} onChange={(e) => setAccent(e.target.value)} className="w-12 h-10 rounded-md" style={{ border: "1px solid #E5E4E0" }} />
              <span className="text-sm" style={{ color: "#6B6B67" }}>{accent}</span>
            </div>
          </label>
          <label className="block">
            <span className="text-sm" style={{ color: "#6B6B67" }}>Default terms</span>
            <textarea className="qp-input mt-1.5 !h-28 py-2" value={terms} onChange={(e) => setTerms(e.target.value)} />
          </label>
          <label className="block">
            <span className="text-sm" style={{ color: "#6B6B67" }}>Bank / payment details</span>
            <textarea className="qp-input mt-1.5 !h-28 py-2" value={bank} onChange={(e) => setBank(e.target.value)} />
          </label>
          <div className="flex items-center justify-between qp-glass p-3">
            <div>
              <p className="text-sm" style={{ color: "#1C1C1A" }}>Charge tax / VAT</p>
            </div>
            <input type="checkbox" checked={taxEnabled} onChange={(e) => setTaxEnabled(e.target.checked)} className="w-5 h-5 accent-[#2B7A6F]" />
          </div>
          {taxEnabled && (
            <label className="block">
              <span className="text-sm" style={{ color: "#6B6B67" }}>Tax rate %</span>
              <input type="number" min={0} max={100} step={0.1} className="qp-input mt-1.5" value={taxRate} onChange={(e) => setTaxRate(parseFloat(e.target.value) || 0)} />
            </label>
          )}
          <div className="flex justify-end pt-2">
            <button onClick={onSave} disabled={saving} className="qp-btn qp-btn-primary disabled:opacity-60">{saving ? "Saving…" : "Save changes"}</button>
          </div>
        </div>
      </div>
    </PageShell>
  );
}