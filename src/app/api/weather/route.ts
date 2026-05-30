import { NextResponse } from "next/server";
import type { ForecastResponse } from "@/lib/weather";

export const revalidate = 1800; // cache 30 min

// Deterministic demo forecast so the app works offline / without network allowlist.
function demoForecast(lat: number): ForecastResponse {
  const now = new Date();
  const baseTemp = 18 + Math.sin(lat) * 2;
  const hourly = Array.from({ length: 24 }, (_, i) => {
    const t = new Date(now.getTime() + i * 3600_000);
    const temp = baseTemp + Math.sin((t.getHours() / 24) * Math.PI * 2 - 1.6) * 7;
    return {
      time: t.toISOString(),
      temp: Math.round(temp * 10) / 10,
      rainProb: Math.max(0, Math.round(Math.sin(i / 3) * 35 + 20)),
      rain: i % 7 === 0 ? 1.2 : 0,
    };
  });
  const codes = [0, 1, 2, 3, 61, 80, 2];
  const daily = Array.from({ length: 7 }, (_, d) => {
    const date = new Date(now.getTime() + d * 86_400_000);
    return {
      date: date.toISOString().slice(0, 10),
      tmax: Math.round(baseTemp + 6 - d * 0.4),
      tmin: Math.round(baseTemp - 7 + Math.sin(d) - (d === 1 ? 9 : 0)), // day 1 frosty for alert demo
      rain: d === 3 ? 34 : d % 2 === 0 ? 0 : 4,
      windMax: 12 + (d % 3) * 4,
      code: codes[d % codes.length],
    };
  });
  return {
    source: "demo",
    current: {
      temp: Math.round(hourly[0].temp),
      feelsLike: Math.round(hourly[0].temp - 1),
      humidity: 64,
      wind: 9,
      code: 2,
      uv: 4,
    },
    hourly,
    daily,
  };
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const lat = parseFloat(searchParams.get("lat") ?? "42.6629");
  const lon = parseFloat(searchParams.get("lon") ?? "21.1655");

  const url =
    `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}` +
    `&current=temperature_2m,apparent_temperature,relative_humidity_2m,precipitation,wind_speed_10m,weathercode` +
    `&hourly=temperature_2m,precipitation_probability,precipitation` +
    `&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,wind_speed_10m_max,weathercode` +
    `&timezone=Europe/Belgrade&forecast_days=7`;

  try {
    const res = await fetch(url, { next: { revalidate: 1800 }, signal: AbortSignal.timeout(6000) });
    if (!res.ok) throw new Error(`status ${res.status}`);
    const d = await res.json();
    const out: ForecastResponse = {
      source: "live",
      current: {
        temp: Math.round(d.current.temperature_2m),
        feelsLike: Math.round(d.current.apparent_temperature ?? d.current.temperature_2m),
        humidity: Math.round(d.current.relative_humidity_2m ?? 60),
        wind: Math.round(d.current.wind_speed_10m),
        code: d.current.weathercode,
        uv: 4,
      },
      hourly: d.hourly.time.slice(0, 24).map((time: string, i: number) => ({
        time,
        temp: d.hourly.temperature_2m[i],
        rainProb: d.hourly.precipitation_probability?.[i] ?? 0,
        rain: d.hourly.precipitation?.[i] ?? 0,
      })),
      daily: d.daily.time.map((date: string, i: number) => ({
        date,
        tmax: Math.round(d.daily.temperature_2m_max[i]),
        tmin: Math.round(d.daily.temperature_2m_min[i]),
        rain: d.daily.precipitation_sum[i],
        windMax: Math.round(d.daily.wind_speed_10m_max[i]),
        code: d.daily.weathercode[i],
      })),
    };
    return NextResponse.json(out);
  } catch {
    // Network blocked or API down → graceful demo fallback.
    return NextResponse.json(demoForecast(lat));
  }
}
