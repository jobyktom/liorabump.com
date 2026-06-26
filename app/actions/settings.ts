"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type { PrivacyLevel, UserRole } from "@/lib/database.types";
import { getCurrentFamily } from "@/lib/app-data";
import { parseStoragePath } from "@/lib/media";
import { getPrisma } from "@/lib/prisma";
import { createAdminClient } from "@/lib/supabase/admin";

const roles: UserRole[] = ["mother", "partner", "family_viewer", "admin", "sponsor"];
const privacyLevels: PrivacyLevel[] = ["private", "partner", "family"];

export async function updateAccountSettings(formData: FormData) {
  const current = await getCurrentFamily();
  if (!current) return;

  const prisma = getPrisma();
  const fullName = String(formData.get("full_name") ?? "").trim() || null;
  const country = String(formData.get("country") ?? "").trim() || null;
  const role = parseEnum(formData.get("role"), roles, "mother");
  const babyNickname = String(formData.get("baby_nickname") ?? "").trim();
  const dueDate = String(formData.get("due_date") ?? "").trim() || null;
  const privacyLevel = parseEnum(formData.get("privacy_level"), privacyLevels, "private");

  await prisma.user.update({
    where: { id: current.userId },
    data: {
      name: fullName,
      role,
      country
    }
  });

  if (current.userId === current.family.owner_id && babyNickname) {
    await prisma.family.update({
      where: { id: current.family.id },
      data: {
        babyNickname,
        dueDate: dueDate ? new Date(`${dueDate}T00:00:00`) : null,
        country,
        privacyLevel
      }
    });
  }

  revalidateSettings();
}

export async function createFamilyInvite(formData: FormData) {
  const current = await getCurrentFamily();
  if (!current || current.userId !== current.family.owner_id) return;

  const invitedEmail = String(formData.get("invited_email") ?? "").trim().toLowerCase();
  if (!invitedEmail || !invitedEmail.includes("@")) return;

  const prisma = getPrisma();
  await prisma.partnerInvite.create({
    data: {
      familyId: current.family.id,
      invitedEmail,
      invitedBy: current.userId
    }
  });

  revalidateSettings();
}

export async function cancelFamilyInvite(formData: FormData) {
  const current = await getCurrentFamily();
  if (!current || current.userId !== current.family.owner_id) return;

  const inviteId = String(formData.get("invite_id") ?? "");
  if (!inviteId) return;

  const prisma = getPrisma();
  await prisma.partnerInvite.deleteMany({ where: { id: inviteId, familyId: current.family.id } });
  revalidateSettings();
}

export async function removeFamilyMember(formData: FormData) {
  const current = await getCurrentFamily();
  if (!current || current.userId !== current.family.owner_id) return;

  const profileId = String(formData.get("profile_id") ?? "");
  if (!profileId || profileId === current.family.owner_id) return;

  const prisma = getPrisma();
  await prisma.familyMember.deleteMany({ where: { familyId: current.family.id, profileId } });
  revalidateSettings();
}

export async function deleteWorkspaceData(formData: FormData) {
  const current = await getCurrentFamily();
  if (!current || current.userId !== current.family.owner_id) return;

  const confirmation = String(formData.get("confirmation") ?? "");
  if (confirmation !== "DELETE") return;

  const prisma = getPrisma();
  const media = await prisma.mediaAsset.findMany({
    where: { familyId: current.family.id },
    select: { storagePath: true }
  });

  const filesByBucket = new Map<string, string[]>();
  for (const item of media ?? []) {
    const parsed = parseStoragePath(item.storagePath);
    if (!parsed) continue;
    filesByBucket.set(parsed.bucket, [...(filesByBucket.get(parsed.bucket) ?? []), parsed.filePath]);
  }

  if (filesByBucket.size > 0) {
    const supabase = createAdminClient();
    for (const [bucket, filePaths] of Array.from(filesByBucket.entries())) {
      await supabase.storage.from(bucket).remove(filePaths);
    }
  }

  await prisma.family.deleteMany({ where: { id: current.family.id, ownerId: current.userId } });
  await prisma.user.delete({ where: { id: current.userId } });
  redirect("/signup");
}

function parseEnum<T extends string>(value: FormDataEntryValue | null, allowed: readonly T[], fallback: T): T {
  const stringValue = String(value ?? "");
  return allowed.includes(stringValue as T) ? (stringValue as T) : fallback;
}

function revalidateSettings() {
  revalidatePath("/app");
  revalidatePath("/app/settings");
}
