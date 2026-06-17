import Link from "next/link";
import { PublicShell } from "@/components/site-shell";

export default function PricingSuccessPage() {
  return (
    <PublicShell>
      <main className="section-pad">
        <section className="container-page max-w-2xl text-center">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-coral">Subscription started</p>
          <h1 className="mt-4 font-serif text-5xl font-bold text-navy">Welcome to LioraBump Premium.</h1>
          <p className="mt-5 text-lg leading-8 text-slate">
            Stripe has confirmed checkout. Your LioraBump plan will update as soon as the subscription webhook reaches Supabase.
          </p>
          <Link href="/app" className="mt-8 inline-flex h-14 items-center rounded-2xl bg-navy px-6 text-sm font-bold text-white">
            Go to app dashboard
          </Link>
        </section>
      </main>
    </PublicShell>
  );
}
