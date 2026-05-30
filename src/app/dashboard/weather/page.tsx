"use client";

import { useState } from "react";
import { useApp } from "@/lib/store";
import { PageHeader, Card, CardHeader, Badge } from "@/components/ui/primitives";
import { ForecastStrip } from "@/components/widgets";
import { HourlyWeatherChart } from "@/components/charts";
import { useWeather } from "@/lib/useWeather";
import { wmo } from "@/lib/weather";
import { computeWeatherAlerts } from "@/lib/agriWeather";
import { FIELDS, WEATHER_GRID, DEMO_PROFILE } from "@/lib/data/demo";
import { cn } from "@/lib/utils";
import { Droplets, Wind, Sun, Thermometer, MapPin } from "lucide-react";

function GridTile({ name, lat, lon }: { name: string; lat: number; lon: number }) {
  const { data } = useWeather(lat, lon);
  const c = data ? wmo(data.current.code) : null;
  return (
    <div className="flex flex-col items-center gap-1 rounded-card border border-line bg-white p-3 text-center">
      <span className="text-xs font-medium text-brand-charcoal/60">{name}</span>
      <span className="text-2xl">{c?.icon ?? "⏳"}</span>
      <span className="text-lg font-bold text-brand-charcoal">{data ? `${data.current.temp}°` : "—"}</span>
    </div>
  );
}

export default function WeatherPage() {
  const { lang } = useApp();
  const home = WEATHER_GRID.find((m) => m.name === DEMO_PROFILE.municipality) ?? WEATHER_GRID[0];
  const [fieldId, setFieldId] = useState<string>("home");
  const sel = fieldId === "home" ? home : (() => { const f = FIELDS.find((x) => x.id === fieldId)!; return { name: f.name, lat: f.latitude, lon: f.longitude }; })();
  const { data, loading } = useWeather(sel.lat, sel.lon);
  const cond = data ? wmo(data.current.code) : null;
  const alerts = data ? computeWeatherAlerts(data, lang) : [];

  return (
    <div className="space-y-5">
      <PageHeader
        title={lang === "sq" ? "Qendra e Motit" : "Weather Center"}
        subtitle="Kosovo Meteo · Open-Meteo"
        action={
          <select className="input max-w-[220px]" value={fieldId} onChange={(e) => setFieldId(e.target.value)}>
            <option value="home">📍 {home.name} ({lang === "sq" ? "shtëpi" : "home"})</option>
            {FIELDS.map((f) => <option key={f.id} value={f.id}>{f.name}</option>)}
          </select>
        }
      />

      {/* Hero current */}
      <Card className={cn("relative overflow-hidden text-white", "bg-gradient-to-br from-brand-sky to-brand-green")}>
        <div className="grain absolute inset-0 opacity-10" />
        <div className="relative flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
          <div className="flex items-center gap-4">
            <span className="animate-float text-6xl">{cond?.icon ?? "🌡️"}</span>
            <div>
              <p className="flex items-center gap-1 text-sm text-white/80"><MapPin className="h-4 w-4" /> {sel.name}</p>
              <p className="font-display text-5xl font-bold">{data ? `${data.current.temp}°C` : "—"}</p>
              <p className="text-white/85">{cond ? (lang === "sq" ? cond.sq : cond.en) : ""}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              { icon: Thermometer, l: lang === "sq" ? "Ndjehet" : "Feels", v: data ? `${data.current.feelsLike}°` : "—" },
              { icon: Droplets, l: lang === "sq" ? "Lagështia" : "Humidity", v: data ? `${data.current.humidity}%` : "—" },
              { icon: Wind, l: lang === "sq" ? "Era" : "Wind", v: data ? `${data.current.wind} km/h` : "—" },
              { icon: Sun, l: "UV", v: data ? `${data.current.uv}` : "—" },
            ].map((m) => (
              <div key={m.l} className="rounded-xl bg-white/15 p-3 text-center backdrop-blur">
                <m.icon className="mx-auto h-4 w-4 text-white/70" />
                <p className="mt-1 text-sm font-bold">{m.v}</p>
                <p className="text-[10px] text-white/70">{m.l}</p>
              </div>
            ))}
          </div>
        </div>
        {data && <Badge className="absolute right-3 top-3 bg-white/20 text-white">{data.source === "live" ? "LIVE" : "DEMO"}</Badge>}
      </Card>

      {/* Agri-weather alerts */}
      {alerts.length > 0 && (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {alerts.map((a, i) => (
            <div key={i} className={cn("card border-l-4 p-4", a.tone === "critical" ? "border-red-500" : a.tone === "warning" ? "border-brand-amber" : "border-brand-green")}>
              <p className="flex items-center gap-2 font-semibold text-brand-charcoal">{a.icon} {a.title}</p>
              <p className="mt-1 text-sm text-brand-charcoal/65">{a.message}</p>
            </div>
          ))}
        </div>
      )}

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader title={lang === "sq" ? "Parashikimi 7-ditor" : "7-day forecast"} subtitle={sel.name} />
          {data ? <ForecastStrip data={data} /> : <div className="h-24 skeleton" />}
        </Card>
        <Card>
          <CardHeader title={lang === "sq" ? "24 orët e ardhshme" : "Next 24 hours"} subtitle={lang === "sq" ? "Temperatura + shi" : "Temperature + rain"} />
          {data ? <HourlyWeatherChart data={data} /> : <div className="h-56 skeleton" />}
        </Card>
      </div>

      {/* Kosovo municipality grid */}
      <Card>
        <CardHeader title={lang === "sq" ? "Moti në Kosovë" : "Kosovo weather grid"} subtitle={lang === "sq" ? "Komunat kryesore" : "Major municipalities"} />
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 lg:grid-cols-7">
          {WEATHER_GRID.map((m) => <GridTile key={m.name} {...m} />)}
        </div>
      </Card>
    </div>
  );
}
