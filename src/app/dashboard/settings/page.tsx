"use client";

import { useState } from "react";
import { useApp } from "@/lib/store";
import { PageHeader, Card, CardHeader } from "@/components/ui/primitives";
import { LangToggle } from "@/components/LangToggle";
import { useFarm } from "@/components/DataProvider";
import { KOSOVO_MUNICIPALITIES } from "@/lib/data/demo";
import { saveProfile } from "@/app/actions/profile";
import { Download, Trash2, Check, Loader2 } from "lucide-react";

export default function SettingsPage() {
  const { lang } = useApp();
  const farm = useFarm();
  const p = farm.profile;

  const [fullName, setFullName] = useState(p.full_name);
  const [phone, setPhone] = useState(p.phone);
  const [municipality, setMunicipality] = useState(p.municipality || KOSOVO_MUNICIPALITIES[0]);
  const [village, setVillage] = useState(p.village);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  async function onSave() {
    setSaving(true);
    setSaved(false);
    const res = await saveProfile({ full_name: fullName, phone, municipality, village });
    setSaving(false);
    if (res.ok) {
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } else {
      alert(lang === "sq" ? "Ruajtja kërkon hyrje (Clerk + Supabase)." : "Saving requires login (Clerk + Supabase).");
    }
  }

  function exportData() {
    const all = { profile: farm.profile, fields: farm.fields, plantings: farm.plantings, activities: farm.activities, soil: farm.soils, inventory: farm.inventory };
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
          <div><label className="label">{lang === "sq" ? "Emri i plotë" : "Full name"}</label><input className="input" value={fullName} onChange={(e) => setFullName(e.target.value)} /></div>
          <div><label className="label">{lang === "sq" ? "Telefoni" : "Phone"}</label><input className="input" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+383 ..." /></div>
          <div><label className="label">{lang === "sq" ? "Komuna" : "Municipality"}</label>
            <select className="input" value={municipality} onChange={(e) => setMunicipality(e.target.value)}>{KOSOVO_MUNICIPALITIES.map((m) => <option key={m}>{m}</option>)}</select>
          </div>
          <div><label className="label">{lang === "sq" ? "Fshati" : "Village"}</label><input className="input" value={village} onChange={(e) => setVillage(e.target.value)} /></div>
        </div>
        <button onClick={onSave} disabled={saving} className="btn-primary mt-4">
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : saved ? <Check className="h-4 w-4" /> : null}
          {saved ? (lang === "sq" ? "U ruajt" : "Saved") : lang === "sq" ? "Ruaj ndryshimet" : "Save changes"}
        </button>
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
