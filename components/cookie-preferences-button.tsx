"use client";

export function CookiePreferencesButton() {
  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new Event("liorabump:open-cookie-preferences"))}
      className="text-left text-white/70 transition hover:text-white"
    >
      Cookie preferences
    </button>
  );
}
