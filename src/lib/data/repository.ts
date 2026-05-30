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

const withUser = <T extends object>(rows: T[], user_id: string) =>
  rows.map((r) => ({ ...r, user_id }));

/** Seed a brand-new account with the Kosovo demo dataset so it isn't empty. */
async function seedUser(sb: SupabaseClient, userId: string) {
  const demo = demoFarmData();
  await sb.from("fields").insert(withUser(demo.fields, userId));
  await sb.from("plantings").insert(withUser(demo.plantings, userId));
  await sb.from("activities").insert(withUser(demo.activities, userId));
  await sb.from("soil_analyses").insert(withUser(demo.soils, userId));
  await sb.from("alerts").insert(withUser(demo.alerts, userId));
  await sb.from("inventory").insert(withUser(demo.inventory, userId));
}

async function ensureProfile(sb: SupabaseClient, userId: string): Promise<FarmProfile> {
  const { data } = await sb.from("farmer_profiles").select("*").eq("clerk_user_id", userId).maybeSingle();
  if (data) {
    return {
      full_name: data.full_name, phone: data.phone ?? "", municipality: data.municipality ?? "",
      village: data.village ?? "", farm_size_ha: num(data.farm_size_ha),
      primary_crops: data.primary_crops ?? [], language_pref: data.language_pref ?? "sq",
    };
  }
  const demo = demoFarmData().profile;
  await sb.from("farmer_profiles").insert({ clerk_user_id: userId, ...demo });
  return demo;
}

/**
 * Load a farmer's complete dataset. Tries the database; on missing config OR
 * any error, returns the seeded demo data so the UI never breaks.
 */
export async function getFarmData(userId: string | null): Promise<FarmData> {
  const sb = supabaseAdmin();
  if (!sb || !userId || userId === DEMO_USER_ID) return demoFarmData();

  try {
    const profile = await ensureProfile(sb, userId);

    let { data: fields } = await sb.from("fields").select("*").eq("user_id", userId);

    // First login → seed this account, then re-read.
    if (!fields || fields.length === 0) {
      await seedUser(sb, userId);
      ({ data: fields } = await sb.from("fields").select("*").eq("user_id", userId));
    }

    const [{ data: plantings }, { data: activities }, { data: soils }, { data: alerts }, { data: inventory }] =
      await Promise.all([
        sb.from("plantings").select("*").eq("user_id", userId),
        sb.from("activities").select("*").eq("user_id", userId),
        sb.from("soil_analyses").select("*").eq("user_id", userId),
        sb.from("alerts").select("*").eq("user_id", userId),
        sb.from("inventory").select("*").eq("user_id", userId),
      ]);

    return {
      source: "live",
      profile,
      fields: (fields ?? []).map(toField),
      plantings: (plantings ?? []).map(toPlanting),
      activities: (activities ?? []).map(toActivity),
      soils: (soils ?? []).map(toSoil),
      alerts: (alerts ?? []).map(toAlert),
      inventory: (inventory ?? []).map(toInventory),
    };
  } catch (err) {
    console.warn("[AgroKos] Supabase read failed — falling back to demo data.", err);
    return demoFarmData();
  }
}
