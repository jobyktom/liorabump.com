import { hasSupabaseEnv } from "@/lib/env";
import { isImageStoragePath, isPdfStoragePath, parseStoragePath } from "@/lib/media";
import { createClient } from "@/lib/supabase/server";

export type CurrentFamily = {
  userId: string;
  email: string;
  profile: {
    full_name: string | null;
  } | null;
  family: {
    id: string;
    owner_id: string;
    baby_nickname: string;
    due_date: string | null;
    country: string | null;
    privacy_level: "private" | "partner" | "family";
    subscription_plan: string;
    created_at: string;
  };
};

export type AppRecord = {
  id: string;
  title: string;
  detail: string;
  meta: string;
  href?: string;
  actionLabel?: string;
  isMedia?: boolean;
  isImage?: boolean;
  isPdf?: boolean;
};

export async function getCurrentFamily(): Promise<CurrentFamily | null> {
  if (!hasSupabaseEnv()) return null;

  try {
    const supabase = await createClient();
    const {
      data: { user }
    } = await supabase.auth.getUser();

    if (!user?.email) return null;

    const { data: profile } = await supabase
      .from("profiles")
      .select("full_name")
      .eq("id", user.id)
      .maybeSingle();

    const { data: member } = await supabase
      .from("family_members")
      .select("family_id")
      .eq("profile_id", user.id)
      .limit(1)
      .maybeSingle();

    const query = supabase
      .from("families")
      .select("id,owner_id,baby_nickname,due_date,country,privacy_level,subscription_plan,created_at")
      .order("created_at", { ascending: false })
      .limit(1);

    const { data: family } = member?.family_id
      ? await query.eq("id", member.family_id).maybeSingle()
      : await query.eq("owner_id", user.id).maybeSingle();

    if (!family) return null;

    return {
      userId: user.id,
      email: user.email,
      profile,
      family
    };
  } catch {
    return null;
  }
}

export async function getDashboardData() {
  const current = await getCurrentFamily();
  if (!current) return null;

  const supabase = await createClient();
  const familyId = current.family.id;
  const now = new Date().toISOString();

  const [appointments, health, journal, media, milestones, invites] = await Promise.all([
    supabase
      .from("appointments")
      .select("id,title,starts_at,appointment_type,notes")
      .eq("family_id", familyId)
      .gte("starts_at", now)
      .order("starts_at", { ascending: true })
      .limit(3),
    supabase
      .from("health_entries")
      .select("id,entry_type,value,recorded_at")
      .eq("family_id", familyId)
      .order("recorded_at", { ascending: false })
      .limit(3),
    supabase
      .from("journal_entries")
      .select("id,title,body,created_at")
      .eq("family_id", familyId)
      .order("created_at", { ascending: false })
      .limit(3),
    supabase
      .from("media_assets")
      .select("id,caption,asset_type,created_at")
      .eq("family_id", familyId)
      .order("created_at", { ascending: false })
      .limit(3),
    supabase
      .from("baby_milestones")
      .select("id,title,happened_on,notes")
      .eq("family_id", familyId)
      .order("created_at", { ascending: false })
      .limit(3),
    supabase.from("partner_invites").select("id,status").eq("family_id", familyId)
  ]);

  return {
    current,
    pregnancy: calculatePregnancyProgress(current.family.due_date),
    upcomingAppointments: appointments.data ?? [],
    recentHealth: health.data ?? [],
    recentJournal: journal.data ?? [],
    recentMedia: media.data ?? [],
    recentMilestones: milestones.data ?? [],
    inviteCount: invites.data?.length ?? 0
  };
}

function calculatePregnancyProgress(dueDate: string | null) {
  if (!dueDate) {
    return {
      daysToGo: null,
      week: null,
      trimester: null,
      babySize: null,
      progressPercent: 0
    };
  }

  const date = new Date(`${dueDate}T00:00:00`);
  const daysToGo = Math.max(0, Math.ceil((date.getTime() - Date.now()) / 86400000));
  const daysPregnant = Math.min(280, Math.max(0, 280 - daysToGo));
  const week = Math.min(42, Math.max(1, Math.ceil(daysPregnant / 7)));

  return {
    daysToGo,
    week,
    trimester: week <= 13 ? "1st" : week <= 27 ? "2nd" : "3rd",
    babySize: babySizeForWeek(week),
    progressPercent: Math.min(100, Math.round((daysPregnant / 280) * 100))
  };
}

function babySizeForWeek(week: number) {
  const sizes: Record<number, string> = {
    4: "Poppy seed",
    5: "Sesame seed",
    6: "Lentil",
    7: "Blueberry",
    8: "Raspberry",
    9: "Cherry",
    10: "Strawberry",
    11: "Fig",
    12: "Lime",
    13: "Peach",
    14: "Lemon",
    15: "Apple",
    16: "Avocado",
    17: "Pear",
    18: "Sweet potato",
    19: "Mango",
    20: "Banana",
    21: "Carrot",
    22: "Papaya",
    23: "Grapefruit",
    24: "Corn cob",
    25: "Cauliflower",
    26: "Lettuce",
    27: "Cabbage",
    28: "Aubergine",
    29: "Butternut squash",
    30: "Cucumber",
    31: "Coconut",
    32: "Jicama",
    33: "Pineapple",
    34: "Cantaloupe",
    35: "Honeydew melon",
    36: "Romaine lettuce",
    37: "Swiss chard",
    38: "Leek",
    39: "Watermelon",
    40: "Small pumpkin"
  };

  return sizes[week] ?? (week < 4 ? "Tiny seed" : "Newborn size");
}

export async function getSectionRecords(section: string): Promise<AppRecord[]> {
  const current = await getCurrentFamily();
  if (!current) return [];

  const supabase = await createClient();
  const familyId = current.family.id;

  if (section === "calendar") {
    const { data } = await supabase
      .from("appointments")
      .select("id,title,appointment_type,starts_at,notes")
      .eq("family_id", familyId)
      .order("starts_at", { ascending: true })
      .limit(20);

    return (data ?? []).map((item) => ({
      id: item.id,
      title: item.title,
      detail: item.notes ?? item.appointment_type ?? "Appointment",
      meta: formatDate(item.starts_at)
    }));
  }

  if (section === "journal" || section === "birth-plan") {
    const { data } = await supabase
      .from("journal_entries")
      .select("id,title,body,pregnancy_week,created_at")
      .eq("family_id", familyId)
      .eq("title", section === "birth-plan" ? "Birth plan" : "Journal")
      .order("created_at", { ascending: false })
      .limit(20);

    return (data ?? []).map((item) => ({
      id: item.id,
      title: item.title ?? "Journal",
      detail: item.body,
      meta: item.pregnancy_week ? `Week ${item.pregnancy_week}` : formatDate(item.created_at)
    }));
  }

  if (section === "album") {
    return getMediaRecords(supabase, familyId, "photo", "pregnancy-photos");
  }

  if (section === "scan-uploads") {
    return getMediaRecords(supabase, familyId, "scan", "scan-uploads");
  }

  if (section === "baby-profile") {
    const [{ data }, mediaRecords] = await Promise.all([
      supabase
      .from("baby_milestones")
      .select("id,title,happened_on,notes,created_at")
      .eq("family_id", familyId)
      .order("created_at", { ascending: false })
        .limit(20),
      getMediaRecords(supabase, familyId, "photo", "baby-albums")
    ]);

    const milestoneRecords = (data ?? []).map((item) => ({
      id: item.id,
      title: item.title,
      detail: item.notes ?? "Milestone",
      meta: item.happened_on ? formatDate(item.happened_on) : formatDate(item.created_at)
    }));

    return [...mediaRecords, ...milestoneRecords].slice(0, 20);
  }

  const entryType = sectionEntryType(section);
  const [{ data }, documentRecords] = await Promise.all([
    supabase
    .from("health_entries")
    .select("id,entry_type,value,recorded_at")
    .eq("family_id", familyId)
    .eq("entry_type", entryType)
    .order("recorded_at", { ascending: false })
      .limit(20),
    section === "health-tracker" ? getMediaRecords(supabase, familyId, "document", "health-documents") : Promise.resolve([])
  ]);

  const entryRecords = (data ?? []).map((item) => ({
    id: item.id,
    title: typeof item.value.title === "string" ? item.value.title : labelForEntryType(item.entry_type),
    detail: typeof item.value.note === "string" ? item.value.note : JSON.stringify(item.value),
    meta: formatDate(item.recorded_at)
  }));

  return [...documentRecords, ...entryRecords].slice(0, 20);
}

export async function getMediaAssetCount(familyId: string) {
  const supabase = await createClient();
  const { count } = await supabase.from("media_assets").select("id", { count: "exact", head: true }).eq("family_id", familyId);
  return count ?? 0;
}

async function getMediaRecords(
  supabase: Awaited<ReturnType<typeof createClient>>,
  familyId: string,
  assetType: "photo" | "scan" | "document",
  bucket: string
): Promise<AppRecord[]> {
  const { data } = await supabase
    .from("media_assets")
    .select("id,asset_type,storage_path,caption,created_at")
    .eq("family_id", familyId)
    .eq("asset_type", assetType)
    .like("storage_path", `${bucket}/%`)
    .order("created_at", { ascending: false })
    .limit(20);

  return Promise.all(
    (data ?? []).map(async (item) => {
      const signedUrl = await createPrivateFileUrl(supabase, item.storage_path);

      return {
        id: item.id,
        title: item.caption ?? labelForEntryType(item.asset_type),
        detail: signedUrl ? "Private family file" : item.storage_path,
        meta: formatDate(item.created_at),
        href: signedUrl ?? undefined,
        actionLabel: signedUrl ? "Open file" : undefined,
        isMedia: true,
        isImage: isImageStoragePath(item.storage_path),
        isPdf: isPdfStoragePath(item.storage_path)
      };
    })
  );
}

async function createPrivateFileUrl(supabase: Awaited<ReturnType<typeof createClient>>, storagePath: string) {
  const parsed = parseStoragePath(storagePath);
  if (!parsed) return null;

  const { data, error } = await supabase.storage.from(parsed.bucket).createSignedUrl(parsed.filePath, 60 * 10);

  if (error) return null;
  return data.signedUrl;
}

export function sectionEntryType(section: string) {
  const map: Record<string, string> = {
    "health-tracker": "health_note",
    "food-guide": "food_note",
    "kick-counter": "kick_session",
    settings: "settings_note"
  };

  return map[section] ?? "health_note";
}

function labelForEntryType(entryType: string) {
  return entryType
    .split("_")
    .map((part) => part[0]?.toUpperCase() + part.slice(1))
    .join(" ");
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-GB", { dateStyle: "medium" }).format(new Date(value));
}
