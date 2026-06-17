"use client";

import { useMemo, useState } from "react";

export function DueDateCalculator() {
  const [lastPeriod, setLastPeriod] = useState("");

  const estimate = useMemo(() => {
    if (!lastPeriod) return null;
    const date = new Date(`${lastPeriod}T00:00:00`);
    if (Number.isNaN(date.getTime())) return null;
    date.setDate(date.getDate() + 280);
    return date;
  }, [lastPeriod]);

  return (
    <div className="card p-6">
      <label className="grid gap-2 text-sm font-bold text-navy">
        First day of last period
        <input
          type="date"
          value={lastPeriod}
          onChange={(event) => setLastPeriod(event.target.value)}
          className="h-14 rounded-2xl border border-navy/10 bg-background px-4"
        />
      </label>
      <div className="mt-5 rounded-2xl bg-background p-5">
        <p className="text-xs font-bold uppercase tracking-wide text-coral">Estimated due date</p>
        <p className="mt-2 font-serif text-3xl font-bold text-navy">
          {estimate
            ? new Intl.DateTimeFormat("en-GB", { dateStyle: "long" }).format(estimate)
            : "Choose a date"}
        </p>
        <p className="mt-3 text-sm leading-6 text-slate">
          This is an estimate based on 40 weeks from the first day of your last period. Your healthcare professional may use a scan or clinical details to adjust it.
        </p>
      </div>
    </div>
  );
}
