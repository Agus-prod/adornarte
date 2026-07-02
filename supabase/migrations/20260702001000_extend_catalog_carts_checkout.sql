alter table public.catalog_carts
  add column if not exists customer_name text,
  add column if not exists customer_phone text,
  add column if not exists shipping_address text,
  add column if not exists shipping_city text,
  add column if not exists shipping_notes text,
  add column if not exists payment_method text;
