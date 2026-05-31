"use client";

import { useState } from "react";
import { useApp } from "@/lib/store";
import { useFarm } from "@/components/DataProvider";
import { PageHeader, Card, CardHeader, HelpNote } from "@/components/ui/primitives";
import { EU_EXPORT } from "@/lib/data/programs";
import { CROPS, cropName } from "@/lib/data/crops";
import { Printer } from "lucide-react";

export default function ExportPage() {
  const { lang } = useApp();
  const farm = useFarm();
  const [crop, setCrop] = useState("apple");
  const [lot, setLot] = useState("");
  const [qty, setQty] = useState("");

  const lotNo = lot || `${crop.toUpperCase()}-${new Date().toISOString().slice(0, 10).replace(/-/g, "")}`;
  const trace = [
    "AgroKos — Traceability / Gjurmueshmëria",
    `Produkt: ${cropName(crop, lang)}`,
    `Lot: ${lotNo}`,
    qty ? `Sasia: ${qty} kg` : "",
    `Fermer: ${farm.profile.full_name}`,
    `Origjina: ${farm.profile.village || ""} ${farm.profile.municipality || "Kosovë"}`.trim(),
    `Data: ${new Date().toISOString().slice(0, 10)}`,
    "Origjina: Republika e Kosovës",
  ].filter(Boolean).join("\n");
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&margin=8&data=${encodeURIComponent(trace)}`;

  return (
    <div className="space-y-5">
      <PageHeader title={lang === "sq" ? "Eksporti në BE & Gjurmueshmëria" : "EU Export & Traceability"} subtitle={lang === "sq" ? "Dokumentet, standardet dhe etiketa me QR" : "Documents, standards & QR label"} />

      <div className="rounded-card bg-gradient-to-r from-brand-green to-brand-sky p-4 text-white">
        <p className="font-semibold">🇪🇺 {lang === "sq" ? "Qasje pa doganë në BE" : "Duty-free access to the EU"}</p>
        <p className="mt-1 text-sm text-white/85">{lang === "sq" ? "Kosova ka qasje pa doganë në BE për mbi 2.560 produkte bujqësore sipas MSA-së." : "Kosovo has duty-free access to the EU for 2,560+ agricultural products under the SAA."}</p>
      </div>

      <HelpNote>
        {lang === "sq"
          ? "Lista e dokumenteve dhe standardeve për eksport në BE sipas kategorisë, plus një gjenerues etikete me QR për gjurmueshmërinë e lotit. Blerësit/supermarketet e BE-së e kërkojnë gjurmueshmërinë — skanimi i QR tregon origjinën dhe lotin."
          : "Document & standards checklist for EU export by category, plus a QR batch-label generator for traceability. EU buyers/supermarkets require traceability — scanning the QR shows the origin and lot."}
      </HelpNote>

      <div className="grid gap-4 lg:grid-cols-2">
        {EU_EXPORT.map((e) => (
          <Card key={e.category}>
            <h3 className="font-semibold text-brand-charcoal">{e.category}</h3>
            <div className="mt-3 space-y-2 text-sm">
              <div>
                <p className="text-xs font-semibold uppercase text-brand-green">{lang === "sq" ? "Dokumentet" : "Documents"}</p>
                <ul className="mt-1 space-y-1">{e.docs.map((d) => <li key={d} className="flex items-center gap-2 text-brand-charcoal/75"><span className="text-brand-green">✓</span> {d}</li>)}</ul>
              </div>
              <div><p className="text-xs font-semibold uppercase text-brand-amber">{lang === "sq" ? "Standardet" : "Standards"}</p><p className="text-brand-charcoal/75">{e.standards}</p></div>
              <div><p className="text-xs font-semibold uppercase text-brand-sky">{lang === "sq" ? "Etiketimi" : "Labeling"}</p><p className="text-brand-charcoal/75">{e.labeling}</p></div>
            </div>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader title={lang === "sq" ? "Gjenero Etiketë Loti me QR" : "Generate QR Batch Label"} subtitle={lang === "sq" ? "Për gjurmueshmëri & eksport" : "For traceability & export"} />
        <div className="grid gap-5 lg:grid-cols-2">
          <div className="space-y-3">
            <div>
              <label className="label">{lang === "sq" ? "Produkti" : "Product"}</label>
              <select className="input" value={crop} onChange={(e) => setCrop(e.target.value)}>
                {CROPS.map((c) => <option key={c.id} value={c.id}>{c.icon_emoji} {cropName(c.id, lang)}</option>)}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div><label className="label">{lang === "sq" ? "Numri i lotit" : "Lot number"}</label><input className="input" value={lot} onChange={(e) => setLot(e.target.value)} placeholder={lotNo} /></div>
              <div><label className="label">{lang === "sq" ? "Sasia (kg)" : "Quantity (kg)"}</label><input type="number" className="input" value={qty} onChange={(e) => setQty(e.target.value)} /></div>
            </div>
          </div>

          <div className="rounded-card border border-line bg-white p-4 text-center print:border-0" id="label">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={qrUrl} alt="QR" className="mx-auto h-44 w-44 bg-zebra" />
            <p className="mt-2 font-display font-semibold text-brand-charcoal">{cropName(crop, lang)} · {lotNo}</p>
            <p className="text-xs text-brand-charcoal/60">{farm.profile.full_name} · {farm.profile.municipality || "Kosovë"}</p>
            <p className="text-[10px] text-brand-charcoal/45">Origin: Republic of Kosovo · {new Date().toISOString().slice(0, 10)}</p>
            <button onClick={() => window.print()} className="btn-secondary mt-3 print:hidden"><Printer className="h-4 w-4" /> {lang === "sq" ? "Printo etiketën" : "Print label"}</button>
          </div>
        </div>
      </Card>
    </div>
  );
}
