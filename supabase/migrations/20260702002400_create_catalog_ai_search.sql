create table if not exists public.catalog_search_documents (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id),
  product_id uuid not null references public.products(id) on delete cascade,
  search_text text not null,
  embedding jsonb,
  updated_at timestamptz not null default now()
);

create unique index if not exists catalog_search_documents_product_idx
  on public.catalog_search_documents(organization_id, product_id);

alter table public.catalog_search_documents enable row level security;
