"use client";

import { useState } from "react";
import Link from "next/link";
import { useApp } from "@/lib/store";
import { PageHeader, Card, Badge, HealthDot } from "@/components/ui/primitives";
import { FieldMap } from "@/components/FieldMap";
import { useFarm } from "@/components/DataProvider";
import { cropById, cropName } from "@/lib/data/crops";
import { SOIL_LABELS, IRRIGATION_LABELS } from "@/lib/i18n";
import { fmtHa } from "@/lib/utils";
import { relativeSq } from "@/lib/dates";
import { Map, LayoutGrid, Plus, ArrowRight } from "lucide-react";

export default function FieldsPage() {
  const { lang } = useApp();
  const { fields: FIELDS, activities: ACTIVITIES } = useFarm();
  const [view, setView] = useState<"grid" | "map">("grid");
  const lastActivity = (fid: string) =>
    ACTIVITIES.filter((a) => a.field_id === fid).sort((a, b) => +new Date(b.activity_date) - +new Date(a.activity_date))[0];

  return (
    <div>
      <PageHeader
        title={lang === "sq" ? "Fushat e Mia" : "My Fields"}
        subtitle={`${FIELDS.length} ${lang === "sq" ? "fusha · " : "fields · "}${fmtHa(FIELDS.reduce((s, f) => s + f.area_ha, 0))}`}
        action={
          <div className="flex items-center gap-2">
            <div className="inline-flex rounded-lg border border-line bg-white p-0.5">
              <button onClick={() => setView("grid")} className={`grid h-8 w-8 place-items-center rounded-md ${view === "grid" ? "bg-brand-green text-white" : "text-brand-charcoal/50"}`}><LayoutGrid className="h-4 w-4" /></button>
              <button onClick={() => setView("map")} className={`grid h-8 w-8 place-items-center rounded-md ${view === "map" ? "bg-brand-green text-white" : "text-brand-charcoal/50"}`}><Map className="h-4 w-4" /></button>
            </div>
            <button className="btn-primary"><Plus className="h-4 w-4" /> {lang === "sq" ? "Fushë e Re" : "New Field"}</button>
          </div>
        }
      />

      {view === "map" ? (
        <Card>
          <FieldMap fields={FIELDS} className="h-[28rem]" />
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {FIELDS.map((f) => {
            const crop = cropById(f.current_crop_id);
            const last = lastActivity(f.id);
            return (
              <Link key={f.id} href={`/dashboard/fields/${f.id}`} className="card overflow-hidden p-0 transition hover:shadow-card-hover">
                <FieldMap fields={[f]} highlightId={f.id} showLabels={false} className="h-32 rounded-b-none" />
                <div className="p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-brand-charcoal">{f.name}</h3>
                      <p className="text-xs text-brand-charcoal/55">{fmtHa(f.area_ha)} · {f.village}</p>
                    </div>
                    <HealthDot health={f.health} />
                  </div>
                  <div className="mt-3 flex flex-wrap items-center gap-1.5">
                    {crop && <Badge className="border" style={{ background: `${crop.color_hex}1a`, color: crop.color_hex }}>{crop.icon_emoji} {cropName(crop.id, lang)}</Badge>}
                    <Badge>{SOIL_LABELS[f.soil_type][lang]}</Badge>
                    <Badge tone="info">{IRRIGATION_LABELS[f.irrigation_type][lang]}</Badge>
                  </div>
                  <div className="mt-3 flex items-center justify-between border-t border-line pt-3 text-xs text-brand-charcoal/50">
                    <span>{last ? `${lang === "sq" ? "Aktiviteti i fundit" : "Last activity"}: ${relativeSq(last.activity_date)}` : "—"}</span>
                    <span className="inline-flex items-center gap-1 font-semibold text-brand-green">{lang === "sq" ? "Hap" : "Open"} <ArrowRight className="h-3 w-3" /></span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
