export const dynamic = "force-dynamic";

import Link from "next/link";
import { listPeople } from "@/lib/data";

export default async function PersonasPage() {
  const people = await listPeople();

  return (
    <main className="auth-layout">
      <h1>Personas</h1>
      <p>
        <Link href="/personas/nueva">Nueva persona</Link>
      </p>
      <ul>
        {people.map((person) => (
          <li key={person.id}>
            <Link href={`/personas/${person.id}`}>{person.full_name}</Link> — {person.city}, {person.province}
          </li>
        ))}
      </ul>
    </main>
  );
}
