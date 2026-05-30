"use client";

import { useState } from "react";
import { useApp } from "@/lib/store";
import { PageHeader, Card, Badge, EmptyState } from "@/components/ui/primitives";
import { ALERTS, FIELDS } from "@/lib/data/demo";
import { fmtFullSq, relativeSq } from "@/lib/dates";
import { cn } from "@/lib/utils";
import { CheckCheck } from "lucide-react";

const SEV = { critical: { sq: "Kritik", en: "Critical", tone: "critical" }, warning: { sq: "Kujdes", en: "Warning", tone: "warning" }, info: { sq: "Info", en: "Info", tone: "info" } } as const;

export default function AlertsPage() {
  const { lang } = useApp();
  const [alerts, setAlerts] = useState(ALERTS);
  const [filter, setFilter] = useState<"all" | "critical" | "warning" | "info">("all");

  const shown = alerts.filter((a) => filter === "all" || a.severity === filter).sort((a, b) => +new Date(b.triggered_at) - +new Date(a.triggered_at));
  const markAll = () => setAlerts((p) => p.map((a) => ({ ...a, is_read: true })));
  const toggle = (id: string) => setAlerts((p) => p.map((a) => (a.id === id ? { ...a, is_read: !a.is_read } : a)));

  return (
    <div className="space-y-5">
      <PageHeader
        title={lang === "sq" ? "Qendra e Paralajmërimeve" : "Alerts Center"}
        subtitle={`${alerts.filter((a) => !a.is_read).length} ${lang === "sq" ? "të palexuara" : "unread"}`}
        action={<button onClick={markAll} className="btn-secondary"><CheckCheck className="h-4 w-4" /> {lang === "sq" ? "Lexo të gjitha" : "Mark all read"}</button>}
      />

      <div className="flex flex-wrap gap-2">
        {(["all", "critical", "warning", "info"] as const).map((f) => (
          <button key={f} onClick={() => setFilter(f)} className={cn("badge border transition", filter === f ? "border-brand-green bg-brand-green text-white" : "border-line bg-white text-brand-charcoal/60 hover:bg-zebra")}>
            {f === "all" ? (lang === "sq" ? "Të gjitha" : "All") : SEV[f][lang]}
          </button>
        ))}
      </div>

      {shown.length ? (
        <div className="space-y-3">
          {shown.map((a) => {
            const field = FIELDS.find((f) => f.id === a.field_id);
            return (
              <Card key={a.id} className={cn("border-l-4 transition", a.severity === "critical" ? "border-red-500" : a.severity === "warning" ? "border-brand-amber" : "border-brand-sky", a.is_read && "opacity-60")}>
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge tone={SEV[a.severity].tone}>{SEV[a.severity][lang]}</Badge>
                      {field && <Badge>{field.name}</Badge>}
                      {!a.is_read && <span className="h-2 w-2 rounded-full bg-brand-green-light" />}
                    </div>
                    <h3 className="mt-2 font-semibold text-brand-charcoal">{lang === "sq" ? a.title_sq : a.title_en}</h3>
                    <p className="mt-1 text-sm text-brand-charcoal/70">{lang === "sq" ? a.message_sq : a.message_en}</p>
                    <p className="mt-2 text-xs text-brand-charcoal/45">{fmtFullSq(a.triggered_at)} · {relativeSq(a.triggered_at)}</p>
                  </div>
                  <button onClick={() => toggle(a.id)} className="shrink-0 text-xs font-semibold text-brand-green hover:underline">
                    {a.is_read ? (lang === "sq" ? "E palexuar" : "Unread") : (lang === "sq" ? "Lexuar" : "Read")}
                  </button>
                </div>
              </Card>
            );
          })}
        </div>
      ) : (
        <EmptyState icon="🌱" title={lang === "sq" ? "Asnjë paralajmërim" : "No alerts"} hint={lang === "sq" ? "Gjithçka në rregull në fermën tënde." : "All good on your farm."} />
      )}
    </div>
  );
}
