export const dynamic = "force-dynamic";

import Link from "next/link";
import { listEvents } from "@/lib/data";
import { getViewerContext } from "@/lib/auth/viewer-context";

export default async function EventosPage() {
  const [events, viewer] = await Promise.all([listEvents(), getViewerContext()]);

  return (
    <main className="auth-layout">
      <h1>Eventos</h1>
      {viewer.showAdminUi ? (
        <p>
          <Link href="/eventos/nuevo">Nuevo evento</Link>
        </p>
      ) : null}
      <ul>
        {events.map((event) => (
          <li key={event.id}>
            <Link href={`/eventos/${event.id}`}>{event.name}</Link> — {event.city}, {event.province}
          </li>
        ))}
      </ul>
    </main>
  );
}
