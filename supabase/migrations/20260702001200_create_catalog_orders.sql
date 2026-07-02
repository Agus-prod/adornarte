create table if not exists public.catalog_orders (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id),
  cart_id uuid references public.catalog_carts(id) on delete set null,
  order_number text not null,
  status text not null default 'pending',
  customer_name text not null,
  customer_email text not null,
  customer_phone text not null,
  shipping_address text not null,
  shipping_city text not null,
  shipping_notes text,
  payment_method text,
  subtotal numeric(12, 2) not null default 0,
  discount_total numeric(12, 2) not null default 0,
  shipping_total numeric(12, 2) not null default 0,
  tax_total numeric(12, 2) not null default 0,
  total numeric(12, 2) not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint catalog_orders_status_check
    check (status in ('pending', 'paid', 'preparing', 'shipped', 'delivered', 'cancelled'))
);

create table if not exists public.catalog_order_items (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id),
  order_id uuid not null references public.catalog_orders(id) on delete cascade,
  product_id uuid references public.products(id),
  variant_id uuid references public.product_variants(id),
  name text not null,
  sku text,
  image_url text,
  quantity integer not null,
  unit_price numeric(12, 2) not null default 0,
  total numeric(12, 2) not null default 0,
  notes text,
  created_at timestamptz not null default now()
);

create unique index if not exists catalog_orders_org_number_idx
  on public.catalog_orders(organization_id, order_number);

create index if not exists catalog_orders_status_idx
  on public.catalog_orders(organization_id, status);

create index if not exists catalog_order_items_order_id_idx
  on public.catalog_order_items(order_id);

alter table public.catalog_payments
  add constraint catalog_payments_order_id_fkey
    foreign key (order_id)
    references public.catalog_orders(id)
    on delete set null;

alter table public.catalog_orders enable row level security;
alter table public.catalog_order_items enable row level security;
