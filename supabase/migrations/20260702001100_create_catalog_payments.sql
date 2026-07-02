create table if not exists public.catalog_payments (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id),
  cart_id uuid references public.catalog_carts(id) on delete set null,
  order_id uuid,
  method text not null,
  provider text,
  status text not null default 'pending',
  amount numeric(12, 2) not null default 0,
  reference text,
  notes text,
  paid_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint catalog_payments_method_check
    check (method in ('stripe', 'paypal', 'transfer', 'cash_on_delivery')),
  constraint catalog_payments_status_check
    check (status in ('pending', 'paid', 'failed', 'cancelled'))
);

create index if not exists catalog_payments_cart_id_idx
  on public.catalog_payments(cart_id);

create index if not exists catalog_payments_order_id_idx
  on public.catalog_payments(order_id);

create index if not exists catalog_payments_status_idx
  on public.catalog_payments(organization_id, status);

alter table public.catalog_payments enable row level security;
