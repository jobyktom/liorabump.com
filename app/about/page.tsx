import type { Metadata } from "next";
import { PublicShell } from "@/components/site-shell";

export const metadata: Metadata = {
  title: "About",
  description: "About LioraBump, a warm pregnancy and early parenthood companion."
};

export default function AboutPage() {
  return (
    <PublicShell>
      <main className="section-pad">
        <article className="container-page max-w-3xl">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-coral">About LioraBump</p>
          <h1 className="mt-4 font-serif text-5xl font-bold text-navy">Nurturing you, welcoming wonder.</h1>
          <p className="mt-6 text-lg leading-8 text-slate">
            LioraBump is designed as a calm, private companion for pregnancy, birth preparation and early family memories.
            It brings practical tracking, partner support, trusted educational content and memory keeping into one warm experience.
          </p>
        </article>
      </main>
    </PublicShell>
  );
}
