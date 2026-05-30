import { NextResponse } from "next/server";
import { Webhook } from "svix";
import { getFarmData } from "@/lib/data/repository";

// Clerk calls this when a user signs up (production only — needs a public URL).
// On `user.created` we pre-create the farmer's profile + seed their demo farm.
export async function POST(req: Request) {
  const secret = process.env.CLERK_WEBHOOK_SECRET;
  if (!secret) {
    return NextResponse.json({ ok: false, reason: "webhook not configured" }, { status: 200 });
  }

  const payload = await req.text();
  const headers = {
    "svix-id": req.headers.get("svix-id") ?? "",
    "svix-timestamp": req.headers.get("svix-timestamp") ?? "",
    "svix-signature": req.headers.get("svix-signature") ?? "",
  };

  let evt: any;
  try {
    evt = new Webhook(secret).verify(payload, headers);
  } catch {
    return NextResponse.json({ ok: false, reason: "invalid signature" }, { status: 400 });
  }

  if (evt?.type === "user.created" && evt?.data?.id) {
    // getFarmData ensures the profile exists and seeds the account on first read.
    await getFarmData(evt.data.id);
  }

  return NextResponse.json({ ok: true });
}
