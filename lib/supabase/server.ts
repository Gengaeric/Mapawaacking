import { cookies } from "next/headers";

const ACCESS_COOKIE = "sb-access-token";

function getSupabaseConfig() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    throw new Error("Faltan variables de entorno de Supabase.");
  }

  return { url, anonKey };
}

type SupabaseUser = {
  id: string;
  email?: string;
  app_metadata?: { role?: string };
};

async function authFetch(path: string, init: RequestInit) {
  const { url, anonKey } = getSupabaseConfig();

  return fetch(`${url}/auth/v1${path}`, {
    ...init,
    headers: {
      apikey: anonKey,
      "Content-Type": "application/json",
      ...(init.headers ?? {})
    },
    cache: "no-store"
  });
}

export async function signInWithPassword(email: string, password: string) {
  const response = await authFetch("/token?grant_type=password", {
    method: "POST",
    body: JSON.stringify({ email, password })
  });

  if (!response.ok) return { error: true as const };

  const data = await response.json();
  const cookieStore = await cookies();
  cookieStore.set(ACCESS_COOKIE, data.access_token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: data.expires_in ?? 3600
  });

  return { error: false as const };
}

export async function signUp(email: string, password: string) {
  const response = await authFetch("/signup", {
    method: "POST",
    body: JSON.stringify({ email, password })
  });

  return { error: !response.ok };
}

export async function signOut() {
  const cookieStore = await cookies();
  cookieStore.delete(ACCESS_COOKIE);
}

export async function getCurrentUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get(ACCESS_COOKIE)?.value;

  if (!token) return null;

  const { anonKey } = getSupabaseConfig();
  const { url } = getSupabaseConfig();
  const response = await fetch(`${url}/auth/v1/user`, {
    headers: {
      apikey: anonKey,
      Authorization: `Bearer ${token}`
    },
    cache: "no-store"
  });

  if (!response.ok) return null;

  return (await response.json()) as SupabaseUser;
}

export async function getUserFromToken(token?: string) {
  if (!token) return null;

  const { anonKey, url } = getSupabaseConfig();
  const response = await fetch(`${url}/auth/v1/user`, {
    headers: {
      apikey: anonKey,
      Authorization: `Bearer ${token}`
    },
    cache: "no-store"
  });

  if (!response.ok) return null;

  return (await response.json()) as SupabaseUser;
}

export { ACCESS_COOKIE };
