"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@clerk/nextjs/server";
import { supabaseAdmin } from "@/lib/supabase/server";
import { hasClerk } from "@/lib/config";
import type { FarmProfile } from "@/lib/data/farm";

export interface ProfileInput {
  full_name?: string;
  phone?: string;
  municipality?: string;
  village?: string;
  farm_size_ha?: number;
  primary_crops?: string[];
  language_pref?: "sq" | "en";
}

/** Save the logged-in farmer's profile. No-op in demo mode (no Clerk/DB). */
export async function saveProfile(input: ProfileInput): Promise<{ ok: boolean }> {
  if (!hasClerk) return { ok: false };
  const { userId } = await auth();
  const sb = supabaseAdmin();
  if (!userId || !sb) return { ok: false };

  const row: Record<string, unknown> = { clerk_user_id: userId, updated_at: new Date().toISOString() };
  for (const [k, v] of Object.entries(input)) {
    if (v !== undefined && v !== "") row[k] = v;
  }

  const { error } = await sb.from("farmer_profiles").upsert(row, { onConflict: "clerk_user_id" });
  if (error) {
    console.warn("[AgroKos] saveProfile failed:", error.message);
    return { ok: false };
  }
  revalidatePath("/dashboard");
  return { ok: true };
}

export type { FarmProfile };
