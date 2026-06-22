"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

export function DueDateCalculator() {
  const [lastPeriod, setLastPeriod] = useState("");
  const [cycleLength, setCycleLength] = useState("28");

  const estimate = useMemo(() => {
    if (!lastPeriod) return null;
    const date = new Date(`${lastPeriod}T00:00:00`);
    if (Number.isNaN(date.getTime())) return null;
    const cycle = Number(cycleLength);
    if (!Number.isInteger(cycle) || cycle < 21 || cycle > 35) return null;
    date.setDate(date.getDate() + 280 + (cycle - 28));

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (new Date(`${lastPeriod}T00:00:00`) > today) return null;

    const daysPregnant = Math.max(0, Math.floor((today.getTime() - new Date(`${lastPeriod}T00:00:00`).getTime()) / 86400000));
    return { dueDate: date, week: Math.min(42, Math.floor(daysPregnant / 7) + 1) };
  }, [cycleLength, lastPeriod]);

  return (
    <div className="card p-6">
      <label className="grid gap-2 text-sm font-bold text-navy">
        First day of last period
        <input
          type="date"
          value={lastPeriod}
          onInput={(event) => setLastPeriod(event.currentTarget.value)}
          className="h-14 rounded-2xl border border-navy/10 bg-background px-4"
        />
      </label>
      <label className="mt-5 grid gap-2 text-sm font-bold text-navy">
        Usual cycle length
        <select value={cycleLength} onChange={(event) => setCycleLength(event.target.value)} className="h-14 rounded-2xl border border-navy/10 bg-background px-4">
          {Array.from({ length: 15 }, (_, index) => 21 + index).map((days) => <option key={days} value={days}>{days} days</option>)}
        </select>
      </label>
      <div className="mt-5 rounded-2xl bg-background p-5">
        <p className="text-xs font-bold uppercase tracking-wide text-coral">Estimated due date</p>
        <p className="mt-2 font-serif text-3xl font-bold text-navy">
          {estimate
            ? new Intl.DateTimeFormat("en-GB", { dateStyle: "long" }).format(estimate.dueDate)
            : "Choose a date"}
        </p>
        <p className="mt-3 text-sm leading-6 text-slate">
          This is an estimate based on 40 weeks from the first day of your last period, adjusted for the cycle length you selected. Your healthcare professional may use a scan or clinical details to adjust it.
        </p>
        {estimate ? <p className="mt-3 text-sm font-semibold text-navy">Based on that date, you are approximately in week {estimate.week}.</p> : null}
      </div>
      <p className="mt-5 text-sm leading-6 text-slate">For educational planning only. If you know your clinician-provided due date, use that as your source of truth.</p>
      <Link href="/signup" className="mt-5 inline-flex h-12 items-center rounded-xl bg-navy px-5 text-sm font-bold text-white">Save your estimate in a free account</Link>
    </div>
  );
}
