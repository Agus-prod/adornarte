alter table public.customers
  add column if not exists is_active boolean not null default true;

create index if not exists customers_organization_active_idx
  on public.customers(organization_id, is_active);
