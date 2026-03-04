import type { Json } from "@/lib/supabase/db";
import { dbDelete, dbInsert, dbUpdate, dbUpsert } from "@/lib/supabase/db";
import { fromTable } from "@/lib/supabase/query-builder";

export function isMissingProfilesTableError(error: unknown): boolean {
  if (!(error instanceof Error)) return false;
  const message = error.message.toLowerCase();
  return message.includes("profiles") && (message.includes("404") || message.includes("42p01") || message.includes("does not exist"));
}

export type Person = {
  id: string;
  user_id: string | null;
  full_name: string;
  stage_name: string | null;
  city: string;
  province: string;
  latitude: number | null;
  longitude: number | null;
  start_year: number;
  biography: string | null;
  profile_image_data_uri: string | null;
  social_links: Record<string, string>;
  crew_or_club: string | null;
  created_at: string;
  updated_at: string;
  is_deleted?: boolean;
  deleted_at?: string | null;
};

export type Event = {
  id: string;
  created_by: string | null;
  name: string;
  event_type: string;
  city: string;
  province: string;
  latitude: number | null;
  longitude: number | null;
  description: string | null;
  cover_image_data_uri: string | null;
  gallery_images_data_uri: string[];
  links: Record<string, string>;
  is_recurring: boolean;
  created_at: string;
  updated_at: string;
  is_deleted?: boolean;
  deleted_at?: string | null;
};

export type Profile = {
  user_id: string;
  email: string;
  role: "usuario" | "moderador" | "admin";
  created_at: string;
  updated_at: string;
};

export type Edition = {
  id: string;
  event_id: string;
  date: string | null;
  year: number;
  city: string | null;
  province: string | null;
  latitude: number | null;
  longitude: number | null;
};

export type Participation = {
  id: string;
  person_id: string;
  edition_id: string | null;
  event_id: string | null;
};

export type GeocodeCache = {
  id: string;
  query: string;
  city: string;
  province: string;
  country: string;
  lat: number;
  lng: number;
  raw: Json;
  created_at: string;
  updated_at: string;
};

export async function listPeople(
  includeDeleted = false,
  options?: {
    province?: string;
    crew?: string;
    q?: string;
    startYear?: number;
    startYearFrom?: number;
    startYearTo?: number;
  }
) {
  const applyBaseFilters = () => {
    const query = fromTable<Person>("people").select("*").order("created_at", { ascending: false });

    if (!includeDeleted) query.eq("is_deleted", false);
    if (options?.province) query.eq("province", options.province);
    if (options?.crew) query.ilike("crew_or_club", `*${options.crew}*`);
    if (typeof options?.startYear === "number") query.eq("start_year", options.startYear);
    if (typeof options?.startYearFrom === "number") query.gte("start_year", options.startYearFrom);
    if (typeof options?.startYearTo === "number") query.lte("start_year", options.startYearTo);

    return query;
  };

  if (!options?.q) {
    return applyBaseFilters().execute();
  }

  const searchPattern = `*${options.q}*`;
  const [byFullName, byStageName] = await Promise.all([
    applyBaseFilters().ilike("full_name", searchPattern).execute(),
    applyBaseFilters().ilike("stage_name", searchPattern).execute()
  ]);

  const uniquePeople = new Map<string, Person>();
  for (const person of [...byFullName, ...byStageName]) {
    uniquePeople.set(person.id, person);
  }

  return [...uniquePeople.values()].sort((a, b) => b.created_at.localeCompare(a.created_at));
}

export async function getPerson(id: string) {
  const rows = await fromTable<Person>("people").select("*").eq("id", id).range(0, 0).execute();
  return rows[0] ?? null;
}

export async function createPerson(payload: Partial<Person>) {
  const rows = await dbInsert("people", payload);
  return rows[0] as Person;
}

export async function updatePerson(id: string, payload: Partial<Person>) {
  const rows = await dbUpdate<Person>("people", `id=eq.${id}`, payload);
  return rows[0] ?? null;
}

export async function deletePerson(id: string) {
  await dbDelete("people", `id=eq.${id}`);
}

export async function softDeletePerson(id: string) {
  const rows = await dbUpdate<Person>("people", `id=eq.${id}`, {
    is_deleted: true,
    deleted_at: new Date().toISOString()
  });
  return rows[0] ?? null;
}

export async function restorePerson(id: string) {
  const rows = await dbUpdate<Person>("people", `id=eq.${id}`, {
    is_deleted: false,
    deleted_at: null
  });
  return rows[0] ?? null;
}

export async function listEvents(
  includeDeleted = false,
  options?: {
    province?: string;
    eventType?: string;
    q?: string;
  }
) {
  const query = fromTable<Event>("events").select("*").order("created_at", { ascending: false });

  if (!includeDeleted) query.eq("is_deleted", false);
  if (options?.province) query.eq("province", options.province);
  if (options?.eventType) query.eq("event_type", options.eventType);
  if (options?.q) query.ilike("name", `*${options.q}*`);

  return query.execute();
}

export async function getEvent(id: string) {
  const rows = await fromTable<Event>("events").select("*").eq("id", id).range(0, 0).execute();
  return rows[0] ?? null;
}

export async function createEvent(payload: Partial<Event>) {
  const rows = await dbInsert("events", payload);
  return rows[0] as Event;
}

export async function updateEvent(id: string, payload: Partial<Event>) {
  const rows = await dbUpdate<Event>("events", `id=eq.${id}`, payload);
  return rows[0] ?? null;
}

export async function deleteEvent(id: string) {
  await dbDelete("events", `id=eq.${id}`);
}

export async function softDeleteEvent(id: string) {
  const rows = await dbUpdate<Event>("events", `id=eq.${id}`, {
    is_deleted: true,
    deleted_at: new Date().toISOString()
  });
  return rows[0] ?? null;
}

export async function restoreEvent(id: string) {
  const rows = await dbUpdate<Event>("events", `id=eq.${id}`, {
    is_deleted: false,
    deleted_at: null
  });
  return rows[0] ?? null;
}

export async function listEditionsByEvent(eventId: string) {
  return fromTable<Edition>("event_editions").select("*").eq("event_id", eventId).order("year").execute();
}

export async function listAllEditions() {
  return fromTable<Edition>("event_editions").select("*").order("year").execute();
}

export async function createEdition(payload: Partial<Edition>) {
  const rows = await dbInsert("event_editions", payload);
  return rows[0] as Edition;
}

export async function getEdition(id: string) {
  const rows = await fromTable<Edition>("event_editions").select("*").eq("id", id).range(0, 0).execute();
  return rows[0] ?? null;
}

export async function listParticipationsByEdition(editionId: string) {
  return fromTable<Participation>("participation").select("*").eq("edition_id", editionId).execute();
}

export async function listParticipationsByPerson(personId: string) {
  return fromTable<Participation>("participation").select("*").eq("person_id", personId).execute();
}

export async function listParticipationsByEvent(eventId: string) {
  return fromTable<Participation>("participation")
    .select("*,event_editions!inner(id,event_id,year,date)")
    .eq("event_editions.event_id", eventId)
    .execute();
}

export async function replaceParticipations(personId: string, editionIds: string[]) {
  await dbDelete("participation", `person_id=eq.${personId}`);
  if (!editionIds.length) return;
  await dbInsert(
    "participation",
    editionIds.map((editionId) => ({ person_id: personId, edition_id: editionId }))
  );
}

export async function insertAuditLog(payload: {
  actor_user_id: string;
  action: "CREATE" | "UPDATE" | "DELETE";
  entity_type: "person" | "event" | "edition" | "participation";
  entity_id: string;
  before?: Json;
  after?: Json;
}) {
  await dbInsert("audit_log", payload);
}

export async function getGeocodeCacheByQuery(query: string) {
  const rows = await fromTable<GeocodeCache>("geocode_cache").select("*").eq("query", query).range(0, 0).execute();
  return rows[0] ?? null;
}

export async function upsertGeocodeCache(payload: {
  query: string;
  city: string;
  province: string;
  country: string;
  lat: number;
  lng: number;
  raw: Json;
}) {
  const rows = await dbUpsert("geocode_cache", payload, "query");
  return rows[0] as GeocodeCache;
}

export async function listAuditLogs(limit = 200) {
  return fromTable<Record<string, Json>>("audit_log")
    .select("*")
    .order("created_at", { ascending: false })
    .range(0, Math.max(0, limit - 1))
    .execute();
}

export async function listProfiles() {
  return fromTable<Profile>("profiles").select("*").order("created_at", { ascending: false }).execute();
}

export async function getProfile(userId: string) {
  const rows = await fromTable<Profile>("profiles").select("*").eq("user_id", userId).range(0, 0).execute();
  return rows[0] ?? null;
}

export async function upsertProfile(profile: Partial<Profile> & { user_id: string; email: string }) {
  const rows = await dbUpsert("profiles", profile, "user_id");
  return rows[0] as Profile;
}

export async function updateProfileRole(userId: string, role: Profile["role"]) {
  const rows = await dbUpdate<Profile>("profiles", `user_id=eq.${userId}`, { role });
  return rows[0] ?? null;
}
