create schema if not exists app_private;

revoke all on schema app_private from public;
grant usage on schema app_private to authenticated;

create or replace function app_private.current_profile_organization_id()
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

revoke all on function app_private.current_profile_organization_id()
  from public, anon;
grant execute on function app_private.current_profile_organization_id()
  to authenticated;

drop policy if exists "Authenticated users can manage their organization"
  on public.organizations;
create policy "Authenticated users can manage their organization"
  on public.organizations
  for all
  to authenticated
  using (id = app_private.current_profile_organization_id())
  with check (id = app_private.current_profile_organization_id());

drop policy if exists "Authenticated users can read organization profiles"
  on public.profiles;
create policy "Authenticated users can read organization profiles"
  on public.profiles
  for select
  to authenticated
  using (
    id = auth.uid()
    or organization_id = app_private.current_profile_organization_id()
  );

drop policy if exists "Authenticated users can update organization profiles"
  on public.profiles;
create policy "Authenticated users can update organization profiles"
  on public.profiles
  for update
  to authenticated
  using (
    id = auth.uid()
    or organization_id = app_private.current_profile_organization_id()
  )
  with check (
    id = auth.uid()
    or organization_id = app_private.current_profile_organization_id()
  );

drop policy if exists "Authenticated users can insert organization profiles"
  on public.profiles;
create policy "Authenticated users can insert organization profiles"
  on public.profiles
  for insert
  to authenticated
  with check (
    organization_id = app_private.current_profile_organization_id()
  );

drop policy if exists "Authenticated users can manage branches"
  on public.branches;
create policy "Authenticated users can manage branches"
  on public.branches
  for all
  to authenticated
  using (organization_id = app_private.current_profile_organization_id())
  with check (organization_id = app_private.current_profile_organization_id());

drop policy if exists "Authenticated users can manage products"
  on public.products;
create policy "Authenticated users can manage products"
  on public.products
  for all
  to authenticated
  using (organization_id = app_private.current_profile_organization_id())
  with check (organization_id = app_private.current_profile_organization_id());

drop policy if exists "Authenticated users can manage product variants"
  on public.product_variants;
create policy "Authenticated users can manage product variants"
  on public.product_variants
  for all
  to authenticated
  using (organization_id = app_private.current_profile_organization_id())
  with check (organization_id = app_private.current_profile_organization_id());

drop policy if exists "Authenticated users can manage categories"
  on public.categories;
create policy "Authenticated users can manage categories"
  on public.categories
  for all
  to authenticated
  using (organization_id = app_private.current_profile_organization_id())
  with check (organization_id = app_private.current_profile_organization_id());

drop policy if exists "Authenticated users can manage brands"
  on public.brands;
create policy "Authenticated users can manage brands"
  on public.brands
  for all
  to authenticated
  using (organization_id = app_private.current_profile_organization_id())
  with check (organization_id = app_private.current_profile_organization_id());

drop policy if exists "Authenticated users can manage customers"
  on public.customers;
create policy "Authenticated users can manage customers"
  on public.customers
  for all
  to authenticated
  using (organization_id = app_private.current_profile_organization_id())
  with check (organization_id = app_private.current_profile_organization_id());

drop policy if exists "Authenticated users can manage customer payments"
  on public.customer_payments;
create policy "Authenticated users can manage customer payments"
  on public.customer_payments
  for all
  to authenticated
  using (organization_id = app_private.current_profile_organization_id())
  with check (organization_id = app_private.current_profile_organization_id());

drop policy if exists "Authenticated users can manage sales"
  on public.sales;
create policy "Authenticated users can manage sales"
  on public.sales
  for all
  to authenticated
  using (organization_id = app_private.current_profile_organization_id())
  with check (organization_id = app_private.current_profile_organization_id());

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
        and sales.organization_id = app_private.current_profile_organization_id()
    )
  )
  with check (
    exists (
      select 1
      from public.sales
      where sales.id = sale_items.sale_id
        and sales.organization_id = app_private.current_profile_organization_id()
    )
  );

drop policy if exists "Authenticated users can manage sale payments"
  on public.sale_payments;
create policy "Authenticated users can manage sale payments"
  on public.sale_payments
  for all
  to authenticated
  using (organization_id = app_private.current_profile_organization_id())
  with check (organization_id = app_private.current_profile_organization_id());

drop policy if exists "Authenticated users can manage cash closings"
  on public.cash_closings;
create policy "Authenticated users can manage cash closings"
  on public.cash_closings
  for all
  to authenticated
  using (organization_id = app_private.current_profile_organization_id())
  with check (organization_id = app_private.current_profile_organization_id());

drop policy if exists "Authenticated users can manage cash movements"
  on public.cash_movements;
create policy "Authenticated users can manage cash movements"
  on public.cash_movements
  for all
  to authenticated
  using (organization_id = app_private.current_profile_organization_id())
  with check (organization_id = app_private.current_profile_organization_id());

drop policy if exists "Authenticated users can manage stock movements"
  on public.stock_movements;
create policy "Authenticated users can manage stock movements"
  on public.stock_movements
  for all
  to authenticated
  using (organization_id = app_private.current_profile_organization_id())
  with check (organization_id = app_private.current_profile_organization_id());

drop function if exists public.current_profile_organization_id();

revoke execute on function public.handle_new_user()
  from public, anon, authenticated;
