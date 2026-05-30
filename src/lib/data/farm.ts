import type {
  Field, Planting, Activity, SoilAnalysis, Alert, InventoryItem,
} from "@/lib/types";
import {
  DEMO_PROFILE, FIELDS, PLANTINGS, ACTIVITIES,
  SOIL_ANALYSES, ALERTS, INVENTORY,
} from "./demo";

export interface FarmProfile {
  full_name: string;
  phone: string;
  municipality: string;
  village: string;
  farm_size_ha: number;
  primary_crops: string[];
  language_pref: "sq" | "en";
}

// Everything a logged-in farmer's dashboard needs. Per-user data lives in the
// database; reference data (crops, market prices, advisory) stays static in code.
export interface FarmData {
  source: "demo" | "live";
  profile: FarmProfile;
  fields: Field[];
  plantings: Planting[];
  activities: Activity[];
  soils: SoilAnalysis[];
  alerts: Alert[];
  inventory: InventoryItem[];
}

/** The seeded Kosovo demo dataset — used as fallback and to seed new accounts. */
export function demoFarmData(): FarmData {
  return {
    source: "demo",
    profile: { ...DEMO_PROFILE },
    fields: FIELDS,
    plantings: PLANTINGS,
    activities: ACTIVITIES,
    soils: SOIL_ANALYSES,
    alerts: ALERTS,
    inventory: INVENTORY,
  };
}
