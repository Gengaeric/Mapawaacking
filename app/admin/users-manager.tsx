"use client";

import { useEffect, useMemo, useState } from "react";

type UserItem = { id: string; email: string; role: "usuario" | "moderador" | "admin" };

export function UsersManager({ profiles, currentRole }: { profiles: Array<{ user_id: string; email: string; role: UserItem["role"] }>; currentRole: string }) {
  const [users, setUsers] = useState<UserItem[]>([]);
  const [query, setQuery] = useState("");

  useEffect(() => {
    if (currentRole !== "admin") return;
    fetch("/api/admin/users")
      .then((res) => res.json())
      .then((data) => {
        const merged = (data.users ?? []).map((u: { id: string; email: string }) => {
          const profile = profiles.find((p) => p.user_id === u.id);
          return { id: u.id, email: u.email, role: profile?.role ?? "usuario" } as UserItem;
        });
        setUsers(merged);
      });
  }, [profiles, currentRole]);

  const filtered = useMemo(
    () => users.filter((u) => u.email.toLowerCase().includes(query.toLowerCase())),
    [users, query]
  );

  async function setRole(user: UserItem, role: "usuario" | "moderador") {
    const res = await fetch("/api/admin/users", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: user.id, email: user.email, role })
    });
    if (!res.ok) return;
    setUsers((prev) => prev.map((item) => (item.id === user.id ? { ...item, role } : item)));
  }

  if (currentRole !== "admin") {
    return <p>Solo administradores pueden gestionar roles.</p>;
  }

  return (
    <section>
      <h2>Usuarios y roles</h2>
      <input placeholder="Buscar por email" value={query} onChange={(e) => setQuery(e.target.value)} />
      <table>
        <thead>
          <tr>
            <th>Email</th>
            <th>Rol</th>
            <th>Acción</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((user) => (
            <tr key={user.id}>
              <td>{user.email}</td>
              <td>{user.role}</td>
              <td>
                {user.role === "moderador" ? (
                  <button onClick={() => setRole(user, "usuario")}>Quitar moderador</button>
                ) : user.role === "usuario" ? (
                  <button onClick={() => setRole(user, "moderador")}>Hacer moderador</button>
                ) : (
                  "—"
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
