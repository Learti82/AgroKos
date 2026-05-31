"use client";

import { useEffect, useRef } from "react";
import "maplibre-gl/dist/maplibre-gl.css";
import type { Field } from "@/lib/types";
import { cropById } from "@/lib/data/crops";
import { cn } from "@/lib/utils";

// Free satellite basemap (Esri World Imagery) — no API key/token required.
export const SAT_STYLE = {
  version: 8 as const,
  sources: {
    sat: {
      type: "raster" as const,
      tiles: ["https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"],
      tileSize: 256,
      attribution: "Tiles © Esri — World Imagery",
    },
    labels: {
      type: "raster" as const,
      tiles: ["https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}"],
      tileSize: 256,
    },
  },
  layers: [
    { id: "sat", type: "raster" as const, source: "sat" },
    { id: "labels", type: "raster" as const, source: "labels", paint: { "raster-opacity": 0.8 } },
  ],
};

const centroid = (ring: number[][]): [number, number] => {
  const n = ring.length;
  const [sx, sy] = ring.reduce(([ax, ay], p) => [ax + p[0], ay + p[1]], [0, 0]);
  return [sx / n, sy / n];
};

export function MapView({ fields, className, highlightId, onPick }: {
  fields: Field[];
  className?: string;
  highlightId?: string;
  onPick?: (id: string) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    let map: any;
    let cancelled = false;

    (async () => {
      const maplibregl = (await import("maplibre-gl")).default;
      if (cancelled || !ref.current) return;

      const fc = {
        type: "FeatureCollection" as const,
        features: fields
          .filter((f) => f.geojson)
          .map((f) => ({
            type: "Feature" as const,
            properties: { id: f.id, color: cropById(f.current_crop_id)?.color_hex ?? "#52B788" },
            geometry: f.geojson,
          })),
      };

      map = new maplibregl.Map({
        container: ref.current,
        style: SAT_STYLE as any,
        center: [20.9, 42.6],
        zoom: 8,
        attributionControl: { compact: true },
      });
      map.addControl(new maplibregl.NavigationControl({ showCompass: false }), "top-right");

      map.on("load", () => {
        map.addSource("fields", { type: "geojson", data: fc });
        map.addLayer({
          id: "fill", type: "fill", source: "fields",
          paint: { "fill-color": ["get", "color"], "fill-opacity": 0.35 },
        });
        map.addLayer({
          id: "outline", type: "line", source: "fields",
          paint: { "line-color": ["get", "color"], "line-width": 2.5 },
        });

        // HTML label markers (avoids needing font glyphs on a raster style).
        for (const f of fields) {
          if (!f.geojson) continue;
          const [lng, lat] = centroid(f.geojson.coordinates[0]);
          const el = document.createElement("div");
          const crop = cropById(f.current_crop_id);
          el.className =
            "rounded-full bg-white/95 px-2 py-0.5 text-[11px] font-semibold text-brand-charcoal shadow cursor-pointer whitespace-nowrap";
          el.textContent = `${crop?.icon_emoji ?? "🌱"} ${f.name}`;
          if (onPick) el.onclick = () => onPick(f.id);
          new maplibregl.Marker({ element: el }).setLngLat([lng, lat]).addTo(map);
        }

        if (onPick) {
          map.on("click", "fill", (e: any) => onPick(e.features?.[0]?.properties?.id));
          map.on("mouseenter", "fill", () => (map.getCanvas().style.cursor = "pointer"));
          map.on("mouseleave", "fill", () => (map.getCanvas().style.cursor = ""));
        }

        // Fit to fields.
        const pts = fields.flatMap((f) => (f.geojson ? f.geojson.coordinates[0] : []));
        if (pts.length) {
          const b = new maplibregl.LngLatBounds(pts[0] as [number, number], pts[0] as [number, number]);
          pts.forEach((p) => b.extend(p as [number, number]));
          map.fitBounds(b, { padding: 60, maxZoom: 16, duration: 0 });
        }
      });
    })();

    return () => {
      cancelled = true;
      map?.remove();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(fields.map((f) => f.id + f.current_crop_id)), highlightId]);

  return <div ref={ref} className={cn("overflow-hidden rounded-card bg-[#0b1f17]", className)} />;
}
