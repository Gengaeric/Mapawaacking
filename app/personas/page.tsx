export const dynamic = "force-dynamic";

import Link from "next/link";
import { listPeople } from "@/lib/data";
import { getViewerContext } from "@/lib/auth/viewer-context";

export default async function PersonasPage() {
  const [people, viewer] = await Promise.all([listPeople(), getViewerContext()]);

  return (
    <main className="auth-layout">
      <h1>Personas</h1>
      {viewer.showAdminUi ? (
        <p>
          <Link href="/personas/nueva">Nueva persona</Link>
        </p>
      ) : null}
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
