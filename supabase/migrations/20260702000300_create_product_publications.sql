create table if not exists public.product_publications (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id),
  product_id uuid not null references public.products(id) on delete cascade,
  slug text not null,
  status text not null default 'draft',
  is_visible boolean not null default false,
  is_featured boolean not null default false,
  meta_title text,
  meta_description text,
  canonical_url text,
  open_graph_title text,
  open_graph_description text,
  open_graph_image_url text,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint product_publications_status_check
    check (status in ('draft', 'published', 'hidden'))
);

create unique index if not exists product_publications_product_id_idx
  on public.product_publications(product_id);

create unique index if not exists product_publications_org_slug_idx
  on public.product_publications(organization_id, slug);

create index if not exists product_publications_organization_id_idx
  on public.product_publications(organization_id);

alter table public.product_publications enable row level security;

create policy "Users can read product publications from their organization"
  on public.product_publications
  for select
  to authenticated
  using (
    organization_id in (
      select profiles.organization_id
      from public.profiles
      where profiles.id = auth.uid()
    )
  );

create policy "Users can insert product publications for their organization"
  on public.product_publications
  for insert
  to authenticated
  with check (
    organization_id in (
      select profiles.organization_id
      from public.profiles
      where profiles.id = auth.uid()
    )
  );

create policy "Users can update product publications from their organization"
  on public.product_publications
  for update
  to authenticated
  using (
    organization_id in (
      select profiles.organization_id
      from public.profiles
      where profiles.id = auth.uid()
    )
  )
  with check (
    organization_id in (
      select profiles.organization_id
      from public.profiles
      where profiles.id = auth.uid()
    )
  );

create policy "Users can delete product publications from their organization"
  on public.product_publications
  for delete
  to authenticated
  using (
    organization_id in (
      select profiles.organization_id
      from public.profiles
      where profiles.id = auth.uid()
    )
  );
