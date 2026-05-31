"use client";

import { useState } from "react";
import { useApp } from "@/lib/store";
import { useFarm } from "@/components/DataProvider";
import { PageHeader, Card, CardHeader, Badge, EmptyState, HelpNote } from "@/components/ui/primitives";
import { AddHiveModal, LogHoneyModal } from "@/components/AddModals";
import { fmtNum } from "@/lib/utils";
import { fmtDateSq } from "@/lib/dates";
import { Plus, Pencil } from "lucide-react";

const STATUS: Record<string, { sq: string; en: string; tone: any }> = {
  active: { sq: "Aktive", en: "Active", tone: "good" },
  weak: { sq: "E dobët", en: "Weak", tone: "warning" },
  lost: { sq: "Humbur", en: "Lost", tone: "critical" },
};

export default function BeesPage() {
  const { lang } = useApp();
  const farm = useFarm();
  const [addHive, setAddHive] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [logHoney, setLogHoney] = useState(false);

  const active = farm.hives.filter((h) => h.status !== "lost").length;
  const yearHoney = farm.honey.filter((h) => new Date(h.harvest_date).getFullYear() === new Date().getFullYear()).reduce((s, h) => s + h.kg, 0);
  const perHive = active > 0 ? yearHoney / active : 0;
  const recent = [...farm.honey].sort((a, b) => +new Date(b.harvest_date) - +new Date(a.harvest_date)).slice(0, 8);

  return (
    <div className="space-y-5">
      <PageHeader
        title={lang === "sq" ? "Bletaria" : "Beekeeping"}
        action={
          <div className="flex gap-2">
            <button onClick={() => setLogHoney(true)} className="btn-secondary">🍯 {lang === "sq" ? "Mjaltë" : "Honey"}</button>
            <button onClick={() => setAddHive(true)} className="btn-primary"><Plus className="h-4 w-4" /> {lang === "sq" ? "Koshere" : "Hive"}</button>
          </div>
        }
      />

      <HelpNote>
        {lang === "sq"
          ? "Menaxho koshet e bletëve dhe regjistro prodhimin e mjaltit. Shih totalin e sezonit dhe mesataren për koshere. Subvencionet për bletari shfaqen te faqja Subvencione."
          : "Manage your beehives and log honey production. See season totals and per-hive average. Beekeeping subsidies appear on the Subsidies page."}
      </HelpNote>

      {farm.hives.length === 0 ? (
        <EmptyState icon="🐝" title={lang === "sq" ? "Pa koshere ende" : "No hives yet"} hint={lang === "sq" ? "Shto kosheren tënde të parë për të ndjekur prodhimin." : "Add your first hive to track production."} action={<button onClick={() => setAddHive(true)} className="btn-primary"><Plus className="h-4 w-4" /> {lang === "sq" ? "Shto Koshere" : "Add Hive"}</button>} />
      ) : (
        <>
          <div className="grid grid-cols-3 gap-4">
            <div className="stat-card" style={{ borderLeftColor: "#E9A319" }}><p className="font-display text-2xl font-semibold text-brand-charcoal">{active}</p><p className="text-xs text-brand-charcoal/55">{lang === "sq" ? "Koshere aktive" : "Active hives"}</p></div>
            <div className="stat-card" style={{ borderLeftColor: "#6B4226" }}><p className="font-display text-2xl font-semibold text-brand-charcoal">{fmtNum(yearHoney, 0)} kg</p><p className="text-xs text-brand-charcoal/55">{lang === "sq" ? "Mjaltë këtë vit" : "Honey this year"}</p></div>
            <div className="stat-card" style={{ borderLeftColor: "#52B788" }}><p className="font-display text-2xl font-semibold text-brand-charcoal">{fmtNum(perHive, 1)} kg</p><p className="text-xs text-brand-charcoal/55">{lang === "sq" ? "Për koshere" : "Per hive"}</p></div>
          </div>

          <div className="grid gap-4 lg:grid-cols-3">
            <Card className="lg:col-span-2">
              <CardHeader title={lang === "sq" ? "Koshet" : "Hives"} />
              <div className="grid gap-3 sm:grid-cols-2">
                {farm.hives.map((h) => (
                  <div key={h.id} className="flex items-start justify-between rounded-card border border-line p-3">
                    <div className="flex items-start gap-2">
                      <span className="text-2xl">🐝</span>
                      <div>
                        <p className="font-semibold text-brand-charcoal">{h.name}</p>
                        <p className="text-xs text-brand-charcoal/50">{h.location}{h.queen_year ? ` · ${lang === "sq" ? "mbretëresha" : "queen"} ${h.queen_year}` : ""}</p>
                        <Badge tone={STATUS[h.status]?.tone ?? "neutral"} className="mt-1">{STATUS[h.status]?.[lang] ?? h.status}</Badge>
                      </div>
                    </div>
                    <button onClick={() => setEditing(h)} className="rounded-lg p-1.5 text-brand-charcoal/40 hover:bg-zebra hover:text-brand-green"><Pencil className="h-4 w-4" /></button>
                  </div>
                ))}
              </div>
            </Card>

            <Card>
              <CardHeader title={lang === "sq" ? "Korrjet e mjaltit" : "Honey harvests"} />
              {recent.length ? (
                <div className="divide-y divide-line text-sm">
                  {recent.map((h) => {
                    const hive = farm.hives.find((x) => x.id === h.hive_id);
                    return (
                      <div key={h.id} className="flex items-center justify-between py-2">
                        <span className="text-brand-charcoal/70">{fmtDateSq(h.harvest_date)} · {hive ? hive.name : (lang === "sq" ? "Total" : "Total")}</span>
                        <Badge tone="warning">{fmtNum(h.kg, 1)} kg</Badge>
                      </div>
                    );
                  })}
                </div>
              ) : <p className="py-3 text-center text-sm text-brand-charcoal/55">{lang === "sq" ? "Pa korrje mjalti" : "No honey records"}</p>}
            </Card>
          </div>
        </>
      )}

      <AddHiveModal open={addHive} onClose={() => setAddHive(false)} />
      <AddHiveModal key={editing?.id ?? "edit"} open={!!editing} editing={editing ?? undefined} onClose={() => setEditing(null)} />
      <LogHoneyModal open={logHoney} onClose={() => setLogHoney(false)} />
    </div>
  );
}
