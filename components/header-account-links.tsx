"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export function HeaderAccountNav() {
  const hasSession = useSessionState();

  if (hasSession === null) return <span className="h-5 w-14" aria-hidden="true" />;

  return (
    <Link href={hasSession ? "/app" : "/login"} className="transition hover:text-navy">
      {hasSession ? "Open app" : "Sign in"}
    </Link>
  );
}

export function HeaderAccountButton() {
  const hasSession = useSessionState();

  if (hasSession === null) return <span className="h-11 w-28" aria-hidden="true" />;

  return (
    <Link
      href={hasSession ? "/app" : "/signup"}
      className="rounded-full bg-navy px-5 py-3 text-sm font-semibold text-white transition hover:bg-navySoft"
    >
      {hasSession ? "Open app" : "Get started"}
    </Link>
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
