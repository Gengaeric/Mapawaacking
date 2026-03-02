import { getProfile, upsertProfile } from "@/lib/data";
import { resolveUserRole, type UserRole } from "@/lib/auth/roles";

export type BasicUser = {
  id: string;
  email?: string;
  app_metadata?: { role?: string };
};

export async function ensureUserProfile(user: BasicUser): Promise<UserRole> {
  const email = user.email?.toLowerCase().trim();
  const baseRole = resolveUserRole(email, user.app_metadata?.role);

  if (!email) return baseRole;

  const profile = await getProfile(user.id);

  if (!profile) {
    await upsertProfile({ user_id: user.id, email, role: baseRole });
    return baseRole;
  }

  const resolvedRole = baseRole === "admin" ? "admin" : profile.role;

  if (profile.email !== email || profile.role !== resolvedRole) {
    await upsertProfile({ user_id: user.id, email, role: resolvedRole });
  }

  return resolvedRole;
}
