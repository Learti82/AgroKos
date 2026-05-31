import { NextResponse } from "next/server";
import { anthropic, MODEL } from "@/lib/anthropic";

export const maxDuration = 60;

const SYSTEM = `Ti je një ekspert i patologjisë së bimëve për kushtet e Kosovës. Të jepet një foto e një bime/gjetheje/fruti.

Përgjigju në SHQIP me këtë strukturë të saktë (përdor pikërisht këto tituj):
PROBLEMI: (emri i sëmundjes/dëmtuesit, ose "Bimë e shëndetshme" / "E paqartë")
SHENJAT: (çfarë shihet në foto)
SHKAKU: (kërpudhë, insekt, mungesë ushqyese, ujitje, etj.)
TRAJTIMI: (hapa konkretë + produkte/doza të disponueshme në Kosovë)
PARANDALIMI: (si të shmanget në të ardhmen)

Rregulla: ji konkret dhe praktik; jep doza dhe kohë. Nëse fotoja nuk është e qartë ose nuk është bimë, thuaje këtë te PROBLEMI. Mos shfaq arsyetimin e brendshëm.`;

export async function POST(req: Request) {
  const client = anthropic();
  if (!client) return NextResponse.json({ ok: false, configured: false });

  try {
    const { image, mediaType, crop, note } = await req.json();
    if (!image || !mediaType) return NextResponse.json({ ok: false, error: "no_image" }, { status: 400 });

    const prompt = [
      crop ? `Kultura: ${crop}.` : "",
      note ? `Shënim nga fermeri: ${note}.` : "",
      "Analizo foton dhe jep diagnozën sipas strukturës.",
    ].filter(Boolean).join(" ");

    const res = await client.messages.create({
      model: MODEL,
      max_tokens: 1200,
      thinking: { type: "disabled" },
      system: [{ type: "text", text: SYSTEM, cache_control: { type: "ephemeral" } }],
      messages: [{
        role: "user",
        content: [
          { type: "image", source: { type: "base64", media_type: mediaType, data: image } },
          { type: "text", text: prompt },
        ],
      }],
    });

    const text = res.content.filter((b) => b.type === "text").map((b: any) => b.text).join("\n").trim();
    return NextResponse.json({ ok: true, text });
  } catch (err: any) {
    console.warn("[AgroKos] diagnose error:", err?.message);
    return NextResponse.json({ ok: false, error: "ai_error" }, { status: 500 });
  }
}
