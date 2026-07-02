create table if not exists public.catalog_wishlist_items (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id),
  customer_email text not null,
  product_id uuid not null references public.products(id) on delete cascade,
  created_at timestamptz not null default now()
);

create unique index if not exists catalog_wishlist_items_unique_idx
  on public.catalog_wishlist_items(organization_id, customer_email, product_id);

create index if not exists catalog_wishlist_items_email_idx
  on public.catalog_wishlist_items(organization_id, customer_email);

alter table public.catalog_wishlist_items enable row level security;
