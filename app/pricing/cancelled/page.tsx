import Link from "next/link";
import { PublicShell } from "@/components/site-shell";

export default function PricingCancelledPage() {
  return (
    <PublicShell>
      <main className="section-pad">
        <section className="container-page max-w-2xl text-center">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-coral">Checkout cancelled</p>
          <h1 className="mt-4 font-serif text-5xl font-bold text-navy">No worries. Your journey is still here.</h1>
          <p className="mt-5 text-lg leading-8 text-slate">You can continue with the free plan or choose Premium/Family whenever you are ready.</p>
          <Link href="/pricing" className="mt-8 inline-flex h-14 items-center rounded-2xl bg-navy px-6 text-sm font-bold text-white">
            Back to pricing
          </Link>
        </section>
      </main>
    </PublicShell>
  );
}
