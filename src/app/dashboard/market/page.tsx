"use client";

import { useState } from "react";
import { useApp } from "@/lib/store";
import { PageHeader, Card, CardHeader, Badge } from "@/components/ui/primitives";
import { Sparkline } from "@/components/widgets";
import { PriceHistoryChart } from "@/components/charts";
import { MARKET_PRICES } from "@/lib/data/demo";
import { cropById, cropName, CROPS } from "@/lib/data/crops";
import { fmtEur, cn } from "@/lib/utils";
import { fmtDateSq } from "@/lib/dates";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

const LOCATIONS = ["Prishtinë", "Prizren", "Pejë", "Mesatare kombëtare"];

export default function MarketPage() {
  const { lang } = useApp();
  const [loc, setLoc] = useState(LOCATIONS[0]);
  const [selected, setSelected] = useState(MARKET_PRICES[4].crop_id); // tomato

  const sel = MARKET_PRICES.find((m) => m.crop_id === selected)!;
  const selCrop = cropById(selected)!;
  const avg6 = sel.history.slice(-6).reduce((s, h) => s + h.price, 0) / 6;
  const goodToSell = sel.price_eur_kg >= avg6;

  return (
    <div className="space-y-5">
      <PageHeader
        title={lang === "sq" ? "Çmimet e Tregut" : "Market Prices"}
        subtitle={`${lang === "sq" ? "Përditësuar" : "Updated"}: ${fmtDateSq(MARKET_PRICES[0].price_date)}`}
        action={
          <select className="input max-w-[220px]" value={loc} onChange={(e) => setLoc(e.target.value)}>
            {LOCATIONS.map((l) => <option key={l}>{l}</option>)}
          </select>
        }
      />

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2 p-0">
          <div className="border-b border-line p-4">
            <h3 className="font-semibold text-brand-charcoal">{lang === "sq" ? "Çmimet aktuale" : "Current prices"} · {loc}</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs uppercase text-brand-charcoal/45">
                  <th className="px-4 py-2 font-medium">{lang === "sq" ? "Kultura" : "Crop"}</th>
                  <th className="px-4 py-2 text-right font-medium">€/kg</th>
                  <th className="px-4 py-2 text-right font-medium">{lang === "sq" ? "Java" : "Week"}</th>
                  <th className="px-4 py-2 text-right font-medium">12 {lang === "sq" ? "muaj" : "mo"}</th>
                </tr>
              </thead>
              <tbody>
                {MARKET_PRICES.map((m, i) => {
                  const crop = cropById(m.crop_id)!;
                  const Icon = m.trend === "up" ? TrendingUp : m.trend === "down" ? TrendingDown : Minus;
                  const tone = m.trend === "up" ? "text-brand-green" : m.trend === "down" ? "text-red-600" : "text-brand-charcoal/40";
                  return (
                    <tr key={m.crop_id} onClick={() => setSelected(m.crop_id)} className={cn("cursor-pointer transition hover:bg-brand-lime/20", i % 2 === 1 && "bg-zebra", selected === m.crop_id && "bg-brand-lime/30")}>
                      <td className="px-4 py-2.5 font-medium">{crop.icon_emoji} {cropName(crop.id, lang)}</td>
                      <td className="px-4 py-2.5 text-right font-semibold tabular-nums">{fmtEur(m.price_eur_kg)}</td>
                      <td className={cn("px-4 py-2.5 text-right tabular-nums", tone)}>
                        <span className="inline-flex items-center gap-0.5"><Icon className="h-3.5 w-3.5" />{Math.abs(m.pct_change_week)}%</span>
                      </td>
                      <td className="px-4 py-2.5"><div className="flex justify-end"><Sparkline data={m.history.map((h) => h.price)} color={crop.color_hex} /></div></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>

        <div className="space-y-4">
          {/* Sell advisor */}
          <Card className={cn("border-l-4", goodToSell ? "border-brand-green" : "border-brand-amber")}>
            <CardHeader title={lang === "sq" ? "Këshilltari i Shitjes" : "Sell Advisor"} subtitle={cropName(selCrop.id, lang)} />
            <p className="font-display text-3xl font-bold text-brand-charcoal">{fmtEur(sel.price_eur_kg)}<span className="text-base font-normal text-brand-charcoal/50">/kg</span></p>
            <p className="mt-1 text-xs text-brand-charcoal/55">{lang === "sq" ? "Mesatarja 6-mujore" : "6-month avg"}: {fmtEur(avg6)}</p>
            <div className="mt-3">
              {goodToSell ? (
                <Badge tone="good">✅ {lang === "sq" ? "Koha e mirë për shitje" : "Good time to sell"}</Badge>
              ) : (
                <Badge tone="warning">⏳ {lang === "sq" ? "Prit 2-3 javë" : "Wait 2-3 weeks"}</Badge>
              )}
            </div>
          </Card>
        </div>
      </div>

      <Card>
        <CardHeader
          title={`${lang === "sq" ? "Historiku 12-mujor" : "12-month history"} · ${selCrop.icon_emoji} ${cropName(selCrop.id, lang)}`}
          action={
            <select className="input max-w-[180px]" value={selected} onChange={(e) => setSelected(e.target.value)}>
              {CROPS.map((c) => <option key={c.id} value={c.id}>{cropName(c.id, lang)}</option>)}
            </select>
          }
        />
        <PriceHistoryChart history={sel.history} color={selCrop.color_hex} />
      </Card>
    </div>
  );
}
