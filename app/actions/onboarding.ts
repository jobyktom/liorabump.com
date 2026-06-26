"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { randomUUID } from "crypto";
import type { PrivacyLevel, UserRole } from "@/lib/database.types";
import { authOptions } from "@/auth";
import { getPrisma } from "@/lib/prisma";
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
  const prisma = getPrisma();
  const existingMember = await prisma.familyMember.findFirst({ where: { profileId: user.id }, select: { familyId: true } });
  const existingOwnedFamily = await prisma.family.findFirst({ where: { ownerId: user.id }, select: { id: true } });

  if (existingMember || existingOwnedFamily) {
    redirect("/app");
  }

  try {
    await prisma.user.update({ where: { id: user.id }, data: { role, country } });
    await prisma.family.create({
      data: {
        id: familyId,
        ownerId: user.id,
        babyNickname,
        dueDate: dueDate ? new Date(`${dueDate}T00:00:00`) : null,
        country,
        privacyLevel: privacy,
        members: {
          create: {
            profileId: user.id,
            memberRole: role,
            consentGrantedAt: new Date(),
          },
        },
      },
    });
    if (invitePartnerEmail) {
      await prisma.partnerInvite.create({
        data: {
          id: randomUUID(),
          familyId,
          invitedEmail: invitePartnerEmail.toLowerCase(),
          invitedBy: user.id,
          status: "pending",
        },
      });
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
