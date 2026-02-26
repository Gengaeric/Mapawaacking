# Mapawaacking — PR1

Este PR migra el MVP A estático a una base full-stack con **Next.js (App Router) + TypeScript**.

## Correr en local

```bash
npm install
npm run dev
```

Luego abrir `http://localhost:3000`.

## Variables de entorno

1. Copiar el archivo de ejemplo:

```bash
cp .env.example .env.local
```

2. Editar `.env.local` según sea necesario (en este PR todavía no se usan en runtime).

## Qué incluye este PR

- Migración del proyecto a Next.js con estructura `app/`.
- Port del MVP A (mapa, línea temporal, filtros y ficha) a la página principal.
- Endpoint placeholder `GET /api/health` que responde `{ "ok": true }`.
- Scripts estándar: `dev`, `build`, `start`.

## Qué vendrá en PR2

- Primeros módulos de backend real (sin romper MVP).
- Base para persistencia (a definir) y organización de dominio.
- Endpoints iniciales para separar datos del frontend.
