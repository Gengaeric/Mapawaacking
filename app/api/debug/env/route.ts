import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    hasUrl: Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL),
    hasAnonKey: Boolean(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY),
    hasServiceRoleKey: Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY),
    hasAdminEmails: Boolean(process.env.ADMIN_EMAILS),
    nodeEnv: process.env.NODE_ENV ?? "unknown"
  });
}
