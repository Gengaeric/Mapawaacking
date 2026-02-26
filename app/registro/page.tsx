import Link from "next/link";
import { register } from "@/app/auth/actions";

export default async function RegistroPage({
  searchParams
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const params = await searchParams;

  return (
    <main className="auth-layout">
      <h1>Crear cuenta</h1>
      {params.error ? <p className="mensaje-error">{params.error}</p> : null}

      <form action={register} className="auth-form">
        <label htmlFor="email">Email</label>
        <input id="email" name="email" type="email" required />

        <label htmlFor="password">Contraseña</label>
        <input id="password" name="password" type="password" minLength={6} required />

        <button type="submit">Crear cuenta</button>
      </form>

      <p>
        ¿Ya tenés cuenta? <Link href="/login">Iniciar sesión</Link>
      </p>
    </main>
  );
}
