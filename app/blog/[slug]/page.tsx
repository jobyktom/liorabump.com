import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PublicShell } from "@/components/site-shell";
import { ButtonLink, MedicalNotice } from "@/components/ui";
import { blogArticles } from "@/lib/blog-content";
import { HospitalBagDownload } from "@/components/hospital-bag-download";

export function generateStaticParams() {
  return blogArticles.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = blogArticles.find((item) => item.slug === slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.description,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      type: "article",
      url: `/blog/${post.slug}`,
      title: post.title,
      description: post.description,
      publishedTime: "2026-06-21T00:00:00.000Z",
      modifiedTime: "2026-06-21T00:00:00.000Z",
      images: [{ url: "/images/liorabump-hero-generated.png", width: 1200, height: 800, alt: post.title }]
    },
    twitter: { card: "summary_large_image", title: post.title, description: post.description, images: ["/images/liorabump-hero-generated.png"] }
  };
}

export default async function BlogDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = blogArticles.find((item) => item.slug === slug);
  if (!post) notFound();

  const faq = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: post.faqs.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer }
    }))
  };

  const article = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.description,
    datePublished: "2026-06-21",
    dateModified: "2026-06-21",
    inLanguage: "en-GB",
    mainEntityOfPage: `https://liorabump.com/blog/${post.slug}`,
    image: "https://liorabump.com/images/liorabump-hero-generated.png",
    author: { "@type": "Organization", name: "LioraBump" },
    publisher: { "@type": "Organization", name: "LioraBump", url: "https://liorabump.com" }
  };

  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://liorabump.com/" },
      { "@type": "ListItem", position: 2, name: "Guides", item: "https://liorabump.com/blog" },
      { "@type": "ListItem", position: 3, name: post.title, item: `https://liorabump.com/blog/${post.slug}` }
    ]
  };

  return (
    <PublicShell>
      <main className="section-pad">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faq) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(article) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
        <article className="container-page max-w-3xl">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-peachDeep">{post.category}</p>
          <h1 className="mt-4 font-serif text-5xl font-bold leading-tight text-navy">{post.title}</h1>
          <p className="mt-5 text-xl leading-8 text-slate">{post.description}</p>
          <p className="mt-4 text-sm font-semibold text-slate">{post.readingTime} &middot; Sources reviewed {post.updatedAt}</p>
          <div className="my-8">
            <MedicalNotice />
          </div>
          <div className="space-y-8 text-base leading-8 text-slate">
            <p className="text-lg leading-8">{post.intro}</p>
            {post.sections.map((section) => (
              <section key={section.heading}>
                <h2 className="font-serif text-3xl font-bold text-navy">{section.heading}</h2>
                {section.paragraphs.map((paragraph) => (
                  <p key={paragraph} className="mt-3">{paragraph}</p>
                ))}
                {section.bullets ? (
                  <ul className="mt-4 list-disc space-y-2 pl-6 marker:text-coral">
                    {section.bullets.map((item) => <li key={item}>{item}</li>)}
                  </ul>
                ) : null}
              </section>
            ))}
            <section className="rounded-2xl bg-peach/60 p-6">
              <h2 className="font-serif text-2xl font-bold text-navy">When to get help</h2>
              <p className="mt-3">{post.caution}</p>
            </section>
            <section>
              <h2 className="font-serif text-3xl font-bold text-navy">FAQ</h2>
              {post.faqs.map((item) => (
                <div key={item.question} className="mt-4">
                  <h3 className="font-bold text-navy">{item.question}</h3>
                  <p>{item.answer}</p>
                </div>
              ))}
            </section>
            <section>
              <h2 className="font-serif text-3xl font-bold text-navy">Sources and review</h2>
              <p className="mt-3">This educational article was checked against the primary public-health sources below on {post.updatedAt}. Guidance can change and personal care should come from your own clinician.</p>
              <ul className="mt-4 space-y-2">
                {post.sources.map((source) => (
                  <li key={source.href}>
                    <a href={source.href} target="_blank" rel="noreferrer" className="font-semibold text-coral underline underline-offset-4">{source.label}</a>
                  </li>
                ))}
              </ul>
            </section>
          </div>
          <div className="mt-10">
            <ButtonLink href="/app/onboarding">Save this guide in the app</ButtonLink>
          </div>
          {post.slug === "hospital-bag-checklist" ? <HospitalBagDownload /> : null}
          <section className="mt-10 rounded-2xl bg-mist p-6">
            <h2 className="font-serif text-2xl font-bold text-navy">Continue your planning</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              <PlanningLink href="/due-date-calculator" label="Estimate due date" />
              <PlanningLink href="/pregnancy-tracker" label="Browse weekly tracker" />
              <PlanningLink href="/signup" label="Create free account" />
            </div>
          </section>
        </article>
      </main>
    </PublicShell>
  );
}

function PlanningLink({ href, label }: { href: string; label: string }) {
  return (
    <Link href={href} className="rounded-xl bg-background px-4 py-3 text-sm font-bold text-navy transition hover:bg-peach">
      {label}
    </Link>
  );
}
