import { NextResponse } from "next/server";
import { getPrisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const tables = [
  "couple_tasks",
  "baby_milestones",
  "media_assets",
  "journal_entries",
  "health_entries",
  "appointments",
  "partner_invites",
  "family_members",
  "families",
  "password_reset_tokens",
  "sessions",
  "accounts",
  "verification_tokens",
  "lead_captures",
  "profiles"
] as const;

type CountRow = { count: bigint | number | string };

export async function POST(request: Request) {
  const secret = process.env.MIGRATION_SECRET;
  if (!secret) {
    return NextResponse.json({ error: "Reset is not configured.", missing: ["MIGRATION_SECRET"] }, { status: 503 });
  }

  if (request.headers.get("x-migration-secret") !== secret) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const prisma = getPrisma();

  try {
    const before = await countRows(prisma);

    await prisma.$executeRawUnsafe("set foreign_key_checks = 0");
    try {
      for (const table of tables) {
        await prisma.$executeRawUnsafe(`truncate table \`${table}\``);
      }
    } finally {
      await prisma.$executeRawUnsafe("set foreign_key_checks = 1");
    }

    const after = await countRows(prisma);
    return NextResponse.json({ ok: true, reset: { before, after } });
  } catch (error) {
    await prisma.$executeRawUnsafe("set foreign_key_checks = 1").catch(() => undefined);
    return NextResponse.json({ error: "Database reset failed.", details: safeError(error) }, { status: 500 });
  }
}

async function countRows(prisma: ReturnType<typeof getPrisma>) {
  const counts: Record<string, number> = {};

  for (const table of tables) {
    const rows = await prisma.$queryRawUnsafe<CountRow[]>(`select count(*) as count from \`${table}\``);
    counts[table] = Number(rows[0]?.count ?? 0);
  }

  return counts;
}

function safeError(error: unknown) {
  if (!(error instanceof Error)) return { message: String(error) };
  const details = error as Error & { code?: string; errno?: number; sqlState?: string };
  return {
    message: error.message,
    code: details.code,
    errno: details.errno,
    sqlState: details.sqlState
  };
}
