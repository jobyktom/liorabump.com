import type { Metadata } from "next";
import Link from "next/link";
import { PublicShell } from "@/components/site-shell";

export const metadata: Metadata = { title: "Privacy Policy", description: "How LioraBump handles personal information." };

const updatedAt = "21 June 2026";

export default function PrivacyPage() {
  return (
    <PublicShell>
      <main className="section-pad">
        <article className="container-page max-w-3xl text-slate">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-peachDeep">Legal</p>
          <h1 className="mt-4 font-serif text-5xl font-bold text-navy">Privacy Policy</h1>
          <p className="mt-5 text-sm font-semibold">Last updated: {updatedAt}</p>
          <div className="mt-8 space-y-8 text-base leading-8">
            <Section title="Who this policy is for"><p>This policy explains how LioraBump handles personal information when you use the website and app. For privacy questions or requests, email <a className="font-semibold text-coral underline underline-offset-4" href="mailto:jobyktom@gmail.com">jobyktom@gmail.com</a>.</p></Section>
            <Section title="Information we collect"><p>We process account details such as name and email address; family workspace details such as due date and country; content you choose to add, including notes, appointments, health-tracker entries and uploaded photos or documents; invitation details; subscription identifiers from Stripe; and messages you send through Contact Us. We also use essential authentication data needed to keep you signed in securely.</p></Section>
            <Section title="Why we use it"><p>We use this information to provide your private workspace, authenticate you, enable family sharing you choose, store and retrieve uploaded files, provide support, prevent misuse, and manage subscriptions. Where required by data-protection law, our basis is performance of our contract with you, legitimate interests in operating a secure service, compliance with legal obligations, or your explicit consent for health-related information you choose to enter.</p></Section>
            <Section title="Health and family information"><p>Pregnancy, health and baby information can be sensitive. Do not use LioraBump for emergencies or to send information you do not want stored. Share family information only with consent. We do not sell health information or use it for advertising decisions.</p></Section>
            <Section title="Service providers"><p>We use Supabase for authentication, database and private file storage; Stripe for payments and subscription billing; Hostinger to host the website; and, when Contact Us email is configured, Resend to deliver support messages. These providers process data only as needed to provide their services to us. Their processing locations and safeguards are governed by their own data-processing terms.</p></Section>
            <Section title="Sharing"><p>Your workspace is private by default. Information is shared with invited family members only when the workspace owner chooses to invite them and the recipient accepts. We may also disclose information where required by law, to protect safety, or in connection with a lawful business transfer.</p></Section>
            <Section title="Retention and deletion"><p>We keep account and workspace information while your account remains active. You can export or delete workspace data in Settings. We delete or anonymise information after deletion where practical, except for information we must retain for legal, fraud-prevention, billing or security reasons. Contact messages may remain in our support mailbox for up to 24 months.</p></Section>
            <Section title="Your rights"><p>Depending on your location, you may have rights to access, correct, delete, restrict or object to processing, receive a portable copy, and withdraw consent. Start with the export and deletion tools in Settings or email us. You may also have the right to complain to your local data-protection authority. In the UK, this is the Information Commissioner's Office.</p></Section>
            <Section title="Cookies and security"><p>We use essential cookies or similar storage required for sign-in and service security. With your consent, we use Google Analytics to understand anonymous public-site usage and signup paths; we do not send health entries, due dates, names or email addresses to Analytics. Stripe may use its own technology during checkout. We use reasonable technical and organisational safeguards, but no online system can guarantee absolute security. Keep your password private and tell us promptly if you suspect unauthorised access.</p></Section>
            <Section title="Changes"><p>We may update this policy when our data practices, providers or legal obligations change. The current version and update date will always appear on this page. See our <Link className="font-semibold text-coral underline underline-offset-4" href="/terms">Terms and Conditions</Link> for the rules of using LioraBump.</p></Section>
            <p className="rounded-2xl bg-peach/60 p-5 text-sm leading-6 text-navy">This policy reflects the current product design, but it is not a substitute for legal advice. Before a public launch, have a qualified privacy professional review your business identity, data locations, retention periods, cookie use and applicable UK GDPR or other regional requirements.</p>
          </div>
        </article>
      </main>
    </PublicShell>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return <section><h2 className="font-serif text-3xl font-bold text-navy">{title}</h2><div className="mt-3">{children}</div></section>;
}
