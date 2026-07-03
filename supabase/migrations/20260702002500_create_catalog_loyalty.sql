create table if not exists public.catalog_loyalty_accounts (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id),
  customer_email text not null,
  points_balance integer not null default 0,
  tier text not null default 'basic',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.catalog_loyalty_movements (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id),
  loyalty_account_id uuid not null references public.catalog_loyalty_accounts(id) on delete cascade,
  type text not null,
  points integer not null,
  reference_type text,
  reference_id uuid,
  notes text,
  created_at timestamptz not null default now(),
  constraint catalog_loyalty_movements_type_check
    check (type in ('earn', 'redeem', 'adjust'))
);

create unique index if not exists catalog_loyalty_accounts_email_idx
  on public.catalog_loyalty_accounts(organization_id, customer_email);

create index if not exists catalog_loyalty_movements_account_idx
  on public.catalog_loyalty_movements(loyalty_account_id);

alter table public.catalog_loyalty_accounts enable row level security;
alter table public.catalog_loyalty_movements enable row level security;
