"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";

export function HeaderAccountNav() {
  const hasSession = useSessionState();
  const pathname = usePathname();
  const isInApp = pathname === "/app" || pathname.startsWith("/app/");

  if (hasSession === null) return <span className="h-5 w-14" aria-hidden="true" />;

  if (!hasSession) {
    return (
      <Link href="/login" className="transition hover:text-navy">
        Sign in
      </Link>
    );
  }

  return (
    <>
      {!isInApp ? (
        <Link href="/app" className="transition hover:text-navy">
          Open app
        </Link>
      ) : null}
      <button type="button" onClick={() => void signOut({ callbackUrl: "/" })} className="transition hover:text-navy">
        Sign out
      </button>
    </>
  );
}

export function HeaderAccountButton() {
  const hasSession = useSessionState();

  if (hasSession === null) return <span className="h-11 w-28" aria-hidden="true" />;

  if (!hasSession) {
    return (
      <Link href="/signup" className="rounded-full bg-navy px-5 py-3 text-sm font-semibold text-white transition hover:bg-navySoft">
        Get started
      </Link>
    );
  }

  return (
    <button
      type="button"
      onClick={() => void signOut({ callbackUrl: "/" })}
      className="rounded-full bg-peach px-4 py-3 text-sm font-semibold text-navy transition hover:bg-[#edd9bf] md:hidden"
    >
      Sign out
    </button>
  );
}

function useSessionState() {
  const [hasSession, setHasSession] = useState<boolean | null>(null);

  useEffect(() => {
    let active = true;

    void fetch("/api/auth/session").then(async (response) => {
      const data = (await response.json()) as { user?: unknown };
      if (active) setHasSession(Boolean(data.user));
    }).catch(() => {
      if (active) setHasSession(false);
    });

    return () => {
      active = false;
    };
  }, []);

  return hasSession;
}
