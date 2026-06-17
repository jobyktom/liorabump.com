import type { MetadataRoute } from "next";
import { appSections } from "@/lib/app-sections";
import { blogPosts, pregnancyWeeks } from "@/lib/content";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://liorabump.com";
  const staticRoutes = [
    "",
    "/features",
    "/pricing",
    "/blog",
    "/app",
    "/app/onboarding",
    ...Object.keys(appSections).map((section) => `/app/${section}`),
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
    ...staticRoutes.map((route) => ({ url: `${base}${route}`, lastModified: new Date() })),
    ...blogPosts.map((post) => ({ url: `${base}/blog/${post.slug}`, lastModified: new Date() })),
    ...pregnancyWeeks.map((week) => ({ url: `${base}/pregnancy-tracker/week-${week.week}`, lastModified: new Date() }))
  ];
}
