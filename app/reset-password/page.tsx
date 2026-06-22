import type { Metadata } from "next";
import { UpdatePasswordForm } from "@/components/password-recovery-forms";
import { PublicShell } from "@/components/site-shell";

export const metadata: Metadata = {
  title: "Choose a new password",
  description: "Set a new password for your LioraBump account.",
  robots: { index: false, follow: false }
};

export default function ResetPasswordPage() {
  return (
    <PublicShell>
      <main className="section-pad">
        <section className="container-page grid gap-8 md:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-coral">Account recovery</p>
            <h1 className="mt-4 font-serif text-5xl font-bold text-navy">Choose a new password.</h1>
            <p className="mt-5 text-lg leading-8 text-slate">Use a password you do not use elsewhere. This page only works after opening a current reset link from your email.</p>
          </div>
          <UpdatePasswordForm />
        </section>
      </main>
    </PublicShell>
  );
}
