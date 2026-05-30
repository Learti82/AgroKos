"use client";

import { useState } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { useApp } from "@/lib/store";
import { Card, Badge, HealthDot, EmptyState } from "@/components/ui/primitives";
import { FieldMap } from "@/components/FieldMap";
import { ActivityRow } from "@/components/widgets";
import { SoilTrendChart } from "@/components/charts";
import { useFarm } from "@/components/DataProvider";
import { cropById, cropName } from "@/lib/data/crops";
import { SOIL_LABELS, IRRIGATION_LABELS } from "@/lib/i18n";
import { fmtHa, fmtNum, cn } from "@/lib/utils";
import { fmtDateSq, relativeSq, daysAgo } from "@/lib/dates";
import { ArrowLeft, Plus } from "lucide-react";

const TABS = [
  { id: "overview", sq: "Përmbledhje", en: "Overview" },
  { id: "crops", sq: "Kulturat", en: "Crops" },
  { id: "activities", sq: "Aktivitetet", en: "Activities" },
  { id: "soil", sq: "Toka", en: "Soil" },
  { id: "photos", sq: "Fotot", en: "Photos" },
];

export default function FieldDetail({ params }: { params: { id: string } }) {
  const { lang } = useApp();
  const { fields: FIELDS, activities: ACTIVITIES, plantings: PLANTINGS, soils: SOIL_ANALYSES } = useFarm();
  const [tab, setTab] = useState("overview");
  const field = FIELDS.find((f) => f.id === params.id);
  if (!field) return notFound();

  const crop = cropById(field.current_crop_id);
  const acts = ACTIVITIES.filter((a) => a.field_id === field.id).sort((a, b) => +new Date(b.activity_date) - +new Date(a.activity_date));
  const plantings = PLANTINGS.filter((p) => p.field_id === field.id);
  const soils = SOIL_ANALYSES.filter((s) => s.field_id === field.id).sort((a, b) => +new Date(a.analysis_date) - +new Date(b.analysis_date));
  const lastAct = acts[0];

  return (
    <div>
      <Link href="/dashboard/fields" className="mb-4 inline-flex items-center gap-1 text-sm text-brand-charcoal/60 hover:text-brand-green">
        <ArrowLeft className="h-4 w-4" /> {lang === "sq" ? "Fushat" : "Fields"}
      </Link>

      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <h1 className="font-display text-2xl font-semibold text-brand-charcoal">{field.name}</h1>
          <HealthDot health={field.health} />
        </div>
        <div className="flex flex-wrap gap-2">
          <Badge>{fmtHa(field.area_ha)}</Badge>
          <Badge tone="info">{field.municipality}</Badge>
          {crop && <Badge style={{ background: `${crop.color_hex}1a`, color: crop.color_hex }}>{crop.icon_emoji} {cropName(crop.id, lang)}</Badge>}
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-4 flex gap-1 overflow-x-auto no-scrollbar border-b border-line">
        {TABS.map((tb) => (
          <button
            key={tb.id}
            onClick={() => setTab(tb.id)}
            className={cn(
              "whitespace-nowrap border-b-2 px-4 py-2 text-sm font-medium transition-colors",
              tab === tb.id ? "border-brand-green text-brand-green" : "border-transparent text-brand-charcoal/50 hover:text-brand-charcoal"
            )}
          >
            {lang === "sq" ? tb.sq : tb.en}
          </button>
        ))}
      </div>

      {tab === "overview" && (
        <div className="grid gap-4 lg:grid-cols-3">
          <Card className="lg:col-span-2 p-0 overflow-hidden">
            <FieldMap fields={[field]} highlightId={field.id} className="h-80" />
          </Card>
          <div className="space-y-3">
            {[
              { l: lang === "sq" ? "Lloji i tokës" : "Soil type", v: SOIL_LABELS[field.soil_type][lang] },
              { l: lang === "sq" ? "Ujitja" : "Irrigation", v: IRRIGATION_LABELS[field.irrigation_type][lang] },
              { l: lang === "sq" ? "Fshati" : "Village", v: field.village },
              { l: lang === "sq" ? "Aktiviteti i fundit" : "Last activity", v: lastAct ? `${relativeSq(lastAct.activity_date)}` : "—" },
              { l: lang === "sq" ? "Ditë pa aktivitet" : "Days since activity", v: lastAct ? `${daysAgo(lastAct.activity_date)}` : "—" },
            ].map((row) => (
              <div key={row.l} className="card flex items-center justify-between py-3">
                <span className="text-sm text-brand-charcoal/55">{row.l}</span>
                <span className="text-sm font-semibold text-brand-charcoal">{row.v}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === "crops" && (
        <div className="space-y-3">
          {plantings.map((p) => {
            const c = cropById(p.crop_id)!;
            return (
              <Card key={p.id}>
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-brand-charcoal">{c.icon_emoji} {cropName(c.id, lang)} <span className="text-brand-charcoal/40">· {p.seed_variety}</span></h3>
                    <p className="mt-1 text-xs text-brand-charcoal/55">
                      {lang === "sq" ? "Mbjellur" : "Planted"}: {fmtDateSq(p.planting_date)} → {lang === "sq" ? "Korrje" : "Harvest"}: {fmtDateSq(p.expected_harvest_date)}
                    </p>
                    {p.notes && <p className="mt-1 text-sm text-brand-charcoal/70">{p.notes}</p>}
                  </div>
                  <Badge tone={p.status === "active" ? "good" : p.status === "harvested" ? "neutral" : "warning"}>
                    {p.status === "active" ? (lang === "sq" ? "Aktive" : "Active") : p.status === "harvested" ? (lang === "sq" ? "Korrur" : "Harvested") : p.status}
                  </Badge>
                </div>
                {p.yield_kg && <p className="mt-2 text-sm font-semibold text-brand-green">{lang === "sq" ? "Rendimenti" : "Yield"}: {fmtNum(p.yield_kg, 0)} kg</p>}
              </Card>
            );
          })}
        </div>
      )}

      {tab === "activities" && (
        <Card>
          {acts.length ? <div className="divide-y divide-line">{acts.map((a) => <ActivityRow key={a.id} a={a} />)}</div> : <EmptyState icon="📋" title={lang === "sq" ? "Asnjë aktivitet" : "No activities"} />}
        </Card>
      )}

      {tab === "soil" && (
        <div className="space-y-4">
          {soils.length > 1 && (
            <Card>
              <h3 className="mb-3 font-semibold text-brand-charcoal">{lang === "sq" ? "Trendi i tokës" : "Soil trend"}</h3>
              <SoilTrendChart data={soils} />
            </Card>
          )}
          {soils.length ? soils.slice().reverse().map((s) => (
            <Card key={s.id}>
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-brand-charcoal">{fmtDateSq(s.analysis_date)}</h3>
                <Badge>{s.lab_name}</Badge>
              </div>
              <div className="mt-3 grid grid-cols-3 gap-3 sm:grid-cols-6">
                {[["pH", s.ph], ["N", s.nitrogen_ppm], ["P", s.phosphorus_ppm], ["K", s.potassium_ppm], ["OM%", s.organic_matter_pct], [lang === "sq" ? "Lagësht%" : "Moist%", s.moisture_pct]].map(([l, v]) => (
                  <div key={l as string} className="rounded-lg bg-zebra p-2 text-center">
                    <p className="text-[10px] uppercase text-brand-charcoal/50">{l}</p>
                    <p className="font-semibold text-brand-charcoal">{v}</p>
                  </div>
                ))}
              </div>
              <p className="mt-3 text-sm text-brand-charcoal/70">💡 {s.recommendations}</p>
            </Card>
          )) : <EmptyState icon="🧪" title={lang === "sq" ? "Asnjë analizë" : "No analyses"} />}
        </div>
      )}

      {tab === "photos" && (
        <EmptyState icon="📷" title={lang === "sq" ? "Asnjë foto ende" : "No photos yet"} hint={lang === "sq" ? "Shto foto të fushës kur regjistron aktivitete." : "Add field photos when logging activities."} />
      )}

      <button className="fixed bottom-6 right-6 z-20 inline-flex items-center gap-2 rounded-full bg-brand-green px-5 py-3 font-semibold text-white shadow-card-hover hover:bg-[#245741]">
        <Plus className="h-5 w-5" /> {lang === "sq" ? "Aktivitet" : "Activity"}
      </button>
    </div>
  );
}
