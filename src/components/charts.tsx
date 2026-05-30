"use client";

import {
  AreaChart, Area, LineChart, Line, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Cell,
} from "recharts";
import type { SoilAnalysis } from "@/lib/types";
import type { ForecastResponse } from "@/lib/weather";
import { monthShortSq } from "@/lib/dates";

const AXIS = { fontSize: 11, fill: "#1C2B1E99" };
const GRID = "#E5EDE8";

export function SoilTrendChart({ data }: { data: SoilAnalysis[] }) {
  const rows = data.map((s) => ({
    date: new Date(s.analysis_date).toLocaleDateString("en-GB", { month: "short", year: "2-digit" }),
    pH: s.ph,
    N: s.nitrogen_ppm,
    P: s.phosphorus_ppm,
    K: s.potassium_ppm,
  }));
  return (
    <ResponsiveContainer width="100%" height={220}>
      <LineChart data={rows} margin={{ left: -16, right: 8, top: 4 }}>
        <CartesianGrid stroke={GRID} vertical={false} />
        <XAxis dataKey="date" tick={AXIS} axisLine={false} tickLine={false} />
        <YAxis tick={AXIS} axisLine={false} tickLine={false} />
        <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #E5EDE8", fontSize: 12 }} />
        <Legend wrapperStyle={{ fontSize: 11 }} />
        <Line type="monotone" dataKey="N" stroke="#2D6A4F" strokeWidth={2} dot={{ r: 3 }} />
        <Line type="monotone" dataKey="P" stroke="#E9A319" strokeWidth={2} dot={{ r: 3 }} />
        <Line type="monotone" dataKey="K" stroke="#1A759F" strokeWidth={2} dot={{ r: 3 }} />
        <Line type="monotone" dataKey="pH" stroke="#6B4226" strokeWidth={2} dot={{ r: 3 }} />
      </LineChart>
    </ResponsiveContainer>
  );
}

export function HourlyWeatherChart({ data }: { data: ForecastResponse }) {
  const rows = data.hourly.slice(0, 24).map((h) => ({
    hour: new Date(h.time).toLocaleTimeString("en-GB", { hour: "2-digit" }),
    temp: h.temp,
    rain: h.rainProb,
  }));
  return (
    <ResponsiveContainer width="100%" height={240}>
      <AreaChart data={rows} margin={{ left: -16, right: 8, top: 8 }}>
        <defs>
          <linearGradient id="t" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#E9A319" stopOpacity={0.4} />
            <stop offset="100%" stopColor="#E9A319" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="r" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1A759F" stopOpacity={0.35} />
            <stop offset="100%" stopColor="#1A759F" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid stroke={GRID} vertical={false} />
        <XAxis dataKey="hour" tick={AXIS} axisLine={false} tickLine={false} interval={3} />
        <YAxis yAxisId="l" tick={AXIS} axisLine={false} tickLine={false} unit="°" />
        <YAxis yAxisId="r" orientation="right" tick={AXIS} axisLine={false} tickLine={false} unit="%" />
        <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #E5EDE8", fontSize: 12 }} />
        <Area yAxisId="r" type="monotone" dataKey="rain" stroke="#1A759F" fill="url(#r)" strokeWidth={1.5} name="Shi %" />
        <Area yAxisId="l" type="monotone" dataKey="temp" stroke="#E9A319" fill="url(#t)" strokeWidth={2} name="Temp °C" />
      </AreaChart>
    </ResponsiveContainer>
  );
}

export function PriceHistoryChart({ history, color }: { history: { date: string; price: number }[]; color: string }) {
  const rows = history.map((h) => ({ m: monthShortSq(new Date(h.date).getMonth() + 1), price: h.price }));
  return (
    <ResponsiveContainer width="100%" height={260}>
      <LineChart data={rows} margin={{ left: -8, right: 8, top: 8 }}>
        <CartesianGrid stroke={GRID} vertical={false} />
        <XAxis dataKey="m" tick={AXIS} axisLine={false} tickLine={false} />
        <YAxis tick={AXIS} axisLine={false} tickLine={false} unit="€" width={48} />
        <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #E5EDE8", fontSize: 12 }} formatter={(v) => [`€${v}`, "Çmimi"]} />
        <Line type="monotone" dataKey="price" stroke={color} strokeWidth={2.5} dot={{ r: 3 }} />
      </LineChart>
    </ResponsiveContainer>
  );
}

export function SpendBarChart({ data }: { data: { name: string; value: number; color: string }[] }) {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={data} margin={{ left: -16, right: 8, top: 8 }}>
        <CartesianGrid stroke={GRID} vertical={false} />
        <XAxis dataKey="name" tick={AXIS} axisLine={false} tickLine={false} />
        <YAxis tick={AXIS} axisLine={false} tickLine={false} unit="€" />
        <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #E5EDE8", fontSize: 12 }} cursor={{ fill: "#F4FAF6" }} />
        <Bar dataKey="value" radius={[6, 6, 0, 0]}>
          {data.map((d, i) => <Cell key={i} fill={d.color} />)}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

export function SoilComparisonChart({ data }: { data: { name: string; value: number; ideal: number }[] }) {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={data} margin={{ left: -16, right: 8, top: 8 }}>
        <CartesianGrid stroke={GRID} vertical={false} />
        <XAxis dataKey="name" tick={AXIS} axisLine={false} tickLine={false} />
        <YAxis tick={AXIS} axisLine={false} tickLine={false} />
        <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #E5EDE8", fontSize: 12 }} cursor={{ fill: "#F4FAF6" }} />
        <Legend wrapperStyle={{ fontSize: 11 }} />
        <Bar dataKey="value" name="Vlera juaj" fill="#2D6A4F" radius={[6, 6, 0, 0]} />
        <Bar dataKey="ideal" name="Ideale" fill="#B7E4C7" radius={[6, 6, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
