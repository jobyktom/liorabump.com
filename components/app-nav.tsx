"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight } from "lucide-react";

const appNavItems = [
  { label: "Dashboard", href: "/app" },
  { label: "Health tracker", href: "/app/health-tracker" },
  { label: "Food guide", href: "/app/food-guide" },
  { label: "Journal", href: "/app/journal" },
  { label: "Scan uploads", href: "/app/scan-uploads" },
  { label: "Kick counter", href: "/app/kick-counter" },
  { label: "Birth plan", href: "/app/birth-plan" },
  { label: "Baby profile", href: "/app/baby-profile" },
  { label: "Couple sync", href: "/app/couple-sync" },
  { label: "Settings", href: "/app/settings" }
] as const;

export function AppNav() {
  const pathname = usePathname();

  return (
    <nav className="mt-6 space-y-2 text-sm">
      {appNavItems.map((item) => {
        const active = isActiveAppRoute(pathname, item.href);
        const className = active
          ? "flex cursor-default items-center justify-between rounded-xl bg-navy px-3 py-3 font-bold text-white"
          : "flex items-center justify-between rounded-xl px-3 py-3 text-slate transition hover:bg-background hover:text-navy";

        if (active) {
          return (
            <span key={item.href} aria-current="page" className={className}>
              {item.label}
            </span>
          );
        }

        return (
          <Link key={item.href} href={item.href} className={className}>
            {item.label}
            <ChevronRight className="h-4 w-4" />
          </Link>
        );
      })}
    </nav>
  );
}

function isActiveAppRoute(pathname: string, href: string) {
  if (href === "/app") return pathname === "/app";
  return pathname === href || pathname.startsWith(`${href}/`);
}
