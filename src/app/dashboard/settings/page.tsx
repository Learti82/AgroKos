"use client";

import { useApp } from "@/lib/store";
import { PageHeader, Card, CardHeader } from "@/components/ui/primitives";
import { LangToggle } from "@/components/LangToggle";
import { DEMO_PROFILE, KOSOVO_MUNICIPALITIES, FIELDS, ACTIVITIES, PLANTINGS, SOIL_ANALYSES, INVENTORY } from "@/lib/data/demo";
import { Download, Trash2 } from "lucide-react";

export default function SettingsPage() {
  const { lang } = useApp();

  function exportData() {
    const all = { profile: DEMO_PROFILE, fields: FIELDS, plantings: PLANTINGS, activities: ACTIVITIES, soil: SOIL_ANALYSES, inventory: INVENTORY };
    const url = URL.createObjectURL(new Blob([JSON.stringify(all, null, 2)], { type: "application/json" }));
    const a = document.createElement("a");
    a.href = url; a.download = "agrokos-te-dhenat.json"; a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="space-y-5">
      <PageHeader title={lang === "sq" ? "Cilësimet" : "Settings"} />

      <Card>
        <CardHeader title={lang === "sq" ? "Profili" : "Profile"} />
        <div className="grid gap-4 sm:grid-cols-2">
          <div><label className="label">{lang === "sq" ? "Emri i plotë" : "Full name"}</label><input className="input" defaultValue={DEMO_PROFILE.full_name} /></div>
          <div><label className="label">{lang === "sq" ? "Telefoni" : "Phone"}</label><input className="input" defaultValue={DEMO_PROFILE.phone} /></div>
          <div><label className="label">{lang === "sq" ? "Komuna" : "Municipality"}</label>
            <select className="input" defaultValue={DEMO_PROFILE.municipality}>{KOSOVO_MUNICIPALITIES.map((m) => <option key={m}>{m}</option>)}</select>
          </div>
          <div><label className="label">{lang === "sq" ? "Fshati" : "Village"}</label><input className="input" defaultValue={DEMO_PROFILE.village} /></div>
        </div>
        <button className="btn-primary mt-4">{lang === "sq" ? "Ruaj ndryshimet" : "Save changes"}</button>
      </Card>

      <Card>
        <CardHeader title={lang === "sq" ? "Gjuha" : "Language"} subtitle={lang === "sq" ? "Zgjidh gjuhën e ndërfaqes" : "Choose interface language"} />
        <LangToggle />
      </Card>

      <Card>
        <CardHeader title={lang === "sq" ? "Njoftimet" : "Notifications"} />
        <div className="space-y-3">
          {[
            lang === "sq" ? "Email për paralajmërime ngrice" : "Email for frost alerts",
            lang === "sq" ? "Email për thatësirë" : "Email for drought",
            lang === "sq" ? "Ndryshime të çmimeve të tregut" : "Market price changes",
            lang === "sq" ? "Subvencione të reja" : "New subsidies",
          ].map((l, i) => (
            <label key={l} className="flex items-center justify-between rounded-lg border border-line p-3">
              <span className="text-sm text-brand-charcoal/75">{l}</span>
              <input type="checkbox" defaultChecked={i < 3} className="h-4 w-4 accent-[#2D6A4F]" />
            </label>
          ))}
        </div>
      </Card>

      <Card>
        <CardHeader title={lang === "sq" ? "Të dhënat" : "Data"} />
        <div className="flex flex-wrap gap-3">
          <button onClick={exportData} className="btn-secondary"><Download className="h-4 w-4" /> {lang === "sq" ? "Eksporto të dhënat (JSON)" : "Export data (JSON)"}</button>
          <button className="btn border border-red-200 bg-red-50 text-red-600 hover:bg-red-100"><Trash2 className="h-4 w-4" /> {lang === "sq" ? "Fshi llogarinë" : "Delete account"}</button>
        </div>
      </Card>
    </div>
  );
}
