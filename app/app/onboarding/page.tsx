import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { PublicShell } from "@/components/site-shell";
import { OnboardingForm } from "@/components/onboarding-form";
import { MedicalNotice } from "@/components/ui";
import { getCurrentFamily } from "@/lib/app-data";

export const metadata: Metadata = {
  title: "Onboarding",
  description: "Create your LioraBump pregnancy journey with due date, partner invite, privacy and notifications."
};

export default async function OnboardingPage() {
  const [session, current] = await Promise.all([getServerSession(authOptions), getCurrentFamily()]);
  if (current) redirect("/app");

  const isSignedIn = Boolean(session?.user?.email);

  return (
    <PublicShell>
      <main className="section-pad">
        <div className="container-page grid gap-8 md:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-peachDeep">Onboarding</p>
            <h1 className="mt-4 font-serif text-5xl font-bold leading-tight text-navy">Create your private family journey.</h1>
            <p className="mt-5 text-lg leading-8 text-slate">
              Save your role, due date, privacy preference and family invite into your private LioraBump workspace.
            </p>
            <div className="mt-8">
              <MedicalNotice />
            </div>
          </div>
          {isSignedIn ? (
            <OnboardingForm />
          ) : (
            <div className="card self-start p-6 md:p-8">
              <h2 className="font-serif text-3xl font-bold text-navy">Sign in first</h2>
              <p className="mt-4 text-sm leading-6 text-slate">
                Your workspace is linked to your account, so sign in or create an account before saving onboarding details.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link href="/login?next=/app/onboarding" className="rounded-xl bg-navy px-4 py-3 font-bold text-white">
                  Sign in
                </Link>
                <Link href="/signup?next=/app/onboarding" className="rounded-xl bg-white px-4 py-3 font-bold text-navy">
                  Create account
                </Link>
              </div>
            </div>
          )}
        </div>
      </main>
    </PublicShell>
  );
}
