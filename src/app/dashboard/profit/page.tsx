"use client";

import { useApp } from "@/lib/store";
import { useFarm } from "@/components/DataProvider";
import { PageHeader, Card, CardHeader, Badge, EmptyState, HelpNote } from "@/components/ui/primitives";
import { SpendBarChart } from "@/components/charts";
import { cropById, cropName, referencePrice } from "@/lib/data/crops";
import { fmtEur, fmtNum, fmtHa, cn } from "@/lib/utils";

export default function ProfitPage() {
  const { lang } = useApp();
  const farm = useFarm();

  const priceOf = (cropId: string) =>
    farm.prices[cropId]?.price ?? referencePrice(cropId);

  const rows = farm.plantings
    .filter((p) => p.status === "active" || p.status === "harvested")
    .map((p) => {
      const crop = cropById(p.crop_id)!;
      const field = farm.fields.find((f) => f.id === p.field_id);
      const area = field?.area_ha ?? 0;
      const yieldKg = p.yield_kg ?? crop.avg_yield_kg_ha * area;
      const price = priceOf(p.crop_id);
      const revenue = yieldKg * price;
      const costs = farm.activities.filter((a) => a.field_id === p.field_id).reduce((s, a) => s + a.cost_eur, 0);
      const profit = revenue - costs;
      const breakEven = yieldKg > 0 ? costs / yieldKg : 0;
      return { p, crop, field, area, yieldKg, price, revenue, costs, profit, breakEven };
    });

  const totalRevenue = rows.reduce((s, r) => s + r.revenue, 0);
  const totalCosts = rows.reduce((s, r) => s + r.costs, 0);
  const totalProfit = totalRevenue - totalCosts;

  const byCrop = Object.values(
    rows.reduce<Record<string, { name: string; value: number; color: string }>>((m, r) => {
      const k = r.crop.id;
      m[k] = m[k] || { name: cropName(k, lang), value: 0, color: r.crop.color_hex };
      m[k].value += Math.round(r.profit);
      return m;
    }, {})
  );

  return (
    <div className="space-y-5">
      <PageHeader title={lang === "sq" ? "Fitimi & Humbja" : "Profit & Loss"} subtitle={lang === "sq" ? "Të ardhura vs. kosto për kulturë" : "Revenue vs. cost per crop"} />

      <HelpNote>
        {lang === "sq"
          ? "Llogaritet automatikisht nga mbjelljet, çmimet e tregut dhe kostot e aktiviteteve që ke regjistruar. Të ardhurat janë vlerësim (rendimenti × çmimi); regjistro më shumë aktivitete për kosto më të sakta. “Çmimi i barazpeshës” është çmimi minimal për të mbuluar kostot."
          : "Calculated automatically from your plantings, market prices and logged activity costs. Revenue is an estimate (yield × price); log more activities for accurate costs. “Break-even price” is the minimum price to cover costs."}
      </HelpNote>

      {rows.length === 0 ? (
        <EmptyState icon="💶" title={lang === "sq" ? "Pa të dhëna fitimi ende" : "No profit data yet"} hint={lang === "sq" ? "Shto mbjellje dhe regjistro aktivitete për të parë fitimin." : "Add plantings and log activities to see profit."} />
      ) : (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="stat-card" style={{ borderLeftColor: "#52B788" }}>
              <p className="font-display text-2xl font-semibold text-brand-charcoal">{fmtEur(totalRevenue, 0)}</p>
              <p className="text-xs text-brand-charcoal/55">{lang === "sq" ? "Të ardhura të vlerësuara" : "Estimated revenue"}</p>
            </div>
            <div className="stat-card" style={{ borderLeftColor: "#E9A319" }}>
              <p className="font-display text-2xl font-semibold text-brand-charcoal">{fmtEur(totalCosts, 0)}</p>
              <p className="text-xs text-brand-charcoal/55">{lang === "sq" ? "Kosto totale (regjistruar)" : "Total cost (logged)"}</p>
            </div>
            <div className="stat-card" style={{ borderLeftColor: totalProfit >= 0 ? "#2D6A4F" : "#ef4444" }}>
              <p className={cn("font-display text-2xl font-semibold", totalProfit >= 0 ? "text-brand-green" : "text-red-600")}>{fmtEur(totalProfit, 0)}</p>
              <p className="text-xs text-brand-charcoal/55">{lang === "sq" ? "Fitimi neto i vlerësuar" : "Estimated net profit"}</p>
            </div>
          </div>

          <Card className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-xs uppercase text-brand-charcoal/45">
                    {[lang === "sq" ? "Kultura" : "Crop", lang === "sq" ? "Fusha" : "Field", lang === "sq" ? "Rendimenti" : "Yield", lang === "sq" ? "Çmimi" : "Price", lang === "sq" ? "Të ardhura" : "Revenue", lang === "sq" ? "Kosto" : "Cost", lang === "sq" ? "Fitimi" : "Profit", lang === "sq" ? "Barazpesha" : "Break-even"].map((h) => <th key={h} className="px-4 py-2 font-medium">{h}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {rows.map((r, i) => (
                    <tr key={r.p.id} className={cn(i % 2 === 1 && "bg-zebra")}>
                      <td className="px-4 py-3 font-medium">{r.crop.icon_emoji} {cropName(r.crop.id, lang)}</td>
                      <td className="px-4 py-3 text-brand-charcoal/65">{r.field?.name ?? "—"} <span className="text-brand-charcoal/35">{r.field ? `· ${fmtHa(r.area)}` : ""}</span></td>
                      <td className="px-4 py-3 tabular-nums text-brand-charcoal/65">{fmtNum(r.yieldKg, 0)} kg</td>
                      <td className="px-4 py-3 tabular-nums text-brand-charcoal/65">{fmtEur(r.price)}</td>
                      <td className="px-4 py-3 tabular-nums">{fmtEur(r.revenue, 0)}</td>
                      <td className="px-4 py-3 tabular-nums text-brand-charcoal/65">{fmtEur(r.costs, 0)}</td>
                      <td className="px-4 py-3 tabular-nums font-semibold"><span className={r.profit >= 0 ? "text-brand-green" : "text-red-600"}>{fmtEur(r.profit, 0)}</span></td>
                      <td className="px-4 py-3"><Badge tone={r.price >= r.breakEven ? "good" : "warning"}>{fmtEur(r.breakEven)}/kg</Badge></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          {byCrop.length > 0 && (
            <Card>
              <CardHeader title={lang === "sq" ? "Fitimi sipas kulturës" : "Profit by crop"} />
              <SpendBarChart data={byCrop} />
            </Card>
          )}
        </>
      )}
    </div>
  );
}
