"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/lib/store";
import { PageHeader, Card, Badge, HelpNote, EmptyState } from "@/components/ui/primitives";
import { Modal } from "@/components/ui/Modal";
import { useFarm } from "@/components/DataProvider";
import { saveMarketPrices } from "@/app/actions/farm";
import { cropById, cropName, CROPS, referencePrice } from "@/lib/data/crops";
import { fmtEur, cn } from "@/lib/utils";
import { fmtDateSq } from "@/lib/dates";
import { TrendingUp, TrendingDown, Minus, Pencil, Loader2, FileUp } from "lucide-react";
import { useRef } from "react";

const LOCATIONS = ["Prishtinë", "Prizren", "Pejë", "Mesatare kombëtare"];

export default function MarketPage() {
  const { lang } = useApp();
  const { prices } = useFarm();
  const [loc, setLoc] = useState(LOCATIONS[0]);
  const [editing, setEditing] = useState(false);
  const [prefill, setPrefill] = useState<Record<string, string>>({});
  const [importing, setImporting] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  async function onPdf(file: File) {
    setImporting(true);
    try {
      const dataUrl: string = await new Promise((res, rej) => { const r = new FileReader(); r.onload = () => res(r.result as string); r.onerror = rej; r.readAsDataURL(file); });
      const data = dataUrl.split(",")[1];
      const resp = await fetch("/api/import-prices", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ pdf: data, mediaType: file.type || "application/pdf" }) });
      const d = await resp.json();
      if (d.ok && d.items?.length) {
        const pf: Record<string, string> = {};
        for (const it of d.items) pf[it.crop_id] = String(it.price);
        setPrefill(pf);
        setEditing(true);
        alert(lang === "sq" ? `U lexuan ${d.items.length} çmime nga PDF. Kontrolloji dhe ruaji.` : `Read ${d.items.length} prices from the PDF. Review and save.`);
      } else if (d.configured === false) {
        alert(lang === "sq" ? "Importi me AI kërkon ANTHROPIC_API_KEY." : "AI import needs ANTHROPIC_API_KEY.");
      } else {
        alert(lang === "sq" ? "Nuk u gjetën çmime në PDF. Provo ta futësh me dorë." : "No prices found in the PDF. Try entering manually.");
      }
    } catch {
      alert(lang === "sq" ? "Importi dështoi." : "Import failed.");
    } finally {
      setImporting(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  const anyReal = Object.keys(prices).length > 0;
  const updated = Object.values(prices).map((p) => p.date).sort().pop();

  // Each crop: the farmer's real entered price if present, otherwise the
  // crop's reference figure (clearly marked as a non-live estimate).
  const rows = CROPS.map((crop) => {
    const real = prices[crop.id];
    const price = real ? real.price : referencePrice(crop.id);
    const pct = real && real.prev ? ((real.price - real.prev) / real.prev) * 100 : null;
    const trend = pct == null ? "stable" : pct > 1.5 ? "up" : pct < -1.5 ? "down" : "stable";
    return { crop, price, pct, trend, real: !!real };
  });

  return (
    <div className="space-y-5">
      <PageHeader
        title={lang === "sq" ? "Çmimet e Tregut" : "Market Prices"}
        subtitle={updated ? `${lang === "sq" ? "Përditësuar" : "Updated"}: ${fmtDateSq(updated)}` : (lang === "sq" ? "Ende pa çmime reale" : "No real prices yet")}
        action={
          <div className="flex gap-2">
            <select className="input max-w-[150px]" value={loc} onChange={(e) => setLoc(e.target.value)}>
              {LOCATIONS.map((l) => <option key={l}>{l}</option>)}
            </select>
            <input ref={fileRef} type="file" accept="application/pdf" className="hidden" onChange={(e) => e.target.files?.[0] && onPdf(e.target.files[0])} />
            <button onClick={() => fileRef.current?.click()} disabled={importing} className="btn-secondary">{importing ? <Loader2 className="h-4 w-4 animate-spin" /> : <FileUp className="h-4 w-4" />} {lang === "sq" ? "Importo PDF" : "Import PDF"}</button>
            <button onClick={() => { setPrefill({}); setEditing(true); }} className="btn-primary"><Pencil className="h-4 w-4" /> {lang === "sq" ? "Fut çmimet" : "Enter prices"}</button>
          </div>
        }
      />

      <HelpNote>
        {lang === "sq"
          ? "Këtu vendos çmimet REALE të tregut që i lexon nga burimet zyrtare — SIT Kosova (sitkosova.org) ose ASK (ask.rks-gov.net) — dhe i përditëson çdo javë me butonin “Fut çmimet”. Çmimet me shenjën gri janë vetëm vlera referente (jo reale) derisa t'i futësh të tuat; ndryshimi javor llogaritet nga përditësimi yt i fundit."
          : "Enter the REAL market prices you read from official sources — SIT Kosova (sitkosova.org) or ASK (ask.rks-gov.net) — and refresh them weekly with “Enter prices”. Grey prices are only reference estimates (not real) until you enter your own; the weekly change is computed from your last update."}
      </HelpNote>

      <Card className="p-0">
        <div className="flex items-center justify-between border-b border-line p-4">
          <h3 className="font-semibold text-brand-charcoal">{lang === "sq" ? "Çmimet" : "Prices"} · {loc}</h3>
          {anyReal
            ? <Badge tone="good">{lang === "sq" ? "TË DHËNA REALE" : "REAL DATA"}</Badge>
            : <Badge tone="warning">{lang === "sq" ? "Vlera referente" : "Reference values"}</Badge>}
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs uppercase text-brand-charcoal/45">
                <th className="px-4 py-2 font-medium">{lang === "sq" ? "Kultura" : "Crop"}</th>
                <th className="px-4 py-2 text-right font-medium">€/kg</th>
                <th className="px-4 py-2 text-right font-medium">{lang === "sq" ? "Java" : "Week"}</th>
                <th className="px-4 py-2 text-right font-medium">{lang === "sq" ? "Burimi" : "Source"}</th>
              </tr>
            </thead>
            <tbody>
              {rows.map(({ crop, price, pct, trend, real }, i) => {
                const Icon = trend === "up" ? TrendingUp : trend === "down" ? TrendingDown : Minus;
                const tone = trend === "up" ? "text-brand-green" : trend === "down" ? "text-red-600" : "text-brand-charcoal/40";
                return (
                  <tr key={crop.id} className={cn(i % 2 === 1 && "bg-zebra")}>
                    <td className="px-4 py-2.5 font-medium">{crop.icon_emoji} {cropName(crop.id, lang)}</td>
                    <td className={cn("px-4 py-2.5 text-right font-semibold tabular-nums", !real && "text-brand-charcoal/40")}>{fmtEur(price)}</td>
                    <td className={cn("px-4 py-2.5 text-right tabular-nums", tone)}>
                      {pct == null ? <span className="text-brand-charcoal/30">—</span> : <span className="inline-flex items-center gap-0.5"><Icon className="h-3.5 w-3.5" />{Math.abs(Math.round(pct * 10) / 10)}%</span>}
                    </td>
                    <td className="px-4 py-2.5 text-right">{real ? <Badge tone="good">{lang === "sq" ? "Reale" : "Real"}</Badge> : <span className="text-xs text-brand-charcoal/40">{lang === "sq" ? "referencë" : "reference"}</span>}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      {!anyReal && (
        <EmptyState icon="🏷️" title={lang === "sq" ? "Fut çmimet reale" : "Enter real prices"} hint={lang === "sq" ? "Hap sitkosova.org, kopjo çmimet javore dhe futi këtu. Pastaj historiku ndërtohet vetë javë pas jave." : "Open sitkosova.org, copy the weekly prices and enter them here. History then builds week by week."} action={<button onClick={() => setEditing(true)} className="btn-primary"><Pencil className="h-4 w-4" /> {lang === "sq" ? "Fut çmimet" : "Enter prices"}</button>} />
      )}

      <UpdatePricesModal key={Object.keys(prefill).join(",")} open={editing} onClose={() => setEditing(false)} initial={prefill} priceFor={(id) => prices[id]?.price ?? referencePrice(id)} />
    </div>
  );
}

function UpdatePricesModal({ open, onClose, priceFor, initial }: { open: boolean; onClose: () => void; priceFor: (id: string) => number; initial?: Record<string, string> }) {
  const { lang } = useApp();
  const router = useRouter();
  const [vals, setVals] = useState<Record<string, string>>(initial ?? {});
  const [saving, setSaving] = useState(false);
  const get = (id: string) => (vals[id] !== undefined ? vals[id] : String(priceFor(id)));

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
      title={lang === "sq" ? "Fut Çmimet e Tregut" : "Enter Market Prices"}
      subtitle={lang === "sq" ? "€/kg nga SIT Kosova ose ASK. Lëri bosh ato që s'i ke." : "€/kg from SIT Kosova or ASK. Leave blank to skip."}>
      <div className="grid max-h-[55vh] grid-cols-1 gap-2 overflow-y-auto sm:grid-cols-2">
        {CROPS.map((c) => (
          <label key={c.id} className="flex items-center justify-between gap-3 rounded-lg border border-line p-2.5">
            <span className="text-sm font-medium text-brand-charcoal">{c.icon_emoji} {cropName(c.id, lang)}</span>
            <div className="flex items-center gap-1"><span className="text-xs text-brand-charcoal/45">€</span>
              <input type="number" step="0.01" min="0" className="input w-24 py-1 text-right" value={get(c.id)} onChange={(e) => setVals((v) => ({ ...v, [c.id]: e.target.value }))} /></div>
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
