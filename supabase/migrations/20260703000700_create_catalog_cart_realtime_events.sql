create table if not exists public.catalog_cart_realtime_events (
  id uuid primary key default gen_random_uuid(),
  cart_id uuid not null,
  event_type text not null,
  created_at timestamptz not null default now()
);

create index if not exists catalog_cart_realtime_events_cart_id_idx
  on public.catalog_cart_realtime_events(cart_id, created_at desc);

alter table public.catalog_cart_realtime_events enable row level security;

drop policy if exists "Anyone can read cart realtime events"
  on public.catalog_cart_realtime_events;
create policy "Anyone can read cart realtime events"
  on public.catalog_cart_realtime_events
  for select
  to anon, authenticated
  using (true);

do $$
begin
  alter publication supabase_realtime
    add table public.catalog_cart_realtime_events;
exception
  when duplicate_object then
    null;
end;
$$;
