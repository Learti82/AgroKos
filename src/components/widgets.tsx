"use client";

import Link from "next/link";
import { useApp } from "@/lib/store";
import { wmo, type ForecastResponse } from "@/lib/weather";
import { ACTIVITY_LABELS } from "@/lib/i18n";
import { cropById, cropName, CROPS, referencePrice } from "@/lib/data/crops";
import { useFarm } from "@/components/DataProvider";
import type { Activity, Alert } from "@/lib/types";
import { Badge } from "@/components/ui/primitives";
import { fmtFullSq, weekdaySq, relativeSq } from "@/lib/dates";
import { cn, fmtEur } from "@/lib/utils";

export function StatCard({ label, value, sub, color, icon: Icon }: {
  label: string;
  value: string;
  sub?: string;
  color: string;
  icon: React.ElementType;
}) {
  return (
    <div className="card p-5 transition-shadow duration-200 hover:shadow-card-hover">
      <div
        className="mb-3.5 grid h-10 w-10 place-items-center rounded-xl"
        style={{ background: `${color}18` }}
      >
        <Icon className="h-5 w-5" style={{ color }} />
      </div>
      <p className="font-display text-2xl font-semibold leading-none text-brand-charcoal">
        {value}
      </p>
      <p className="mt-1.5 text-xs font-medium text-brand-charcoal/60">{label}</p>
      {sub && <p className="mt-0.5 text-[11px] text-brand-charcoal/40">{sub}</p>}
    </div>
  );
}

const sevTone = { info: "info", warning: "warning", critical: "critical" } as const;

export function AlertRow({ alert }: { alert: Alert }) {
  const { lang } = useApp();
  const { fields } = useFarm();
  const field = fields.find((f) => f.id === alert.field_id);
  const borderColor =
    alert.severity === "critical"
      ? "border-l-red-500"
      : alert.severity === "warning"
      ? "border-l-brand-amber"
      : "border-l-brand-sky";

  return (
    <Link
      href="/dashboard/alerts"
      className={cn(
        "flex cursor-pointer gap-3 rounded-lg border border-line border-l-4 bg-white p-3 transition-shadow duration-150 hover:shadow-card-hover",
        borderColor
      )}
    >
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <Badge tone={sevTone[alert.severity]}>
            {alert.severity === "critical" ? "Kritik" : alert.severity === "warning" ? "Kujdes" : "Info"}
          </Badge>
          {field && (
            <span className="truncate text-[11px] text-brand-charcoal/45">{field.name}</span>
          )}
        </div>
        <p className="mt-1.5 truncate text-sm font-semibold text-brand-charcoal">
          {lang === "sq" ? alert.title_sq : alert.title_en}
        </p>
        <p className="line-clamp-1 text-xs text-brand-charcoal/50">
          {lang === "sq" ? alert.message_sq : alert.message_en}
        </p>
      </div>
    </Link>
  );
}

export function ActivityRow({ a }: { a: Activity }) {
  const { lang } = useApp();
  const { fields } = useFarm();
  const field = fields.find((f) => f.id === a.field_id);
  const meta = ACTIVITY_LABELS[a.activity_type];
  return (
    <div className="flex gap-3 py-3">
      <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-brand-lime/50 text-base">
        {meta.icon}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p className="text-sm font-semibold text-brand-charcoal">
            {lang === "sq" ? meta.sq : meta.en}
          </p>
          {field && <Badge>{field.name}</Badge>}
        </div>
        <p className="line-clamp-1 text-xs text-brand-charcoal/50">{a.description}</p>
        <p className="mt-0.5 text-[11px] text-brand-charcoal/40">
          {fmtFullSq(a.activity_date)} · {relativeSq(a.activity_date)}
          {a.cost_eur > 0 && ` · ${fmtEur(a.cost_eur)}`}
        </p>
      </div>
    </div>
  );
}

export function ForecastStrip({ data }: { data: ForecastResponse }) {
  return (
    <div className="grid grid-cols-7 gap-1.5">
      {data.daily.map((d, i) => {
        const c = wmo(d.code);
        return (
          <div
            key={d.date}
            className={cn(
              "flex flex-col items-center gap-1 rounded-xl border p-2 text-center",
              i === 0
                ? "border-brand-green/30 bg-brand-lime/20"
                : "border-line bg-white"
            )}
          >
            <span className="text-[10px] font-semibold uppercase tracking-wide text-brand-charcoal/55">
              {i === 0 ? "Sot" : weekdaySq(d.date).replace("E ", "").slice(0, 3)}
            </span>
            <span className="text-lg leading-none">{c.icon}</span>
            <span className="text-xs font-bold text-brand-charcoal">{d.tmax}°</span>
            <span className="text-[10px] text-brand-charcoal/40">{d.tmin}°</span>
            <div className="mt-0.5 h-1 w-full overflow-hidden rounded-full bg-brand-sky/15">
              <div
                className="h-full rounded-full bg-brand-sky"
                style={{ width: `${Math.min(100, d.rain * 3)}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

export function MarketMini() {
  const { lang } = useApp();
  const { prices } = useFarm();
  const realIds = Object.keys(prices);
  const ids = (realIds.length ? realIds : CROPS.slice(0, 5).map((c) => c.id)).slice(0, 5);
  return (
    <div className="space-y-1.5">
      {ids.map((id) => {
        const crop = cropById(id);
        if (!crop) return null;
        const real = prices[id];
        const price = real ? real.price : referencePrice(id);
        return (
          <div
            key={id}
            className="flex items-center justify-between rounded-lg px-2.5 py-2 transition-colors hover:bg-zebra"
          >
            <div className="flex items-center gap-2">
              <span className="text-base leading-none">{crop.icon_emoji}</span>
              <span className="text-sm text-brand-charcoal">{cropName(crop.id, lang)}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className={cn("text-sm font-semibold tabular-nums", !real && "text-brand-charcoal/40")}>
                {fmtEur(price)}
              </span>
              {real ? (
                <span className="rounded-full bg-brand-green/10 px-1.5 py-0.5 text-[10px] font-medium text-brand-green">
                  {lang === "sq" ? "reale" : "real"}
                </span>
              ) : (
                <span className="text-[10px] text-brand-charcoal/30">ref.</span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export function Sparkline({ data, color = "#2D6A4F", w = 80, h = 24 }: {
  data: number[];
  color?: string;
  w?: number;
  h?: number;
}) {
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const pts = data
    .map((v, i) => `${(i / (data.length - 1)) * w},${h - ((v - min) / range) * h}`)
    .join(" ");
  return (
    <svg width={w} height={h} className="overflow-visible">
      <polyline points={pts} fill="none" stroke={color} strokeWidth={1.5} strokeLinejoin="round" />
    </svg>
  );
}
