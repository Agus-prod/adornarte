alter table public.catalog_coupons
  add column if not exists customer_id uuid references public.customers(id) on delete set null;

create index if not exists catalog_coupons_customer_id_idx
  on public.catalog_coupons(organization_id, customer_id);
