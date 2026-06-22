"use client";

import { useState } from "react";

export function HospitalBagDownload() {
  const [email, setEmail] = useState("");
  const [marketingConsent, setMarketingConsent] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); setIsLoading(true); setMessage(null);
    try {
      const response = await fetch("/api/lead-capture", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, marketingConsent }) });
      const data = await response.json() as { ok?: boolean; error?: string };
      if (!response.ok || !data.ok) throw new Error(data.error);
      window.location.assign("/downloads/liorabump-hospital-bag-checklist.pdf");
    } catch (error) { setMessage(error instanceof Error && error.message ? error.message : "Please try again."); } finally { setIsLoading(false); }
  }

  return <section className="mt-10 rounded-2xl bg-navy p-6 text-white md:p-8">
    <p className="text-xs font-bold uppercase tracking-[0.18em] text-peach">Free download</p>
    <h2 className="mt-3 font-serif text-3xl font-bold">The calm hospital-bag checklist</h2>
    <p className="mt-3 max-w-2xl leading-7 text-white/75">A practical packing list for the birthing parent, baby and support person. Enter your email to download it now.</p>
    <form onSubmit={submit} className="mt-6 grid gap-3 md:grid-cols-[1fr_auto]">
      <label className="sr-only" htmlFor="hospital-bag-email">Email address</label>
      <input id="hospital-bag-email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com" autoComplete="email" required className="h-12 rounded-xl border-0 px-4 text-navy outline-none focus:ring-2 focus:ring-peach" />
      <button disabled={isLoading} className="h-12 rounded-xl bg-peach px-5 font-bold text-navy disabled:opacity-60">{isLoading ? "Preparing..." : "Download checklist"}</button>
    </form>
    <label className="mt-4 flex items-start gap-3 text-sm leading-6 text-white/75"><input type="checkbox" checked={marketingConsent} onChange={(event) => setMarketingConsent(event.target.checked)} className="mt-1 h-4 w-4" /> I would also like occasional LioraBump emails. You can unsubscribe at any time.</label>
    <p className="mt-3 text-xs leading-5 text-white/60">We use your email to provide this download. See our <a href="/privacy-policy" className="underline">privacy policy</a>.</p>
    {message ? <p className="mt-4 rounded-xl bg-white/10 p-3 text-sm">{message}</p> : null}
  </section>;
}
