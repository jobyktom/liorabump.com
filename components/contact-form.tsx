"use client";

import { useState } from "react";

export function ContactForm() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [message, setMessage] = useState("");

  return (
    <form
      className="card grid gap-5 p-6"
      onSubmit={async (event) => {
        event.preventDefault();
        const form = event.currentTarget;
        const formData = new FormData(form);
        setStatus("sending");
        setMessage("");

        try {
          const response = await fetch("/api/contact", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              name: formData.get("name"),
              email: formData.get("email"),
              message: formData.get("message"),
              website: formData.get("website")
            })
          });
          const data = (await response.json()) as { ok?: boolean; error?: string };

          if (!response.ok || !data.ok) {
            setStatus("error");
            setMessage(data.error ?? "We could not send your message. Please try again.");
            return;
          }

          form.reset();
          setStatus("sent");
          setMessage("Thanks - your message has been sent. We will reply by email.");
        } catch {
          setStatus("error");
          setMessage("We could not send your message. Please email jobyktom@gmail.com directly.");
        }
      }}
    >
      <label className="grid gap-2 text-sm font-bold text-navy">
        Name
        <input name="name" className="h-14 rounded-2xl border border-navy/10 bg-background px-4" placeholder="Your name" autoComplete="name" required maxLength={120} />
      </label>
      <label className="grid gap-2 text-sm font-bold text-navy">
        Email
        <input name="email" type="email" className="h-14 rounded-2xl border border-navy/10 bg-background px-4" placeholder="you@example.com" autoComplete="email" required maxLength={254} />
      </label>
      <label className="grid gap-2 text-sm font-bold text-navy">
        Message
        <textarea name="message" className="min-h-32 rounded-2xl border border-navy/10 bg-background p-4" placeholder="How can we help?" required minLength={10} maxLength={5000} />
      </label>
      <input name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />
      <button disabled={status === "sending"} className="h-14 rounded-2xl bg-navy font-bold text-white disabled:opacity-70">
        {status === "sending" ? "Sending..." : "Send message"}
      </button>
      {message ? <p className={`rounded-2xl p-4 text-sm font-semibold leading-6 ${status === "sent" ? "bg-sage/60 text-navy" : "bg-peach/70 text-coral"}`}>{message}</p> : null}
    </form>
  );
}
