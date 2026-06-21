import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/app", "/api", "/auth", "/admin", "/invite", "/login", "/signup", "/pricing/success", "/pricing/cancelled"]
    },
    sitemap: "https://liorabump.com/sitemap.xml"
  };
}
