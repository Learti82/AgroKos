"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Modal, Field } from "@/components/ui/Modal";
import { useApp } from "@/lib/store";
import { useFarm } from "@/components/DataProvider";
import { CROPS, cropName } from "@/lib/data/crops";
import { ACTIVITY_LABELS, INVENTORY_LABELS } from "@/lib/i18n";
import {
  createActivity, createInventory, createSoil, createPlanting,
} from "@/app/actions/farm";
import { Loader2 } from "lucide-react";

const today = () => new Date().toISOString().slice(0, 10);

function SaveBar({ saving, onClose, lang }: { saving: boolean; onClose: () => void; lang: "sq" | "en" }) {
  return (
    <div className="mt-4 flex justify-end gap-2">
      <button type="button" onClick={onClose} className="btn-secondary">{lang === "sq" ? "Anulo" : "Cancel"}</button>
      <button type="submit" disabled={saving} className="btn-primary">
        {saving && <Loader2 className="h-4 w-4 animate-spin" />}{lang === "sq" ? "Ruaj" : "Save"}
      </button>
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
    else alert(lang === "sq" ? "Ruajtja dështoi. Kyçuni dhe sigurohuni që tabelat ekzistojnë." : "Save failed. Log in and ensure tables exist.");
  }
  return { saving, run, lang };
}

// ── Activity ─────────────────────────────────────────────────────────
export function AddActivityModal({ open, onClose, fieldId }: { open: boolean; onClose: () => void; fieldId?: string }) {
  const { fields } = useFarm();
  const { saving, run, lang } = useSubmit(onClose);
  const [f, setF] = useState({ field_id: fieldId ?? "", activity_type: "fertilizing", activity_date: today(), description: "", input_used: "", input_quantity: "", input_unit: "kg", cost_eur: "", performed_by: "self" });
  const s = (k: string, v: string) => setF((p) => ({ ...p, [k]: v }));
  return (
    <Modal open={open} onClose={onClose} title={lang === "sq" ? "Regjistro Aktivitet" : "Log Activity"}>
      <form onSubmit={(e) => { e.preventDefault(); run(() => createActivity({ field_id: f.field_id || null, activity_type: f.activity_type, activity_date: f.activity_date, description: f.description, input_used: f.input_used || null, input_quantity: f.input_quantity ? Number(f.input_quantity) : null, input_unit: f.input_unit, cost_eur: f.cost_eur ? Number(f.cost_eur) : 0, performed_by: f.performed_by })); }} className="space-y-3">
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
        <Field label={lang === "sq" ? "Përshkrimi" : "Description"}><textarea className="input" rows={2} value={f.description} onChange={(e) => s("description", e.target.value)} /></Field>
        <div className="grid grid-cols-3 gap-3">
          <Field label="Input"><input className="input" value={f.input_used} onChange={(e) => s("input_used", e.target.value)} placeholder="KAN 27%" /></Field>
          <Field label={lang === "sq" ? "Sasia" : "Qty"}><input type="number" step="any" className="input" value={f.input_quantity} onChange={(e) => s("input_quantity", e.target.value)} /></Field>
          <Field label={lang === "sq" ? "Kosto €" : "Cost €"}><input type="number" step="any" className="input" value={f.cost_eur} onChange={(e) => s("cost_eur", e.target.value)} /></Field>
        </div>
        <SaveBar saving={saving} onClose={onClose} lang={lang} />
      </form>
    </Modal>
  );
}

// ── Inventory ────────────────────────────────────────────────────────
export function AddInventoryModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { saving, run, lang } = useSubmit(onClose);
  const [f, setF] = useState({ item_name: "", category: "fertilizer", quantity: "", unit: "kg", purchase_date: today(), purchase_price_eur: "", supplier: "", low_stock_threshold: "" });
  const s = (k: string, v: string) => setF((p) => ({ ...p, [k]: v }));
  return (
    <Modal open={open} onClose={onClose} title={lang === "sq" ? "Shto Artikull" : "Add Item"}>
      <form onSubmit={(e) => { e.preventDefault(); if (!f.item_name.trim()) return; run(() => createInventory({ item_name: f.item_name.trim(), category: f.category, quantity: Number(f.quantity || 0), unit: f.unit, purchase_date: f.purchase_date, purchase_price_eur: Number(f.purchase_price_eur || 0), supplier: f.supplier, low_stock_threshold: Number(f.low_stock_threshold || 0) })); }} className="space-y-3">
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
        <SaveBar saving={saving} onClose={onClose} lang={lang} />
      </form>
    </Modal>
  );
}

// ── Soil ─────────────────────────────────────────────────────────────
export function AddSoilModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { fields } = useFarm();
  const { saving, run, lang } = useSubmit(onClose);
  const [f, setF] = useState({ field_id: "", analysis_date: today(), ph: "", nitrogen_ppm: "", phosphorus_ppm: "", potassium_ppm: "", organic_matter_pct: "", moisture_pct: "", lab_name: "" });
  const s = (k: string, v: string) => setF((p) => ({ ...p, [k]: v }));
  const n = (v: string) => Number(v || 0);
  return (
    <Modal open={open} onClose={onClose} title={lang === "sq" ? "Shto Analizë Toke" : "Add Soil Analysis"}>
      <form onSubmit={(e) => { e.preventDefault(); if (!f.field_id) { alert(lang === "sq" ? "Zgjidh një fushë." : "Pick a field."); return; } run(() => createSoil({ field_id: f.field_id, analysis_date: f.analysis_date, ph: n(f.ph), nitrogen_ppm: n(f.nitrogen_ppm), phosphorus_ppm: n(f.phosphorus_ppm), potassium_ppm: n(f.potassium_ppm), organic_matter_pct: n(f.organic_matter_pct), moisture_pct: n(f.moisture_pct), lab_name: f.lab_name })); }} className="space-y-3">
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
        <SaveBar saving={saving} onClose={onClose} lang={lang} />
      </form>
    </Modal>
  );
}

// ── Planting ─────────────────────────────────────────────────────────
export function AddPlantingModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { fields } = useFarm();
  const { saving, run, lang } = useSubmit(onClose);
  const [f, setF] = useState({ field_id: "", crop_id: "wheat", planting_date: today(), expected_harvest_date: "", seed_variety: "", seed_quantity_kg: "", notes: "" });
  const s = (k: string, v: string) => setF((p) => ({ ...p, [k]: v }));
  return (
    <Modal open={open} onClose={onClose} title={lang === "sq" ? "Mbjellje e Re" : "New Planting"}>
      <form onSubmit={(e) => { e.preventDefault(); if (!f.field_id) { alert(lang === "sq" ? "Zgjidh një fushë." : "Pick a field."); return; } run(() => createPlanting({ field_id: f.field_id, crop_id: f.crop_id, planting_date: f.planting_date, expected_harvest_date: f.expected_harvest_date || f.planting_date, seed_variety: f.seed_variety, seed_quantity_kg: Number(f.seed_quantity_kg || 0), notes: f.notes })); }} className="space-y-3">
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
        <Field label={lang === "sq" ? "Shënime" : "Notes"}><textarea className="input" rows={2} value={f.notes} onChange={(e) => s("notes", e.target.value)} /></Field>
        <SaveBar saving={saving} onClose={onClose} lang={lang} />
      </form>
    </Modal>
  );
}
