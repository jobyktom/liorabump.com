"use server";

import { revalidatePath } from "next/cache";
import { getCurrentFamily } from "@/lib/app-data";
import { parseStoragePath } from "@/lib/media";
import { getPrisma } from "@/lib/prisma";
import { createAdminClient } from "@/lib/supabase/admin";

export async function renameMediaAsset(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  const caption = String(formData.get("caption") ?? "").trim();
  const section = String(formData.get("section") ?? "app");

  if (!id || !caption) return;

  const current = await getCurrentFamily();
  if (!current) return;

  const prisma = getPrisma();
  const asset = await prisma.mediaAsset.findFirst({
    where: { id, familyId: current.family.id },
    select: { id: true }
  });

  if (!asset) return;

  await prisma.mediaAsset.update({ where: { id }, data: { caption } });
  revalidatePath("/app");
  revalidatePath(`/app/${section}`);
}

export async function deleteMediaAsset(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  const section = String(formData.get("section") ?? "app");

  if (!id) return;

  const current = await getCurrentFamily();
  if (!current) return;

  const prisma = getPrisma();
  const asset = await prisma.mediaAsset.findFirst({
    where: { id, familyId: current.family.id },
    select: { id: true, storagePath: true }
  });

  if (!asset) return;

  const parsed = parseStoragePath(asset.storagePath);
  if (parsed) {
    const supabase = createAdminClient();
    await supabase.storage.from(parsed.bucket).remove([parsed.filePath]);
  }

  await prisma.mediaAsset.delete({ where: { id } });
  revalidatePath("/app");
  revalidatePath(`/app/${section}`);
}
