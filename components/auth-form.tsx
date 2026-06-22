"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { trackAnalyticsEvent } from "@/lib/analytics";

type AuthMode = "login" | "signup";

export function AuthForm({ mode }: { mode: AuthMode }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function submit() {
    setIsLoading(true);
    setMessage(null);

    try {
      const supabase = createClient();
      const next = new URLSearchParams(window.location.search).get("next");
      const safeNext = next?.startsWith("/") ? next : null;

      if (mode === "signup") {
        trackAnalyticsEvent("begin_signup");
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName
            },
            emailRedirectTo: `${window.location.origin}/auth/callback${safeNext ? `?next=${encodeURIComponent(safeNext)}` : ""}`
          }
        });

        if (error) throw error;
        trackAnalyticsEvent("sign_up");
        setMessage("Check your email to confirm your account, then sign in.");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        window.location.href = safeNext ?? "/app";
      }
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Authentication is not configured yet.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form
      className="card grid gap-5 p-6 md:p-8"
      onSubmit={(event) => {
        event.preventDefault();
        void submit();
      }}
    >
      {mode === "signup" ? (
        <label className="grid gap-2 text-sm font-bold text-navy">
          Full name
          <input
            value={fullName}
            onChange={(event) => setFullName(event.target.value)}
            className="h-14 rounded-2xl border border-navy/10 bg-background px-4 text-base font-normal outline-none focus:ring-2 focus:ring-lavenderDeep"
            placeholder="Your name"
            required
          />
        </label>
      ) : null}
      <label className="grid gap-2 text-sm font-bold text-navy">
        Email
        <input
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="h-14 rounded-2xl border border-navy/10 bg-background px-4 text-base font-normal outline-none focus:ring-2 focus:ring-lavenderDeep"
          placeholder="you@example.com"
          required
        />
      </label>
      <label className="grid gap-2 text-sm font-bold text-navy">
        Password
        <input
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className="h-14 rounded-2xl border border-navy/10 bg-background px-4 text-base font-normal outline-none focus:ring-2 focus:ring-lavenderDeep"
          placeholder="At least 6 characters"
          required
          minLength={6}
        />
      </label>
      <button disabled={isLoading} className="h-14 rounded-2xl bg-navy font-bold text-white disabled:opacity-60">
        {isLoading ? "Please wait..." : mode === "signup" ? "Create account" : "Sign in"}
      </button>
      {mode === "login" ? <Link href="/forgot-password" className="-mt-1 text-center text-sm font-bold text-coral">Forgot your password?</Link> : null}
      {message ? <p className="rounded-2xl bg-peach/70 p-4 text-sm font-semibold leading-6 text-navy">{message}</p> : null}
      <p className="text-center text-sm text-slate">
        {mode === "signup" ? "Already have an account?" : "New to LioraBump?"}{" "}
        <Link href={mode === "signup" ? "/login" : "/signup"} className="font-bold text-coral">
          {mode === "signup" ? "Sign in" : "Create an account"}
        </Link>
      </p>
    </form>
  );
}
