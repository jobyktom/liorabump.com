import type { Metadata } from "next";
import { PublicShell } from "@/components/site-shell";
import { OnboardingForm } from "@/components/onboarding-form";
import { MedicalNotice } from "@/components/ui";

export const metadata: Metadata = {
  title: "Onboarding",
  description: "Create your LioraBump pregnancy journey with due date, partner invite, privacy and notifications."
};

export default function OnboardingPage() {
  return (
    <PublicShell>
      <main className="section-pad">
        <div className="container-page grid gap-8 md:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-peachDeep">Onboarding</p>
            <h1 className="mt-4 font-serif text-5xl font-bold leading-tight text-navy">Create your private family journey.</h1>
            <p className="mt-5 text-lg leading-8 text-slate">
              Save your role, due date, privacy preference and family invite into your private Supabase-backed workspace.
            </p>
            <div className="mt-8">
              <MedicalNotice />
            </div>
          </div>
          <OnboardingForm />
        </div>
      </main>
    </PublicShell>
  );
}
