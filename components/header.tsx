import Link from "next/link";
import { canAccessAdmin, resolveUserRole } from "@/lib/auth/roles";
import { logout } from "@/app/auth/actions";
import { getCurrentUser } from "@/lib/supabase/server";

export async function Header() {
  const user = await getCurrentUser();
  const role = resolveUserRole(user?.email, user?.app_metadata?.role);

  return (
    <header className="barra-navegacion">
      <nav>
        <Link href="/">Inicio</Link>
        {user ? <Link href="/perfil">Mi perfil</Link> : null}
        {user && canAccessAdmin(role) ? <Link href="/admin">Panel de administración</Link> : null}
      </nav>

      <div>
        {!user ? (
          <Link href="/login">Iniciar sesión</Link>
        ) : (
          <div className="estado-sesion">
            <span>{user.email}</span>
            <form action={logout}>
              <button type="submit">Cerrar sesión</button>
            </form>
          </div>
        )}
      </div>
    </header>
  );
}
