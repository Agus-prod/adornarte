alter table public.sales
  add column if not exists invoice_number text;

with numbered_sales as (
  select
    id,
    organization_id,
    lpad(
      row_number() over (
        partition by organization_id
        order by created_at nulls first, id
      )::text,
      4,
      '0'
    ) as next_invoice_number
  from public.sales
  where invoice_number is null
)
update public.sales as sales
set invoice_number =
  numbered_sales.next_invoice_number
from numbered_sales
where sales.id = numbered_sales.id;

create unique index if not exists sales_org_invoice_number_idx
  on public.sales(organization_id, invoice_number)
  where invoice_number is not null;

create or replace function public.assign_sales_invoice_number()
returns trigger
language plpgsql
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

drop trigger if exists assign_sales_invoice_number_trigger
  on public.sales;

create trigger assign_sales_invoice_number_trigger
before insert on public.sales
for each row
execute function public.assign_sales_invoice_number();
