import { getAdminViewModeForRole } from "@/lib/auth/admin-view-mode";
import { canAccessAdmin, resolveUserRole, type UserRole } from "@/lib/auth/roles";
import { getCurrentUser } from "@/lib/supabase/server";

export async function getViewerContext() {
  const user = await getCurrentUser();
  const role: UserRole = resolveUserRole(user?.email, user?.app_metadata?.role);
  const adminViewMode = await getAdminViewModeForRole(role);
  const showAdminUi = canAccessAdmin(role) && adminViewMode === "admin";

  return { user, role, adminViewMode, showAdminUi };
}
