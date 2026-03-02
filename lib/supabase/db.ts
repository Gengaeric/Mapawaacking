import { getSupabaseServiceRoleKey, getSupabaseUrl } from "@/lib/supabase/env";

export type Primitive = string | number | boolean | null;
export type Json = Primitive | Json[] | { [key: string]: Json };

function buildHeaders(prefer?: string) {
  return {
    apikey: getSupabaseServiceRoleKey(),
    Authorization: `Bearer ${getSupabaseServiceRoleKey()}`,
    "Content-Type": "application/json",
    ...(prefer ? { Prefer: prefer } : {})
  };
}

function makeUrl(path: string, query?: string) {
  const base = getSupabaseUrl();
  return `${base}/rest/v1/${path}${query ? `?${query}` : ""}`;
}

export async function dbSelect<T>(table: string, query: string) {
  const response = await fetch(makeUrl(table, query), {
    method: "GET",
    headers: buildHeaders(),
    cache: "no-store"
  });

  if (!response.ok) {
    throw new Error(`Error al leer ${table}: ${response.status}`);
  }

  return (await response.json()) as T[];
}

export async function dbInsert<T extends Record<string, Json>>(table: string, payload: T | T[]) {
  const response = await fetch(makeUrl(table), {
    method: "POST",
    headers: buildHeaders("return=representation"),
    body: JSON.stringify(payload),
    cache: "no-store"
  });

  if (!response.ok) {
    throw new Error(`Error al insertar en ${table}: ${response.status}`);
  }

  return (await response.json()) as T[];
}

export async function dbUpsert<T extends Record<string, Json>>(
  table: string,
  payload: T | T[],
  onConflict: string
) {
  const response = await fetch(makeUrl(`${table}?on_conflict=${onConflict}`), {
    method: "POST",
    headers: {
      ...buildHeaders("return=representation,resolution=merge-duplicates")
    },
    body: JSON.stringify(payload),
    cache: "no-store"
  });

  if (!response.ok) {
    throw new Error(`Error al upsert en ${table}: ${response.status}`);
  }

  return (await response.json()) as T[];
}

export async function dbUpdate<T extends Record<string, Json>>(
  table: string,
  query: string,
  payload: Partial<T>
) {
  const response = await fetch(makeUrl(table, query), {
    method: "PATCH",
    headers: buildHeaders("return=representation"),
    body: JSON.stringify(payload),
    cache: "no-store"
  });

  if (!response.ok) {
    throw new Error(`Error al editar en ${table}: ${response.status}`);
  }

  return (await response.json()) as T[];
}

export async function dbDelete(table: string, query: string) {
  const response = await fetch(makeUrl(table, query), {
    method: "DELETE",
    headers: buildHeaders(),
    cache: "no-store"
  });

  if (!response.ok) {
    throw new Error(`Error al borrar en ${table}: ${response.status}`);
  }
}
