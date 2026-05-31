"use client";

import { useApp } from "@/lib/store";
import { useFarm } from "@/components/DataProvider";
import { PageHeader, Card, CardHeader, Badge, HelpNote } from "@/components/ui/primitives";
import { CashFlowChart } from "@/components/charts";
import { cropById, cropName } from "@/lib/data/crops";
import { MARKET_PRICES } from "@/lib/data/demo";
import { fmtEur, cn } from "@/lib/utils";
import { monthShortSq, monthNameSq, fmtDateSq } from "@/lib/dates";

export default function CashflowPage() {
  const { lang } = useApp();
  const farm = useFarm();
  const priceOf = (id: string) => farm.prices[id]?.price ?? MARKET_PRICES.find((m) => m.crop_id === id)?.price_eur_kg ?? cropById(id)?.market_price_eur_kg ?? 0;

  // Build a 9-month window: 3 past → 6 future, keyed by year-month.
  const now = new Date();
  const months: { key: string; date: Date; income: number; cost: number }[] = [];
  for (let i = -3; i <= 5; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() + i, 1);
    months.push({ key: `${d.getFullYear()}-${d.getMonth()}`, date: d, income: 0, cost: 0 });
  }
  const bucket = (d: string) => { const dt = new Date(d); return months.find((m) => m.key === `${dt.getFullYear()}-${dt.getMonth()}`); };

  // Costs from logged activities
  for (const a of farm.activities) { const b = bucket(a.activity_date); if (b) b.cost += a.cost_eur; }
  // Income from expected/actual harvests
  const upcoming: { id: string; label: string; date: string; amount: number }[] = [];
  for (const p of farm.plantings) {
    if (p.status !== "active" && p.status !== "harvested") continue;
    const crop = cropById(p.crop_id);
    const field = farm.fields.find((f) => f.id === p.field_id);
    if (!crop || !field) continue;
    const date = p.actual_harvest_date ?? p.expected_harvest_date;
    const kg = p.yield_kg ?? crop.avg_yield_kg_ha * field.area_ha;
    const amount = kg * priceOf(p.crop_id);
    const b = bucket(date);
    if (b) b.income += amount;
    if (new Date(date) >= now) upcoming.push({ id: p.id, label: `${cropName(crop.id, lang)} · ${field.name}`, date, amount });
  }

  const chartData = months.map((m) => ({ name: monthShortSq(m.date.getMonth() + 1), income: Math.round(m.income), cost: Math.round(m.cost) }));
  const netTotal = months.reduce((s, m) => s + m.income - m.cost, 0);
  upcoming.sort((a, b) => +new Date(a.date) - +new Date(b.date));

  return (
    <div className="space-y-5">
      <PageHeader title={lang === "sq" ? "Kalendari i Parave" : "Cash-flow Calendar"} subtitle={lang === "sq" ? "Të ardhura vs. kosto, muaj pas muaji" : "Income vs. cost, month by month"} />

      <HelpNote>
        {lang === "sq"
          ? "Tregon kostot e regjistruara dhe të ardhurat e pritura (nga korrjet) për çdo muaj — që ta dish kur do të kesh para dhe kur do të shpenzosh. Të ardhurat janë vlerësim sipas rendimentit dhe çmimit të tregut."
          : "Shows your logged costs and expected income (from harvests) per month — so you know when money comes in and goes out. Income is estimated from yield and market price."}
      </HelpNote>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="stat-card" style={{ borderLeftColor: "#52B788" }}>
          <p className="font-display text-2xl font-semibold text-brand-charcoal">{fmtEur(months.reduce((s, m) => s + m.income, 0), 0)}</p>
          <p className="text-xs text-brand-charcoal/55">{lang === "sq" ? "Të ardhura (9 muaj)" : "Income (9 mo)"}</p>
        </div>
        <div className="stat-card" style={{ borderLeftColor: "#E9A319" }}>
          <p className="font-display text-2xl font-semibold text-brand-charcoal">{fmtEur(months.reduce((s, m) => s + m.cost, 0), 0)}</p>
          <p className="text-xs text-brand-charcoal/55">{lang === "sq" ? "Kosto (9 muaj)" : "Cost (9 mo)"}</p>
        </div>
        <div className="stat-card" style={{ borderLeftColor: netTotal >= 0 ? "#2D6A4F" : "#ef4444" }}>
          <p className={cn("font-display text-2xl font-semibold", netTotal >= 0 ? "text-brand-green" : "text-red-600")}>{fmtEur(netTotal, 0)}</p>
          <p className="text-xs text-brand-charcoal/55">{lang === "sq" ? "Bilanci neto" : "Net balance"}</p>
        </div>
      </div>

      <Card>
        <CardHeader title={lang === "sq" ? "Rrjedha mujore" : "Monthly flow"} />
        <CashFlowChart data={chartData} />
      </Card>

      <Card>
        <CardHeader title={lang === "sq" ? "Të ardhura të pritura" : "Expected income"} />
        {upcoming.length ? (
          <div className="divide-y divide-line">
            {upcoming.map((u) => (
              <div key={u.id} className="flex items-center justify-between py-2.5">
                <div>
                  <p className="text-sm font-medium text-brand-charcoal">{u.label}</p>
                  <p className="text-xs text-brand-charcoal/50">{fmtDateSq(u.date)}</p>
                </div>
                <Badge tone="good">{fmtEur(u.amount, 0)}</Badge>
              </div>
            ))}
          </div>
        ) : <p className="py-4 text-center text-sm text-brand-charcoal/55">{lang === "sq" ? "Asnjë korrje e pritur. Shto mbjellje." : "No upcoming harvests. Add plantings."}</p>}
      </Card>
    </div>
  );
}
