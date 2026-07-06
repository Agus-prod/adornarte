alter table public.catalog_orders
  add column if not exists sale_id uuid references public.sales(id) on delete set null;

create index if not exists catalog_orders_sale_id_idx
  on public.catalog_orders(sale_id);
