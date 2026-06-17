"use server";

import { revalidatePath } from "next/cache";
import { getCurrentFamily, sectionEntryType } from "@/lib/app-data";
import { createClient } from "@/lib/supabase/server";

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

  const supabase = await createClient();
  const familyId = current.family.id;
  const userId = current.userId;

  if (section === "calendar") {
    const startsAt = date ? new Date(`${date}T09:00:00`).toISOString() : new Date().toISOString();
    const { error } = await supabase.from("appointments").insert({
      family_id: familyId,
      title,
      appointment_type: "general",
      starts_at: startsAt,
      notes: note || null
    });
    return finish(section, error?.message);
  }

  if (section === "journal" || section === "birth-plan") {
    const { error } = await supabase.from("journal_entries").insert({
      family_id: familyId,
      author_id: userId,
      title: section === "birth-plan" ? "Birth plan" : "Journal",
      body: note || title,
      pregnancy_week: parseOptionalNumber(formData.get("pregnancy_week"))
    });
    return finish(section, error?.message);
  }

  if (section === "baby-profile") {
    const { error } = await supabase.from("baby_milestones").insert({
      family_id: familyId,
      title,
      happened_on: date || null,
      notes: note || null
    });
    return finish(section, error?.message);
  }

  const { error } = await supabase.from("health_entries").insert({
    family_id: familyId,
    entry_type: sectionEntryType(section),
    value: {
      title,
      note,
      date: date || null
    }
  });

  return finish(section, error?.message);
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
