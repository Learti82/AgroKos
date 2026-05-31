"use client";

import { useEffect, useState } from "react";
import type { ForecastResponse } from "./weather";

const cache = new Map<string, ForecastResponse>();

export function useWeather(lat = 42.6629, lon = 21.1655) {
  const key = `${lat.toFixed(3)},${lon.toFixed(3)}`;
  const [data, setData] = useState<ForecastResponse | null>(cache.get(key) ?? null);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(!cache.has(key));

  useEffect(() => {
    if (cache.has(key)) {
      setData(cache.get(key)!);
      setLoading(false);
      return;
    }
    let alive = true;
    setLoading(true);
    fetch(`/api/weather?lat=${lat}&lon=${lon}`)
      .then((r) => r.json())
      .then((d: ForecastResponse) => {
        if (!alive) return;
        cache.set(key, d);
        setData(d);
        setLoading(false);
      })
      .catch(() => {
        if (!alive) return;
        setError(true);
        setLoading(false);
      });
    return () => {
      alive = false;
    };
  }, [key, lat, lon]);

  return { data, loading, error };
}
