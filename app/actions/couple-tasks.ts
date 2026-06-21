"use server";

import { revalidatePath } from "next/cache";
import { getCurrentFamily } from "@/lib/app-data";
import { createClient } from "@/lib/supabase/server";

const statuses = ["todo", "in_progress", "done"] as const;

export async function createCoupleTask(formData: FormData) {
  const current = await getCurrentFamily();
  if (!current) return;

  const title = String(formData.get("title") ?? "").trim();
  if (!title) return;

  const supabase = await createClient();
  await supabase.from("couple_tasks").insert({
    family_id: current.family.id,
    created_by: current.userId,
    title,
    notes: String(formData.get("notes") ?? "").trim() || null,
    due_date: String(formData.get("due_date") ?? "").trim() || null,
    assignee_label: String(formData.get("assignee_label") ?? "Either of us"),
    status: "todo"
  });

  revalidateCoupleSync();
}

export async function updateCoupleTaskStatus(formData: FormData) {
  const current = await getCurrentFamily();
  if (!current) return;

  const id = String(formData.get("id") ?? "");
  const status = String(formData.get("status") ?? "");
  if (!id || !statuses.includes(status as (typeof statuses)[number])) return;

  const supabase = await createClient();
  await supabase
    .from("couple_tasks")
    .update({ status: status as (typeof statuses)[number] })
    .eq("id", id)
    .eq("family_id", current.family.id);

  revalidateCoupleSync();
}

export async function deleteCoupleTask(formData: FormData) {
  const current = await getCurrentFamily();
  if (!current) return;

  const id = String(formData.get("id") ?? "");
  if (!id) return;

  const supabase = await createClient();
  await supabase.from("couple_tasks").delete().eq("id", id).eq("family_id", current.family.id);
  revalidateCoupleSync();
}

function revalidateCoupleSync() {
  revalidatePath("/app");
  revalidatePath("/app/couple-sync");
}
