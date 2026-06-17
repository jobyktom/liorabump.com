"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type { PrivacyLevel, UserRole } from "@/lib/database.types";
import { getCurrentFamily } from "@/lib/app-data";
import { parseStoragePath } from "@/lib/media";
import { createClient } from "@/lib/supabase/server";

const roles: UserRole[] = ["mother", "partner", "family_viewer", "admin", "sponsor"];
const privacyLevels: PrivacyLevel[] = ["private", "partner", "family"];

export async function updateAccountSettings(formData: FormData) {
  const current = await getCurrentFamily();
  if (!current) return;

  const supabase = await createClient();
  const fullName = String(formData.get("full_name") ?? "").trim() || null;
  const country = String(formData.get("country") ?? "").trim() || null;
  const role = parseEnum(formData.get("role"), roles, "mother");
  const babyNickname = String(formData.get("baby_nickname") ?? "").trim();
  const dueDate = String(formData.get("due_date") ?? "").trim() || null;
  const privacyLevel = parseEnum(formData.get("privacy_level"), privacyLevels, "private");

  await supabase
    .from("profiles")
    .update({
      full_name: fullName,
      role,
      country
    })
    .eq("id", current.userId);

  if (current.userId === current.family.owner_id && babyNickname) {
    await supabase
      .from("families")
      .update({
        baby_nickname: babyNickname,
        due_date: dueDate,
        country,
        privacy_level: privacyLevel
      })
      .eq("id", current.family.id)
      .eq("owner_id", current.userId);
  }

  revalidateSettings();
}

export async function createFamilyInvite(formData: FormData) {
  const current = await getCurrentFamily();
  if (!current || current.userId !== current.family.owner_id) return;

  const invitedEmail = String(formData.get("invited_email") ?? "").trim().toLowerCase();
  if (!invitedEmail || !invitedEmail.includes("@")) return;

  const supabase = await createClient();
  await supabase.from("partner_invites").insert({
    family_id: current.family.id,
    invited_email: invitedEmail,
    invited_by: current.userId
  });

  revalidateSettings();
}

export async function cancelFamilyInvite(formData: FormData) {
  const current = await getCurrentFamily();
  if (!current || current.userId !== current.family.owner_id) return;

  const inviteId = String(formData.get("invite_id") ?? "");
  if (!inviteId) return;

  const supabase = await createClient();
  await supabase.from("partner_invites").delete().eq("id", inviteId).eq("family_id", current.family.id);
  revalidateSettings();
}

export async function removeFamilyMember(formData: FormData) {
  const current = await getCurrentFamily();
  if (!current || current.userId !== current.family.owner_id) return;

  const profileId = String(formData.get("profile_id") ?? "");
  if (!profileId || profileId === current.family.owner_id) return;

  const supabase = await createClient();
  await supabase.from("family_members").delete().eq("family_id", current.family.id).eq("profile_id", profileId);
  revalidateSettings();
}

export async function deleteWorkspaceData(formData: FormData) {
  const current = await getCurrentFamily();
  if (!current || current.userId !== current.family.owner_id) return;

  const confirmation = String(formData.get("confirmation") ?? "");
  if (confirmation !== "DELETE") return;

  const supabase = await createClient();
  const { data: media } = await supabase
    .from("media_assets")
    .select("storage_path")
    .eq("family_id", current.family.id);

  const filesByBucket = new Map<string, string[]>();
  for (const item of media ?? []) {
    const parsed = parseStoragePath(item.storage_path);
    if (!parsed) continue;
    filesByBucket.set(parsed.bucket, [...(filesByBucket.get(parsed.bucket) ?? []), parsed.filePath]);
  }

  for (const [bucket, filePaths] of Array.from(filesByBucket.entries())) {
    await supabase.storage.from(bucket).remove(filePaths);
  }

  await supabase.from("families").delete().eq("id", current.family.id).eq("owner_id", current.userId);
  await supabase.from("profiles").delete().eq("id", current.userId);
  await supabase.auth.signOut();
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
