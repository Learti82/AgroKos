import type { SoilAnalysis } from "./types";
import type { Lang } from "./types";

export interface SoilRec {
  tone: "good" | "warning" | "critical";
  sq: string;
  en: string;
}

// Simple agronomic thresholds tuned for Kosovo field crops.
export function soilRecommendations(s: SoilAnalysis, lang: Lang): SoilRec[] {
  const recs: SoilRec[] = [];
  if (s.ph < 5.5) recs.push({ tone: "critical", sq: "pH shumë i ulët — shtoni gëlqere (2-3 t/ha).", en: "pH very low — add lime (2-3 t/ha)." });
  else if (s.ph < 6.0) recs.push({ tone: "warning", sq: "pH i ulët — shtoni gëlqere.", en: "pH low — add lime." });
  else if (s.ph > 7.8) recs.push({ tone: "warning", sq: "pH i lartë — shmangni plehrat alkaline.", en: "pH high — avoid alkaline fertilizers." });
  else recs.push({ tone: "good", sq: "pH në nivel optimal.", en: "pH at optimal level." });

  if (s.nitrogen_ppm < 20) recs.push({ tone: "warning", sq: "Azot i ulët — aplikoni pleh azotik (KAN/Urea).", en: "Nitrogen low — apply nitrogen fertilizer (CAN/Urea)." });
  else recs.push({ tone: "good", sq: "Azot i mjaftueshëm.", en: "Nitrogen sufficient." });

  if (s.phosphorus_ppm < 15) recs.push({ tone: "warning", sq: "Fosfor i ulët — aplikoni superfosfat.", en: "Phosphorus low — apply superphosphate." });
  if (s.potassium_ppm < 120) recs.push({ tone: "warning", sq: "Kalium i ulët — aplikoni sulfat kaliumi.", en: "Potassium low — apply potassium sulphate." });
  if (s.organic_matter_pct < 2.0) recs.push({ tone: "warning", sq: "Lëndë organike e ulët — shtoni pleh organik/kompost.", en: "Organic matter low — add manure/compost." });

  return recs;
}

export const SOIL_IDEALS: Record<string, number> = {
  ph: 6.5, N: 30, P: 25, K: 160, OM: 3.0,
};
