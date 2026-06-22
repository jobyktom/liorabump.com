import type { Metadata } from "next";
import { PublicShell } from "@/components/site-shell";
import { CheckoutButton } from "@/components/checkout-button";
import { CheckList, SectionHeading } from "@/components/ui";
import { pricingPlans } from "@/lib/pricing";

export const metadata: Metadata = {
  title: "Pricing",
  description: "Freemium, premium, family sharing and printed memory album revenue model for LioraBump."
};

export default function PricingPage() {
  return (
    <PublicShell>
      <main className="section-pad">
        <div className="container-page">
          <SectionHeading eyebrow="Simple start" title="Pricing built for a freemium launch" text="Use the free plan to grow trust, then add premium privacy, storage and export features." />
          <div className="grid gap-5 md:grid-cols-3">
            {pricingPlans.map((plan) => (
              <article key={plan.name} className={`card p-7 ${plan.name === "Premium" ? "ring-2 ring-navy" : ""}`}>
                <h2 className="font-serif text-3xl font-bold text-navy">{plan.name}</h2>
                <p className="mt-4 text-4xl font-bold text-navy">
                  {plan.price}
                  <span className="text-base font-semibold text-slate">{plan.interval}</span>
                </p>
                <div className="mt-7">
                  <CheckList items={plan.items} />
                </div>
                <div className="mt-8">
                  <CheckoutButton planId={plan.id} label={plan.id === "free" ? "Start free" : `Choose ${plan.name}`} />
                </div>
              </article>
            ))}
          </div>
        </div>
      </main>
    </PublicShell>
  );
}
