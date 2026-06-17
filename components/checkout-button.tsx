"use client";

import { useState } from "react";
import { ArrowRight, Loader2 } from "lucide-react";

export function CheckoutButton({ planId, label }: { planId: string; label: string }) {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function startCheckout() {
    setIsLoading(true);
    setMessage(null);

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planId })
      });
      const data = (await response.json()) as { url?: string; error?: string; missing?: string[] };

      if (!response.ok) {
        setMessage(
          data.missing?.length
            ? `${data.error} Missing: ${data.missing.join(", ")}.`
            : data.error ?? "Checkout could not be started."
        );
        return;
      }

      if (data.url) {
        window.location.href = data.url;
      }
    } catch {
      setMessage("Checkout could not be started. Please check the dev server and Stripe settings.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div>
      <button
        type="button"
        onClick={startCheckout}
        disabled={isLoading}
        className="inline-flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-navy px-6 text-sm font-bold text-white transition hover:bg-navySoft disabled:cursor-not-allowed disabled:opacity-70"
      >
        {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
        {label}
        {!isLoading ? <ArrowRight className="h-4 w-4" /> : null}
      </button>
      {message ? <p className="mt-3 rounded-xl bg-peach/70 p-3 text-sm leading-6 text-slate">{message}</p> : null}
    </div>
  );
}
