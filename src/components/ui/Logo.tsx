import { cn } from "@/lib/utils";

/** AgroKos brand mark — a leaf inside a hexagon (matches the official logo). */
export function LogoMark({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg viewBox="0 0 100 100" className={className} style={style} aria-hidden role="img">
      {/* hexagon outline (pointy top/bottom) */}
      <polygon
        points="50,5 88,27 88,73 50,95 12,73 12,27"
        fill="none"
        stroke="#A9D4B8"
        strokeWidth="2.2"
        strokeLinejoin="round"
      />
      {/* inner rounded square */}
      <rect x="27" y="23" width="46" height="54" rx="9" fill="#E7F2EB" />
      {/* leaf body */}
      <path
        d="M50 30 C60 40 66 50 64 62 C62 70 56 74 50 76 C44 74 38 70 36 62 C34 50 40 40 50 30 Z"
        fill="#3E8B5F"
      />
      {/* veins */}
      <g stroke="#CDEBD6" strokeWidth="1.6" strokeLinecap="round" fill="none">
        <path d="M50 34 L50 73" />
        <path d="M50 47 L42 41 M50 47 L58 41" />
        <path d="M50 57 L41 52 M50 57 L59 52" />
        <path d="M50 65 L44 61 M50 65 L56 61" />
      </g>
    </svg>
  );
}

export function Logo({
  className,
  withWordmark = true,
  light = false,
  tagline = false,
  size = 36,
}: {
  className?: string;
  withWordmark?: boolean;
  light?: boolean;
  tagline?: boolean;
  size?: number;
}) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <LogoMark className="shrink-0" style={{ width: size, height: size } as React.CSSProperties} />
      {withWordmark && (
        <span className="flex flex-col leading-none">
          <span className={cn("font-display text-xl font-bold tracking-tight", light ? "text-white" : "text-brand-charcoal")}>
            Agro<span className="text-brand-green">Kos</span>
          </span>
          {tagline && (
            <span className={cn("mt-1 text-[9px] font-medium uppercase tracking-[0.25em]", light ? "text-brand-lime" : "text-brand-green-light")}>
              Bujqësia Dixhitale
            </span>
          )}
        </span>
      )}
    </span>
  );
}
