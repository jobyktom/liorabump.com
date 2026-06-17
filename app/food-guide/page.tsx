import type { Metadata } from "next";
import { PublicShell } from "@/components/site-shell";
import { CheckList, MedicalNotice, SectionHeading } from "@/components/ui";

export const metadata: Metadata = {
  title: "Pregnancy Food Guide",
  description: "Educational pregnancy food guide with safe foods, foods to avoid, hydration and sponsor labels."
};

export default function FoodGuidePage() {
  return (
    <PublicShell>
      <main className="section-pad">
        <div className="container-page">
          <SectionHeading eyebrow="Nutrition" title="Pregnancy food guide" text="A practical structure for country-aware, medically reviewed food content." />
          <div className="grid gap-6 md:grid-cols-3">
            <article className="card p-6">
              <h2 className="font-serif text-2xl font-bold text-navy">Safe guide</h2>
              <CheckList items={["Hydration tracker", "Trimester meal ideas", "Healthy snack ideas", "Shopping list"]} />
            </article>
            <article className="card p-6">
              <h2 className="font-serif text-2xl font-bold text-navy">Avoid or ask first</h2>
              <CheckList items={["Unpasteurised foods", "High-mercury fish", "Undercooked meat or eggs", "Alcohol guidance"]} />
            </article>
            <article className="card p-6">
              <span className="rounded-full bg-peach px-3 py-1 text-xs font-bold text-peachDeep">Sponsored</span>
              <h2 className="mt-4 font-serif text-2xl font-bold text-navy">Recipe marketplace</h2>
              <p className="mt-3 text-sm leading-6 text-slate">Sponsor recipe cards and affiliate products must be labelled and separated from medical content.</p>
            </article>
          </div>
          <div className="mt-8">
            <MedicalNotice />
          </div>
        </div>
      </main>
    </PublicShell>
  );
}
