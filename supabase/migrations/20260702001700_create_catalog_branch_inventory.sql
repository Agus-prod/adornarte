create table if not exists public.catalog_branch_inventory (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id),
  branch_id uuid not null references public.branches(id) on delete cascade,
  product_id uuid not null references public.products(id) on delete cascade,
  variant_id uuid references public.product_variants(id) on delete cascade,
  available_stock integer not null default 0,
  reserved_stock integer not null default 0,
  updated_at timestamptz not null default now()
);

create unique index if not exists catalog_branch_inventory_unique_idx
  on public.catalog_branch_inventory(
    organization_id,
    branch_id,
    product_id,
    coalesce(variant_id, '00000000-0000-0000-0000-000000000000'::uuid)
  );

create index if not exists catalog_branch_inventory_product_idx
  on public.catalog_branch_inventory(organization_id, product_id);

alter table public.catalog_branch_inventory enable row level security;
