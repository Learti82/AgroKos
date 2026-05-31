import { NextResponse } from "next/server";
import { anthropic, MODEL, hasAnthropic } from "@/lib/anthropic";

export const maxDuration = 60;

const SYSTEM = `Ti je "Agro Këshilltari", një asistent virtual agronomik për fermerët e Kosovës, i integruar në platformën AgroKos.

Rregulla:
- Përgjigju GJITHMONË në gjuhën shqipe (përveç nëse përdoruesi shkruan në anglisht).
- Jep këshilla praktike, konkrete dhe të përshtatura për kushtet klimatike dhe tokësore të Kosovës.
- Përdor njësi metrike (kg/ha, °C, mm) dhe çmime në euro.
- Kur jep doza plehrash ose trajtimesh, jep sasi konkrete dhe kohën e aplikimit.
- Nëse pyetja del jashtë bujqësisë, ktheje me mirësjellje te tema bujqësore.
- Përgjigju drejtpërdrejt dhe me fjali të shkurtra; mos e shfaq arsyetimin e brendshëm.
- Nëse të jepet "Konteksti i fermës", përdore për të personalizuar përgjigjen (fushat, kulturat, komuna).`;

export async function POST(req: Request) {
  const client = anthropic();
  if (!client) return NextResponse.json({ ok: false, configured: false });

  try {
    const { messages, context } = await req.json();
    const history = (Array.isArray(messages) ? messages : [])
      .filter((m: any) => m && (m.role === "user" || m.role === "assistant") && m.content)
      .slice(-12);
    if (!history.length || history[0].role !== "user") {
      return NextResponse.json({ ok: false, error: "no message" }, { status: 400 });
    }

    const res = await client.messages.create({
      model: MODEL,
      max_tokens: 1500,
      thinking: { type: "disabled" },
      system: [
        { type: "text", text: SYSTEM, cache_control: { type: "ephemeral" } },
        ...(context ? [{ type: "text" as const, text: `Konteksti i fermës:\n${String(context).slice(0, 4000)}` }] : []),
      ],
      messages: history.map((m: any) => ({ role: m.role, content: String(m.content) })),
    });

    const text = res.content.filter((b) => b.type === "text").map((b: any) => b.text).join("\n").trim();
    return NextResponse.json({ ok: true, text });
  } catch (err: any) {
    console.warn("[AgroKos] assistant error:", err?.message);
    return NextResponse.json({ ok: false, error: "ai_error" }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ configured: hasAnthropic, model: MODEL });
}
