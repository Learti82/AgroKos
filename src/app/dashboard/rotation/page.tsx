"use client";

import { useApp } from "@/lib/store";
import { useFarm } from "@/components/DataProvider";
import { PageHeader, Card, Badge, EmptyState, HelpNote } from "@/components/ui/primitives";
import { CROP_FAMILY, ROTATION_NEXT } from "@/lib/data/programs";
import { cropById, cropName } from "@/lib/data/crops";

const FAMILY_LABEL: Record<string, { sq: string; en: string }> = {
  solanaceae: { sq: "Patëllxhanore (domate, spec, patate)", en: "Solanaceae" },
  cereal: { sq: "Drithëra", en: "Cereals" },
  brassica: { sq: "Lakërore", en: "Brassica" },
  allium: { sq: "Qepore", en: "Allium" },
  cucurbit: { sq: "Kungullore", en: "Cucurbit" },
  oilseed: { sq: "Vajore", en: "Oilseed" },
  umbellifer: { sq: "Karotore", en: "Umbellifer" },
};

export default function RotationPage() {
  const { lang } = useApp();
  const farm = useFarm();

  const perField = farm.fields.map((f) => {
    const history = farm.plantings
      .filter((p) => p.field_id === f.id)
      .sort((a, b) => +new Date(b.planting_date) - +new Date(a.planting_date));
    const last = history[0];
    const family = last ? CROP_FAMILY[last.crop_id] : null;
    const rule = family ? ROTATION_NEXT[family] : null;
    return { f, history: history.slice(0, 3), last, family, rule };
  });

  return (
    <div className="space-y-5">
      <PageHeader title={lang === "sq" ? "Planifikuesi i Qarkullimit" : "Crop Rotation Planner"} subtitle={lang === "sq" ? "Çfarë të mbjellësh më pas, fushë për fushë" : "What to plant next, per field"} />

      <HelpNote>
        {lang === "sq"
          ? "Qarkullimi i kulturave parandalon sëmundjet e tokës dhe ruan pjellorinë. Bazuar në kulturat e fundit në secilën fushë, AgroKos sugjeron çfarë të mbjellësh më pas dhe çfarë të shmangësh."
          : "Crop rotation prevents soil diseases and keeps soil fertile. Based on each field's recent crops, AgroKos suggests what to plant next and what to avoid."}
      </HelpNote>

      {farm.fields.length === 0 ? (
        <EmptyState icon="🔄" title={lang === "sq" ? "Pa fusha" : "No fields"} hint={lang === "sq" ? "Shto fusha dhe mbjellje për të marrë sugjerime qarkullimi." : "Add fields and plantings to get rotation suggestions."} />
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          {perField.map(({ f, history, last, family, rule }) => (
            <Card key={f.id}>
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-brand-charcoal">{f.name}</h3>
                  <p className="text-xs text-brand-charcoal/50">
                    {last ? `${lang === "sq" ? "E fundit" : "Last"}: ${cropById(last.crop_id)?.icon_emoji} ${cropName(last.crop_id, lang)}` : (lang === "sq" ? "Pa histori mbjelljesh" : "No planting history")}
                  </p>
                </div>
                {family && <Badge>{FAMILY_LABEL[family]?.[lang] ?? family}</Badge>}
              </div>

              {history.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {history.map((h) => <Badge key={h.id} tone="neutral">{cropById(h.crop_id)?.icon_emoji} {cropName(h.crop_id, lang)}</Badge>)}
                </div>
              )}

              {rule ? (
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-card border-l-4 border-brand-green bg-brand-green/5 p-3">
                    <p className="text-xs font-semibold uppercase text-brand-green">✅ {lang === "sq" ? "Mbill më pas" : "Plant next"}</p>
                    <div className="mt-2 flex flex-wrap gap-1.5">{rule.good.map((id) => <Badge key={id} tone="good">{cropById(id)?.icon_emoji} {cropName(id, lang)}</Badge>)}</div>
                  </div>
                  <div className="rounded-card border-l-4 border-red-400 bg-red-50 p-3">
                    <p className="text-xs font-semibold uppercase text-red-600">⛔ {lang === "sq" ? "Shmang" : "Avoid"}</p>
                    <div className="mt-2 flex flex-wrap gap-1.5">{rule.avoid.map((id) => <Badge key={id} tone="critical">{cropById(id)?.icon_emoji} {cropName(id, lang)}</Badge>)}</div>
                  </div>
                  <p className="sm:col-span-2 text-sm text-brand-charcoal/70">💡 {rule.reason}</p>
                </div>
              ) : (
                <p className="mt-3 text-sm text-brand-charcoal/55">{lang === "sq" ? "Regjistro një mbjellje në këtë fushë për sugjerime qarkullimi." : "Record a planting on this field for rotation suggestions."}</p>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
