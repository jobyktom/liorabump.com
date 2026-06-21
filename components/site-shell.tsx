import Link from "next/link";
import { Baby, HeartPulse, Home, NotebookTabs, Settings } from "lucide-react";
import { medicalDisclaimer, navLinks } from "@/lib/content";
import { Logo } from "./logo";

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-navy/5 bg-background/85 backdrop-blur-xl">
      <div className="container-page flex h-20 items-center justify-between">
        <Logo />
        <nav className="hidden items-center gap-8 text-sm text-slate md:flex">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} className="transition hover:text-navy">
              {link.label}
            </Link>
          ))}
        </nav>
        <Link
          href="/signup"
          className="rounded-full bg-navy px-5 py-3 text-sm font-semibold text-white transition hover:bg-navySoft"
        >
          Get started
        </Link>
      </div>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="bg-navy py-16 text-white">
      <div className="container-page grid gap-10 md:grid-cols-[1.2fr_2fr]">
        <div>
          <Logo light />
        <p className="mt-5 max-w-sm text-sm leading-6 text-white/70">Nurturing You, Welcoming Wonder.</p>
          <p className="mt-6 max-w-md text-xs leading-5 text-white/55">{medicalDisclaimer}</p>
        </div>
        <div className="grid gap-8 text-sm sm:grid-cols-3">
          <FooterColumn title="Product" links={["Features", "Pregnancy tracker", "Food guide", "Baby milestones"]} />
          <FooterColumn title="Company" links={["About", "Blog", "Pricing", "Contact"]} />
          <FooterColumn title="Legal" links={["Privacy Policy", "Terms", "Medical Disclaimer", "Sponsored disclosure"]} />
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({ title, links }: { title: string; links: string[] }) {
  return (
    <div>
      <h3 className="font-semibold">{title}</h3>
      <ul className="mt-4 space-y-3 text-white/70">
        {links.map((link) => (
          <li key={link}>
            <Link href={`/${link.toLowerCase().replaceAll(" ", "-")}`} className="hover:text-white">
              {link}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function PublicShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      {children}
      <Footer />
      <MobileNav />
    </>
  );
}

function MobileNav() {
  const items = [
    { href: "/", icon: Home, label: "Home" },
    { href: "/pregnancy-tracker", icon: Baby, label: "Growth" },
    { href: "/features", icon: HeartPulse, label: "Health" },
    { href: "/app", icon: NotebookTabs, label: "Album" },
    { href: "/app/settings", icon: Settings, label: "Settings" }
  ];

  return (
    <nav className="fixed inset-x-4 bottom-4 z-50 grid grid-cols-5 rounded-2xl bg-white/95 p-2 shadow-soft backdrop-blur md:hidden">
      {items.map((item) => (
        <Link key={item.href} href={item.href} className="flex flex-col items-center gap-1 rounded-xl px-1 py-2 text-[10px] text-slate">
          <item.icon className="h-5 w-5" />
          {item.label}
        </Link>
      ))}
    </nav>
  );
}
