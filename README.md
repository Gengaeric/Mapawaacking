# Mapawaacking — PR5

Este PR agrega geocoding automático (ciudad + provincia) para **personas**, **eventos** y **ediciones** sin pedir coordenadas manuales al usuario.

## Correr en local

```bash
npm install
cp .env.example .env.local
npm run dev
```

## Variables de entorno necesarias

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY` (**solo server-side**)
- `ADMIN_EMAILS` (lista separada por comas)
- `GEOCODER_USER_AGENT` (opcional, recomendado para personalizar el User-Agent de Nominatim)

## Migraciones

Aplicar en Supabase SQL Editor:

1. `supabase/schema.sql` (si montás desde cero)
2. `supabase/migrations/20260302_pr4_admin.sql`
3. `supabase/migrations/20260302_pr42_add_soft_delete.sql`
4. `supabase/migrations/20260302_pr5_geocode_cache.sql`
5. `supabase/migrations/20260303_pr52_profiles_fallback.sql`
6. `supabase/seed.sql` (opcional)

Correr migración profiles en Supabase.

## Qué hace PR5

- Geocoding server-side con Nominatim (OpenStreetMap).
- Cache en DB (`geocode_cache`) para evitar requests repetidos.
- Rate limit básico por instancia (1 request/segundo cuando no hay cache hit).
- Integración en altas/ediciones de personas, eventos y nuevas ediciones.
- Si no se puede geocodear, guarda igual con lat/lng nulos y muestra aviso en detalle.

## Backfill de coordenadas faltantes

En `/admin` (solo admin) hay un botón **“Completar coordenadas faltantes”**.

- Ejecuta `POST /api/admin/backfill-geocodes`.
- Recorre personas/eventos con lat/lng nulos y ciudad/provincia válidas.
- Usa cache + geocoding server-side.
- Actualiza filas y registra `audit_log` por cada update.
- Devuelve resumen: cuántos actualizó y cuántos fallaron.

## Nota de estabilidad local

Si aparecen errores extraños del bundler en desarrollo (por ejemplo, rutas que fallan sin cambios de código), borrá caché de Next y reiniciá:

```bash
rm -rf .next
npm run dev
```
