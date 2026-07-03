create table if not exists public.catalog_inventory_sync_events (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id),
  product_id uuid not null references public.products(id) on delete cascade,
  variant_id uuid references public.product_variants(id) on delete cascade,
  source text not null,
  stock integer not null default 0,
  synced_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  constraint catalog_inventory_sync_source_check
    check (source in ('erp', 'commerce', 'pos'))
);

create index if not exists catalog_inventory_sync_product_idx
  on public.catalog_inventory_sync_events(organization_id, product_id, synced_at desc);

alter table public.catalog_inventory_sync_events enable row level security;
