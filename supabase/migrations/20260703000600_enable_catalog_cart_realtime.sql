do $$
begin
  alter publication supabase_realtime
    add table public.catalog_carts;
exception
  when duplicate_object then
    null;
end;
$$;

do $$
begin
  alter publication supabase_realtime
    add table public.catalog_cart_items;
exception
  when duplicate_object then
    null;
end;
$$;
