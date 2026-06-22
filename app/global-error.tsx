"use client";

import { useEffect } from "react";
import * as Sentry from "@sentry/nextjs";

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <html lang="en">
      <body>
        <main style={{ maxWidth: 640, margin: "96px auto", padding: "24px", fontFamily: "Arial, sans-serif", color: "#11233f" }}>
          <p style={{ color: "#c95b4f", fontWeight: 700 }}>Something needs attention</p>
          <h1>We could not load this page.</h1>
          <p>Please try again. If it keeps happening, contact LioraBump support and mention the time you saw this message.</p>
          <button type="button" onClick={reset} style={{ padding: "12px 18px", border: 0, borderRadius: 8, background: "#11233f", color: "white", fontWeight: 700 }}>Try again</button>
        </main>
      </body>
    </html>
  );
}
