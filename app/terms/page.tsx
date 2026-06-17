import type { Metadata } from "next";
import { PublicShell } from "@/components/site-shell";

export const metadata: Metadata = { title: "Terms" };

export default function TermsPage() {
  return (
    <PublicShell>
      <main className="section-pad">
        <article className="container-page max-w-3xl">
          <h1 className="font-serif text-5xl font-bold text-navy">Terms</h1>
          <p className="mt-6 text-lg leading-8 text-slate">
            These placeholder terms describe a subscription pregnancy and family memories platform. Replace with lawyer-reviewed terms before accepting payments, uploads or user accounts.
          </p>
        </article>
      </main>
    </PublicShell>
  );
}
