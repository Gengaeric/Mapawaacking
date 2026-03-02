import type { Json } from "@/lib/supabase/db";
import { dbDelete, dbInsert, dbSelect, dbUpdate, dbUpsert } from "@/lib/supabase/db";

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

export async function listPeople(includeDeleted = false) {
  const deletedFilter = includeDeleted ? "" : "&is_deleted=eq.false";
  return dbSelect<Person>("people", `select=*&order=created_at.desc${deletedFilter}`);
}

export async function getPerson(id: string) {
  const rows = await dbSelect<Person>("people", `select=*&id=eq.${id}&limit=1`);
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

export async function listEvents(includeDeleted = false) {
  const deletedFilter = includeDeleted ? "" : "&is_deleted=eq.false";
  return dbSelect<Event>("events", `select=*&order=created_at.desc${deletedFilter}`);
}

export async function getEvent(id: string) {
  const rows = await dbSelect<Event>("events", `select=*&id=eq.${id}&limit=1`);
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
  return dbSelect<Edition>("event_editions", `select=*&event_id=eq.${eventId}&order=year.asc`);
}

export async function listAllEditions() {
  return dbSelect<Edition>("event_editions", "select=*&order=year.asc");
}

export async function createEdition(payload: Partial<Edition>) {
  const rows = await dbInsert("event_editions", payload);
  return rows[0] as Edition;
}

export async function getEdition(id: string) {
  const rows = await dbSelect<Edition>("event_editions", `select=*&id=eq.${id}&limit=1`);
  return rows[0] ?? null;
}

export async function listParticipationsByEdition(editionId: string) {
  return dbSelect<Participation>("participation", `select=*&edition_id=eq.${editionId}`);
}

export async function listParticipationsByPerson(personId: string) {
  return dbSelect<Participation>("participation", `select=*&person_id=eq.${personId}`);
}

export async function listParticipationsByEvent(eventId: string) {
  return dbSelect<Participation>(
    "participation",
    `select=*,event_editions!inner(id,event_id,year,date)&event_editions.event_id=eq.${eventId}`
  );
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
  const encoded = encodeURIComponent(query);
  const rows = await dbSelect<GeocodeCache>("geocode_cache", `select=*&query=eq.${encoded}&limit=1`);
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

export async function listAuditLogs(query: string) {
  return dbSelect<Record<string, Json>>("audit_log", query);
}

export async function listProfiles() {
  return dbSelect<Profile>("profiles", "select=*&order=created_at.desc");
}

export async function getProfile(userId: string) {
  const rows = await dbSelect<Profile>("profiles", `select=*&user_id=eq.${userId}&limit=1`);
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
