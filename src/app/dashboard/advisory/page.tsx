"use client";

import { useState } from "react";
import { useApp } from "@/lib/store";
import { PageHeader, Card, Badge } from "@/components/ui/primitives";
import { CROP_GUIDES, PEST_LIBRARY, FAQ } from "@/lib/data/advisory";
import { ROTATION_NEXT, CROP_FAMILY, SUBSIDIES, EU_EXPORT } from "@/lib/data/programs";
import { cropById, cropName, CROPS } from "@/lib/data/crops";
import { useFarm } from "@/components/DataProvider";
import { monthNameSq } from "@/lib/dates";
import { cn } from "@/lib/utils";
import { ChevronDown, RotateCw, Leaf, Bug, HelpCircle, BookOpen, Euro, Ship } from "lucide-react";

const TABS = [
  { id: "guides", sq: "Udhëzues", en: "Guides", icon: BookOpen },
  { id: "seasonal", sq: "Sezonale", en: "Seasonal", icon: Leaf },
  { id: "rotation", sq: "Qarkullimi", en: "Rotation", icon: RotateCw },
  { id: "pests", sq: "Sëmundjet", en: "Pests", icon: Bug },
  { id: "subsidies", sq: "Subvencione", en: "Subsidies", icon: Euro },
  { id: "export", sq: "Eksporti BE", en: "EU Export", icon: Ship },
  { id: "faq", sq: "Pyetje", en: "FAQ", icon: HelpCircle },
];

export default function AdvisoryPage() {
  const { lang } = useApp();
  const [tab, setTab] = useState("guides");

  return (
    <div className="space-y-5">
      <PageHeader title={lang === "sq" ? "Këshillim Bujqësor" : "Advisory"} subtitle={lang === "sq" ? "Njohuri për kushtet e Kosovës" : "Knowledge for Kosovo conditions"} />

      <div className="flex gap-1 overflow-x-auto no-scrollbar border-b border-line">
        {TABS.map((tb) => (
          <button key={tb.id} onClick={() => setTab(tb.id)} className={cn("flex items-center gap-1.5 whitespace-nowrap border-b-2 px-4 py-2 text-sm font-medium transition", tab === tb.id ? "border-brand-green text-brand-green" : "border-transparent text-brand-charcoal/50 hover:text-brand-charcoal")}>
            <tb.icon className="h-4 w-4" /> {lang === "sq" ? tb.sq : tb.en}
          </button>
        ))}
      </div>

      {tab === "guides" && <Guides lang={lang} />}
      {tab === "seasonal" && <Seasonal lang={lang} />}
      {tab === "rotation" && <Rotation lang={lang} />}
      {tab === "pests" && <Pests lang={lang} />}
      {tab === "subsidies" && <Subsidies lang={lang} />}
      {tab === "export" && <Export lang={lang} />}
      {tab === "faq" && <Faq />}
    </div>
  );
}

function Guides({ lang }: { lang: "sq" | "en" }) {
  const [open, setOpen] = useState(CROP_GUIDES[0].cropId);
  return (
    <div className="space-y-3">
      {CROP_GUIDES.map((g) => {
        const c = cropById(g.cropId)!;
        const isOpen = open === g.cropId;
        const rows = [
          [lang === "sq" ? "Mbjellja" : "Planting", g.planting],
          [lang === "sq" ? "Varietetet" : "Varieties", g.varieties],
          [lang === "sq" ? "Plehërimi" : "Fertilization", g.fertilization],
          [lang === "sq" ? "Ujitja" : "Irrigation", g.irrigation],
          [lang === "sq" ? "Dëmtuesit" : "Pests", g.pests],
          [lang === "sq" ? "Rendimenti" : "Yield", g.yield],
          [lang === "sq" ? "Korrja" : "Harvest", g.harvest],
        ];
        return (
          <Card key={g.cropId} className="p-0">
            <button onClick={() => setOpen(isOpen ? "" : g.cropId)} className="flex w-full items-center justify-between p-4">
              <span className="font-semibold text-brand-charcoal">{c.icon_emoji} {cropName(c.id, lang)}</span>
              <ChevronDown className={cn("h-4 w-4 text-brand-charcoal/40 transition", isOpen && "rotate-180")} />
            </button>
            {isOpen && (
              <div className="space-y-2 border-t border-line p-4 pt-3">
                {rows.map(([l, v]) => (
                  <div key={l}>
                    <p className="text-xs font-semibold uppercase text-brand-green">{l}</p>
                    <p className="text-sm text-brand-charcoal/75">{v}</p>
                  </div>
                ))}
              </div>
            )}
          </Card>
        );
      })}
    </div>
  );
}

function Seasonal({ lang }: { lang: "sq" | "en" }) {
  const { plantings: PLANTINGS } = useFarm();
  const month = new Date().getMonth() + 1;
  const activeCrops = [...new Set(PLANTINGS.filter((p) => p.status === "active").map((p) => p.crop_id))];
  // Simple month→task mapping per crop guide hints.
  const tasks: { crop: string; task: string }[] = [];
  for (const cid of activeCrops) {
    const g = CROP_GUIDES.find((x) => x.cropId === cid);
    const c = cropById(cid)!;
    if (!g) continue;
    if (month >= 3 && month <= 5) tasks.push({ crop: cropName(c.id, lang), task: lang === "sq" ? "Plehërim pranveror & kontroll dëmtuesish" : "Spring fertilizing & pest scouting" });
    else if (month >= 6 && month <= 8) tasks.push({ crop: cropName(c.id, lang), task: lang === "sq" ? "Ujitje e rregullt & mbrojtje nga sëmundjet" : "Regular irrigation & disease protection" });
    else if (month >= 9 && month <= 10) tasks.push({ crop: cropName(c.id, lang), task: lang === "sq" ? "Korrje & përgatitje për tregun" : "Harvest & market prep" });
    else tasks.push({ crop: cropName(c.id, lang), task: lang === "sq" ? "Krasitje, mirëmbajtje & planifikim" : "Pruning, maintenance & planning" });
  }
  return (
    <Card>
      <h3 className="mb-3 font-semibold text-brand-charcoal">📅 {lang === "sq" ? `Punët e muajit ${monthNameSq(month)}` : `Tasks for ${monthNameSq(month)}`}</h3>
      <div className="space-y-2">
        {tasks.map((t, i) => (
          <label key={i} className="flex items-center gap-3 rounded-lg border border-line p-3 hover:bg-zebra">
            <input type="checkbox" className="h-4 w-4 accent-[#2D6A4F]" />
            <span className="text-sm"><strong className="text-brand-charcoal">{t.crop}:</strong> <span className="text-brand-charcoal/70">{t.task}</span></span>
          </label>
        ))}
      </div>
    </Card>
  );
}

function Rotation({ lang }: { lang: "sq" | "en" }) {
  const [last, setLast] = useState("tomato");
  const fam = CROP_FAMILY[last];
  const rule = ROTATION_NEXT[fam];
  return (
    <Card>
      <h3 className="mb-1 font-semibold text-brand-charcoal">🔄 {lang === "sq" ? "Këshilltari i Qarkullimit" : "Crop Rotation Advisor"}</h3>
      <p className="mb-4 text-sm text-brand-charcoal/55">{lang === "sq" ? "Zgjidh kulturën e fundit në fushë:" : "Select the field's last crop:"}</p>
      <select className="input max-w-xs" value={last} onChange={(e) => setLast(e.target.value)}>
        {CROPS.map((c) => <option key={c.id} value={c.id}>{c.icon_emoji} {cropName(c.id, lang)}</option>)}
      </select>
      {rule && (
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <div className="rounded-card border-l-4 border-brand-green bg-brand-green/5 p-4">
            <p className="text-xs font-semibold uppercase text-brand-green">✅ {lang === "sq" ? "Mbillni më pas" : "Plant next"}</p>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {rule.good.map((id) => <Badge key={id} tone="good">{cropById(id)?.icon_emoji} {cropName(id, lang)}</Badge>)}
            </div>
          </div>
          <div className="rounded-card border-l-4 border-red-400 bg-red-50 p-4">
            <p className="text-xs font-semibold uppercase text-red-600">⛔ {lang === "sq" ? "Shmangni" : "Avoid"}</p>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {rule.avoid.map((id) => <Badge key={id} tone="critical">{cropById(id)?.icon_emoji} {cropName(id, lang)}</Badge>)}
            </div>
          </div>
          <p className="sm:col-span-2 text-sm text-brand-charcoal/70">💡 {rule.reason}</p>
        </div>
      )}
    </Card>
  );
}

function Pests({ lang }: { lang: "sq" | "en" }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {PEST_LIBRARY.map((p) => (
        <Card key={p.name}>
          <h3 className="font-semibold text-brand-charcoal">🐛 {p.name}</h3>
          <p className="mt-0.5 text-xs text-brand-charcoal/45">{p.crops}</p>
          <dl className="mt-2 space-y-1.5 text-sm">
            <div><dt className="text-xs font-semibold uppercase text-brand-amber">{lang === "sq" ? "Simptomat" : "Symptoms"}</dt><dd className="text-brand-charcoal/70">{p.symptoms}</dd></div>
            <div><dt className="text-xs font-semibold uppercase text-brand-green">{lang === "sq" ? "Parandalimi" : "Prevention"}</dt><dd className="text-brand-charcoal/70">{p.prevention}</dd></div>
            <div><dt className="text-xs font-semibold uppercase text-brand-sky">{lang === "sq" ? "Trajtimi" : "Treatment"}</dt><dd className="text-brand-charcoal/70">{p.treatment}</dd></div>
          </dl>
        </Card>
      ))}
    </div>
  );
}

function Subsidies({ lang }: { lang: "sq" | "en" }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between rounded-card bg-brand-green/5 p-3 text-sm">
        <span className="text-brand-charcoal/70">🔔 {lang === "sq" ? "Më njofto kur hapen subvencione të reja" : "Notify me when new subsidies open"}</span>
        <input type="checkbox" defaultChecked className="h-5 w-9 cursor-pointer appearance-none rounded-full bg-line transition checked:bg-brand-green relative before:absolute before:left-0.5 before:top-0.5 before:h-4 before:w-4 before:rounded-full before:bg-white before:transition checked:before:translate-x-4" />
      </div>
      {SUBSIDIES.map((s) => (
        <Card key={s.title} className="border-l-4 border-brand-green">
          <h3 className="font-semibold text-brand-charcoal">{s.title}</h3>
          <p className="mt-0.5 text-xs text-brand-charcoal/50">{s.crops}</p>
          <p className="mt-2 text-sm text-brand-charcoal/70">📝 {s.how}</p>
        </Card>
      ))}
      <p className="text-center text-xs text-brand-charcoal/45">{lang === "sq" ? "Shumat & afatet zyrtare: " : "Official amounts & deadlines: "}<a href="https://azhb-rks.net" target="_blank" rel="noreferrer" className="font-semibold text-brand-green hover:underline">azhb-rks.net</a></p>
    </div>
  );
}

function Export({ lang }: { lang: "sq" | "en" }) {
  return (
    <div className="space-y-4">
      <div className="rounded-card bg-gradient-to-r from-brand-green to-brand-sky p-4 text-white">
        <p className="font-semibold">🇪🇺 {lang === "sq" ? "Gatishmëria për Eksport në BE" : "EU Export Readiness"}</p>
        <p className="mt-1 text-sm text-white/85">{lang === "sq" ? "Kosova ka qasje pa doganë në BE për mbi 2.560 produkte bujqësore (MSA)." : "Kosovo has duty-free access to the EU for 2,560+ agricultural products (SAA)."}</p>
      </div>
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
  );
}

function Faq() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <div className="space-y-2">
      {FAQ.map((f, i) => (
        <Card key={i} className="p-0">
          <button onClick={() => setOpen(open === i ? null : i)} className="flex w-full items-center justify-between gap-3 p-4 text-left">
            <span className="font-medium text-brand-charcoal">{f.q}</span>
            <ChevronDown className={cn("h-4 w-4 shrink-0 text-brand-charcoal/40 transition", open === i && "rotate-180")} />
          </button>
          {open === i && <p className="border-t border-line p-4 pt-3 text-sm text-brand-charcoal/70">{f.a}</p>}
        </Card>
      ))}
    </div>
  );
}
