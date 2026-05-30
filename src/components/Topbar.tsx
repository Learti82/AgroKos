"use client";

import Link from "next/link";
import { Menu, Bell } from "lucide-react";
import { useApp } from "@/lib/store";
import { useWeather } from "@/lib/useWeather";
import { wmo } from "@/lib/weather";
import { Gauge } from "@/components/Gauge";
import { LangToggle } from "@/components/LangToggle";
import { DEMO_PROFILE, ALERTS, WEATHER_GRID } from "@/lib/data/demo";
import { t } from "@/lib/i18n";

export function Topbar({ healthScore }: { healthScore: number }) {
  const { lang, setSidebarOpen } = useApp();
  const home = WEATHER_GRID.find((m) => m.name === DEMO_PROFILE.municipality) ?? WEATHER_GRID[0];
  const { data } = useWeather(home.lat, home.lon);
  const unread = ALERTS.filter((a) => !a.is_read).length;
  const cond = data ? wmo(data.current.code) : null;

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-line bg-brand-cream/90 px-4 backdrop-blur lg:px-6">
      <button className="lg:hidden" onClick={() => setSidebarOpen(true)} aria-label="Menu">
        <Menu className="h-6 w-6 text-brand-charcoal" />
      </button>

      <div className="flex items-center gap-2">
        <Gauge value={healthScore} label="OK" />
        <div className="hidden sm:block">
          <p className="text-xs text-brand-charcoal/55">{t("farm_health", lang)}</p>
          <p className="text-sm font-semibold text-brand-charcoal">{DEMO_PROFILE.full_name}</p>
        </div>
      </div>

      <div className="ml-auto flex items-center gap-2 sm:gap-3">
        {data && cond && (
          <div className="hidden items-center gap-2 rounded-lg border border-line bg-white px-3 py-1.5 sm:flex">
            <span className="text-lg leading-none">{cond.icon}</span>
            <div className="leading-tight">
              <p className="text-sm font-semibold text-brand-charcoal">{data.current.temp}°C</p>
              <p className="text-[10px] text-brand-charcoal/55">{home.name}</p>
            </div>
          </div>
        )}

        <Link
          href="/dashboard/alerts"
          className="relative grid h-9 w-9 place-items-center rounded-lg border border-line bg-white text-brand-charcoal/70 hover:text-brand-charcoal"
          aria-label="Paralajmërime"
        >
          <Bell className="h-[18px] w-[18px]" />
          {unread > 0 && (
            <span className="absolute -right-1 -top-1 grid h-4 min-w-4 place-items-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
              {unread}
            </span>
          )}
        </Link>

        <LangToggle />
      </div>
    </header>
  );
}
