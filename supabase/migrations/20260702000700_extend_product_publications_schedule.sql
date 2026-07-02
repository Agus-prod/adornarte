alter table public.product_publications
  add column if not exists expires_at timestamptz;

alter table public.product_publications
  drop constraint if exists product_publications_status_check;

alter table public.product_publications
  add constraint product_publications_status_check
    check (status in ('draft', 'published', 'hidden', 'scheduled'));

create index if not exists product_publications_visibility_idx
  on public.product_publications(
    organization_id,
    status,
    is_visible,
    published_at,
    expires_at
  );
