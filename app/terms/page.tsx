import type { Metadata } from "next";
import Link from "next/link";
import { PublicShell } from "@/components/site-shell";

export const metadata: Metadata = { title: "Terms and Conditions", description: "Terms for using LioraBump." };

const updatedAt = "21 June 2026";

export default function TermsPage() {
  return (
    <PublicShell>
      <main className="section-pad">
        <article className="container-page max-w-3xl text-slate">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-peachDeep">Legal</p>
          <h1 className="mt-4 font-serif text-5xl font-bold text-navy">Terms and Conditions</h1>
          <p className="mt-5 text-sm font-semibold">Last updated: {updatedAt}</p>
          <div className="mt-8 space-y-8 text-base leading-8">
            <Section title="About LioraBump"><p>LioraBump is a private pregnancy, family-planning and memory-keeping service. These terms explain the rules for using our website, account features, uploads and paid plans. By creating an account or using the service, you agree to them.</p></Section>
            <Section title="Educational information, not medical care"><p>LioraBump provides general educational information. It does not provide medical diagnosis, treatment or emergency care, and it is not a substitute for a doctor, midwife, pharmacist, health visitor or other qualified professional. Seek urgent medical help if you are worried about your health, pregnancy, baby or mental wellbeing.</p></Section>
            <Section title="Your account and family workspace"><p>Keep your login details secure and provide accurate account information. You are responsible for activity in your workspace and for inviting only people you trust. The workspace owner controls family sharing, invitations, billing and deletion. Do not upload content that is unlawful, infringes another person&apos;s rights, or contains another person&apos;s private information without their permission.</p></Section>
            <Section title="Your content"><p>You retain ownership of the notes, photographs, scans and other content you upload. You give us a limited permission to store, process and display that content only to operate the service for you and the people you choose to share it with. You can export or delete your workspace through Settings, subject to limited retention required by law or for security.</p></Section>
            <Section title="Paid plans and cancellation"><p>Paid plans are processed by Stripe. Prices, billing intervals and included features are shown at checkout. Your subscription renews until cancelled. The workspace owner can use the Stripe billing portal in Settings to manage payment details or cancel; cancellation takes effect at the end of the current paid period unless Stripe states otherwise. We do not promise refunds except where required by applicable law or expressly agreed.</p></Section>
            <Section title="Acceptable use"><p>Do not misuse the service, attempt to gain unauthorised access, interfere with its operation, upload malware, scrape private data, or use LioraBump to provide professional healthcare advice to others. We may suspend or restrict access where reasonably necessary to protect users, comply with law or address misuse.</p></Section>
            <Section title="Availability and liability"><p>We work to keep LioraBump available and secure, but online services can be interrupted. To the extent permitted by law, we are not liable for indirect loss, loss of data caused by circumstances outside our reasonable control, or reliance on educational content as medical advice. Nothing in these terms excludes liability that cannot legally be excluded, including your statutory consumer rights.</p></Section>
            <Section title="Changes and contact"><p>We may update these terms when the service, law or security requirements change. We will publish the new date here and, where material, give notice in the service. For questions, contact <a className="font-semibold text-coral underline underline-offset-4" href="mailto:jobyktom@gmail.com">jobyktom@gmail.com</a>. Read our <Link className="font-semibold text-coral underline underline-offset-4" href="/privacy-policy">Privacy Policy</Link> for information about personal data.</p></Section>
            <p className="rounded-2xl bg-peach/60 p-5 text-sm leading-6 text-navy">Before a public launch, have a qualified lawyer review these terms and add the legal business name, trading address, governing law and any consumer-law disclosures that apply to your business.</p>
          </div>
        </article>
      </main>
    </PublicShell>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return <section><h2 className="font-serif text-3xl font-bold text-navy">{title}</h2><div className="mt-3">{children}</div></section>;
}
