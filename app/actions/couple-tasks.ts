"use server";

import { revalidatePath } from "next/cache";
import { getCurrentFamily } from "@/lib/app-data";
import { getPrisma } from "@/lib/prisma";

const statuses = ["todo", "in_progress", "done"] as const;

export async function createCoupleTask(formData: FormData) {
  const current = await getCurrentFamily();
  if (!current) return;

  const title = String(formData.get("title") ?? "").trim();
  if (!title) return;

  const dueDate = String(formData.get("due_date") ?? "").trim();
  const prisma = getPrisma();
  await prisma.coupleTask.create({
    data: {
      familyId: current.family.id,
      createdBy: current.userId,
      title,
      notes: String(formData.get("notes") ?? "").trim() || null,
      dueDate: dueDate ? new Date(`${dueDate}T00:00:00`) : null,
      assigneeLabel: String(formData.get("assignee_label") ?? "Either of us"),
      status: "todo"
    }
  });

  revalidateCoupleSync();
}

export async function updateCoupleTaskStatus(formData: FormData) {
  const current = await getCurrentFamily();
  if (!current) return;

  const id = String(formData.get("id") ?? "");
  const status = String(formData.get("status") ?? "");
  if (!id || !statuses.includes(status as (typeof statuses)[number])) return;

  const prisma = getPrisma();
  await prisma.coupleTask.updateMany({
    where: { id, familyId: current.family.id },
    data: { status: status as (typeof statuses)[number] }
  });

  revalidateCoupleSync();
}

export async function deleteCoupleTask(formData: FormData) {
  const current = await getCurrentFamily();
  if (!current) return;

  const id = String(formData.get("id") ?? "");
  if (!id) return;

  const prisma = getPrisma();
  await prisma.coupleTask.deleteMany({ where: { id, familyId: current.family.id } });
  revalidateCoupleSync();
}

function revalidateCoupleSync() {
  revalidatePath("/app");
  revalidatePath("/app/couple-sync");
}
