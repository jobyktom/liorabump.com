import type { Metadata } from "next";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { CalendarDays, Camera, HeartHandshake, HeartPulse, Timer, UsersRound } from "lucide-react";
import { authOptions } from "@/auth";
import { AppNav } from "@/components/app-nav";
import { PublicShell } from "@/components/site-shell";
import { MedicalNotice } from "@/components/ui";
import { appActions } from "@/lib/content";
import { appSections } from "@/lib/app-sections";
import { getDashboardData } from "@/lib/app-data";

export const metadata: Metadata = {
  title: "App Dashboard",
  description: "LioraBump pregnancy dashboard, health tracker, memory album and partner mode."
};

export default async function AppDashboardPage() {
  const [dashboard, session] = await Promise.all([getDashboardData(), getServerSession(authOptions)]);
  const isSignedIn = Boolean(session?.user?.email);
  const displayName = getDisplayName(dashboard?.current.profile?.full_name ?? session?.user?.name, dashboard?.current.email ?? session?.user?.email);
  const upcomingAppointment = dashboard?.upcomingAppointments[0];
  const pregnancy = dashboard?.pregnancy;
  const stats = [
    ["Trimester", pregnancy?.trimester ?? "Add due date"],
    ["Baby size", pregnancy?.babySize ?? "Add due date"],
    ["Next checkup", upcomingAppointment ? formatDate(upcomingAppointment.starts_at) : "No appointment"],
    ["Shared with", `${dashboard?.inviteCount ?? 0} invite${dashboard?.inviteCount === 1 ? "" : "s"}`]
  ];

  return (
    <PublicShell>
      <main className="bg-mist py-10 md:py-16">
        <div className="container-page grid gap-6 lg:grid-cols-[260px_1fr]">
          <aside className="card hidden p-5 lg:block">
            <h1 className="font-serif text-2xl font-bold text-navy">LioraBump app</h1>
            {dashboard ? (
              <AppNav />
            ) : (
              <p className="mt-5 rounded-2xl bg-background p-4 text-sm leading-6 text-slate">
                {isSignedIn
                  ? "Complete setup once, then your private app sections will appear here."
                  : "Sign in or create an account to start your private workspace."}
              </p>
            )}
          </aside>
          <section className="space-y-6">
            {dashboard ? (
              <div className="card p-6 md:p-8">
                <div className="flex flex-col justify-between gap-5 md:flex-row md:items-center">
                  <div>
                    <p className="text-sm font-bold uppercase tracking-wide text-peachDeep">Good evening, {displayName}</p>
                    <h2 className="mt-2 font-serif text-4xl font-bold text-navy">
                      {pregnancy?.week ? `Week ${pregnancy.week}` : "Journey"} with {dashboard.current.family.baby_nickname}
                    </h2>
                    <p className="mt-2 text-slate">
                      {pregnancy?.trimester && pregnancy.daysToGo !== null
                        ? `${pregnancy.trimester} trimester. ${pregnancy.daysToGo} days until your estimated due date.`
                        : "Add your due date in settings to calculate pregnancy progress."}
                    </p>
                  </div>
                  <Link href="/app/settings" className="rounded-2xl bg-navy px-5 py-4 text-center text-sm font-bold text-white">
                    Edit journey
                  </Link>
                </div>
                <div className="mt-7 h-3 rounded-full bg-mist">
                  <div
                    className="h-3 rounded-full bg-gradient-to-r from-lavenderDeep to-navy"
                    style={{ width: `${pregnancy?.progressPercent ?? 0}%` }}
                  />
                </div>
                <div className="mt-8 grid gap-4 md:grid-cols-4">
                  {stats.map(([label, value]) => (
                    <div key={label} className="rounded-2xl bg-background p-5">
                      <p className="text-xs font-bold uppercase tracking-wide text-slate">{label}</p>
                      <p className="mt-2 font-serif text-2xl font-bold text-navy">{value}</p>
                    </div>
                  ))}
                </div>
              </div>
            ) : isSignedIn ? (
              <div className="card p-6 md:p-8">
                <p className="text-sm font-bold uppercase tracking-wide text-peachDeep">Welcome, {displayName}</p>
                <h2 className="mt-2 font-serif text-4xl font-bold text-navy">Complete your family workspace.</h2>
                <p className="mt-4 max-w-3xl text-sm leading-6 text-slate">
                  You are signed in. Add your role, due date, baby nickname and privacy preference so LioraBump can build the right dashboard for your family.
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <Link href="/app/onboarding" className="rounded-xl bg-navy px-4 py-3 font-bold text-white">
                    Continue setup
                  </Link>
                </div>
              </div>
            ) : (
              <div className="card p-6 md:p-8">
                <h2 className="font-serif text-3xl font-bold text-navy">Start your family workspace</h2>
                <p className="mt-4 text-sm leading-6 text-slate">
                  Create an account or sign in to save pregnancy notes, scan uploads, appointments and partner tasks privately.
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <Link href="/login" className="rounded-xl bg-navy px-4 py-3 font-bold text-white">
                    Sign in
                  </Link>
                  <Link href="/signup" className="rounded-xl bg-white px-4 py-3 font-bold text-navy">
                    Create account
                  </Link>
                </div>
              </div>
            )}

            {dashboard ? (
              <>
                <div className="grid gap-6 md:grid-cols-[1.1fr_0.9fr]">
                  <div className="card p-6">
                    <h3 className="font-serif text-2xl font-bold text-navy">Quick actions</h3>
                    <div className="mt-5 grid gap-3 sm:grid-cols-2">
                      {appActions.map((action) => (
                        <Link
                          key={action.label}
                          href={quickActionHref(action.label)}
                          className="flex items-center gap-3 rounded-2xl bg-background p-4 text-left font-bold text-navy transition hover:bg-peach"
                        >
                          <action.icon className="h-5 w-5 text-lavenderDeep" />
                          {action.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                  <div className="card p-6">
                    <h3 className="font-serif text-2xl font-bold text-navy">Today&apos;s support</h3>
                    <ul className="mt-5 space-y-4 text-sm leading-6 text-slate">
                      <li className="flex gap-3">
                        <HeartPulse className="h-5 w-5 text-lavenderDeep" />
                        {dashboard.recentHealth[0]?.entry_type
                          ? `Latest health record: ${dashboard.recentHealth[0].entry_type.replaceAll("_", " ")}`
                          : "Add your first health note or symptom record."}
                      </li>
                      <li className="flex gap-3">
                        <UsersRound className="h-5 w-5 text-lavenderDeep" />
                        {dashboard.inviteCount ? `${dashboard.inviteCount} partner/family invite saved.` : "Invite a partner from settings when ready."}
                      </li>
                      <li className="flex gap-3">
                        <Camera className="h-5 w-5 text-lavenderDeep" />
                        {dashboard.recentMedia[0]?.caption ?? "Add a scan or bump photo to your album."}
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="grid gap-6 md:grid-cols-3">
                  <SummaryCard title="Journal entries" value={dashboard.recentJournal.length} href="/app/journal" />
                  <SummaryCard title="Media records" value={dashboard.recentMedia.length} href="/app/album" />
                  <SummaryCard title="Milestones" value={dashboard.recentMilestones.length} href="/app/baby-profile" />
                </div>

                <div className="grid gap-6 md:grid-cols-4">
                  <ToolCard icon={Timer} title="Kick counter" text="Track movement sessions and know when to call your maternity unit." />
                  <ToolCard icon={CalendarDays} title="Appointment calendar" text="Scans, blood tests, checkups and questions for your midwife." />
                  <ToolCard icon={Camera} title="Memory album" text="Photos, letters, scan images and private family sharing." />
                  <ToolCard icon={HeartHandshake} title="Couple sync" text="Share support tasks, preparation and appointment questions." />
                </div>
              </>
            ) : (
              <div className="card p-6 md:p-8">
                <h3 className="font-serif text-2xl font-bold text-navy">{isSignedIn ? "What happens next" : "A calmer setup flow"}</h3>
                <div className="mt-5 grid gap-4 md:grid-cols-3">
                  <div className="rounded-2xl bg-background p-5">
                    <p className="font-bold text-navy">1. Create your workspace</p>
                    <p className="mt-2 text-sm leading-6 text-slate">Add your role, due date and privacy preference once.</p>
                  </div>
                  <div className="rounded-2xl bg-background p-5">
                    <p className="font-bold text-navy">2. Invite your partner</p>
                    <p className="mt-2 text-sm leading-6 text-slate">They use the invite link and the invited email to join the same family workspace.</p>
                  </div>
                  <div className="rounded-2xl bg-background p-5">
                    <p className="font-bold text-navy">3. Start tracking</p>
                    <p className="mt-2 text-sm leading-6 text-slate">Your dashboard, uploads, records and couple sync unlock after setup.</p>
                  </div>
                </div>
              </div>
            )}
            <MedicalNotice />
          </section>
        </div>
      </main>
    </PublicShell>
  );
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short" }).format(new Date(value));
}

function getDisplayName(fullName?: string | null, email?: string | null) {
  if (fullName?.trim()) return fullName.trim().split(" ")[0] ?? fullName.trim();
  if (email?.includes("@")) return email.split("@")[0];
  return "there";
}

function SummaryCard({ title, value, href }: { title: string; value: number; href: string }) {
  return (
    <Link href={href} className="card block p-6 transition hover:-translate-y-1">
      <p className="text-xs font-bold uppercase tracking-wide text-coral">{title}</p>
      <p className="mt-3 font-serif text-4xl font-bold text-navy">{value}</p>
      <p className="mt-2 text-sm text-slate">View saved records</p>
    </Link>
  );
}

function ToolCard({ icon: Icon, title, text }: { icon: typeof Timer; title: string; text: string }) {
  const href = `/app/${title.toLowerCase().replaceAll(" ", "-")}`;

  return (
    <Link href={href in sectionHrefLookup ? sectionHrefLookup[href] : href} className="card block p-6 transition hover:-translate-y-1">
      <Icon className="h-6 w-6 text-lavenderDeep" />
      <h3 className="mt-4 font-serif text-2xl font-bold text-navy">{title}</h3>
      <p className="mt-3 text-sm leading-6 text-slate">{text}</p>
    </Link>
  );
}

const sectionHrefLookup: Record<string, string> = {
  "/app/appointment-calendar": "/app/calendar",
  "/app/memory-album": "/app/album"
};

function quickActionHref(label: string) {
  const map: Record<string, keyof typeof appSections> = {
    "Add photo": "album",
    Journal: "journal",
    Symptom: "health-tracker",
    Appointment: "calendar",
    "Scan upload": "scan-uploads"
  };

  return `/app/${map[label] ?? "settings"}`;
}
