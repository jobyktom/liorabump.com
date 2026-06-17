"use client";

import { useState } from "react";

export function ContactForm() {
  const [saved, setSaved] = useState(false);

  return (
    <form
      className="card grid gap-5 p-6"
      onSubmit={(event) => {
        event.preventDefault();
        setSaved(true);
      }}
    >
      <label className="grid gap-2 text-sm font-bold text-navy">
        Name
        <input className="h-14 rounded-2xl border border-navy/10 bg-background px-4" placeholder="Your name" required />
      </label>
      <label className="grid gap-2 text-sm font-bold text-navy">
        Email
        <input type="email" className="h-14 rounded-2xl border border-navy/10 bg-background px-4" placeholder="you@example.com" required />
      </label>
      <label className="grid gap-2 text-sm font-bold text-navy">
        Message
        <textarea className="min-h-32 rounded-2xl border border-navy/10 bg-background p-4" placeholder="How can we help?" required />
      </label>
      <button className="h-14 rounded-2xl bg-navy font-bold text-white">Save message draft</button>
      {saved ? (
        <p className="rounded-2xl bg-sage/60 p-4 text-sm font-semibold leading-6 text-navy">
          Message draft saved. In production this will send through an email provider and create an admin inbox item.
        </p>
      ) : null}
    </form>
  );
}
