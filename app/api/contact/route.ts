import { NextResponse } from "next/server";
import { getResend } from "@/lib/resend";

const MAX_NAME_LENGTH = 120;
const MAX_EMAIL_LENGTH = 254;
const MAX_MESSAGE_LENGTH = 5000;

export async function POST(request: Request) {
  const body = (await request.json()) as Record<string, unknown>;
  const name = String(body.name ?? "").trim();
  const email = String(body.email ?? "").trim();
  const message = String(body.message ?? "").trim();
  const website = String(body.website ?? "").trim();

  if (website) {
    return NextResponse.json({ ok: true });
  }

  if (!name || name.length > MAX_NAME_LENGTH || !isEmail(email) || email.length > MAX_EMAIL_LENGTH || message.length < 10 || message.length > MAX_MESSAGE_LENGTH) {
    return NextResponse.json({ error: "Please enter a name, a valid email address and a message between 10 and 5,000 characters." }, { status: 400 });
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
      console.error("Contact email failed", error);
      return NextResponse.json({ error: "We could not send your message. Please email jobyktom@gmail.com directly." }, { status: 502 });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Contact email failed", error);
    return NextResponse.json({ error: "We could not send your message. Please email jobyktom@gmail.com directly." }, { status: 502 });
  }
}

function isEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}
