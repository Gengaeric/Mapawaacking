export const dynamic = "force-dynamic";

import { notFound, redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/supabase/server";
import { getEvent } from "@/lib/data";
import { updateEventAction } from "@/app/contenido/actions";

export default async function EditarEventoPage({ params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const { id } = await params;
  const event = await getEvent(id);
  if (!event) notFound();

  return (
    <main className="auth-layout">
      <h1>Editar evento</h1>
      <form action={updateEventAction} className="auth-form">
        <input type="hidden" name="id" value={event.id} />
        <label>Nombre</label>
        <input name="name" defaultValue={event.name} required />
        <label>Tipo de evento</label>
        <input name="event_type" defaultValue={event.event_type} required />
        <label>Ciudad</label>
        <input name="city" defaultValue={event.city} required />
        <label>Provincia</label>
        <input name="province" defaultValue={event.province} required />
        <label>Descripción</label>
        <textarea name="description" rows={4} defaultValue={event.description ?? ""} />
        <label>Link web</label>
        <input name="web" defaultValue={event.links?.web ?? ""} />
        <label>Imagen portada (data URI)</label>
        <textarea name="cover_image_data_uri" rows={3} defaultValue={event.cover_image_data_uri ?? ""} />
        <label>
          <input type="checkbox" name="is_recurring" defaultChecked={event.is_recurring} /> Es recurrente
        </label>
        <p>La ubicación se completa automáticamente con ciudad y provincia.</p>
        <button type="submit">Guardar</button>
      </form>
    </main>
  );
}
