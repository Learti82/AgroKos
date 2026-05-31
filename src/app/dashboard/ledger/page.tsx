"use client";

import { useState } from "react";
import { useApp } from "@/lib/store";
import { useFarm } from "@/components/DataProvider";
import { PageHeader, Card, Badge, EmptyState, HelpNote } from "@/components/ui/primitives";
import { AddIncomeModal } from "@/components/AddModals";
import { deleteIncome } from "@/app/actions/farm";
import { useRouter } from "next/navigation";
import { ACTIVITY_LABELS } from "@/lib/i18n";
import { fmtEur, cn } from "@/lib/utils";
import { fmtDateSq } from "@/lib/dates";
import { Plus, Download, Trash2 } from "lucide-react";

const INCOME_LABEL: Record<string, { sq: string; en: string }> = {
  harvest: { sq: "Shitje korrjeje", en: "Harvest sale" },
  livestock: { sq: "Bulmet/blegtori", en: "Dairy/livestock" },
  subsidy: { sq: "Subvencion", en: "Subsidy" },
  other: { sq: "Tjetër", en: "Other" },
};

export default function LedgerPage() {
  const { lang } = useApp();
  const farm = useFarm();
  const router = useRouter();
  const [add, setAdd] = useState(false);

  type Entry = { id: string; date: string; label: string; detail: string; amount: number; kind: "in" | "out"; canDelete?: boolean };
  const entries: Entry[] = [];
  for (const i of farm.incomes) entries.push({ id: `inc-${i.id}`, date: i.income_date, label: INCOME_LABEL[i.category]?.[lang] ?? i.category, detail: i.description, amount: i.amount, kind: "in", canDelete: true });
  for (const a of farm.activities.filter((x) => x.cost_eur > 0)) entries.push({ id: `act-${a.id}`, date: a.activity_date, label: ACTIVITY_LABELS[a.activity_type]?.[lang] ?? a.activity_type, detail: a.description || a.input_used || "", amount: a.cost_eur, kind: "out" });
  entries.sort((a, b) => +new Date(b.date) - +new Date(a.date));

  const income = entries.filter((e) => e.kind === "in").reduce((s, e) => s + e.amount, 0);
  const expense = entries.filter((e) => e.kind === "out").reduce((s, e) => s + e.amount, 0);
  const net = income - expense;

  async function del(id: string) {
    if (!confirm(lang === "sq" ? "Të fshihet kjo e ardhur?" : "Delete this income?")) return;
    const res = await deleteIncome(id.replace("inc-", ""));
    if (res.ok) router.refresh();
  }

  function exportCsv() {
    const rows = [["Data", "Tipi", "Kategoria", "Përshkrimi", "Shuma"]];
    for (const e of entries) rows.push([e.date, e.kind === "in" ? "E ardhur" : "Shpenzim", e.label, e.detail, String(e.kind === "in" ? e.amount : -e.amount)]);
    const csv = rows.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(",")).join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    const a = document.createElement("a"); a.href = url; a.download = "agrokos-llogaria.csv"; a.click(); URL.revokeObjectURL(url);
  }

  return (
    <div className="space-y-5">
      <PageHeader
        title={lang === "sq" ? "Llogaria (Të ardhura & Shpenzime)" : "Ledger (Income & Expenses)"}
        action={
          <div className="flex gap-2">
            <button onClick={exportCsv} className="btn-secondary"><Download className="h-4 w-4" /> CSV</button>
            <button onClick={() => setAdd(true)} className="btn-primary"><Plus className="h-4 w-4" /> {lang === "sq" ? "Të ardhur" : "Income"}</button>
          </div>
        }
      />

      <HelpNote>
        {lang === "sq"
          ? "Libri i plotë i parave: shpenzimet vijnë automatikisht nga aktivitetet me kosto, ndërsa të ardhurat (shitje, subvencione, bulmet) i shton këtu. Eksporto në CSV për kontabilistin."
          : "Your full money book: expenses flow in automatically from activities with a cost, and you add income (sales, subsidies, dairy) here. Export to CSV for your accountant."}
      </HelpNote>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="stat-card" style={{ borderLeftColor: "#52B788" }}><p className="font-display text-2xl font-semibold text-brand-green">{fmtEur(income, 0)}</p><p className="text-xs text-brand-charcoal/55">{lang === "sq" ? "Të ardhura" : "Income"}</p></div>
        <div className="stat-card" style={{ borderLeftColor: "#E9A319" }}><p className="font-display text-2xl font-semibold text-brand-charcoal">{fmtEur(expense, 0)}</p><p className="text-xs text-brand-charcoal/55">{lang === "sq" ? "Shpenzime" : "Expenses"}</p></div>
        <div className="stat-card" style={{ borderLeftColor: net >= 0 ? "#2D6A4F" : "#ef4444" }}><p className={cn("font-display text-2xl font-semibold", net >= 0 ? "text-brand-green" : "text-red-600")}>{fmtEur(net, 0)}</p><p className="text-xs text-brand-charcoal/55">{lang === "sq" ? "Bilanci" : "Balance"}</p></div>
      </div>

      <Card className="p-0">
        {entries.length === 0 ? (
          <EmptyState icon="📒" title={lang === "sq" ? "Llogaria bosh" : "Ledger empty"} hint={lang === "sq" ? "Shto të ardhura ose regjistro aktivitete me kosto." : "Add income or log activities with a cost."} />
        ) : (
          <div className="divide-y divide-line">
            {entries.map((e) => (
              <div key={e.id} className="flex items-center gap-3 p-3">
                <span className={cn("grid h-8 w-8 shrink-0 place-items-center rounded-full text-sm", e.kind === "in" ? "bg-brand-green/10 text-brand-green" : "bg-brand-amber/15 text-[#9a6a05]")}>{e.kind === "in" ? "↓" : "↑"}</span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-brand-charcoal">{e.label}</p>
                  <p className="truncate text-xs text-brand-charcoal/50">{fmtDateSq(e.date)}{e.detail ? ` · ${e.detail}` : ""}</p>
                </div>
                <span className={cn("font-semibold tabular-nums", e.kind === "in" ? "text-brand-green" : "text-brand-charcoal/70")}>{e.kind === "in" ? "+" : "−"}{fmtEur(e.amount, 0)}</span>
                {e.canDelete && <button onClick={() => del(e.id)} className="rounded-lg p-1.5 text-brand-charcoal/30 hover:text-red-600"><Trash2 className="h-4 w-4" /></button>}
              </div>
            ))}
          </div>
        )}
      </Card>

      <AddIncomeModal open={add} onClose={() => setAdd(false)} />
    </div>
  );
}
