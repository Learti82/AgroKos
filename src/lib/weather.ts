// WMO weather code → label + emoji + condition class.
export interface WeatherCode {
  sq: string;
  en: string;
  icon: string;
  kind: "clear" | "cloud" | "rain" | "snow" | "storm" | "fog";
}

export function wmo(code: number): WeatherCode {
  const map: Record<number, WeatherCode> = {
    0: { sq: "Kthjellët", en: "Clear", icon: "☀️", kind: "clear" },
    1: { sq: "Kryesisht kthjellët", en: "Mostly clear", icon: "🌤️", kind: "clear" },
    2: { sq: "Pjesërisht me re", en: "Partly cloudy", icon: "⛅", kind: "cloud" },
    3: { sq: "Me re", en: "Overcast", icon: "☁️", kind: "cloud" },
    45: { sq: "Mjegull", en: "Fog", icon: "🌫️", kind: "fog" },
    48: { sq: "Mjegull me brymë", en: "Rime fog", icon: "🌫️", kind: "fog" },
    51: { sq: "Shi i imët", en: "Light drizzle", icon: "🌦️", kind: "rain" },
    53: { sq: "Shi i imët", en: "Drizzle", icon: "🌦️", kind: "rain" },
    55: { sq: "Shi i dendur i imët", en: "Dense drizzle", icon: "🌧️", kind: "rain" },
    61: { sq: "Shi i lehtë", en: "Light rain", icon: "🌦️", kind: "rain" },
    63: { sq: "Shi", en: "Rain", icon: "🌧️", kind: "rain" },
    65: { sq: "Shi i dendur", en: "Heavy rain", icon: "🌧️", kind: "rain" },
    71: { sq: "Borë e lehtë", en: "Light snow", icon: "🌨️", kind: "snow" },
    73: { sq: "Borë", en: "Snow", icon: "❄️", kind: "snow" },
    75: { sq: "Borë e dendur", en: "Heavy snow", icon: "❄️", kind: "snow" },
    80: { sq: "Rrebeshe", en: "Showers", icon: "🌦️", kind: "rain" },
    81: { sq: "Rrebeshe", en: "Showers", icon: "🌧️", kind: "rain" },
    82: { sq: "Rrebeshe të forta", en: "Violent showers", icon: "⛈️", kind: "storm" },
    95: { sq: "Stuhi", en: "Thunderstorm", icon: "⛈️", kind: "storm" },
    96: { sq: "Stuhi me breshër", en: "Thunderstorm, hail", icon: "⛈️", kind: "storm" },
  };
  return map[code] ?? { sq: "—", en: "—", icon: "🌡️", kind: "cloud" };
}

export interface ForecastResponse {
  source: "live" | "demo";
  current: { temp: number; feelsLike: number; humidity: number; wind: number; code: number; uv: number };
  hourly: { time: string; temp: number; rainProb: number; rain: number }[];
  daily: { date: string; tmax: number; tmin: number; rain: number; windMax: number; code: number }[];
}
