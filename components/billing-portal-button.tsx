"use client";

import { useState } from "react";
import { CreditCard, Loader2 } from "lucide-react";

export function BillingPortalButton() {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function openPortal() {
    setIsLoading(true);
    setMessage(null);

    try {
      const response = await fetch("/api/billing-portal", { method: "POST" });
      const data = (await response.json()) as { url?: string; error?: string };

      if (!response.ok || !data.url) {
        setMessage(data.error ?? "Billing settings could not be opened. Please try again.");
        return;
      }

      window.location.href = data.url;
    } catch {
      setMessage("Billing settings are temporarily unavailable. Please try again shortly.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="mt-5">
      <button
        type="button"
        onClick={openPortal}
        disabled={isLoading}
        className="inline-flex h-14 items-center gap-2 rounded-2xl bg-navy px-6 text-sm font-bold text-white transition hover:bg-navySoft disabled:cursor-not-allowed disabled:opacity-70"
      >
        {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <CreditCard className="h-4 w-4" />}
        Manage billing
      </button>
      {message ? <p className="mt-3 rounded-xl bg-peach/70 p-3 text-sm leading-6 text-slate">{message}</p> : null}
    </div>
  );
}
