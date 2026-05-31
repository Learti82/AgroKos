"use client";

import { useEffect } from "react";

// Registers the service worker so the dashboard works offline (PWA).
export function SWRegister() {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => {});
    }
  }, []);
  return null;
}
