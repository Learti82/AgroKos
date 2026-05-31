"use client";

import { useApp } from "@/lib/store";
import { useFarm } from "@/components/DataProvider";
import { PageHeader, Card, CardHeader, Badge, EmptyState, HelpNote } from "@/components/ui/primitives";
import { cropById, cropName } from "@/lib/data/crops";
import { MARKET_PRICES } from "@/lib/data/demo";
import { fmtEur, fmtNum, fmtHa, cn } from "@/lib/utils";
import { fmtDateSq, monthNameSq } from "@/lib/dates";

export default function HarvestPage() {
  const { lang } = useApp();
  const farm = useFarm();
  const priceOf = (id: string) => farm.prices[id]?.price ?? MARKET_PRICES.find((m) => m.crop_id === id)?.price_eur_kg ?? cropById(id)?.market_price_eur_kg ?? 0;

  const rows = farm.plantings
    .filter((p) => p.status === "active")
    .map((p) => {
      const crop = cropById(p.crop_id)!;
      const field = farm.fields.find((f) => f.id === p.field_id);
      const area = field?.area_ha ?? 0;
      const forecastKg = crop.avg_yield_kg_ha * area;
      const days = Math.round((+new Date(p.expected_harvest_date) - Date.now()) / 86_400_000);
      return { p, crop, field, area, forecastKg, revenue: forecastKg * priceOf(p.crop_id), days, perHa: crop.avg_yield_kg_ha };
    })
    .sort((a, b) => a.days - b.days);

  const totalKg = rows.reduce((s, r) => s + r.forecastKg, 0);
  const totalRev = rows.reduce((s, r) => s + r.revenue, 0);

  // Past harvests for benchmarking (yield per ha vs crop average).
  const past = farm.plantings.filter((p) => p.status === "harvested" && p.yield_kg);

  return (
    <div className="space-y-5">
      <PageHeader title={lang === "sq" ? "Parashikimi i Korrjes" : "Harvest Forecast"} subtitle={lang === "sq" ? "Sa pritet të korrësh dhe kur" : "Expected harvest volume & timing"} />

      <HelpNote>
        {lang === "sq"
          ? "Parashikon rendimentin dhe të ardhurat e mbjelljeve aktive (sipërfaqe × rendiment mesatar × çmim tregu), të renditura sipas datës së korrjes. Te “Krahasimi”, rendimenti yt i kaluar krahasohet me mesataren e Kosovës."
          : "Forecasts yield and revenue for active plantings (area × average yield × market price), sorted by harvest date. “Benchmark” compares your past yields to the Kosovo average."}
      </HelpNote>

      {rows.length === 0 ? (
        <EmptyState icon="🌾" title={lang === "sq" ? "Pa mbjellje aktive" : "No active plantings"} hint={lang === "sq" ? "Shto mbjellje për të parë parashikimin e korrjes." : "Add plantings to see the harvest forecast."} />
      ) : (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="stat-card" style={{ borderLeftColor: "#E9A319" }}>
              <p className="font-display text-2xl font-semibold text-brand-charcoal">{fmtNum(totalKg / 1000, 1)} t</p>
              <p className="text-xs text-brand-charcoal/55">{lang === "sq" ? "Rendiment total i parashikuar" : "Total forecast yield"}</p>
            </div>
            <div className="stat-card" style={{ borderLeftColor: "#2D6A4F" }}>
              <p className="font-display text-2xl font-semibold text-brand-green">{fmtEur(totalRev, 0)}</p>
              <p className="text-xs text-brand-charcoal/55">{lang === "sq" ? "Të ardhura të parashikuara" : "Forecast revenue"}</p>
            </div>
          </div>

          <Card className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead><tr className="text-left text-xs uppercase text-brand-charcoal/45">
                  {[lang === "sq" ? "Kultura" : "Crop", lang === "sq" ? "Fusha" : "Field", lang === "sq" ? "Korrje" : "Harvest", lang === "sq" ? "Afati" : "In", lang === "sq" ? "Rendimenti" : "Yield", lang === "sq" ? "Të ardhura" : "Revenue"].map((h) => <th key={h} className="px-4 py-2 font-medium">{h}</th>)}
                </tr></thead>
                <tbody>
                  {rows.map((r, i) => (
                    <tr key={r.p.id} className={cn(i % 2 === 1 && "bg-zebra")}>
                      <td className="px-4 py-3 font-medium">{r.crop.icon_emoji} {cropName(r.crop.id, lang)}</td>
                      <td className="px-4 py-3 text-brand-charcoal/65">{r.field?.name ?? "—"} {r.field && <span className="text-brand-charcoal/35">· {fmtHa(r.area)}</span>}</td>
                      <td className="px-4 py-3 text-brand-charcoal/55">{fmtDateSq(r.p.expected_harvest_date)}</td>
                      <td className="px-4 py-3"><Badge tone={r.days <= 14 ? "warning" : "neutral"}>{r.days < 0 ? (lang === "sq" ? "Vonuar" : "Overdue") : `${r.days} ${lang === "sq" ? "ditë" : "d"}`}</Badge></td>
                      <td className="px-4 py-3 tabular-nums">{fmtNum(r.forecastKg, 0)} kg</td>
                      <td className="px-4 py-3 tabular-nums font-semibold text-brand-green">{fmtEur(r.revenue, 0)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          {past.length > 0 && (
            <Card>
              <CardHeader title={lang === "sq" ? "Krahasimi i rendimentit (vs mesatarja e Kosovës)" : "Yield benchmark (vs Kosovo average)"} />
              <div className="space-y-3">
                {past.map((p) => {
                  const crop = cropById(p.crop_id)!;
                  const field = farm.fields.find((f) => f.id === p.field_id);
                  const area = field?.area_ha ?? 1;
                  const yourPerHa = (p.yield_kg ?? 0) / Math.max(area, 0.01);
                  const ratio = yourPerHa / crop.avg_yield_kg_ha;
                  return (
                    <div key={p.id}>
                      <div className="mb-1 flex justify-between text-sm">
                        <span className="font-medium">{crop.icon_emoji} {cropName(crop.id, lang)} <span className="text-brand-charcoal/45">· {field?.name}</span></span>
                        <span className={cn("font-semibold", ratio >= 1 ? "text-brand-green" : "text-brand-amber")}>{fmtNum(ratio * 100, 0)}%</span>
                      </div>
                      <div className="h-2 overflow-hidden rounded-full bg-zebra">
                        <div className="h-full rounded-full" style={{ width: `${Math.min(150, ratio * 100) / 1.5}%`, background: ratio >= 1 ? "#52B788" : "#E9A319" }} />
                      </div>
                      <p className="mt-0.5 text-[11px] text-brand-charcoal/45">{fmtNum(yourPerHa, 0)} kg/ha {lang === "sq" ? "kundrejt mesatares" : "vs avg"} {fmtNum(crop.avg_yield_kg_ha, 0)} kg/ha</p>
                    </div>
                  );
                })}
              </div>
            </Card>
          )}
        </>
      )}
    </div>
  );
}
