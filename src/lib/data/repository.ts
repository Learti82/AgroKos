import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";
import { supabaseAdmin } from "@/lib/supabase/server";
import { DEMO_USER_ID } from "@/lib/config";
import { demoFarmData, type FarmData, type FarmProfile } from "./farm";
import type {
  Field, Planting, Activity, SoilAnalysis, Alert, InventoryItem,
} from "@/lib/types";

const num = (v: unknown, d = 0) => (v == null ? d : Number(v));

// ── row → typed object mappers (numeric columns come back as strings) ──
const toField = (r: any): Field => ({
  id: r.id, name: r.name, area_ha: num(r.area_ha), soil_type: r.soil_type,
  irrigation_type: r.irrigation_type, municipality: r.municipality, village: r.village,
  latitude: num(r.latitude), longitude: num(r.longitude),
  current_crop_id: r.current_crop_id, health: r.health ?? "good", geojson: r.geojson,
});
const toPlanting = (r: any): Planting => ({
  id: r.id, field_id: r.field_id, crop_id: r.crop_id, planting_date: r.planting_date,
  expected_harvest_date: r.expected_harvest_date, actual_harvest_date: r.actual_harvest_date,
  seed_variety: r.seed_variety, seed_quantity_kg: num(r.seed_quantity_kg),
  status: r.status, notes: r.notes ?? "", yield_kg: r.yield_kg == null ? null : num(r.yield_kg),
});
const toActivity = (r: any): Activity => ({
  id: r.id, field_id: r.field_id, planting_id: r.planting_id, activity_type: r.activity_type,
  activity_date: r.activity_date, description: r.description ?? "", input_used: r.input_used,
  input_quantity: r.input_quantity == null ? null : num(r.input_quantity),
  input_unit: r.input_unit, cost_eur: num(r.cost_eur), performed_by: r.performed_by ?? "self",
});
const toSoil = (r: any): SoilAnalysis => ({
  id: r.id, field_id: r.field_id, analysis_date: r.analysis_date, ph: num(r.ph),
  nitrogen_ppm: num(r.nitrogen_ppm), phosphorus_ppm: num(r.phosphorus_ppm),
  potassium_ppm: num(r.potassium_ppm), organic_matter_pct: num(r.organic_matter_pct),
  moisture_pct: num(r.moisture_pct), lab_name: r.lab_name ?? "", recommendations: r.recommendations ?? "",
});
const toAlert = (r: any): Alert => ({
  id: r.id, field_id: r.field_id, alert_type: r.alert_type, severity: r.severity,
  title_sq: r.title_sq, title_en: r.title_en, message_sq: r.message_sq, message_en: r.message_en,
  is_read: !!r.is_read, triggered_at: r.triggered_at, valid_until: r.valid_until,
});
const toInventory = (r: any): InventoryItem => ({
  id: r.id, item_name: r.item_name, category: r.category, quantity: num(r.quantity),
  unit: r.unit, purchase_date: r.purchase_date, purchase_price_eur: num(r.purchase_price_eur),
  supplier: r.supplier ?? "", expiry_date: r.expiry_date, low_stock_threshold: num(r.low_stock_threshold),
});

async function ensureProfile(
  sb: SupabaseClient,
  userId: string,
  seed?: Partial<FarmProfile>,
): Promise<FarmProfile> {
  const { data } = await sb.from("farmer_profiles").select("*").eq("clerk_user_id", userId).maybeSingle();

  const mapped = (r: any): FarmProfile => ({
    full_name: r.full_name, phone: r.phone ?? "", municipality: r.municipality ?? "",
    village: r.village ?? "", farm_size_ha: num(r.farm_size_ha),
    primary_crops: r.primary_crops ?? [], language_pref: r.language_pref ?? "sq",
  });

  if (data) {
    // Repair rows created before real identities were wired up: any profile
    // still carrying the demo placeholder is overwritten with the real user.
    if (data.full_name === "Agron Berisha") {
      const fresh: FarmProfile = {
        full_name: seed?.full_name || "Fermer i ri",
        phone: seed?.phone ?? "",
        municipality: seed?.municipality ?? "",
        village: seed?.village ?? "",
        farm_size_ha: seed?.farm_size_ha ?? 0,
        primary_crops: seed?.primary_crops ?? [],
        language_pref: data.language_pref ?? "sq",
      };
      await sb.from("farmer_profiles")
        .update({ ...fresh, updated_at: new Date().toISOString() })
        .eq("clerk_user_id", userId);
      return fresh;
    }
    return mapped(data);
  }

  // Brand-new account: create from the real Clerk identity, not demo data.
  const profile: FarmProfile = {
    full_name: seed?.full_name || "Fermer i ri",
    phone: seed?.phone ?? "",
    municipality: seed?.municipality ?? "",
    village: seed?.village ?? "",
    farm_size_ha: seed?.farm_size_ha ?? 0,
    primary_crops: seed?.primary_crops ?? [],
    language_pref: "sq",
  };
  await sb.from("farmer_profiles").insert({ clerk_user_id: userId, ...profile });
  return profile;
}

/**
 * Load a farmer's complete dataset. Tries the database; on missing config OR
 * any error, returns the seeded demo data so the UI never breaks.
 * `seed` carries the real identity (name/phone) from Clerk for new accounts.
 */
export async function getFarmData(
  userId: string | null,
  seed?: Partial<FarmProfile>,
): Promise<FarmData> {
  const sb = supabaseAdmin();
  if (!sb || !userId || userId === DEMO_USER_ID) return demoFarmData();

  try {
    const profile = await ensureProfile(sb, userId, seed);

    // Real accounts start empty — the farmer adds their own land & records.
    const [{ data: fields }, { data: plantings }, { data: activities }, { data: soils }, { data: alerts }, { data: inventory }, { data: prices }] =
      await Promise.all([
        sb.from("fields").select("*").eq("user_id", userId),
        sb.from("plantings").select("*").eq("user_id", userId),
        sb.from("activities").select("*").eq("user_id", userId),
        sb.from("soil_analyses").select("*").eq("user_id", userId),
        sb.from("alerts").select("*").eq("user_id", userId),
        sb.from("inventory").select("*").eq("user_id", userId),
        sb.from("market_prices").select("*").eq("user_id", userId),
      ]);

    const priceMap: Record<string, { price: number; prev: number | null; date: string }> = {};
    for (const r of prices ?? []) {
      priceMap[r.crop_id] = { price: num(r.price_eur_kg), prev: r.prev_price == null ? null : num(r.prev_price), date: r.price_date };
    }

    return {
      source: "live",
      profile,
      fields: (fields ?? []).map(toField),
      plantings: (plantings ?? []).map(toPlanting),
      activities: (activities ?? []).map(toActivity),
      soils: (soils ?? []).map(toSoil),
      alerts: (alerts ?? []).map(toAlert),
      inventory: (inventory ?? []).map(toInventory),
      prices: priceMap,
    };
  } catch (err) {
    console.warn("[AgroKos] Supabase read failed — falling back to demo data.", err);
    return demoFarmData();
  }
}
