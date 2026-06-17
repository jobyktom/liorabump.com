import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" });

export const metadata: Metadata = {
  metadataBase: new URL("https://liorabump.com"),
  title: {
    default: "LioraBump | Nurturing You, Welcoming Wonder",
    template: "%s | LioraBump"
  },
  description:
    "A premium pregnancy, baby and family journey platform for tracking pregnancy, health appointments, memories, partner support and baby milestones.",
  openGraph: {
    title: "LioraBump",
    description: "Nurturing You, Welcoming Wonder.",
    url: "https://liorabump.com",
    siteName: "LioraBump",
    locale: "en_GB",
    type: "website"
  }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
