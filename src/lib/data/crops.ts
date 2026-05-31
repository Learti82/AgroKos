import type { Crop } from "@/lib/types";

// Kosovo crop library — seeded with realistic Kosovo agronomic data.
export const CROPS: Crop[] = [
  { id: "wheat", name_sq: "Gruri", name_en: "Wheat", category: "cereal", growing_season_start: 10, growing_season_end: 7, water_need: "medium", avg_yield_kg_ha: 4200, market_price_eur_kg: 0.28, icon_emoji: "🌾", color_hex: "#E9A319" },
  { id: "corn", name_sq: "Misri", name_en: "Corn", category: "cereal", growing_season_start: 4, growing_season_end: 9, water_need: "high", avg_yield_kg_ha: 7800, market_price_eur_kg: 0.24, icon_emoji: "🌽", color_hex: "#F2C14E" },
  { id: "barley", name_sq: "Elb", name_en: "Barley", category: "cereal", growing_season_start: 10, growing_season_end: 6, water_need: "low", avg_yield_kg_ha: 3600, market_price_eur_kg: 0.26, icon_emoji: "🌾", color_hex: "#D4A95A" },
  { id: "potato", name_sq: "Patata", name_en: "Potato", category: "vegetable", growing_season_start: 3, growing_season_end: 9, water_need: "medium", avg_yield_kg_ha: 22000, market_price_eur_kg: 0.35, icon_emoji: "🥔", color_hex: "#A98467" },
  { id: "tomato", name_sq: "Domate", name_en: "Tomato", category: "vegetable", growing_season_start: 4, growing_season_end: 9, water_need: "high", avg_yield_kg_ha: 45000, market_price_eur_kg: 0.65, icon_emoji: "🍅", color_hex: "#E63946" },
  { id: "pepper", name_sq: "Speci", name_en: "Pepper", category: "vegetable", growing_season_start: 4, growing_season_end: 10, water_need: "high", avg_yield_kg_ha: 28000, market_price_eur_kg: 0.80, icon_emoji: "🌶️", color_hex: "#D62828" },
  { id: "onion", name_sq: "Qepë", name_en: "Onion", category: "vegetable", growing_season_start: 3, growing_season_end: 8, water_need: "medium", avg_yield_kg_ha: 30000, market_price_eur_kg: 0.45, icon_emoji: "🧅", color_hex: "#C77DFF" },
  { id: "cabbage", name_sq: "Lakër", name_en: "Cabbage", category: "vegetable", growing_season_start: 4, growing_season_end: 11, water_need: "high", avg_yield_kg_ha: 40000, market_price_eur_kg: 0.30, icon_emoji: "🥬", color_hex: "#52B788" },
  { id: "carrot", name_sq: "Karotë", name_en: "Carrot", category: "vegetable", growing_season_start: 3, growing_season_end: 10, water_need: "medium", avg_yield_kg_ha: 35000, market_price_eur_kg: 0.40, icon_emoji: "🥕", color_hex: "#F4801A" },
  { id: "cucumber", name_sq: "Kastravec", name_en: "Cucumber", category: "vegetable", growing_season_start: 4, growing_season_end: 9, water_need: "high", avg_yield_kg_ha: 38000, market_price_eur_kg: 0.55, icon_emoji: "🥒", color_hex: "#43AA8B" },
  { id: "apple", name_sq: "Mollë", name_en: "Apple", category: "fruit", growing_season_start: 4, growing_season_end: 10, water_need: "medium", avg_yield_kg_ha: 32000, market_price_eur_kg: 0.50, icon_emoji: "🍎", color_hex: "#D00000" },
  { id: "plum", name_sq: "Kumbull", name_en: "Plum", category: "fruit", growing_season_start: 4, growing_season_end: 9, water_need: "medium", avg_yield_kg_ha: 18000, market_price_eur_kg: 0.60, icon_emoji: "🫐", color_hex: "#7209B7" },
  { id: "grape", name_sq: "Rrush", name_en: "Grape", category: "fruit", growing_season_start: 4, growing_season_end: 10, water_need: "low", avg_yield_kg_ha: 12000, market_price_eur_kg: 0.90, icon_emoji: "🍇", color_hex: "#6A4C93" },
  { id: "raspberry", name_sq: "Mjedër", name_en: "Raspberry", category: "berry", growing_season_start: 4, growing_season_end: 9, water_need: "high", avg_yield_kg_ha: 9000, market_price_eur_kg: 3.20, icon_emoji: "🍓", color_hex: "#C9184A" },
  { id: "strawberry", name_sq: "Luleshtrydhe", name_en: "Strawberry", category: "berry", growing_season_start: 3, growing_season_end: 7, water_need: "high", avg_yield_kg_ha: 20000, market_price_eur_kg: 2.50, icon_emoji: "🍓", color_hex: "#FF4D6D" },
  { id: "blueberry", name_sq: "Boronica", name_en: "Blueberry", category: "berry", growing_season_start: 4, growing_season_end: 8, water_need: "high", avg_yield_kg_ha: 7000, market_price_eur_kg: 5.50, icon_emoji: "🫐", color_hex: "#3A0CA3" },
  { id: "sunflower", name_sq: "Lule dielli", name_en: "Sunflower", category: "oilseed", growing_season_start: 4, growing_season_end: 9, water_need: "low", avg_yield_kg_ha: 2800, market_price_eur_kg: 0.42, icon_emoji: "🌻", color_hex: "#F4A100" },
];

export const cropById = (id: string | null | undefined): Crop | undefined =>
  CROPS.find((c) => c.id === id);

export const cropName = (id: string | null | undefined, lang: "sq" | "en"): string => {
  const c = cropById(id);
  if (!c) return lang === "sq" ? "—" : "—";
  return lang === "sq" ? c.name_sq : c.name_en;
};

/** Reference (default) price for a crop — an approximate figure used only as a
 *  fallback estimate until the farmer enters real market prices. */
export const referencePrice = (id: string | null | undefined): number =>
  cropById(id)?.market_price_eur_kg ?? 0;
