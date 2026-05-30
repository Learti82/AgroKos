import type {
  Field, Planting, Activity, SoilAnalysis, Alert,
  MarketPrice, InventoryItem,
} from "@/lib/types";
import { CROPS } from "./crops";

// ── Demo farmer profile ────────────────────────────────────────────────
export const DEMO_PROFILE = {
  full_name: "Agron Berisha",
  phone: "+383 44 123 456",
  municipality: "Pejë",
  village: "Vitomiricë",
  farm_size_ha: 4.6,
  primary_crops: ["wheat", "corn", "tomato", "pepper", "apple"],
  language_pref: "sq" as const,
};

const iso = (daysFromNow: number) =>
  new Date(Date.now() + daysFromNow * 86_400_000).toISOString().slice(0, 10);

// ── Fields (realistic coords near Pejë / Pristina) ─────────────────────
function box(lat: number, lon: number, d = 0.004): number[][][] {
  return [[
    [lon - d, lat - d], [lon + d, lat - d],
    [lon + d, lat + d], [lon - d, lat + d], [lon - d, lat - d],
  ]];
}

export const FIELDS: Field[] = [
  {
    id: "field-1", name: "Fusha e Sipërme", area_ha: 2.3, soil_type: "loam",
    irrigation_type: "sprinkler", municipality: "Pejë", village: "Vitomiricë",
    latitude: 42.6592, longitude: 20.2887, current_crop_id: "wheat",
    health: "good", geojson: { type: "Polygon", coordinates: box(42.6592, 20.2887, 0.006) },
  },
  {
    id: "field-2", name: "Kopshti", area_ha: 0.8, soil_type: "silty",
    irrigation_type: "drip", municipality: "Pejë", village: "Vitomiricë",
    latitude: 42.6611, longitude: 20.2921, current_crop_id: "tomato",
    health: "warning", geojson: { type: "Polygon", coordinates: box(42.6611, 20.2921, 0.0035) },
  },
  {
    id: "field-3", name: "Livadhi", area_ha: 1.5, soil_type: "clay",
    irrigation_type: "rain-fed", municipality: "Pejë", village: "Vitomiricë",
    latitude: 42.6558, longitude: 20.2832, current_crop_id: "apple",
    health: "good", geojson: { type: "Polygon", coordinates: box(42.6558, 20.2832, 0.005) },
  },
];

// ── Plantings ──────────────────────────────────────────────────────────
export const PLANTINGS: Planting[] = [
  {
    id: "plant-1", field_id: "field-1", crop_id: "wheat", planting_date: iso(-210),
    expected_harvest_date: iso(35), actual_harvest_date: null, seed_variety: "Simonida",
    seed_quantity_kg: 460, status: "active", notes: "Mbjellë vjeshte, gjendje e mirë.", yield_kg: null,
  },
  {
    id: "plant-2", field_id: "field-2", crop_id: "tomato", planting_date: iso(-45),
    expected_harvest_date: iso(40), actual_harvest_date: null, seed_variety: "Belle F1",
    seed_quantity_kg: 0.4, status: "active", notes: "Fidanë në serrë, ujitje me pika.", yield_kg: null,
  },
  {
    id: "plant-3", field_id: "field-3", crop_id: "apple", planting_date: iso(-1100),
    expected_harvest_date: iso(120), actual_harvest_date: null, seed_variety: "Idared",
    seed_quantity_kg: 0, status: "active", notes: "Pemishte 3-vjeçare, 420 pemë.", yield_kg: null,
  },
  {
    id: "plant-4", field_id: "field-1", crop_id: "corn", planting_date: iso(-400),
    expected_harvest_date: iso(-150), actual_harvest_date: iso(-150), seed_variety: "Pioneer P9911",
    seed_quantity_kg: 55, status: "harvested", notes: "Sezoni i kaluar.", yield_kg: 17_940,
  },
];

// ── Activities (last 30 days) ──────────────────────────────────────────
export const ACTIVITIES: Activity[] = [
  { id: "act-1", field_id: "field-1", planting_id: "plant-1", activity_type: "fertilizing", activity_date: iso(-2), description: "Plehërim mbulesë me azot (KAN 27%).", input_used: "KAN 27%", input_quantity: 180, input_unit: "kg", cost_eur: 86.4, performed_by: "self" },
  { id: "act-2", field_id: "field-2", planting_id: "plant-2", activity_type: "irrigation", activity_date: iso(-3), description: "Ujitje me pika, 2 orë.", input_used: null, input_quantity: null, input_unit: null, cost_eur: 0, performed_by: "self" },
  { id: "act-3", field_id: "field-2", planting_id: "plant-2", activity_type: "spraying", activity_date: iso(-5), description: "Trajtim kundër vrugut (Phytophthora).", input_used: "Ridomil Gold", input_quantity: 2.5, input_unit: "kg", cost_eur: 42, performed_by: "Fitim Krasniqi" },
  { id: "act-4", field_id: "field-3", planting_id: "plant-3", activity_type: "scouting", activity_date: iso(-6), description: "Kontroll për morrën e mollës. Pa shenja.", input_used: null, input_quantity: null, input_unit: null, cost_eur: 0, performed_by: "self" },
  { id: "act-5", field_id: "field-1", planting_id: "plant-1", activity_type: "spraying", activity_date: iso(-9), description: "Herbicid kundër barojave gjethegjera.", input_used: "Sekator OD", input_quantity: 0.5, input_unit: "L", cost_eur: 31.5, performed_by: "self" },
  { id: "act-6", field_id: "field-3", planting_id: "plant-3", activity_type: "fertilizing", activity_date: iso(-12), description: "Plehërim pranveror NPK 15-15-15.", input_used: "NPK 15-15-15", input_quantity: 220, input_unit: "kg", cost_eur: 132, performed_by: "Fitim Krasniqi" },
  { id: "act-7", field_id: "field-2", planting_id: "plant-2", activity_type: "seeding", activity_date: iso(-45), description: "Transplantim fidanësh domate, 1.800 bimë.", input_used: "Fidanë Belle F1", input_quantity: 1800, input_unit: "units", cost_eur: 270, performed_by: "self" },
  { id: "act-8", field_id: "field-3", planting_id: "plant-3", activity_type: "plowing", activity_date: iso(-20), description: "Kultivim ndërmjet rreshtave.", input_used: null, input_quantity: null, input_unit: null, cost_eur: 45, performed_by: "self" },
];

// ── Soil analyses ──────────────────────────────────────────────────────
export const SOIL_ANALYSES: SoilAnalysis[] = [
  { id: "soil-1", field_id: "field-1", analysis_date: iso(-30), ph: 6.4, nitrogen_ppm: 28, phosphorus_ppm: 18, potassium_ppm: 145, organic_matter_pct: 2.8, moisture_pct: 22, lab_name: "Laboratori Bujqësor Pejë", recommendations: "Nivele të mira. Mbani plehërimin azotik sipas planit." },
  { id: "soil-2", field_id: "field-2", analysis_date: iso(-25), ph: 5.7, nitrogen_ppm: 15, phosphorus_ppm: 12, potassium_ppm: 98, organic_matter_pct: 1.9, moisture_pct: 26, lab_name: "Laboratori Bujqësor Pejë", recommendations: "pH i ulët — shtoni gëlqere. Azot i ulët — aplikoni pleh azotik." },
  { id: "soil-3", field_id: "field-1", analysis_date: iso(-210), ph: 6.2, nitrogen_ppm: 24, phosphorus_ppm: 16, potassium_ppm: 138, organic_matter_pct: 2.6, moisture_pct: 20, lab_name: "Laboratori Bujqësor Pejë", recommendations: "Bazë e mirë para mbjelljes." },
];

// ── Alerts ─────────────────────────────────────────────────────────────
export const ALERTS: Alert[] = [
  { id: "alert-1", field_id: "field-2", alert_type: "frost", severity: "critical", title_sq: "Rrezik ngrice sonte", title_en: "Frost risk tonight", message_sq: "Temperatura minimale parashikohet -1°C në Kopshti. Mbroni fidanët e domates me agrotekstil ose ujitje mbrojtëse.", message_en: "Minimum temperature forecast -1°C at Kopshti. Protect tomato seedlings with fleece or protective irrigation.", is_read: false, triggered_at: new Date(Date.now() - 3 * 3600_000).toISOString(), valid_until: iso(1) },
  { id: "alert-2", field_id: "field-2", alert_type: "irrigation_needed", severity: "warning", title_sq: "Nevojitet ujitje", title_en: "Irrigation needed", message_sq: "5 ditë pa shi në Kopshti dhe lagështia e tokës nën 30%. Rekomandohet ujitje.", message_en: "5 days without rain at Kopshti and soil moisture below 30%. Irrigation recommended.", is_read: false, triggered_at: new Date(Date.now() - 26 * 3600_000).toISOString(), valid_until: iso(2) },
  { id: "alert-3", field_id: "field-1", alert_type: "harvest_window", severity: "info", title_sq: "Dritarja e korrjes po afron", title_en: "Harvest window approaching", message_sq: "Gruri në Fusha e Sipërme pritet të jetë gati për korrje brenda ~35 ditësh.", message_en: "Wheat at Fusha e Sipërme is expected to be ready for harvest in ~35 days.", is_read: false, triggered_at: new Date(Date.now() - 50 * 3600_000).toISOString(), valid_until: iso(35) },
  { id: "alert-4", field_id: null, alert_type: "market", severity: "info", title_sq: "Çmimi i specit u rrit 8%", title_en: "Pepper price up 8%", message_sq: "Çmimi i specit në tregun e Prishtinës u rrit 8% këtë javë në €0.80/kg.", message_en: "Pepper price at the Pristina market rose 8% this week to €0.80/kg.", is_read: true, triggered_at: new Date(Date.now() - 80 * 3600_000).toISOString(), valid_until: null },
];

// ── Market prices (12-month history generated deterministically) ────────
function seededHistory(base: number, seed: number) {
  const out: { date: string; price: number }[] = [];
  let v = base * 0.82;
  for (let m = 11; m >= 0; m--) {
    const wobble = (Math.sin(seed + m * 1.7) + Math.cos(seed * 2 + m)) * 0.06;
    v = Math.max(base * 0.6, base * (0.9 + wobble) + (base - v) * 0.25);
    const d = new Date();
    d.setMonth(d.getMonth() - m, 1);
    out.push({ date: d.toISOString().slice(0, 10), price: Math.round(v * 1000) / 1000 });
  }
  return out;
}

export const MARKET_PRICES: MarketPrice[] = CROPS.map((c, i) => {
  const history = seededHistory(c.market_price_eur_kg, i + 1);
  const cur = history[history.length - 1].price;
  const prev = history[history.length - 2].price;
  const pct = ((cur - prev) / prev) * 100;
  return {
    crop_id: c.id,
    price_eur_kg: cur,
    market_location: "Prishtinë",
    price_date: iso(0),
    trend: pct > 1.5 ? "up" : pct < -1.5 ? "down" : "stable",
    pct_change_week: Math.round(pct * 10) / 10,
    history,
  };
});

// ── Inventory ──────────────────────────────────────────────────────────
export const INVENTORY: InventoryItem[] = [
  { id: "inv-1", item_name: "Farë gruri Simonida", category: "seed", quantity: 120, unit: "kg", purchase_date: iso(-220), purchase_price_eur: 96, supplier: "Agroprodukt Pejë", expiry_date: iso(500), low_stock_threshold: 50 },
  { id: "inv-2", item_name: "KAN 27% (azot)", category: "fertilizer", quantity: 320, unit: "kg", purchase_date: iso(-40), purchase_price_eur: 153.6, supplier: "Agroprodukt Pejë", expiry_date: null, low_stock_threshold: 100 },
  { id: "inv-3", item_name: "NPK 15-15-15", category: "fertilizer", quantity: 80, unit: "kg", purchase_date: iso(-60), purchase_price_eur: 48, supplier: "Bujku Market", expiry_date: null, low_stock_threshold: 100 },
  { id: "inv-4", item_name: "Ridomil Gold", category: "pesticide", quantity: 1.5, unit: "kg", purchase_date: iso(-30), purchase_price_eur: 25, supplier: "Agro Vita", expiry_date: iso(400), low_stock_threshold: 2 },
  { id: "inv-5", item_name: "Sekator OD (herbicid)", category: "herbicide", quantity: 2, unit: "L", purchase_date: iso(-35), purchase_price_eur: 63, supplier: "Agro Vita", expiry_date: iso(300), low_stock_threshold: 1 },
  { id: "inv-6", item_name: "Fidanë domate Belle F1", category: "seed", quantity: 0, unit: "units", purchase_date: iso(-45), purchase_price_eur: 270, supplier: "Serra Krasniqi", expiry_date: null, low_stock_threshold: 100 },
  { id: "inv-7", item_name: "Naftë bujqësore", category: "fuel", quantity: 140, unit: "L", purchase_date: iso(-15), purchase_price_eur: 182, supplier: "Kosova Petrol", expiry_date: null, low_stock_threshold: 60 },
  { id: "inv-8", item_name: "Agrotekstil mbrojtës", category: "equipment", quantity: 3, unit: "units", purchase_date: iso(-90), purchase_price_eur: 60, supplier: "Bujku Market", expiry_date: null, low_stock_threshold: 2 },
  { id: "inv-9", item_name: "Sulfat kaliumi", category: "fertilizer", quantity: 45, unit: "kg", purchase_date: iso(-70), purchase_price_eur: 54, supplier: "Bujku Market", expiry_date: null, low_stock_threshold: 50 },
  { id: "inv-10", item_name: "Vaj motorik traktori", category: "equipment", quantity: 8, unit: "L", purchase_date: iso(-120), purchase_price_eur: 40, supplier: "Kosova Petrol", expiry_date: null, low_stock_threshold: 4 },
];

export const KOSOVO_MUNICIPALITIES = [
  "Prishtinë", "Prizren", "Pejë", "Gjakovë", "Ferizaj", "Gjilan",
  "Mitrovicë", "Vushtrri", "Podujevë", "Suharekë", "Rahovec", "Lipjan",
  "Malishevë", "Drenas", "Skenderaj", "Viti", "Deçan", "Istog", "Klinë",
  "Kamenicë", "Dragash", "Fushë Kosovë", "Obiliq", "Shtime", "Kaçanik",
];

// Weather grid municipalities with coords
export const WEATHER_GRID = [
  { name: "Prishtinë", lat: 42.6629, lon: 21.1655 },
  { name: "Prizren", lat: 42.2139, lon: 20.7397 },
  { name: "Pejë", lat: 42.6592, lon: 20.2887 },
  { name: "Gjakovë", lat: 42.3803, lon: 20.4308 },
  { name: "Ferizaj", lat: 42.3706, lon: 21.1483 },
  { name: "Gjilan", lat: 42.4637, lon: 21.4694 },
  { name: "Mitrovicë", lat: 42.8914, lon: 20.8660 },
];
