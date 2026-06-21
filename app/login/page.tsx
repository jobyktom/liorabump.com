import type { Metadata } from "next";
import { AuthForm } from "@/components/auth-form";
import { PublicShell } from "@/components/site-shell";

export const metadata: Metadata = {
  title: "Sign in",
  description: "Sign in to your LioraBump account.",
  robots: { index: false, follow: false }
};

export default function LoginPage() {
  return (
    <PublicShell>
      <main className="section-pad">
        <section className="container-page grid gap-8 md:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-coral">Welcome back</p>
            <h1 className="mt-4 font-serif text-5xl font-bold text-navy">Sign in to your private journey.</h1>
            <p className="mt-5 text-lg leading-8 text-slate">
              Access your pregnancy dashboard, memories, appointments and partner sharing.
            </p>
          </div>
          <AuthForm mode="login" />
        </section>
      </main>
    </PublicShell>
  );
}
