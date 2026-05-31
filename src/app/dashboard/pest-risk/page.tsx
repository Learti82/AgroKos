"use client";

import { useApp } from "@/lib/store";
import { useFarm } from "@/components/DataProvider";
import { useWeather } from "@/lib/useWeather";
import { PageHeader, Card, Badge, EmptyState, HelpNote } from "@/components/ui/primitives";
import { WEATHER_GRID } from "@/lib/data/demo";
import { cropById, cropName } from "@/lib/data/crops";
import { cn } from "@/lib/utils";

type Level = "low" | "med" | "high";

export default function PestRiskPage() {
  const { lang } = useApp();
  const farm = useFarm();
  const home = WEATHER_GRID.find((m) => m.name === farm.profile.municipality) ?? WEATHER_GRID[0];
  const { data: weather } = useWeather(home.lat, home.lon);

  const humidity = weather?.current.humidity ?? 60;
  const rain7 = weather ? weather.daily.reduce((s, d) => s + d.rain, 0) : 0;
  const avgTemp = weather ? weather.daily.reduce((s, d) => s + (d.tmax + d.tmin) / 2, 0) / weather.daily.length : 18;

  const activeCrops = [...new Set(farm.plantings.filter((p) => p.status === "active").map((p) => p.crop_id))];

  function assess(cropId: string): { level: Level; threat: string; advice: string } {
    const crop = cropById(cropId)!;
    const wet = humidity >= 72 || rain7 > 20;
    const mild = avgTemp >= 12 && avgTemp <= 26;
    const fungalProne = ["vegetable", "fruit", "berry"].includes(crop.category);
    const dryWarm = humidity < 50 && avgTemp > 22;

    if (fungalProne && wet && mild) {
      return {
        level: "high",
        threat: lang === "sq" ? "Rrezik i lartë kërpudhash (vrug/hi)" : "High fungal risk (blight/mildew)",
        advice: lang === "sq" ? "Lagështia e lartë favorizon vrugun. Apliko fungicid parandalues, siguro ajrim dhe shmang ujitjen mbi gjethe." : "High humidity favours blight. Apply a preventive fungicide, ensure airflow and avoid overhead watering.",
      };
    }
    if (fungalProne && (humidity >= 60 || rain7 > 8)) {
      return {
        level: "med",
        threat: lang === "sq" ? "Rrezik mesatar kërpudhash" : "Moderate fungal risk",
        advice: lang === "sq" ? "Monitoro gjethet çdo 2-3 ditë; ji gati për trajtim nëse lagështia rritet." : "Scout leaves every 2-3 days; be ready to treat if humidity rises.",
      };
    }
    if (dryWarm) {
      return {
        level: "med",
        threat: lang === "sq" ? "Rrezik insektesh (morra/merimangë)" : "Pest risk (aphids/mites)",
        advice: lang === "sq" ? "Moti i thatë e i ngrohtë favorizon morrat dhe merimangën e kuqe. Kontrollo anën e poshtme të gjetheve." : "Dry warm weather favours aphids and spider mites. Check the underside of leaves.",
      };
    }
    return {
      level: "low",
      threat: lang === "sq" ? "Rrezik i ulët" : "Low risk",
      advice: lang === "sq" ? "Kushtet aktuale nuk favorizojnë shpërthime. Vazhdo monitorimin e zakonshëm." : "Current conditions don't favour outbreaks. Keep up routine scouting.",
    };
  }

  const tone = { high: "critical", med: "warning", low: "good" } as const;
  const levelLabel = { high: lang === "sq" ? "I lartë" : "High", med: lang === "sq" ? "Mesatar" : "Medium", low: lang === "sq" ? "I ulët" : "Low" };

  return (
    <div className="space-y-5">
      <PageHeader title={lang === "sq" ? "Rreziku i Sëmundjeve" : "Pest & Disease Risk"} subtitle={`${home.name} · ${lang === "sq" ? "lagështia" : "humidity"} ${humidity}% · ${Math.round(avgTemp)}°C`} />

      <HelpNote>
        {lang === "sq"
          ? "Vlerëson rrezikun e sëmundjeve për kulturat e tua aktive sipas motit (lagështia, temperatura, shiu). Lagështia e lartë + ngrohtësia = rrezik kërpudhash; thatësira + ngrohtësia = rrezik insektesh. Shih bibliotekën te Këshillimi për trajtime."
          : "Estimates disease risk for your active crops from the weather (humidity, temperature, rain). Humid + warm = fungal risk; dry + warm = pest risk. See the Advisory library for treatments."}
      </HelpNote>

      {activeCrops.length === 0 ? (
        <EmptyState icon="🐛" title={lang === "sq" ? "Pa kultura aktive" : "No active crops"} hint={lang === "sq" ? "Shto mbjellje aktive për të parë rrezikun e sëmundjeve." : "Add active plantings to see disease risk."} />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {activeCrops.map((id) => {
            const crop = cropById(id)!;
            const r = assess(id);
            return (
              <Card key={id} className={cn("border-l-4", r.level === "high" ? "border-red-500" : r.level === "med" ? "border-brand-amber" : "border-brand-green")}>
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-brand-charcoal">{crop.icon_emoji} {cropName(id, lang)}</h3>
                  <Badge tone={tone[r.level]}>{levelLabel[r.level]}</Badge>
                </div>
                <p className="mt-2 text-sm font-medium text-brand-charcoal/80">{r.threat}</p>
                <p className="mt-1 text-sm text-brand-charcoal/65">{r.advice}</p>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
