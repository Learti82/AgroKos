"use client";

import { useState, useRef, useEffect } from "react";
import { useApp } from "@/lib/store";
import { PageHeader, Card, HelpNote } from "@/components/ui/primitives";
import { CROPS, cropName } from "@/lib/data/crops";
import { ScanLine, Upload, Loader2, Settings, RefreshCw } from "lucide-react";

function parseSections(text: string) {
  const keys = ["PROBLEMI", "SHENJAT", "SHKAKU", "TRAJTIMI", "PARANDALIMI"];
  const out: { key: string; value: string }[] = [];
  for (let i = 0; i < keys.length; i++) {
    const k = keys[i];
    const re = new RegExp(`${k}\\s*:?\\s*([\\s\\S]*?)(?=${keys.slice(i + 1).join("|") || "$"}\\s*:|$)`, "i");
    const m = text.match(re);
    if (m && m[1].trim()) out.push({ key: k, value: m[1].trim() });
  }
  return out.length ? out : [{ key: "", value: text }];
}

const LABELS: Record<string, { sq: string; icon: string; tone: string }> = {
  PROBLEMI: { sq: "Problemi", icon: "🔎", tone: "border-red-400 bg-red-50" },
  SHENJAT: { sq: "Shenjat", icon: "👁️", tone: "border-brand-amber bg-brand-amber/5" },
  SHKAKU: { sq: "Shkaku", icon: "🧫", tone: "border-brand-earth bg-brand-earth/5" },
  TRAJTIMI: { sq: "Trajtimi", icon: "💊", tone: "border-brand-green bg-brand-green/5" },
  PARANDALIMI: { sq: "Parandalimi", icon: "🛡️", tone: "border-brand-sky bg-brand-sky/5" },
};

export default function DiagnosePage() {
  const { lang } = useApp();
  const [preview, setPreview] = useState<string | null>(null);
  const [b64, setB64] = useState<{ data: string; mediaType: string } | null>(null);
  const [crop, setCrop] = useState("");
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [configured, setConfigured] = useState<boolean | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetch("/api/assistant").then((r) => r.json()).then((d) => setConfigured(!!d.configured)).catch(() => setConfigured(false));
  }, []);

  function onFile(file: File) {
    if (file.size > 5 * 1024 * 1024) { alert(lang === "sq" ? "Fotoja është shumë e madhe (max 5MB)." : "Image too large (max 5MB)."); return; }
    setResult(null);
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      setPreview(dataUrl);
      const [meta, data] = dataUrl.split(",");
      const mediaType = meta.slice(meta.indexOf(":") + 1, meta.indexOf(";"));
      setB64({ data, mediaType });
    };
    reader.readAsDataURL(file);
  }

  async function diagnose() {
    if (!b64 || busy) return;
    setBusy(true);
    setResult(null);
    try {
      const res = await fetch("/api/diagnose", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: b64.data, mediaType: b64.mediaType, crop: crop ? cropName(crop, lang) : "", note }),
      });
      const d = await res.json();
      if (d.ok) setResult(d.text);
      else if (d.configured === false) setConfigured(false);
      else alert(lang === "sq" ? "Diagnoza dështoi. Provo përsëri." : "Diagnosis failed. Try again.");
    } catch {
      alert(lang === "sq" ? "Gabim rrjeti." : "Network error.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-5">
      <PageHeader title={lang === "sq" ? "Diagnoza me Foto" : "Photo Diagnosis"} subtitle={lang === "sq" ? "Foto bimën e sëmurë → diagnozë + trajtim" : "Photograph a sick plant → diagnosis + treatment"} />

      {configured === false ? (
        <Card className="border-l-4 border-brand-amber">
          <div className="flex items-start gap-3">
            <Settings className="mt-0.5 h-5 w-5 text-brand-amber" />
            <div className="text-sm">
              <p className="font-semibold text-brand-charcoal">{lang === "sq" ? "AI nuk është konfiguruar" : "AI not configured"}</p>
              <p className="mt-1 text-brand-charcoal/70">{lang === "sq" ? "Shto ANTHROPIC_API_KEY në .env.local për ta aktivizuar diagnozën me foto." : "Add ANTHROPIC_API_KEY to .env.local to enable photo diagnosis."}</p>
            </div>
          </div>
        </Card>
      ) : (
        <>
          <HelpNote>
            {lang === "sq"
              ? "Bëj një foto të qartë të gjethes, frutit ose bimës së prekur (afër dhe me dritë të mirë). AI-ja jep një diagnozë të mundshme dhe trajtim. Kjo është një ndihmë orientuese — për raste serioze konsulto një agronom."
              : "Take a clear photo of the affected leaf, fruit or plant (close-up, good light). The AI gives a likely diagnosis and treatment. This is guidance only — for serious cases consult an agronomist."}
          </HelpNote>

          <div className="grid gap-4 lg:grid-cols-2">
            <Card>
              <input ref={fileRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={(e) => e.target.files?.[0] && onFile(e.target.files[0])} />
              {preview ? (
                <div className="space-y-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={preview} alt="" className="max-h-72 w-full rounded-card object-contain bg-zebra" />
                  <button onClick={() => fileRef.current?.click()} className="btn-secondary w-full"><RefreshCw className="h-4 w-4" /> {lang === "sq" ? "Ndrysho foton" : "Change photo"}</button>
                </div>
              ) : (
                <button onClick={() => fileRef.current?.click()} className="flex h-64 w-full flex-col items-center justify-center gap-2 rounded-card border-2 border-dashed border-line text-brand-charcoal/55 hover:bg-zebra">
                  <Upload className="h-8 w-8" />
                  <span className="text-sm font-medium">{lang === "sq" ? "Kliko për të ngarkuar foto" : "Click to upload a photo"}</span>
                  <span className="text-xs">{lang === "sq" ? "ose bëj foto me kamerë" : "or take a photo"}</span>
                </button>
              )}

              <div className="mt-4 space-y-3">
                <div>
                  <label className="label">{lang === "sq" ? "Kultura (opsionale)" : "Crop (optional)"}</label>
                  <select className="input" value={crop} onChange={(e) => setCrop(e.target.value)}>
                    <option value="">{lang === "sq" ? "— Zgjidh —" : "— Select —"}</option>
                    {CROPS.map((c) => <option key={c.id} value={c.id}>{c.icon_emoji} {cropName(c.id, lang)}</option>)}
                  </select>
                </div>
                <div>
                  <label className="label">{lang === "sq" ? "Shënim (opsional)" : "Note (optional)"}</label>
                  <input className="input" value={note} onChange={(e) => setNote(e.target.value)} placeholder={lang === "sq" ? "p.sh. gjethet po zverdhen prej 3 ditësh" : "e.g. leaves yellowing for 3 days"} />
                </div>
                <button onClick={diagnose} disabled={!b64 || busy} className="btn-primary w-full">
                  {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <ScanLine className="h-4 w-4" />} {lang === "sq" ? "Diagnostiko" : "Diagnose"}
                </button>
              </div>
            </Card>

            <Card>
              {!result && !busy && (
                <div className="grid h-full place-items-center text-center text-brand-charcoal/50">
                  <div>
                    <ScanLine className="mx-auto mb-2 h-8 w-8" />
                    <p className="text-sm">{lang === "sq" ? "Diagnoza do të shfaqet këtu" : "The diagnosis will appear here"}</p>
                  </div>
                </div>
              )}
              {busy && <div className="grid h-full place-items-center text-brand-charcoal/50"><Loader2 className="h-7 w-7 animate-spin" /></div>}
              {result && (
                <div className="space-y-3">
                  {parseSections(result).map((s, i) => {
                    const meta = LABELS[s.key.toUpperCase()];
                    return (
                      <div key={i} className={`rounded-card border-l-4 p-3 ${meta?.tone ?? "border-line bg-zebra"}`}>
                        {meta && <p className="mb-1 text-xs font-semibold uppercase text-brand-charcoal/60">{meta.icon} {meta.sq}</p>}
                        <p className="whitespace-pre-wrap text-sm text-brand-charcoal/85">{s.value}</p>
                      </div>
                    );
                  })}
                  <p className="text-center text-[11px] text-brand-charcoal/40">{lang === "sq" ? "⚠️ Vlerësim me AI — verifiko me agronom për raste serioze." : "⚠️ AI estimate — verify with an agronomist for serious cases."}</p>
                </div>
              )}
            </Card>
          </div>
        </>
      )}
    </div>
  );
}
