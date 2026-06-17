import type { Metadata } from "next";
import Link from "next/link";
import { PublicShell } from "@/components/site-shell";
import { MedicalNotice, SectionHeading } from "@/components/ui";
import { blogPosts } from "@/lib/content";

export const metadata: Metadata = {
  title: "Pregnancy and Baby Blog",
  description: "SEO-friendly pregnancy, food, exercise, partner and baby milestone guides from LioraBump."
};

export default function BlogPage() {
  return (
    <PublicShell>
      <main className="section-pad">
        <div className="container-page">
          <SectionHeading eyebrow="SEO content hub" title="Guides for pregnancy, birth planning and baby memories" text="Every article is structured for search, clear disclaimers, FAQs and app conversion." />
          <div className="grid gap-5 md:grid-cols-3">
            {blogPosts.map((post) => (
              <Link key={post.slug} href={`/blog/${post.slug}`} className="card block p-6 transition hover:-translate-y-1">
                <span className="text-xs font-bold uppercase tracking-wide text-peachDeep">{post.category}</span>
                <h2 className="mt-4 font-serif text-2xl font-bold text-navy">{post.title}</h2>
                <p className="mt-3 text-sm leading-6 text-slate">{post.description}</p>
              </Link>
            ))}
          </div>
          <div className="mt-10">
            <MedicalNotice />
          </div>
        </div>
      </main>
    </PublicShell>
  );
}
