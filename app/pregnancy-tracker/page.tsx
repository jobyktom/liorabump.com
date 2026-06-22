import type { Metadata } from "next";
import Link from "next/link";
import { PublicShell } from "@/components/site-shell";
import { MedicalNotice, SectionHeading } from "@/components/ui";
import { pregnancyWeeks } from "@/lib/content";

export const metadata: Metadata = {
  title: "Pregnancy Week by Week Tracker",
  description: "Evidence-informed UK pregnancy guides for weeks 1 to 42, with appointment prompts, partner actions and clear urgent-care advice."
};

export default function PregnancyTrackerPage() {
  return (
    <PublicShell>
      <main className="section-pad">
        <div className="container-page">
          <SectionHeading eyebrow="Weeks 1 to 42" title="Pregnancy week by week" text="Evidence-informed weekly prompts to help you prepare questions, notice patterns and stay connected to your maternity team's advice." />
          <div className="mb-8">
            <MedicalNotice />
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {pregnancyWeeks.map((week) => (
              <Link key={week.week} href={`/pregnancy-tracker/week-${week.week}`} className="card block p-5 hover:-translate-y-1">
                <p className="text-xs font-bold uppercase tracking-wide text-peachDeep">Week {week.week}</p>
                <h2 className="mt-2 font-serif text-2xl font-bold text-navy">{week.title}</h2>
                <p className="mt-3 text-sm leading-6 text-slate">{week.summary}</p>
              </Link>
            ))}
          </div>
        </div>
      </main>
    </PublicShell>
  );
}
