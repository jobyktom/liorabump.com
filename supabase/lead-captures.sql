create table if not exists public.lead_captures (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  source text not null,
  marketing_consent boolean not null default false,
  created_at timestamptz not null default now(),
  unique (email, source)
);

alter table public.lead_captures enable row level security;
