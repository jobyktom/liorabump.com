import { NextResponse } from "next/server";
import * as Sentry from "@sentry/nextjs";
import { consumeContactRequest } from "@/lib/contact-rate-limit";
import { getResend } from "@/lib/resend";

const MAX_NAME_LENGTH = 120;
const MAX_EMAIL_LENGTH = 254;
const MAX_MESSAGE_LENGTH = 5000;

export async function POST(request: Request) {
  const requestId = crypto.randomUUID();
  const contentLength = Number(request.headers.get("content-length") ?? "0");
  if (contentLength > 16_000) {
    return NextResponse.json({ error: "Please keep your message under 5,000 characters." }, { status: 413 });
  }

  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "Please submit the contact form again." }, { status: 400 });
  }

  const name = String(body.name ?? "").trim().replace(/[\r\n]+/g, " ");
  const email = String(body.email ?? "").trim();
  const message = String(body.message ?? "").trim();
  const website = String(body.website ?? "").trim();

  if (website) {
    return NextResponse.json({ ok: true });
  }

  if (!name || name.length > MAX_NAME_LENGTH || !isEmail(email) || email.length > MAX_EMAIL_LENGTH || message.length < 10 || message.length > MAX_MESSAGE_LENGTH) {
    return NextResponse.json({ error: "Please enter a name, a valid email address and a message between 10 and 5,000 characters." }, { status: 400 });
  }

  const rateLimit = consumeContactRequest(getClientIdentifier(request));
  if (!rateLimit.allowed) {
    return NextResponse.json(
      { error: "Please wait a few minutes before sending another message." },
      { status: 429, headers: { "Retry-After": String(rateLimit.retryAfterSeconds) } }
    );
  }

  const resend = getResend();

  if (!resend) {
    return NextResponse.json({ error: "Contact email is not configured yet. Please email jobyktom@gmail.com directly." }, { status: 503 });
  }

  try {
    const { error } = await resend.emails.send({
      from: process.env.CONTACT_FROM_EMAIL ?? "LioraBump <onboarding@resend.dev>",
      to: [process.env.CONTACT_TO_EMAIL ?? "jobyktom@gmail.com"],
      replyTo: email,
      subject: `LioraBump contact: ${name}`,
      text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`
    });

    if (error) {
      reportContactFailure(requestId, error);
      return NextResponse.json({ error: `We could not send your message. Please email jobyktom@gmail.com directly and quote reference ${requestId}.` }, { status: 502 });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    reportContactFailure(requestId, error);
    return NextResponse.json({ error: `We could not send your message. Please email jobyktom@gmail.com directly and quote reference ${requestId}.` }, { status: 502 });
  }
}

function isEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function getClientIdentifier(request: Request) {
  return request.headers.get("x-forwarded-for")?.split(",")[0]?.trim()
    ?? request.headers.get("x-real-ip")
    ?? "unknown";
}

function reportContactFailure(requestId: string, error: unknown) {
  const providerMessage = error instanceof Error ? error.message : String(error);
  const details = { requestId, providerMessage, hasFromAddress: Boolean(process.env.CONTACT_FROM_EMAIL) };
  console.error(JSON.stringify({ level: "error", message: "Contact email failed", route: "/api/contact", ...details }));
  Sentry.captureException(error, { tags: { route: "/api/contact" }, extra: details });
}
