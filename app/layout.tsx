import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import { AnalyticsConsent } from "@/components/analytics-consent";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" });

export const metadata: Metadata = {
  metadataBase: new URL("https://liorabump.com"),
  applicationName: "LioraBump",
  title: {
    default: "LioraBump | Nurturing You, Welcoming Wonder",
    template: "%s | LioraBump"
  },
  description:
    "A premium pregnancy, baby and family journey platform for tracking pregnancy, health appointments, memories, partner support and baby milestones.",
  keywords: ["pregnancy tracker", "pregnancy week by week", "pregnancy food guide", "hospital bag checklist", "partner pregnancy support", "baby milestones"],
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 }
  },
  openGraph: {
    title: "LioraBump",
    description: "Nurturing You, Welcoming Wonder.",
    url: "https://liorabump.com",
    siteName: "LioraBump",
    locale: "en_GB",
    type: "website",
    images: [{ url: "/images/liorabump-hero-generated.png", width: 1200, height: 800, alt: "LioraBump pregnancy and family journey app" }]
  },
  twitter: {
    card: "summary_large_image",
    title: "LioraBump | Nurturing You, Welcoming Wonder",
    description: "Pregnancy tracking, practical guides, memories and partner support.",
    images: ["/images/liorabump-hero-generated.png"]
  }
};

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      name: "LioraBump",
      url: "https://liorabump.com",
      email: "jobyktom@gmail.com"
    },
    {
      "@type": "WebSite",
      name: "LioraBump",
      url: "https://liorabump.com",
      inLanguage: "en-GB",
      description: "Pregnancy, family planning and baby memory tools with educational guides."
    },
    {
      "@type": "SoftwareApplication",
      name: "LioraBump",
      applicationCategory: "HealthApplication",
      operatingSystem: "Web",
      url: "https://liorabump.com",
      description: "A private pregnancy, baby and family journey app for tracking due dates, appointments, wellbeing notes, memories, partner support and baby milestones.",
      offers: [
        {
          "@type": "Offer",
          name: "Free",
          price: "0",
          priceCurrency: "GBP",
          url: "https://liorabump.com/pricing"
        },
        {
          "@type": "Offer",
          name: "Premium",
          price: "6.99",
          priceCurrency: "GBP",
          url: "https://liorabump.com/pricing"
        },
        {
          "@type": "Offer",
          name: "Family",
          price: "9.99",
          priceCurrency: "GBP",
          url: "https://liorabump.com/pricing"
        }
      ],
      audience: {
        "@type": "Audience",
        audienceType: "Expecting parents, partners and families"
      }
    },
    {
      "@type": "Product",
      name: "LioraBump",
      brand: {
        "@type": "Brand",
        name: "LioraBump"
      },
      description: "A private pregnancy tracker and family memory app with partner sharing, scan uploads, appointment records and baby milestones.",
      url: "https://liorabump.com",
      offers: {
        "@type": "AggregateOffer",
        priceCurrency: "GBP",
        lowPrice: "0",
        highPrice: "9.99",
        offerCount: 3,
        url: "https://liorabump.com/pricing"
      }
    }
  ]
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body className="font-sans antialiased">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
        {children}
        <AnalyticsConsent measurementId={process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID} />
      </body>
    </html>
  );
}
