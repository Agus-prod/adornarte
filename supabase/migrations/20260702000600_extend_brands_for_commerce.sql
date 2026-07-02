alter table public.brands
  add column if not exists logo_url text,
  add column if not exists banner_url text,
  add column if not exists description text,
  add column if not exists slug text,
  add column if not exists meta_title text,
  add column if not exists meta_description text,
  add column if not exists sort_order integer not null default 0,
  add column if not exists is_active boolean not null default true;

update public.brands
set slug = regexp_replace(
  lower(coalesce(slug, name)),
  '[^a-z0-9]+',
  '-',
  'g'
)
where slug is null;

update public.brands
set slug = trim(both '-' from slug)
where slug is not null;

alter table public.brands
  alter column slug set not null;

create unique index if not exists brands_org_slug_idx
  on public.brands(organization_id, slug);

create index if not exists brands_commerce_order_idx
  on public.brands(organization_id, sort_order);
