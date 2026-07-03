create table if not exists public.catalog_gift_cards (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id),
  code text not null,
  initial_balance numeric(12, 2) not null default 0,
  current_balance numeric(12, 2) not null default 0,
  recipient_email text,
  purchaser_email text,
  status text not null default 'active',
  expires_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint catalog_gift_cards_status_check
    check (status in ('active', 'redeemed', 'expired', 'cancelled'))
);

create unique index if not exists catalog_gift_cards_org_code_idx
  on public.catalog_gift_cards(organization_id, code);

alter table public.catalog_gift_cards enable row level security;
