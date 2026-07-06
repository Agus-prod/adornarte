create or replace function public.current_profile_organization_id()
returns uuid
language sql
stable
security definer
set search_path = public
as $$
  select profiles.organization_id
  from public.profiles
  where profiles.id = auth.uid()
    and coalesce(profiles.is_active, true)
  limit 1;
$$;

revoke all on function public.current_profile_organization_id()
  from public;
grant execute on function public.current_profile_organization_id()
  to authenticated;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create or replace function public.assign_sales_invoice_number()
returns trigger
language plpgsql
set search_path = public
as $$
declare
  next_number integer;
begin
  if new.invoice_number is not null then
    return new;
  end if;

  perform pg_advisory_xact_lock(
    hashtext(new.organization_id::text)
  );

  select coalesce(
    max(nullif(regexp_replace(invoice_number, '[^0-9]', '', 'g'), '')::integer),
    0
  ) + 1
  into next_number
  from public.sales
  where organization_id = new.organization_id;

  new.invoice_number := lpad(next_number::text, 4, '0');

  return new;
end;
$$;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (
    id,
    email,
    full_name,
    role
  )
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', ''),
    'employee'
  );

  return new;
end;
$$;

revoke execute on function public.handle_new_user()
  from anon, authenticated;

create or replace function public.receive_purchase_order(
  p_purchase_order_id uuid,
  p_received_by uuid
)
returns void
language plpgsql
set search_path = public
as $$
declare
  v_order record;
  v_item record;
begin
  select *
  into v_order
  from public.purchase_orders
  where id = p_purchase_order_id;

  if not found then
    raise exception 'La orden no existe.';
  end if;

  if v_order.status <> 'sent' then
    raise exception 'La orden no esta pendiente de recepcion.';
  end if;

  if not exists (
    select 1
    from public.purchase_order_items
    where purchase_order_id = p_purchase_order_id
  ) then
    raise exception 'La orden no tiene productos.';
  end if;

  for v_item in
    select *
    from public.purchase_order_items
    where purchase_order_id = p_purchase_order_id
  loop
    update public.products
    set
      stock = stock + v_item.quantity,
      cost_price = v_item.cost_price,
      updated_at = now()
    where id = v_item.product_id;

    insert into public.stock_movements (
      organization_id,
      product_id,
      movement_type,
      quantity,
      created_by,
      notes,
      reference_id,
      reference_type
    )
    values (
      v_order.organization_id,
      v_item.product_id,
      'PURCHASE_IN',
      v_item.quantity,
      p_received_by,
      concat(
        'Recepcion de orden ',
        coalesce(v_order.number, '')
      ),
      p_purchase_order_id,
      'PURCHASE_ORDER'
    );
  end loop;

  update public.purchase_orders
  set
    status = 'received',
    received_at = now(),
    received_by = p_received_by,
    updated_at = now()
  where id = p_purchase_order_id;
end;
$$;

alter table public.organizations enable row level security;
alter table public.profiles enable row level security;
alter table public.branches enable row level security;
alter table public.products enable row level security;
alter table public.product_variants enable row level security;
alter table public.categories enable row level security;
alter table public.brands enable row level security;
alter table public.customers enable row level security;
alter table public.customer_payments enable row level security;
alter table public.sales enable row level security;
alter table public.sale_items enable row level security;
alter table public.sale_payments enable row level security;
alter table public.cash_closings enable row level security;
alter table public.cash_movements enable row level security;
alter table public.stock_movements enable row level security;

drop policy if exists "Authenticated users can manage their organization"
  on public.organizations;
create policy "Authenticated users can manage their organization"
  on public.organizations
  for all
  to authenticated
  using (id = public.current_profile_organization_id())
  with check (id = public.current_profile_organization_id());

drop policy if exists "Authenticated users can read organization profiles"
  on public.profiles;
create policy "Authenticated users can read organization profiles"
  on public.profiles
  for select
  to authenticated
  using (
    id = auth.uid()
    or organization_id = public.current_profile_organization_id()
  );

drop policy if exists "Authenticated users can update organization profiles"
  on public.profiles;
create policy "Authenticated users can update organization profiles"
  on public.profiles
  for update
  to authenticated
  using (
    id = auth.uid()
    or organization_id = public.current_profile_organization_id()
  )
  with check (
    id = auth.uid()
    or organization_id = public.current_profile_organization_id()
  );

drop policy if exists "Authenticated users can insert organization profiles"
  on public.profiles;
create policy "Authenticated users can insert organization profiles"
  on public.profiles
  for insert
  to authenticated
  with check (
    organization_id = public.current_profile_organization_id()
  );

drop policy if exists "Authenticated users can manage branches"
  on public.branches;
create policy "Authenticated users can manage branches"
  on public.branches
  for all
  to authenticated
  using (organization_id = public.current_profile_organization_id())
  with check (organization_id = public.current_profile_organization_id());

drop policy if exists "Authenticated users can manage products"
  on public.products;
create policy "Authenticated users can manage products"
  on public.products
  for all
  to authenticated
  using (organization_id = public.current_profile_organization_id())
  with check (organization_id = public.current_profile_organization_id());

drop policy if exists "Authenticated users can manage product variants"
  on public.product_variants;
create policy "Authenticated users can manage product variants"
  on public.product_variants
  for all
  to authenticated
  using (organization_id = public.current_profile_organization_id())
  with check (organization_id = public.current_profile_organization_id());

drop policy if exists "Authenticated users can manage categories"
  on public.categories;
create policy "Authenticated users can manage categories"
  on public.categories
  for all
  to authenticated
  using (organization_id = public.current_profile_organization_id())
  with check (organization_id = public.current_profile_organization_id());

drop policy if exists "Authenticated users can manage brands"
  on public.brands;
create policy "Authenticated users can manage brands"
  on public.brands
  for all
  to authenticated
  using (organization_id = public.current_profile_organization_id())
  with check (organization_id = public.current_profile_organization_id());

drop policy if exists "Authenticated users can manage customers"
  on public.customers;
create policy "Authenticated users can manage customers"
  on public.customers
  for all
  to authenticated
  using (organization_id = public.current_profile_organization_id())
  with check (organization_id = public.current_profile_organization_id());

drop policy if exists "Authenticated users can manage customer payments"
  on public.customer_payments;
create policy "Authenticated users can manage customer payments"
  on public.customer_payments
  for all
  to authenticated
  using (organization_id = public.current_profile_organization_id())
  with check (organization_id = public.current_profile_organization_id());

drop policy if exists "Authenticated users can manage sales"
  on public.sales;
create policy "Authenticated users can manage sales"
  on public.sales
  for all
  to authenticated
  using (organization_id = public.current_profile_organization_id())
  with check (organization_id = public.current_profile_organization_id());

drop policy if exists "Authenticated users can manage sale items"
  on public.sale_items;
create policy "Authenticated users can manage sale items"
  on public.sale_items
  for all
  to authenticated
  using (
    exists (
      select 1
      from public.sales
      where sales.id = sale_items.sale_id
        and sales.organization_id = public.current_profile_organization_id()
    )
  )
  with check (
    exists (
      select 1
      from public.sales
      where sales.id = sale_items.sale_id
        and sales.organization_id = public.current_profile_organization_id()
    )
  );

drop policy if exists "Authenticated users can manage sale payments"
  on public.sale_payments;
create policy "Authenticated users can manage sale payments"
  on public.sale_payments
  for all
  to authenticated
  using (organization_id = public.current_profile_organization_id())
  with check (organization_id = public.current_profile_organization_id());

drop policy if exists "Authenticated users can manage cash closings"
  on public.cash_closings;
create policy "Authenticated users can manage cash closings"
  on public.cash_closings
  for all
  to authenticated
  using (organization_id = public.current_profile_organization_id())
  with check (organization_id = public.current_profile_organization_id());

drop policy if exists "Authenticated users can manage cash movements"
  on public.cash_movements;
create policy "Authenticated users can manage cash movements"
  on public.cash_movements
  for all
  to authenticated
  using (organization_id = public.current_profile_organization_id())
  with check (organization_id = public.current_profile_organization_id());

drop policy if exists "Authenticated users can manage stock movements"
  on public.stock_movements;
create policy "Authenticated users can manage stock movements"
  on public.stock_movements
  for all
  to authenticated
  using (organization_id = public.current_profile_organization_id())
  with check (organization_id = public.current_profile_organization_id());
