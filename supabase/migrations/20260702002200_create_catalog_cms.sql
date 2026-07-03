create table if not exists public.catalog_cms_pages (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id),
  slug text not null,
  title text not null,
  type text not null default 'page',
  content text,
  banner_url text,
  meta_title text,
  meta_description text,
  is_published boolean not null default false,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint catalog_cms_pages_type_check
    check (type in ('landing', 'banner', 'page', 'blog'))
);

create unique index if not exists catalog_cms_pages_org_slug_idx
  on public.catalog_cms_pages(organization_id, slug);

create index if not exists catalog_cms_pages_published_idx
  on public.catalog_cms_pages(organization_id, is_published);

alter table public.catalog_cms_pages enable row level security;
