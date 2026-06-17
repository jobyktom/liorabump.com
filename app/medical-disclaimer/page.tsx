import type { Metadata } from "next";
import { PublicShell } from "@/components/site-shell";
import { MedicalNotice } from "@/components/ui";

export const metadata: Metadata = { title: "Medical Disclaimer" };

export default function MedicalDisclaimerPage() {
  return (
    <PublicShell>
      <main className="section-pad">
        <article className="container-page max-w-3xl">
          <h1 className="font-serif text-5xl font-bold text-navy">Medical Disclaimer</h1>
          <div className="mt-8">
            <MedicalNotice />
          </div>
          <p className="mt-6 text-lg leading-8 text-slate">
            In production, all clinical, nutrition, exercise, pregnancy and baby development content should be reviewed for each target country by qualified professionals.
          </p>
        </article>
      </main>
    </PublicShell>
  );
}
