import { Heart, LockKeyhole, Sparkles } from "lucide-react";
import Link from "next/link";
import { PublicShell } from "@/components/site-shell";
import { ButtonLink, LifestyleImage, MedicalNotice, SectionHeading } from "@/components/ui";
import { appActions, featureCards } from "@/lib/content";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default function HomePage() {
  return (
    <PublicShell>
      <main>
        <section className="section-pad">
          <div className="container-page grid items-center gap-12 md:grid-cols-2">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-coral">Nurturing You, Welcoming Wonder</p>
              <h1 className="mt-5 font-serif text-5xl font-bold leading-[1.05] text-navy md:text-7xl">
                Carefully with you, <span className="italic text-coral">every step.</span>
              </h1>
              <p className="mt-6 max-w-xl text-lg leading-8 text-slate">
                LioraBump is a private pregnancy, baby and family journey app for tracking development,
                appointments, wellbeing, memories and partner support.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <ButtonLink href="/app/onboarding">Start your journey</ButtonLink>
                <ButtonLink href="/features" variant="secondary">Explore features</ButtonLink>
              </div>
            </div>
            <LifestyleImage
              src="/images/liorabump-hero-generated.png"
              alt="Expecting parents sharing a calm supportive pregnancy moment in a warm cream room"
              className="min-h-[460px]"
            />
          </div>
        </section>

        <section className="bg-mist section-pad">
          <div className="container-page">
            <SectionHeading
              eyebrow="Warm, clear, trustworthy"
              title="A calm command centre for pregnancy and early parenthood"
              text="Built mobile-first for mothers, partners and trusted family viewers, with privacy and medical clarity at the centre."
            />
            <div className="grid gap-5 md:grid-cols-4">
              {featureCards.slice(0, 4).map((feature) => (
                <article key={feature.title} className="card p-6">
                  <div className="mb-5 grid h-12 w-12 place-items-center rounded-full bg-lavender text-navy">
                    <feature.icon className="h-5 w-5" />
                  </div>
                  <h3 className="font-serif text-xl font-semibold text-navy">{feature.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-slate">{feature.text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section-pad">
          <div className="container-page grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="card p-6 md:p-8">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-peachDeep">Today</p>
                  <h2 className="mt-1 font-serif text-3xl font-bold text-navy">Your pregnancy dashboard</h2>
                </div>
                <div className="rounded-full bg-safe px-4 py-2 text-sm font-bold text-navy">Due date countdown</div>
              </div>
              <div className="mt-6 h-3 rounded-full bg-mist">
                <div className="h-3 w-[57%] rounded-full bg-gradient-to-r from-lavenderDeep to-navy" />
              </div>
              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                {["Weekly development guidance", "Upcoming appointments", "Partner support prompts", "Wellbeing reminders"].map((item) => (
                  <div key={item} className="rounded-2xl bg-background p-5 text-sm font-medium text-slate">
                    {item}
                  </div>
                ))}
              </div>
              <div className="mt-6 flex flex-wrap gap-3">
                {appActions.map((action) => (
                  <Link
                    key={action.label}
                    href={homeQuickActionHref(action.label)}
                    className="inline-flex items-center gap-2 rounded-2xl bg-navy px-4 py-3 text-sm font-bold text-white transition hover:bg-navySoft"
                  >
                    <action.icon className="h-4 w-4" />
                    {action.label}
                  </Link>
                ))}
              </div>
            </div>
            <div className="space-y-5">
              <MedicalNotice />
              <div className="card p-6">
                <div className="flex items-center gap-3">
                  <LockKeyhole className="h-6 w-6 text-lavenderDeep" />
                  <h3 className="font-serif text-2xl font-bold text-navy">Private by default</h3>
                </div>
                <p className="mt-3 text-sm leading-6 text-slate">
                  Photos, scan images, hospital letters and baby records are designed around explicit consent,
                  controlled sharing and user-owned deletion.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="section-pad bg-navy text-white">
          <div className="container-page text-center">
            <Heart className="mx-auto mb-5 h-10 w-10 text-rose" />
            <h2 className="mx-auto max-w-3xl font-serif text-4xl font-bold md:text-6xl">Ready for your beautiful beginning?</h2>
            <p className="mx-auto mt-5 max-w-xl text-white/75">Start with the web app today, then extend into iOS and Android using the same product model.</p>
            <div className="mt-8">
              <ButtonLink href="/app/onboarding" variant="secondary">
                <Sparkles className="h-4 w-4" />
                Create your plan
              </ButtonLink>
            </div>
          </div>
        </section>
      </main>
    </PublicShell>
  );
}

function homeQuickActionHref(label: string) {
  const map: Record<string, string> = {
    "Add photo": "/app/album",
    Journal: "/app/journal",
    Symptom: "/app/health-tracker",
    Appointment: "/app/calendar",
    "Scan upload": "/app/scan-uploads"
  };

  return map[label] ?? "/app";
}
