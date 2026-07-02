create table if not exists public.catalog_customers (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id),
  email text not null,
  name text not null,
  phone text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.catalog_customer_addresses (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id),
  customer_id uuid not null references public.catalog_customers(id) on delete cascade,
  label text not null default 'Principal',
  recipient_name text not null,
  phone text,
  address text not null,
  city text not null,
  notes text,
  is_default boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index if not exists catalog_customers_org_email_idx
  on public.catalog_customers(organization_id, email);

create index if not exists catalog_customer_addresses_customer_id_idx
  on public.catalog_customer_addresses(customer_id);

alter table public.catalog_customers enable row level security;
alter table public.catalog_customer_addresses enable row level security;
