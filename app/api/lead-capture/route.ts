import { NextResponse } from "next/server";
import { getPrisma } from "@/lib/prisma";

const source = "hospital-bag-checklist";

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try { body = await request.json() as Record<string, unknown>; } catch { return NextResponse.json({ error: "Please try again." }, { status: 400 }); }
  const email = String(body.email ?? "").trim().toLowerCase();
  const marketingConsent = body.marketingConsent === true;
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254) return NextResponse.json({ error: "Enter a valid email address." }, { status: 400 });

  try {
    await getPrisma().leadCapture.upsert({
      where: { email_source: { email, source } },
      update: { marketingConsent },
      create: { email, source, marketingConsent }
    });
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error(JSON.stringify({ level: "error", message: "Lead capture failed", route: "/api/lead-capture", error: error instanceof Error ? error.message : String(error) }));
    return NextResponse.json({ error: "We could not save your email. Please try again." }, { status: 503 });
  }
}
