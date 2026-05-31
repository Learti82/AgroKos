"use client";

import { useState } from "react";
import { useApp } from "@/lib/store";
import { useFarm } from "@/components/DataProvider";
import { PageHeader, Card, Badge, EmptyState, HelpNote } from "@/components/ui/primitives";
import { AddListingModal } from "@/components/AddModals";
import { cropById, cropName, referencePrice } from "@/lib/data/crops";
import { fmtEur, fmtNum, cn } from "@/lib/utils";
import { Plus, Pencil, TrendingUp } from "lucide-react";

export default function SellPage() {
  const { lang } = useApp();
  const farm = useFarm();
  const [add, setAdd] = useState(false);
  const [editing, setEditing] = useState<any>(null);

  const priceOf = (id: string) => farm.prices[id]?.price ?? referencePrice(id);

  const rows = farm.listings.map((l) => {
    const crop = cropById(l.crop_id)!;
    const current = priceOf(l.crop_id);
    const ready = l.status === "available" && current >= l.target_price && l.target_price > 0;
    return { l, crop, current, ready, value: current * l.quantity_kg };
  }).sort((a, b) => Number(b.ready) - Number(a.ready));

  const readyCount = rows.filter((r) => r.ready).length;

  return (
    <div className="space-y-5">
      <PageHeader
        title={lang === "sq" ? "Gati për Shitje" : "Ready to Sell"}
        subtitle={readyCount > 0 ? (lang === "sq" ? `${readyCount} gati për shitje tani!` : `${readyCount} ready to sell now!`) : (lang === "sq" ? "Ndiq çmimet e synuara" : "Track your target prices")}
        action={<button onClick={() => setAdd(true)} className="btn-primary"><Plus className="h-4 w-4" /> {lang === "sq" ? "Vendos për Shitje" : "List Produce"}</button>}
      />

      <HelpNote>
        {lang === "sq"
          ? "Shëno produktet që do të shesësh dhe çmimin që dëshiron (€/kg). AgroKos krahason me çmimin aktual të tregut dhe të njofton kur arrin synimin tënd — që të shesësh në momentin më të mirë."
          : "List the produce you want to sell and the price you want (€/kg). AgroKos compares it to the current market price and flags when your target is hit — so you sell at the best moment."}
      </HelpNote>

      {rows.length === 0 ? (
        <EmptyState icon="🏷️" title={lang === "sq" ? "Asgjë e listuar" : "Nothing listed"} hint={lang === "sq" ? "Shto produktin e parë me një çmim të synuar." : "Add your first produce with a target price."} action={<button onClick={() => setAdd(true)} className="btn-primary"><Plus className="h-4 w-4" /> {lang === "sq" ? "Vendos për Shitje" : "List Produce"}</button>} />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {rows.map(({ l, crop, current, ready, value }) => (
            <Card key={l.id} className={cn("border-l-4", ready ? "border-brand-green" : l.status === "sold" ? "border-line opacity-70" : "border-brand-amber")}>
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-brand-charcoal">{crop.icon_emoji} {cropName(crop.id, lang)}</h3>
                  <p className="text-xs text-brand-charcoal/50">{fmtNum(l.quantity_kg, 0)} kg</p>
                </div>
                <button onClick={() => setEditing(l)} className="rounded-lg p-1.5 text-brand-charcoal/40 hover:bg-zebra hover:text-brand-green"><Pencil className="h-4 w-4" /></button>
              </div>
              <div className="mt-3 grid grid-cols-2 gap-2 text-center text-sm">
                <div className="rounded-lg bg-zebra p-2"><p className="text-[10px] uppercase text-brand-charcoal/45">{lang === "sq" ? "Synimi" : "Target"}</p><p className="font-semibold">{fmtEur(l.target_price)}</p></div>
                <div className="rounded-lg bg-zebra p-2"><p className="text-[10px] uppercase text-brand-charcoal/45">{lang === "sq" ? "Tregu" : "Market"}</p><p className={cn("font-semibold", current >= l.target_price ? "text-brand-green" : "text-brand-charcoal")}>{fmtEur(current)}</p></div>
              </div>
              <div className="mt-3 flex items-center justify-between">
                {l.status === "sold" ? <Badge tone="neutral">{lang === "sq" ? "Shitur" : "Sold"}</Badge>
                  : ready ? <Badge tone="good"><TrendingUp className="h-3 w-3" /> {lang === "sq" ? "Shit tani!" : "Sell now!"}</Badge>
                  : <Badge tone="warning">{lang === "sq" ? "Prit çmimin" : "Awaiting price"}</Badge>}
                <span className="text-sm font-semibold text-brand-green">{fmtEur(value, 0)}</span>
              </div>
              {l.notes && <p className="mt-2 text-xs text-brand-charcoal/55">{l.notes}</p>}
            </Card>
          ))}
        </div>
      )}

      <AddListingModal open={add} onClose={() => setAdd(false)} />
      <AddListingModal key={editing?.id ?? "edit"} open={!!editing} editing={editing ?? undefined} onClose={() => setEditing(null)} />
    </div>
  );
}
