import type { Metadata } from "next";
import { PublicShell } from "@/components/site-shell";

export const metadata: Metadata = {
  title: "Sponsored Disclosure",
  description: "How LioraBump labels sponsored and affiliate content."
};

export default function SponsoredDisclosurePage() {
  return (
    <PublicShell>
      <main className="section-pad">
        <article className="container-page max-w-3xl">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-coral">Transparency</p>
          <h1 className="mt-4 font-serif text-5xl font-bold text-navy">Sponsored disclosure</h1>
          <p className="mt-6 text-lg leading-8 text-slate">
            Sponsored articles, affiliate links and brand partner recommendations should always be clearly labelled.
            Sponsored content must never replace medical advice, and health guidance should remain editorially separate from paid placements.
          </p>
        </article>
      </main>
    </PublicShell>
  );
}
