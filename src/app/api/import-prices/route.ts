import { NextResponse } from "next/server";
import { anthropic, MODEL } from "@/lib/anthropic";
import { CROPS } from "@/lib/data/crops";

export const maxDuration = 60;

function matchCrop(name: string): string | null {
  const n = name.toLowerCase().trim();
  for (const c of CROPS) {
    const sq = c.name_sq.toLowerCase();
    const en = c.name_en.toLowerCase();
    if (n === sq || n === en) return c.id;
  }
  // fuzzy: shared 4-letter prefix or contains
  for (const c of CROPS) {
    const sq = c.name_sq.toLowerCase();
    if (n.includes(sq.slice(0, 4)) || sq.includes(n.slice(0, 4))) return c.id;
  }
  return null;
}

export async function POST(req: Request) {
  const client = anthropic();
  if (!client) return NextResponse.json({ ok: false, configured: false });

  try {
    const { pdf, mediaType } = await req.json();
    if (!pdf) return NextResponse.json({ ok: false, error: "no_pdf" }, { status: 400 });

    const res = await client.messages.create({
      model: MODEL,
      max_tokens: 1500,
      thinking: { type: "disabled" },
      system: [{
        type: "text",
        text: "Ti je një nxjerrës të dhënash. Të jepet një dokument me çmime bujqësore (shqip). Nxirr çmimet për produkte në €/kg. Përgjigju VETËM me JSON: një varg objektesh {\"name\": string, \"price\": number}. Nëse çmimi është për njësi tjetër (p.sh. /copë, /litër) anashkaloje. Mos shto tekst tjetër jashtë JSON.",
      }],
      messages: [{
        role: "user",
        content: [
          { type: "document", source: { type: "base64", media_type: mediaType || "application/pdf", data: pdf } },
          { type: "text", text: "Nxirr produktet dhe çmimet €/kg si JSON." },
        ],
      }],
    });

    const text = res.content.filter((b) => b.type === "text").map((b: any) => b.text).join("\n");
    const jsonMatch = text.match(/\[[\s\S]*\]/);
    if (!jsonMatch) return NextResponse.json({ ok: false, error: "no_data", raw: text.slice(0, 300) });

    let parsed: { name: string; price: number }[] = [];
    try { parsed = JSON.parse(jsonMatch[0]); } catch { return NextResponse.json({ ok: false, error: "parse" }); }

    const items = parsed
      .map((p) => ({ crop_id: matchCrop(String(p.name)), name: String(p.name), price: Number(p.price) }))
      .filter((p) => p.crop_id && Number.isFinite(p.price) && p.price > 0);

    return NextResponse.json({ ok: true, items, found: parsed.length });
  } catch (err: any) {
    console.warn("[AgroKos] import-prices error:", err?.message);
    return NextResponse.json({ ok: false, error: "ai_error" }, { status: 500 });
  }
}
