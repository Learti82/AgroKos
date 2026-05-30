"use client";

import { useState } from "react";
import { useApp } from "@/lib/store";
import { PageHeader, Card, CardHeader, Badge } from "@/components/ui/primitives";
import { CropCalendar } from "@/components/CropCalendar";
import { CROPS, cropById, cropName } from "@/lib/data/crops";
import { PLANTINGS, FIELDS } from "@/lib/data/demo";
import { monthNameSq } from "@/lib/dates";
import { fmtEur, fmtNum, cn } from "@/lib/utils";
import { fmtDateSq } from "@/lib/dates";
import { Plus } from "lucide-react";

const WATER = { low: { sq: "I ulët", en: "Low", emoji: "💧" }, medium: { sq: "Mesatar", en: "Medium", emoji: "💧💧" }, high: { sq: "I lartë", en: "High", emoji: "💧💧💧" } };
const CATEGORY = { cereal: { sq: "Drithëra", en: "Cereal" }, vegetable: { sq: "Perime", en: "Vegetable" }, fruit: { sq: "Fruta", en: "Fruit" }, berry: { sq: "Manaferra", en: "Berry" }, dairy: { sq: "Bulmet", en: "Dairy" }, oilseed: { sq: "Vajore", en: "Oilseed" } };

export default function CropsPage() {
  const { lang } = useApp();
  const [tab, setTab] = useState<"plantings" | "library" | "calendar">("plantings");

  return (
    <div className="space-y-5">
      <PageHeader
        title={lang === "sq" ? "Kulturat" : "Crops"}
        action={<button className="btn-primary"><Plus className="h-4 w-4" /> {lang === "sq" ? "Mbjellje e Re" : "New Planting"}</button>}
      />

      <div className="flex gap-1 border-b border-line">
        {([["plantings", lang === "sq" ? "Mbjelljet e mia" : "My plantings"], ["library", lang === "sq" ? "Biblioteka" : "Library"], ["calendar", lang === "sq" ? "Kalendari" : "Calendar"]] as const).map(([id, label]) => (
          <button key={id} onClick={() => setTab(id)} className={cn("border-b-2 px-4 py-2 text-sm font-medium transition", tab === id ? "border-brand-green text-brand-green" : "border-transparent text-brand-charcoal/50 hover:text-brand-charcoal")}>{label}</button>
        ))}
      </div>

      {tab === "plantings" && (
        <Card className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="text-left text-xs uppercase text-brand-charcoal/45">
                {[lang === "sq" ? "Kultura" : "Crop", lang === "sq" ? "Fusha" : "Field", lang === "sq" ? "Varieteti" : "Variety", lang === "sq" ? "Mbjellë" : "Planted", lang === "sq" ? "Korrje" : "Harvest", "Status"].map((h) => <th key={h} className="px-4 py-2 font-medium">{h}</th>)}
              </tr></thead>
              <tbody>
                {PLANTINGS.map((p, i) => {
                  const c = cropById(p.crop_id)!;
                  const f = FIELDS.find((x) => x.id === p.field_id);
                  return (
                    <tr key={p.id} className={cn(i % 2 === 1 && "bg-zebra")}>
                      <td className="px-4 py-3 font-medium">{c.icon_emoji} {cropName(c.id, lang)}</td>
                      <td className="px-4 py-3 text-brand-charcoal/65">{f?.name}</td>
                      <td className="px-4 py-3 text-brand-charcoal/65">{p.seed_variety}</td>
                      <td className="px-4 py-3 text-brand-charcoal/55">{fmtDateSq(p.planting_date)}</td>
                      <td className="px-4 py-3 text-brand-charcoal/55">{fmtDateSq(p.expected_harvest_date)}</td>
                      <td className="px-4 py-3"><Badge tone={p.status === "active" ? "good" : p.status === "harvested" ? "neutral" : "warning"}>{p.status === "active" ? (lang === "sq" ? "Aktive" : "Active") : p.status === "harvested" ? (lang === "sq" ? "Korrur" : "Harvested") : p.status}</Badge></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {tab === "library" && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {CROPS.map((c) => (
            <Card key={c.id} className="border-l-4" style={{ borderLeftColor: c.color_hex } as React.CSSProperties}>
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-brand-charcoal">{c.icon_emoji} {cropName(c.id, lang)}</h3>
                  <p className="text-xs text-brand-charcoal/50">{CATEGORY[c.category][lang]}</p>
                </div>
                <Badge style={{ background: `${c.color_hex}1a`, color: c.color_hex }}>{fmtEur(c.market_price_eur_kg)}/kg</Badge>
              </div>
              <div className="mt-3 grid grid-cols-3 gap-2 text-center text-xs">
                <div className="rounded-lg bg-zebra p-2"><p className="text-brand-charcoal/45">{lang === "sq" ? "Sezoni" : "Season"}</p><p className="font-semibold">{monthNameSq(c.growing_season_start).slice(0, 3)}–{monthNameSq(c.growing_season_end).slice(0, 3)}</p></div>
                <div className="rounded-lg bg-zebra p-2"><p className="text-brand-charcoal/45">{lang === "sq" ? "Ujë" : "Water"}</p><p className="font-semibold">{WATER[c.water_need].emoji}</p></div>
                <div className="rounded-lg bg-zebra p-2"><p className="text-brand-charcoal/45">{lang === "sq" ? "Rendim." : "Yield"}</p><p className="font-semibold">{fmtNum(c.avg_yield_kg_ha / 1000, 1)}t</p></div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {tab === "calendar" && (
        <Card>
          <CardHeader title={lang === "sq" ? "Kalendari vjetor i kulturave" : "Yearly crop calendar"} />
          <CropCalendar />
        </Card>
      )}
    </div>
  );
}
