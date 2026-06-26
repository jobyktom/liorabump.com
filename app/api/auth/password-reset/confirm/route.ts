import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { createHash } from "crypto";
import { execute, queryRows } from "@/lib/mysql";

export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as Record<string, unknown>;
  const token = String(body.token ?? "");
  const password = String(body.password ?? "");

  if (!token || password.length < 8) {
    return NextResponse.json({ error: "This reset link is invalid or the password is too short." }, { status: 400 });
  }

  const tokenHash = createHash("sha256").update(token).digest("hex");
  const [reset] = await queryRows<{ id: string; profile_id: string }>(
    "select id,profile_id from password_reset_tokens where token_hash = ? and used_at is null and expires_at > now() limit 1",
    [tokenHash]
  );

  if (!reset) {
    return NextResponse.json({ error: "This reset link has expired. Please request a new one." }, { status: 400 });
  }

  const passwordHash = await bcrypt.hash(password, 12);
  await execute("update profiles set password_hash = ?, auth_provider = ? where id = ?", [passwordHash, "password", reset.profile_id]);
  await execute("update password_reset_tokens set used_at = now() where id = ?", [reset.id]);

  return NextResponse.json({ ok: true });
}
