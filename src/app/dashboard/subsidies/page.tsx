"use client";

import { useState } from "react";
import { useApp } from "@/lib/store";
import { useFarm } from "@/components/DataProvider";
import { PageHeader, Card, Badge, HelpNote } from "@/components/ui/primitives";
import { SUBSIDIES } from "@/lib/data/programs";
import { cropById } from "@/lib/data/crops";
import { cn } from "@/lib/utils";
import { Bell, BellOff, CheckCircle2, ExternalLink } from "lucide-react";

export default function SubsidiesPage() {
  const { lang } = useApp();
  const farm = useFarm();
  const [notify, setNotify] = useState(true);

  // Match areas to the farmer's REAL data (their crops, animals, hives).
  const myCats = new Set<string>();
  for (const p of farm.plantings) { const c = cropById(p.crop_id); if (c) myCats.add(c.category); }
  if (farm.animals.length) myCats.add("dairy");
  if (farm.hives.length) myCats.add("bees");

  const rows = SUBSIDIES.map((s) => ({ s, relevant: s.categories.some((c) => myCats.has(c)) }))
    .sort((a, b) => Number(b.relevant) - Number(a.relevant));
  const eligible = rows.filter((r) => r.relevant).length;

  return (
    <div className="space-y-5">
      <PageHeader
        title={lang === "sq" ? "Subvencionet (MBPZHR/AZHB)" : "Subsidies (MBPZHR/AZHB)"}
        subtitle={eligible > 0 ? (lang === "sq" ? `${eligible} fusha që përputhen me fermën tënde` : `${eligible} areas match your farm`) : (lang === "sq" ? "Fushat kryesore të mbështetjes" : "Main support areas")}
        action={<a href="https://azhb-rks.net" target="_blank" rel="noreferrer" className="btn-primary"><ExternalLink className="h-4 w-4" /> {lang === "sq" ? "Faqja zyrtare" : "Official site"}</a>}
      />

      <HelpNote>
        {lang === "sq"
          ? "Këto janë fushat ku Ministria e Bujqësisë (MBPZHR/AZHB) zakonisht ofron mbështetje, të renditura sipas asaj që ti kultivon/mban. Shumat dhe afatet ndryshojnë çdo vit — për shifrat zyrtare dhe thirrjet aktive kliko “Faqja zyrtare” (azhb-rks.net). Të shënuara me “Për ty” përputhen me të dhënat e tua reale."
          : "These are the areas where the Ministry of Agriculture (MBPZHR/AZHB) typically offers support, sorted by what you actually grow/keep. Amounts and deadlines change yearly — for the official figures and open calls click “Official site” (azhb-rks.net). “For you” items match your real data."}
      </HelpNote>

      <div className="flex items-center justify-between rounded-card border border-line bg-white p-3">
        <span className="flex items-center gap-2 text-sm text-brand-charcoal/75">
          {notify ? <Bell className="h-4 w-4 text-brand-green" /> : <BellOff className="h-4 w-4 text-brand-charcoal/40" />}
          {lang === "sq" ? "Më kujto të kontrolloj thirrjet e reja" : "Remind me to check for new calls"}
        </span>
        <button onClick={() => setNotify((v) => !v)} className={cn("relative h-6 w-11 rounded-full transition", notify ? "bg-brand-green" : "bg-line")}>
          <span className={cn("absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition", notify ? "left-[22px]" : "left-0.5")} />
        </button>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {rows.map(({ s, relevant }) => (
          <Card key={s.title} className={cn("border-l-4", relevant ? "border-brand-green" : "border-line")}>
            <div className="flex items-start justify-between gap-2">
              <div>
                <h3 className="font-semibold text-brand-charcoal">{s.title}</h3>
                <p className="mt-0.5 text-xs text-brand-charcoal/50">{s.crops}</p>
              </div>
              {relevant && <Badge tone="good"><CheckCircle2 className="h-3 w-3" /> {lang === "sq" ? "Për ty" : "For you"}</Badge>}
            </div>
            <p className="mt-2 text-sm text-brand-charcoal/70">📝 {s.how}</p>
          </Card>
        ))}
      </div>

      <p className="text-center text-xs text-brand-charcoal/45">
        {lang === "sq" ? "Shumat & afatet zyrtare: " : "Official amounts & deadlines: "}
        <a href="https://azhb-rks.net" target="_blank" rel="noreferrer" className="font-semibold text-brand-green hover:underline">azhb-rks.net</a>
        {" · "}<a href="https://www.mbpzhr-ks.net" target="_blank" rel="noreferrer" className="font-semibold text-brand-green hover:underline">mbpzhr-ks.net</a>
      </p>
    </div>
  );
}
