create table if not exists public.catalog_marketplace_feeds (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id),
  channel text not null,
  name text not null,
  is_active boolean not null default true,
  last_generated_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint catalog_marketplace_feeds_channel_check
    check (channel in ('facebook', 'instagram', 'google_shopping', 'tiktok_shop'))
);

create unique index if not exists catalog_marketplace_feeds_org_channel_idx
  on public.catalog_marketplace_feeds(organization_id, channel);

alter table public.catalog_marketplace_feeds enable row level security;
