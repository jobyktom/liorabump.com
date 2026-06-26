import { NextResponse } from "next/server";
import { createHash, randomBytes, randomUUID } from "crypto";
import { getPrisma } from "@/lib/prisma";
import { getResend } from "@/lib/resend";

const RESET_TOKEN_TTL_MS = 1000 * 60 * 60;

export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as Record<string, unknown>;
  const email = String(body.email ?? "").trim().toLowerCase();

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ ok: true });
  }

  const prisma = getPrisma();
  const profile = await prisma.user.findUnique({ where: { email } });
  if (!profile) return NextResponse.json({ ok: true });

  const token = randomBytes(32).toString("base64url");
  const tokenHash = hashToken(token);
  const expiresAt = new Date(Date.now() + RESET_TOKEN_TTL_MS);

  await prisma.passwordResetToken.create({ data: { id: randomUUID(), profileId: profile.id, tokenHash, expiresAt } });

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://liorabump.com";
  const resetUrl = `${appUrl.replace(/\/$/, "")}/reset-password?token=${encodeURIComponent(token)}`;
  const resend = getResend();

  if (resend) {
    await resend.emails.send({
      from: process.env.CONTACT_FROM_EMAIL ?? "LioraBump <onboarding@resend.dev>",
      to: [profile.email],
      subject: "Reset your LioraBump password",
      text: `Use this secure link to reset your LioraBump password. It expires in 1 hour.\n\n${resetUrl}`,
    });
  } else {
    console.warn(`Password reset requested but Resend is not configured. Reset URL: ${resetUrl}`);
  }

  return NextResponse.json({ ok: true });
}

function hashToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}
