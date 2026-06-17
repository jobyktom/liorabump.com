import type { Metadata } from "next";
import { PublicShell } from "@/components/site-shell";

export const metadata: Metadata = { title: "Privacy Policy" };

export default function PrivacyPage() {
  return <LegalPage title="Privacy Policy" body="LioraBump is private by default. Users should control partner and family sharing, uploads, exports, deletion and consent. Production deployment must include a lawyer-reviewed GDPR policy, cookie policy and data processing details." />;
}

function LegalPage({ title, body }: { title: string; body: string }) {
  return (
    <PublicShell>
      <main className="section-pad">
        <article className="container-page max-w-3xl">
          <h1 className="font-serif text-5xl font-bold text-navy">{title}</h1>
          <p className="mt-6 text-lg leading-8 text-slate">{body}</p>
        </article>
      </main>
    </PublicShell>
  );
}
