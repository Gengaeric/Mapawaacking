export const dynamic = "force-dynamic";

import Link from "next/link";
import { notFound } from "next/navigation";
import { deletePersonAction, updatePersonParticipationAction } from "@/app/contenido/actions";
import { AiSummarySection } from "@/components/ai-summary-section";
import { ensureUserProfile } from "@/lib/auth/server-roles";
import { getPerson, listAllEditions, listEvents, listParticipationsByPerson } from "@/lib/data";
import { getCurrentUser } from "@/lib/supabase/server";

export default async function PersonaDetallePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const person = await getPerson(id);
  if (!person) notFound();

  const [allEditions, participations, events, user] = await Promise.all([
    listAllEditions(),
    listParticipationsByPerson(person.id),
    listEvents(),
    getCurrentUser()
  ]);
  const role = user ? await ensureUserProfile(user) : "usuario";
  const canRegenerate = role === "admin" || role === "moderador";
  const selected = new Set(participations.map((p) => p.edition_id).filter(Boolean));
  const eventMap = new Map(events.map((event) => [event.id, event.name]));

  return (
    <main className="auth-layout">
      <h1>{person.full_name}</h1>
      <p>Nombre artístico: {person.stage_name ?? "-"}</p>
      <p>Ciudad/Provincia: {person.city}, {person.province}</p>
      {!person.latitude || !person.longitude ? <p>No pudimos ubicar esta ciudad/provincia.</p> : null}
      <p>Año inicio: {person.start_year}</p>
      <p>{person.biography}</p>

      <AiSummarySection
        type="person"
        id={person.id}
        initialSummary={person.ai_summary}
        hasSourceText={Boolean(person.biography?.trim())}
        canRegenerate={canRegenerate}
      />

      <section>
        <h2>Participación</h2>
        <form action={updatePersonParticipationAction} className="auth-form">
          <input type="hidden" name="person_id" value={person.id} />
          {allEditions.map((edition) => (
            <label key={edition.id}>
              <input
                type="checkbox"
                name="edition_ids"
                value={edition.id}
                defaultChecked={selected.has(edition.id)}
              />
              {eventMap.get(edition.event_id) ?? "Evento"} — {edition.year}
            </label>
          ))}
          <button type="submit">Guardar participación</button>
        </form>
      </section>

      <p>
        <Link href={`/personas/${person.id}/editar`}>Editar</Link>
      </p>
      <form action={deletePersonAction}>
        <input type="hidden" name="id" value={person.id} />
        <button type="submit">Eliminar</button>
      </form>
    </main>
  );
}
