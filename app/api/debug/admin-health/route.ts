import { NextResponse } from "next/server";
import { dbSelect } from "@/lib/supabase/db";

async function checkStep(step: string, run: () => Promise<unknown>) {
  try {
    await run();
    return null;
  } catch (error) {
    return {
      ok: false,
      step,
      error: error instanceof Error ? error.message : "Error inesperado"
    };
  }
}

export async function GET() {
  const envCheck = await checkStep("env", async () => {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL) throw new Error("Falta NEXT_PUBLIC_SUPABASE_URL");
    if (!process.env.SUPABASE_SERVICE_ROLE_KEY) throw new Error("Falta SUPABASE_SERVICE_ROLE_KEY");
  });
  if (envCheck) return NextResponse.json(envCheck, { status: 500 });

  const profilesCheck = await checkStep("profiles_query", async () => {
    await dbSelect<{ user_id: string }>("profiles", "select=user_id&limit=1");
  });
  if (profilesCheck) return NextResponse.json(profilesCheck, { status: 500 });

  const auditCheck = await checkStep("audit_log_query", async () => {
    await dbSelect<{ id: string }>("audit_log", "select=id&limit=1");
  });
  if (auditCheck) return NextResponse.json(auditCheck, { status: 500 });

  return NextResponse.json({ ok: true });
}
