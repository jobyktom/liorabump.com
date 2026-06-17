import type { Metadata } from "next";
import { PublicShell } from "@/components/site-shell";
import { DueDateCalculator } from "@/components/due-date-calculator";
import { MedicalNotice } from "@/components/ui";

export const metadata: Metadata = {
  title: "Due Date Calculator",
  description: "Educational due date calculator page for LioraBump."
};

export default function DueDateCalculatorPage() {
  return (
    <PublicShell>
      <main className="section-pad">
        <div className="container-page grid gap-8 md:grid-cols-2">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-peachDeep">Calculator</p>
            <h1 className="mt-4 font-serif text-5xl font-bold text-navy">Due date calculator</h1>
            <p className="mt-5 text-lg leading-8 text-slate">
              A production version should calculate from last menstrual period, conception date, IVF transfer or clinician-provided due date.
            </p>
          </div>
          <DueDateCalculator />
          <div className="md:col-span-2">
            <MedicalNotice />
          </div>
        </div>
      </main>
    </PublicShell>
  );
}
