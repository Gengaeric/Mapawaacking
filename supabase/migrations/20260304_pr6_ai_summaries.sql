alter table if exists public.people
  add column if not exists ai_summary text;

alter table if exists public.events
  add column if not exists ai_summary text;
