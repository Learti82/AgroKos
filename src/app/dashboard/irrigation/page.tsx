"use client";

import { useApp } from "@/lib/store";
import { PageHeader, Card, CardHeader, Badge } from "@/components/ui/primitives";
import { useWeather } from "@/lib/useWeather";
import { FIELDS } from "@/lib/data/demo";
import { cropById, cropName } from "@/lib/data/crops";
import { IRRIGATION_LABELS } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { Droplets } from "lucide-react";

const WATER_NEED = { low: 1, medium: 2, high: 3 };

function FieldIrrigation({ fieldId }: { fieldId: string }) {
  const { lang } = useApp();
  const f = FIELDS.find((x) => x.id === fieldId)!;
  const { data } = useWeather(f.latitude, f.longitude);
  const crop = cropById(f.current_crop_id);
  const rain7 = data ? data.daily.reduce((s, d) => s + d.rain, 0) : 0;
  const need = crop ? WATER_NEED[crop.water_need] : 2;
  // recommend if low rain & not rain-fed-only & medium/high need
  const recommend = rain7 < 10 && need >= 2 && f.irrigation_type !== "rain-fed";
  const moisture = Math.max(15, Math.min(60, 45 - need * 6 + rain7));

  return (
    <Card className={cn("border-l-4", recommend ? "border-brand-sky" : "border-brand-green")}>
      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-semibold text-brand-charcoal">{f.name}</h3>
          <p className="text-xs text-brand-charcoal/50">{crop && `${crop.icon_emoji} ${cropName(crop.id, lang)} · `}{IRRIGATION_LABELS[f.irrigation_type][lang]}</p>
        </div>
        {recommend ? <Badge tone="info">💧 {lang === "sq" ? "Ujit sot" : "Irrigate today"}</Badge> : <Badge tone="good">✓ {lang === "sq" ? "Mjaftueshëm" : "Sufficient"}</Badge>}
      </div>
      <div className="mt-4 space-y-3">
        <Bar label={lang === "sq" ? "Lagështia e tokës" : "Soil moisture"} value={moisture} max={60} unit="%" color="#1A759F" />
        <Bar label={lang === "sq" ? "Shi (7 ditë)" : "Rain (7 days)"} value={Math.round(rain7)} max={50} unit="mm" color="#52B788" />
        <div className="flex items-center justify-between text-sm">
          <span className="text-brand-charcoal/55">{lang === "sq" ? "Nevoja për ujë" : "Water need"}</span>
          <span className="font-semibold">{"💧".repeat(need)}</span>
        </div>
      </div>
    </Card>
  );
}

function Bar({ label, value, max, unit, color }: { label: string; value: number; max: number; unit: string; color: string }) {
  return (
    <div>
      <div className="mb-1 flex justify-between text-xs"><span className="text-brand-charcoal/55">{label}</span><span className="font-semibold tabular-nums">{value}{unit}</span></div>
      <div className="h-2 overflow-hidden rounded-full bg-zebra"><div className="h-full rounded-full" style={{ width: `${Math.min(100, (value / max) * 100)}%`, background: color }} /></div>
    </div>
  );
}

export default function IrrigationPage() {
  const { lang } = useApp();
  return (
    <div className="space-y-5">
      <PageHeader title={lang === "sq" ? "Ujitja" : "Irrigation"} subtitle={lang === "sq" ? "Rekomandime sipas motit & kulturës" : "Recommendations by weather & crop"} />
      <Card className="flex items-center gap-3 bg-brand-sky/5">
        <Droplets className="h-8 w-8 text-brand-sky" />
        <p className="text-sm text-brand-charcoal/70">{lang === "sq" ? "Rekomandimet bazohen në shiun e parashikuar 7-ditor dhe nevojën për ujë të kulturës. Ujitni herët në mëngjes për efikasitet maksimal." : "Recommendations use the 7-day rain forecast and crop water needs. Irrigate early morning for maximum efficiency."}</p>
      </Card>
      <div className="grid gap-4 lg:grid-cols-3">
        {FIELDS.map((f) => <FieldIrrigation key={f.id} fieldId={f.id} />)}
      </div>
    </div>
  );
}
