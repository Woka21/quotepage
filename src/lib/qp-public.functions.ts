import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

export const getPublicQuote = createServerFn({ method: "GET" })
  .inputValidator((d: unknown) => z.object({ token: z.string().uuid() }).parse(d))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const admin = supabaseAdmin as any;
    const { data: q, error } = await admin
      .from("quotes")
      .select(
        "id, quote_number, job_type, notes, status, validity_days, created_at, accepted_at, " +
          "business:businesses(name, accent_color, logo_url, tax_enabled, tax_rate, default_terms, bank_details), " +
          "customer:customers(name, email, phone, address), " +
          "line_items(id, description, quantity, unit_price)",
      )
      .eq("token", data.token)
      .maybeSingle();
    if (error) throw new Error(error.message);
    if (!q) throw new Error("Quote not found");
    return q as any;
  });

export const acceptPublicQuote = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) =>
    z.object({ token: z.string().uuid(), decision: z.enum(["accepted", "declined"]) }).parse(d),
  )
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const admin = supabaseAdmin as any;
    const { data: cur, error: e1 } = await admin
      .from("quotes").select("id, status").eq("token", data.token).maybeSingle();
    if (e1) throw new Error(e1.message);
    if (!cur) throw new Error("Quote not found");
    if (cur.status !== "sent" && cur.status !== "draft") {
      return { ok: false as const, reason: "already_finalized", status: cur.status };
    }
    const patch: any = { status: data.decision };
    if (data.decision === "accepted") patch.accepted_at = new Date().toISOString();
    const { error } = await admin.from("quotes").update(patch).eq("id", cur.id);
    if (error) throw new Error(error.message);
    return { ok: true as const };
  });