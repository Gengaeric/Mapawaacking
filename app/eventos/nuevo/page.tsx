export const dynamic = "force-dynamic";

import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/supabase/server";
import { createEventAction } from "@/app/contenido/actions";

export default async function NuevoEventoPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  return (
    <main className="auth-layout">
      <h1>Nuevo evento</h1>
      <form action={createEventAction} className="auth-form">
        <label>Nombre</label>
        <input name="name" required />
        <label>Tipo de evento</label>
        <input name="event_type" required />
        <label>Ciudad</label>
        <input name="city" required />
        <label>Provincia</label>
        <input name="province" required />
        <label>Descripción</label>
        <textarea name="description" rows={4} />
        <label>Link web</label>
        <input name="web" />
        <label>Imagen portada (data URI)</label>
        <textarea name="cover_image_data_uri" rows={3} />
        <label>
          <input type="checkbox" name="is_recurring" /> Es recurrente
        </label>
        <p>La ubicación se completa automáticamente con ciudad y provincia.</p>
        <button type="submit">Crear</button>
      </form>
    </main>
  );
}
