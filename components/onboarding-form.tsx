"use client";

import { useActionState } from "react";
import Link from "next/link";
import { saveOnboarding } from "@/app/actions/onboarding";

export function OnboardingForm() {
  const [state, formAction, pending] = useActionState(saveOnboarding, { ok: false, message: "" });

  return (
    <form className="card grid gap-5 p-6 md:p-8" action={formAction}>
      <label className="grid gap-2 text-sm font-bold text-navy">
        Your role
        <select name="role" className="h-14 rounded-2xl border border-navy/10 bg-background px-4 text-base font-normal outline-none focus:ring-2 focus:ring-lavenderDeep">
          <option value="mother">Mother</option>
          <option value="partner">Father / partner</option>
        </select>
      </label>
      <label className="grid gap-2 text-sm font-bold text-navy">
        Due date
        <input
          type="date"
          name="due_date"
          className="h-14 rounded-2xl border border-navy/10 bg-background px-4 text-base font-normal outline-none focus:ring-2 focus:ring-lavenderDeep"
        />
      </label>
      <label className="grid gap-2 text-sm font-bold text-navy">
        Country
        <input
          name="country"
          className="h-14 rounded-2xl border border-navy/10 bg-background px-4 text-base font-normal outline-none focus:ring-2 focus:ring-lavenderDeep"
          placeholder="Your country"
          required
        />
      </label>
      <label className="grid gap-2 text-sm font-bold text-navy">
        Baby nickname
        <input
          name="baby_nickname"
          className="h-14 rounded-2xl border border-navy/10 bg-background px-4 text-base font-normal outline-none focus:ring-2 focus:ring-lavenderDeep"
          placeholder="Baby nickname"
          required
        />
      </label>
      <label className="grid gap-2 text-sm font-bold text-navy">
        Invite partner email
        <input
          type="email"
          name="invite_partner_email"
          className="h-14 rounded-2xl border border-navy/10 bg-background px-4 text-base font-normal outline-none focus:ring-2 focus:ring-lavenderDeep"
          placeholder="Partner email"
        />
      </label>
      <label className="grid gap-2 text-sm font-bold text-navy">
        Privacy setting
        <select name="privacy_level" className="h-14 rounded-2xl border border-navy/10 bg-background px-4 text-base font-normal outline-none focus:ring-2 focus:ring-lavenderDeep">
          <option value="private">Private by default</option>
          <option value="partner">Share with partner</option>
          <option value="family">Share with invited family</option>
        </select>
      </label>
      <label className="flex items-start gap-3 rounded-2xl bg-peach/50 p-4 text-sm leading-6 text-peachDeep">
        <input type="checkbox" className="mt-1" required />
        I understand LioraBump is educational only and does not replace professional medical advice.
      </label>
      <button disabled={pending} className="h-14 rounded-2xl bg-navy font-bold text-white disabled:opacity-60">
        {pending ? "Creating journey..." : "Create journey"}
      </button>
      {state.message ? (
        <p className={`rounded-2xl p-4 text-sm font-semibold leading-6 ${state.ok ? "bg-sage/60 text-navy" : "bg-peach/70 text-navy"}`}>
          {state.message}{" "}
          {!state.ok && state.message.includes("sign in") ? (
            <Link href="/signup" className="text-coral underline">
              Create account
            </Link>
          ) : null}
        </p>
      ) : null}
    </form>
  );
}
