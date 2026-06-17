import { NextResponse } from "next/server";
import { getCurrentFamily } from "@/lib/app-data";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const current = await getCurrentFamily();

  if (!current) {
    return NextResponse.json({ error: "Please sign in and complete onboarding before exporting data." }, { status: 401 });
  }

  const supabase = await createClient();
  const familyId = current.family.id;
  const [profile, members, invites, appointments, healthEntries, journalEntries, mediaAssets, milestones] =
    await Promise.all([
      supabase.from("profiles").select("id,email,full_name,role,country,created_at").eq("id", current.userId).maybeSingle(),
      supabase.from("family_members").select("*").eq("family_id", familyId),
      supabase.from("partner_invites").select("id,invited_email,status,created_at").eq("family_id", familyId),
      supabase.from("appointments").select("*").eq("family_id", familyId).order("starts_at", { ascending: true }),
      supabase.from("health_entries").select("*").eq("family_id", familyId).order("recorded_at", { ascending: false }),
      supabase.from("journal_entries").select("*").eq("family_id", familyId).order("created_at", { ascending: false }),
      supabase.from("media_assets").select("*").eq("family_id", familyId).order("created_at", { ascending: false }),
      supabase.from("baby_milestones").select("*").eq("family_id", familyId).order("created_at", { ascending: false })
    ]);

  return NextResponse.json(
    {
      exported_at: new Date().toISOString(),
      user_id: current.userId,
      profile: profile.data,
      family: current.family,
      family_members: members.data ?? [],
      partner_invites: invites.data ?? [],
      appointments: appointments.data ?? [],
      health_entries: healthEntries.data ?? [],
      journal_entries: journalEntries.data ?? [],
      media_assets: mediaAssets.data ?? [],
      baby_milestones: milestones.data ?? []
    },
    {
      headers: {
        "Content-Disposition": `attachment; filename="liorabump-export-${familyId}.json"`
      }
    }
  );
}
