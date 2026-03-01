create extension if not exists "pgcrypto";

create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create table if not exists public.people (
  id uuid primary key default gen_random_uuid(),
  user_id uuid null,
  full_name text not null,
  stage_name text,
  city text not null,
  province text not null,
  latitude double precision,
  longitude double precision,
  start_year int not null,
  biography text,
  profile_image_data_uri text,
  social_links jsonb not null default '{}'::jsonb,
  crew_or_club text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.crews (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  city text,
  province text,
  created_at timestamptz not null default now()
);

create table if not exists public.events (
  id uuid primary key default gen_random_uuid(),
  created_by uuid,
  name text not null,
  event_type text not null,
  city text not null,
  province text not null,
  latitude double precision,
  longitude double precision,
  description text,
  cover_image_data_uri text,
  gallery_images_data_uri jsonb not null default '[]'::jsonb,
  links jsonb not null default '{}'::jsonb,
  is_recurring boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.event_editions (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.events(id) on delete cascade,
  date date,
  year int not null,
  city text,
  province text,
  latitude double precision,
  longitude double precision,
  created_at timestamptz not null default now(),
  unique(event_id, year)
);

create table if not exists public.participation (
  id uuid primary key default gen_random_uuid(),
  person_id uuid not null references public.people(id) on delete cascade,
  edition_id uuid references public.event_editions(id) on delete cascade,
  event_id uuid references public.events(id) on delete cascade,
  created_at timestamptz not null default now(),
  check (edition_id is not null or event_id is not null)
);

create table if not exists public.audit_log (
  id uuid primary key default gen_random_uuid(),
  actor_user_id uuid,
  action text not null,
  entity_type text not null,
  entity_id uuid not null,
  before jsonb,
  after jsonb,
  created_at timestamptz not null default now()
);

create index if not exists idx_people_user_id on public.people(user_id);
create index if not exists idx_events_created_by on public.events(created_by);
create index if not exists idx_editions_event_id on public.event_editions(event_id);
create index if not exists idx_participation_person_id on public.participation(person_id);
create index if not exists idx_participation_edition_id on public.participation(edition_id);
create index if not exists idx_participation_event_id on public.participation(event_id);
create index if not exists idx_audit_entity on public.audit_log(entity_type, entity_id);

create trigger trg_people_updated_at
before update on public.people
for each row execute function set_updated_at();

create trigger trg_events_updated_at
before update on public.events
for each row execute function set_updated_at();
