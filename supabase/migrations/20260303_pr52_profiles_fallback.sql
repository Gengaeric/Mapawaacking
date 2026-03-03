create table if not exists public.profiles (
  user_id uuid primary key,
  email text,
  role text not null default 'usuario' check (role in ('usuario', 'moderador', 'admin')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_profiles_role on public.profiles(role);

drop trigger if exists trg_profiles_updated_at on public.profiles;
create trigger trg_profiles_updated_at
before update on public.profiles
for each row execute function set_updated_at();
