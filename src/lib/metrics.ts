import { FIELDS, PLANTINGS, ACTIVITIES, MARKET_PRICES } from "@/lib/data/demo";
import { cropById } from "@/lib/data/crops";
import { daysAgo } from "@/lib/dates";

export function farmHealthScore(): number {
  // Weighted: field health + alert freshness + recent activity.
  const healthVal = { good: 100, warning: 60, critical: 25 } as const;
  const avgHealth =
    FIELDS.reduce((s, f) => s + healthVal[f.health], 0) / Math.max(FIELDS.length, 1);
  const recent = ACTIVITIES.filter((a) => daysAgo(a.activity_date) <= 7).length;
  const activityScore = Math.min(100, recent * 18);
  return Math.round(avgHealth * 0.7 + activityScore * 0.3);
}

export function totalArea(): number {
  return FIELDS.reduce((s, f) => s + f.area_ha, 0);
}

export function activeCropsCount(): number {
  return PLANTINGS.filter((p) => p.status === "active").length;
}

export function activitiesThisWeek(): number {
  return ACTIVITIES.filter((a) => daysAgo(a.activity_date) <= 7).length;
}

/** Estimated revenue this season from active plantings at current market price. */
export function estimatedRevenue(): number {
  let total = 0;
  for (const p of PLANTINGS.filter((x) => x.status === "active")) {
    const crop = cropById(p.crop_id);
    const field = FIELDS.find((f) => f.id === p.field_id);
    if (!crop || !field) continue;
    const price = MARKET_PRICES.find((m) => m.crop_id === crop.id)?.price_eur_kg ?? crop.market_price_eur_kg;
    total += crop.avg_yield_kg_ha * field.area_ha * price;
  }
  return Math.round(total);
}

export function totalSpend(days = 30): number {
  return ACTIVITIES.filter((a) => daysAgo(a.activity_date) <= days).reduce((s, a) => s + a.cost_eur, 0);
}
