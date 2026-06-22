import type { Metadata } from "next";
import { BarChart3, BellRing, FileText, Megaphone, Newspaper, UsersRound } from "lucide-react";
import { PublicShell } from "@/components/site-shell";

export const metadata: Metadata = {
  title: "Admin Dashboard",
  description: "Admin dashboard preview for content, sponsors, notifications and analytics."
};

const adminModules = [
  { icon: FileText, title: "Week content", value: "42 drafts" },
  { icon: Newspaper, title: "SEO pages", value: "12 pages" },
  { icon: Megaphone, title: "Sponsors", value: "3 active" },
  { icon: BellRing, title: "Notifications", value: "5 campaigns" },
  { icon: UsersRound, title: "Users", value: "Prototype" },
  { icon: BarChart3, title: "Analytics", value: "Ready" }
];

export default function AdminPage() {
  return (
    <PublicShell>
      <main className="bg-mist py-12">
        <div className="container-page">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-peachDeep">Admin preview</p>
          <h1 className="mt-4 font-serif text-5xl font-bold text-navy">Content and sponsor operations</h1>
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {adminModules.map((module) => (
              <article key={module.title} className="card p-6">
                <module.icon className="h-6 w-6 text-lavenderDeep" />
                <h2 className="mt-4 font-serif text-2xl font-bold text-navy">{module.title}</h2>
                <p className="mt-2 text-sm font-bold text-peachDeep">{module.value}</p>
              </article>
            ))}
          </div>
        </div>
      </main>
    </PublicShell>
  );
}
