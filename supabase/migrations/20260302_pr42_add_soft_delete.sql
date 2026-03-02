-- PR4.2: ensure soft-delete columns exist in production
-- Safe to run multiple times.

alter table if exists public.events
  add column if not exists is_deleted boolean,
  add column if not exists deleted_at timestamptz;

update public.events
set is_deleted = false
where is_deleted is null;

alter table if exists public.events
  alter column is_deleted set default false,
  alter column is_deleted set not null;

alter table if exists public.people
  add column if not exists is_deleted boolean,
  add column if not exists deleted_at timestamptz;

update public.people
set is_deleted = false
where is_deleted is null;

alter table if exists public.people
  alter column is_deleted set default false,
  alter column is_deleted set not null;

create index if not exists idx_events_is_deleted on public.events(is_deleted);
create index if not exists idx_people_is_deleted on public.people(is_deleted);
