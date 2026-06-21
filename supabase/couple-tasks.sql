create table if not exists public.couple_tasks (
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

alter table public.couple_tasks enable row level security;

drop policy if exists "Family members can manage couple tasks" on public.couple_tasks;

create policy "Family members can manage couple tasks" on public.couple_tasks for all using (
  public.is_family_member(family_id)
) with check (
  public.is_family_member(family_id)
);
