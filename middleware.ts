import { NextResponse, type NextRequest } from "next/server";
import { canAccessAdmin, resolveUserRole } from "@/lib/auth/roles";
import { ACCESS_COOKIE, getUserFromToken } from "@/lib/supabase/server";

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

    const role = resolveUserRole(user.email, user.app_metadata?.role);
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
