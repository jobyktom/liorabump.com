import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { randomUUID } from "crypto";
import { execute, queryRows } from "@/lib/mysql";

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "Please try again." }, { status: 400 });
  }

  const fullName = String(body.fullName ?? "").trim();
  const email = String(body.email ?? "").trim().toLowerCase();
  const password = String(body.password ?? "");

  if (!fullName || fullName.length > 255) return NextResponse.json({ error: "Please enter your name." }, { status: 400 });
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return NextResponse.json({ error: "Enter a valid email address." }, { status: 400 });
  if (password.length < 8) return NextResponse.json({ error: "Use at least 8 characters for your password." }, { status: 400 });

  const [existing] = await queryRows<{ id: string; password_hash: string | null }>(
    "select id,password_hash from profiles where email = ? limit 1",
    [email]
  );

  if (existing?.password_hash) {
    return NextResponse.json({ error: "An account already exists for this email. Please sign in instead." }, { status: 409 });
  }

  const passwordHash = await bcrypt.hash(password, 12);

  if (existing) {
    await execute("update profiles set full_name = ?, password_hash = ?, auth_provider = ? where id = ?", [fullName, passwordHash, "password", existing.id]);
  } else {
    await execute("insert into profiles (id,email,full_name,password_hash,auth_provider) values (?,?,?,?,?)", [
      randomUUID(),
      email,
      fullName,
      passwordHash,
      "password",
    ]);
  }

  return NextResponse.json({ ok: true });
}
