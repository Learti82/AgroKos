"use client";

import { useMemo, useState } from "react";
import { useApp } from "@/lib/store";
import { PageHeader, Card, EmptyState, Badge, HelpNote } from "@/components/ui/primitives";
import { useFarm } from "@/components/DataProvider";
import { AddActivityModal } from "@/components/AddModals";
import { ACTIVITY_LABELS } from "@/lib/i18n";
import { fmtFullSq, daysAgo } from "@/lib/dates";
import { fmtEur, fmtNum } from "@/lib/utils";
import { Download, Plus } from "lucide-react";

export default function ActivitiesPage() {
  const { lang } = useApp();
  const { activities: ACTIVITIES, fields: FIELDS } = useFarm();
  const [type, setType] = useState("all");
  const [field, setField] = useState("all");
  const [add, setAdd] = useState(false);

  const filtered = useMemo(() =>
    ACTIVITIES
      .filter((a) => type === "all" || a.activity_type === type)
      .filter((a) => field === "all" || a.field_id === field)
      .sort((a, b) => +new Date(b.activity_date) - +new Date(a.activity_date)),
    [type, field, ACTIVITIES]
  );

  const thisMonth = ACTIVITIES.filter((a) => daysAgo(a.activity_date) <= 30);
  const spend = thisMonth.reduce((s, a) => s + a.cost_eur, 0);
  const byField = thisMonth.reduce<Record<string, number>>((m, a) => ((m[a.field_id] = (m[a.field_id] || 0) + 1), m), {});
  const topField = Object.entries(byField).sort((a, b) => b[1] - a[1])[0];
  const byType = thisMonth.reduce<Record<string, number>>((m, a) => ((m[a.activity_type] = (m[a.activity_type] || 0) + 1), m), {});
  const topType = Object.entries(byType).sort((a, b) => b[1] - a[1])[0];

  function exportCsv() {
    const rows = [["Data", "Lloji", "Fusha", "Përshkrimi", "Input", "Sasia", "Njësia", "Kosto"]];
    for (const a of filtered) {
      const f = FIELDS.find((x) => x.id === a.field_id);
      rows.push([a.activity_date, ACTIVITY_LABELS[a.activity_type].sq, f?.name ?? "", a.description, a.input_used ?? "", String(a.input_quantity ?? ""), a.input_unit ?? "", String(a.cost_eur)]);
    }
    const csv = rows.map((r) => r.map((c) => `"${c.replace(/"/g, '""')}"`).join(",")).join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    const a = document.createElement("a");
    a.href = url; a.download = "agrokos-aktivitete.csv"; a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="space-y-5">
      <PageHeader
        title={lang === "sq" ? "Ditari i Punëve" : "Activity Log"}
        action={
          <div className="flex gap-2">
            <button onClick={exportCsv} className="btn-secondary"><Download className="h-4 w-4" /> CSV</button>
            <button onClick={() => setAdd(true)} className="btn-primary"><Plus className="h-4 w-4" /> {lang === "sq" ? "Shto" : "Add"}</button>
          </div>
        }
      />

      <HelpNote>
        {lang === "sq"
          ? "Ditari i punëve regjistron çdo veprim në fermë — plehërim, spërkatje, ujitje, korrje — me koston dhe inputet e përdorura. Kjo të ndihmon të llogaritësh shpenzimet dhe fitimin real. Kliko “Shto” për të regjistruar një aktivitet."
          : "The activity log records every farm operation — fertilizing, spraying, irrigation, harvest — with the cost and inputs used. This lets you track real spend and profit. Click “Add” to log one."}
      </HelpNote>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {[
          { l: lang === "sq" ? "Aktivitete (30 ditë)" : "Activities (30d)", v: String(thisMonth.length), c: "#2D6A4F" },
          { l: lang === "sq" ? "Shpenzime (30 ditë)" : "Spend (30d)", v: fmtEur(spend, 0), c: "#E9A319" },
          { l: lang === "sq" ? "Fusha më aktive" : "Most active field", v: topField ? FIELDS.find((f) => f.id === topField[0])?.name ?? "—" : "—", c: "#1A759F" },
          { l: lang === "sq" ? "Më e shpeshtë" : "Most common", v: topType ? ACTIVITY_LABELS[topType[0]][lang] : "—", c: "#52B788" },
        ].map((s) => (
          <div key={s.l} className="stat-card" style={{ borderLeftColor: s.c }}>
            <p className="font-display text-xl font-semibold text-brand-charcoal">{s.v}</p>
            <p className="text-xs text-brand-charcoal/55">{s.l}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-2">
        <select className="input max-w-[180px]" value={type} onChange={(e) => setType(e.target.value)}>
          <option value="all">{lang === "sq" ? "Të gjitha llojet" : "All types"}</option>
          {Object.entries(ACTIVITY_LABELS).map(([k, v]) => <option key={k} value={k}>{v.icon} {v[lang]}</option>)}
        </select>
        <select className="input max-w-[180px]" value={field} onChange={(e) => setField(e.target.value)}>
          <option value="all">{lang === "sq" ? "Të gjitha fushat" : "All fields"}</option>
          {FIELDS.map((f) => <option key={f.id} value={f.id}>{f.name}</option>)}
        </select>
      </div>

      <Card className="p-0">
        {filtered.length ? (
          <div className="divide-y divide-line">
            {filtered.map((a) => {
              const f = FIELDS.find((x) => x.id === a.field_id);
              const meta = ACTIVITY_LABELS[a.activity_type];
              return (
                <div key={a.id} className="flex gap-3 p-4">
                  <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-brand-lime/50 text-lg">{meta.icon}</div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-semibold text-brand-charcoal">{meta[lang]}</p>
                      {f && <Badge>{f.name}</Badge>}
                      {a.cost_eur > 0 && <Badge tone="warning">{fmtEur(a.cost_eur)}</Badge>}
                    </div>
                    <p className="mt-0.5 text-sm text-brand-charcoal/70">{a.description}</p>
                    <p className="mt-1 text-xs text-brand-charcoal/45">
                      {fmtFullSq(a.activity_date)}
                      {a.input_used && ` · ${a.input_used} ${a.input_quantity ? `(${fmtNum(a.input_quantity, 0)} ${a.input_unit})` : ""}`}
                      {a.performed_by !== "self" && ` · 👤 ${a.performed_by}`}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <EmptyState icon="📋" title={lang === "sq" ? "Asnjë aktivitet ende" : "No activities yet"} hint={lang === "sq" ? "Regjistro punën e parë në fermë." : "Log your first farm task."} action={<button onClick={() => setAdd(true)} className="btn-primary"><Plus className="h-4 w-4" /> {lang === "sq" ? "Shto Aktivitet" : "Add Activity"}</button>} />
        )}
      </Card>

      <AddActivityModal open={add} onClose={() => setAdd(false)} />
    </div>
  );
}
