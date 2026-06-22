"use client";

import Link from "next/link";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export function RequestPasswordResetForm() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function submit() {
    setIsLoading(true);
    setMessage(null);

    try {
      const supabase = createClient();
      const redirectTo = `${window.location.origin}/auth/callback?next=${encodeURIComponent("/reset-password")}`;
      const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo });
      if (error) throw error;
      setMessage("If an account exists for that email address, we have sent a password-reset link. Please check your inbox and spam folder.");
    } catch {
      setMessage("We could not request a reset email just now. Please try again shortly.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form className="card grid gap-5 p-6 md:p-8" onSubmit={(event) => { event.preventDefault(); void submit(); }}>
      <label className="grid gap-2 text-sm font-bold text-navy">
        Email address
        <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} className="h-14 rounded-2xl border border-navy/10 bg-background px-4 text-base font-normal outline-none focus:ring-2 focus:ring-lavenderDeep" placeholder="you@example.com" autoComplete="email" required />
      </label>
      <button disabled={isLoading} className="h-14 rounded-2xl bg-navy font-bold text-white disabled:opacity-60">
        {isLoading ? "Sending link..." : "Email reset link"}
      </button>
      {message ? <p className="rounded-2xl bg-peach/70 p-4 text-sm font-semibold leading-6 text-navy">{message}</p> : null}
      <p className="text-center text-sm text-slate">Remembered it? <Link href="/login" className="font-bold text-coral">Sign in</Link></p>
    </form>
  );
}

export function UpdatePasswordForm() {
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isUpdated, setIsUpdated] = useState(false);

  async function submit() {
    if (password.length < 8) {
      setMessage("Choose a password with at least 8 characters.");
      return;
    }
    if (password !== confirmation) {
      setMessage("The passwords do not match.");
      return;
    }

    setIsLoading(true);
    setMessage(null);
    setIsUpdated(false);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      setIsUpdated(true);
      setMessage("Your password has been updated. You can now continue to your dashboard.");
    } catch {
      setMessage("This reset link is invalid or has expired. Please request a new password-reset email.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form className="card grid gap-5 p-6 md:p-8" onSubmit={(event) => { event.preventDefault(); void submit(); }}>
      <label className="grid gap-2 text-sm font-bold text-navy">
        New password
        <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} className="h-14 rounded-2xl border border-navy/10 bg-background px-4 text-base font-normal outline-none focus:ring-2 focus:ring-lavenderDeep" placeholder="At least 8 characters" autoComplete="new-password" minLength={8} required />
      </label>
      <label className="grid gap-2 text-sm font-bold text-navy">
        Confirm new password
        <input type="password" value={confirmation} onChange={(event) => setConfirmation(event.target.value)} className="h-14 rounded-2xl border border-navy/10 bg-background px-4 text-base font-normal outline-none focus:ring-2 focus:ring-lavenderDeep" placeholder="Repeat your new password" autoComplete="new-password" minLength={8} required />
      </label>
      <button disabled={isLoading} className="h-14 rounded-2xl bg-navy font-bold text-white disabled:opacity-60">
        {isLoading ? "Updating password..." : "Update password"}
      </button>
      {message ? <p className="rounded-2xl bg-peach/70 p-4 text-sm font-semibold leading-6 text-navy">{message}</p> : null}
      {isUpdated ? <p className="text-center text-sm text-slate"><Link href="/app" className="font-bold text-coral">Continue to dashboard</Link></p> : null}
    </form>
  );
}
