export const dynamic = "force-dynamic";

import Link from "next/link";
import { notFound } from "next/navigation";
import { createEditionAction, deleteEventAction } from "@/app/contenido/actions";
import { EventAiSummary } from "./ai-summary";
import { getViewerContext } from "@/lib/auth/viewer-context";
import {
  getEvent,
  listEditionsByEvent,
  listParticipationsByEdition,
  listPeople
} from "@/lib/data";

export default async function EventoDetallePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [event, viewer] = await Promise.all([getEvent(id), getViewerContext()]);
  if (!event) notFound();

  const [editions, people] = await Promise.all([listEditionsByEvent(event.id), listPeople()]);
  const peopleMap = new Map(people.map((person) => [person.id, person.full_name]));
  const participationsByEdition = await Promise.all(
    editions.map(async (edition) => ({
      editionId: edition.id,
      items: await listParticipationsByEdition(edition.id)
    }))
  );
  const participantsMap = new Map(
    participationsByEdition.map((entry) => [
      entry.editionId,
      entry.items.map((item) => peopleMap.get(item.person_id) ?? item.person_id)
    ])
  );

  return (
    <main className="auth-layout">
      <h1>{event.name}</h1>
      <p>Tipo: {event.event_type}</p>
      <p>
        Ciudad/Provincia: {event.city}, {event.province}
      </p>
      {!event.latitude || !event.longitude ? <p>No pudimos ubicar esta ciudad/provincia.</p> : null}
      <p>{event.description}</p>

      <EventAiSummary
        id={id}
        initialSummary={event.ai_summary}
        hasSourceText={Boolean(event.description?.trim())}
        canRegenerate={viewer.showAdminUi}
      />

      <section>
        <h2>Ediciones</h2>
        <ul>
          {editions.map((edition) => (
            <li key={edition.id}>
              {edition.year} {edition.date ? `(${edition.date})` : ""}
              <br />
              Participantes: {(participantsMap.get(edition.id) ?? []).join(", ") || "Sin participantes"}
            </li>
          ))}
        </ul>

        {viewer.showAdminUi ? (
          <>
            <h3>Nueva edición</h3>
            <form action={createEditionAction} className="auth-form">
              <input type="hidden" name="event_id" value={event.id} />
              <label>Año</label>
              <input type="number" name="year" required />
              <label>Fecha</label>
              <input type="date" name="date" />
              <label>Ciudad</label>
              <input name="city" defaultValue={event.city} />
              <label>Provincia</label>
              <input name="province" defaultValue={event.province} />
              <p>La ubicación se completa automáticamente con ciudad y provincia.</p>
              <button type="submit">Agregar edición</button>
            </form>
          </>
        ) : null}
      </section>

      {viewer.showAdminUi ? (
        <>
          <p>
            <Link href={`/eventos/${event.id}/editar`}>Editar</Link>
          </p>
          <form action={deleteEventAction}>
            <input type="hidden" name="id" value={event.id} />
            <button type="submit">Eliminar</button>
          </form>
        </>
      ) : null}
    </main>
  );
}
