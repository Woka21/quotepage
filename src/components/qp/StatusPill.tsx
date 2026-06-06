const QUOTE_STYLES: Record<string, { bg: string; fg: string; border: string; label: string }> = {
  draft:    { bg: "rgba(140,140,135,0.12)", fg: "#5a5a55", border: "rgba(140,140,135,0.2)", label: "Draft" },
  sent:     { bg: "rgba(99,140,178,0.14)",  fg: "#3d6691", border: "rgba(99,140,178,0.25)", label: "Sent" },
  accepted: { bg: "rgba(43,122,111,0.14)",  fg: "#2B7A6F", border: "rgba(43,122,111,0.28)", label: "Accepted" },
  declined: { bg: "rgba(194,127,140,0.16)", fg: "#9a4a5a", border: "rgba(194,127,140,0.28)", label: "Declined" },
  expired:  { bg: "rgba(200,80,60,0.14)",   fg: "#a83b25", border: "rgba(200,80,60,0.25)", label: "Expired" },
};
const INVOICE_STYLES: Record<string, { bg: string; fg: string; border: string; label: string }> = {
  draft:   QUOTE_STYLES.draft,
  sent:    QUOTE_STYLES.sent,
  unpaid:  { bg: "rgba(212,160,80,0.16)", fg: "#8a6420", border: "rgba(212,160,80,0.3)", label: "Unpaid" },
  overdue: { bg: "rgba(220,110,50,0.16)", fg: "#a8451a", border: "rgba(220,110,50,0.3)", label: "Overdue" },
  paid:    QUOTE_STYLES.accepted,
};

export function StatusPill({ kind, status }: { kind: "quote" | "invoice"; status: string }) {
  const map = kind === "quote" ? QUOTE_STYLES : INVOICE_STYLES;
  const s = map[status] ?? map.draft;
  return (
    <span className="qp-pill" style={{ backgroundColor: s.bg, color: s.fg, borderColor: s.border }}>
      {s.label}
    </span>
  );
}