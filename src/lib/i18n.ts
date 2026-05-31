import type { Lang } from "./types";

// Compact UI dictionary. Albanian first-class, English fallback.
export const DICT = {
  // Navigation
  nav_dashboard: { sq: "Paneli", en: "Dashboard" },
  nav_fields: { sq: "Fushat e Mia", en: "My Fields" },
  nav_crops: { sq: "Kulturat", en: "Crops" },
  nav_weather: { sq: "Moti", en: "Weather" },
  nav_irrigation: { sq: "Ujitja", en: "Irrigation" },
  nav_alerts: { sq: "Paralajmërime", en: "Alerts" },
  nav_market: { sq: "Tregu", en: "Market Prices" },
  nav_soil: { sq: "Analiza e Tokës", en: "Soil Analysis" },
  nav_activities: { sq: "Aktivitetet", en: "Activity Log" },
  nav_inventory: { sq: "Inventari", en: "Inventory" },
  nav_advisory: { sq: "Këshillim", en: "Advisory" },
  nav_settings: { sq: "Cilësimet", en: "Settings" },
  nav_assistant: { sq: "Asistenti AI", en: "AI Assistant" },
  nav_diagnose: { sq: "Diagnoza", en: "Diagnose" },
  nav_profit: { sq: "Fitimi", en: "Profit" },
  nav_subsidies: { sq: "Subvencione", en: "Subsidies" },
  nav_tasks: { sq: "Punët e Javës", en: "Tasks" },
  nav_calculator: { sq: "Llogaritësi i Plehrave", en: "Fertilizer Calc" },
  nav_harvest: { sq: "Korrja", en: "Harvest" },
  nav_cashflow: { sq: "Kalendari i Parave", en: "Cash-flow" },
  nav_rotation: { sq: "Qarkullimi", en: "Rotation" },
  nav_pestrisk: { sq: "Rreziku i Sëmundjeve", en: "Pest Risk" },

  // Common
  loading: { sq: "Duke u ngarkuar…", en: "Loading…" },
  view: { sq: "Shiko", en: "View" },
  edit: { sq: "Ndrysho", en: "Edit" },
  add: { sq: "Shto", en: "Add" },
  cancel: { sq: "Anulo", en: "Cancel" },
  save: { sq: "Ruaj", en: "Save" },
  search: { sq: "Kërko…", en: "Search…" },
  all: { sq: "Të gjitha", en: "All" },
  date: { sq: "Data", en: "Date" },
  field: { sq: "Fusha", en: "Field" },
  crop: { sq: "Kultura", en: "Crop" },
  cost: { sq: "Kosto", en: "Cost" },
  status: { sq: "Statusi", en: "Status" },
  back: { sq: "Kthehu", en: "Back" },

  // Dashboard
  farm_health: { sq: "Shëndeti i fermës", en: "Farm health" },
  total_area: { sq: "Sipërfaqja totale", en: "Total area" },
  active_crops: { sq: "Kultura aktive", en: "Active crops" },
  activities_week: { sq: "Aktivitete këtë javë", en: "Activities this week" },
  est_revenue: { sq: "Të ardhura të vlerësuara", en: "Estimated revenue" },
  recent_alerts: { sq: "Paralajmërimet e fundit", en: "Recent alerts" },
  forecast_7day: { sq: "Parashikimi 7-ditor", en: "7-day forecast" },
  top_prices: { sq: "Çmimet kryesore", en: "Top market prices" },
  activity_feed: { sq: "Aktivitetet e fundit", en: "Recent activity" },
  low_stock: { sq: "Stok i ulët", en: "Low stock" },
  field_overview: { sq: "Pamje e fushave", en: "Field overview" },
  crop_calendar: { sq: "Kalendari i kulturave", en: "Crop calendar" },

  // States
  empty_title: { sq: "Asgjë këtu ende", en: "Nothing here yet" },
  no_alerts: { sq: "Asnjë paralajmërim aktiv. Gjithçka në rregull! 🌱", en: "No active alerts. All good! 🌱" },

  greeting_morning: { sq: "Mirëmëngjes", en: "Good morning" },
  greeting_day: { sq: "Mirëdita", en: "Good afternoon" },
  greeting_evening: { sq: "Mirëmbrëma", en: "Good evening" },
} as const;

export type DictKey = keyof typeof DICT;

export function t(key: DictKey, lang: Lang): string {
  return DICT[key][lang];
}

export const ACTIVITY_LABELS: Record<string, { sq: string; en: string; icon: string }> = {
  fertilizing: { sq: "Plehërim", en: "Fertilizing", icon: "🧪" },
  spraying: { sq: "Spërkatje", en: "Spraying", icon: "💨" },
  irrigation: { sq: "Ujitje", en: "Irrigation", icon: "💧" },
  scouting: { sq: "Inspektim", en: "Scouting", icon: "🔍" },
  harvesting: { sq: "Korrje", en: "Harvesting", icon: "🌾" },
  plowing: { sq: "Lërim", en: "Plowing", icon: "🚜" },
  seeding: { sq: "Mbjellje", en: "Seeding", icon: "🌱" },
};

export const SOIL_LABELS: Record<string, { sq: string; en: string }> = {
  clay: { sq: "Argjilore", en: "Clay" },
  sandy: { sq: "Ranore", en: "Sandy" },
  loam: { sq: "Mesatare (loam)", en: "Loam" },
  silty: { sq: "Lymore", en: "Silty" },
};

export const IRRIGATION_LABELS: Record<string, { sq: string; en: string }> = {
  drip: { sq: "Me pika", en: "Drip" },
  sprinkler: { sq: "Shi artificial", en: "Sprinkler" },
  flood: { sq: "Me përmbytje", en: "Flood" },
  "rain-fed": { sq: "Me shi", en: "Rain-fed" },
};

export const INVENTORY_LABELS: Record<string, { sq: string; en: string }> = {
  seed: { sq: "Fara", en: "Seeds" },
  fertilizer: { sq: "Plehra", en: "Fertilizers" },
  pesticide: { sq: "Pesticide", en: "Pesticides" },
  herbicide: { sq: "Herbicide", en: "Herbicides" },
  equipment: { sq: "Pajisje", en: "Equipment" },
  fuel: { sq: "Karburant", en: "Fuel" },
};
