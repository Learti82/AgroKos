"use client";

import { useState } from "react";
import { useApp } from "@/lib/store";
import { PageHeader, Card, CardHeader, Badge, EmptyState, HelpNote } from "@/components/ui/primitives";
import { SoilComparisonChart } from "@/components/charts";
import { useFarm } from "@/components/DataProvider";
import { AddSoilModal } from "@/components/AddModals";
import { soilRecommendations, SOIL_IDEALS } from "@/lib/soilAdvice";
import { fmtDateSq } from "@/lib/dates";
import { cn } from "@/lib/utils";
import { Plus, Pencil } from "lucide-react";

export default function SoilPage() {
  const { lang } = useApp();
  const { soils: SOIL_ANALYSES, fields: FIELDS } = useFarm();
  const [add, setAdd] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const sorted = [...SOIL_ANALYSES].sort((a, b) => +new Date(b.analysis_date) - +new Date(a.analysis_date));
  const [selId, setSelId] = useState(sorted[0]?.id);
  const sel = sorted.find((s) => s.id === selId) ?? sorted[0];
  const recs = sel ? soilRecommendations(sel, lang) : [];
  const compare = sel ? [
    { name: "pH", value: sel.ph, ideal: SOIL_IDEALS.ph },
    { name: "N", value: sel.nitrogen_ppm, ideal: SOIL_IDEALS.N },
    { name: "P", value: sel.phosphorus_ppm, ideal: SOIL_IDEALS.P },
    { name: "K", value: sel.potassium_ppm, ideal: SOIL_IDEALS.K },
    { name: "OM%", value: sel.organic_matter_pct, ideal: SOIL_IDEALS.OM },
  ] : [];

  return (
    <div className="space-y-5">
      <PageHeader
        title={lang === "sq" ? "Analiza e Tokës" : "Soil Analysis"}
        action={<button onClick={() => setAdd(true)} className="btn-primary"><Plus className="h-4 w-4" /> {lang === "sq" ? "Analizë e Re" : "New Analysis"}</button>}
      />

      <HelpNote>
        {lang === "sq"
          ? "Fut rezultatet e analizës së tokës nga laboratori (pH, azoti, fosfori, kaliumi) dhe AgroKos jep rekomandime automatike plehërimi për kushtet e Kosovës."
          : "Enter your lab soil-test results (pH, nitrogen, phosphorus, potassium) and AgroKos gives automatic fertilizing recommendations for Kosovo conditions."}
      </HelpNote>

      {!sel ? (
        <EmptyState icon="🧪" title={lang === "sq" ? "Asnjë analizë toke" : "No soil analyses"} hint={lang === "sq" ? "Shto rezultatet e testit tënd të parë të tokës." : "Add your first soil test results."} action={<button onClick={() => setAdd(true)} className="btn-primary"><Plus className="h-4 w-4" /> {lang === "sq" ? "Shto Analizë" : "Add Analysis"}</button>} />
      ) : (
      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-1 p-0">
          <div className="border-b border-line p-4"><h3 className="font-semibold text-brand-charcoal">{lang === "sq" ? "Analizat e mia" : "My analyses"}</h3></div>
          <div className="divide-y divide-line">
            {sorted.map((s) => {
              const f = FIELDS.find((x) => x.id === s.field_id);
              return (
                <div key={s.id} onClick={() => setSelId(s.id)} className={cn("flex w-full cursor-pointer items-center justify-between p-4 text-left transition hover:bg-zebra", selId === s.id && "bg-brand-lime/30")}>
                  <div>
                    <p className="text-sm font-semibold text-brand-charcoal">{f?.name}</p>
                    <p className="text-xs text-brand-charcoal/50">{fmtDateSq(s.analysis_date)}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <Badge>pH {s.ph}</Badge>
                    <button onClick={(e) => { e.stopPropagation(); setEditing(s); }} className="rounded-lg p-1.5 text-brand-charcoal/40 hover:text-brand-green" aria-label="Edit"><Pencil className="h-4 w-4" /></button>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        <div className="space-y-4 lg:col-span-2">
          <Card>
            <CardHeader title={lang === "sq" ? "Rezultatet" : "Results"} subtitle={`${FIELDS.find((f) => f.id === sel.field_id)?.name} · ${fmtDateSq(sel.analysis_date)}`} />
            <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
              {[["pH", sel.ph], ["N ppm", sel.nitrogen_ppm], ["P ppm", sel.phosphorus_ppm], ["K ppm", sel.potassium_ppm], ["OM %", sel.organic_matter_pct], [lang === "sq" ? "Lagësht %" : "Moist %", sel.moisture_pct]].map(([l, v]) => (
                <div key={l as string} className="rounded-lg bg-zebra p-3 text-center">
                  <p className="text-[10px] uppercase text-brand-charcoal/50">{l}</p>
                  <p className="font-display text-lg font-semibold text-brand-charcoal">{v}</p>
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <CardHeader title={lang === "sq" ? "Rekomandime" : "Recommendations"} />
            <div className="space-y-2">
              {recs.map((r, i) => (
                <div key={i} className={cn("flex items-start gap-2 rounded-lg border-l-4 p-3 text-sm", r.tone === "good" ? "border-brand-green bg-brand-green/5" : r.tone === "warning" ? "border-brand-amber bg-brand-amber/5" : "border-red-500 bg-red-50")}>
                  <span>{r.tone === "good" ? "✅" : r.tone === "warning" ? "⚠️" : "🔴"}</span>
                  <span className="text-brand-charcoal/80">{r[lang]}</span>
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <CardHeader title={lang === "sq" ? "Vlerat tuaja vs. idealet" : "Your values vs. ideal"} />
            <SoilComparisonChart data={compare} />
          </Card>
        </div>
      </div>
      )}

      <AddSoilModal key={editing?.id ?? "new"} open={add || !!editing} editing={editing ?? undefined} onClose={() => { setAdd(false); setEditing(null); }} />
    </div>
  );
}
