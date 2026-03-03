import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/supabase/server";
import { geocodeLocation } from "@/lib/geocoding";

export async function GET() {
  return NextResponse.json({ ok: false, error: "Method Not Allowed", hint: "Use POST" }, { status: 405 });
}

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ ok: false, error: "FORBIDDEN" }, { status: 403 });

  const body = (await request.json()) as { city?: string; province?: string };
  const city = (body.city ?? "").trim();
  const province = (body.province ?? "").trim();

  if (!city || !province) {
    return NextResponse.json({ ok: false, error: "Ciudad y provincia son obligatorias." }, { status: 400 });
  }

  const result = await geocodeLocation(city, province);
  if (!result) {
    return NextResponse.json({ ok: false, error: "No pudimos ubicar esta ciudad/provincia." }, { status: 404 });
  }

  return NextResponse.json({ ok: true, lat: result.lat, lng: result.lng });
}
