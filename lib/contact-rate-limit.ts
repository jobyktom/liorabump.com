const WINDOW_MS = 15 * 60 * 1000;
const MAX_REQUESTS = 5;

type RateLimitEntry = {
  count: number;
  resetAt: number;
};

const entries = new Map<string, RateLimitEntry>();

export function consumeContactRequest(identifier: string) {
  const now = Date.now();
  const existing = entries.get(identifier);

  if (!existing || existing.resetAt <= now) {
    entries.set(identifier, { count: 1, resetAt: now + WINDOW_MS });
    removeExpiredEntries(now);
    return { allowed: true, retryAfterSeconds: 0 };
  }

  if (existing.count >= MAX_REQUESTS) {
    return {
      allowed: false,
      retryAfterSeconds: Math.max(1, Math.ceil((existing.resetAt - now) / 1000))
    };
  }

  existing.count += 1;
  return { allowed: true, retryAfterSeconds: 0 };
}

function removeExpiredEntries(now: number) {
  if (entries.size < 500) return;

  entries.forEach((entry, identifier) => {
    if (entry.resetAt <= now) entries.delete(identifier);
  });
}
