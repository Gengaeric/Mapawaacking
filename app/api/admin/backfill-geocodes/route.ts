import { NextResponse } from "next/server";
import { ensureUserProfile } from "@/lib/auth/server-roles";
import { geocodeLocation } from "@/lib/geocoding";
import {
  getCurrentUser
} from "@/lib/supabase/server";
import {
  insertAuditLog,
  listEvents,
  listPeople,
  updateEvent,
  updatePerson
} from "@/lib/data";

async function requireAdmin() {
  const user = await getCurrentUser();
  if (!user) return null;
  const role = await ensureUserProfile(user);
  if (role !== "admin") return null;
  return user;
}

export async function GET() {
  return NextResponse.json({ ok: false, error: "Method Not Allowed", hint: "Use POST" }, { status: 405 });
}

export async function POST() {
  const actor = await requireAdmin();
  if (!actor) return NextResponse.json({ ok: false, error: "FORBIDDEN" }, { status: 403 });

  const [people, events] = await Promise.all([listPeople(true), listEvents(true)]);

  let peopleUpdated = 0;
  let eventsUpdated = 0;
  let failed = 0;

  for (const person of people) {
    if (person.latitude != null && person.longitude != null) continue;
    const city = person.city.trim();
    const province = person.province.trim();
    if (!city || !province) {
      failed += 1;
      continue;
    }

    const geocoded = await geocodeLocation(city, province);
    if (!geocoded) {
      failed += 1;
      continue;
    }

    const updated = await updatePerson(person.id, { latitude: geocoded.lat, longitude: geocoded.lng });
    peopleUpdated += 1;
    await insertAuditLog({
      actor_user_id: actor.id,
      action: "UPDATE",
      entity_type: "person",
      entity_id: person.id,
      before: person,
      after: updated
    });
  }

  for (const event of events) {
    if (event.latitude != null && event.longitude != null) continue;
    const city = event.city.trim();
    const province = event.province.trim();
    if (!city || !province) {
      failed += 1;
      continue;
    }

    const geocoded = await geocodeLocation(city, province);
    if (!geocoded) {
      failed += 1;
      continue;
    }

    const updated = await updateEvent(event.id, { latitude: geocoded.lat, longitude: geocoded.lng });
    eventsUpdated += 1;
    await insertAuditLog({
      actor_user_id: actor.id,
      action: "UPDATE",
      entity_type: "event",
      entity_id: event.id,
      before: event,
      after: updated
    });
  }

  return NextResponse.json({
    ok: true,
    peopleUpdated,
    eventsUpdated,
    failed,
    totalUpdated: peopleUpdated + eventsUpdated
  });
}
