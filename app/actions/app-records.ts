"use server";

import { revalidatePath } from "next/cache";
import { getCurrentFamily, sectionEntryType } from "@/lib/app-data";
import { getPrisma } from "@/lib/prisma";

export type AppRecordState = {
  ok: boolean;
  message: string;
};

export async function saveAppRecord(_state: AppRecordState, formData: FormData): Promise<AppRecordState> {
  const section = String(formData.get("section") ?? "");
  const title = String(formData.get("title") ?? "").trim();
  const note = String(formData.get("note") ?? "").trim();
  const date = String(formData.get("date") ?? "").trim();

  if (!section || !title) {
    return { ok: false, message: "Please add a title before saving." };
  }

  const current = await getCurrentFamily();
  if (!current) {
    return { ok: false, message: "Please sign in and complete onboarding before saving app data." };
  }

  const prisma = getPrisma();
  const familyId = current.family.id;
  const userId = current.userId;

  try {
    if (section === "calendar") {
      const startsAt = date ? new Date(`${date}T09:00:00`) : new Date();
      await prisma.appointment.create({
        data: {
          familyId,
          title,
          appointmentType: "general",
          startsAt,
          notes: note || null
        }
      });
      return finish(section);
    }

    if (section === "journal" || section === "birth-plan") {
      await prisma.journalEntry.create({
        data: {
          familyId,
          authorId: userId,
          title: section === "birth-plan" ? "Birth plan" : "Journal",
          body: note || title,
          pregnancyWeek: parseOptionalNumber(formData.get("pregnancy_week"))
        }
      });
      return finish(section);
    }

    if (section === "baby-profile") {
      await prisma.babyMilestone.create({
        data: {
          familyId,
          title,
          happenedOn: date ? new Date(`${date}T00:00:00`) : null,
          notes: note || null
        }
      });
      return finish(section);
    }

    await prisma.healthEntry.create({
      data: {
        familyId,
        entryType: sectionEntryType(section),
        value: {
          title,
          note,
          date: date || null
        }
      }
    });

    return finish(section);
  } catch (error) {
    return finish(section, error instanceof Error ? error.message : "Could not save this record.");
  }
}

function finish(section: string, error?: string) {
  if (error) return { ok: false, message: error };
  revalidatePath("/app");
  revalidatePath(`/app/${section}`);
  return { ok: true, message: "Saved to your LioraBump family workspace." };
}

function parseOptionalNumber(value: FormDataEntryValue | null) {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
}
