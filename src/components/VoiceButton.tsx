"use client";

import { useEffect, useRef, useState } from "react";
import { Mic, MicOff } from "lucide-react";
import { useApp } from "@/lib/store";
import { cn } from "@/lib/utils";

// Albanian voice-to-text via the browser Web Speech API (Chrome/Edge).
// Appends recognized text to the target field; silently hides if unsupported.
export function VoiceButton({ onText, className }: { onText: (text: string) => void; className?: string }) {
  const { lang } = useApp();
  const [supported, setSupported] = useState(false);
  const [listening, setListening] = useState(false);
  const recRef = useRef<any>(null);

  useEffect(() => {
    const SR = (typeof window !== "undefined" && ((window as any).SpeechRecognition || (window as any).webkitSpeechRecognition)) || null;
    setSupported(!!SR);
    if (!SR) return;
    const rec = new SR();
    rec.lang = lang === "sq" ? "sq-AL" : "en-US";
    rec.interimResults = false;
    rec.maxAlternatives = 1;
    rec.onresult = (e: any) => {
      const text = Array.from(e.results).map((r: any) => r[0].transcript).join(" ");
      if (text) onText(text);
    };
    rec.onend = () => setListening(false);
    rec.onerror = () => setListening(false);
    recRef.current = rec;
    return () => { try { rec.stop(); } catch {} };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lang]);

  if (!supported) return null;

  const toggle = () => {
    const rec = recRef.current;
    if (!rec) return;
    if (listening) { rec.stop(); setListening(false); }
    else { try { rec.start(); setListening(true); } catch {} }
  };

  return (
    <button
      type="button"
      onClick={toggle}
      title={lang === "sq" ? "Regjistro shënim zanor" : "Voice note"}
      className={cn(
        "grid h-9 w-9 shrink-0 place-items-center rounded-lg border transition",
        listening ? "animate-pulse border-red-400 bg-red-50 text-red-600" : "border-line bg-white text-brand-charcoal/60 hover:bg-brand-lime/30",
        className
      )}
    >
      {listening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
    </button>
  );
}
