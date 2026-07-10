create table if not exists public.catalog_promotion_items (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id),
  promotion_id uuid not null references public.catalog_promotions(id) on delete cascade,
  product_id uuid not null references public.products(id) on delete cascade,
  quantity integer not null default 1,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint catalog_promotion_items_quantity_check
    check (quantity > 0)
);

create index if not exists catalog_promotion_items_promotion_idx
  on public.catalog_promotion_items(promotion_id);

create index if not exists catalog_promotion_items_product_idx
  on public.catalog_promotion_items(organization_id, product_id);

alter table public.catalog_promotion_items enable row level security;
