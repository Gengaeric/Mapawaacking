export const dynamic = "force-dynamic";

import Link from "next/link";
import { redirect } from "next/navigation";
import { BackfillGeocodesButton } from "@/app/admin/backfill-geocodes-button";
import { deleteEventAction, deletePersonAction, restoreEventAction, restorePersonAction } from "@/app/contenido/actions";
import { UsersManager } from "@/app/admin/users-manager";
import { ConfirmSubmitButton } from "@/components/confirm-submit-button";
import { ensureUserProfile } from "@/lib/auth/server-roles";
import { canAccessAdmin } from "@/lib/auth/roles";
import { dbSelect } from "@/lib/supabase/db";
import { getCurrentUser } from "@/lib/supabase/server";
import { listAuditLogs, listEvents, listPeople, listProfiles } from "@/lib/data";

function AdminErrorPanel({ code }: { code: string }) {
  return (
    <main className="auth-layout">
      <h1>Panel de administración</h1>
      <section style={{ border: "1px solid #f59e0b", borderRadius: 8, padding: 16, background: "#fffbeb" }}>
        <h2>No se pudo cargar el panel de administración</h2>
        <p>Código de error: {code}</p>
        <p>Intentá nuevamente en unos segundos.</p>
      </section>
    </main>
  );
}

export default async function AdminPage({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const role = await ensureUserProfile(user);
  if (!canAccessAdmin(role)) redirect("/login");

  try {
    const params = await searchParams;
    const tab = params.tab ?? "contenido";
    const tipo = params.tipo ?? "personas";
    const query = (params.q ?? "").toLowerCase();
    const province = params.provincia ?? "";
    const crew = params.crew ?? "";
    const eventType = params.tipoEvento ?? "";
    const includeDeleted = params.eliminados === "1";
    const auditEntity = params.entidad ?? "";
    const auditAction = params.accion ?? "";
    const auditActor = (params.actor ?? "").toLowerCase();
    const auditFrom = params.desde ?? "";
    const auditTo = params.hasta ?? "";

    const [people, events, profiles] = await Promise.all([listPeople(true), listEvents(true), listProfiles()]);

    const filteredPeople = people.filter((p) => {
      if (!includeDeleted && p.is_deleted) return false;
      if (query && !`${p.full_name} ${p.stage_name ?? ""}`.toLowerCase().includes(query)) return false;
      if (province && p.province !== province) return false;
      if (crew && (p.crew_or_club ?? "") !== crew) return false;
      return true;
    });

    const filteredEvents = events.filter((e) => {
      if (!includeDeleted && e.is_deleted) return false;
      if (query && !e.name.toLowerCase().includes(query)) return false;
      if (province && e.province !== province) return false;
      if (eventType && e.event_type !== eventType) return false;
      return true;
    });

    const profileById = new Map(profiles.map((p) => [p.user_id, p.email]));

    const [auditRows, totalPeople, totalEvents, totalEditions, totalParticipation, peopleByProvince, peopleByYear, eventsByType, eventsByProvince] = await Promise.all([
      listAuditLogs(`select=*&order=created_at.desc&limit=200`),
      dbSelect<{ count: number }>("people", "select=count:id&is_deleted=eq.false"),
      dbSelect<{ count: number }>("events", "select=count:id&is_deleted=eq.false"),
      dbSelect<{ count: number }>("event_editions", "select=count:id"),
      dbSelect<{ count: number }>("participation", "select=count:id"),
      dbSelect<{ province: string; count: number }>("people", "select=province,count:id&is_deleted=eq.false&group=province&order=count.desc&limit=10"),
      dbSelect<{ start_year: number; count: number }>("people", "select=start_year,count:id&is_deleted=eq.false&group=start_year&order=start_year.asc"),
      dbSelect<{ event_type: string; count: number }>("events", "select=event_type,count:id&is_deleted=eq.false&group=event_type&order=count.desc"),
      dbSelect<{ province: string; count: number }>("events", "select=province,count:id&is_deleted=eq.false&group=province&order=count.desc")
    ]);


    const filteredAudit = auditRows.filter((row) => {
      if (auditEntity && String(row.entity_type) !== auditEntity) return false;
      if (auditAction && String(row.action) !== auditAction) return false;
      const actorEmail = (profileById.get(String(row.actor_user_id ?? "")) ?? "").toLowerCase();
      if (auditActor && !actorEmail.includes(auditActor)) return false;
      const created = new Date(String(row.created_at));
      if (auditFrom && created < new Date(auditFrom)) return false;
      if (auditTo && created > new Date(`${auditTo}T23:59:59`)) return false;
      return true;
    });

    return (
      <main className="auth-layout">
        <h1>Panel de administración</h1>
        <p>Rol actual: {role}</p>
        <nav style={{ display: "flex", gap: 12 }}>
          <Link href="/admin?tab=contenido&tipo=personas">Contenido</Link>
          <Link href="/admin?tab=auditoria">Auditoría</Link>
          <Link href="/admin?tab=estadisticas">Estadísticas</Link>
          <Link href="/admin?tab=usuarios">Usuarios</Link>
        </nav>

        {tab === "contenido" && (
          <section>
            <h2>Contenido</h2>
            {role === "admin" ? <BackfillGeocodesButton /> : null}
            <nav style={{ display: "flex", gap: 8 }}>
              <Link href="/admin?tab=contenido&tipo=personas">Personas</Link>
              <Link href="/admin?tab=contenido&tipo=eventos">Eventos</Link>
            </nav>
            <form>
              <input type="hidden" name="tab" value="contenido" />
              <input type="hidden" name="tipo" value={tipo} />
              <input name="q" placeholder="Buscar" defaultValue={params.q} />
              <input name="provincia" placeholder="Provincia" defaultValue={province} />
              {tipo === "personas" ? <input name="crew" placeholder="Crew" defaultValue={crew} /> : <input name="tipoEvento" placeholder="Tipo evento" defaultValue={eventType} />}
              <label><input type="checkbox" name="eliminados" value="1" defaultChecked={includeDeleted} /> Incluir ocultos</label>
              <button type="submit">Filtrar</button>
            </form>

            {tipo === "personas" ? (
              <table><thead><tr><th>Nombre artístico</th><th>Provincia</th><th>Ciudad</th><th>Inicio</th><th>Crew</th><th>Creado por</th><th>Fecha</th><th>Acciones</th></tr></thead><tbody>
                {filteredPeople.map((p) => (
                  <tr key={p.id}>
                    <td>{p.stage_name ?? p.full_name}</td><td>{p.province}</td><td>{p.city}</td><td>{p.start_year}</td><td>{p.crew_or_club ?? "—"}</td><td>{profileById.get(p.user_id ?? "") ?? p.user_id ?? "—"}</td><td>{new Date(p.created_at).toLocaleDateString("es-AR")}</td>
                    <td>
                      <Link href={`/personas/${p.id}`}>Ver</Link> <Link href={`/personas/${p.id}/editar`}>Editar</Link>
                      {p.is_deleted ? <form action={restorePersonAction} style={{ display: "inline" }}><input type="hidden" name="id" value={p.id} /><button type="submit">Restaurar</button></form> : <form action={deletePersonAction} style={{ display: "inline" }}><input type="hidden" name="id" value={p.id} /><ConfirmSubmitButton label="Ocultar" message="¿Ocultar persona?" /></form>}
                    </td>
                  </tr>
                ))}
              </tbody></table>
            ) : (
              <table><thead><tr><th>Nombre</th><th>Tipo</th><th>Provincia</th><th>Ciudad</th><th>Recurrente</th><th>Creado por</th><th>Fecha</th><th>Acciones</th></tr></thead><tbody>
                {filteredEvents.map((e) => (
                  <tr key={e.id}><td>{e.name}</td><td>{e.event_type}</td><td>{e.province}</td><td>{e.city}</td><td>{e.is_recurring ? "Sí" : "No"}</td><td>{profileById.get(e.created_by ?? "") ?? e.created_by ?? "—"}</td><td>{new Date(e.created_at).toLocaleDateString("es-AR")}</td>
                  <td><Link href={`/eventos/${e.id}`}>Ver</Link> <Link href={`/eventos/${e.id}/editar`}>Editar</Link>{e.is_deleted ? <form action={restoreEventAction} style={{ display: "inline" }}><input type="hidden" name="id" value={e.id} /><button type="submit">Restaurar</button></form> : <form action={deleteEventAction} style={{ display: "inline" }}><input type="hidden" name="id" value={e.id} /><ConfirmSubmitButton label="Ocultar" message="¿Ocultar evento?" /></form>}</td></tr>
                ))}
              </tbody></table>
            )}
          </section>
        )}

        {tab === "auditoria" && (
          <section>
            <h2>Auditoría</h2>
            <form>
              <input type="hidden" name="tab" value="auditoria" />
              <input name="entidad" placeholder="Entidad" defaultValue={auditEntity} />
              <input name="accion" placeholder="Acción" defaultValue={auditAction} />
              <input name="actor" placeholder="Actor (email)" defaultValue={auditActor} />
              <label>Desde <input type="date" name="desde" defaultValue={auditFrom} /></label>
              <label>Hasta <input type="date" name="hasta" defaultValue={auditTo} /></label>
              <button type="submit">Filtrar</button>
            </form>
            <table><thead><tr><th>Fecha</th><th>Actor</th><th>Acción</th><th>Entidad</th><th>Entity ID</th><th>Resumen</th></tr></thead><tbody>
              {filteredAudit.map((row) => (
                <tr key={String(row.id)}>
                  <td>{new Date(String(row.created_at)).toLocaleString("es-AR")}</td>
                  <td>{profileById.get(String(row.actor_user_id ?? "")) ?? String(row.actor_user_id ?? "-")}</td>
                  <td>{String(row.action)}</td>
                  <td>{String(row.entity_type)}</td>
                  <td>{String(row.entity_id)}</td>
                  <td><pre style={{ maxWidth: 300, whiteSpace: "pre-wrap" }}>{JSON.stringify({ before: row.before, after: row.after })}</pre></td>
                </tr>
              ))}
            </tbody></table>
          </section>
        )}

        {tab === "estadisticas" && (
          <section>
            <h2>Estadísticas</h2>
            <ul>
              <li>Total personas: {totalPeople[0]?.count ?? 0}</li>
              <li>Total eventos: {totalEvents[0]?.count ?? 0}</li>
              <li>Total ediciones: {totalEditions[0]?.count ?? 0}</li>
              <li>Total participaciones: {totalParticipation[0]?.count ?? 0}</li>
            </ul>
            <h3>Personas por provincia</h3>
            <ul>{peopleByProvince.map((x) => <li key={x.province}>{x.province}: {x.count}</li>)}</ul>
            <h3>Personas por año de inicio</h3>
            <ul>{peopleByYear.map((x) => <li key={String(x.start_year)}>{x.start_year}: {x.count}</li>)}</ul>
            <h3>Eventos por tipo</h3>
            <ul>{eventsByType.map((x) => <li key={x.event_type}>{x.event_type}: {x.count}</li>)}</ul>
            <h3>Eventos por provincia</h3>
            <ul>{eventsByProvince.map((x) => <li key={x.province}>{x.province}: {x.count}</li>)}</ul>
          </section>
        )}

        {tab === "usuarios" && <UsersManager profiles={profiles} currentRole={role} />}
      </main>
    );
  } catch (error) {
    console.error("Error al cargar /admin", error);
    return <AdminErrorPanel code="ADM-LOAD-01" />;
  }
}
