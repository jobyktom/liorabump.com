import type { Metadata } from "next";
import Link from "next/link";
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
          <SectionHeading eyebrow="Nutrition" title="Pregnancy food guide" text="A practical UK-first starting point for safer food choices, with room for your own midwife or dietitian's advice." />
          <div className="grid gap-6 md:grid-cols-3">
            <article className="card p-6">
              <h2 className="font-serif text-2xl font-bold text-navy">Everyday foundations</h2>
              <CheckList items={["Regular meals and fluids", "Fruit and vegetables washed carefully", "Food cooked and stored safely", "Supplements discussed with your care team"]} />
            </article>
            <article className="card p-6">
              <h2 className="font-serif text-2xl font-bold text-navy">Avoid or check first</h2>
              <CheckList items={["Unpasteurised foods", "High-mercury fish", "Raw or undercooked meat", "Alcohol and vitamin A guidance"]} />
            </article>
            <article className="card p-6">
              <h2 className="font-serif text-2xl font-bold text-navy">Need more detail?</h2>
              <p className="mt-3 text-sm leading-6 text-slate">Read our sourced UK food-safety guide for practical explanations, or speak to your midwife, GP or dietitian about personal dietary needs.</p>
              <Link href="/blog/foods-to-avoid-in-pregnancy" className="mt-5 inline-flex font-bold text-coral underline underline-offset-4">Read the food-safety guide</Link>
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
