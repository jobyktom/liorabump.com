"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type { PrivacyLevel, UserRole } from "@/lib/database.types";
import { createClient } from "@/lib/supabase/server";

export type OnboardingState = {
  ok: boolean;
  message: string;
};

const roles: UserRole[] = ["mother", "partner", "family_viewer", "admin", "sponsor"];
const privacyLevels: PrivacyLevel[] = ["private", "partner", "family"];

export async function saveOnboarding(_state: OnboardingState, formData: FormData): Promise<OnboardingState> {
  let supabase;

  try {
    supabase = await createClient();
  } catch {
    return {
      ok: false,
      message: "Supabase is not configured yet. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY."
    };
  }

  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user?.email) {
    return {
      ok: false,
      message: "Please create an account or sign in before saving your journey."
    };
  }

  const role = parseEnum(formData.get("role"), roles, "mother");
  const privacy = parseEnum(formData.get("privacy_level"), privacyLevels, "private");
  const country = String(formData.get("country") ?? "").trim();
  const babyNickname = String(formData.get("baby_nickname") ?? "").trim();
  const dueDate = String(formData.get("due_date") ?? "").trim() || null;
  const invitePartnerEmail = String(formData.get("invite_partner_email") ?? "").trim() || null;

  if (!country || !babyNickname) {
    return { ok: false, message: "Please add country and baby nickname." };
  }

  const { error: profileError } = await supabase.from("profiles").upsert({
    id: user.id,
    email: user.email,
    full_name: user.user_metadata?.full_name ?? null,
    role,
    country
  });

  if (profileError) {
    return { ok: false, message: profileError.message };
  }

  const { data: family, error: familyError } = await supabase
    .from("families")
    .insert({
      owner_id: user.id,
      baby_nickname: babyNickname,
      due_date: dueDate,
      country,
      privacy_level: privacy
    })
    .select("id")
    .single();

  if (familyError || !family) {
    return { ok: false, message: familyError?.message ?? "Could not create family journey." };
  }

  const { error: memberError } = await supabase.from("family_members").insert({
    family_id: family.id,
    profile_id: user.id,
    member_role: role,
    consent_granted_at: new Date().toISOString()
  });

  if (memberError) {
    return { ok: false, message: memberError.message };
  }

  if (invitePartnerEmail) {
    const { error: inviteError } = await supabase.from("partner_invites").insert({
      family_id: family.id,
      invited_email: invitePartnerEmail,
      invited_by: user.id
    });

    if (inviteError) {
      return { ok: false, message: inviteError.message };
    }
  }

  revalidatePath("/app");
  redirect("/app");
}

function parseEnum<T extends string>(value: FormDataEntryValue | null, allowed: readonly T[], fallback: T): T {
  const stringValue = String(value ?? "");
  return allowed.includes(stringValue as T) ? (stringValue as T) : fallback;
}
