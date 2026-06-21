import type { MetadataRoute } from "next";
import { blogArticles } from "@/lib/blog-content";

const siteUpdatedAt = new Date("2026-06-21T00:00:00.000Z");

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://liorabump.com";
  const staticRoutes = [
    "",
    "/features",
    "/pricing",
    "/blog",
    "/pregnancy-tracker",
    "/food-guide",
    "/baby-milestones",
    "/due-date-calculator",
    "/privacy-policy",
    "/about",
    "/contact",
    "/sponsored-disclosure",
    "/terms",
    "/medical-disclaimer"
  ];

  return [
    ...staticRoutes.map((route) => ({ url: `${base}${route}`, lastModified: siteUpdatedAt, changeFrequency: "monthly" as const, priority: route === "" ? 1 : route === "/blog" ? 0.9 : 0.7 })),
    ...blogArticles.map((post) => ({ url: `${base}/blog/${post.slug}`, lastModified: new Date(post.updatedAt), changeFrequency: "monthly" as const, priority: 0.8 }))
  ];
}
