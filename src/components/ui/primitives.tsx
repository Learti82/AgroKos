import { Info } from "lucide-react";
import { cn } from "@/lib/utils";

export function Card({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("card p-5", className)} {...props}>
      {children}
    </div>
  );
}

export function CardHeader({ title, subtitle, action }: {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  action?: React.ReactNode;
}) {
  return (
    <div className="mb-4 flex items-start justify-between gap-3">
      <div>
        <h3 className="text-sm font-semibold text-brand-charcoal">{title}</h3>
        {subtitle && <p className="mt-0.5 text-xs text-brand-charcoal/50">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

const sevStyle: Record<string, string> = {
  info: "bg-brand-sky/10 text-brand-sky",
  warning: "bg-brand-amber/15 text-[#9a6a05]",
  critical: "bg-red-100 text-red-700",
  good: "bg-brand-green/10 text-brand-green",
  up: "bg-brand-green/10 text-brand-green",
  down: "bg-red-100 text-red-700",
  stable: "bg-black/5 text-brand-charcoal/60",
  neutral: "bg-brand-lime/40 text-brand-green",
};

export function Badge({ tone = "neutral", children, className, style }: {
  tone?: keyof typeof sevStyle;
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <span
      className={cn("badge", sevStyle[tone] ?? sevStyle.neutral, className)}
      style={style}
    >
      {children}
    </span>
  );
}

export function HealthDot({ health }: { health: "good" | "warning" | "critical" }) {
  const c =
    health === "good"
      ? "bg-brand-green-light"
      : health === "warning"
      ? "bg-brand-amber"
      : "bg-red-500";
  return <span className={cn("inline-block h-2.5 w-2.5 rounded-full", c)} />;
}

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn("skeleton h-4 w-full", className)} />;
}

export function EmptyState({ title, hint, icon = "🌱", action }: {
  title: string;
  hint?: string;
  icon?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-card border border-dashed border-line bg-white/50 px-6 py-12 text-center">
      <div className="mb-3 grid h-14 w-14 place-items-center rounded-2xl bg-brand-lime/50 text-2xl">
        {icon}
      </div>
      <p className="font-semibold text-brand-charcoal">{title}</p>
      {hint && <p className="mt-1 max-w-sm text-sm text-brand-charcoal/50">{hint}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

export function HelpNote({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-5 flex items-start gap-2.5 rounded-card border border-brand-sky/20 bg-brand-sky/5 p-3.5 text-sm text-brand-charcoal/65">
      <Info className="mt-0.5 h-4 w-4 shrink-0 text-brand-sky" />
      <p>{children}</p>
    </div>
  );
}

export function PageHeader({ title, subtitle, action }: {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="font-display text-2xl font-semibold text-brand-charcoal">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-brand-charcoal/50">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}
