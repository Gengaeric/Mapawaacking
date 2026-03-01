export const dynamic = "force-dynamic";

import Link from "next/link";
import { redirect } from "next/navigation";
import { canAccessAdmin, resolveUserRole } from "@/lib/auth/roles";
import { deleteEventAction, deletePersonAction } from "@/app/contenido/actions";
import { getCurrentUser } from "@/lib/supabase/server";
import { listEvents, listPeople } from "@/lib/data";

export default async function AdminPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  const role = resolveUserRole(user.email, user.app_metadata?.role);

  if (!canAccessAdmin(role)) {
    redirect("/login");
  }

  const [people, events] = await Promise.all([listPeople(), listEvents()]);

  return (
    <main className="auth-layout">
      <h1>Panel de administración</h1>
      <p>Rol actual: {role}</p>

      <section>
        <h2>Contenido</h2>
        <h3>Personas</h3>
        <ul>
          {people.map((person) => (
            <li key={person.id}>
              {person.full_name} — <Link href={`/personas/${person.id}/editar`}>Editar</Link>
              <form action={deletePersonAction} style={{ display: "inline", marginLeft: 8 }}>
                <input type="hidden" name="id" value={person.id} />
                <button type="submit">Eliminar</button>
              </form>
            </li>
          ))}
        </ul>

        <h3>Eventos</h3>
        <ul>
          {events.map((event) => (
            <li key={event.id}>
              {event.name} — <Link href={`/eventos/${event.id}/editar`}>Editar</Link>
              <form action={deleteEventAction} style={{ display: "inline", marginLeft: 8 }}>
                <input type="hidden" name="id" value={event.id} />
                <button type="submit">Eliminar</button>
              </form>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
