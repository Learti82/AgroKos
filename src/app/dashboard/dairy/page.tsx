"use client";

import { useState } from "react";
import { useApp } from "@/lib/store";
import { useFarm } from "@/components/DataProvider";
import { PageHeader, Card, CardHeader, Badge, EmptyState, HelpNote } from "@/components/ui/primitives";
import { AddAnimalModal, LogMilkModal } from "@/components/AddModals";
import { fmtNum, cn } from "@/lib/utils";
import { fmtDateSq, daysAgo, monthShortSq } from "@/lib/dates";
import { Plus, Pencil, Milk } from "lucide-react";

const SP: Record<string, { sq: string; en: string; icon: string }> = {
  cow: { sq: "Lopë", en: "Cow", icon: "🐄" },
  goat: { sq: "Dhi", en: "Goat", icon: "🐐" },
  sheep: { sq: "Dele", en: "Sheep", icon: "🐑" },
};
const STATUS: Record<string, { sq: string; en: string; tone: any }> = {
  active: { sq: "Në qumësht", en: "Milking", tone: "good" },
  dry: { sq: "E thatë", en: "Dry", tone: "warning" },
  sold: { sq: "Shitur", en: "Sold", tone: "neutral" },
  dead: { sq: "Ngordhur", en: "Dead", tone: "critical" },
};

export default function DairyPage() {
  const { lang } = useApp();
  const farm = useFarm();
  const [addAnimal, setAddAnimal] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [logMilk, setLogMilk] = useState(false);

  const active = farm.animals.filter((a) => a.status === "active" || a.status === "dry");
  const milking = farm.animals.filter((a) => a.status === "active").length;
  const milk7 = farm.milk.filter((m) => daysAgo(m.record_date) <= 7).reduce((s, m) => s + m.litres, 0);
  const avgPerCow = milking > 0 ? milk7 / 7 / milking : 0;

  // Last 7 days totals for a mini bar row.
  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(); d.setDate(d.getDate() - (6 - i));
    const key = d.toISOString().slice(0, 10);
    const total = farm.milk.filter((m) => m.record_date === key).reduce((s, m) => s + m.litres, 0);
    return { d, total };
  });
  const maxDay = Math.max(1, ...days.map((x) => x.total));
  const recent = [...farm.milk].sort((a, b) => +new Date(b.record_date) - +new Date(a.record_date)).slice(0, 8);

  return (
    <div className="space-y-5">
      <PageHeader
        title={lang === "sq" ? "Blegtoria & Bulmeti" : "Livestock & Dairy"}
        action={
          <div className="flex gap-2">
            <button onClick={() => setLogMilk(true)} className="btn-secondary"><Milk className="h-4 w-4" /> {lang === "sq" ? "Qumësht" : "Milk"}</button>
            <button onClick={() => setAddAnimal(true)} className="btn-primary"><Plus className="h-4 w-4" /> {lang === "sq" ? "Kafshë" : "Animal"}</button>
          </div>
        }
      />

      <HelpNote>
        {lang === "sq"
          ? "Menaxho kafshët (lopë, dhi, dele) dhe regjistro prodhimin e qumështit ditor. Shih totalin javor dhe mesataren për krye. Kliko “Kafshë” për të shtuar, “Qumësht” për të regjistruar prodhimin."
          : "Manage your animals (cows, goats, sheep) and log daily milk yield. See weekly totals and per-animal average. Use “Animal” to add livestock, “Milk” to log production."}
      </HelpNote>

      {farm.animals.length === 0 ? (
        <EmptyState icon="🐄" title={lang === "sq" ? "Pa kafshë ende" : "No animals yet"} hint={lang === "sq" ? "Shto kafshën tënde të parë për të ndjekur prodhimin e qumështit." : "Add your first animal to track milk production."} action={<button onClick={() => setAddAnimal(true)} className="btn-primary"><Plus className="h-4 w-4" /> {lang === "sq" ? "Shto Kafshë" : "Add Animal"}</button>} />
      ) : (
        <>
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            <div className="stat-card" style={{ borderLeftColor: "#6B4226" }}><p className="font-display text-2xl font-semibold text-brand-charcoal">{active.length}</p><p className="text-xs text-brand-charcoal/55">{lang === "sq" ? "Kafshë aktive" : "Active animals"}</p></div>
            <div className="stat-card" style={{ borderLeftColor: "#52B788" }}><p className="font-display text-2xl font-semibold text-brand-charcoal">{milking}</p><p className="text-xs text-brand-charcoal/55">{lang === "sq" ? "Në qumësht" : "Milking"}</p></div>
            <div className="stat-card" style={{ borderLeftColor: "#1A759F" }}><p className="font-display text-2xl font-semibold text-brand-charcoal">{fmtNum(milk7, 0)} L</p><p className="text-xs text-brand-charcoal/55">{lang === "sq" ? "Qumësht (7 ditë)" : "Milk (7 days)"}</p></div>
            <div className="stat-card" style={{ borderLeftColor: "#E9A319" }}><p className="font-display text-2xl font-semibold text-brand-charcoal">{fmtNum(avgPerCow, 1)} L</p><p className="text-xs text-brand-charcoal/55">{lang === "sq" ? "Mesatare/krye/ditë" : "Avg/head/day"}</p></div>
          </div>

          <div className="grid gap-4 lg:grid-cols-3">
            <Card className="lg:col-span-2">
              <CardHeader title={lang === "sq" ? "Kafshët" : "Animals"} />
              <div className="grid gap-3 sm:grid-cols-2">
                {farm.animals.map((a) => (
                  <div key={a.id} className="flex items-start justify-between rounded-card border border-line p-3">
                    <div className="flex items-start gap-2">
                      <span className="text-2xl">{SP[a.species]?.icon ?? "🐄"}</span>
                      <div>
                        <p className="font-semibold text-brand-charcoal">{a.tag}</p>
                        <p className="text-xs text-brand-charcoal/50">{SP[a.species]?.[lang]}{a.breed ? ` · ${a.breed}` : ""}</p>
                        <Badge tone={STATUS[a.status]?.tone ?? "neutral"} className="mt-1">{STATUS[a.status]?.[lang] ?? a.status}</Badge>
                      </div>
                    </div>
                    <button onClick={() => setEditing(a)} className="rounded-lg p-1.5 text-brand-charcoal/40 hover:bg-zebra hover:text-brand-green" aria-label="Edit"><Pencil className="h-4 w-4" /></button>
                  </div>
                ))}
              </div>
            </Card>

            <div className="space-y-4">
              <Card>
                <CardHeader title={lang === "sq" ? "Prodhimi (7 ditë)" : "Production (7 days)"} />
                <div className="flex items-end justify-between gap-1.5 h-28">
                  {days.map((x, i) => (
                    <div key={i} className="flex flex-1 flex-col items-center gap-1">
                      <div className="w-full rounded-t bg-brand-sky/80" style={{ height: `${(x.total / maxDay) * 80}px` }} title={`${fmtNum(x.total, 0)} L`} />
                      <span className="text-[9px] text-brand-charcoal/45">{x.d.getDate()}</span>
                    </div>
                  ))}
                </div>
              </Card>
              <Card>
                <CardHeader title={lang === "sq" ? "Regjistrimet e fundit" : "Recent records"} />
                {recent.length ? (
                  <div className="divide-y divide-line text-sm">
                    {recent.map((m) => {
                      const an = farm.animals.find((a) => a.id === m.animal_id);
                      return (
                        <div key={m.id} className="flex items-center justify-between py-2">
                          <span className="text-brand-charcoal/70">{fmtDateSq(m.record_date)} · {an ? an.tag : (lang === "sq" ? "Tufa" : "Herd")}</span>
                          <Badge tone="info">{fmtNum(m.litres, 1)} L</Badge>
                        </div>
                      );
                    })}
                  </div>
                ) : <p className="py-3 text-center text-sm text-brand-charcoal/55">{lang === "sq" ? "Pa regjistrime qumështi" : "No milk records"}</p>}
              </Card>
            </div>
          </div>
        </>
      )}

      <AddAnimalModal open={addAnimal} onClose={() => setAddAnimal(false)} />
      <AddAnimalModal key={editing?.id ?? "edit"} open={!!editing} editing={editing ?? undefined} onClose={() => setEditing(null)} />
      <LogMilkModal open={logMilk} onClose={() => setLogMilk(false)} />
    </div>
  );
}
