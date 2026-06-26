import type { Metadata } from "next";
import Link from "next/link";
import { CalendarDays, Camera, ChevronRight, HeartHandshake, HeartPulse, Timer, UsersRound } from "lucide-react";
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
  const dashboard = await getDashboardData();
  const displayName = getDisplayName(dashboard?.current.profile?.full_name, dashboard?.current.email);
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
            <nav className="mt-6 space-y-2 text-sm">
              {["Dashboard", "Health tracker", "Food guide", "Journal", "Scan uploads", "Kick counter", "Birth plan", "Baby profile", "Couple sync", "Settings"].map((item) => (
                <Link
                  key={item}
                  href={item === "Dashboard" ? "/app" : `/app/${item.toLowerCase().replaceAll(" ", "-")}`}
                  className="flex items-center justify-between rounded-xl px-3 py-3 text-slate hover:bg-background hover:text-navy"
                >
                  {item}
                  <ChevronRight className="h-4 w-4" />
                </Link>
              ))}
            </nav>
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
            ) : (
              <div className="card p-6 md:p-8">
                <h2 className="font-serif text-3xl font-bold text-navy">Set up your family workspace</h2>
                <p className="mt-4 text-sm leading-6 text-slate">
                  Sign in and complete onboarding to load your pregnancy dashboard.
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <Link href="/login" className="rounded-xl bg-navy px-4 py-3 font-bold text-white">
                    Sign in
                  </Link>
                  <Link href="/app/onboarding" className="rounded-xl bg-white px-4 py-3 font-bold text-navy">
                    Onboarding
                  </Link>
                </div>
              </div>
            )}

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
                {dashboard ? (
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
                ) : (
                  <div className="mt-5 rounded-2xl bg-peach/70 p-5 text-sm leading-6 text-navy">
                    Sign in and complete onboarding to see live family data here.
                    <div className="mt-4 flex flex-wrap gap-3">
                      <Link href="/login" className="rounded-xl bg-navy px-4 py-3 font-bold text-white">
                        Sign in
                      </Link>
                      <Link href="/app/onboarding" className="rounded-xl bg-white px-4 py-3 font-bold text-navy">
                        Onboarding
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {dashboard ? (
              <div className="grid gap-6 md:grid-cols-3">
                <SummaryCard title="Journal entries" value={dashboard.recentJournal.length} href="/app/journal" />
                <SummaryCard title="Media records" value={dashboard.recentMedia.length} href="/app/album" />
                <SummaryCard title="Milestones" value={dashboard.recentMilestones.length} href="/app/baby-profile" />
              </div>
            ) : null}

            <div className="grid gap-6 md:grid-cols-4">
              <ToolCard icon={Timer} title="Kick counter" text="Track movement sessions and know when to call your maternity unit." />
              <ToolCard icon={CalendarDays} title="Appointment calendar" text="Scans, blood tests, checkups and questions for your midwife." />
              <ToolCard icon={Camera} title="Memory album" text="Photos, letters, scan images and private family sharing." />
              <ToolCard icon={HeartHandshake} title="Couple sync" text="Share support tasks, preparation and appointment questions." />
            </div>
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
