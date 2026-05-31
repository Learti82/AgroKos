"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/lib/store";
import { PageHeader, Card, CardHeader, Badge, HelpNote } from "@/components/ui/primitives";
import { Modal } from "@/components/ui/Modal";
import { Sparkline } from "@/components/widgets";
import { PriceHistoryChart } from "@/components/charts";
import { useFarm } from "@/components/DataProvider";
import { saveMarketPrices } from "@/app/actions/farm";
import { MARKET_PRICES } from "@/lib/data/demo";
import { cropById, cropName, CROPS } from "@/lib/data/crops";
import { fmtEur, cn } from "@/lib/utils";
import { fmtDateSq } from "@/lib/dates";
import { TrendingUp, TrendingDown, Minus, Pencil, Loader2 } from "lucide-react";

const LOCATIONS = ["Prishtinë", "Prizren", "Pejë", "Mesatare kombëtare"];

export default function MarketPage() {
  const { lang } = useApp();
  const { prices } = useFarm();
  const [loc, setLoc] = useState(LOCATIONS[0]);
  const [selected, setSelected] = useState("tomato");
  const [editing, setEditing] = useState(false);

  // Effective price: real entered value if present, otherwise the sample.
  const eff = (cropId: string) => {
    const m = MARKET_PRICES.find((x) => x.crop_id === cropId)!;
    const real = prices[cropId];
    if (real) {
      const pct = real.prev ? ((real.price - real.prev) / real.prev) * 100 : 0;
      return { price: real.price, pct: Math.round(pct * 10) / 10, trend: pct > 1.5 ? "up" : pct < -1.5 ? "down" : "stable", real: true, history: m.history };
    }
    return { price: m.price_eur_kg, pct: m.pct_change_week, trend: m.trend, real: false, history: m.history };
  };

  const anyReal = Object.keys(prices).length > 0;
  const updated = Object.values(prices).map((p) => p.date).sort().pop() ?? MARKET_PRICES[0].price_date;

  const sel = eff(selected);
  const selCrop = cropById(selected)!;
  const avg6 = sel.history.slice(-6).reduce((s, h) => s + h.price, 0) / 6;
  const goodToSell = sel.price >= avg6;

  return (
    <div className="space-y-5">
      <PageHeader
        title={lang === "sq" ? "Çmimet e Tregut" : "Market Prices"}
        subtitle={`${lang === "sq" ? "Përditësuar" : "Updated"}: ${fmtDateSq(updated)}`}
        action={
          <div className="flex gap-2">
            <select className="input max-w-[180px]" value={loc} onChange={(e) => setLoc(e.target.value)}>
              {LOCATIONS.map((l) => <option key={l}>{l}</option>)}
            </select>
            <button onClick={() => setEditing(true)} className="btn-primary"><Pencil className="h-4 w-4" /> {lang === "sq" ? "Përditëso" : "Update"}</button>
          </div>
        }
      />

      <HelpNote>
        {anyReal
          ? (lang === "sq"
            ? "Po shfaqen çmimet REALE që ke futur. Përditësoji javore nga burimet zyrtare (p.sh. SIT Kosova ose ASK) duke klikuar “Përditëso”. Ndryshimi javor llogaritet nga përditësimi i fundit."
            : "Showing the REAL prices you entered. Update them weekly from official sources (e.g. SIT Kosova or ASK) via “Update”. The weekly change is computed from your last update.")
          : (lang === "sq"
            ? "Këto janë çmime ilustruese derisa të futësh të tuat. Kliko “Përditëso” dhe fut çmimet reale nga burimet zyrtare: SIT Kosova (sitkosova.org) ose ASK (ask.rks-gov.net). Pastaj rifreskohen javore me një klikim."
            : "These are sample prices until you enter your own. Click “Update” and enter real prices from official sources: SIT Kosova (sitkosova.org) or ASK (ask.rks-gov.net).")}
      </HelpNote>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2 p-0">
          <div className="flex items-center justify-between border-b border-line p-4">
            <h3 className="font-semibold text-brand-charcoal">{lang === "sq" ? "Çmimet aktuale" : "Current prices"} · {loc}</h3>
            {anyReal && <Badge tone="good">{lang === "sq" ? "TË DHËNA REALE" : "REAL DATA"}</Badge>}
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs uppercase text-brand-charcoal/45">
                  <th className="px-4 py-2 font-medium">{lang === "sq" ? "Kultura" : "Crop"}</th>
                  <th className="px-4 py-2 text-right font-medium">€/kg</th>
                  <th className="px-4 py-2 text-right font-medium">{lang === "sq" ? "Java" : "Week"}</th>
                  <th className="px-4 py-2 text-right font-medium">12 {lang === "sq" ? "muaj" : "mo"}</th>
                </tr>
              </thead>
              <tbody>
                {CROPS.map((crop, i) => {
                  const e = eff(crop.id);
                  const Icon = e.trend === "up" ? TrendingUp : e.trend === "down" ? TrendingDown : Minus;
                  const tone = e.trend === "up" ? "text-brand-green" : e.trend === "down" ? "text-red-600" : "text-brand-charcoal/40";
                  return (
                    <tr key={crop.id} onClick={() => setSelected(crop.id)} className={cn("cursor-pointer transition hover:bg-brand-lime/20", i % 2 === 1 && "bg-zebra", selected === crop.id && "bg-brand-lime/30")}>
                      <td className="px-4 py-2.5 font-medium">{crop.icon_emoji} {cropName(crop.id, lang)}{e.real && <span className="ml-1 text-brand-green">•</span>}</td>
                      <td className="px-4 py-2.5 text-right font-semibold tabular-nums">{fmtEur(e.price)}</td>
                      <td className={cn("px-4 py-2.5 text-right tabular-nums", tone)}>
                        <span className="inline-flex items-center gap-0.5"><Icon className="h-3.5 w-3.5" />{Math.abs(e.pct)}%</span>
                      </td>
                      <td className="px-4 py-2.5"><div className="flex justify-end"><Sparkline data={e.history.map((h) => h.price)} color={crop.color_hex} /></div></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>

        <div className="space-y-4">
          <Card className={cn("border-l-4", goodToSell ? "border-brand-green" : "border-brand-amber")}>
            <CardHeader title={lang === "sq" ? "Këshilltari i Shitjes" : "Sell Advisor"} subtitle={cropName(selCrop.id, lang)} />
            <p className="font-display text-3xl font-bold text-brand-charcoal">{fmtEur(sel.price)}<span className="text-base font-normal text-brand-charcoal/50">/kg</span></p>
            <p className="mt-1 text-xs text-brand-charcoal/55">{lang === "sq" ? "Mesatarja 6-mujore" : "6-month avg"}: {fmtEur(avg6)}</p>
            <div className="mt-3">
              {goodToSell ? (
                <Badge tone="good">✅ {lang === "sq" ? "Koha e mirë për shitje" : "Good time to sell"}</Badge>
              ) : (
                <Badge tone="warning">⏳ {lang === "sq" ? "Prit 2-3 javë" : "Wait 2-3 weeks"}</Badge>
              )}
            </div>
          </Card>
        </div>
      </div>

      <Card>
        <CardHeader
          title={`${lang === "sq" ? "Historiku 12-mujor" : "12-month history"} · ${selCrop.icon_emoji} ${cropName(selCrop.id, lang)}`}
          subtitle={sel.real ? undefined : (lang === "sq" ? "ilustrues" : "illustrative")}
          action={
            <select className="input max-w-[180px]" value={selected} onChange={(e) => setSelected(e.target.value)}>
              {CROPS.map((c) => <option key={c.id} value={c.id}>{cropName(c.id, lang)}</option>)}
            </select>
          }
        />
        <PriceHistoryChart history={sel.history} color={selCrop.color_hex} />
      </Card>

      <UpdatePricesModal open={editing} onClose={() => setEditing(false)} eff={eff} />
    </div>
  );
}

function UpdatePricesModal({ open, onClose, eff }: { open: boolean; onClose: () => void; eff: (id: string) => { price: number } }) {
  const { lang } = useApp();
  const router = useRouter();
  const [vals, setVals] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  const get = (id: string) => (vals[id] !== undefined ? vals[id] : String(eff(id).price));

  async function save() {
    setSaving(true);
    const entries = CROPS.map((c) => ({ crop_id: c.id, price: Number(get(c.id)) })).filter((e) => Number.isFinite(e.price) && e.price > 0);
    const res = await saveMarketPrices(entries);
    setSaving(false);
    if (res.ok) { router.refresh(); onClose(); }
    else alert(lang === "sq" ? "Ruajtja kërkon hyrje (Clerk + Supabase) dhe tabelën market_prices." : "Saving needs login (Clerk + Supabase) and the market_prices table.");
  }

  return (
    <Modal open={open} onClose={onClose} wide
      title={lang === "sq" ? "Përditëso Çmimet e Tregut" : "Update Market Prices"}
      subtitle={lang === "sq" ? "Fut €/kg nga SIT Kosova ose ASK. Lëri bosh ato që s’i ke." : "Enter €/kg from SIT Kosova or ASK. Leave blank to skip."}>
      <div className="grid max-h-[55vh] grid-cols-1 gap-2 overflow-y-auto sm:grid-cols-2">
        {CROPS.map((c) => (
          <label key={c.id} className="flex items-center justify-between gap-3 rounded-lg border border-line p-2.5">
            <span className="text-sm font-medium text-brand-charcoal">{c.icon_emoji} {cropName(c.id, lang)}</span>
            <div className="flex items-center gap-1">
              <span className="text-xs text-brand-charcoal/45">€</span>
              <input type="number" step="0.01" min="0" className="input w-24 py-1 text-right"
                value={get(c.id)} onChange={(e) => setVals((v) => ({ ...v, [c.id]: e.target.value }))} />
            </div>
          </label>
        ))}
      </div>
      <div className="mt-4 flex justify-end gap-2">
        <button onClick={onClose} className="btn-secondary">{lang === "sq" ? "Anulo" : "Cancel"}</button>
        <button onClick={save} disabled={saving} className="btn-primary">{saving && <Loader2 className="h-4 w-4 animate-spin" />}{lang === "sq" ? "Ruaj Çmimet" : "Save Prices"}</button>
      </div>
    </Modal>
  );
}
