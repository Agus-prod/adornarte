create table if not exists public.collections (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id),
  name text not null,
  slug text not null,
  description text,
  banner_url text,
  is_featured boolean not null default false,
  is_active boolean not null default true,
  sort_order integer not null default 0,
  meta_title text,
  meta_description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.collection_products (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id),
  collection_id uuid not null references public.collections(id) on delete cascade,
  product_id uuid not null references public.products(id) on delete cascade,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create unique index if not exists collections_org_slug_idx
  on public.collections(organization_id, slug);

create index if not exists collections_organization_id_idx
  on public.collections(organization_id);

create index if not exists collections_featured_idx
  on public.collections(organization_id, is_featured, sort_order);

create unique index if not exists collection_products_collection_product_idx
  on public.collection_products(collection_id, product_id);

create index if not exists collection_products_collection_id_idx
  on public.collection_products(collection_id, sort_order);

create index if not exists collection_products_product_id_idx
  on public.collection_products(product_id);

alter table public.collections enable row level security;
alter table public.collection_products enable row level security;

create policy "Users can read collections from their organization"
  on public.collections
  for select
  to authenticated
  using (
    organization_id in (
      select profiles.organization_id
      from public.profiles
      where profiles.id = auth.uid()
    )
  );

create policy "Users can insert collections for their organization"
  on public.collections
  for insert
  to authenticated
  with check (
    organization_id in (
      select profiles.organization_id
      from public.profiles
      where profiles.id = auth.uid()
    )
  );

create policy "Users can update collections from their organization"
  on public.collections
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

create policy "Users can delete collections from their organization"
  on public.collections
  for delete
  to authenticated
  using (
    organization_id in (
      select profiles.organization_id
      from public.profiles
      where profiles.id = auth.uid()
    )
  );

create policy "Users can read collection products from their organization"
  on public.collection_products
  for select
  to authenticated
  using (
    organization_id in (
      select profiles.organization_id
      from public.profiles
      where profiles.id = auth.uid()
    )
  );

create policy "Users can insert collection products for their organization"
  on public.collection_products
  for insert
  to authenticated
  with check (
    organization_id in (
      select profiles.organization_id
      from public.profiles
      where profiles.id = auth.uid()
    )
  );

create policy "Users can update collection products from their organization"
  on public.collection_products
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

create policy "Users can delete collection products from their organization"
  on public.collection_products
  for delete
  to authenticated
  using (
    organization_id in (
      select profiles.organization_id
      from public.profiles
      where profiles.id = auth.uid()
    )
  );
