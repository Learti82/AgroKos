import type { Field } from "@/lib/types";
import { cropById } from "@/lib/data/crops";
import { cn } from "@/lib/utils";

// Lightweight SVG renderer for GeoJSON field polygons — no Mapbox token needed.
// Projects all field coordinates into a shared 100x100 viewBox.
export function FieldMap({
  fields,
  highlightId,
  className,
  showLabels = true,
}: {
  fields: Field[];
  highlightId?: string;
  className?: string;
  showLabels?: boolean;
}) {
  const pts = fields.flatMap((f) => f.geojson.coordinates[0]);
  if (pts.length === 0) return null;
  const lons = pts.map((p) => p[0]);
  const lats = pts.map((p) => p[1]);
  let minX = Math.min(...lons), maxX = Math.max(...lons);
  let minY = Math.min(...lats), maxY = Math.max(...lats);
  const padX = (maxX - minX) * 0.18 || 0.01;
  const padY = (maxY - minY) * 0.18 || 0.01;
  minX -= padX; maxX += padX; minY -= padY; maxY += padY;
  const W = maxX - minX || 1;
  const H = maxY - minY || 1;

  const project = (lon: number, lat: number): [number, number] => [
    ((lon - minX) / W) * 100,
    (1 - (lat - minY) / H) * 100, // flip Y
  ];

  return (
    <div className={cn("relative overflow-hidden rounded-card bg-[#eaf3ec]", className)}>
      {/* subtle field-grid background */}
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full">
        <defs>
          <pattern id="grid" width="8" height="8" patternUnits="userSpaceOnUse">
            <path d="M8 0H0V8" fill="none" stroke="#d6e7da" strokeWidth="0.4" />
          </pattern>
        </defs>
        <rect width="100" height="100" fill="url(#grid)" />
        {fields.map((f) => {
          const crop = cropById(f.current_crop_id);
          const color = crop?.color_hex ?? "#52B788";
          const path =
            f.geojson.coordinates[0]
              .map((p, i) => {
                const [x, y] = project(p[0], p[1]);
                return `${i === 0 ? "M" : "L"}${x.toFixed(2)} ${y.toFixed(2)}`;
              })
              .join(" ") + " Z";
          const isHi = f.id === highlightId;
          return (
            <path
              key={f.id}
              d={path}
              fill={color}
              fillOpacity={isHi ? 0.55 : 0.35}
              stroke={color}
              strokeWidth={isHi ? 1.4 : 0.9}
            />
          );
        })}
      </svg>
      {showLabels && (
        <div className="pointer-events-none absolute inset-0">
          {fields.map((f) => {
            const cx =
              f.geojson.coordinates[0].reduce((s, p) => s + p[0], 0) /
              f.geojson.coordinates[0].length;
            const cy =
              f.geojson.coordinates[0].reduce((s, p) => s + p[1], 0) /
              f.geojson.coordinates[0].length;
            const [x, y] = project(cx, cy);
            return (
              <span
                key={f.id}
                className="absolute -translate-x-1/2 -translate-y-1/2 whitespace-nowrap rounded-full bg-white/90 px-2 py-0.5 text-[10px] font-semibold text-brand-charcoal shadow-card"
                style={{ left: `${x}%`, top: `${y}%` }}
              >
                {cropById(f.current_crop_id)?.icon_emoji} {f.name}
              </span>
            );
          })}
        </div>
      )}
    </div>
  );
}
