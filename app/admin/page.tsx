import type { Metadata } from "next";
import { BarChart3, BellRing, FileText, Megaphone, Newspaper, UsersRound } from "lucide-react";
import { PublicShell } from "@/components/site-shell";
import { sponsorOffers } from "@/lib/content";

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
          <section className="card mt-8 overflow-hidden">
            <div className="border-b border-navy/10 p-6">
              <h2 className="font-serif text-3xl font-bold text-navy">Sponsor performance</h2>
            </div>
            <div className="divide-y divide-navy/10">
              {sponsorOffers.map((offer) => (
                <div key={offer.title} className="grid gap-2 p-6 md:grid-cols-4">
                  <strong className="text-navy">{offer.title}</strong>
                  <span className="text-slate">{offer.brand}</span>
                  <span className="text-peachDeep">{offer.label}</span>
                  <span className="font-bold text-lavenderDeep">{offer.metric}</span>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>
    </PublicShell>
  );
}
