import { Link } from "@tanstack/react-router";

export function Logo({ to = "/" as const, className = "" }: { to?: string; className?: string }) {
  return (
    <Link to={to as any} className={`inline-flex items-baseline text-[1.05rem] tracking-tight ${className}`}>
      <span style={{ fontWeight: 400, color: "#1C1C1A" }}>Quote</span>
      <span style={{ fontWeight: 500, color: "#1C1C1A" }}>Page</span>
    </Link>
  );
}