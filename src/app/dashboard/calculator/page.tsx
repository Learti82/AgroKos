"use client";

import { useState } from "react";
import { useApp } from "@/lib/store";
import { useFarm } from "@/components/DataProvider";
import { PageHeader, Card, HelpNote } from "@/components/ui/primitives";
import { CROPS, cropName } from "@/lib/data/crops";
import { calcFertilizer } from "@/lib/fertilizer";
import { fmtEur, fmtNum } from "@/lib/utils";
import { fmtDateSq } from "@/lib/dates";

export default function CalculatorPage() {
  const { lang } = useApp();
  const farm = useFarm();
  const [crop, setCrop] = useState("wheat");
  const [area, setArea] = useState("1");
  const [fieldId, setFieldId] = useState("");

  const soil = fieldId
    ? farm.soils.filter((s) => s.field_id === fieldId).sort((a, b) => +new Date(b.analysis_date) - +new Date(a.analysis_date))[0]
    : undefined;

  const areaNum = Math.max(0, Number(area) || 0);
  const results = areaNum > 0 ? calcFertilizer(crop, areaNum, soil) : [];
  const total = results.reduce((s, r) => s + r.cost, 0);

  const tone: Record<string, string> = { N: "#2D6A4F", P: "#E9A319", K: "#1A759F" };

  return (
    <div className="space-y-5">
      <PageHeader title={lang === "sq" ? "Llogaritësi i Plehrave" : "Fertilizer Calculator"} subtitle={lang === "sq" ? "Sa pleh të blesh dhe sa kushton" : "How much fertilizer to buy and what it costs"} />

      <HelpNote>
        {lang === "sq"
          ? "Llogarit sasinë e saktë të plehrave (N-P-K) për kulturën dhe sipërfaqen tënde, që të mos shpenzosh tepër. Zgjedh një fushë me analizë toke për rekomandim më të saktë — dozat ulen kur toka është tashmë e pasur."
          : "Calculates the exact fertilizer (N-P-K) needed for your crop and area, so you don't over-spend. Pick a field with a soil test for a sharper result — doses drop when the soil is already rich."}
      </HelpNote>

      <Card>
        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <label className="label">{lang === "sq" ? "Kultura" : "Crop"}</label>
            <select className="input" value={crop} onChange={(e) => setCrop(e.target.value)}>
              {CROPS.map((c) => <option key={c.id} value={c.id}>{c.icon_emoji} {cropName(c.id, lang)}</option>)}
            </select>
          </div>
          <div>
            <label className="label">{lang === "sq" ? "Sipërfaqja (ha)" : "Area (ha)"}</label>
            <input type="number" step="any" min="0" className="input" value={area} onChange={(e) => setArea(e.target.value)} />
          </div>
          <div>
            <label className="label">{lang === "sq" ? "Analizë toke (opsionale)" : "Soil test (optional)"}</label>
            <select className="input" value={fieldId} onChange={(e) => setFieldId(e.target.value)}>
              <option value="">{lang === "sq" ? "Pa analizë" : "No soil test"}</option>
              {farm.fields.filter((f) => farm.soils.some((s) => s.field_id === f.id)).map((f) => <option key={f.id} value={f.id}>{f.name}</option>)}
            </select>
          </div>
        </div>
        {soil && <p className="mt-2 text-xs text-brand-charcoal/55">{lang === "sq" ? "Bazuar në analizën" : "Based on analysis"}: pH {soil.ph}, N {soil.nitrogen_ppm}, P {soil.phosphorus_ppm}, K {soil.potassium_ppm} · {fmtDateSq(soil.analysis_date)}</p>}
      </Card>

      {results.length > 0 && (
        <>
          <div className="grid gap-4 sm:grid-cols-3">
            {results.map((r) => (
              <div key={r.nutrient} className="stat-card" style={{ borderLeftColor: tone[r.nutrient] }}>
                <p className="text-xs font-semibold uppercase text-brand-charcoal/55">{r.label}</p>
                <p className="mt-1 font-display text-2xl font-semibold text-brand-charcoal">{fmtNum(r.productKg, 0)} kg</p>
                <p className="text-sm text-brand-charcoal/60">{r.product}</p>
                <p className="mt-2 text-xs text-brand-charcoal/45">{fmtNum(r.nutrientKg, 0)} kg {lang === "sq" ? "lëndë aktive" : "active nutrient"} · {fmtEur(r.cost, 0)}</p>
              </div>
            ))}
          </div>

          <Card className="flex items-center justify-between bg-brand-lime/20">
            <span className="font-semibold text-brand-charcoal">{lang === "sq" ? "Kosto totale e plehrave" : "Total fertilizer cost"}</span>
            <span className="font-display text-2xl font-bold text-brand-green">{fmtEur(total, 0)}</span>
          </Card>

          <p className="text-center text-[11px] text-brand-charcoal/40">{lang === "sq" ? "⚠️ Vlerësim orientues — përshtate sipas analizës së plotë të tokës dhe agronomit." : "⚠️ Guidance estimate — adjust to a full soil test and agronomist advice."}</p>
        </>
      )}
    </div>
  );
}
