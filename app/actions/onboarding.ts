"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { randomUUID } from "crypto";
import type { PrivacyLevel, UserRole } from "@/lib/database.types";
import { authOptions } from "@/auth";
import { execute } from "@/lib/mysql";
import { getServerSession } from "next-auth";

export type OnboardingState = {
  ok: boolean;
  message: string;
};

const roles: UserRole[] = ["mother", "partner", "family_viewer", "admin", "sponsor"];
const privacyLevels: PrivacyLevel[] = ["private", "partner", "family"];

export async function saveOnboarding(_state: OnboardingState, formData: FormData): Promise<OnboardingState> {
  const session = await getServerSession(authOptions);
  const user = session?.user;

  if (!user?.id || !user.email) {
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

  const familyId = randomUUID();
  try {
    await execute("update profiles set role = ?, country = ? where id = ?", [role, country, user.id]);
    await execute(
      "insert into families (id,owner_id,baby_nickname,due_date,country,privacy_level) values (?,?,?,?,?,?)",
      [familyId, user.id, babyNickname, dueDate, country, privacy]
    );
    await execute(
      "insert into family_members (family_id,profile_id,member_role,consent_granted_at) values (?,?,?,?)",
      [familyId, user.id, role, new Date()]
    );
    if (invitePartnerEmail) {
      await execute(
        "insert into partner_invites (id,family_id,invited_email,invited_by,status) values (?,?,?,?,?)",
        [randomUUID(), familyId, invitePartnerEmail.toLowerCase(), user.id, "pending"]
      );
    }
  } catch (error) {
    return { ok: false, message: error instanceof Error ? error.message : "Could not create family journey." };
  }

  revalidatePath("/app");
  redirect("/app");
}

function parseEnum<T extends string>(value: FormDataEntryValue | null, allowed: readonly T[], fallback: T): T {
  const stringValue = String(value ?? "");
  return allowed.includes(stringValue as T) ? (stringValue as T) : fallback;
}
