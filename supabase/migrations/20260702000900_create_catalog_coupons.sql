create table if not exists public.catalog_coupons (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id),
  code text not null,
  name text not null,
  type text not null,
  value numeric(12, 2) not null default 0,
  minimum_subtotal numeric(12, 2) not null default 0,
  usage_limit integer,
  used_count integer not null default 0,
  starts_at timestamptz,
  expires_at timestamptz,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint catalog_coupons_type_check
    check (type in ('percent', 'amount', 'free_shipping'))
);

create unique index if not exists catalog_coupons_org_code_idx
  on public.catalog_coupons(organization_id, code);

create index if not exists catalog_coupons_active_idx
  on public.catalog_coupons(organization_id, is_active);

alter table public.catalog_coupons enable row level security;
