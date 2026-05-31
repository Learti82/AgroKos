"use client";

import { useState } from "react";
import { useApp } from "@/lib/store";
import { useFarm } from "@/components/DataProvider";
import { PageHeader, Card, Badge, HelpNote } from "@/components/ui/primitives";
import { SUBSIDIES } from "@/lib/data/programs";
import { cropById, cropName } from "@/lib/data/crops";
import { cn } from "@/lib/utils";
import { Bell, BellOff, CheckCircle2 } from "lucide-react";

const CATEGORY_HINTS: Record<string, string[]> = {
  cereal: ["drith", "grur", "misër", "elb"],
  vegetable: ["perime", "domate", "spec", "serra", "kastravec"],
  fruit: ["pem", "mollë", "kumbull", "dredhëz", "fruta"],
  berry: ["dredhëz", "mjedër", "boronic", "manaferr"],
  dairy: ["bulmet", "qumësht", "lopë"],
};

export default function SubsidiesPage() {
  const { lang } = useApp();
  const farm = useFarm();
  const [notify, setNotify] = useState(true);

  const myCrops = [...new Set(farm.plantings.map((p) => p.crop_id))];
  const myCropNamesSq = myCrops.map((id) => cropById(id)?.name_sq.toLowerCase()).filter(Boolean) as string[];
  const myCategories = [...new Set(myCrops.map((id) => cropById(id)?.category).filter(Boolean))] as string[];

  const isRelevant = (text: string) => {
    const t = text.toLowerCase();
    if (myCropNamesSq.some((n) => t.includes(n.slice(0, 4)))) return true;
    return myCategories.some((cat) => (CATEGORY_HINTS[cat] || []).some((h) => t.includes(h)));
  };

  const enriched = SUBSIDIES.map((s) => ({ s, relevant: isRelevant(s.crops) }));
  const sorted = [...enriched].sort((a, b) => {
    const score = (x: typeof a) => (x.relevant ? 2 : 0) + (x.s.status === "open" ? 1 : 0);
    return score(b) - score(a);
  });
  const eligible = enriched.filter((e) => e.relevant && e.s.status === "open").length;

  return (
    <div className="space-y-5">
      <PageHeader title={lang === "sq" ? "Subvencionet (MBPZHR)" : "Subsidies (MBPZHR)"} subtitle={lang === "sq" ? `${eligible} të përshtatshme për kulturat e tua` : `${eligible} match your crops`} />

      <HelpNote>
        {lang === "sq"
          ? "Programet e subvencioneve të Ministrisë së Bujqësisë (MBPZHR/AZHB), të renditura sipas kulturave të tua. Të shënuara me “Për ty” përputhen me atë që mbjell. Verifiko gjithmonë afatet dhe dokumentet zyrtare në azhb-rks.net para aplikimit."
          : "Ministry of Agriculture (MBPZHR/AZHB) subsidy programs, sorted by your crops. “For you” items match what you grow. Always verify deadlines and documents at azhb-rks.net before applying."}
      </HelpNote>

      <div className="flex items-center justify-between rounded-card border border-line bg-white p-3">
        <span className="flex items-center gap-2 text-sm text-brand-charcoal/75">
          {notify ? <Bell className="h-4 w-4 text-brand-green" /> : <BellOff className="h-4 w-4 text-brand-charcoal/40" />}
          {lang === "sq" ? "Më njofto me email kur hapen subvencione të reja" : "Email me when new subsidies open"}
        </span>
        <button onClick={() => setNotify((v) => !v)} className={cn("relative h-6 w-11 rounded-full transition", notify ? "bg-brand-green" : "bg-line")}>
          <span className={cn("absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition", notify ? "left-[22px]" : "left-0.5")} />
        </button>
      </div>

      <div className="space-y-3">
        {sorted.map(({ s, relevant }) => (
          <Card key={s.title} className={cn("border-l-4", s.status === "open" ? "border-brand-green" : s.status === "soon" ? "border-brand-amber" : "border-line opacity-75")}>
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-semibold text-brand-charcoal">{s.title}</h3>
                  {relevant && <Badge tone="good"><CheckCircle2 className="h-3 w-3" /> {lang === "sq" ? "Për ty" : "For you"}</Badge>}
                </div>
                <p className="mt-0.5 text-xs text-brand-charcoal/50">{s.crops}</p>
              </div>
              <Badge tone={s.status === "open" ? "good" : s.status === "soon" ? "warning" : "neutral"}>
                {s.status === "open" ? (lang === "sq" ? "Hapur" : "Open") : s.status === "soon" ? (lang === "sq" ? "Së shpejti" : "Soon") : (lang === "sq" ? "Mbyllur" : "Closed")}
              </Badge>
            </div>
            <div className="mt-3 flex flex-wrap gap-4 text-sm">
              <span><span className="text-brand-charcoal/45">{lang === "sq" ? "Vlera" : "Amount"}:</span> <strong className="text-brand-green">{s.amount}</strong></span>
              <span><span className="text-brand-charcoal/45">{lang === "sq" ? "Afati" : "Deadline"}:</span> <strong>{s.deadline}</strong></span>
            </div>
            <p className="mt-2 text-sm text-brand-charcoal/70">📝 {s.how}</p>
          </Card>
        ))}
      </div>

      <p className="text-center text-xs text-brand-charcoal/40">{lang === "sq" ? "Burimi: MBPZHR / AZHB — të dhëna ilustruese. Kontrollo azhb-rks.net." : "Source: MBPZHR / AZHB — illustrative. Check azhb-rks.net."}</p>
    </div>
  );
}
