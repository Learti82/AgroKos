import type {
  Field, Planting, Activity, SoilAnalysis, Alert, InventoryItem,
} from "@/lib/types";

// ── No dummy farm data ──────────────────────────────────────────────────
// AgroKos ships with NO fake/seeded farm records. Every account starts empty
// and is filled with the farmer's own real data. The values below are empty
// on purpose; the only baked-in data in this file is the real static
// reference lists at the bottom (Kosovo municipalities + weather-grid coords).

export const DEMO_PROFILE = {
  full_name: "",
  phone: "",
  municipality: "",
  village: "",
  farm_size_ha: 0,
  primary_crops: [] as string[],
  language_pref: "sq" as const,
};

export const FIELDS: Field[] = [];
export const PLANTINGS: Planting[] = [];
export const ACTIVITIES: Activity[] = [];
export const SOIL_ANALYSES: SoilAnalysis[] = [];
export const ALERTS: Alert[] = [];
export const INVENTORY: InventoryItem[] = [];

// ── Real static reference data ──────────────────────────────────────────
export const KOSOVO_MUNICIPALITIES = [
  "Prishtinë", "Prizren", "Pejë", "Gjakovë", "Ferizaj", "Gjilan",
  "Mitrovicë", "Vushtrri", "Podujevë", "Suharekë", "Rahovec", "Lipjan",
  "Malishevë", "Drenas", "Skenderaj", "Viti", "Deçan", "Istog", "Klinë",
  "Kamenicë", "Dragash", "Fushë Kosovë", "Obiliq", "Shtime", "Kaçanik",
];

// Real coordinates of Kosovo's main municipalities (for live weather).
export const WEATHER_GRID = [
  { name: "Prishtinë", lat: 42.6629, lon: 21.1655 },
  { name: "Prizren", lat: 42.2139, lon: 20.7397 },
  { name: "Pejë", lat: 42.6592, lon: 20.2887 },
  { name: "Gjakovë", lat: 42.3803, lon: 20.4308 },
  { name: "Ferizaj", lat: 42.3706, lon: 21.1483 },
  { name: "Gjilan", lat: 42.4637, lon: 21.4694 },
  { name: "Mitrovicë", lat: 42.8914, lon: 20.8660 },
];
