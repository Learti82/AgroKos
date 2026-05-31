"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Modal, Field } from "@/components/ui/Modal";
import { VoiceButton } from "@/components/VoiceButton";
import { useApp } from "@/lib/store";
import { useFarm } from "@/components/DataProvider";
import { CROPS, cropName } from "@/lib/data/crops";
import { ACTIVITY_LABELS, INVENTORY_LABELS } from "@/lib/i18n";
import {
  createActivity, updateActivity, createInventory, updateInventory,
  createSoil, updateSoil, createPlanting, updatePlanting,
  deleteActivity, deleteInventory, deleteSoil, deletePlanting,
} from "@/app/actions/farm";
import { Loader2, Trash2 } from "lucide-react";

const today = () => new Date().toISOString().slice(0, 10);

function SaveBar({ saving, onClose, onDelete, lang }: { saving: boolean; onClose: () => void; onDelete?: () => void; lang: "sq" | "en" }) {
  return (
    <div className="mt-4 flex items-center justify-between gap-2">
      {onDelete ? (
        <button type="button" onClick={onDelete} disabled={saving} className="btn px-2 py-2 text-red-600 hover:bg-red-50"><Trash2 className="h-4 w-4" /> {lang === "sq" ? "Fshi" : "Delete"}</button>
      ) : <span />}
      <div className="flex gap-2">
        <button type="button" onClick={onClose} className="btn-secondary">{lang === "sq" ? "Anulo" : "Cancel"}</button>
        <button type="submit" disabled={saving} className="btn-primary">
          {saving && <Loader2 className="h-4 w-4 animate-spin" />}{lang === "sq" ? "Ruaj" : "Save"}
        </button>
      </div>
    </div>
  );
}

function useSubmit(onClose: () => void) {
  const router = useRouter();
  const { lang } = useApp();
  const [saving, setSaving] = useState(false);
  async function run(fn: () => Promise<{ ok: boolean }>) {
    setSaving(true);
    const res = await fn();
    setSaving(false);
    if (res.ok) { router.refresh(); onClose(); }
    else alert(lang === "sq" ? "Veprimi dështoi. Kyçuni dhe sigurohuni që tabelat ekzistojnë." : "Action failed. Log in and ensure tables exist.");
  }
  async function del(fn: () => Promise<{ ok: boolean }>, label: string) {
    if (!confirm(lang === "sq" ? `Të fshihet ${label}?` : `Delete ${label}?`)) return;
    await run(fn);
  }
  return { saving, run, del, lang };
}

// ── Activity ─────────────────────────────────────────────────────────
export function AddActivityModal({ open, onClose, fieldId, editing }: { open: boolean; onClose: () => void; fieldId?: string; editing?: any }) {
  const { fields } = useFarm();
  const { saving, run, del, lang } = useSubmit(onClose);
  const [f, setF] = useState(() => ({
    field_id: editing?.field_id ?? fieldId ?? "",
    activity_type: editing?.activity_type ?? "fertilizing",
    activity_date: editing?.activity_date ?? today(),
    description: editing?.description ?? "",
    input_used: editing?.input_used ?? "",
    input_quantity: editing?.input_quantity != null ? String(editing.input_quantity) : "",
    input_unit: editing?.input_unit ?? "kg",
    cost_eur: editing?.cost_eur ? String(editing.cost_eur) : "",
    performed_by: editing?.performed_by ?? "self",
  }));
  const s = (k: string, v: string) => setF((p) => ({ ...p, [k]: v }));
  const payload = () => ({ field_id: f.field_id || null, activity_type: f.activity_type, activity_date: f.activity_date, description: f.description, input_used: f.input_used || null, input_quantity: f.input_quantity ? Number(f.input_quantity) : null, input_unit: f.input_unit, cost_eur: f.cost_eur ? Number(f.cost_eur) : 0, performed_by: f.performed_by });
  return (
    <Modal open={open} onClose={onClose} title={editing ? (lang === "sq" ? "Ndrysho Aktivitetin" : "Edit Activity") : (lang === "sq" ? "Regjistro Aktivitet" : "Log Activity")}>
      <form onSubmit={(e) => { e.preventDefault(); run(() => editing ? updateActivity(editing.id, payload()) : createActivity(payload())); }} className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <Field label={lang === "sq" ? "Lloji" : "Type"}>
            <select className="input" value={f.activity_type} onChange={(e) => s("activity_type", e.target.value)}>
              {Object.entries(ACTIVITY_LABELS).map(([k, v]) => <option key={k} value={k}>{v.icon} {v[lang]}</option>)}
            </select>
          </Field>
          <Field label={lang === "sq" ? "Data" : "Date"}><input type="date" className="input" value={f.activity_date} onChange={(e) => s("activity_date", e.target.value)} /></Field>
        </div>
        <Field label={lang === "sq" ? "Fusha" : "Field"}>
          <select className="input" value={f.field_id} onChange={(e) => s("field_id", e.target.value)}>
            <option value="">{lang === "sq" ? "— Asnjë —" : "— None —"}</option>
            {fields.map((fl) => <option key={fl.id} value={fl.id}>{fl.name}</option>)}
          </select>
        </Field>
        <Field label={lang === "sq" ? "Përshkrimi" : "Description"} hint={lang === "sq" ? "Përdor mikrofonin për ta shkruar me zë" : "Use the mic to dictate"}>
          <div className="flex gap-2">
            <textarea className="input" rows={2} value={f.description} onChange={(e) => s("description", e.target.value)} />
            <VoiceButton onText={(t) => setF((p) => ({ ...p, description: (p.description ? p.description + " " : "") + t }))} />
          </div>
        </Field>
        <div className="grid grid-cols-3 gap-3">
          <Field label="Input"><input className="input" value={f.input_used} onChange={(e) => s("input_used", e.target.value)} placeholder="KAN 27%" /></Field>
          <Field label={lang === "sq" ? "Sasia" : "Qty"}><input type="number" step="any" className="input" value={f.input_quantity} onChange={(e) => s("input_quantity", e.target.value)} /></Field>
          <Field label={lang === "sq" ? "Kosto €" : "Cost €"}><input type="number" step="any" className="input" value={f.cost_eur} onChange={(e) => s("cost_eur", e.target.value)} /></Field>
        </div>
        <SaveBar saving={saving} onClose={onClose} lang={lang} onDelete={editing ? () => del(() => deleteActivity(editing.id), lang === "sq" ? "aktivitetin" : "activity") : undefined} />
      </form>
    </Modal>
  );
}

// ── Inventory ────────────────────────────────────────────────────────
export function AddInventoryModal({ open, onClose, editing }: { open: boolean; onClose: () => void; editing?: any }) {
  const { saving, run, del, lang } = useSubmit(onClose);
  const [f, setF] = useState(() => ({
    item_name: editing?.item_name ?? "", category: editing?.category ?? "fertilizer",
    quantity: editing?.quantity != null ? String(editing.quantity) : "", unit: editing?.unit ?? "kg",
    purchase_date: editing?.purchase_date ?? today(), purchase_price_eur: editing?.purchase_price_eur ? String(editing.purchase_price_eur) : "",
    supplier: editing?.supplier ?? "", low_stock_threshold: editing?.low_stock_threshold ? String(editing.low_stock_threshold) : "",
  }));
  const s = (k: string, v: string) => setF((p) => ({ ...p, [k]: v }));
  const payload = () => ({ item_name: f.item_name.trim(), category: f.category, quantity: Number(f.quantity || 0), unit: f.unit, purchase_date: f.purchase_date, purchase_price_eur: Number(f.purchase_price_eur || 0), supplier: f.supplier, low_stock_threshold: Number(f.low_stock_threshold || 0) });
  return (
    <Modal open={open} onClose={onClose} title={editing ? (lang === "sq" ? "Ndrysho Artikullin" : "Edit Item") : (lang === "sq" ? "Shto Artikull" : "Add Item")}>
      <form onSubmit={(e) => { e.preventDefault(); if (!f.item_name.trim()) return; run(() => editing ? updateInventory(editing.id, payload()) : createInventory(payload())); }} className="space-y-3">
        <Field label={lang === "sq" ? "Emri i artikullit" : "Item name"}><input className="input" value={f.item_name} onChange={(e) => s("item_name", e.target.value)} /></Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label={lang === "sq" ? "Kategoria" : "Category"}>
            <select className="input" value={f.category} onChange={(e) => s("category", e.target.value)}>
              {Object.entries(INVENTORY_LABELS).map(([k, v]) => <option key={k} value={k}>{v[lang]}</option>)}
            </select>
          </Field>
          <Field label={lang === "sq" ? "Furnizuesi" : "Supplier"}><input className="input" value={f.supplier} onChange={(e) => s("supplier", e.target.value)} /></Field>
        </div>
        <div className="grid grid-cols-3 gap-3">
          <Field label={lang === "sq" ? "Sasia" : "Quantity"}><input type="number" step="any" className="input" value={f.quantity} onChange={(e) => s("quantity", e.target.value)} /></Field>
          <Field label={lang === "sq" ? "Njësia" : "Unit"}><input className="input" value={f.unit} onChange={(e) => s("unit", e.target.value)} /></Field>
          <Field label={lang === "sq" ? "Kosto €" : "Cost €"}><input type="number" step="any" className="input" value={f.purchase_price_eur} onChange={(e) => s("purchase_price_eur", e.target.value)} /></Field>
        </div>
        <Field label={lang === "sq" ? "Prag stoku të ulët" : "Low-stock threshold"} hint={lang === "sq" ? "Njoftohu kur bie nën këtë sasi" : "Warn when below this amount"}>
          <input type="number" step="any" className="input" value={f.low_stock_threshold} onChange={(e) => s("low_stock_threshold", e.target.value)} />
        </Field>
        <SaveBar saving={saving} onClose={onClose} lang={lang} onDelete={editing ? () => del(() => deleteInventory(editing.id), lang === "sq" ? "artikullin" : "item") : undefined} />
      </form>
    </Modal>
  );
}

// ── Soil ─────────────────────────────────────────────────────────────
export function AddSoilModal({ open, onClose, editing }: { open: boolean; onClose: () => void; editing?: any }) {
  const { fields } = useFarm();
  const { saving, run, del, lang } = useSubmit(onClose);
  const v0 = (x: any) => (x != null ? String(x) : "");
  const [f, setF] = useState(() => ({
    field_id: editing?.field_id ?? "", analysis_date: editing?.analysis_date ?? today(),
    ph: v0(editing?.ph), nitrogen_ppm: v0(editing?.nitrogen_ppm), phosphorus_ppm: v0(editing?.phosphorus_ppm),
    potassium_ppm: v0(editing?.potassium_ppm), organic_matter_pct: v0(editing?.organic_matter_pct), moisture_pct: v0(editing?.moisture_pct),
    lab_name: editing?.lab_name ?? "",
  }));
  const s = (k: string, v: string) => setF((p) => ({ ...p, [k]: v }));
  const n = (v: string) => Number(v || 0);
  const payload = () => ({ field_id: f.field_id, analysis_date: f.analysis_date, ph: n(f.ph), nitrogen_ppm: n(f.nitrogen_ppm), phosphorus_ppm: n(f.phosphorus_ppm), potassium_ppm: n(f.potassium_ppm), organic_matter_pct: n(f.organic_matter_pct), moisture_pct: n(f.moisture_pct), lab_name: f.lab_name });
  return (
    <Modal open={open} onClose={onClose} title={editing ? (lang === "sq" ? "Ndrysho Analizën" : "Edit Analysis") : (lang === "sq" ? "Shto Analizë Toke" : "Add Soil Analysis")}>
      <form onSubmit={(e) => { e.preventDefault(); if (!f.field_id) { alert(lang === "sq" ? "Zgjidh një fushë." : "Pick a field."); return; } run(() => editing ? updateSoil(editing.id, payload()) : createSoil(payload())); }} className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <Field label={lang === "sq" ? "Fusha" : "Field"}>
            <select className="input" value={f.field_id} onChange={(e) => s("field_id", e.target.value)}>
              <option value="">{lang === "sq" ? "Zgjidh…" : "Select…"}</option>
              {fields.map((fl) => <option key={fl.id} value={fl.id}>{fl.name}</option>)}
            </select>
          </Field>
          <Field label={lang === "sq" ? "Data" : "Date"}><input type="date" className="input" value={f.analysis_date} onChange={(e) => s("analysis_date", e.target.value)} /></Field>
        </div>
        <div className="grid grid-cols-3 gap-3">
          <Field label="pH"><input type="number" step="any" className="input" value={f.ph} onChange={(e) => s("ph", e.target.value)} /></Field>
          <Field label="N (ppm)"><input type="number" step="any" className="input" value={f.nitrogen_ppm} onChange={(e) => s("nitrogen_ppm", e.target.value)} /></Field>
          <Field label="P (ppm)"><input type="number" step="any" className="input" value={f.phosphorus_ppm} onChange={(e) => s("phosphorus_ppm", e.target.value)} /></Field>
          <Field label="K (ppm)"><input type="number" step="any" className="input" value={f.potassium_ppm} onChange={(e) => s("potassium_ppm", e.target.value)} /></Field>
          <Field label="OM %"><input type="number" step="any" className="input" value={f.organic_matter_pct} onChange={(e) => s("organic_matter_pct", e.target.value)} /></Field>
          <Field label={lang === "sq" ? "Lagësht %" : "Moist %"}><input type="number" step="any" className="input" value={f.moisture_pct} onChange={(e) => s("moisture_pct", e.target.value)} /></Field>
        </div>
        <Field label={lang === "sq" ? "Laboratori" : "Lab"}><input className="input" value={f.lab_name} onChange={(e) => s("lab_name", e.target.value)} /></Field>
        <SaveBar saving={saving} onClose={onClose} lang={lang} onDelete={editing ? () => del(() => deleteSoil(editing.id), lang === "sq" ? "analizën" : "analysis") : undefined} />
      </form>
    </Modal>
  );
}

// ── Planting ─────────────────────────────────────────────────────────
export function AddPlantingModal({ open, onClose, editing }: { open: boolean; onClose: () => void; editing?: any }) {
  const { fields } = useFarm();
  const { saving, run, del, lang } = useSubmit(onClose);
  const [f, setF] = useState(() => ({
    field_id: editing?.field_id ?? "", crop_id: editing?.crop_id ?? "wheat",
    planting_date: editing?.planting_date ?? today(), expected_harvest_date: editing?.expected_harvest_date ?? "",
    seed_variety: editing?.seed_variety ?? "", seed_quantity_kg: editing?.seed_quantity_kg ? String(editing.seed_quantity_kg) : "",
    notes: editing?.notes ?? "", status: editing?.status ?? "active",
    yield_kg: editing?.yield_kg ? String(editing.yield_kg) : "",
  }));
  const s = (k: string, v: string) => setF((p) => ({ ...p, [k]: v }));
  const base = () => ({ field_id: f.field_id, crop_id: f.crop_id, planting_date: f.planting_date, expected_harvest_date: f.expected_harvest_date || f.planting_date, seed_variety: f.seed_variety, seed_quantity_kg: Number(f.seed_quantity_kg || 0), notes: f.notes });
  return (
    <Modal open={open} onClose={onClose} title={editing ? (lang === "sq" ? "Ndrysho Mbjelljen" : "Edit Planting") : (lang === "sq" ? "Mbjellje e Re" : "New Planting")}>
      <form onSubmit={(e) => { e.preventDefault(); if (!f.field_id) { alert(lang === "sq" ? "Zgjidh një fushë." : "Pick a field."); return; } run(() => editing ? updatePlanting(editing.id, { ...base(), status: f.status, yield_kg: f.yield_kg ? Number(f.yield_kg) : null }) : createPlanting(base())); }} className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <Field label={lang === "sq" ? "Fusha" : "Field"}>
            <select className="input" value={f.field_id} onChange={(e) => s("field_id", e.target.value)}>
              <option value="">{lang === "sq" ? "Zgjidh…" : "Select…"}</option>
              {fields.map((fl) => <option key={fl.id} value={fl.id}>{fl.name}</option>)}
            </select>
          </Field>
          <Field label={lang === "sq" ? "Kultura" : "Crop"}>
            <select className="input" value={f.crop_id} onChange={(e) => s("crop_id", e.target.value)}>
              {CROPS.map((c) => <option key={c.id} value={c.id}>{c.icon_emoji} {cropName(c.id, lang)}</option>)}
            </select>
          </Field>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Field label={lang === "sq" ? "Data e mbjelljes" : "Planting date"}><input type="date" className="input" value={f.planting_date} onChange={(e) => s("planting_date", e.target.value)} /></Field>
          <Field label={lang === "sq" ? "Korrje e pritur" : "Expected harvest"}><input type="date" className="input" value={f.expected_harvest_date} onChange={(e) => s("expected_harvest_date", e.target.value)} /></Field>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Field label={lang === "sq" ? "Varieteti" : "Variety"}><input className="input" value={f.seed_variety} onChange={(e) => s("seed_variety", e.target.value)} /></Field>
          <Field label={lang === "sq" ? "Sasia e farës (kg)" : "Seed qty (kg)"}><input type="number" step="any" className="input" value={f.seed_quantity_kg} onChange={(e) => s("seed_quantity_kg", e.target.value)} /></Field>
        </div>
        {editing && (
          <div className="grid grid-cols-2 gap-3">
            <Field label="Status">
              <select className="input" value={f.status} onChange={(e) => s("status", e.target.value)}>
                <option value="active">{lang === "sq" ? "Aktive" : "Active"}</option>
                <option value="harvested">{lang === "sq" ? "Korrur" : "Harvested"}</option>
                <option value="planned">{lang === "sq" ? "Planifikuar" : "Planned"}</option>
                <option value="failed">{lang === "sq" ? "Dështoi" : "Failed"}</option>
              </select>
            </Field>
            <Field label={lang === "sq" ? "Rendimenti (kg)" : "Yield (kg)"}><input type="number" step="any" className="input" value={f.yield_kg} onChange={(e) => s("yield_kg", e.target.value)} /></Field>
          </div>
        )}
        <Field label={lang === "sq" ? "Shënime" : "Notes"}><textarea className="input" rows={2} value={f.notes} onChange={(e) => s("notes", e.target.value)} /></Field>
        <SaveBar saving={saving} onClose={onClose} lang={lang} onDelete={editing ? () => del(() => deletePlanting(editing.id), lang === "sq" ? "mbjelljen" : "planting") : undefined} />
      </form>
    </Modal>
  );
}
