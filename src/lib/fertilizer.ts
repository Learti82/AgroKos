import { cropById } from "@/lib/data/crops";
import type { SoilAnalysis } from "@/lib/types";

// Target nutrient application (kg/ha of N, P2O5, K2O) by crop category — rough
// agronomic guidance for Kosovo field conditions.
const TARGETS: Record<string, { N: number; P: number; K: number }> = {
  cereal: { N: 120, P: 60, K: 60 },
  vegetable: { N: 150, P: 80, K: 200 },
  fruit: { N: 90, P: 50, K: 120 },
  berry: { N: 80, P: 45, K: 110 },
  oilseed: { N: 80, P: 50, K: 80 },
  dairy: { N: 100, P: 60, K: 80 },
};

// Fertilizer products and their nutrient fraction + indicative €/kg.
const PRODUCTS = {
  N: { name: "KAN 27%", frac: 0.27, eurKg: 0.48 },
  P: { name: "Superfosfat (P₂O₅ 18%)", frac: 0.18, eurKg: 0.55 },
  K: { name: "Sulfat kaliumi (K₂O 50%)", frac: 0.50, eurKg: 0.90 },
};

export interface FertResult {
  nutrient: "N" | "P" | "K";
  label: string;
  product: string;
  nutrientKg: number; // kg of nutrient for the whole area
  productKg: number; // kg of product to buy
  cost: number;
}

export function calcFertilizer(cropId: string, areaHa: number, soil?: SoilAnalysis): FertResult[] {
  const crop = cropById(cropId);
  const cat = crop?.category ?? "cereal";
  const t = TARGETS[cat] ?? { N: 100, P: 60, K: 80 };

  // Reduce targets when the soil test shows good levels.
  let { N, P, K } = t;
  if (soil) {
    if (soil.nitrogen_ppm > 25) N *= 0.8;
    if (soil.phosphorus_ppm > 20) P *= 0.7;
    if (soil.potassium_ppm > 150) K *= 0.7;
    if (soil.organic_matter_pct > 3) N *= 0.9;
  }

  const rows: { nutrient: "N" | "P" | "K"; label: string; perHa: number }[] = [
    { nutrient: "N", label: "Azot (N)", perHa: N },
    { nutrient: "P", label: "Fosfor (P₂O₅)", perHa: P },
    { nutrient: "K", label: "Kalium (K₂O)", perHa: K },
  ];

  return rows.map((r) => {
    const prod = PRODUCTS[r.nutrient];
    const nutrientKg = r.perHa * areaHa;
    const productKg = nutrientKg / prod.frac;
    return {
      nutrient: r.nutrient,
      label: r.label,
      product: prod.name,
      nutrientKg: Math.round(nutrientKg),
      productKg: Math.round(productKg),
      cost: Math.round(productKg * prod.eurKg),
    };
  });
}
