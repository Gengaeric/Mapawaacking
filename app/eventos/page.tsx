export const dynamic = "force-dynamic";

import Link from "next/link";
import { listEvents } from "@/lib/data";

export default async function EventosPage() {
  const events = await listEvents();

  return (
    <main className="auth-layout">
      <h1>Eventos</h1>
      <p>
        <Link href="/eventos/nuevo">Nuevo evento</Link>
      </p>
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
