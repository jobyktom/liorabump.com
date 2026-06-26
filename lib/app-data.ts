import { isImageStoragePath, isPdfStoragePath, parseStoragePath } from "@/lib/media";
import { authOptions } from "@/auth";
import { queryRows } from "@/lib/mysql";
import { createAdminClient } from "@/lib/supabase/admin";
import { getServerSession } from "next-auth";

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
    stripe_customer_id: string | null;
    stripe_subscription_id: string | null;
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
  try {
    const session = await getServerSession(authOptions);
    const user = session?.user;

    if (!user?.id || !user.email) return null;

    const [profile] = await queryRows<{ full_name: string | null }>("select full_name from profiles where id = ? limit 1", [user.id]);

    const [member] = await queryRows<{ family_id: string }>("select family_id from family_members where profile_id = ? limit 1", [user.id]);

    const [family] = member?.family_id
      ? await queryRows<CurrentFamily["family"]>(
          "select id,owner_id,baby_nickname,date_format(due_date, '%Y-%m-%d') as due_date,country,privacy_level,subscription_plan,stripe_customer_id,stripe_subscription_id,created_at from families where id = ? limit 1",
          [member.family_id]
        )
      : await queryRows<CurrentFamily["family"]>(
          "select id,owner_id,baby_nickname,date_format(due_date, '%Y-%m-%d') as due_date,country,privacy_level,subscription_plan,stripe_customer_id,stripe_subscription_id,created_at from families where owner_id = ? order by created_at desc limit 1",
          [user.id]
        );

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

  const familyId = current.family.id;
  const now = new Date().toISOString();

  const [appointments, health, journal, media, milestones, invites] = await Promise.all([
    queryRows<{ id: string; title: string; starts_at: string; appointment_type: string | null; notes: string | null }>(
      "select id,title,starts_at,appointment_type,notes from appointments where family_id = ? and starts_at >= ? order by starts_at asc limit 3",
      [familyId, now]
    ),
    queryRows<{ id: string; entry_type: string; value: Record<string, unknown>; recorded_at: string }>(
      "select id,entry_type,value,recorded_at from health_entries where family_id = ? order by recorded_at desc limit 3",
      [familyId]
    ),
    queryRows<{ id: string; title: string | null; body: string; created_at: string }>(
      "select id,title,body,created_at from journal_entries where family_id = ? order by created_at desc limit 3",
      [familyId]
    ),
    queryRows<{ id: string; caption: string | null; asset_type: string; created_at: string }>(
      "select id,caption,asset_type,created_at from media_assets where family_id = ? order by created_at desc limit 3",
      [familyId]
    ),
    queryRows<{ id: string; title: string; happened_on: string | null; notes: string | null }>(
      "select id,title,happened_on,notes from baby_milestones where family_id = ? order by created_at desc limit 3",
      [familyId]
    ),
    queryRows<{ id: string; status: string }>("select id,status from partner_invites where family_id = ?", [familyId])
  ]);

  return {
    current,
    pregnancy: calculatePregnancyProgress(current.family.due_date),
    upcomingAppointments: appointments,
    recentHealth: health.map((entry) => ({ ...entry, value: normalizeJson(entry.value) })),
    recentJournal: journal,
    recentMedia: media,
    recentMilestones: milestones,
    inviteCount: invites.length
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

  const familyId = current.family.id;

  if (section === "calendar") {
    const data = await queryRows<{ id: string; title: string; appointment_type: string | null; starts_at: string; notes: string | null }>(
      "select id,title,appointment_type,starts_at,notes from appointments where family_id = ? order by starts_at asc limit 20",
      [familyId]
    );

    return data.map((item) => ({
      id: item.id,
      title: item.title,
      detail: item.notes ?? item.appointment_type ?? "Appointment",
      meta: formatDate(item.starts_at)
    }));
  }

  if (section === "journal" || section === "birth-plan") {
    const data = await queryRows<{ id: string; title: string | null; body: string; pregnancy_week: number | null; created_at: string }>(
      "select id,title,body,pregnancy_week,created_at from journal_entries where family_id = ? and title = ? order by created_at desc limit 20",
      [familyId, section === "birth-plan" ? "Birth plan" : "Journal"]
    );

    return data.map((item) => ({
      id: item.id,
      title: item.title ?? "Journal",
      detail: item.body,
      meta: item.pregnancy_week ? `Week ${item.pregnancy_week}` : formatDate(item.created_at)
    }));
  }

  if (section === "album") {
    return getMediaRecords(familyId, "photo", "pregnancy-photos");
  }

  if (section === "scan-uploads") {
    return getMediaRecords(familyId, "scan", "scan-uploads");
  }

  if (section === "baby-profile") {
    const [data, mediaRecords] = await Promise.all([
      queryRows<{ id: string; title: string; happened_on: string | null; notes: string | null; created_at: string }>(
        "select id,title,happened_on,notes,created_at from baby_milestones where family_id = ? order by created_at desc limit 20",
        [familyId]
      ),
      getMediaRecords(familyId, "photo", "baby-albums")
    ]);

    const milestoneRecords = data.map((item) => ({
      id: item.id,
      title: item.title,
      detail: item.notes ?? "Milestone",
      meta: item.happened_on ? formatDate(item.happened_on) : formatDate(item.created_at)
    }));

    return [...mediaRecords, ...milestoneRecords].slice(0, 20);
  }

  const entryType = sectionEntryType(section);
  const [data, documentRecords] = await Promise.all([
    queryRows<{ id: string; entry_type: string; value: Record<string, unknown>; recorded_at: string }>(
      "select id,entry_type,value,recorded_at from health_entries where family_id = ? and entry_type = ? order by recorded_at desc limit 20",
      [familyId, entryType]
    ),
    section === "health-tracker" ? getMediaRecords(familyId, "document", "health-documents") : Promise.resolve([])
  ]);

  const entryRecords = data.map((item) => {
    const value = normalizeJson(item.value);
    return {
    id: item.id,
      title: typeof value.title === "string" ? value.title : labelForEntryType(item.entry_type),
      detail: typeof value.note === "string" ? value.note : JSON.stringify(value),
    meta: formatDate(item.recorded_at)
    };
  });

  return [...documentRecords, ...entryRecords].slice(0, 20);
}

export async function getMediaAssetCount(familyId: string) {
  const [row] = await queryRows<{ count: number }>("select count(*) as count from media_assets where family_id = ?", [familyId]);
  return row?.count ?? 0;
}

async function getMediaRecords(
  familyId: string,
  assetType: "photo" | "scan" | "document",
  bucket: string
): Promise<AppRecord[]> {
  const data = await queryRows<{ id: string; asset_type: string; storage_path: string; caption: string | null; created_at: string }>(
    "select id,asset_type,storage_path,caption,created_at from media_assets where family_id = ? and asset_type = ? and storage_path like ? order by created_at desc limit 20",
    [familyId, assetType, `${bucket}/%`]
  );
  const supabase = createAdminClient();

  return Promise.all(
    data.map(async (item) => {
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

async function createPrivateFileUrl(supabase: ReturnType<typeof createAdminClient>, storagePath: string) {
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

function normalizeJson(value: unknown): Record<string, unknown> {
  if (typeof value === "string") {
    try {
      return JSON.parse(value) as Record<string, unknown>;
    } catch {
      return { note: value };
    }
  }
  if (value && typeof value === "object") return value as Record<string, unknown>;
  return {};
}
