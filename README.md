# Mapawaacking — PR4

Este PR convierte `/admin` en un panel real de moderación con pestañas de **Contenido**, **Auditoría**, **Estadísticas** y **Usuarios/Roles**.

## Correr en local

```bash
npm install
cp .env.example .env.local
npm run dev
```

## Variables de entorno necesarias

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY` (**solo server-side**, requerida para endpoints admin de usuarios)
- `ADMIN_EMAILS` (lista separada por comas, estos mails siempre son `admin`)

## Migraciones

Aplicar en Supabase SQL Editor:

1. `supabase/schema.sql` (si montás desde cero)
2. `supabase/migrations/20260302_pr4_admin.sql` (si ya venías de PR3)
3. `supabase/seed.sql` (opcional)

Cambios de DB principales:
- `people` y `events`: `is_deleted`, `deleted_at` (soft delete)
- nueva tabla `profiles` para rol persistente (`usuario`/`moderador`/`admin`)

## Roles y prueba local

1. Crear usuarios desde `/registro`.
2. Iniciar sesión con un email definido en `ADMIN_EMAILS` para entrar como admin.
3. Ir a `/admin?tab=usuarios`.
4. Usar “Hacer moderador” / “Quitar moderador”.
5. Probar acceso a `/admin` con ese usuario promovido.

## Funcionalidades PR4

- Panel `/admin` con navegación por pestañas en español.
- Gestión de contenido (Personas/Eventos): buscar, filtrar, editar, ocultar/restaurar.
- Auditoría visible con filtros por entidad, acción, actor y rango de fechas.
- Estadísticas agregadas de personas/eventos/ediciones/participación.
- Gestión de roles por API server-side con `SUPABASE_SERVICE_ROLE_KEY`.
