import { redirect } from "next/navigation";
import { resolveUserRole } from "@/lib/auth/roles";
import { getCurrentUser } from "@/lib/supabase/server";

export default async function PerfilPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  const role = resolveUserRole(user.email, user.app_metadata?.role);

  return (
    <main className="auth-layout">
      <h1>Mi perfil</h1>
      <p>Email: {user.email}</p>
      <p>Rol actual: {role}</p>
    </main>
  );
}
