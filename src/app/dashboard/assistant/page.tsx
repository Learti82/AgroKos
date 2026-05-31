"use client";

import { useState, useRef, useEffect } from "react";
import { useApp } from "@/lib/store";
import { useFarm } from "@/components/DataProvider";
import { PageHeader, Card, HelpNote } from "@/components/ui/primitives";
import { cropName, cropById } from "@/lib/data/crops";
import { fmtHa } from "@/lib/utils";
import { Sparkles, Send, Loader2, Settings } from "lucide-react";

type Msg = { role: "user" | "assistant"; content: string };

function buildContext(farm: ReturnType<typeof useFarm>, lang: "sq" | "en"): string {
  const p = farm.profile;
  const lines: string[] = [];
  lines.push(`Fermeri: ${p.full_name}, ${p.village || ""} ${p.municipality || ""}`.trim());
  if (p.farm_size_ha) lines.push(`Madhësia e fermës: ${fmtHa(p.farm_size_ha)}`);
  if (farm.fields.length) {
    lines.push("Fushat:");
    for (const f of farm.fields) {
      const crop = cropById(f.current_crop_id);
      lines.push(`- ${f.name}: ${fmtHa(f.area_ha)}, tokë ${f.soil_type}, ujitje ${f.irrigation_type}${crop ? `, kulturë ${cropName(crop.id, lang)}` : ""}`);
    }
  }
  const active = farm.plantings.filter((x) => x.status === "active");
  if (active.length) {
    lines.push("Mbjelljet aktive:");
    for (const pl of active) lines.push(`- ${cropName(pl.crop_id, lang)} (mbjellë ${pl.planting_date}, korrje e pritur ${pl.expected_harvest_date})`);
  }
  return lines.join("\n");
}

const SUGGESTIONS_SQ = [
  "Kur duhet të plehëroj grurin këtë sezon?",
  "Si ta mbroj domaten nga vrugu?",
  "Sa ujë i duhet specit në korrik?",
  "Çfarë të mbjell pas patates?",
];

export default function AssistantPage() {
  const { lang } = useApp();
  const farm = useFarm();
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [configured, setConfigured] = useState<boolean | null>(null);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch("/api/assistant").then((r) => r.json()).then((d) => setConfigured(!!d.configured)).catch(() => setConfigured(false));
  }, []);
  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, busy]);

  async function send(text: string) {
    const q = text.trim();
    if (!q || busy) return;
    const next = [...messages, { role: "user" as const, content: q }];
    setMessages(next);
    setInput("");
    setBusy(true);
    try {
      const res = await fetch("/api/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next, context: buildContext(farm, lang) }),
      });
      const d = await res.json();
      if (d.ok) setMessages((m) => [...m, { role: "assistant", content: d.text }]);
      else if (d.configured === false) setConfigured(false);
      else setMessages((m) => [...m, { role: "assistant", content: lang === "sq" ? "Më fal, diçka shkoi keq. Provo përsëri." : "Sorry, something went wrong. Try again." }]);
    } catch {
      setMessages((m) => [...m, { role: "assistant", content: lang === "sq" ? "Gabim rrjeti." : "Network error." }]);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex h-[calc(100vh-7rem)] flex-col">
      <PageHeader title={lang === "sq" ? "Asistenti AI Agronomik" : "AI Agronomist"} subtitle={lang === "sq" ? "Pyet çfarëdo për fermën tënde" : "Ask anything about your farm"} />

      {configured === false ? (
        <Card className="border-l-4 border-brand-amber">
          <div className="flex items-start gap-3">
            <Settings className="mt-0.5 h-5 w-5 text-brand-amber" />
            <div className="text-sm">
              <p className="font-semibold text-brand-charcoal">{lang === "sq" ? "Asistenti AI nuk është konfiguruar" : "AI Assistant not configured"}</p>
              <p className="mt-1 text-brand-charcoal/70">{lang === "sq" ? "Shto një çelës ANTHROPIC_API_KEY në skedarin .env.local për ta aktivizuar asistentin. Merr çelësin falas nga console.anthropic.com." : "Add an ANTHROPIC_API_KEY to .env.local to enable the assistant. Get a key at console.anthropic.com."}</p>
              <pre className="mt-2 rounded-lg bg-brand-cream p-2 text-xs">ANTHROPIC_API_KEY=sk-ant-...</pre>
            </div>
          </div>
        </Card>
      ) : (
        <>
          <HelpNote>
            {lang === "sq"
              ? "Asistenti njeh fushat, kulturat dhe komunën tënde dhe jep këshilla të personalizuara për Kosovën. Mos u mbështet vetëm te AI për vendime kritike — verifiko me agronom kur është e nevojshme."
              : "The assistant knows your fields, crops and municipality and gives Kosovo-tailored advice. Don't rely on AI alone for critical decisions — verify with an agronomist when needed."}
          </HelpNote>

          <Card className="flex flex-1 flex-col overflow-hidden p-0">
            <div className="flex-1 space-y-4 overflow-y-auto p-4">
              {messages.length === 0 && (
                <div className="grid h-full place-items-center text-center">
                  <div>
                    <div className="mx-auto mb-3 grid h-14 w-14 place-items-center rounded-2xl bg-brand-green/10 text-brand-green"><Sparkles className="h-7 w-7" /></div>
                    <p className="font-semibold text-brand-charcoal">{lang === "sq" ? "Si mund të të ndihmoj sot?" : "How can I help today?"}</p>
                    <div className="mx-auto mt-4 flex max-w-md flex-wrap justify-center gap-2">
                      {SUGGESTIONS_SQ.map((s) => (
                        <button key={s} onClick={() => send(s)} className="rounded-full border border-line bg-white px-3 py-1.5 text-xs text-brand-charcoal/70 hover:bg-brand-lime/30">{s}</button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[85%] whitespace-pre-wrap rounded-2xl px-4 py-2.5 text-sm ${m.role === "user" ? "bg-brand-green text-white" : "bg-zebra text-brand-charcoal"}`}>
                    {m.content}
                  </div>
                </div>
              ))}
              {busy && (
                <div className="flex justify-start">
                  <div className="rounded-2xl bg-zebra px-4 py-2.5 text-sm text-brand-charcoal/50"><Loader2 className="h-4 w-4 animate-spin" /></div>
                </div>
              )}
              <div ref={endRef} />
            </div>

            <form onSubmit={(e) => { e.preventDefault(); send(input); }} className="flex items-center gap-2 border-t border-line p-3">
              <input value={input} onChange={(e) => setInput(e.target.value)} placeholder={lang === "sq" ? "Shkruaj pyetjen tënde…" : "Type your question…"} className="input flex-1" />
              <button type="submit" disabled={busy || !input.trim()} className="btn-primary"><Send className="h-4 w-4" /></button>
            </form>
          </Card>
        </>
      )}
    </div>
  );
}
