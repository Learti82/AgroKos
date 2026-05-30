"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Logo } from "@/components/ui/Logo";
import { LangToggle } from "@/components/LangToggle";
import { useApp } from "@/lib/store";
import { KOSOVO_MUNICIPALITIES } from "@/lib/data/demo";
import { CROPS, cropName } from "@/lib/data/crops";
import { cn } from "@/lib/utils";
import { ArrowRight, ArrowLeft, Check } from "lucide-react";

export default function Onboarding() {
  const { lang } = useApp();
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [crops, setCrops] = useState<string[]>([]);

  const steps = [
    { sq: "Mirë se vini", en: "Welcome" },
    { sq: "Të dhënat", en: "Your details" },
    { sq: "Ferma", en: "Your farm" },
    { sq: "Gjuha", en: "Language" },
  ];
  const next = () => (step < steps.length - 1 ? setStep(step + 1) : router.push("/dashboard"));

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="relative hidden flex-col justify-between overflow-hidden bg-gradient-to-br from-brand-charcoal via-brand-green to-brand-sky p-10 text-white lg:flex">
        <div className="grain absolute inset-0 opacity-10" />
        <Logo light />
        <div className="relative">
          <h2 className="font-display text-4xl font-semibold leading-tight">Mirë se vini<br />në AgroKos 🌿</h2>
          <p className="mt-4 max-w-sm text-white/80">Le ta konfigurojmë profilin tuaj që të përshtatim platformën me fermën tuaj.</p>
        </div>
        <div className="relative flex gap-2">
          {steps.map((_, i) => <div key={i} className={cn("h-1.5 w-10 rounded-full", i <= step ? "bg-brand-lime" : "bg-white/20")} />)}
        </div>
      </div>

      <div className="flex flex-col p-6 sm:p-10">
        <div className="mb-8 flex items-center justify-between lg:hidden">
          <Logo /><LangToggle />
        </div>
        <div className="flex flex-1 flex-col justify-center">
          <p className="text-xs font-semibold uppercase tracking-wide text-brand-green">{lang === "sq" ? `Hapi ${step + 1} nga ${steps.length}` : `Step ${step + 1} of ${steps.length}`}</p>
          <h1 className="mt-1 font-display text-3xl font-semibold text-brand-charcoal">{lang === "sq" ? steps[step].sq : steps[step].en}</h1>

          <div className="mt-6 max-w-md space-y-4">
            {step === 0 && (
              <p className="text-brand-charcoal/70">{lang === "sq" ? "AgroKos ju ndihmon të menaxhoni fushat, të monitoroni motin dhe të rritni fitimet. Konfigurimi zgjat më pak se një minutë." : "AgroKos helps you manage fields, monitor weather and grow profits. Setup takes less than a minute."}</p>
            )}
            {step === 1 && (
              <>
                <div><label className="label">{lang === "sq" ? "Emri i plotë" : "Full name"}</label><input className="input" placeholder="Agron Berisha" /></div>
                <div><label className="label">{lang === "sq" ? "Telefoni" : "Phone"}</label><input className="input" placeholder="+383 44 ..." /></div>
                <div><label className="label">{lang === "sq" ? "Komuna" : "Municipality"}</label><select className="input">{KOSOVO_MUNICIPALITIES.map((m) => <option key={m}>{m}</option>)}</select></div>
              </>
            )}
            {step === 2 && (
              <>
                <div><label className="label">{lang === "sq" ? "Madhësia e fermës (ha)" : "Farm size (ha)"}</label><input className="input" type="number" placeholder="4.6" /></div>
                <div>
                  <label className="label">{lang === "sq" ? "Kulturat kryesore" : "Primary crops"}</label>
                  <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
                    {CROPS.slice(0, 12).map((c) => {
                      const on = crops.includes(c.id);
                      return (
                        <button key={c.id} onClick={() => setCrops((p) => on ? p.filter((x) => x !== c.id) : [...p, c.id])} className={cn("flex flex-col items-center gap-1 rounded-lg border p-2 text-xs transition", on ? "border-brand-green bg-brand-lime/40" : "border-line hover:bg-zebra")}>
                          <span className="text-lg">{c.icon_emoji}</span>{cropName(c.id, lang)}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </>
            )}
            {step === 3 && (
              <div>
                <p className="mb-3 text-brand-charcoal/70">{lang === "sq" ? "Zgjidhni gjuhën tuaj të preferuar:" : "Choose your preferred language:"}</p>
                <LangToggle className="scale-110" />
              </div>
            )}
          </div>

          <div className="mt-8 flex max-w-md items-center justify-between">
            <button onClick={() => setStep(Math.max(0, step - 1))} disabled={step === 0} className="btn-ghost"><ArrowLeft className="h-4 w-4" /> {lang === "sq" ? "Mbrapa" : "Back"}</button>
            <button onClick={next} className="btn-primary">
              {step === steps.length - 1 ? (<>{lang === "sq" ? "Përfundo" : "Finish"} <Check className="h-4 w-4" /></>) : (<>{lang === "sq" ? "Vazhdo" : "Continue"} <ArrowRight className="h-4 w-4" /></>)}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
