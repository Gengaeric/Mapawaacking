# Mapawaacking — PR3

Este PR incorpora persistencia real con **Supabase Postgres**, modelo SQL, seed y CRUD mínimo para personas/eventos/ediciones/participación.

## Correr en local

```bash
npm install
cp .env.example .env.local
npm run dev
```

## Variables de entorno necesarias

Configurar en `.env.local`:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY` (**solo server-side**)
- `ADMIN_EMAILS` (lista separada por comas)

> Importante: no exponer `SUPABASE_SERVICE_ROLE_KEY` en cliente.

## Esquema y seed

- Esquema SQL: `supabase/schema.sql`
- Datos iniciales: `supabase/seed.sql`

Aplicar en Supabase SQL Editor en este orden:
1. `schema.sql`
2. `seed.sql`

## Netlify

Para que funcione en deploy, definir las variables en:

- **Site settings → Environment variables**

Luego redeploy automático desde la rama principal.

## Funcionalidades PR3

- CRUD mínimo de personas y eventos.
- Alta de ediciones por evento recurrente.
- Participación de personas en ediciones.
- Mapa/timeline consumiendo datos de DB (`/api/map-data`).
- Escritura de `audit_log` en acciones CREATE/UPDATE/DELETE.
