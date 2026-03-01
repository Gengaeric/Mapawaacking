export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import {
  listAllEditions,
  listEvents,
  listParticipationsByPerson,
  listPeople
} from "@/lib/data";

export async function GET() {
  const [people, events, editions] = await Promise.all([listPeople(), listEvents(), listAllEditions()]);

  const personas = await Promise.all(
    people.map(async (person) => {
      const participations = await listParticipationsByPerson(person.id);
      const participacionEtiquetas = participations
        .map((p) => editions.find((e) => e.id === p.edition_id))
        .filter(Boolean)
        .map((edition) => {
          const event = events.find((item) => item.id === edition?.event_id);
          return `${event?.name ?? "Evento"} (${edition?.year})`;
        });

      return {
        id: person.id,
        tipo: "persona",
        nombre: person.full_name,
        nombreArtistico: person.stage_name ?? person.full_name,
        ciudad: person.city,
        provincia: person.province,
        lat: person.latitude ?? -38.4161,
        lng: person.longitude ?? -63.6167,
        anioInicio: person.start_year,
        crewClub: person.crew_or_club ?? "Sin crew",
        bio: person.biography ?? "",
        redes: Object.values(person.social_links ?? {}).join(", "),
        foto: person.profile_image_data_uri ?? "",
        participaciones: participacionEtiquetas
      };
    })
  );

  const eventos = editions
    .map((edition) => {
      const event = events.find((item) => item.id === edition.event_id);
      if (!event) return null;
      return {
        id: edition.id,
        tipo: "evento",
        nombre: event.name,
        tipoEvento: event.event_type,
        fecha: edition.date,
        anio: edition.year,
        ciudad: edition.city ?? event.city,
        provincia: edition.province ?? event.province,
        lat: edition.latitude ?? event.latitude ?? -38.4161,
        lng: edition.longitude ?? event.longitude ?? -63.6167,
        descripcion: event.description ?? "",
        links: Object.values(event.links ?? {}).join(", "),
        fotoPortada: event.cover_image_data_uri ?? ""
      };
    })
    .filter(Boolean);

  return NextResponse.json({ personas, eventos });
}
