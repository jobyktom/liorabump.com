insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  ('pregnancy-photos', 'pregnancy-photos', false, 10485760, array['image/jpeg', 'image/png', 'image/webp']),
  ('scan-uploads', 'scan-uploads', false, 20971520, array['image/jpeg', 'image/png', 'image/webp', 'application/pdf']),
  ('health-documents', 'health-documents', false, 20971520, array['application/pdf', 'image/jpeg', 'image/png', 'image/webp']),
  ('baby-albums', 'baby-albums', false, 10485760, array['image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do update
set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Family members can read private family files" on storage.objects;
drop policy if exists "Family members can upload private family files" on storage.objects;
drop policy if exists "Family members can update private family files" on storage.objects;
drop policy if exists "Family members can delete private family files" on storage.objects;

create policy "Family members can read private family files"
on storage.objects for select
using (
  bucket_id in ('pregnancy-photos', 'scan-uploads', 'health-documents', 'baby-albums')
  and public.is_family_member((storage.foldername(name))[1]::uuid)
);

create policy "Family members can upload private family files"
on storage.objects for insert
with check (
  bucket_id in ('pregnancy-photos', 'scan-uploads', 'health-documents', 'baby-albums')
  and public.is_family_member((storage.foldername(name))[1]::uuid)
);

create policy "Family members can update private family files"
on storage.objects for update
using (
  bucket_id in ('pregnancy-photos', 'scan-uploads', 'health-documents', 'baby-albums')
  and public.is_family_member((storage.foldername(name))[1]::uuid)
)
with check (
  bucket_id in ('pregnancy-photos', 'scan-uploads', 'health-documents', 'baby-albums')
  and public.is_family_member((storage.foldername(name))[1]::uuid)
);

create policy "Family members can delete private family files"
on storage.objects for delete
using (
  bucket_id in ('pregnancy-photos', 'scan-uploads', 'health-documents', 'baby-albums')
  and public.is_family_member((storage.foldername(name))[1]::uuid)
);
