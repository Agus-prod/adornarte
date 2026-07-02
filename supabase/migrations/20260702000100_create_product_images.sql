create table if not exists public.product_images (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id),
  product_id uuid not null references public.products(id) on delete cascade,
  url text not null,
  path text not null,
  alt_text text,
  sort_order integer not null default 0,
  is_primary boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists product_images_product_id_idx
  on public.product_images(product_id);

create index if not exists product_images_organization_id_idx
  on public.product_images(organization_id);

create unique index if not exists product_images_one_primary_per_product_idx
  on public.product_images(product_id)
  where is_primary;

alter table public.product_images enable row level security;

create policy "Users can read product images from their organization"
  on public.product_images
  for select
  to authenticated
  using (
    organization_id in (
      select profiles.organization_id
      from public.profiles
      where profiles.id = auth.uid()
    )
  );

create policy "Users can insert product images for their organization"
  on public.product_images
  for insert
  to authenticated
  with check (
    organization_id in (
      select profiles.organization_id
      from public.profiles
      where profiles.id = auth.uid()
    )
  );

create policy "Users can update product images from their organization"
  on public.product_images
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

create policy "Users can delete product images from their organization"
  on public.product_images
  for delete
  to authenticated
  using (
    organization_id in (
      select profiles.organization_id
      from public.profiles
      where profiles.id = auth.uid()
    )
  );

insert into storage.buckets (
  id,
  name,
  public
)
values (
  'product-images',
  'product-images',
  true
)
on conflict (id) do nothing;

create policy "Users can upload product image files"
  on storage.objects
  for insert
  to authenticated
  with check (
    bucket_id = 'product-images'
  );

create policy "Users can read product image files"
  on storage.objects
  for select
  to authenticated
  using (
    bucket_id = 'product-images'
  );

create policy "Users can delete product image files"
  on storage.objects
  for delete
  to authenticated
  using (
    bucket_id = 'product-images'
  );
