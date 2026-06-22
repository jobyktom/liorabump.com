type AnalyticsEvent = "begin_signup" | "sign_up" | "due_date_calculator_signup_click";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

export function trackAnalyticsEvent(event: AnalyticsEvent) {
  window.gtag?.("event", event);
}
