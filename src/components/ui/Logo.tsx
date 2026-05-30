import { cn } from "@/lib/utils";

export function Logo({ className, withWordmark = true, light = false }: {
  className?: string;
  withWordmark?: boolean;
  light?: boolean;
}) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <span className="grid h-9 w-9 place-items-center rounded-xl bg-brand-green shadow-card">
        <svg width="22" height="22" viewBox="0 0 64 64" aria-hidden>
          <path d="M32 50c0-10 6-18 16-22-2 12-8 19-16 22z" fill="#B7E4C7" />
          <path d="M32 50c0-10-6-18-16-22 2 12 8 19 16 22z" fill="#52B788" />
          <path d="M32 50V28" stroke="#F8F4EF" strokeWidth="3" strokeLinecap="round" />
        </svg>
      </span>
      {withWordmark && (
        <span className={cn("font-display text-xl font-semibold tracking-tight", light ? "text-white" : "text-brand-charcoal")}>
          Agro<span className="text-brand-green-light">Kos</span>
        </span>
      )}
    </span>
  );
}
