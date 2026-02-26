import { redirect } from "next/navigation";
import { canAccessAdmin, resolveUserRole } from "@/lib/auth/roles";
import { getCurrentUser } from "@/lib/supabase/server";

export default async function AdminPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  const role = resolveUserRole(user.email, user.app_metadata?.role);

  if (!canAccessAdmin(role)) {
    redirect("/login");
  }

  return (
    <main className="auth-layout">
      <h1>Panel de administración</h1>
      <p>Acceso permitido.</p>
      <p>Rol actual: {role}</p>
    </main>
  );
}
