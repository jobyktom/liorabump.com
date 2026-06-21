import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2, Circle, HeartHandshake, PlayCircle, Trash2 } from "lucide-react";
import { createCoupleTask, deleteCoupleTask, updateCoupleTaskStatus } from "@/app/actions/couple-tasks";
import { PublicShell } from "@/components/site-shell";
import { MedicalNotice } from "@/components/ui";
import { getCurrentFamily } from "@/lib/app-data";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Couple Sync",
  description: "A shared checklist for appointments, preparation and everyday support."
};

export default async function CoupleSyncPage() {
  const current = await getCurrentFamily();
  const tasks = current ? await getTasks(current.family.id) : [];

  return (
    <PublicShell>
      <main className="section-pad bg-mist">
        <section className="container-page grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <Link href="/app" className="text-sm font-bold text-coral">Back to dashboard</Link>
            <div className="mt-6 grid h-16 w-16 place-items-center rounded-2xl bg-lavender text-navy">
              <HeartHandshake className="h-8 w-8" />
            </div>
            <h1 className="mt-5 font-serif text-5xl font-bold text-navy">Couple sync</h1>
            <p className="mt-5 text-lg leading-8 text-slate">
              Keep practical support visible to both of you: appointments, hospital-bag prep, questions to ask and the
              ordinary little jobs that make pregnancy feel more shared.
            </p>
            <div className="mt-8"><MedicalNotice /></div>
          </div>

          {current ? (
            <form action={createCoupleTask} className="card grid gap-4 p-6 md:p-8">
              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-coral">Shared plan</p>
                <h2 className="mt-2 font-serif text-3xl font-bold text-navy">Add a support task</h2>
              </div>
              <label className="grid gap-2 text-sm font-bold text-navy">
                Task
                <input name="title" required placeholder="Pack snacks for the midwife appointment" className="h-14 rounded-2xl border border-navy/10 bg-background px-4 text-base font-normal outline-none focus:ring-2 focus:ring-lavenderDeep" />
              </label>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="grid gap-2 text-sm font-bold text-navy">
                  Who is taking it?
                  <select name="assignee_label" className="h-14 rounded-2xl border border-navy/10 bg-background px-4 text-base font-normal outline-none focus:ring-2 focus:ring-lavenderDeep">
                    <option>Either of us</option>
                    <option>Me</option>
                    <option>My partner</option>
                  </select>
                </label>
                <label className="grid gap-2 text-sm font-bold text-navy">
                  Due date
                  <input type="date" name="due_date" className="h-14 rounded-2xl border border-navy/10 bg-background px-4 text-base font-normal outline-none focus:ring-2 focus:ring-lavenderDeep" />
                </label>
              </div>
              <label className="grid gap-2 text-sm font-bold text-navy">
                Note
                <textarea name="notes" placeholder="Anything helpful to remember?" className="min-h-28 rounded-2xl border border-navy/10 bg-background p-4 text-base font-normal outline-none focus:ring-2 focus:ring-lavenderDeep" />
              </label>
              <button type="submit" className="h-14 rounded-2xl bg-navy font-bold text-white">Add to shared plan</button>
            </form>
          ) : (
            <div className="card p-6 md:p-8">
              <h2 className="font-serif text-3xl font-bold text-navy">Sign in required</h2>
              <p className="mt-4 text-sm leading-6 text-slate">Sign in and complete onboarding to start a shared support plan.</p>
              <Link href="/login" className="mt-6 inline-flex rounded-xl bg-navy px-4 py-3 font-bold text-white">Sign in</Link>
            </div>
          )}
        </section>

        <section className="container-page mt-8">
          <div className="card p-6 md:p-8">
            <div className="flex items-center justify-between gap-4">
              <h2 className="font-serif text-3xl font-bold text-navy">Shared tasks</h2>
              <span className="rounded-full bg-peach px-3 py-1 text-xs font-bold uppercase tracking-wide text-coral">{tasks.length} total</span>
            </div>
            {tasks.length ? (
              <div className="mt-6 grid gap-4 md:grid-cols-2">
                {tasks.map((task) => (
                  <article key={task.id} className="rounded-2xl bg-background p-5">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-xs font-bold uppercase tracking-wide text-coral">{task.assignee_label}{task.due_date ? ` · Due ${formatDate(task.due_date)}` : ""}</p>
                        <h3 className="mt-2 font-serif text-2xl font-bold text-navy">{task.title}</h3>
                      </div>
                      <StatusIcon status={task.status} />
                    </div>
                    {task.notes ? <p className="mt-3 text-sm leading-6 text-slate">{task.notes}</p> : null}
                    <div className="mt-5 flex flex-wrap gap-2">
                      {task.status !== "todo" ? <TaskStatusButton id={task.id} status="todo" label="To do" /> : null}
                      {task.status !== "in_progress" ? <TaskStatusButton id={task.id} status="in_progress" label="In progress" /> : null}
                      {task.status !== "done" ? <TaskStatusButton id={task.id} status="done" label="Done" /> : null}
                      <form action={deleteCoupleTask}>
                        <input type="hidden" name="id" value={task.id} />
                        <button type="submit" className="inline-flex h-10 items-center gap-2 rounded-xl bg-peach px-3 text-sm font-bold text-coral"><Trash2 className="h-4 w-4" />Remove</button>
                      </form>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <p className="mt-6 rounded-2xl bg-background p-5 text-sm leading-6 text-slate">Add your first shared task above. Appointment questions and hospital-bag prep are great places to start.</p>
            )}
          </div>
        </section>
      </main>
    </PublicShell>
  );
}

async function getTasks(familyId: string) {
  const supabase = await createClient();
  const { data } = await supabase.from("couple_tasks").select("*").eq("family_id", familyId).order("status").order("due_date", { ascending: true, nullsFirst: false });
  return data ?? [];
}

function TaskStatusButton({ id, status, label }: { id: string; status: "todo" | "in_progress" | "done"; label: string }) {
  return (
    <form action={updateCoupleTaskStatus}>
      <input type="hidden" name="id" value={id} />
      <input type="hidden" name="status" value={status} />
      <button type="submit" className="h-10 rounded-xl bg-white px-3 text-sm font-bold text-navy">{label}</button>
    </form>
  );
}

function StatusIcon({ status }: { status: "todo" | "in_progress" | "done" }) {
  if (status === "done") return <CheckCircle2 className="h-6 w-6 text-sage" />;
  if (status === "in_progress") return <PlayCircle className="h-6 w-6 text-lavenderDeep" />;
  return <Circle className="h-6 w-6 text-slate" />;
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short" }).format(new Date(`${value}T00:00:00`));
}
