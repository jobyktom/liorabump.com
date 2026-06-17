import { getCurrentFamily } from "@/lib/app-data";
import { createClient } from "@/lib/supabase/server";

export async function getSettingsData() {
  const current = await getCurrentFamily();
  if (!current) return null;

  const supabase = await createClient();
  const familyId = current.family.id;
  const isOwner = current.userId === current.family.owner_id;

  const [profile, members, invites, appointments, health, journal, media, milestones] = await Promise.all([
    supabase
      .from("profiles")
      .select("id,email,full_name,role,country,created_at")
      .eq("id", current.userId)
      .maybeSingle(),
    supabase
      .from("family_members")
      .select("family_id,profile_id,member_role,consent_granted_at")
      .eq("family_id", familyId),
    isOwner
      ? supabase
          .from("partner_invites")
          .select("id,invited_email,status,created_at")
          .eq("family_id", familyId)
          .order("created_at", { ascending: false })
      : Promise.resolve({ data: [], error: null }),
    supabase.from("appointments").select("id", { count: "exact", head: true }).eq("family_id", familyId),
    supabase.from("health_entries").select("id", { count: "exact", head: true }).eq("family_id", familyId),
    supabase.from("journal_entries").select("id", { count: "exact", head: true }).eq("family_id", familyId),
    supabase.from("media_assets").select("id", { count: "exact", head: true }).eq("family_id", familyId),
    supabase.from("baby_milestones").select("id", { count: "exact", head: true }).eq("family_id", familyId)
  ]);

  return {
    current,
    profile: profile.data,
    members: members.data ?? [],
    invites: invites.data ?? [],
    isOwner,
    counts: {
      appointments: appointments.count ?? 0,
      healthEntries: health.count ?? 0,
      journalEntries: journal.count ?? 0,
      mediaAssets: media.count ?? 0,
      milestones: milestones.count ?? 0
    }
  };
}
