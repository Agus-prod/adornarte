alter table public.catalog_payments
  add column if not exists receipt_image_path text;

insert into storage.buckets (id, name, public)
values (
  'catalog-payment-receipts',
  'catalog-payment-receipts',
  false
)
on conflict (id) do update
set public = excluded.public;
