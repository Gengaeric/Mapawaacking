import { getProfile, isMissingProfilesTableError, upsertProfile } from "@/lib/data";
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

  let profile = null;
  try {
    profile = await getProfile(user.id);
  } catch (error) {
    if (isMissingProfilesTableError(error)) {
      return baseRole;
    }
    throw error;
  }

  if (!profile) {
    try {
      await upsertProfile({ user_id: user.id, email });
    } catch (error) {
      if (!isMissingProfilesTableError(error)) {
        throw error;
      }
    }
    return baseRole;
  }

  const resolvedRole = baseRole === "admin" ? "admin" : profile.role;

  if (profile.email !== email || profile.role !== resolvedRole) {
    try {
      await upsertProfile({ user_id: user.id, email, role: resolvedRole });
    } catch (error) {
      if (!isMissingProfilesTableError(error)) {
        throw error;
      }
      return baseRole;
    }
  }

  return resolvedRole;
}

export async function upsertBasicProfileOnLogin(user: BasicUser) {
  const email = user.email?.toLowerCase().trim();
  if (!email) return;

  try {
    await upsertProfile({ user_id: user.id, email });
  } catch (error) {
    if (!isMissingProfilesTableError(error)) {
      throw error;
    }
  }
}
