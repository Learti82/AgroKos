"use client";

import { useState } from "react";
import { useApp } from "@/lib/store";
import { PageHeader, Card, Badge, HelpNote, EmptyState } from "@/components/ui/primitives";
import { DIRECTORY, DIR_LABELS, type DirCategory } from "@/lib/data/directory";
import { KOSOVO_MUNICIPALITIES } from "@/lib/data/demo";
import { Search, Phone } from "lucide-react";

const CATS = ["all", "inputs", "machinery", "vet", "agronomist", "lab", "buyer"] as const;

export default function DirectoryPage() {
  const { lang } = useApp();
  const [cat, setCat] = useState<(typeof CATS)[number]>("all");
  const [muni, setMuni] = useState("all");
  const [q, setQ] = useState("");

  const list = DIRECTORY.filter((d) =>
    (cat === "all" || d.category === cat) &&
    (muni === "all" || d.municipality === muni) &&
    (q === "" || d.name.toLowerCase().includes(q.toLowerCase()))
  );

  return (
    <div className="space-y-5">
      <PageHeader title={lang === "sq" ? "Direktoriumi i Shërbimeve" : "Services Directory"} subtitle={lang === "sq" ? "Furnizues, agronomë, veterinerë & blerës" : "Suppliers, agronomists, vets & buyers"} />

      <HelpNote>
        {lang === "sq"
          ? "Kontakte të dobishme në mbarë Kosovën: dyqane inputesh, makineri, laboratorë toke, agronomë, veterinerë dhe grumbullues/blerës. Filtro sipas llojit dhe komunës."
          : "Useful contacts across Kosovo: input shops, machinery, soil labs, agronomists, vets and buyers/collectors. Filter by type and municipality."}
      </HelpNote>

      <div className="flex flex-wrap items-center gap-2">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-brand-charcoal/40" />
          <input className="input pl-8" placeholder={lang === "sq" ? "Kërko emër…" : "Search name…"} value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
        <select className="input max-w-[170px]" value={cat} onChange={(e) => setCat(e.target.value as any)}>
          <option value="all">{lang === "sq" ? "Të gjitha llojet" : "All types"}</option>
          {(Object.keys(DIR_LABELS) as DirCategory[]).map((k) => <option key={k} value={k}>{DIR_LABELS[k].icon} {DIR_LABELS[k][lang]}</option>)}
        </select>
        <select className="input max-w-[160px]" value={muni} onChange={(e) => setMuni(e.target.value)}>
          <option value="all">{lang === "sq" ? "Të gjitha komunat" : "All municipalities"}</option>
          {KOSOVO_MUNICIPALITIES.map((m) => <option key={m}>{m}</option>)}
        </select>
      </div>

      {list.length === 0 ? (
        <EmptyState icon="🔎" title={lang === "sq" ? "Asgjë nuk u gjet" : "Nothing found"} hint={lang === "sq" ? "Provo filtra të tjerë." : "Try other filters."} />
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((d, i) => (
            <Card key={i} className="flex flex-col">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="font-semibold text-brand-charcoal">{DIR_LABELS[d.category].icon} {d.name}</h3>
                  <p className="text-xs text-brand-charcoal/50">{d.municipality}</p>
                </div>
                <Badge tone="neutral">{DIR_LABELS[d.category][lang]}</Badge>
              </div>
              <p className="mt-2 flex-1 text-sm text-brand-charcoal/65">{lang === "sq" ? d.note_sq : d.note_en}</p>
              <a href={`tel:${d.phone.replace(/\s/g, "")}`} className="btn-secondary mt-3"><Phone className="h-4 w-4" /> {d.phone}</a>
            </Card>
          ))}
        </div>
      )}
      <p className="text-center text-[11px] text-brand-charcoal/40">{lang === "sq" ? "Kontaktet janë ilustruese — verifiko para përdorimit." : "Contacts are illustrative — verify before use."}</p>
    </div>
  );
}
