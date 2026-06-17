import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PublicShell } from "@/components/site-shell";
import { ButtonLink, MedicalNotice } from "@/components/ui";
import { blogPosts } from "@/lib/content";

export function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = blogPosts.find((item) => item.slug === slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.description
  };
}

export default async function BlogDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = blogPosts.find((item) => item.slug === slug);
  if (!post) notFound();

  const faq = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "Is this medical advice?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "No. LioraBump content is educational only and should not replace professional medical advice."
        }
      },
      {
        "@type": "Question",
        name: "Can partners use LioraBump?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. Partner accounts are planned for shared reminders, checklists and support prompts."
        }
      }
    ]
  };

  return (
    <PublicShell>
      <main className="section-pad">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faq) }} />
        <article className="container-page max-w-3xl">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-peachDeep">{post.category}</p>
          <h1 className="mt-4 font-serif text-5xl font-bold leading-tight text-navy">{post.title}</h1>
          <p className="mt-5 text-xl leading-8 text-slate">{post.description}</p>
          <div className="my-8">
            <MedicalNotice />
          </div>
          <div className="space-y-8 text-base leading-8 text-slate">
            <section>
              <h2 className="font-serif text-3xl font-bold text-navy">What this guide covers</h2>
              <p className="mt-3">
                This sample SEO article gives LioraBump a publishing structure: clear headings, plain-language content,
                internal app links, FAQs and a visible medical disclaimer. The final version should be reviewed by a
                qualified healthcare professional before publication.
              </p>
            </section>
            <section>
              <h2 className="font-serif text-3xl font-bold text-navy">How LioraBump helps</h2>
              <p className="mt-3">
                The app turns educational reading into practical prompts: saved checklists, appointment questions,
                partner reminders and private journal entries.
              </p>
            </section>
            <section>
              <h2 className="font-serif text-3xl font-bold text-navy">FAQ</h2>
              <h3 className="mt-4 font-bold text-navy">Is this medical advice?</h3>
              <p>No. Always speak to your doctor, midwife or paediatrician for care decisions.</p>
              <h3 className="mt-4 font-bold text-navy">Can I share this with my partner?</h3>
              <p>Yes. LioraBump is designed for consent-based partner and family sharing.</p>
            </section>
          </div>
          <div className="mt-10">
            <ButtonLink href="/app/onboarding">Save this guide in the app</ButtonLink>
          </div>
        </article>
      </main>
    </PublicShell>
  );
}
