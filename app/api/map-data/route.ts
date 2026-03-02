export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";

type ApiErrorPayload = {
  ok: false;
  where: "api/map-data";
  error: string;
  hint: string;
  env: {
    hasUrl: boolean;
    hasAnonKey: boolean;
    hasServiceRoleKey: boolean;
  };
};

type ApiSuccessPayload = {
  ok: true;
  personas: PersonaPayload[];
  eventos: EventoPayload[];
};

type PersonaPayload = {
  id: string;
  tipo: "persona";
  nombre: string;
  nombreArtistico: string;
  ciudad: string;
  provincia: string;
  lat: number;
  lng: number;
  anioInicio: number;
  crewClub: string;
  bio: string;
  redes: string;
  foto: string;
  participaciones: string[];
};

type EventoPayload = {
  id: string;
  tipo: "evento";
  nombre: string;
  tipoEvento: string;
  fecha: string | null;
  anio: number;
  ciudad: string;
  provincia: string;
  lat: number;
  lng: number;
  descripcion: string;
  links: string;
  fotoPortada: string;
};

type PersonRow = {
  id: string;
  full_name: string;
  stage_name: string | null;
  city: string;
  province: string;
  latitude: number | null;
  longitude: number | null;
  start_year: number;
  biography: string | null;
  social_links: Record<string, string> | null;
  profile_image_data_uri: string | null;
  crew_or_club: string | null;
};

type EventRow = {
  id: string;
  name: string;
  event_type: string;
  city: string;
  province: string;
  latitude: number | null;
  longitude: number | null;
  description: string | null;
  links: Record<string, string> | null;
  cover_image_data_uri: string | null;
};

type EditionRow = {
  id: string;
  event_id: string;
  date: string | null;
  year: number;
  city: string | null;
  province: string | null;
  latitude: number | null;
  longitude: number | null;
};

type ParticipationRow = {
  person_id: string;
  edition_id: string | null;
};

function envFlags() {
  return {
    hasUrl: Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL),
    hasAnonKey: Boolean(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY),
    hasServiceRoleKey: Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY)
  };
}

function jsonError(error: string, hint: string, status = 500) {
  const payload: ApiErrorPayload = {
    ok: false,
    where: "api/map-data",
    error,
    hint,
    env: envFlags()
  };

  return NextResponse.json(payload, { status });
}

function getHintForErrorMessage(message: string) {
  const lower = message.toLowerCase();
  if (lower.includes("401") || lower.includes("403") || lower.includes("permission") || lower.includes("rls")) {
    return "Supabase permissions/RLS";
  }
  return "Unexpected error while reading map data";
}

async function fetchRest<T>(table: string, query: string, url: string, anonKey: string) {
  const response = await fetch(`${url}/rest/v1/${table}?${query}`, {
    method: "GET",
    headers: {
      apikey: anonKey,
      Authorization: `Bearer ${anonKey}`,
      "Content-Type": "application/json"
    },
    cache: "no-store"
  });

  if (!response.ok) {
    const details = await response.text();
    throw new Error(`${table} read failed (${response.status})${details ? `: ${details}` : ""}`);
  }

  return (await response.json()) as T[];
}

export async function GET() {
  const { hasUrl, hasAnonKey } = envFlags();

  if (!hasUrl || !hasAnonKey) {
    return jsonError("Missing Supabase public env vars", "Missing env vars in Netlify", 500);
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;

  try {
    const [people, events, editions, participation] = await Promise.all([
      fetchRest<PersonRow>("people", "select=*&is_deleted=eq.false&order=created_at.desc", url, anonKey),
      fetchRest<EventRow>("events", "select=*&is_deleted=eq.false&order=created_at.desc", url, anonKey),
      fetchRest<EditionRow>("event_editions", "select=*&order=year.asc", url, anonKey),
      fetchRest<ParticipationRow>("participation", "select=person_id,edition_id", url, anonKey)
    ]);

    const participationsByPerson = new Map<string, ParticipationRow[]>();
    for (const row of participation) {
      const current = participationsByPerson.get(row.person_id) ?? [];
      current.push(row);
      participationsByPerson.set(row.person_id, current);
    }

    const personas: PersonaPayload[] = people.map((person) => {
      const participations = participationsByPerson.get(person.id) ?? [];
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
    });

    const eventos: EventoPayload[] = editions
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
      .filter((event): event is EventoPayload => event !== null);

    const payload: ApiSuccessPayload = { ok: true, personas, eventos };
    return NextResponse.json(payload);
  } catch (err) {
    console.error("[api/map-data] error", err);
    if (err instanceof Error && err.stack) {
      console.error("[api/map-data] stack", err.stack);
    }

    const message = err instanceof Error ? err.message : "Unknown map-data error";
    return jsonError(message, getHintForErrorMessage(message), 500);
  }
}
