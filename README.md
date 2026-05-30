# 🌿 AgroKos — Bujqësia e Kosovës, E Dixhitalizuar

Production-grade, **bilingual (Albanian + English)** agritech platform for Kosovo
smallholder farmers. Manage fields, monitor weather, track crops, soil, market
prices and farm activities — purpose-built for Kosovo's farming reality (wheat,
corn, berries, peppers, tomatoes, potatoes, apples, grapes, dairy).

> **Tagline:** *Bujqësia e Kosovës, E Dixhitalizuar* — Kosovo Farming, Digitized.
> **Primary color:** `#2D6A4F`

---

## ✨ What's built

A fully-functional, deploy-ready Next.js 14 application with a distinctive
agricultural design system and **seeded Kosovo data so the demo works
end-to-end without any API keys**.

| Page | Route | Highlights |
|------|-------|-----------|
| Landing | `/` | Full-bleed gradient + grain hero, feature grid, animated crop carousel, testimonials |
| Onboarding | `/onboarding` | 4-step farmer profile setup, multi-select crops |
| Dashboard | `/dashboard` | Health gauge, stat cards, field map, crop calendar, alerts, 7-day forecast, market, activity feed, low-stock |
| My Fields | `/dashboard/fields` | Grid + map toggle, SVG field polygons, health dots |
| Field detail | `/dashboard/fields/[id]` | Tabs: Overview / Crops / Activities / Soil (trend chart) / Photos |
| Crops | `/dashboard/crops` | Plantings table, crop library, yearly calendar |
| Weather | `/dashboard/weather` | Live current conditions, agri-alerts (frost/rain/spray window), hourly chart, Kosovo municipality grid |
| Irrigation | `/dashboard/irrigation` | Per-field moisture + rain + recommendation logic |
| Alerts | `/dashboard/alerts` | Filter by severity, mark read/unread |
| Market | `/dashboard/market` | Price table w/ sparklines, 12-month history chart, sell-timing advisor |
| Soil | `/dashboard/soil` | Recommendations engine, value-vs-ideal comparison chart |
| Activities | `/dashboard/activities` | Filters, summary stats, **CSV export** |
| Inventory | `/dashboard/inventory` | Category tabs, low-stock alerts, spend-by-category chart |
| Advisory | `/dashboard/advisory` | Crop guides, seasonal checklist, **crop-rotation advisor**, pest library, **Kosovo subsidies**, **EU export readiness**, FAQ |
| Settings | `/dashboard/settings` | Profile, language, notifications, **JSON data export** |

**Unique Kosovo features** (beyond the Cropin baseline): municipality weather
grid, EU export-readiness tracker, MBPZHR subsidy tracker, crop-rotation
advisor, and a harvest-revenue estimate baked into the dashboard.

---

## 🛠 Tech stack

- **Next.js 14** (App Router) + **TypeScript**
- **Tailwind CSS** — custom brand design system (forest green / harvest amber / water blue / warm cream)
- **Recharts** — all charts use the brand palette
- **Open-Meteo** weather API (no key) via a cached `/api/weather` route with graceful offline fallback
- **Zustand** — global state (language `sq`/`en`, persisted to localStorage)
- **Lucide React** icons, **date-fns** + a custom Albanian date formatter (`15 Qershor 2025`, `E Hënë`)
- SVG-based field map renderer (no Mapbox token needed)

---

## 🚀 Getting started

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
```

No environment variables are required for the demo — visit `/dashboard` and
everything is populated with realistic seeded Kosovo data (farmer Agron Berisha
in Vitomiricë, Pejë; 3 fields, plantings, activities, soil tests, alerts, 17
crops with 12-month price history, inventory).

---

## 🎨 Design system

Defined in `tailwind.config.ts` + `src/app/globals.css`:

- `brand-green #2D6A4F`, `brand-green-light #52B788`, `brand-lime #B7E4C7`,
  `brand-earth #6B4226`, `brand-amber #E9A319`, `brand-sky #1A759F`,
  `brand-cream #F8F4EF`, `brand-charcoal #1C2B1E`
- **Inter** for UI, **Fraunces** for hero/display headings
- 240px dark-green sidebar (collapses to overlay on mobile), cream content area
- Cards: white, 1px `#E5EDE8` border, 12px radius, soft shadow; stat cards have a 4px semantic left border
- Zebra-striped tables (`#F4FAF6`)

---

## 🌍 Internationalization

Every user-facing string is Albanian-first with English fallback. Toggle via the
`SQ/EN` switch (top bar, settings, onboarding). Dictionary in `src/lib/i18n.ts`;
crop names, activity types, soil/irrigation/inventory labels are all bilingual.

---

## 🔌 Production integrations (wiring guide)

The app is structured so the seeded data layer can be swapped for live services
without touching the UI. `.env.example` lists every variable.

- **Clerk auth** — add `@clerk/nextjs`, wrap the root layout in `<ClerkProvider>`,
  add `middleware.ts` protecting `/dashboard/*`, and replace `src/components/AuthCard.tsx`
  with Clerk's `<SignIn/>`/`<SignUp/>`. After sign-up → `/onboarding`, after sign-in → `/dashboard`.
- **Supabase + Drizzle** — the schema (tables, RLS policies) is documented in
  `docs/schema.sql`. Replace the imports from `src/lib/data/demo.ts` with
  server queries filtered by the Clerk `user_id`.
- **Mapbox** — drop a `NEXT_PUBLIC_MAPBOX_TOKEN` and swap `src/components/FieldMap.tsx`
  for Mapbox GL + `mapbox-gl-draw` for polygon drawing. The current SVG renderer
  is a token-free stand-in that reads the same GeoJSON.
- **Weather** is already live: `/api/weather` proxies Open-Meteo and caches 30 min,
  falling back to deterministic demo data when the network is unavailable.

---

## 📁 Project structure

```
src/
  app/
    page.tsx                 landing
    onboarding/              4-step setup
    sign-in, sign-up/        demo auth (Clerk-ready)
    api/weather/route.ts     Open-Meteo proxy + fallback
    dashboard/
      layout.tsx             sidebar + topbar shell
      loading.tsx error.tsx  skeleton + error boundary
      page.tsx               overview
      fields, crops, weather, irrigation, alerts,
      market, soil, activities, inventory, advisory, settings/
  components/                Sidebar, Topbar, FieldMap, charts, widgets, ui/*
  lib/
    data/                    crops, demo seed, advisory, programs
    i18n.ts store.ts metrics.ts weather.ts agriWeather.ts soilAdvice.ts dates.ts
```

---

© AgroKos — Bujqësia e Kosovës, E Dixhitalizuar.
