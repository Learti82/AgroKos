export type Lang = "sq" | "en";

export type CropCategory = "cereal" | "vegetable" | "fruit" | "berry" | "dairy" | "oilseed";

export interface Crop {
  id: string;
  name_sq: string;
  name_en: string;
  category: CropCategory;
  growing_season_start: number; // month 1-12
  growing_season_end: number;
  water_need: "low" | "medium" | "high";
  avg_yield_kg_ha: number;
  market_price_eur_kg: number;
  icon_emoji: string;
  color_hex: string;
}

export interface Field {
  id: string;
  name: string;
  area_ha: number;
  soil_type: "clay" | "sandy" | "loam" | "silty";
  irrigation_type: "drip" | "sprinkler" | "flood" | "rain-fed";
  municipality: string;
  village: string;
  latitude: number;
  longitude: number;
  current_crop_id: string | null;
  health: "good" | "warning" | "critical";
  geojson: GeoPolygon;
}

export interface GeoPolygon {
  type: "Polygon";
  coordinates: number[][][];
}

export interface Planting {
  id: string;
  field_id: string;
  crop_id: string;
  planting_date: string;
  expected_harvest_date: string;
  actual_harvest_date: string | null;
  seed_variety: string;
  seed_quantity_kg: number;
  status: "planned" | "active" | "harvested" | "failed";
  notes: string;
  yield_kg: number | null;
}

export type ActivityType =
  | "fertilizing" | "spraying" | "irrigation" | "scouting"
  | "harvesting" | "plowing" | "seeding";

export interface Activity {
  id: string;
  field_id: string;
  planting_id: string | null;
  activity_type: ActivityType;
  activity_date: string;
  description: string;
  input_used: string | null;
  input_quantity: number | null;
  input_unit: string | null;
  cost_eur: number;
  performed_by: string;
}

export interface SoilAnalysis {
  id: string;
  field_id: string;
  analysis_date: string;
  ph: number;
  nitrogen_ppm: number;
  phosphorus_ppm: number;
  potassium_ppm: number;
  organic_matter_pct: number;
  moisture_pct: number;
  lab_name: string;
  recommendations: string;
}

export type AlertType =
  | "frost" | "drought" | "heavy_rain" | "pest_risk"
  | "disease_risk" | "irrigation_needed" | "harvest_window" | "market";

export interface Alert {
  id: string;
  field_id: string | null;
  alert_type: AlertType;
  severity: "info" | "warning" | "critical";
  title_sq: string;
  title_en: string;
  message_sq: string;
  message_en: string;
  is_read: boolean;
  triggered_at: string;
  valid_until: string | null;
}

export interface MarketPrice {
  crop_id: string;
  price_eur_kg: number;
  market_location: string;
  price_date: string;
  trend: "up" | "down" | "stable";
  pct_change_week: number;
  history: { date: string; price: number }[];
}

export type InventoryCategory =
  | "seed" | "fertilizer" | "pesticide" | "herbicide" | "equipment" | "fuel";

export interface InventoryItem {
  id: string;
  item_name: string;
  category: InventoryCategory;
  quantity: number;
  unit: string;
  purchase_date: string;
  purchase_price_eur: number;
  supplier: string;
  expiry_date: string | null;
  low_stock_threshold: number;
}
