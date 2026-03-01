export const dynamic = "force-dynamic";

import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/supabase/server";
import { createPersonAction } from "@/app/contenido/actions";

export default async function NuevaPersonaPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  return (
    <main className="auth-layout">
      <h1>Nueva persona</h1>
      <form action={createPersonAction} className="auth-form">
        <label>Nombre completo</label>
        <input name="full_name" required />
        <label>Nombre artístico</label>
        <input name="stage_name" />
        <label>Ciudad</label>
        <input name="city" required />
        <label>Provincia</label>
        <input name="province" required />
        <label>Año de inicio</label>
        <input name="start_year" type="number" required />
        <label>Biografía</label>
        <textarea name="biography" rows={4} />
        <label>Crew/Club</label>
        <input name="crew_or_club" />
        <label>Instagram</label>
        <input name="instagram" />
        <label>Imagen (data URI SVG)</label>
        <textarea name="profile_image_data_uri" rows={3} />
        <label>Latitud</label>
        <input name="latitude" type="number" step="any" />
        <label>Longitud</label>
        <input name="longitude" type="number" step="any" />
        <button type="submit">Crear</button>
      </form>
    </main>
  );
}
