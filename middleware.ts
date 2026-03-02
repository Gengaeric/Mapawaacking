import { NextResponse, type NextRequest } from "next/server";
import { canAccessAdmin, resolveUserRole } from "@/lib/auth/roles";
import { ACCESS_COOKIE, getUserFromToken } from "@/lib/supabase/server";

async function getProfileRole(userId: string) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) return null;

  const response = await fetch(`${url}/rest/v1/profiles?select=role&user_id=eq.${userId}&limit=1`, {
    headers: {
      apikey: serviceKey,
      Authorization: `Bearer ${serviceKey}`
    },
    cache: "no-store"
  });

  if (!response.ok) return null;
  const rows = (await response.json()) as Array<{ role?: "usuario" | "moderador" | "admin" }>;
  return rows[0]?.role ?? null;
}

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const token = request.cookies.get(ACCESS_COOKIE)?.value;
  const user = await getUserFromToken(token);

  if (pathname.startsWith("/perfil") && !user) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  if (pathname.startsWith("/admin")) {
    if (!user) {
      const url = request.nextUrl.clone();
      url.pathname = "/login";
      return NextResponse.redirect(url);
    }

    const fallbackRole = resolveUserRole(user.email, user.app_metadata?.role);
    const profileRole = await getProfileRole(user.id);
    const role = fallbackRole === "admin" ? "admin" : (profileRole ?? fallbackRole);

    if (!canAccessAdmin(role)) {
      const url = request.nextUrl.clone();
      url.pathname = "/login";
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/perfil/:path*"]
};
