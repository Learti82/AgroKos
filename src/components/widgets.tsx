"use client";

import Link from "next/link";
import { useApp } from "@/lib/store";
import { wmo, type ForecastResponse } from "@/lib/weather";
import { ACTIVITY_LABELS } from "@/lib/i18n";
import { cropById, cropName } from "@/lib/data/crops";
import { MARKET_PRICES } from "@/lib/data/demo";
import { useFarm } from "@/components/DataProvider";
import type { Activity, Alert } from "@/lib/types";
import { Badge } from "@/components/ui/primitives";
import { fmtFullSq, weekdaySq, relativeSq, fmtDateSq } from "@/lib/dates";
import { cn, fmtEur } from "@/lib/utils";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

export function StatCard({ label, value, sub, color, icon }: {
  label: string;
  value: string;
  sub?: string;
  color: string;
  icon: string;
}) {
  return (
    <div className="stat-card" style={{ borderLeftColor: color }}>
      <div className="flex items-start justify-between">
        <span className="text-xl">{icon}</span>
      </div>
      <p className="mt-2 font-display text-2xl font-semibold text-brand-charcoal">{value}</p>
      <p className="text-xs font-medium text-brand-charcoal/60">{label}</p>
      {sub && <p className="mt-1 text-[11px] text-brand-charcoal/45">{sub}</p>}
    </div>
  );
}

const sevTone = { info: "info", warning: "warning", critical: "critical" } as const;

export function AlertRow({ alert }: { alert: Alert }) {
  const { lang } = useApp();
  const { fields } = useFarm();
  const field = fields.find((f) => f.id === alert.field_id);
  return (
    <Link
      href="/dashboard/alerts"
      className={cn(
        "flex gap-3 rounded-lg border-l-4 bg-white p-3 transition hover:bg-zebra",
        alert.severity === "critical" ? "border-red-500" : alert.severity === "warning" ? "border-brand-amber" : "border-brand-sky"
      )}
    >
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <Badge tone={sevTone[alert.severity]}>{alert.severity === "critical" ? "Kritik" : alert.severity === "warning" ? "Kujdes" : "Info"}</Badge>
          {field && <span className="truncate text-[11px] text-brand-charcoal/50">{field.name}</span>}
        </div>
        <p className="mt-1 truncate text-sm font-semibold text-brand-charcoal">
          {lang === "sq" ? alert.title_sq : alert.title_en}
        </p>
        <p className="line-clamp-1 text-xs text-brand-charcoal/55">
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
      <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-brand-lime/50 text-base">
        {meta.icon}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p className="text-sm font-semibold text-brand-charcoal">{lang === "sq" ? meta.sq : meta.en}</p>
          {field && <Badge>{field.name}</Badge>}
        </div>
        <p className="line-clamp-1 text-xs text-brand-charcoal/55">{a.description}</p>
        <p className="mt-0.5 text-[11px] text-brand-charcoal/45">
          {fmtFullSq(a.activity_date)} · {relativeSq(a.activity_date)}
          {a.cost_eur > 0 && ` · ${fmtEur(a.cost_eur)}`}
        </p>
      </div>
    </div>
  );
}

export function ForecastStrip({ data }: { data: ForecastResponse }) {
  return (
    <div className="grid grid-cols-7 gap-2">
      {data.daily.map((d, i) => {
        const c = wmo(d.code);
        return (
          <div key={d.date} className="flex flex-col items-center gap-1 rounded-lg border border-line bg-white p-2 text-center">
            <span className="text-[11px] font-semibold text-brand-charcoal/60">
              {i === 0 ? "Sot" : weekdaySq(d.date).replace("E ", "").slice(0, 3)}
            </span>
            <span className="text-xl">{c.icon}</span>
            <span className="text-xs font-bold text-brand-charcoal">{d.tmax}°</span>
            <span className="text-[11px] text-brand-charcoal/45">{d.tmin}°</span>
            <div className="mt-0.5 h-1 w-full overflow-hidden rounded-full bg-brand-sky/15">
              <div className="h-full bg-brand-sky" style={{ width: `${Math.min(100, d.rain * 3)}%` }} />
            </div>
          </div>
        );
      })}
    </div>
  );
}

export function MarketMini() {
  const { lang } = useApp();
  const top = [...MARKET_PRICES].sort((a, b) => Math.abs(b.pct_change_week) - Math.abs(a.pct_change_week)).slice(0, 5);
  return (
    <table className="w-full text-sm">
      <tbody>
        {top.map((m, i) => {
          const crop = cropById(m.crop_id)!;
          const Icon = m.trend === "up" ? TrendingUp : m.trend === "down" ? TrendingDown : Minus;
          const tone = m.trend === "up" ? "text-brand-green" : m.trend === "down" ? "text-red-600" : "text-brand-charcoal/40";
          return (
            <tr key={m.crop_id} className={cn(i % 2 === 1 && "bg-zebra")}>
              <td className="py-1.5 pl-2">
                <span className="mr-1.5">{crop.icon_emoji}</span>
                {cropName(crop.id, lang)}
              </td>
              <td className="py-1.5 text-right font-semibold tabular-nums">{fmtEur(m.price_eur_kg)}</td>
              <td className={cn("py-1.5 pr-2 text-right", tone)}>
                <span className="inline-flex items-center gap-0.5 tabular-nums">
                  <Icon className="h-3.5 w-3.5" />
                  {Math.abs(m.pct_change_week)}%
                </span>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
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
