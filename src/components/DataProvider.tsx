"use client";

import { createContext, useContext } from "react";
import { demoFarmData, type FarmData } from "@/lib/data/farm";

const FarmContext = createContext<FarmData>(demoFarmData());

export function DataProvider({ value, children }: { value: FarmData; children: React.ReactNode }) {
  return <FarmContext.Provider value={value}>{children}</FarmContext.Provider>;
}

/** Access the current farmer's data anywhere in the dashboard. */
export function useFarm(): FarmData {
  return useContext(FarmContext);
}
