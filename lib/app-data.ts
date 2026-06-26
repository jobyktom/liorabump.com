import { isImageStoragePath, isPdfStoragePath, parseStoragePath } from "@/lib/media";
import { authOptions } from "@/auth";
import { getPrisma } from "@/lib/prisma";
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

    const prisma = getPrisma();
    const profile = await prisma.user.findUnique({ where: { id: user.id }, select: { name: true } });

    const member = await prisma.familyMember.findFirst({ where: { profileId: user.id }, select: { familyId: true } });

    const family = member?.familyId
      ? await prisma.family.findUnique({ where: { id: member.familyId } })
      : await prisma.family.findFirst({ where: { ownerId: user.id }, orderBy: { createdAt: "desc" } });

    if (!family) return null;

    return {
      userId: user.id,
      email: user.email,
      profile: { full_name: profile?.name ?? null },
      family: {
        id: family.id,
        owner_id: family.ownerId,
        baby_nickname: family.babyNickname,
        due_date: dateOnly(family.dueDate),
        country: family.country,
        privacy_level: family.privacyLevel,
        subscription_plan: family.subscriptionPlan,
        stripe_customer_id: family.stripeCustomerId,
        stripe_subscription_id: family.stripeSubscriptionId,
        created_at: family.createdAt.toISOString()
      }
    };
  } catch {
    return null;
  }
}

export async function getDashboardData() {
  const current = await getCurrentFamily();
  if (!current) return null;

  const familyId = current.family.id;
  const now = new Date();
  const prisma = getPrisma();

  const [appointments, health, journal, media, milestones, invites] = await Promise.all([
    prisma.appointment.findMany({ where: { familyId, startsAt: { gte: now } }, orderBy: { startsAt: "asc" }, take: 3 }),
    prisma.healthEntry.findMany({ where: { familyId }, orderBy: { recordedAt: "desc" }, take: 3 }),
    prisma.journalEntry.findMany({ where: { familyId }, orderBy: { createdAt: "desc" }, take: 3 }),
    prisma.mediaAsset.findMany({ where: { familyId }, orderBy: { createdAt: "desc" }, take: 3 }),
    prisma.babyMilestone.findMany({ where: { familyId }, orderBy: { createdAt: "desc" }, take: 3 }),
    prisma.partnerInvite.findMany({ where: { familyId }, select: { id: true, status: true } })
  ]);

  return {
    current,
    pregnancy: calculatePregnancyProgress(current.family.due_date),
    upcomingAppointments: appointments.map((item) => ({ id: item.id, title: item.title, starts_at: item.startsAt.toISOString(), appointment_type: item.appointmentType, notes: item.notes })),
    recentHealth: health.map((entry) => ({ id: entry.id, entry_type: entry.entryType, value: normalizeJson(entry.value), recorded_at: entry.recordedAt.toISOString() })),
    recentJournal: journal.map((item) => ({ id: item.id, title: item.title, body: item.body, created_at: item.createdAt.toISOString() })),
    recentMedia: media.map((item) => ({ id: item.id, caption: item.caption, asset_type: item.assetType, created_at: item.createdAt.toISOString() })),
    recentMilestones: milestones.map((item) => ({ id: item.id, title: item.title, happened_on: dateOnly(item.happenedOn), notes: item.notes })),
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
  const prisma = getPrisma();

  if (section === "calendar") {
    const data = await prisma.appointment.findMany({ where: { familyId }, orderBy: { startsAt: "asc" }, take: 20 });

    return data.map((item) => ({
      id: item.id,
      title: item.title,
      detail: item.notes ?? item.appointmentType ?? "Appointment",
      meta: formatDate(item.startsAt.toISOString())
    }));
  }

  if (section === "journal" || section === "birth-plan") {
    const data = await prisma.journalEntry.findMany({ where: { familyId, title: section === "birth-plan" ? "Birth plan" : "Journal" }, orderBy: { createdAt: "desc" }, take: 20 });

    return data.map((item) => ({
      id: item.id,
      title: item.title ?? "Journal",
      detail: item.body,
      meta: item.pregnancyWeek ? `Week ${item.pregnancyWeek}` : formatDate(item.createdAt.toISOString())
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
      prisma.babyMilestone.findMany({ where: { familyId }, orderBy: { createdAt: "desc" }, take: 20 }),
      getMediaRecords(familyId, "photo", "baby-albums")
    ]);

    const milestoneRecords = data.map((item) => ({
      id: item.id,
      title: item.title,
      detail: item.notes ?? "Milestone",
      meta: item.happenedOn ? formatDate(item.happenedOn.toISOString()) : formatDate(item.createdAt.toISOString())
    }));

    return [...mediaRecords, ...milestoneRecords].slice(0, 20);
  }

  const entryType = sectionEntryType(section);
  const [data, documentRecords] = await Promise.all([
    prisma.healthEntry.findMany({ where: { familyId, entryType }, orderBy: { recordedAt: "desc" }, take: 20 }),
    section === "health-tracker" ? getMediaRecords(familyId, "document", "health-documents") : Promise.resolve([])
  ]);

  const entryRecords = data.map((item) => {
    const value = normalizeJson(item.value);
    return {
      id: item.id,
      title: typeof value.title === "string" ? value.title : labelForEntryType(item.entryType),
      detail: typeof value.note === "string" ? value.note : JSON.stringify(value),
      meta: formatDate(item.recordedAt.toISOString())
    };
  });

  return [...documentRecords, ...entryRecords].slice(0, 20);
}

export async function getMediaAssetCount(familyId: string) {
  return getPrisma().mediaAsset.count({ where: { familyId } });
}

async function getMediaRecords(
  familyId: string,
  assetType: "photo" | "scan" | "document",
  bucket: string
): Promise<AppRecord[]> {
  const data = await getPrisma().mediaAsset.findMany({
    where: { familyId, assetType, storagePath: { startsWith: `${bucket}/` } },
    orderBy: { createdAt: "desc" },
    take: 20,
  });
  const supabase = createAdminClient();

  return Promise.all(
    data.map(async (item) => {
      const signedUrl = await createPrivateFileUrl(supabase, item.storagePath);

      return {
        id: item.id,
        title: item.caption ?? labelForEntryType(item.assetType),
        detail: signedUrl ? "Private family file" : item.storagePath,
        meta: formatDate(item.createdAt.toISOString()),
        href: signedUrl ?? undefined,
        actionLabel: signedUrl ? "Open file" : undefined,
        isMedia: true,
        isImage: isImageStoragePath(item.storagePath),
        isPdf: isPdfStoragePath(item.storagePath)
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

function dateOnly(value: Date | null) {
  return value ? value.toISOString().slice(0, 10) : null;
}
