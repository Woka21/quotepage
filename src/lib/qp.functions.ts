import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export const getMyBusiness = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase
      .from("businesses")
      .select("*")
      .eq("user_id", context.userId)
      .maybeSingle();
    if (error) throw new Error(error.message);
    return data;
  });

const businessSchema = z.object({
  name: z.string().trim().min(1).max(200),
  trade_type: z.enum(["hvac", "plumbing", "roofing", "solar", "other"]),
  logo_url: z.string().url().nullable().optional(),
  accent_color: z.string().regex(/^#[0-9A-Fa-f]{6}$/).optional(),
  tax_enabled: z.boolean().optional(),
  tax_rate: z.number().min(0).max(100).optional(),
  default_terms: z.string().max(2000).nullable().optional(),
  bank_details: z.string().max(2000).nullable().optional(),
});

export const upsertBusiness = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) => businessSchema.parse(data))
  .handler(async ({ data, context }) => {
    const existing = await context.supabase
      .from("businesses")
      .select("id")
      .eq("user_id", context.userId)
      .maybeSingle();
    if (existing.data?.id) {
      const { data: row, error } = await context.supabase
        .from("businesses").update(data).eq("id", existing.data.id).select().single();
      if (error) throw new Error(error.message);
      return row;
    }
    const { data: row, error } = await context.supabase
      .from("businesses").insert({ ...data, user_id: context.userId }).select().single();
    if (error) throw new Error(error.message);
    return row;
  });

const lineItemSchema = z.object({
  description: z.string().trim().min(1).max(500),
  quantity: z.number().min(0).max(100000),
  unit_price: z.number().min(0).max(10000000),
});

const createQuoteSchema = z.object({
  customer: z.object({
    name: z.string().trim().min(1).max(200),
    email: z.string().email().max(255).nullable().optional().or(z.literal("")),
    phone: z.string().max(50).nullable().optional(),
    address: z.string().max(500).nullable().optional(),
  }),
  job_type: z.string().trim().min(1).max(200),
  validity_days: z.number().int().min(1).max(365),
  notes: z.string().max(4000).nullable().optional(),
  items: z.array(lineItemSchema).min(1).max(50),
  status: z.enum(["draft", "sent"]).default("draft"),
});

export const createQuote = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) => createQuoteSchema.parse(data))
  .handler(async ({ data, context }) => {
    const biz = await context.supabase
      .from("businesses").select("id").eq("user_id", context.userId).maybeSingle();
    if (biz.error) throw new Error(biz.error.message);
    if (!biz.data) throw new Error("Complete onboarding first.");
    const business_id = biz.data.id;

    const cust = await context.supabase
      .from("customers")
      .insert({
        business_id,
        name: data.customer.name,
        email: data.customer.email || null,
        phone: data.customer.phone || null,
        address: data.customer.address || null,
      })
      .select("id").single();
    if (cust.error) throw new Error(cust.error.message);

    const { data: nbr, error: nbrErr } = await context.supabase.rpc("next_quote_number", { b_id: business_id });
    if (nbrErr) throw new Error(nbrErr.message);

    const q = await context.supabase.from("quotes").insert({
      business_id,
      customer_id: cust.data.id,
      quote_number: nbr as unknown as string,
      job_type: data.job_type,
      validity_days: data.validity_days,
      notes: data.notes ?? null,
      status: data.status,
    }).select("*").single();
    if (q.error) throw new Error(q.error.message);

    const li = await context.supabase.from("line_items").insert(
      data.items.map((it) => ({
        quote_id: q.data.id,
        description: it.description,
        quantity: it.quantity,
        unit_price: it.unit_price,
      })),
    );
    if (li.error) throw new Error(li.error.message);

    return { id: q.data.id, token: q.data.token, quote_number: q.data.quote_number };
  });

export const listQuotes = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase
      .from("quotes")
      .select("id, quote_number, status, job_type, created_at, token, customer:customers(name), line_items(quantity, unit_price)")
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return (data ?? []).map((q: any) => ({
      id: q.id,
      quote_number: q.quote_number,
      status: q.status,
      job_type: q.job_type,
      created_at: q.created_at,
      token: q.token,
      customer_name: q.customer?.name ?? "—",
      total: (q.line_items ?? []).reduce(
        (sum: number, it: any) => sum + Number(it.quantity) * Number(it.unit_price), 0),
    }));
  });

export const updateQuoteStatus = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) =>
    z.object({ id: z.string().uuid(), status: z.enum(["draft", "sent", "accepted", "declined", "expired"]) }).parse(d),
  )
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase.from("quotes").update({ status: data.status }).eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });