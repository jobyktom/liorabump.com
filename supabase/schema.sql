create extension if not exists "pgcrypto";

create type public.user_role as enum ('mother', 'partner', 'family_viewer', 'admin', 'sponsor');
create type public.privacy_level as enum ('private', 'partner', 'family');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null unique,
  full_name text,
  role public.user_role not null default 'mother',
  country text,
  created_at timestamptz not null default now()
);

create table public.families (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.profiles(id) on delete cascade,
  baby_nickname text not null,
  due_date date,
  country text,
  privacy_level public.privacy_level not null default 'private',
  subscription_plan text not null default 'free',
  stripe_customer_id text,
  stripe_subscription_id text,
  created_at timestamptz not null default now()
);

create table public.family_members (
  family_id uuid references public.families(id) on delete cascade,
  profile_id uuid references public.profiles(id) on delete cascade,
  member_role public.user_role not null,
  consent_granted_at timestamptz,
  primary key (family_id, profile_id)
);

create table public.partner_invites (
  id uuid primary key default gen_random_uuid(),
  family_id uuid not null references public.families(id) on delete cascade,
  invited_email text not null,
  invited_by uuid not null references public.profiles(id) on delete cascade,
  status text not null default 'pending',
  created_at timestamptz not null default now()
);

create table public.appointments (
  id uuid primary key default gen_random_uuid(),
  family_id uuid not null references public.families(id) on delete cascade,
  title text not null,
  appointment_type text,
  starts_at timestamptz not null,
  notes text,
  created_at timestamptz not null default now()
);

create table public.health_entries (
  id uuid primary key default gen_random_uuid(),
  family_id uuid not null references public.families(id) on delete cascade,
  entry_type text not null,
  value jsonb not null,
  recorded_at timestamptz not null default now()
);

create table public.journal_entries (
  id uuid primary key default gen_random_uuid(),
  family_id uuid not null references public.families(id) on delete cascade,
  author_id uuid not null references public.profiles(id) on delete cascade,
  title text,
  body text not null,
  pregnancy_week int,
  created_at timestamptz not null default now()
);

create table public.media_assets (
  id uuid primary key default gen_random_uuid(),
  family_id uuid not null references public.families(id) on delete cascade,
  owner_id uuid not null references public.profiles(id) on delete cascade,
  asset_type text not null check (asset_type in ('photo', 'video', 'scan', 'document', 'voice_note')),
  storage_path text not null,
  caption text,
  created_at timestamptz not null default now()
);

create table public.baby_milestones (
  id uuid primary key default gen_random_uuid(),
  family_id uuid not null references public.families(id) on delete cascade,
  title text not null,
  happened_on date,
  notes text,
  media_asset_id uuid references public.media_assets(id),
  created_at timestamptz not null default now()
);

create table public.couple_tasks (
  id uuid primary key default gen_random_uuid(),
  family_id uuid not null references public.families(id) on delete cascade,
  created_by uuid not null references public.profiles(id) on delete cascade,
  title text not null,
  notes text,
  due_date date,
  assignee_label text not null default 'Either of us',
  status text not null default 'todo' check (status in ('todo', 'in_progress', 'done')),
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;
alter table public.families enable row level security;
alter table public.family_members enable row level security;
alter table public.partner_invites enable row level security;
alter table public.appointments enable row level security;
alter table public.health_entries enable row level security;
alter table public.journal_entries enable row level security;
alter table public.media_assets enable row level security;
alter table public.baby_milestones enable row level security;
alter table public.couple_tasks enable row level security;

create or replace function public.is_family_member(target_family_id uuid)
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.family_members
    where family_members.family_id = target_family_id
    and family_members.profile_id = auth.uid()
  );
$$;

create policy "Users can read own profile" on public.profiles for select using (auth.uid() = id);
create policy "Users can upsert own profile" on public.profiles for insert with check (auth.uid() = id);
create policy "Users can update own profile" on public.profiles for update using (auth.uid() = id);

create policy "Family owners can manage families" on public.families for all using (auth.uid() = owner_id) with check (auth.uid() = owner_id);
create policy "Family members can read families" on public.families for select using (public.is_family_member(id));

create policy "Family members are readable by members" on public.family_members for select using (
  profile_id = auth.uid()
  or public.is_family_member(family_id)
);
create policy "Family owners can manage members" on public.family_members for all using (
  exists (
    select 1 from public.families
    where families.id = family_members.family_id
    and families.owner_id = auth.uid()
  )
) with check (
  exists (
    select 1 from public.families
    where families.id = family_members.family_id
    and families.owner_id = auth.uid()
  )
);

create policy "Family owners can manage invites" on public.partner_invites for all using (
  exists (
    select 1 from public.families
    where families.id = partner_invites.family_id
    and families.owner_id = auth.uid()
  )
) with check (
  exists (
    select 1 from public.families
    where families.id = partner_invites.family_id
    and families.owner_id = auth.uid()
  )
);

create policy "Family members can manage appointments" on public.appointments for all using (
  public.is_family_member(family_id)
) with check (
  public.is_family_member(family_id)
);

create policy "Family members can manage health entries" on public.health_entries for all using (
  public.is_family_member(family_id)
) with check (
  public.is_family_member(family_id)
);

create policy "Family members can manage journal entries" on public.journal_entries for all using (
  public.is_family_member(family_id)
) with check (
  public.is_family_member(family_id)
);

create policy "Family members can manage media assets" on public.media_assets for all using (
  public.is_family_member(family_id)
) with check (
  public.is_family_member(family_id)
);

create policy "Family members can manage milestones" on public.baby_milestones for all using (
  public.is_family_member(family_id)
) with check (
  public.is_family_member(family_id)
);

create policy "Family members can manage couple tasks" on public.couple_tasks for all using (
  public.is_family_member(family_id)
) with check (
  public.is_family_member(family_id)
);
