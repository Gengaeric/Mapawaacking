# Mapawaacking — PR2

Este PR agrega autenticación básica con **Supabase Auth** (email + contraseña), roles simples y rutas protegidas.

## Correr en local

```bash
npm install
cp .env.example .env.local
npm run dev
```

Luego abrir `http://localhost:3000`.

## Variables de entorno necesarias

Configurar en `.env.local`:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `ADMIN_EMAILS` (lista separada por comas)

## Roles (MVP)

- Rol por defecto: `usuario`.
- Si `app_metadata.role` es `moderador` o `admin`, se respeta.
- Bootstrap admin por entorno: si el email del usuario está en `ADMIN_EMAILS`, se considera `admin` automáticamente.

## Rutas y acceso

- Home (`/`): pública, mantiene el MVP de mapa + timeline.
- Login (`/login`) y registro (`/registro`): públicas.
- Perfil (`/perfil`): requiere sesión.
- Admin (`/admin`): requiere sesión y rol `moderador` o `admin`.

## Prueba rápida

1. Crear cuenta en `/registro`.
2. Iniciar sesión en `/login`.
3. Verificar acceso a `/perfil`.
4. Probar `/admin`:
   - con usuario normal debe redirigir a `/login`.
   - con email incluido en `ADMIN_EMAILS` debe permitir acceso.
