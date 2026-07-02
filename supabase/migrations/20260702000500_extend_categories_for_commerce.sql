alter table public.categories
  add column if not exists parent_id uuid references public.categories(id) on delete set null,
  add column if not exists image_url text,
  add column if not exists banner_url text,
  add column if not exists slug text,
  add column if not exists meta_title text,
  add column if not exists meta_description text,
  add column if not exists sort_order integer not null default 0,
  add column if not exists is_active boolean not null default true;

update public.categories
set slug = regexp_replace(
  lower(coalesce(slug, name)),
  '[^a-z0-9]+',
  '-',
  'g'
)
where slug is null;

update public.categories
set slug = trim(both '-' from slug)
where slug is not null;

alter table public.categories
  alter column slug set not null;

create unique index if not exists categories_org_slug_idx
  on public.categories(organization_id, slug);

create index if not exists categories_parent_id_idx
  on public.categories(parent_id);

create index if not exists categories_commerce_order_idx
  on public.categories(organization_id, parent_id, sort_order);
