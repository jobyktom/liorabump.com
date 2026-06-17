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

drop policy if exists "Family members can read families" on public.families;
drop policy if exists "Family members are readable by members" on public.family_members;
drop policy if exists "Family members can manage appointments" on public.appointments;
drop policy if exists "Family members can manage health entries" on public.health_entries;
drop policy if exists "Family members can manage journal entries" on public.journal_entries;
drop policy if exists "Family members can manage media assets" on public.media_assets;
drop policy if exists "Family members can manage milestones" on public.baby_milestones;

create policy "Family members can read families" on public.families
for select using (public.is_family_member(id));

create policy "Family members are readable by members" on public.family_members
for select using (
  profile_id = auth.uid()
  or public.is_family_member(family_id)
);

create policy "Family members can manage appointments" on public.appointments
for all using (public.is_family_member(family_id))
with check (public.is_family_member(family_id));

create policy "Family members can manage health entries" on public.health_entries
for all using (public.is_family_member(family_id))
with check (public.is_family_member(family_id));

create policy "Family members can manage journal entries" on public.journal_entries
for all using (public.is_family_member(family_id))
with check (public.is_family_member(family_id));

create policy "Family members can manage media assets" on public.media_assets
for all using (public.is_family_member(family_id))
with check (public.is_family_member(family_id));

create policy "Family members can manage milestones" on public.baby_milestones
for all using (public.is_family_member(family_id))
with check (public.is_family_member(family_id));
