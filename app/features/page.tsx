import type { Metadata } from "next";
import { PublicShell } from "@/components/site-shell";
import { CheckList, LifestyleImage, MedicalNotice, SectionHeading } from "@/components/ui";
import { featureCards } from "@/lib/content";

export const metadata: Metadata = {
  title: "Features",
  description: "Pregnancy tracker, health records, food guidance, wellbeing, memory album, partner mode and baby milestones."
};

export default function FeaturesPage() {
  return (
    <PublicShell>
      <main>
        <section className="section-pad">
          <div className="container-page grid gap-10 md:grid-cols-[0.95fr_1.05fr] md:items-center">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-peachDeep">Feature system</p>
              <h1 className="mt-4 font-serif text-5xl font-bold leading-tight text-navy md:text-6xl">Everything a family journey needs, shaped into one calm app.</h1>
              <p className="mt-5 text-lg leading-8 text-slate">
                LioraBump brings tracking, guidance, memories, partner support and privacy controls into a single mobile-first experience.
              </p>
            </div>
            <LifestyleImage
              src="/images/liorabump-hero-generated.png"
              alt="Expecting parents sharing a calm supportive pregnancy moment in a warm cream room"
              className="min-h-[420px]"
            />
          </div>
        </section>
        <section className="bg-mist section-pad">
          <div className="container-page grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {featureCards.map((feature) => (
              <article key={feature.title} className="card p-6">
                <feature.icon className="h-7 w-7 text-lavenderDeep" />
                <h2 className="mt-5 font-serif text-2xl font-bold text-navy">{feature.title}</h2>
                <p className="mt-3 text-sm leading-6 text-slate">{feature.text}</p>
              </article>
            ))}
          </div>
        </section>
        <section className="section-pad">
          <div className="container-page grid gap-8 md:grid-cols-2">
            <div>
              <SectionHeading title="Built around the moments that matter" text="Start with a private workspace, then use the tools that fit your pregnancy and family rhythm." />
            </div>
            <div className="card p-8">
              <CheckList
                items={[
                  "Secure sign-in and partner invitations",
                  "Private photo, scan and document storage",
                  "Pregnancy records, appointments and journal notes",
                  "Shared preparation tasks and family controls",
                  "Data export, workspace deletion and privacy settings",
                  "Educational pregnancy and baby guides"
                ]}
              />
            </div>
          </div>
          <div className="container-page mt-8">
            <MedicalNotice />
          </div>
        </section>
      </main>
    </PublicShell>
  );
}
