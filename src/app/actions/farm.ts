"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@clerk/nextjs/server";
import { supabaseAdmin } from "@/lib/supabase/server";
import { hasClerk } from "@/lib/config";
import type { GeoPolygon } from "@/lib/types";

type Result = { ok: boolean; demo?: boolean; error?: string };

async function ctx() {
  if (!hasClerk) return { userId: null, sb: null, demo: true };
  const { userId } = await auth();
  const sb = supabaseAdmin();
  return { userId, sb, demo: !userId || !sb };
}

const newId = () => globalThis.crypto.randomUUID();

async function insert(table: string, row: Record<string, unknown>): Promise<Result> {
  const { userId, sb, demo } = await ctx();
  if (demo || !sb || !userId) return { ok: false, demo: true };
  const { error } = await sb.from(table).insert({ ...row, user_id: userId, id: newId() });
  if (error) {
    console.warn(`[AgroKos] insert ${table} failed:`, error.message);
    return { ok: false, error: error.message };
  }
  revalidatePath("/dashboard", "layout");
  return { ok: true };
}

async function remove(table: string, id: string): Promise<Result> {
  const { userId, sb, demo } = await ctx();
  if (demo || !sb || !userId) return { ok: false, demo: true };
  const { error } = await sb.from(table).delete().eq("user_id", userId).eq("id", id);
  if (error) return { ok: false, error: error.message };
  revalidatePath("/dashboard", "layout");
  return { ok: true };
}

async function update(table: string, id: string, patch: Record<string, unknown>): Promise<Result> {
  const { userId, sb, demo } = await ctx();
  if (demo || !sb || !userId) return { ok: false, demo: true };
  const { error } = await sb.from(table).update(patch).eq("user_id", userId).eq("id", id);
  if (error) {
    console.warn(`[AgroKos] update ${table} failed:`, error.message);
    return { ok: false, error: error.message };
  }
  revalidatePath("/dashboard", "layout");
  return { ok: true };
}

// ── Fields ─────────────────────────────────────────────────────────────
export interface NewField {
  name: string;
  area_ha: number;
  soil_type: string;
  irrigation_type: string;
  municipality?: string;
  village?: string;
  latitude?: number;
  longitude?: number;
  current_crop_id?: string | null;
  geojson?: GeoPolygon | null;
}
export const createField = (f: NewField) =>
  insert("fields", { ...f, health: "good", current_crop_id: f.current_crop_id ?? null });
export const deleteField = (id: string) => remove("fields", id);
export const updateField = (id: string, p: Partial<NewField>) => update("fields", id, { ...p });

// ── Activities ─────────────────────────────────────────────────────────
export interface NewActivity {
  field_id: string | null;
  activity_type: string;
  activity_date: string;
  description?: string;
  input_used?: string | null;
  input_quantity?: number | null;
  input_unit?: string | null;
  cost_eur?: number;
  performed_by?: string;
}
export const createActivity = (a: NewActivity) =>
  insert("activities", { planting_id: null, performed_by: "self", cost_eur: 0, ...a });
export const deleteActivity = (id: string) => remove("activities", id);
export const updateActivity = (id: string, p: Partial<NewActivity>) => update("activities", id, { ...p });

// ── Plantings ──────────────────────────────────────────────────────────
export interface NewPlanting {
  field_id: string;
  crop_id: string;
  planting_date: string;
  expected_harvest_date: string;
  seed_variety?: string;
  seed_quantity_kg?: number;
  notes?: string;
}
export const createPlanting = (p: NewPlanting) =>
  insert("plantings", { status: "active", actual_harvest_date: null, yield_kg: null, ...p });
export const deletePlanting = (id: string) => remove("plantings", id);
export const updatePlanting = (id: string, p: Partial<NewPlanting & { status: string; yield_kg: number | null }>) => update("plantings", id, { ...p });

// ── Soil analyses ──────────────────────────────────────────────────────
export interface NewSoil {
  field_id: string;
  analysis_date: string;
  ph: number;
  nitrogen_ppm: number;
  phosphorus_ppm: number;
  potassium_ppm: number;
  organic_matter_pct: number;
  moisture_pct: number;
  lab_name?: string;
  recommendations?: string;
}
export const createSoil = (s: NewSoil) => insert("soil_analyses", { ...s });
export const deleteSoil = (id: string) => remove("soil_analyses", id);
export const updateSoil = (id: string, p: Partial<NewSoil>) => update("soil_analyses", id, { ...p });

// ── Inventory ──────────────────────────────────────────────────────────
export interface NewInventory {
  item_name: string;
  category: string;
  quantity: number;
  unit: string;
  purchase_date?: string;
  purchase_price_eur?: number;
  supplier?: string;
  expiry_date?: string | null;
  low_stock_threshold?: number;
}
export const createInventory = (i: NewInventory) =>
  insert("inventory", { expiry_date: null, low_stock_threshold: 0, purchase_price_eur: 0, ...i });
export const deleteInventory = (id: string) => remove("inventory", id);
export const updateInventory = (id: string, p: Partial<NewInventory>) => update("inventory", id, { ...p });

// ── Market prices (manually entered from official sources) ─────────────
export async function saveMarketPrices(entries: { crop_id: string; price: number }[]): Promise<Result> {
  const { userId, sb, demo } = await ctx();
  if (demo || !sb || !userId) return { ok: false, demo: true };

  const { data: existing } = await sb.from("market_prices").select("crop_id, price_eur_kg").eq("user_id", userId);
  const prevMap = new Map((existing ?? []).map((r: any) => [r.crop_id, Number(r.price_eur_kg)]));
  const today = new Date().toISOString().slice(0, 10);

  const rows = entries
    .filter((e) => Number.isFinite(e.price) && e.price > 0)
    .map((e) => ({
      user_id: userId,
      crop_id: e.crop_id,
      price_eur_kg: e.price,
      prev_price: prevMap.has(e.crop_id) ? prevMap.get(e.crop_id) : null,
      price_date: today,
    }));

  if (!rows.length) return { ok: true };
  const { error } = await sb.from("market_prices").upsert(rows, { onConflict: "user_id,crop_id" });
  if (error) return { ok: false, error: error.message };
  revalidatePath("/dashboard", "layout");
  return { ok: true };
}
