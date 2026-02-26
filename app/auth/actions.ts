"use server";

import { redirect } from "next/navigation";
import { signInWithPassword, signOut, signUp } from "@/lib/supabase/server";

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
  redirect("/");
}
