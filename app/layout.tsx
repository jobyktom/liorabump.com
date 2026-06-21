import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
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
    }
  ]
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body className="font-sans antialiased">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
        {children}
      </body>
    </html>
  );
}
