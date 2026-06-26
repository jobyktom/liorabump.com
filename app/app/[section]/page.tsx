import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getServerSession } from "next-auth";
import { FileText, ImageIcon, Trash2 } from "lucide-react";
import { deleteMediaAsset, renameMediaAsset } from "@/app/actions/media-assets";
import { authOptions } from "@/auth";
import { AppRecordForm } from "@/components/app-record-form";
import { MediaUploadForm } from "@/components/media-upload-form";
import { PublicShell } from "@/components/site-shell";
import { MedicalNotice } from "@/components/ui";
import { getCurrentFamily, getMediaAssetCount, getSectionRecords } from "@/lib/app-data";
import { appSections, type AppSectionSlug } from "@/lib/app-sections";
import { getUploadLimit, hasMediaUpload } from "@/lib/media";

export function generateStaticParams() {
  return Object.keys(appSections).map((section) => ({ section }));
}

export async function generateMetadata({ params }: { params: Promise<{ section: string }> }): Promise<Metadata> {
  const { section } = await params;
  const details = appSections[section as AppSectionSlug];
  return details ? { title: details.title, description: details.description } : {};
}

export default async function AppSectionPage({ params }: { params: Promise<{ section: string }> }) {
  const { section } = await params;
  const details = appSections[section as AppSectionSlug];
  if (!details) notFound();

  const Icon = details.icon;
  const [current, records, session] = await Promise.all([getCurrentFamily(), getSectionRecords(section), getServerSession(authOptions)]);
  const isSignedIn = Boolean(session?.user?.email);
  const mediaCount = current ? await getMediaAssetCount(current.family.id) : 0;
  const uploadLimit = getUploadLimit(current?.family.subscription_plan);
  const planName = `${current?.family.subscription_plan ?? "free"} plan`;

  return (
    <PublicShell>
      <main className="section-pad bg-mist">
        <section className="container-page grid gap-8 md:grid-cols-[0.9fr_1.1fr]">
          <div>
            <Link href="/app" className="text-sm font-bold text-coral">
              Back to dashboard
            </Link>
            <div className="mt-6 grid h-16 w-16 place-items-center rounded-2xl bg-lavender text-navy">
              <Icon className="h-8 w-8" />
            </div>
            <h1 className="mt-5 font-serif text-5xl font-bold text-navy">{details.title}</h1>
            <p className="mt-5 text-lg leading-8 text-slate">{details.description}</p>
            <div className="mt-8">
              <MedicalNotice />
            </div>
          </div>
          <div className="card p-6 md:p-8">
            <h2 className="font-serif text-3xl font-bold text-navy">Save a record</h2>
            {current ? (
              <>
                {!mediaOnlySection(section) ? <AppRecordForm section={section} titleLabel={recordTitleLabel(section)} /> : null}
                {hasMediaUpload(section) ? (
                  <MediaUploadForm
                    section={section}
                    currentCount={mediaCount}
                    uploadLimit={uploadLimit}
                    planName={planName}
                  />
                ) : null}
              </>
            ) : (
              <div className="mt-6 rounded-2xl bg-peach/70 p-5 text-sm leading-6 text-navy">
                {isSignedIn ? "Complete onboarding before saving records here." : "Sign in and complete onboarding before saving records here."}
                <div className="mt-4 flex flex-wrap gap-3">
                  {isSignedIn ? null : (
                    <Link href="/login" className="rounded-xl bg-navy px-4 py-3 font-bold text-white">
                      Sign in
                    </Link>
                  )}
                  <Link href="/app/onboarding" className={`${isSignedIn ? "bg-navy text-white" : "bg-white text-navy"} rounded-xl px-4 py-3 font-bold`}>
                    Continue setup
                  </Link>
                </div>
              </div>
            )}
          </div>
        </section>
        <section className="container-page mt-8">
          <div className="card p-6 md:p-8">
            <div className="flex items-center justify-between gap-4">
              <h2 className="font-serif text-3xl font-bold text-navy">Saved records</h2>
              <span className="rounded-full bg-peach px-3 py-1 text-xs font-bold uppercase tracking-wide text-coral">
                {records.length} total
              </span>
            </div>
            {records.length ? (
              <div className="mt-6 grid gap-4 md:grid-cols-2">
                {records.map((record) => (
                  <article key={record.id} className="rounded-2xl bg-background p-5">
                    {record.href && record.isImage ? (
                      <a
                        href={record.href}
                        target="_blank"
                        rel="noreferrer"
                        aria-label={`Open ${record.title}`}
                        className="mb-4 aspect-[4/3] w-full rounded-2xl object-cover"
                        style={{
                          display: "block",
                          backgroundImage: `url(${record.href})`,
                          backgroundSize: "cover",
                          backgroundPosition: "center"
                        }}
                      />
                    ) : null}
                    {record.isMedia && !record.isImage ? (
                      <div className="mb-4 flex aspect-[4/3] items-center justify-center rounded-2xl bg-mist text-navy">
                        {record.isPdf ? <FileText className="h-10 w-10" /> : <ImageIcon className="h-10 w-10" />}
                      </div>
                    ) : null}
                    <p className="text-xs font-bold uppercase tracking-wide text-coral">{record.meta}</p>
                    <h3 className="mt-2 font-serif text-2xl font-bold text-navy">{record.title}</h3>
                    <p className="mt-3 text-sm leading-6 text-slate">{record.detail}</p>
                    {record.isMedia ? (
                      <div className="mt-5 grid gap-3">
                        <form action={renameMediaAsset} className="grid gap-2">
                          <input type="hidden" name="id" value={record.id} />
                          <input type="hidden" name="section" value={section} />
                          <label className="text-xs font-bold uppercase tracking-wide text-slate" htmlFor={`caption-${record.id}`}>
                            Rename
                          </label>
                          <div className="grid gap-2 sm:grid-cols-[1fr_auto]">
                            <input
                              id={`caption-${record.id}`}
                              name="caption"
                              defaultValue={record.title}
                              className="h-12 rounded-xl border border-navy/10 bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-lavenderDeep"
                            />
                            <button type="submit" className="h-12 rounded-xl bg-white px-4 text-sm font-bold text-navy">
                              Save
                            </button>
                          </div>
                        </form>
                        <div className="flex flex-wrap gap-2">
                          {record.href ? (
                            <a
                              href={record.href}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex h-11 items-center rounded-xl bg-navy px-4 text-sm font-bold text-white"
                            >
                              {record.actionLabel ?? "Open"}
                            </a>
                          ) : null}
                          <form action={deleteMediaAsset}>
                            <input type="hidden" name="id" value={record.id} />
                            <input type="hidden" name="section" value={section} />
                            <button
                              type="submit"
                              className="inline-flex h-11 items-center gap-2 rounded-xl bg-peach px-4 text-sm font-bold text-coral"
                            >
                              <Trash2 className="h-4 w-4" />
                              Delete
                            </button>
                          </form>
                        </div>
                      </div>
                    ) : null}
                  </article>
                ))}
              </div>
            ) : (
              <p className="mt-6 rounded-2xl bg-background p-5 text-sm leading-6 text-slate">
                No saved records yet. Add one above and it will be written to Supabase.
              </p>
            )}
          </div>
        </section>
      </main>
    </PublicShell>
  );
}

function recordTitleLabel(section: string) {
  const map: Record<string, string> = {
    calendar: "Appointment title",
    journal: "Entry title",
    "birth-plan": "Preference",
    "scan-uploads": "Scan label",
    album: "Photo label",
    "baby-profile": "Milestone title",
    "kick-counter": "Session title"
  };

  return map[section] ?? "Record title";
}

function mediaOnlySection(section: string) {
  return section === "album" || section === "scan-uploads";
}
