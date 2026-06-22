import type { Metadata } from "next";
import { RequestPasswordResetForm } from "@/components/password-recovery-forms";
import { PublicShell } from "@/components/site-shell";

export const metadata: Metadata = {
  title: "Reset password",
  description: "Request a secure LioraBump password-reset email.",
  robots: { index: false, follow: false }
};

export default function ForgotPasswordPage() {
  return (
    <PublicShell>
      <main className="section-pad">
        <section className="container-page grid gap-8 md:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-coral">Account recovery</p>
            <h1 className="mt-4 font-serif text-5xl font-bold text-navy">Reset your password.</h1>
            <p className="mt-5 text-lg leading-8 text-slate">Enter the email address for your LioraBump account. We will send a secure, time-limited reset link if an account matches it.</p>
          </div>
          <RequestPasswordResetForm />
        </section>
      </main>
    </PublicShell>
  );
}
