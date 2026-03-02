create table if not exists public.geocode_cache (
  id uuid primary key default gen_random_uuid(),
  query text not null unique,
  city text not null,
  province text not null,
  country text not null default 'Argentina',
  lat double precision not null,
  lng double precision not null,
  raw jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index if not exists geocode_cache_query_key on public.geocode_cache (query);
create index if not exists geocode_cache_city_province_idx on public.geocode_cache (city, province);

create or replace function public.set_geocode_cache_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_geocode_cache_updated_at on public.geocode_cache;
create trigger trg_geocode_cache_updated_at
before update on public.geocode_cache
for each row
execute function public.set_geocode_cache_updated_at();
