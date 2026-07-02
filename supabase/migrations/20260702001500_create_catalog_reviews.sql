create table if not exists public.catalog_reviews (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id),
  product_id uuid not null references public.products(id) on delete cascade,
  customer_name text not null,
  customer_email text not null,
  rating integer not null,
  comment text,
  photo_url text,
  status text not null default 'pending',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint catalog_reviews_rating_check
    check (rating between 1 and 5),
  constraint catalog_reviews_status_check
    check (status in ('pending', 'approved', 'rejected'))
);

create index if not exists catalog_reviews_product_id_idx
  on public.catalog_reviews(product_id, status);

alter table public.catalog_reviews enable row level security;
