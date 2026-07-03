create table if not exists public.catalog_notifications (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id),
  channel text not null,
  recipient text not null,
  subject text,
  body text not null,
  status text not null default 'pending',
  reference_type text,
  reference_id uuid,
  sent_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint catalog_notifications_channel_check
    check (channel in ('email', 'whatsapp', 'sms', 'push')),
  constraint catalog_notifications_status_check
    check (status in ('pending', 'sent', 'failed'))
);

create index if not exists catalog_notifications_status_idx
  on public.catalog_notifications(organization_id, status);

alter table public.catalog_notifications enable row level security;
