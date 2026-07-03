create table if not exists public.catalog_shipping_zones (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id),
  name text not null,
  city text,
  base_rate numeric(12, 2) not null default 0,
  rate_per_kg numeric(12, 2) not null default 0,
  free_shipping_minimum numeric(12, 2),
  courier text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.catalog_shipments (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id),
  order_id uuid not null references public.catalog_orders(id) on delete cascade,
  zone_id uuid references public.catalog_shipping_zones(id),
  courier text,
  tracking_number text,
  status text not null default 'pending',
  cost numeric(12, 2) not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists catalog_shipping_zones_active_idx
  on public.catalog_shipping_zones(organization_id, is_active);

create index if not exists catalog_shipments_order_id_idx
  on public.catalog_shipments(order_id);

alter table public.catalog_shipping_zones enable row level security;
alter table public.catalog_shipments enable row level security;
