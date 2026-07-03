create table if not exists public.catalog_analytics_events (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id),
  event_type text not null,
  product_id uuid references public.products(id) on delete set null,
  order_id uuid references public.catalog_orders(id) on delete set null,
  cart_id uuid references public.catalog_carts(id) on delete set null,
  customer_email text,
  value numeric(12, 2),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists catalog_analytics_events_type_idx
  on public.catalog_analytics_events(organization_id, event_type, created_at desc);

alter table public.catalog_analytics_events enable row level security;
