// Albanian-locale date formatting (no external locale dependency needed).

const MONTHS_SQ = [
  "Janar", "Shkurt", "Mars", "Prill", "Maj", "Qershor",
  "Korrik", "Gusht", "Shtator", "Tetor", "Nëntor", "Dhjetor",
];

const MONTHS_SHORT_SQ = [
  "Jan", "Shk", "Mar", "Pri", "Maj", "Qer",
  "Kor", "Gus", "Sht", "Tet", "Nën", "Dhj",
];

const WEEKDAYS_SQ = [
  "E Diel", "E Hënë", "E Martë", "E Mërkurë", "E Enjte", "E Premte", "E Shtunë",
];

export function toDate(d: string | Date): Date {
  return typeof d === "string" ? new Date(d) : d;
}

/** "15 Qershor 2025" */
export function fmtDateSq(d: string | Date): string {
  const date = toDate(d);
  return `${date.getDate()} ${MONTHS_SQ[date.getMonth()]} ${date.getFullYear()}`;
}

/** "E Hënë" */
export function weekdaySq(d: string | Date): string {
  return WEEKDAYS_SQ[toDate(d).getDay()];
}

/** "E Hënë, 15 Qershor" */
export function fmtFullSq(d: string | Date): string {
  const date = toDate(d);
  return `${weekdaySq(date)}, ${date.getDate()} ${MONTHS_SQ[date.getMonth()]}`;
}

export function monthNameSq(month1to12: number): string {
  return MONTHS_SQ[(month1to12 - 1 + 12) % 12];
}

export function monthShortSq(month1to12: number): string {
  return MONTHS_SHORT_SQ[(month1to12 - 1 + 12) % 12];
}

export function daysAgo(d: string | Date): number {
  const diff = Date.now() - toDate(d).getTime();
  return Math.floor(diff / 86_400_000);
}

export function relativeSq(d: string | Date): string {
  const n = daysAgo(d);
  if (n <= 0) return "Sot";
  if (n === 1) return "Dje";
  if (n < 7) return `${n} ditë më parë`;
  if (n < 30) return `${Math.floor(n / 7)} javë më parë`;
  return `${Math.floor(n / 30)} muaj më parë`;
}

export { MONTHS_SQ, MONTHS_SHORT_SQ, WEEKDAYS_SQ };
