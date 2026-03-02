import { NextResponse } from "next/server";
import { ensureUserProfile } from "@/lib/auth/server-roles";
import { updateProfileRole, upsertProfile } from "@/lib/data";
import { getSupabaseServiceRoleKey, getSupabaseUrl } from "@/lib/supabase/env";
import { getCurrentUser } from "@/lib/supabase/server";

async function requireAdmin() {
  const user = await getCurrentUser();
  if (!user) return null;
  const role = await ensureUserProfile(user);
  if (role !== "admin") return null;
  return user;
}

export async function GET() {
  const user = await requireAdmin();
  if (!user) return NextResponse.json({ error: "FORBIDDEN" }, { status: 403 });

  const response = await fetch(`${getSupabaseUrl()}/auth/v1/admin/users`, {
    headers: {
      apikey: getSupabaseServiceRoleKey(),
      Authorization: `Bearer ${getSupabaseServiceRoleKey()}`
    },
    cache: "no-store"
  });

  if (!response.ok) return NextResponse.json({ error: "No se pudo listar usuarios" }, { status: 500 });

  const data = await response.json();
  const users = (data.users ?? []).map((item: { id: string; email?: string }) => ({ id: item.id, email: item.email ?? "" }));
  return NextResponse.json({ users });
}

export async function PATCH(request: Request) {
  const user = await requireAdmin();
  if (!user) return NextResponse.json({ error: "FORBIDDEN" }, { status: 403 });

  const body = (await request.json()) as { userId?: string; role?: "usuario" | "moderador"; email?: string };
  if (!body.userId || !body.role || !body.email) return NextResponse.json({ error: "BAD_REQUEST" }, { status: 400 });

  let updated = await updateProfileRole(body.userId, body.role);
  if (!updated) {
    updated = await upsertProfile({ user_id: body.userId, email: body.email, role: body.role });
  }
  return NextResponse.json({ profile: updated });
}
