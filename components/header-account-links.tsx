"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

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
    const supabase = createClient();
    let active = true;

    void supabase.auth.getSession().then(({ data }) => {
      if (active) setHasSession(Boolean(data.session));
    });

    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange((_event, session) => setHasSession(Boolean(session)));

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, []);

  return hasSession;
}
