import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PublicShell } from "@/components/site-shell";
import { CheckList, MedicalNotice } from "@/components/ui";
import { pregnancySources, pregnancyWeeks } from "@/lib/pregnancy-week-content";

export function generateStaticParams() {
  return pregnancyWeeks.map((item) => ({ week: `week-${item.week}` }));
}

export async function generateMetadata({ params }: { params: Promise<{ week: string }> }): Promise<Metadata> {
  const { week } = await params;
  const number = Number(week.replace("week-", ""));
  return {
    title: `Pregnancy Week ${number}: ${pregnancyWeeks[number - 1]?.title ?? "Guide"}`,
    description: pregnancyWeeks[number - 1]?.summary ?? `Educational pregnancy guide for week ${number}.`,
    robots: { index: false, follow: true }
  };
}

export default async function WeekPage({ params }: { params: Promise<{ week: string }> }) {
  const { week: weekParam } = await params;
  const number = Number(weekParam.replace("week-", ""));
  const week = pregnancyWeeks.find((item) => item.week === number);
  if (!week) notFound();

  return (
    <PublicShell>
      <main className="section-pad">
        <article className="container-page max-w-4xl">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-peachDeep">Pregnancy guide</p>
          <h1 className="mt-4 font-serif text-5xl font-bold text-navy">Pregnancy week {week.week}: {week.title}</h1>
          <p className="mt-5 max-w-3xl text-lg leading-8 text-slate">{week.summary}</p>
          <div className="my-8">
            <MedicalNotice />
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            <section className="card p-6">
              <h2 className="font-serif text-3xl font-bold text-navy">Baby development</h2>
              <p className="mt-3 leading-7 text-slate">{week.baby}</p>
            </section>
            <section className="card p-6">
              <h2 className="font-serif text-3xl font-bold text-navy">Your body</h2>
              <p className="mt-3 leading-7 text-slate">{week.body}</p>
            </section>
            <section className="card p-6">
              <h2 className="font-serif text-3xl font-bold text-navy">Care this week</h2>
              <p className="mt-3 leading-7 text-slate">{week.care}</p>
            </section>
            <section className="card p-6">
              <h2 className="font-serif text-3xl font-bold text-navy">Partner support</h2>
              <p className="mt-3 leading-7 text-slate">{week.partner}</p>
            </section>
            <section className="card p-6">
              <h2 className="font-serif text-3xl font-bold text-navy">Checklist</h2>
              <div className="mt-4">
                <CheckList items={week.checklist} />
              </div>
            </section>
          </div>
          <section className="mt-6 card p-6">
            <h2 className="font-serif text-3xl font-bold text-navy">Questions for your maternity team</h2>
            <ul className="mt-4 space-y-3 leading-7 text-slate">
              {week.questions.map((question) => <li key={question}>- {question}</li>)}
            </ul>
          </section>
          <section className="mt-6 rounded-2xl bg-warning p-6 text-sm leading-7 text-[#93000a]">
            <strong>Warning signs:</strong> {week.warning}
          </section>
          <section className="mt-6 border-t border-navy/10 pt-6">
            <h2 className="font-serif text-2xl font-bold text-navy">Information sources</h2>
            <p className="mt-2 text-sm leading-6 text-slate">This guide is based on UK NHS public guidance and is awaiting independent clinical review. Your own maternity team&apos;s advice always takes priority.</p>
            <ul className="mt-4 space-y-2 text-sm font-semibold text-coral underline underline-offset-4">
              {pregnancySources.map((source) => <li key={source.href}><a href={source.href} target="_blank" rel="noreferrer">{source.label}</a></li>)}
            </ul>
          </section>
        </article>
      </main>
    </PublicShell>
  );
}
