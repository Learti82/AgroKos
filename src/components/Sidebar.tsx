"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, Map, Wheat, CloudSun, Droplets, AlertTriangle,
  TrendingUp, FlaskConical, ClipboardList, Package, HandHelping, Settings, X,
  Sparkles, ScanLine, PiggyBank, Landmark, ListChecks, Calculator, Sprout, CalendarRange,
  RotateCw, Bug, Beef, Tag, BookOpen, Contact, Hexagon, Ship,
} from "lucide-react";
import { useApp } from "@/lib/store";
import { t, type DictKey } from "@/lib/i18n";
import { Logo } from "@/components/ui/Logo";
import { cn } from "@/lib/utils";

type NavItem = { href: string; key: DictKey; icon: typeof Map };

const NAV_GROUPS: { label?: string; items: NavItem[] }[] = [
  {
    items: [
      { href: "/dashboard", key: "nav_dashboard", icon: LayoutDashboard },
      { href: "/dashboard/tasks", key: "nav_tasks", icon: ListChecks },
      { href: "/dashboard/assistant", key: "nav_assistant", icon: Sparkles },
      { href: "/dashboard/diagnose", key: "nav_diagnose", icon: ScanLine },
    ],
  },
  {
    label: "Ferma",
    items: [
      { href: "/dashboard/fields", key: "nav_fields", icon: Map },
      { href: "/dashboard/crops", key: "nav_crops", icon: Wheat },
      { href: "/dashboard/harvest", key: "nav_harvest", icon: Sprout },
      { href: "/dashboard/dairy", key: "nav_dairy", icon: Beef },
      { href: "/dashboard/bees", key: "nav_bees", icon: Hexagon },
    ],
  },
  {
    label: "Mjedisi",
    items: [
      { href: "/dashboard/weather", key: "nav_weather", icon: CloudSun },
      { href: "/dashboard/irrigation", key: "nav_irrigation", icon: Droplets },
      { href: "/dashboard/pest-risk", key: "nav_pestrisk", icon: Bug },
      { href: "/dashboard/rotation", key: "nav_rotation", icon: RotateCw },
      { href: "/dashboard/alerts", key: "nav_alerts", icon: AlertTriangle },
    ],
  },
  {
    label: "Tregu",
    items: [
      { href: "/dashboard/market", key: "nav_market", icon: TrendingUp },
      { href: "/dashboard/sell", key: "nav_sell", icon: Tag },
      { href: "/dashboard/export", key: "nav_export", icon: Ship },
    ],
  },
  {
    label: "Financat",
    items: [
      { href: "/dashboard/profit", key: "nav_profit", icon: PiggyBank },
      { href: "/dashboard/ledger", key: "nav_ledger", icon: BookOpen },
      { href: "/dashboard/cashflow", key: "nav_cashflow", icon: CalendarRange },
      { href: "/dashboard/subsidies", key: "nav_subsidies", icon: Landmark },
    ],
  },
  {
    label: "Analiza",
    items: [
      { href: "/dashboard/soil", key: "nav_soil", icon: FlaskConical },
      { href: "/dashboard/calculator", key: "nav_calculator", icon: Calculator },
      { href: "/dashboard/activities", key: "nav_activities", icon: ClipboardList },
      { href: "/dashboard/inventory", key: "nav_inventory", icon: Package },
    ],
  },
  {
    label: "Burimet",
    items: [
      { href: "/dashboard/advisory", key: "nav_advisory", icon: HandHelping },
      { href: "/dashboard/directory", key: "nav_directory", icon: Contact },
      { href: "/dashboard/settings", key: "nav_settings", icon: Settings },
    ],
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const { lang, sidebarOpen, setSidebarOpen } = useApp();

  return (
    <>
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/40 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 flex w-60 flex-col bg-brand-charcoal text-white transition-transform duration-200 lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Logo */}
        <div className="flex h-16 shrink-0 items-center justify-between border-b border-white/10 px-5">
          <Link href="/dashboard" onClick={() => setSidebarOpen(false)}>
            <Logo light />
          </Link>
          <button
            className="grid h-8 w-8 cursor-pointer place-items-center rounded-lg text-white/50 transition-colors hover:bg-white/10 hover:text-white lg:hidden"
            onClick={() => setSidebarOpen(false)}
            aria-label="Mbyll"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto px-3 py-3">
          {NAV_GROUPS.map((group, gi) => (
            <div key={gi}>
              {group.label && (
                <p className="nav-section">{group.label}</p>
              )}
              <div className="space-y-0.5">
                {group.items.map(({ href, key, icon: Icon }) => {
                  const active =
                    pathname === href ||
                    (href !== "/dashboard" && pathname.startsWith(href));
                  return (
                    <Link
                      key={href}
                      href={href}
                      onClick={() => setSidebarOpen(false)}
                      className={cn(
                        "flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors duration-150",
                        active
                          ? "bg-brand-green text-white"
                          : "text-white/65 hover:bg-white/10 hover:text-white"
                      )}
                    >
                      <Icon className="h-[17px] w-[17px] shrink-0" />
                      <span className="truncate">{t(key, lang)}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Footer */}
        <div className="shrink-0 border-t border-white/10 px-5 py-4">
          <p className="font-display text-sm font-semibold text-white/85">AgroKos</p>
          <p className="text-[11px] text-white/40">Bujqësia e Kosovës, E Dixhitalizuar</p>
        </div>
      </aside>
    </>
  );
}
