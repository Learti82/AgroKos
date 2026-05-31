import type { ForecastResponse } from "./weather";
import type { Lang } from "./types";

export interface AgriAlert {
  tone: "info" | "warning" | "critical";
  icon: string;
  title: string;
  message: string;
}

// Derive agronomic alerts directly from the forecast.
export function computeWeatherAlerts(data: ForecastResponse, lang: Lang): AgriAlert[] {
  const out: AgriAlert[] = [];
  const next48 = data.daily.slice(0, 2);
  const minTemp = Math.min(...next48.map((d) => d.tmin));
  const maxRain24 = Math.max(...data.daily.slice(0, 1).map((d) => d.rain));
  const next6hRain = data.hourly.slice(0, 6).reduce((s, h) => s + h.rain, 0);
  const next6hWind = data.current.wind;
  const dryDays = data.daily.filter((d) => d.rain < 1).length;

  if (minTemp < 2) {
    out.push({
      tone: minTemp < 0 ? "critical" : "warning",
      icon: "❄️",
      title: lang === "sq" ? "Rrezik ngrice" : "Frost risk",
      message:
        lang === "sq"
          ? `Temperatura minimale ${minTemp}°C brenda 48 orëve. Mbroni kulturat e ndjeshme.`
          : `Minimum temperature ${minTemp}°C within 48h. Protect sensitive crops.`,
    });
  }
  if (maxRain24 > 30) {
    out.push({
      tone: "warning",
      icon: "🌧️",
      title: lang === "sq" ? "Shi i dendur" : "Heavy rain",
      message:
        lang === "sq"
          ? `Parashikohen ${Math.round(maxRain24)} mm shi në 24h. Shtyni spërkatjet dhe plehërimin.`
          : `${Math.round(maxRain24)} mm of rain forecast in 24h. Delay spraying and fertilizing.`,
    });
  }
  if (dryDays >= 6) {
    out.push({
      tone: "warning",
      icon: "☀️",
      title: lang === "sq" ? "Periudhë e thatë" : "Dry spell",
      message:
        lang === "sq"
          ? "Pa shi të konsiderueshëm këtë javë. Planifikoni ujitjen."
          : "No significant rain this week. Plan irrigation.",
    });
  }
  if (next6hRain < 0.5 && next6hWind < 15) {
    out.push({
      tone: "info",
      icon: "💨",
      title: lang === "sq" ? "Dritare e mirë spërkatjeje" : "Good spray window",
      message:
        lang === "sq"
          ? "Erë e ulët dhe pa shi për 6 orët e ardhshme — kohë e mirë për trajtime."
          : "Low wind and no rain for the next 6h — good time for treatments.",
    });
  }
  if (dryDays >= 3) {
    out.push({
      tone: "info",
      icon: "💧",
      title: lang === "sq" ? "Sugjerim ujitjeje" : "Irrigation suggestion",
      message:
        lang === "sq"
          ? "Ditët në vijim janë të thata — ujitni në mëngjes herët për efikasitet."
          : "Coming days are dry — irrigate early morning for efficiency.",
    });
  }
  return out;
}
