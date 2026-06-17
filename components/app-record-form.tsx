"use client";

import { useActionState } from "react";
import { saveAppRecord } from "@/app/actions/app-records";

export function AppRecordForm({ section, titleLabel = "Title" }: { section: string; titleLabel?: string }) {
  const [state, action, pending] = useActionState(saveAppRecord, { ok: false, message: "" });

  return (
    <form action={action} className="mt-6 grid gap-4">
      <input type="hidden" name="section" value={section} />
      <label className="grid gap-2 text-sm font-bold text-navy">
        {titleLabel}
        <input
          name="title"
          className="h-14 rounded-2xl border border-navy/10 bg-background px-4 text-base font-normal outline-none focus:ring-2 focus:ring-lavenderDeep"
          placeholder={placeholderFor(section)}
          required
        />
      </label>
      <label className="grid gap-2 text-sm font-bold text-navy">
        Date
        <input
          type="date"
          name="date"
          className="h-14 rounded-2xl border border-navy/10 bg-background px-4 text-base font-normal outline-none focus:ring-2 focus:ring-lavenderDeep"
        />
      </label>
      {(section === "journal" || section === "birth-plan") ? (
        <label className="grid gap-2 text-sm font-bold text-navy">
          Pregnancy week
          <input
            type="number"
            name="pregnancy_week"
            min="1"
            max="42"
            className="h-14 rounded-2xl border border-navy/10 bg-background px-4 text-base font-normal outline-none focus:ring-2 focus:ring-lavenderDeep"
            placeholder="24"
          />
        </label>
      ) : null}
      <label className="grid gap-2 text-sm font-bold text-navy">
        Notes
        <textarea
          name="note"
          className="min-h-28 rounded-2xl border border-navy/10 bg-background p-4 text-base font-normal outline-none focus:ring-2 focus:ring-lavenderDeep"
          placeholder="Add useful context for your family record"
        />
      </label>
      <button disabled={pending} className="h-14 rounded-2xl bg-navy font-bold text-white disabled:opacity-60">
        {pending ? "Saving..." : "Save record"}
      </button>
      {state.message ? (
        <p className={`rounded-2xl p-4 text-sm font-semibold leading-6 ${state.ok ? "bg-sage/60 text-navy" : "bg-peach/70 text-navy"}`}>
          {state.message}
        </p>
      ) : null}
    </form>
  );
}

function placeholderFor(section: string) {
  const map: Record<string, string> = {
    "health-tracker": "Swelling, blood pressure, vitamin reminder...",
    "food-guide": "Hydration, craving, safe food note...",
    journal: "Today I felt...",
    "scan-uploads": "20-week scan",
    "kick-counter": "Evening movement session",
    "birth-plan": "Birth preference",
    "baby-profile": "First smile",
    calendar: "Midwife appointment",
    album: "Week 24 bump photo",
    settings: "Privacy preference"
  };

  return map[section] ?? "New record";
}
