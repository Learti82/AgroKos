import type { FarmData } from "@/lib/data/farm";
import type { ForecastResponse } from "@/lib/weather";
import type { Lang } from "@/lib/types";
import { computeWeatherAlerts } from "@/lib/agriWeather";
import { cropById, cropName } from "@/lib/data/crops";

export interface Notification {
  id: string;
  severity: "critical" | "warning" | "info";
  icon: string;
  title: string;
  message: string;
  href: string;
}

// Live, derived notifications from current conditions — no storage needed.
export function deriveNotifications(farm: FarmData, weather: ForecastResponse | null, lang: Lang): Notification[] {
  const out: Notification[] = [];

  if (weather) {
    for (const a of computeWeatherAlerts(weather, lang)) {
      out.push({ id: `w-${a.title}`, severity: a.tone, icon: a.icon, title: a.title, message: a.message, href: "/dashboard/weather" });
    }
  }

  // Harvest windows
  for (const p of farm.plantings.filter((x) => x.status === "active")) {
    const days = Math.round((+new Date(p.expected_harvest_date) - Date.now()) / 86_400_000);
    if (days >= 0 && days <= 14) {
      const crop = cropById(p.crop_id);
      out.push({
        id: `h-${p.id}`, severity: "info", icon: "🌾",
        title: lang === "sq" ? "Dritarja e korrjes po afron" : "Harvest window approaching",
        message: `${crop ? cropName(crop.id, lang) : ""} — ${days} ${lang === "sq" ? "ditë" : "days"}`,
        href: "/dashboard/crops",
      });
    }
  }

  // Low stock
  for (const i of farm.inventory.filter((x) => x.quantity <= x.low_stock_threshold)) {
    out.push({
      id: `s-${i.id}`, severity: "warning", icon: "📦",
      title: lang === "sq" ? `Stok i ulët: ${i.item_name}` : `Low stock: ${i.item_name}`,
      message: `${i.quantity} ${i.unit} ${lang === "sq" ? "mbetur" : "left"}`,
      href: "/dashboard/inventory",
    });
  }

  const rank = { critical: 0, warning: 1, info: 2 };
  return out.sort((a, b) => rank[a.severity] - rank[b.severity]);
}
