"use client";

import { useState } from "react";
import Link from "next/link";
import { useApp } from "@/lib/store";
import { useFarm } from "@/components/DataProvider";
import { useWeather } from "@/lib/useWeather";
import { PageHeader, Card, HelpNote, EmptyState } from "@/components/ui/primitives";
import { WEATHER_GRID } from "@/lib/data/demo";
import { cropById, cropName } from "@/lib/data/crops";
import { daysAgo } from "@/lib/dates";
import { cn } from "@/lib/utils";

type Task = { id: string; title: string; why: string; priority: "high" | "med" | "low"; icon: string; href?: string };

export default function TasksPage() {
  const { lang } = useApp();
  const farm = useFarm();
  const home = WEATHER_GRID.find((m) => m.name === farm.profile.municipality) ?? WEATHER_GRID[0];
  const { data: weather } = useWeather(home.lat, home.lon);
  const [done, setDone] = useState<Record<string, boolean>>({});

  const month = new Date().getMonth() + 1;
  const tasks: Task[] = [];

  // Weather-driven
  if (weather) {
    const minTemp = Math.min(...weather.daily.slice(0, 2).map((d) => d.tmin));
    const rain7 = weather.daily.reduce((s, d) => s + d.rain, 0);
    if (minTemp < 2) tasks.push({ id: "frost", icon: "❄️", priority: "high", title: lang === "sq" ? "Mbro kulturat nga ngrica" : "Protect crops from frost", why: lang === "sq" ? `Minimumi ${minTemp}°C brenda 48 orëve.` : `Min ${minTemp}°C within 48h.`, href: "/dashboard/weather" });
    if (rain7 < 8 && farm.fields.some((f) => f.irrigation_type !== "rain-fed")) tasks.push({ id: "irrig", icon: "💧", priority: "high", title: lang === "sq" ? "Ujit fushat" : "Irrigate fields", why: lang === "sq" ? "Pak shi këtë javë." : "Little rain this week.", href: "/dashboard/irrigation" });
    const dry6h = weather.hourly.slice(0, 6).reduce((s, h) => s + h.rain, 0) < 0.5 && weather.current.wind < 15;
    if (dry6h) tasks.push({ id: "spray", icon: "💨", priority: "low", title: lang === "sq" ? "Dritare e mirë për spërkatje" : "Good spray window", why: lang === "sq" ? "Erë e ulët, pa shi për 6 orë." : "Low wind, no rain for 6h." });
  }

  // Planting-driven
  for (const p of farm.plantings.filter((x) => x.status === "active")) {
    const crop = cropById(p.crop_id);
    const field = farm.fields.find((f) => f.id === p.field_id);
    if (!crop) continue;
    const daysToHarvest = Math.round((+new Date(p.expected_harvest_date) - Date.now()) / 86_400_000);
    if (daysToHarvest >= 0 && daysToHarvest <= 14) tasks.push({ id: `harvest-${p.id}`, icon: "🌾", priority: "high", title: `${lang === "sq" ? "Përgatitu për korrje" : "Prepare to harvest"}: ${cropName(crop.id, lang)}`, why: `${field?.name ?? ""} · ${daysToHarvest} ${lang === "sq" ? "ditë" : "days"}`, href: "/dashboard/crops" });
    else if (month >= 3 && month <= 5) tasks.push({ id: `fert-${p.id}`, icon: "🧪", priority: "med", title: `${lang === "sq" ? "Plehërim pranveror" : "Spring fertilizing"}: ${cropName(crop.id, lang)}`, why: field?.name ?? "", href: "/dashboard/advisory" });
  }

  // Field inactivity
  for (const f of farm.fields) {
    const last = farm.activities.filter((a) => a.field_id === f.id).sort((a, b) => +new Date(b.activity_date) - +new Date(a.activity_date))[0];
    if (!last || daysAgo(last.activity_date) >= 14) tasks.push({ id: `scout-${f.id}`, icon: "🔍", priority: "low", title: `${lang === "sq" ? "Inspekto" : "Scout"}: ${f.name}`, why: last ? `${daysAgo(last.activity_date)} ${lang === "sq" ? "ditë pa aktivitet" : "days inactive"}` : (lang === "sq" ? "Pa aktivitete" : "No activity"), href: `/dashboard/fields/${f.id}` });
  }

  // Low stock
  for (const i of farm.inventory.filter((x) => x.quantity <= x.low_stock_threshold)) {
    tasks.push({ id: `stock-${i.id}`, icon: "📦", priority: "med", title: `${lang === "sq" ? "Rimbush" : "Restock"}: ${i.item_name}`, why: `${i.quantity} ${i.unit} ${lang === "sq" ? "mbetur" : "left"}`, href: "/dashboard/inventory" });
  }

  // Unread alerts
  for (const a of farm.alerts.filter((x) => !x.is_read)) {
    tasks.push({ id: `alert-${a.id}`, icon: a.severity === "critical" ? "⚠️" : "🔔", priority: a.severity === "critical" ? "high" : "med", title: lang === "sq" ? a.title_sq : a.title_en, why: lang === "sq" ? "Paralajmërim aktiv" : "Active alert", href: "/dashboard/alerts" });
  }

  const order = { high: 0, med: 1, low: 2 };
  tasks.sort((a, b) => order[a.priority] - order[b.priority]);
  const remaining = tasks.filter((t) => !done[t.id]).length;

  const pBadge = { high: "bg-red-100 text-red-700", med: "bg-brand-amber/15 text-[#9a6a05]", low: "bg-brand-lime/40 text-brand-green" };
  const pLabel = { high: lang === "sq" ? "Urgjent" : "Urgent", med: lang === "sq" ? "Mesatar" : "Medium", low: lang === "sq" ? "I ulët" : "Low" };

  return (
    <div className="space-y-5">
      <PageHeader title={lang === "sq" ? "Punët e Javës" : "This Week's Tasks"} subtitle={`${remaining} ${lang === "sq" ? "punë për të bërë" : "tasks to do"}`} />

      <HelpNote>
        {lang === "sq"
          ? "Listë automatike e gjeneruar nga kulturat, moti, stoku dhe paralajmërimet e tua. Shenjo punët e kryera — lista rifreskohet çdo ditë sipas kushteve."
          : "An automatic to-do list generated from your crops, weather, stock and alerts. Check off what you've done — the list refreshes daily based on conditions."}
      </HelpNote>

      {tasks.length === 0 ? (
        <EmptyState icon="✅" title={lang === "sq" ? "Asnjë punë urgjente" : "Nothing urgent"} hint={lang === "sq" ? "Gjithçka në rregull! Shto fusha e mbjellje për sugjerime më të sakta." : "All good! Add fields and plantings for sharper suggestions."} />
      ) : (
        <div className="space-y-2">
          {tasks.map((t) => {
            const isDone = !!done[t.id];
            const body = (
              <div className="flex items-center gap-3">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-zebra text-base">{t.icon}</span>
                <div className="min-w-0 flex-1">
                  <p className={cn("text-sm font-semibold text-brand-charcoal", isDone && "text-brand-charcoal/40 line-through")}>{t.title}</p>
                  <p className="text-xs text-brand-charcoal/50">{t.why}</p>
                </div>
                {!isDone && <span className={cn("badge", pBadge[t.priority])}>{pLabel[t.priority]}</span>}
              </div>
            );
            return (
              <Card key={t.id} className={cn("flex items-center gap-3 p-3 transition", isDone && "opacity-60")}>
                <input type="checkbox" checked={isDone} onChange={() => setDone((d) => ({ ...d, [t.id]: !d[t.id] }))} className="h-5 w-5 shrink-0 accent-[#2D6A4F]" />
                {t.href ? <Link href={t.href} className="min-w-0 flex-1">{body}</Link> : <div className="min-w-0 flex-1">{body}</div>}
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
