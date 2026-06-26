import { getCurrentFamily } from "@/lib/app-data";
import { getPrisma } from "@/lib/prisma";

export async function getSettingsData() {
  const current = await getCurrentFamily();
  if (!current) return null;

  const prisma = getPrisma();
  const familyId = current.family.id;
  const isOwner = current.userId === current.family.owner_id;

  const [profile, members, invites, appointments, health, journal, media, milestones] = await Promise.all([
    prisma.user.findUnique({
      where: { id: current.userId },
      select: { id: true, email: true, name: true, role: true, country: true, createdAt: true }
    }),
    prisma.familyMember.findMany({
      where: { familyId },
      select: { familyId: true, profileId: true, memberRole: true, consentGrantedAt: true }
    }),
    isOwner
      ? prisma.partnerInvite.findMany({
          where: { familyId },
          orderBy: { createdAt: "desc" },
          select: { id: true, invitedEmail: true, status: true, createdAt: true }
        })
      : Promise.resolve([]),
    prisma.appointment.count({ where: { familyId } }),
    prisma.healthEntry.count({ where: { familyId } }),
    prisma.journalEntry.count({ where: { familyId } }),
    prisma.mediaAsset.count({ where: { familyId } }),
    prisma.babyMilestone.count({ where: { familyId } })
  ]);

  return {
    current,
    profile: profile
      ? {
          id: profile.id,
          email: profile.email,
          full_name: profile.name,
          role: profile.role,
          country: profile.country,
          created_at: profile.createdAt.toISOString()
        }
      : null,
    members: members.map((member) => ({
      family_id: member.familyId,
      profile_id: member.profileId,
      member_role: member.memberRole,
      consent_granted_at: member.consentGrantedAt?.toISOString() ?? null
    })),
    invites: invites.map((invite) => ({
      id: invite.id,
      invited_email: invite.invitedEmail,
      status: invite.status,
      created_at: invite.createdAt.toISOString()
    })),
    isOwner,
    counts: {
      appointments,
      healthEntries: health,
      journalEntries: journal,
      mediaAssets: media,
      milestones
    }
  };
}
