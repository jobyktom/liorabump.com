"use server";

import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { getPrisma } from "@/lib/prisma";

export type InviteAcceptState = {
  ok: boolean;
  message: string;
};

export async function acceptInvite(_state: InviteAcceptState, formData: FormData): Promise<InviteAcceptState> {
  const inviteId = String(formData.get("invite_id") ?? "");
  if (!inviteId) return { ok: false, message: "Invite link is missing." };

  const session = await getServerSession(authOptions);
  const user = session?.user;

  if (!user?.id || !user.email) {
    return { ok: false, message: "Please sign in or create an account with the invited email before accepting." };
  }

  const prisma = getPrisma();
  const invite = await prisma.partnerInvite.findUnique({
    where: { id: inviteId },
    select: { id: true, familyId: true, invitedEmail: true, status: true }
  });

  if (!invite) {
    return { ok: false, message: "This invite link is not valid." };
  }

  if (invite.status !== "pending") {
    return { ok: false, message: "This invite has already been used or cancelled." };
  }

  if (invite.invitedEmail.toLowerCase() !== user.email.toLowerCase()) {
    return {
      ok: false,
      message: `This invite is for ${invite.invitedEmail}. Please sign in with that email address.`
    };
  }

  await prisma.user.update({
    where: { id: user.id },
    data: { role: "partner" }
  });

  await prisma.familyMember.upsert({
    where: {
      familyId_profileId: {
        familyId: invite.familyId,
        profileId: user.id
      }
    },
    update: {
      memberRole: "partner",
      consentGrantedAt: new Date()
    },
    create: {
      familyId: invite.familyId,
      profileId: user.id,
      memberRole: "partner",
      consentGrantedAt: new Date()
    }
  });

  await prisma.partnerInvite.update({ where: { id: invite.id }, data: { status: "accepted" } });
  redirect("/app");
}
