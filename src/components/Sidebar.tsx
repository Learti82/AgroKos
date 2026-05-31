"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, Map, Wheat, CloudSun, Droplets, AlertTriangle,
  TrendingUp, FlaskConical, ClipboardList, Package, HandHelping, Settings, X,
  Sparkles, ScanLine, PiggyBank, Landmark, ListChecks, Calculator, Sprout, CalendarRange,
  RotateCw, Bug, Beef,
} from "lucide-react";
import { useApp } from "@/lib/store";
import { t, type DictKey } from "@/lib/i18n";
import { Logo } from "@/components/ui/Logo";
import { cn } from "@/lib/utils";

const NAV: { href: string; key: DictKey; icon: typeof Map }[] = [
  { href: "/dashboard", key: "nav_dashboard", icon: LayoutDashboard },
  { href: "/dashboard/tasks", key: "nav_tasks", icon: ListChecks },
  { href: "/dashboard/assistant", key: "nav_assistant", icon: Sparkles },
  { href: "/dashboard/diagnose", key: "nav_diagnose", icon: ScanLine },
  { href: "/dashboard/fields", key: "nav_fields", icon: Map },
  { href: "/dashboard/crops", key: "nav_crops", icon: Wheat },
  { href: "/dashboard/harvest", key: "nav_harvest", icon: Sprout },
  { href: "/dashboard/dairy", key: "nav_dairy", icon: Beef },
  { href: "/dashboard/weather", key: "nav_weather", icon: CloudSun },
  { href: "/dashboard/irrigation", key: "nav_irrigation", icon: Droplets },
  { href: "/dashboard/pest-risk", key: "nav_pestrisk", icon: Bug },
  { href: "/dashboard/rotation", key: "nav_rotation", icon: RotateCw },
  { href: "/dashboard/alerts", key: "nav_alerts", icon: AlertTriangle },
  { href: "/dashboard/market", key: "nav_market", icon: TrendingUp },
  { href: "/dashboard/profit", key: "nav_profit", icon: PiggyBank },
  { href: "/dashboard/cashflow", key: "nav_cashflow", icon: CalendarRange },
  { href: "/dashboard/subsidies", key: "nav_subsidies", icon: Landmark },
  { href: "/dashboard/soil", key: "nav_soil", icon: FlaskConical },
  { href: "/dashboard/calculator", key: "nav_calculator", icon: Calculator },
  { href: "/dashboard/activities", key: "nav_activities", icon: ClipboardList },
  { href: "/dashboard/inventory", key: "nav_inventory", icon: Package },
  { href: "/dashboard/advisory", key: "nav_advisory", icon: HandHelping },
  { href: "/dashboard/settings", key: "nav_settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const { lang, sidebarOpen, setSidebarOpen } = useApp();

  return (
    <>
      {/* mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-30 bg-black/40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 flex w-60 flex-col bg-brand-charcoal text-white transition-transform lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-16 items-center justify-between px-5">
          <Link href="/dashboard" onClick={() => setSidebarOpen(false)}>
            <Logo light />
          </Link>
          <button className="lg:hidden" onClick={() => setSidebarOpen(false)} aria-label="Mbyll">
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 space-y-0.5 overflow-y-auto px-3 py-2">
          {NAV.map(({ href, key, icon: Icon }) => {
            const active = pathname === href || (href !== "/dashboard" && pathname.startsWith(href));
            return (
              <Link
                key={href}
                href={href}
                onClick={() => setSidebarOpen(false)}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  active
                    ? "bg-brand-green text-white"
                    : "text-white/70 hover:bg-white/10 hover:text-white"
                )}
              >
                <Icon className="h-[18px] w-[18px] shrink-0" />
                <span className="truncate">{t(key, lang)}</span>
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-white/10 p-4 text-xs text-white/50">
          <p className="font-display text-sm text-white/80">AgroKos</p>
          <p>Bujqësia e Kosovës, E Dixhitalizuar</p>
        </div>
      </aside>
    </>
  );
}
