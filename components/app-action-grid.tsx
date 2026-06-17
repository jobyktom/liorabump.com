"use client";

import { useState } from "react";

export function AppActionGrid({ actions }: { actions: readonly string[] }) {
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <>
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {actions.map((action) => (
          <button
            key={action}
            type="button"
            onClick={() => setSelected(action)}
            className="rounded-2xl bg-background p-5 text-left text-sm font-bold text-navy transition hover:bg-peach"
          >
            {action}
            <span className="mt-2 block text-xs font-normal leading-5 text-slate">
              Demo action ready for database/auth wiring.
            </span>
          </button>
        ))}
      </div>
      {selected ? (
        <p className="mt-5 rounded-2xl bg-sage/60 p-4 text-sm font-semibold leading-6 text-navy">
          {selected} saved as a prototype action. The production version will write this to your family account.
        </p>
      ) : null}
    </>
  );
}
