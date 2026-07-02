create table if not exists public.catalog_carts (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id),
  status text not null default 'active',
  customer_email text,
  notes text,
  coupon_code text,
  subtotal numeric(12, 2) not null default 0,
  discount_total numeric(12, 2) not null default 0,
  shipping_total numeric(12, 2) not null default 0,
  tax_total numeric(12, 2) not null default 0,
  total numeric(12, 2) not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint catalog_carts_status_check
    check (status in ('active', 'converted', 'abandoned'))
);

create table if not exists public.catalog_cart_items (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id),
  cart_id uuid not null references public.catalog_carts(id) on delete cascade,
  product_id uuid not null references public.products(id),
  variant_id uuid references public.product_variants(id),
  name text not null,
  sku text,
  image_url text,
  quantity integer not null default 1,
  unit_price numeric(12, 2) not null default 0,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint catalog_cart_items_quantity_check
    check (quantity > 0)
);

create index if not exists catalog_carts_organization_id_idx
  on public.catalog_carts(organization_id);

create index if not exists catalog_carts_status_idx
  on public.catalog_carts(organization_id, status);

create index if not exists catalog_cart_items_cart_id_idx
  on public.catalog_cart_items(cart_id);

create unique index if not exists catalog_cart_items_unique_product_variant_idx
  on public.catalog_cart_items(cart_id, product_id, coalesce(variant_id, '00000000-0000-0000-0000-000000000000'::uuid));

alter table public.catalog_carts enable row level security;
alter table public.catalog_cart_items enable row level security;
