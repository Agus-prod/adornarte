create table if not exists public.product_attributes (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id),
  product_id uuid not null references public.products(id) on delete cascade,
  name text not null,
  value text not null,
  type text not null default 'custom',
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists product_attributes_product_id_idx
  on public.product_attributes(product_id);

create index if not exists product_attributes_organization_id_idx
  on public.product_attributes(organization_id);

create index if not exists product_attributes_type_idx
  on public.product_attributes(type);

alter table public.product_attributes enable row level security;

create policy "Users can read product attributes from their organization"
  on public.product_attributes
  for select
  to authenticated
  using (
    organization_id in (
      select profiles.organization_id
      from public.profiles
      where profiles.id = auth.uid()
    )
  );

create policy "Users can insert product attributes for their organization"
  on public.product_attributes
  for insert
  to authenticated
  with check (
    organization_id in (
      select profiles.organization_id
      from public.profiles
      where profiles.id = auth.uid()
    )
  );

create policy "Users can update product attributes from their organization"
  on public.product_attributes
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

create policy "Users can delete product attributes from their organization"
  on public.product_attributes
  for delete
  to authenticated
  using (
    organization_id in (
      select profiles.organization_id
      from public.profiles
      where profiles.id = auth.uid()
    )
  );
