create table if not exists public.catalog_promotions (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id),
  name text not null,
  type text not null,
  value numeric(12, 2) not null default 0,
  buy_quantity integer,
  get_quantity integer,
  minimum_quantity integer,
  product_id uuid references public.products(id) on delete cascade,
  starts_at timestamptz,
  expires_at timestamptz,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint catalog_promotions_type_check
    check (type in ('two_for_one', 'nxm', 'percent', 'amount', 'combo'))
);

create index if not exists catalog_promotions_active_idx
  on public.catalog_promotions(organization_id, is_active);

alter table public.catalog_promotions enable row level security;
