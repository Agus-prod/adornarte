create table if not exists public.catalog_settings (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id),
  shop_name text not null default 'AdornArte Shop',
  shop_tagline text,
  shop_description text,
  billing_name text,
  billing_rtn text,
  billing_address text,
  billing_email text,
  billing_phone text,
  whatsapp_number text,
  order_whatsapp_recipient text,
  bank_accounts jsonb not null default '[]'::jsonb,
  checkout_notes text,
  privacy_policy_url text,
  terms_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index if not exists catalog_settings_organization_id_idx
  on public.catalog_settings(organization_id);

alter table public.catalog_settings enable row level security;
