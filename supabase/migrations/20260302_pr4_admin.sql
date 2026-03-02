alter table if exists public.people
  add column if not exists is_deleted boolean not null default false,
  add column if not exists deleted_at timestamptz;

alter table if exists public.events
  add column if not exists is_deleted boolean not null default false,
  add column if not exists deleted_at timestamptz;

create table if not exists public.profiles (
  user_id uuid primary key,
  email text not null unique,
  role text not null default 'usuario' check (role in ('usuario','moderador','admin')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_profiles_role on public.profiles(role);

create trigger trg_profiles_updated_at
before update on public.profiles
for each row execute function set_updated_at();
