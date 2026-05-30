"use client";

import { useState } from "react";
import { useApp } from "@/lib/store";
import { PageHeader, Card, CardHeader, Badge, EmptyState, HelpNote } from "@/components/ui/primitives";
import { SpendBarChart } from "@/components/charts";
import { useFarm } from "@/components/DataProvider";
import { AddInventoryModal } from "@/components/AddModals";
import { INVENTORY_LABELS } from "@/lib/i18n";
import type { InventoryCategory } from "@/lib/types";
import { fmtEur, fmtNum, cn } from "@/lib/utils";
import { fmtDateSq } from "@/lib/dates";
import { Plus, AlertTriangle } from "lucide-react";

const CATS: (InventoryCategory | "all")[] = ["all", "seed", "fertilizer", "pesticide", "herbicide", "equipment", "fuel"];
const CAT_COLORS: Record<string, string> = { seed: "#52B788", fertilizer: "#2D6A4F", pesticide: "#E9A319", herbicide: "#6B4226", equipment: "#1A759F", fuel: "#1C2B1E" };

export default function InventoryPage() {
  const { lang } = useApp();
  const { inventory: INVENTORY } = useFarm();
  const [cat, setCat] = useState<(typeof CATS)[number]>("all");
  const [add, setAdd] = useState(false);
  const items = INVENTORY.filter((i) => cat === "all" || i.category === cat);
  const low = INVENTORY.filter((i) => i.quantity <= i.low_stock_threshold);

  const spendByCat = Object.entries(
    INVENTORY.reduce<Record<string, number>>((m, i) => ((m[i.category] = (m[i.category] || 0) + i.purchase_price_eur), m), {})
  ).map(([k, v]) => ({ name: INVENTORY_LABELS[k][lang], value: Math.round(v), color: CAT_COLORS[k] }));

  return (
    <div className="space-y-5">
      <PageHeader
        title={lang === "sq" ? "Inputet & Inventari" : "Inputs & Inventory"}
        action={<button onClick={() => setAdd(true)} className="btn-primary"><Plus className="h-4 w-4" /> {lang === "sq" ? "Shto Artikull" : "Add Item"}</button>}
      />

      <HelpNote>
        {lang === "sq"
          ? "Mbaj evidencë të farërave, plehrave, pesticideve dhe karburantit. Cakto një “prag stoku të ulët” për secilin artikull dhe AgroKos të njofton kur duhet të blesh përsëri."
          : "Keep track of your seeds, fertilizers, pesticides and fuel. Set a “low-stock threshold” per item and AgroKos warns you when it's time to restock."}
      </HelpNote>

      {INVENTORY.length === 0 ? (
        <EmptyState icon="📦" title={lang === "sq" ? "Inventari bosh" : "Inventory is empty"} hint={lang === "sq" ? "Shto inputin tënd të parë (farë, pleh, etj.)." : "Add your first input (seed, fertilizer, etc.)."} action={<button onClick={() => setAdd(true)} className="btn-primary"><Plus className="h-4 w-4" /> {lang === "sq" ? "Shto Artikull" : "Add Item"}</button>} />
      ) : (
      <>
      {low.length > 0 && (
        <div className="flex items-center gap-2 rounded-card border-l-4 border-brand-amber bg-brand-amber/10 p-3 text-sm text-[#9a6a05]">
          <AlertTriangle className="h-4 w-4 shrink-0" />
          <span><strong>{low.length}</strong> {lang === "sq" ? "artikuj me stok të ulët" : "items low on stock"}: {low.map((i) => i.item_name).join(", ")}</span>
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        {CATS.map((c) => (
          <button key={c} onClick={() => setCat(c)} className={cn("badge border transition", cat === c ? "border-brand-green bg-brand-green text-white" : "border-line bg-white text-brand-charcoal/60 hover:bg-zebra")}>
            {c === "all" ? (lang === "sq" ? "Të gjitha" : "All") : INVENTORY_LABELS[c][lang]}
          </button>
        ))}
      </div>

      <Card className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs uppercase text-brand-charcoal/45">
                {[lang === "sq" ? "Artikulli" : "Item", lang === "sq" ? "Sasia" : "Qty", lang === "sq" ? "Blerë" : "Bought", lang === "sq" ? "Kosto" : "Cost", lang === "sq" ? "Furnizuesi" : "Supplier", lang === "sq" ? "Skadon" : "Expiry"].map((h) => <th key={h} className="px-4 py-2 font-medium">{h}</th>)}
              </tr>
            </thead>
            <tbody>
              {items.map((i, idx) => {
                const isLow = i.quantity <= i.low_stock_threshold;
                return (
                  <tr key={i.id} className={cn(idx % 2 === 1 && "bg-zebra")}>
                    <td className="px-4 py-3">
                      <span className="font-medium text-brand-charcoal">{i.item_name}</span>
                      <Badge className="ml-2" style={{ background: `${CAT_COLORS[i.category]}1a`, color: CAT_COLORS[i.category] }}>{INVENTORY_LABELS[i.category][lang]}</Badge>
                    </td>
                    <td className="px-4 py-3">
                      <span className={cn("font-semibold tabular-nums", isLow && "text-brand-amber")}>{fmtNum(i.quantity, 0)} {i.unit}</span>
                      {isLow && <span className="ml-1 text-xs text-brand-amber">⚠</span>}
                    </td>
                    <td className="px-4 py-3 text-brand-charcoal/55">{fmtDateSq(i.purchase_date)}</td>
                    <td className="px-4 py-3 tabular-nums">{fmtEur(i.purchase_price_eur)}</td>
                    <td className="px-4 py-3 text-brand-charcoal/55">{i.supplier}</td>
                    <td className="px-4 py-3 text-brand-charcoal/55">{i.expiry_date ? fmtDateSq(i.expiry_date) : "—"}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      <Card>
        <CardHeader title={lang === "sq" ? "Shpenzimet sipas kategorisë" : "Spend by category"} />
        <SpendBarChart data={spendByCat} />
      </Card>
      </>
      )}

      <AddInventoryModal open={add} onClose={() => setAdd(false)} />
    </div>
  );
}
