import Link from "next/link";
import { canAccessAdmin, resolveUserRole } from "@/lib/auth/roles";
import { getAdminViewModeForRole } from "@/lib/auth/admin-view-mode";
import { logout, setAdminViewModeAction } from "@/app/auth/actions";
import { getCurrentUser } from "@/lib/supabase/server";

export async function Header() {
  const user = await getCurrentUser();
  const role = resolveUserRole(user?.email, user?.app_metadata?.role);
  const adminViewMode = await getAdminViewModeForRole(role);
  const showAdminUi = canAccessAdmin(role) && adminViewMode === "admin";
  const showAdminToggle = role === "admin";

  return (
    <>
      <header className="barra-navegacion">
        <nav>
          <Link href="/">Inicio</Link>
          <Link href="/personas">Personas</Link>
          <Link href="/eventos">Eventos</Link>
          {user ? <Link href="/perfil">Mi perfil</Link> : null}
          {user && showAdminUi ? <Link href="/admin">Panel de administración</Link> : null}
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

      {showAdminToggle ? (
        adminViewMode === "admin" ? (
          <div className="admin-view-banner admin-view-toolbar">
            <span>Modo administrador</span>
            <form action={setAdminViewModeAction}>
              <input type="hidden" name="mode" value="user" />
              <button type="submit">Ver como usuario</button>
            </form>
          </div>
        ) : (
          <div className="admin-view-banner">
            <span>Estás viendo la página como usuario</span>
            <form action={setAdminViewModeAction}>
              <input type="hidden" name="mode" value="admin" />
              <button type="submit">Volver a modo admin</button>
            </form>
          </div>
        )
      ) : null}
    </>
  );
}
