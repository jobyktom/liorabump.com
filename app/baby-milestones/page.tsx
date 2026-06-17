import type { Metadata } from "next";
import { PublicShell } from "@/components/site-shell";
import { SectionHeading } from "@/components/ui";
import { milestoneMonths } from "@/lib/content";

export const metadata: Metadata = {
  title: "Baby Milestones",
  description: "Track baby milestones from birth to 24 months with private photos and family memory prompts."
};

export default function BabyMilestonesPage() {
  return (
    <PublicShell>
      <main className="section-pad">
        <div className="container-page">
          <SectionHeading eyebrow="Beyond pregnancy" title="Baby milestones from birth to 24 months" text="A calm structure for recording everyday moments, feeding rhythms and family memories." />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {milestoneMonths.map((item) => (
              <article key={item.month} className="card p-5">
                <p className="text-xs font-bold uppercase tracking-wide text-peachDeep">{item.month === 0 ? "Birth" : `Month ${item.month}`}</p>
                <h2 className="mt-2 font-serif text-2xl font-bold text-navy">{item.title}</h2>
                <p className="mt-3 text-sm leading-6 text-slate">{item.summary}</p>
              </article>
            ))}
          </div>
        </div>
      </main>
    </PublicShell>
  );
}
