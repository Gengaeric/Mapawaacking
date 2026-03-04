import { cookies } from "next/headers";
import type { UserRole } from "@/lib/auth/roles";

export type AdminViewMode = "admin" | "user";

export const ADMIN_VIEW_MODE_COOKIE = "admin_view_mode";

export async function getAdminViewModeForRole(role: UserRole): Promise<AdminViewMode> {
  if (role !== "admin") return "user";

  const cookieStore = await cookies();
  const value = cookieStore.get(ADMIN_VIEW_MODE_COOKIE)?.value;
  return value === "user" ? "user" : "admin";
}

export function canSeeAdminUi(role: UserRole, mode: AdminViewMode): boolean {
  if (role !== "admin") return false;
  return mode === "admin";
}

