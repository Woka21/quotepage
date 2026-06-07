import { useEffect, useRef, type ReactNode } from "react";

export function ScrollReveal({
  children,
  delay = 0,
  className = "",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      el.classList.add("is-visible");
      return;
    }
    // Fallback in case IO never fires (e.g. measurement edge cases)
    const fallback = window.setTimeout(() => el.classList.add("is-visible"), 600);
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            window.clearTimeout(fallback);
            setTimeout(() => el.classList.add("is-visible"), delay);
            io.unobserve(el);
          }
        });
      },
      { threshold: 0.01, rootMargin: "0px 0px -10% 0px" },
    );
    io.observe(el);
    return () => {
      window.clearTimeout(fallback);
      io.disconnect();
    };
  }, [delay]);
  return (
    <div ref={ref} className={`qp-reveal ${className}`}>
      {children}
    </div>
  );
}