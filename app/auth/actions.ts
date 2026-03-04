"use server";

import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { ADMIN_VIEW_MODE_COOKIE, type AdminViewMode } from "@/lib/auth/admin-view-mode";
import { resolveUserRole } from "@/lib/auth/roles";
import { ensureUserProfile, upsertBasicProfileOnLogin } from "@/lib/auth/server-roles";
import { getCurrentUser, signInWithPassword, signOut, signUp } from "@/lib/supabase/server";

export async function login(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    redirect("/login?error=Completá+email+y+contraseña");
  }

  const { error } = await signInWithPassword(email, password);

  if (error) {
    redirect("/login?error=No+se+pudo+iniciar+sesión");
  }

  const user = await getCurrentUser();
  if (user) {
    await upsertBasicProfileOnLogin(user);
    await ensureUserProfile(user);
  }

  redirect("/");
}

export async function register(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    redirect("/registro?error=Completá+email+y+contraseña");
  }

  const { error } = await signUp(email, password);

  if (error) {
    redirect("/registro?error=No+se+pudo+crear+la+cuenta");
  }

  redirect("/login?mensaje=Cuenta+creada.+Ahora+podés+iniciar+sesión");
}

export async function logout() {
  await signOut();
  const cookieStore = await cookies();
  cookieStore.delete(ADMIN_VIEW_MODE_COOKIE);
  redirect("/");
}

export async function setAdminViewModeAction(formData: FormData) {
  const requestedMode = String(formData.get("mode") ?? "") as AdminViewMode;
  const headerStore = await headers();
  const returnTo = String(formData.get("returnTo") ?? headerStore.get("referer") ?? "/");
  const user = await getCurrentUser();
  const role = resolveUserRole(user?.email, user?.app_metadata?.role);

  if (role !== "admin") {
    redirect(returnTo);
  }

  if (requestedMode !== "admin" && requestedMode !== "user") {
    redirect(returnTo);
  }

  const cookieStore = await cookies();
  cookieStore.set(ADMIN_VIEW_MODE_COOKIE, requestedMode, {
    path: "/",
    sameSite: "lax",
    httpOnly: true
  });

  redirect(returnTo);
}
