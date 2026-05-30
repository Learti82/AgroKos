"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import "maplibre-gl/dist/maplibre-gl.css";
import { Modal, Field } from "@/components/ui/Modal";
import { SAT_STYLE } from "@/components/MapView";
import { CROPS, cropName } from "@/lib/data/crops";
import { SOIL_LABELS, IRRIGATION_LABELS } from "@/lib/i18n";
import { KOSOVO_MUNICIPALITIES } from "@/lib/data/demo";
import { createField } from "@/app/actions/farm";
import { useApp } from "@/lib/store";
import { fmtHa } from "@/lib/utils";
import { Undo2, Trash2, MapPin, Loader2 } from "lucide-react";

const EMPTY = { type: "FeatureCollection", features: [] } as const;

// Spherical polygon area in hectares.
function areaHa(ring: [number, number][]): number {
  if (ring.length < 3) return 0;
  const R = 6378137;
  let total = 0;
  for (let i = 0; i < ring.length; i++) {
    const [x1, y1] = ring[i];
    const [x2, y2] = ring[(i + 1) % ring.length];
    total += ((x2 - x1) * Math.PI) / 180 * (2 + Math.sin((y1 * Math.PI) / 180) + Math.sin((y2 * Math.PI) / 180));
  }
  return Math.abs((total * R * R) / 2) / 10000;
}

export function AddFieldModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { lang } = useApp();
  const router = useRouter();
  const mapEl = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const ptsRef = useRef<[number, number][]>([]);
  const [pts, setPts] = useState<[number, number][]>([]);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: "", soil_type: "loam", irrigation_type: "drip", crop: "",
    municipality: KOSOVO_MUNICIPALITIES[0], village: "",
  });

  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  function redraw() {
    const map = mapRef.current;
    if (!map?.getSource) return;
    const ring = ptsRef.current;
    const poly = ring.length >= 3
      ? { type: "FeatureCollection", features: [{ type: "Feature", properties: {}, geometry: { type: "Polygon", coordinates: [[...ring, ring[0]]] } }] }
      : EMPTY;
    map.getSource("draw")?.setData(poly);
    map.getSource("pts")?.setData({
      type: "FeatureCollection",
      features: ring.map((p) => ({ type: "Feature", properties: {}, geometry: { type: "Point", coordinates: p } })),
    });
  }

  useEffect(() => {
    if (!open) return;
    let cancelled = false;
    let map: any;
    (async () => {
      const maplibregl = (await import("maplibre-gl")).default;
      if (cancelled || !mapEl.current) return;
      map = new maplibregl.Map({ container: mapEl.current, style: SAT_STYLE as any, center: [20.9, 42.6], zoom: 8 });
      map.addControl(new maplibregl.NavigationControl({ showCompass: false }), "top-right");
      mapRef.current = map;
      map.on("load", () => {
        map.addSource("draw", { type: "geojson", data: EMPTY });
        map.addSource("pts", { type: "geojson", data: EMPTY });
        map.addLayer({ id: "draw-fill", type: "fill", source: "draw", paint: { "fill-color": "#52B788", "fill-opacity": 0.4 } });
        map.addLayer({ id: "draw-line", type: "line", source: "draw", paint: { "line-color": "#2D6A4F", "line-width": 2.5 } });
        map.addLayer({ id: "pts", type: "circle", source: "pts", paint: { "circle-radius": 5, "circle-color": "#fff", "circle-stroke-color": "#2D6A4F", "circle-stroke-width": 2 } });
      });
      map.on("click", (e: any) => {
        ptsRef.current = [...ptsRef.current, [e.lngLat.lng, e.lngLat.lat]];
        setPts([...ptsRef.current]);
        redraw();
      });
    })();
    return () => {
      cancelled = true;
      map?.remove();
      mapRef.current = null;
      ptsRef.current = [];
      setPts([]);
      setForm({ name: "", soil_type: "loam", irrigation_type: "drip", crop: "", municipality: KOSOVO_MUNICIPALITIES[0], village: "" });
    };
  }, [open]);

  const undo = () => { ptsRef.current = ptsRef.current.slice(0, -1); setPts([...ptsRef.current]); redraw(); };
  const clear = () => { ptsRef.current = []; setPts([]); redraw(); };

  const ring = pts;
  const ha = areaHa(ring);

  async function save() {
    if (!form.name.trim()) { alert(lang === "sq" ? "Shkruani emrin e fushës." : "Enter a field name."); return; }
    if (ring.length < 3) { alert(lang === "sq" ? "Vizatoni fushën në hartë (të paktën 3 pika)." : "Draw the field on the map (at least 3 points)."); return; }
    setSaving(true);
    const [cx, cy] = ring.reduce(([ax, ay], p) => [ax + p[0], ay + p[1]], [0, 0]).map((v) => v / ring.length);
    const res = await createField({
      name: form.name.trim(),
      area_ha: Math.round(ha * 1000) / 1000,
      soil_type: form.soil_type,
      irrigation_type: form.irrigation_type,
      municipality: form.municipality,
      village: form.village,
      latitude: cy,
      longitude: cx,
      current_crop_id: form.crop || null,
      geojson: { type: "Polygon", coordinates: [[...ring, ring[0]]] },
    });
    setSaving(false);
    if (res.ok) { router.refresh(); onClose(); }
    else alert(lang === "sq" ? "Ruajtja dështoi. Sigurohuni që jeni i kyçur dhe tabelat janë krijuar." : "Save failed. Make sure you're logged in and tables exist.");
  }

  return (
    <Modal open={open} onClose={onClose} wide
      title={lang === "sq" ? "Shto Fushë të Re" : "Add New Field"}
      subtitle={lang === "sq" ? "Kliko në hartë për të vizatuar kufijtë e fushës" : "Click on the map to draw the field boundary"}>
      <div className="grid gap-4 lg:grid-cols-2">
        <div>
          <div ref={mapEl} className="h-72 overflow-hidden rounded-card bg-[#0b1f17]" />
          <div className="mt-2 flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="h-4 w-4 text-brand-green" />
              <span className="font-semibold text-brand-charcoal">{ha > 0 ? fmtHa(ha) : "—"}</span>
              <span className="text-brand-charcoal/45">· {ring.length} {lang === "sq" ? "pika" : "points"}</span>
            </div>
            <div className="flex gap-2">
              <button onClick={undo} disabled={!ring.length} className="btn-ghost px-2 py-1 text-xs"><Undo2 className="h-3.5 w-3.5" /> {lang === "sq" ? "Zhbëj" : "Undo"}</button>
              <button onClick={clear} disabled={!ring.length} className="btn-ghost px-2 py-1 text-xs"><Trash2 className="h-3.5 w-3.5" /> {lang === "sq" ? "Pastro" : "Clear"}</button>
            </div>
          </div>
          <p className="mt-1 rounded-lg bg-brand-lime/30 p-2 text-[11px] text-brand-charcoal/60">
            💡 {lang === "sq" ? "Zmadho hartën te fusha jote, pastaj kliko cep pas cepi për ta vizatuar. Sipërfaqja llogaritet vetë." : "Zoom to your field, then click corner by corner to outline it. Area is calculated automatically."}
          </p>
        </div>

        <div className="space-y-3">
          <Field label={lang === "sq" ? "Emri i fushës" : "Field name"}>
            <input className="input" value={form.name} onChange={(e) => set("name", e.target.value)} placeholder={lang === "sq" ? "p.sh. Ara e madhe" : "e.g. Big field"} />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label={lang === "sq" ? "Lloji i tokës" : "Soil type"}>
              <select className="input" value={form.soil_type} onChange={(e) => set("soil_type", e.target.value)}>
                {Object.entries(SOIL_LABELS).map(([k, v]) => <option key={k} value={k}>{v[lang]}</option>)}
              </select>
            </Field>
            <Field label={lang === "sq" ? "Ujitja" : "Irrigation"}>
              <select className="input" value={form.irrigation_type} onChange={(e) => set("irrigation_type", e.target.value)}>
                {Object.entries(IRRIGATION_LABELS).map(([k, v]) => <option key={k} value={k}>{v[lang]}</option>)}
              </select>
            </Field>
          </div>
          <Field label={lang === "sq" ? "Kultura aktuale (opsionale)" : "Current crop (optional)"}>
            <select className="input" value={form.crop} onChange={(e) => set("crop", e.target.value)}>
              <option value="">{lang === "sq" ? "Asnjë" : "None"}</option>
              {CROPS.map((c) => <option key={c.id} value={c.id}>{c.icon_emoji} {cropName(c.id, lang)}</option>)}
            </select>
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label={lang === "sq" ? "Komuna" : "Municipality"}>
              <select className="input" value={form.municipality} onChange={(e) => set("municipality", e.target.value)}>
                {KOSOVO_MUNICIPALITIES.map((m) => <option key={m}>{m}</option>)}
              </select>
            </Field>
            <Field label={lang === "sq" ? "Fshati" : "Village"}>
              <input className="input" value={form.village} onChange={(e) => set("village", e.target.value)} />
            </Field>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button onClick={onClose} className="btn-secondary">{lang === "sq" ? "Anulo" : "Cancel"}</button>
            <button onClick={save} disabled={saving} className="btn-primary">
              {saving && <Loader2 className="h-4 w-4 animate-spin" />}
              {lang === "sq" ? "Ruaj Fushën" : "Save Field"}
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
