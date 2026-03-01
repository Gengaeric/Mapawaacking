import { resolveUserRole } from "@/lib/auth/roles";
import { getCurrentUser } from "@/lib/supabase/server";

export async function requireUser() {
  const user = await getCurrentUser();
  if (!user) throw new Error("AUTH_REQUIRED");
  return user;
}

export function canManageAll(email: string | undefined, roleMetadata: unknown) {
  const role = resolveUserRole(email, roleMetadata);
  return role === "admin" || role === "moderador";
}

export function canEditOwnerResource(
  currentUserId: string,
  ownerId: string | null | undefined,
  canManage: boolean
) {
  if (canManage) return true;
  if (!ownerId) return false;
  return currentUserId === ownerId;
}
