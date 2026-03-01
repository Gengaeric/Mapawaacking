export const dynamic = "force-dynamic";

import { notFound, redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/supabase/server";
import { updatePersonAction } from "@/app/contenido/actions";
import { getPerson } from "@/lib/data";

export default async function EditarPersonaPage({ params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const { id } = await params;
  const person = await getPerson(id);
  if (!person) notFound();

  return (
    <main className="auth-layout">
      <h1>Editar persona</h1>
      <form action={updatePersonAction} className="auth-form">
        <input type="hidden" name="id" value={person.id} />
        <label>Nombre completo</label>
        <input name="full_name" defaultValue={person.full_name} required />
        <label>Nombre artístico</label>
        <input name="stage_name" defaultValue={person.stage_name ?? ""} />
        <label>Ciudad</label>
        <input name="city" defaultValue={person.city} required />
        <label>Provincia</label>
        <input name="province" defaultValue={person.province} required />
        <label>Año de inicio</label>
        <input name="start_year" type="number" defaultValue={person.start_year} required />
        <label>Biografía</label>
        <textarea name="biography" rows={4} defaultValue={person.biography ?? ""} />
        <label>Crew/Club</label>
        <input name="crew_or_club" defaultValue={person.crew_or_club ?? ""} />
        <label>Instagram</label>
        <input name="instagram" defaultValue={person.social_links?.instagram ?? ""} />
        <label>Imagen (data URI SVG)</label>
        <textarea name="profile_image_data_uri" rows={3} defaultValue={person.profile_image_data_uri ?? ""} />
        <label>Latitud</label>
        <input name="latitude" type="number" step="any" defaultValue={person.latitude ?? ""} />
        <label>Longitud</label>
        <input name="longitude" type="number" step="any" defaultValue={person.longitude ?? ""} />
        <button type="submit">Guardar</button>
      </form>
    </main>
  );
}
