import { cropById } from "@/lib/data/crops";
import { daysAgo } from "@/lib/dates";
import type { FarmData } from "@/lib/data/farm";

export function farmHealthScore(d: FarmData): number {
  const healthVal = { good: 100, warning: 60, critical: 25 } as const;
  const avgHealth =
    d.fields.reduce((s, f) => s + healthVal[f.health], 0) / Math.max(d.fields.length, 1);
  const recent = d.activities.filter((a) => daysAgo(a.activity_date) <= 7).length;
  const activityScore = Math.min(100, recent * 18);
  return Math.round((avgHealth || 0) * 0.7 + activityScore * 0.3);
}

export const totalArea = (d: FarmData) => d.fields.reduce((s, f) => s + f.area_ha, 0);

export const activeCropsCount = (d: FarmData) =>
  d.plantings.filter((p) => p.status === "active").length;

export const activitiesThisWeek = (d: FarmData) =>
  d.activities.filter((a) => daysAgo(a.activity_date) <= 7).length;

/** Estimated revenue this season from active plantings at current market price. */
export function estimatedRevenue(d: FarmData): number {
  let total = 0;
  for (const p of d.plantings.filter((x) => x.status === "active")) {
    const crop = cropById(p.crop_id);
    const field = d.fields.find((f) => f.id === p.field_id);
    if (!crop || !field) continue;
    const price = d.prices[crop.id]?.price ?? crop.market_price_eur_kg;
    total += crop.avg_yield_kg_ha * field.area_ha * price;
  }
  return Math.round(total);
}

export const totalSpend = (d: FarmData, days = 30) =>
  d.activities.filter((a) => daysAgo(a.activity_date) <= days).reduce((s, a) => s + a.cost_eur, 0);
