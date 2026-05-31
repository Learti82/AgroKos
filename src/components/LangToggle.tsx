"use client";

import { useApp } from "@/lib/store";
import { cn } from "@/lib/utils";

export function LangToggle({ className }: { className?: string }) {
  const { lang, setLang } = useApp();
  return (
    <div className={cn("inline-flex rounded-lg border border-line bg-white p-0.5 text-xs font-semibold", className)}>
      {(["sq", "en"] as const).map((l) => (
        <button
          key={l}
          onClick={() => setLang(l)}
          className={cn(
            "rounded-md px-2.5 py-1 transition-colors",
            lang === l ? "bg-brand-green text-white" : "text-brand-charcoal/60 hover:text-brand-charcoal"
          )}
        >
          {l.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
