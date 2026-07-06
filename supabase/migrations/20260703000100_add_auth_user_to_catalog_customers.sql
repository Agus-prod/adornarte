alter table public.catalog_customers
  add column if not exists auth_user_id uuid;

create unique index if not exists catalog_customers_org_auth_user_idx
  on public.catalog_customers(organization_id, auth_user_id)
  where auth_user_id is not null;
