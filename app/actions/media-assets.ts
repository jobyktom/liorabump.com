"use server";

import { revalidatePath } from "next/cache";
import { getCurrentFamily } from "@/lib/app-data";
import { parseStoragePath } from "@/lib/media";
import { createClient } from "@/lib/supabase/server";

export async function renameMediaAsset(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  const caption = String(formData.get("caption") ?? "").trim();
  const section = String(formData.get("section") ?? "app");

  if (!id || !caption) return;

  const current = await getCurrentFamily();
  if (!current) return;

  const supabase = await createClient();
  const { data: asset } = await supabase.from("media_assets").select("id,family_id").eq("id", id).maybeSingle();

  if (!asset || asset.family_id !== current.family.id) return;

  await supabase.from("media_assets").update({ caption }).eq("id", id).eq("family_id", current.family.id);
  revalidatePath("/app");
  revalidatePath(`/app/${section}`);
}

export async function deleteMediaAsset(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  const section = String(formData.get("section") ?? "app");

  if (!id) return;

  const current = await getCurrentFamily();
  if (!current) return;

  const supabase = await createClient();
  const { data: asset } = await supabase
    .from("media_assets")
    .select("id,family_id,storage_path")
    .eq("id", id)
    .maybeSingle();

  if (!asset || asset.family_id !== current.family.id) return;

  const parsed = parseStoragePath(asset.storage_path);
  if (parsed) {
    await supabase.storage.from(parsed.bucket).remove([parsed.filePath]);
  }

  await supabase.from("media_assets").delete().eq("id", id).eq("family_id", current.family.id);
  revalidatePath("/app");
  revalidatePath(`/app/${section}`);
}
