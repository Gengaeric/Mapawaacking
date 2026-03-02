"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { canEditOwnerResource, getManagePermissionFromUser, requireUser } from "@/lib/auth/permissions";
import {
  createEdition,
  createEvent,
  createPerson,
  getEvent,
  getPerson,
  insertAuditLog,
  listParticipationsByPerson,
  replaceParticipations,
  restoreEvent,
  restorePerson,
  softDeleteEvent,
  softDeletePerson,
  updateEvent,
  updatePerson
} from "@/lib/data";
import { geocodeLocation } from "@/lib/geocoding";


function cleanText(value: FormDataEntryValue | null) {
  return String(value ?? "").trim();
}

export async function createPersonAction(formData: FormData) {
  const user = await requireUser();
  const city = cleanText(formData.get("city"));
  const province = cleanText(formData.get("province"));
  if (!city || !province) throw new Error("Ciudad y provincia son obligatorias.");
  const geocoded = await geocodeLocation(city, province);

  const payload = {
    user_id: user.id,
    full_name: cleanText(formData.get("full_name")),
    stage_name: cleanText(formData.get("stage_name")) || null,
    city,
    province,
    start_year: Number(formData.get("start_year") ?? 0),
    biography: cleanText(formData.get("biography")) || null,
    profile_image_data_uri: cleanText(formData.get("profile_image_data_uri")) || null,
    crew_or_club: cleanText(formData.get("crew_or_club")) || null,
    latitude: geocoded?.lat ?? null,
    longitude: geocoded?.lng ?? null,
    social_links: { instagram: cleanText(formData.get("instagram")) }
  };

  const person = await createPerson(payload);
  await insertAuditLog({ actor_user_id: user.id, action: "CREATE", entity_type: "person", entity_id: person.id, after: person });
  revalidatePath("/personas");
  redirect(`/personas/${person.id}`);
}

export async function updatePersonAction(formData: FormData) {
  const { user, canManage } = await getManagePermissionFromUser();
  const id = String(formData.get("id") ?? "");
  const existing = await getPerson(id);
  if (!existing) throw new Error("NOT_FOUND");
  if (!canEditOwnerResource(user.id, existing.user_id, canManage)) throw new Error("FORBIDDEN");

  const city = cleanText(formData.get("city"));
  const province = cleanText(formData.get("province"));
  if (!city || !province) throw new Error("Ciudad y provincia son obligatorias.");
  const locationChanged = existing.city !== city || existing.province !== province;
  const geocoded = locationChanged || existing.latitude == null || existing.longitude == null
    ? await geocodeLocation(city, province)
    : null;

  const payload = {
    full_name: cleanText(formData.get("full_name")),
    stage_name: cleanText(formData.get("stage_name")) || null,
    city,
    province,
    start_year: Number(formData.get("start_year") ?? 0),
    biography: cleanText(formData.get("biography")) || null,
    profile_image_data_uri: cleanText(formData.get("profile_image_data_uri")) || null,
    crew_or_club: cleanText(formData.get("crew_or_club")) || null,
    latitude: geocoded ? geocoded.lat : existing.latitude,
    longitude: geocoded ? geocoded.lng : existing.longitude,
    social_links: { instagram: cleanText(formData.get("instagram")) }
  };

  const updated = await updatePerson(id, payload);
  await insertAuditLog({ actor_user_id: user.id, action: "UPDATE", entity_type: "person", entity_id: id, before: existing, after: updated });
  revalidatePath(`/personas/${id}`);
  revalidatePath("/personas");
  revalidatePath("/admin");
  redirect(`/personas/${id}`);
}

export async function deletePersonAction(formData: FormData) {
  const { user, role, canManage } = await getManagePermissionFromUser();
  const id = String(formData.get("id") ?? "");
  const existing = await getPerson(id);
  if (!existing) return;
  if (!canEditOwnerResource(user.id, existing.user_id, canManage)) throw new Error("FORBIDDEN");
  if (!canManage) throw new Error("FORBIDDEN");

  const updated = await softDeletePerson(id);
  await insertAuditLog({ actor_user_id: user.id, action: "DELETE", entity_type: "person", entity_id: id, before: existing, after: updated ?? { role } });
  revalidatePath("/personas");
  revalidatePath("/admin");
  redirect("/admin?tab=contenido&tipo=personas");
}

export async function restorePersonAction(formData: FormData) {
  const { user, canManage } = await getManagePermissionFromUser();
  if (!canManage) throw new Error("FORBIDDEN");
  const id = String(formData.get("id") ?? "");
  const existing = await getPerson(id);
  if (!existing) return;
  const updated = await restorePerson(id);
  await insertAuditLog({ actor_user_id: user.id, action: "UPDATE", entity_type: "person", entity_id: id, before: existing, after: updated });
  revalidatePath("/admin");
}

export async function createEventAction(formData: FormData) {
  const user = await requireUser();
  const city = cleanText(formData.get("city"));
  const province = cleanText(formData.get("province"));
  if (!city || !province) throw new Error("Ciudad y provincia son obligatorias.");
  const geocoded = await geocodeLocation(city, province);

  const payload = {
    created_by: user.id,
    name: cleanText(formData.get("name")),
    event_type: cleanText(formData.get("event_type")),
    city,
    province,
    description: cleanText(formData.get("description")) || null,
    cover_image_data_uri: cleanText(formData.get("cover_image_data_uri")) || null,
    is_recurring: String(formData.get("is_recurring") ?? "") === "on",
    latitude: geocoded?.lat ?? null,
    longitude: geocoded?.lng ?? null,
    links: { web: cleanText(formData.get("web")) }
  };

  const event = await createEvent(payload);
  await insertAuditLog({ actor_user_id: user.id, action: "CREATE", entity_type: "event", entity_id: event.id, after: event });
  revalidatePath("/eventos");
  redirect(`/eventos/${event.id}`);
}

export async function updateEventAction(formData: FormData) {
  const { user, canManage } = await getManagePermissionFromUser();
  const id = String(formData.get("id") ?? "");
  const existing = await getEvent(id);
  if (!existing) throw new Error("NOT_FOUND");
  if (!canEditOwnerResource(user.id, existing.created_by, canManage)) throw new Error("FORBIDDEN");

  const city = cleanText(formData.get("city"));
  const province = cleanText(formData.get("province"));
  if (!city || !province) throw new Error("Ciudad y provincia son obligatorias.");
  const locationChanged = existing.city !== city || existing.province !== province;
  const geocoded = locationChanged || existing.latitude == null || existing.longitude == null
    ? await geocodeLocation(city, province)
    : null;

  const payload = {
    name: cleanText(formData.get("name")),
    event_type: cleanText(formData.get("event_type")),
    city,
    province,
    description: cleanText(formData.get("description")) || null,
    cover_image_data_uri: cleanText(formData.get("cover_image_data_uri")) || null,
    is_recurring: String(formData.get("is_recurring") ?? "") === "on",
    latitude: geocoded ? geocoded.lat : existing.latitude,
    longitude: geocoded ? geocoded.lng : existing.longitude,
    links: { web: cleanText(formData.get("web")) }
  };

  const updated = await updateEvent(id, payload);
  await insertAuditLog({ actor_user_id: user.id, action: "UPDATE", entity_type: "event", entity_id: id, before: existing, after: updated });
  revalidatePath(`/eventos/${id}`);
  revalidatePath("/eventos");
  revalidatePath("/admin");
  redirect(`/eventos/${id}`);
}

export async function deleteEventAction(formData: FormData) {
  const { user, canManage } = await getManagePermissionFromUser();
  if (!canManage) throw new Error("FORBIDDEN");
  const id = String(formData.get("id") ?? "");
  const existing = await getEvent(id);
  if (!existing) return;
  if (!canEditOwnerResource(user.id, existing.created_by, canManage)) throw new Error("FORBIDDEN");

  const updated = await softDeleteEvent(id);
  await insertAuditLog({ actor_user_id: user.id, action: "DELETE", entity_type: "event", entity_id: id, before: existing, after: updated });
  revalidatePath("/eventos");
  revalidatePath("/admin");
  redirect("/admin?tab=contenido&tipo=eventos");
}

export async function restoreEventAction(formData: FormData) {
  const { user, canManage } = await getManagePermissionFromUser();
  if (!canManage) throw new Error("FORBIDDEN");
  const id = String(formData.get("id") ?? "");
  const existing = await getEvent(id);
  if (!existing) return;
  const updated = await restoreEvent(id);
  await insertAuditLog({ actor_user_id: user.id, action: "UPDATE", entity_type: "event", entity_id: id, before: existing, after: updated });
  revalidatePath("/admin");
}

export async function createEditionAction(formData: FormData) {
  const { user, canManage } = await getManagePermissionFromUser();
  const eventId = String(formData.get("event_id") ?? "");
  const event = await getEvent(eventId);
  if (!event) throw new Error("NOT_FOUND");
  if (!canEditOwnerResource(user.id, event.created_by, canManage)) throw new Error("FORBIDDEN");

  const city = cleanText(formData.get("city"));
  const province = cleanText(formData.get("province"));
  const geocoded = city && province ? await geocodeLocation(city, province) : null;

  const edition = await createEdition({
    event_id: eventId,
    year: Number(formData.get("year") ?? 0),
    date: cleanText(formData.get("date")) || null,
    city: city || null,
    province: province || null,
    latitude: geocoded?.lat ?? null,
    longitude: geocoded?.lng ?? null
  });

  await insertAuditLog({ actor_user_id: user.id, action: "CREATE", entity_type: "edition", entity_id: edition.id, after: edition });
  revalidatePath(`/eventos/${eventId}`);
  redirect(`/eventos/${eventId}`);
}

export async function updatePersonParticipationAction(formData: FormData) {
  const { user, canManage } = await getManagePermissionFromUser();
  const personId = String(formData.get("person_id") ?? "");
  const person = await getPerson(personId);
  if (!person) throw new Error("NOT_FOUND");
  if (!canEditOwnerResource(user.id, person.user_id, canManage)) throw new Error("FORBIDDEN");

  const ids = formData.getAll("edition_ids").map((value) => String(value)).filter(Boolean);
  const before = await listParticipationsByPerson(personId);
  await replaceParticipations(personId, ids);

  await insertAuditLog({ actor_user_id: user.id, action: "UPDATE", entity_type: "participation", entity_id: personId, before, after: ids });

  revalidatePath(`/personas/${personId}`);
  redirect(`/personas/${personId}`);
}
