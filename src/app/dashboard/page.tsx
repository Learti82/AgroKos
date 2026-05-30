"use client";

import Link from "next/link";
import { useApp } from "@/lib/store";
import { t } from "@/lib/i18n";
import { Card, CardHeader, EmptyState, Badge } from "@/components/ui/primitives";
import { StatCard, AlertRow, ActivityRow, ForecastStrip, MarketMini } from "@/components/widgets";
import { CropCalendar } from "@/components/CropCalendar";
import { FieldMap } from "@/components/FieldMap";
import { useWeather } from "@/lib/useWeather";
import {
  totalArea, activeCropsCount, activitiesThisWeek, estimatedRevenue,
} from "@/lib/metrics";
import {
  FIELDS, ACTIVITIES, ALERTS, INVENTORY, DEMO_PROFILE, WEATHER_GRID,
} from "@/lib/data/demo";
import { fmtHa, fmtEur, fmtNum } from "@/lib/utils";

export default function DashboardPage() {
  const { lang } = useApp();
  const home = WEATHER_GRID.find((m) => m.name === DEMO_PROFILE.municipality) ?? WEATHER_GRID[0];
  const { data: weather } = useWeather(home.lat, home.lon);

  const alerts = [...ALERTS].sort((a, b) => +new Date(b.triggered_at) - +new Date(a.triggered_at)).slice(0, 4);
  const recentActs = [...ACTIVITIES].sort((a, b) => +new Date(b.activity_date) - +new Date(a.activity_date)).slice(0, 6);
  const lowStock = INVENTORY.filter((i) => i.quantity <= i.low_stock_threshold);

  const hour = new Date().getHours();
  const greet = hour < 12 ? "greeting_morning" : hour < 18 ? "greeting_day" : "greeting_evening";

  return (
    <div className="space-y-5">
      <div>
        <h1 className="font-display text-2xl font-semibold text-brand-charcoal">
          {t(greet, lang)}, {DEMO_PROFILE.full_name.split(" ")[0]} 🌿
        </h1>
        <p className="text-sm text-brand-charcoal/55">
          {DEMO_PROFILE.village}, {DEMO_PROFILE.municipality} ·{" "}
          {lang === "sq" ? "Ja gjendja e fermës sot" : "Here's your farm today"}
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard icon="🗺️" color="#2D6A4F" label={t("total_area", lang)} value={fmtHa(totalArea())} sub={`${FIELDS.length} ${lang === "sq" ? "fusha" : "fields"}`} />
        <StatCard icon="🌾" color="#E9A319" label={t("active_crops", lang)} value={String(activeCropsCount())} sub={lang === "sq" ? "mbjellje aktive" : "active plantings"} />
        <StatCard icon="📋" color="#1A759F" label={t("activities_week", lang)} value={String(activitiesThisWeek())} sub={lang === "sq" ? "7 ditët e fundit" : "last 7 days"} />
        <StatCard icon="💶" color="#52B788" label={t("est_revenue", lang)} value={fmtEur(estimatedRevenue(), 0)} sub={lang === "sq" ? "ky sezon" : "this season"} />
      </div>

      {/* Row 2: map + calendar */}
      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader title={t("field_overview", lang)} action={<Link href="/dashboard/fields" className="text-xs font-semibold text-brand-green hover:underline">{t("view", lang)} →</Link>} />
          <FieldMap fields={FIELDS} className="h-56" />
        </Card>
        <Card>
          <CardHeader title={t("crop_calendar", lang)} subtitle={lang === "sq" ? "Mbjellje → korrje" : "Planting → harvest"} />
          <CropCalendar />
        </Card>
      </div>

      {/* Row 3: alerts + weather + market */}
      <div className="grid gap-4 lg:grid-cols-3">
        <Card>
          <CardHeader title={t("recent_alerts", lang)} action={<Link href="/dashboard/alerts" className="text-xs font-semibold text-brand-green hover:underline">{t("view", lang)} →</Link>} />
          {alerts.length ? (
            <div className="space-y-2">{alerts.map((a) => <AlertRow key={a.id} alert={a} />)}</div>
          ) : (
            <p className="py-6 text-center text-sm text-brand-charcoal/55">{t("no_alerts", lang)}</p>
          )}
        </Card>

        <Card>
          <CardHeader title={t("forecast_7day", lang)} subtitle={home.name} action={weather && <Badge tone={weather.source === "live" ? "good" : "neutral"}>{weather.source === "live" ? "LIVE" : "DEMO"}</Badge>} />
          {weather ? <ForecastStrip data={weather} /> : <div className="h-24 skeleton" />}
        </Card>

        <Card>
          <CardHeader title={t("top_prices", lang)} action={<Link href="/dashboard/market" className="text-xs font-semibold text-brand-green hover:underline">{t("view", lang)} →</Link>} />
          <MarketMini />
        </Card>
      </div>

      {/* Row 4: activity feed + low stock */}
      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader title={t("activity_feed", lang)} action={<Link href="/dashboard/activities" className="text-xs font-semibold text-brand-green hover:underline">{t("view", lang)} →</Link>} />
          <div className="divide-y divide-line">
            {recentActs.map((a) => <ActivityRow key={a.id} a={a} />)}
          </div>
        </Card>

        <Card>
          <CardHeader title={t("low_stock", lang)} action={<Link href="/dashboard/inventory" className="text-xs font-semibold text-brand-green hover:underline">{t("view", lang)} →</Link>} />
          {lowStock.length ? (
            <div className="space-y-2">
              {lowStock.map((i) => (
                <div key={i.id} className="flex items-center justify-between rounded-lg border border-brand-amber/30 bg-brand-amber/5 p-2.5">
                  <span className="text-sm font-medium text-brand-charcoal">{i.item_name}</span>
                  <Badge tone="warning">{fmtNum(i.quantity, 0)} {i.unit}</Badge>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState icon="📦" title={lang === "sq" ? "Stoku në rregull" : "Stock is fine"} />
          )}
        </Card>
      </div>
    </div>
  );
}
