"use client";

import { useApp } from "@/lib/store";
import { PageHeader, Card, HelpNote } from "@/components/ui/primitives";
import { OFFICIAL_LINKS, DIR_LABELS, type DirCategory } from "@/lib/data/directory";
import { ExternalLink } from "lucide-react";

export default function DirectoryPage() {
  const { lang } = useApp();

  return (
    <div className="space-y-5">
      <PageHeader title={lang === "sq" ? "Burime & Kontakte" : "Resources & Contacts"} subtitle={lang === "sq" ? "Institucione zyrtare të bujqësisë në Kosovë" : "Official agriculture institutions in Kosovo"} />

      <HelpNote>
        {lang === "sq"
          ? "Lidhje zyrtare e të verifikuara për fermerët e Kosovës — ministria, agjencitë, çmimet e tregut dhe statistikat. Nuk shfaqim kontakte private të paverifikuara. (Një listë e furnizuesve lokalë të kontrolluar mund të shtohet më vonë.)"
          : "Official, verified links for Kosovo farmers — the ministry, agencies, market prices and statistics. We don't show unverified private contacts. (A vetted local-supplier list may be added later.)"}
      </HelpNote>

      <div className="grid gap-3 sm:grid-cols-2">
        {OFFICIAL_LINKS.map((l) => (
          <a key={l.url} href={l.url} target="_blank" rel="noreferrer" className="card flex items-start justify-between gap-3 p-4 transition hover:shadow-card-hover">
            <div>
              <h3 className="font-semibold text-brand-charcoal">{l.name}</h3>
              <p className="mt-0.5 text-sm text-brand-charcoal/60">{lang === "sq" ? l.note_sq : l.note_en}</p>
              <p className="mt-1 text-xs text-brand-green">{l.url.replace(/^https?:\/\//, "")}</p>
            </div>
            <ExternalLink className="h-4 w-4 shrink-0 text-brand-charcoal/40" />
          </a>
        ))}
      </div>

      <Card className="bg-brand-lime/20">
        <p className="text-sm text-brand-charcoal/70">
          {lang === "sq"
            ? "💡 Kategoritë e shërbimeve që do të nevojiten: " + (Object.keys(DIR_LABELS) as DirCategory[]).map((k) => DIR_LABELS[k].sq).join(", ") + ". Për kontakte lokale, pyet AZHB-në ose drejtorinë komunale të bujqësisë."
            : "💡 Service categories you may need: " + (Object.keys(DIR_LABELS) as DirCategory[]).map((k) => DIR_LABELS[k].en).join(", ") + ". For local contacts, ask AZHB or your municipal agriculture office."}
        </p>
      </Card>
    </div>
  );
}
