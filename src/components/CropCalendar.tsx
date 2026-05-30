"use client";

import { useApp } from "@/lib/store";
import { useFarm } from "@/components/DataProvider";
import { cropById, cropName } from "@/lib/data/crops";
import { monthShortSq } from "@/lib/dates";

// Horizontal 12-month timeline with planting→harvest bars per active planting.
export function CropCalendar() {
  const { lang } = useApp();
  const { fields: FIELDS, plantings } = useFarm();
  const rows = plantings.filter((p) => p.status === "active" || p.status === "harvested").slice(0, 6);

  const monthOf = (iso: string) => {
    const d = new Date(iso);
    return d.getMonth() + d.getDate() / 31; // fractional
  };

  return (
    <div className="overflow-x-auto no-scrollbar">
      <div className="min-w-[640px]">
        <div className="ml-28 grid grid-cols-12 border-b border-line pb-1">
          {Array.from({ length: 12 }, (_, i) => (
            <div key={i} className="text-center text-[10px] font-medium text-brand-charcoal/45">
              {monthShortSq(i + 1)}
            </div>
          ))}
        </div>
        <div className="space-y-2 pt-2">
          {rows.map((p) => {
            const crop = cropById(p.crop_id)!;
            const field = FIELDS.find((f) => f.id === p.field_id)!;
            let start = monthOf(p.planting_date);
            let end = monthOf(p.expected_harvest_date);
            // clamp to current year window 0..12
            start = Math.max(0, Math.min(11.9, start));
            end = Math.max(start + 0.4, Math.min(12, end < start ? 12 : end));
            const left = (start / 12) * 100;
            const width = ((end - start) / 12) * 100;
            return (
              <div key={p.id} className="flex items-center gap-2">
                <div className="w-28 shrink-0 truncate text-xs font-medium text-brand-charcoal/70">
                  {crop.icon_emoji} {field.name}
                </div>
                <div className="relative h-6 flex-1 rounded bg-zebra">
                  <div
                    className="absolute top-0 flex h-6 items-center justify-center rounded px-2 text-[10px] font-semibold text-white"
                    style={{ left: `${left}%`, width: `${width}%`, background: crop.color_hex }}
                    title={`${cropName(crop.id, lang)} · ${field.name}`}
                  >
                    <span className="truncate">{cropName(crop.id, lang)}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
