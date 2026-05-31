import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Format a number with a period decimal separator, Kosovo style. */
export function fmtNum(n: number, decimals = 1) {
  return n.toLocaleString("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

export function fmtEur(n: number, decimals = 2) {
  return `€${fmtNum(n, decimals)}`;
}

export function fmtHa(n: number) {
  return `${fmtNum(n, n < 1 ? 2 : 1)} ha`;
}
