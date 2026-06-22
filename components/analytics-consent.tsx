"use client";

import Script from "next/script";
import Link from "next/link";
import { useState, useSyncExternalStore } from "react";

const consentKey = "liorabump-analytics-consent";

export function AnalyticsConsent({ measurementId }: { measurementId?: string }) {
  const [selectedConsent, setSelectedConsent] = useState<"accepted" | "declined" | null>(null);
  const storedConsent = useSyncExternalStore(subscribeToConsent, readConsent, () => null);
  const consent = selectedConsent ?? storedConsent;

  function setChoice(choice: "accepted" | "declined") {
    window.localStorage.setItem(consentKey, choice);
    setSelectedConsent(choice);
  }

  if (!measurementId) return null;

  return (
    <>
      {consent === "accepted" ? (
        <>
          <Script src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`} strategy="afterInteractive" />
          <Script id="ga4-init" strategy="afterInteractive">
            {`window.dataLayer = window.dataLayer || []; function gtag(){dataLayer.push(arguments);} window.gtag = gtag; gtag('js', new Date()); gtag('config', '${measurementId}', { anonymize_ip: true });`}
          </Script>
        </>
      ) : null}
      {consent === null ? (
        <aside className="fixed inset-x-4 bottom-4 z-50 mx-auto max-w-2xl border border-navy/10 bg-background p-5 shadow-lg md:inset-x-auto md:right-6 md:w-[36rem]" role="dialog" aria-label="Analytics cookie choice">
          <p className="font-serif text-xl font-bold text-navy">Help us improve LioraBump</p>
          <p className="mt-2 text-sm leading-6 text-slate">With your permission, we use anonymous analytics to understand which public guides and signup paths are useful. We do not send health entries, due dates, names or email addresses to Google Analytics.</p>
          <div className="mt-4 flex flex-wrap gap-3">
            <button type="button" onClick={() => setChoice("accepted")} className="h-11 rounded-xl bg-navy px-4 text-sm font-bold text-white">Accept analytics</button>
            <button type="button" onClick={() => setChoice("declined")} className="h-11 rounded-xl border border-navy/15 px-4 text-sm font-bold text-navy">Continue without analytics</button>
            <Link href="/privacy-policy" className="inline-flex h-11 items-center text-sm font-bold text-coral underline underline-offset-4">Privacy policy</Link>
          </div>
        </aside>
      ) : null}
    </>
  );
}

function subscribeToConsent(callback: () => void) {
  window.addEventListener("storage", callback);
  return () => window.removeEventListener("storage", callback);
}

function readConsent() {
  const value = window.localStorage.getItem(consentKey);
  return value === "accepted" || value === "declined" ? value : null;
}
