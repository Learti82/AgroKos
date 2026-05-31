"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Lang } from "./types";

interface AppState {
  lang: Lang;
  setLang: (l: Lang) => void;
  toggleLang: () => void;
  sidebarOpen: boolean;
  setSidebarOpen: (v: boolean) => void;
}

export const useApp = create<AppState>()(
  persist(
    (set) => ({
      lang: "sq",
      setLang: (lang) => set({ lang }),
      toggleLang: () => set((s) => ({ lang: s.lang === "sq" ? "en" : "sq" })),
      sidebarOpen: false,
      setSidebarOpen: (sidebarOpen) => set({ sidebarOpen }),
    }),
    { name: "agrokos-prefs", partialize: (s) => ({ lang: s.lang }) }
  )
);
