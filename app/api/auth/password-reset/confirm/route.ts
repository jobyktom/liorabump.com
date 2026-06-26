import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { createHash } from "crypto";
import { getPrisma } from "@/lib/prisma";

export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as Record<string, unknown>;
  const token = String(body.token ?? "");
  const password = String(body.password ?? "");

  if (!token || password.length < 8) {
    return NextResponse.json({ error: "This reset link is invalid or the password is too short." }, { status: 400 });
  }

  const tokenHash = createHash("sha256").update(token).digest("hex");
  const prisma = getPrisma();
  const reset = await prisma.passwordResetToken.findFirst({
    where: { tokenHash, usedAt: null, expiresAt: { gt: new Date() } },
  });

  if (!reset) {
    return NextResponse.json({ error: "This reset link has expired. Please request a new one." }, { status: 400 });
  }

  const passwordHash = await bcrypt.hash(password, 12);
  await prisma.user.update({ where: { id: reset.profileId }, data: { passwordHash, authProvider: "password" } });
  await prisma.passwordResetToken.update({ where: { id: reset.id }, data: { usedAt: new Date() } });

  return NextResponse.json({ ok: true });
}
