"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { canEditOwnerResource, canManageAll, requireUser } from "@/lib/auth/permissions";
import {
  createEdition,
  createEvent,
  createPerson,
  deleteEvent,
  deletePerson,
  getEvent,
  getPerson,
  insertAuditLog,
  listParticipationsByPerson,
  replaceParticipations,
  updateEvent,
  updatePerson
} from "@/lib/data";

function parseNumber(value: FormDataEntryValue | null) {
  if (!value) return null;
  const num = Number(String(value));
  return Number.isFinite(num) ? num : null;
}

export async function createPersonAction(formData: FormData) {
  const user = await requireUser();

  const payload = {
    user_id: user.id,
    full_name: String(formData.get("full_name") ?? ""),
    stage_name: String(formData.get("stage_name") ?? "") || null,
    city: String(formData.get("city") ?? ""),
    province: String(formData.get("province") ?? ""),
    start_year: Number(formData.get("start_year") ?? 0),
    biography: String(formData.get("biography") ?? "") || null,
    profile_image_data_uri: String(formData.get("profile_image_data_uri") ?? "") || null,
    crew_or_club: String(formData.get("crew_or_club") ?? "") || null,
    latitude: parseNumber(formData.get("latitude")),
    longitude: parseNumber(formData.get("longitude")),
    social_links: { instagram: String(formData.get("instagram") ?? "") }
  };

  const person = await createPerson(payload);
  await insertAuditLog({
    actor_user_id: user.id,
    action: "CREATE",
    entity_type: "person",
    entity_id: person.id,
    after: person
  });

  revalidatePath("/personas");
  redirect(`/personas/${person.id}`);
}

export async function updatePersonAction(formData: FormData) {
  const user = await requireUser();
  const id = String(formData.get("id") ?? "");
  const existing = await getPerson(id);
  if (!existing) throw new Error("NOT_FOUND");

  const canManage = canManageAll(user.email, user.app_metadata?.role);
  if (!canEditOwnerResource(user.id, existing.user_id, canManage)) throw new Error("FORBIDDEN");

  const payload = {
    full_name: String(formData.get("full_name") ?? ""),
    stage_name: String(formData.get("stage_name") ?? "") || null,
    city: String(formData.get("city") ?? ""),
    province: String(formData.get("province") ?? ""),
    start_year: Number(formData.get("start_year") ?? 0),
    biography: String(formData.get("biography") ?? "") || null,
    profile_image_data_uri: String(formData.get("profile_image_data_uri") ?? "") || null,
    crew_or_club: String(formData.get("crew_or_club") ?? "") || null,
    latitude: parseNumber(formData.get("latitude")),
    longitude: parseNumber(formData.get("longitude")),
    social_links: { instagram: String(formData.get("instagram") ?? "") }
  };

  const updated = await updatePerson(id, payload);
  await insertAuditLog({
    actor_user_id: user.id,
    action: "UPDATE",
    entity_type: "person",
    entity_id: id,
    before: existing,
    after: updated
  });

  revalidatePath(`/personas/${id}`);
  revalidatePath("/personas");
  redirect(`/personas/${id}`);
}

export async function deletePersonAction(formData: FormData) {
  const user = await requireUser();
  const id = String(formData.get("id") ?? "");
  const existing = await getPerson(id);
  if (!existing) return;

  const canManage = canManageAll(user.email, user.app_metadata?.role);
  if (!canEditOwnerResource(user.id, existing.user_id, canManage)) throw new Error("FORBIDDEN");

  await deletePerson(id);
  await insertAuditLog({
    actor_user_id: user.id,
    action: "DELETE",
    entity_type: "person",
    entity_id: id,
    before: existing
  });

  revalidatePath("/personas");
  redirect("/personas");
}

export async function createEventAction(formData: FormData) {
  const user = await requireUser();
  const payload = {
    created_by: user.id,
    name: String(formData.get("name") ?? ""),
    event_type: String(formData.get("event_type") ?? ""),
    city: String(formData.get("city") ?? ""),
    province: String(formData.get("province") ?? ""),
    description: String(formData.get("description") ?? "") || null,
    cover_image_data_uri: String(formData.get("cover_image_data_uri") ?? "") || null,
    is_recurring: String(formData.get("is_recurring") ?? "") === "on",
    latitude: parseNumber(formData.get("latitude")),
    longitude: parseNumber(formData.get("longitude")),
    links: { web: String(formData.get("web") ?? "") }
  };

  const event = await createEvent(payload);
  await insertAuditLog({
    actor_user_id: user.id,
    action: "CREATE",
    entity_type: "event",
    entity_id: event.id,
    after: event
  });

  revalidatePath("/eventos");
  redirect(`/eventos/${event.id}`);
}

export async function updateEventAction(formData: FormData) {
  const user = await requireUser();
  const id = String(formData.get("id") ?? "");
  const existing = await getEvent(id);
  if (!existing) throw new Error("NOT_FOUND");

  const canManage = canManageAll(user.email, user.app_metadata?.role);
  if (!canEditOwnerResource(user.id, existing.created_by, canManage)) throw new Error("FORBIDDEN");

  const payload = {
    name: String(formData.get("name") ?? ""),
    event_type: String(formData.get("event_type") ?? ""),
    city: String(formData.get("city") ?? ""),
    province: String(formData.get("province") ?? ""),
    description: String(formData.get("description") ?? "") || null,
    cover_image_data_uri: String(formData.get("cover_image_data_uri") ?? "") || null,
    is_recurring: String(formData.get("is_recurring") ?? "") === "on",
    latitude: parseNumber(formData.get("latitude")),
    longitude: parseNumber(formData.get("longitude")),
    links: { web: String(formData.get("web") ?? "") }
  };

  const updated = await updateEvent(id, payload);
  await insertAuditLog({
    actor_user_id: user.id,
    action: "UPDATE",
    entity_type: "event",
    entity_id: id,
    before: existing,
    after: updated
  });

  revalidatePath(`/eventos/${id}`);
  revalidatePath("/eventos");
  redirect(`/eventos/${id}`);
}

export async function deleteEventAction(formData: FormData) {
  const user = await requireUser();
  const id = String(formData.get("id") ?? "");
  const existing = await getEvent(id);
  if (!existing) return;

  const canManage = canManageAll(user.email, user.app_metadata?.role);
  if (!canEditOwnerResource(user.id, existing.created_by, canManage)) throw new Error("FORBIDDEN");

  await deleteEvent(id);
  await insertAuditLog({
    actor_user_id: user.id,
    action: "DELETE",
    entity_type: "event",
    entity_id: id,
    before: existing
  });

  revalidatePath("/eventos");
  redirect("/eventos");
}

export async function createEditionAction(formData: FormData) {
  const user = await requireUser();
  const eventId = String(formData.get("event_id") ?? "");
  const event = await getEvent(eventId);
  if (!event) throw new Error("NOT_FOUND");

  const canManage = canManageAll(user.email, user.app_metadata?.role);
  if (!canEditOwnerResource(user.id, event.created_by, canManage)) throw new Error("FORBIDDEN");

  const edition = await createEdition({
    event_id: eventId,
    year: Number(formData.get("year") ?? 0),
    date: String(formData.get("date") ?? "") || null,
    city: String(formData.get("city") ?? "") || null,
    province: String(formData.get("province") ?? "") || null,
    latitude: parseNumber(formData.get("latitude")),
    longitude: parseNumber(formData.get("longitude"))
  });

  await insertAuditLog({
    actor_user_id: user.id,
    action: "CREATE",
    entity_type: "edition",
    entity_id: edition.id,
    after: edition
  });

  revalidatePath(`/eventos/${eventId}`);
  redirect(`/eventos/${eventId}`);
}

export async function updatePersonParticipationAction(formData: FormData) {
  const user = await requireUser();
  const personId = String(formData.get("person_id") ?? "");
  const person = await getPerson(personId);
  if (!person) throw new Error("NOT_FOUND");

  const canManage = canManageAll(user.email, user.app_metadata?.role);
  if (!canEditOwnerResource(user.id, person.user_id, canManage)) throw new Error("FORBIDDEN");

  const ids = formData
    .getAll("edition_ids")
    .map((value) => String(value))
    .filter(Boolean);

  const before = await listParticipationsByPerson(personId);
  await replaceParticipations(personId, ids);

  await insertAuditLog({
    actor_user_id: user.id,
    action: "UPDATE",
    entity_type: "participation",
    entity_id: personId,
    before,
    after: ids
  });

  revalidatePath(`/personas/${personId}`);
  redirect(`/personas/${personId}`);
}
