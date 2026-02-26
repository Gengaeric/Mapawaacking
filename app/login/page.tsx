import Link from "next/link";
import { login } from "@/app/auth/actions";

export default async function LoginPage({
  searchParams
}: {
  searchParams: Promise<{ error?: string; mensaje?: string }>;
}) {
  const params = await searchParams;

  return (
    <main className="auth-layout">
      <h1>Iniciar sesión</h1>
      {params.error ? <p className="mensaje-error">{params.error}</p> : null}
      {params.mensaje ? <p className="mensaje-ok">{params.mensaje}</p> : null}

      <form action={login} className="auth-form">
        <label htmlFor="email">Email</label>
        <input id="email" name="email" type="email" required />

        <label htmlFor="password">Contraseña</label>
        <input id="password" name="password" type="password" minLength={6} required />

        <button type="submit">Iniciar sesión</button>
      </form>

      <p>
        ¿No tenés cuenta? <Link href="/registro">Crear cuenta</Link>
      </p>
    </main>
  );
}
