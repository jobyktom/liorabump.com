import type { Metadata } from "next";
import { ContactForm } from "@/components/contact-form";
import { PublicShell } from "@/components/site-shell";

export const metadata: Metadata = {
  title: "Contact",
  description: "Contact LioraBump."
};

export default function ContactPage() {
  return (
    <PublicShell>
      <main className="section-pad">
        <section className="container-page grid gap-8 md:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-coral">Contact</p>
            <h1 className="mt-4 font-serif text-5xl font-bold text-navy">Talk to LioraBump.</h1>
            <p className="mt-5 text-lg leading-8 text-slate">
              This form is ready for an email provider such as Resend or SendGrid in production.
            </p>
          </div>
          <ContactForm />
        </section>
      </main>
    </PublicShell>
  );
}
