import { NextResponse } from "next/server";
import { summarizeInSpanish } from "@/lib/ai/summarize";
import { ensureUserProfile } from "@/lib/auth/server-roles";
import { getEvent, getPerson, updateEvent, updatePerson } from "@/lib/data";
import { getCurrentUser } from "@/lib/supabase/server";

type SummarizeBody = {
  type?: "person" | "event";
  id?: string;
  force?: boolean;
};

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ ok: false, error: "FORBIDDEN" }, { status: 403 });

  const body = (await request.json()) as SummarizeBody;
  const type = body.type;
  const id = body.id?.trim();
  const force = body.force === true;

  if (!type || (type !== "person" && type !== "event") || !id) {
    return NextResponse.json(
      { ok: false, error: "Parámetros inválidos. Debes enviar type ('person'|'event') e id." },
      { status: 400 }
    );
  }

  const role = await ensureUserProfile(user);
  const canRegenerate = role === "admin" || role === "moderador";

  if (force && !canRegenerate) {
    return NextResponse.json({ ok: false, error: "FORBIDDEN" }, { status: 403 });
  }

  const record = type === "person" ? await getPerson(id) : await getEvent(id);
  if (!record) {
    return NextResponse.json({ ok: false, error: "No se encontró el registro." }, { status: 404 });
  }

  const sourceText = (type === "person" ? record.biography : record.description)?.trim() ?? "";
  if (!sourceText) {
    return NextResponse.json(
      { ok: false, error: "No hay texto suficiente para resumir" },
      { status: 400 }
    );
  }

  const existingSummary = record.ai_summary?.trim();
  if (existingSummary && !force) {
    return NextResponse.json({ ok: true, summary: existingSummary, fromCache: true });
  }

  const summary = await summarizeInSpanish(sourceText);

  if (type === "person") {
    await updatePerson(id, { ai_summary: summary });
  } else {
    await updateEvent(id, { ai_summary: summary });
  }

  return NextResponse.json({ ok: true, summary, fromCache: false });
}
