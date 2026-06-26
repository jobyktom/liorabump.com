import { NextResponse } from "next/server";
import { getCurrentFamily } from "@/lib/app-data";
import { getPrisma } from "@/lib/prisma";

export async function GET() {
  const current = await getCurrentFamily();

  if (!current) {
    return NextResponse.json({ error: "Please sign in and complete onboarding before exporting data." }, { status: 401 });
  }

  const prisma = getPrisma();
  const familyId = current.family.id;
  const [profile, members, invites, appointments, healthEntries, journalEntries, mediaAssets, milestones] =
    await Promise.all([
      prisma.user.findUnique({
        where: { id: current.userId },
        select: { id: true, email: true, name: true, role: true, country: true, createdAt: true }
      }),
      prisma.familyMember.findMany({ where: { familyId } }),
      prisma.partnerInvite.findMany({ where: { familyId }, orderBy: { createdAt: "desc" } }),
      prisma.appointment.findMany({ where: { familyId }, orderBy: { startsAt: "asc" } }),
      prisma.healthEntry.findMany({ where: { familyId }, orderBy: { recordedAt: "desc" } }),
      prisma.journalEntry.findMany({ where: { familyId }, orderBy: { createdAt: "desc" } }),
      prisma.mediaAsset.findMany({ where: { familyId }, orderBy: { createdAt: "desc" } }),
      prisma.babyMilestone.findMany({ where: { familyId }, orderBy: { createdAt: "desc" } })
    ]);

  return NextResponse.json(
    {
      exported_at: new Date().toISOString(),
      user_id: current.userId,
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
      family: current.family,
      family_members: members.map((member) => ({
        family_id: member.familyId,
        profile_id: member.profileId,
        member_role: member.memberRole,
        consent_granted_at: member.consentGrantedAt?.toISOString() ?? null
      })),
      partner_invites: invites.map((invite) => ({
        id: invite.id,
        family_id: invite.familyId,
        invited_email: invite.invitedEmail,
        invited_by: invite.invitedBy,
        status: invite.status,
        created_at: invite.createdAt.toISOString()
      })),
      appointments: appointments.map((appointment) => ({
        id: appointment.id,
        family_id: appointment.familyId,
        title: appointment.title,
        appointment_type: appointment.appointmentType,
        starts_at: appointment.startsAt.toISOString(),
        notes: appointment.notes,
        created_at: appointment.createdAt.toISOString()
      })),
      health_entries: healthEntries.map((entry) => ({
        id: entry.id,
        family_id: entry.familyId,
        entry_type: entry.entryType,
        value: entry.value,
        recorded_at: entry.recordedAt.toISOString()
      })),
      journal_entries: journalEntries.map((entry) => ({
        id: entry.id,
        family_id: entry.familyId,
        author_id: entry.authorId,
        title: entry.title,
        body: entry.body,
        pregnancy_week: entry.pregnancyWeek,
        created_at: entry.createdAt.toISOString()
      })),
      media_assets: mediaAssets.map((asset) => ({
        id: asset.id,
        family_id: asset.familyId,
        owner_id: asset.ownerId,
        asset_type: asset.assetType,
        storage_path: asset.storagePath,
        caption: asset.caption,
        created_at: asset.createdAt.toISOString()
      })),
      baby_milestones: milestones.map((milestone) => ({
        id: milestone.id,
        family_id: milestone.familyId,
        title: milestone.title,
        happened_on: milestone.happenedOn?.toISOString().slice(0, 10) ?? null,
        notes: milestone.notes,
        media_asset_id: milestone.mediaAssetId,
        created_at: milestone.createdAt.toISOString()
      }))
    },
    {
      headers: {
        "Content-Disposition": `attachment; filename="liorabump-export-${familyId}.json"`
      }
    }
  );
}
