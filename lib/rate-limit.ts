import { createHash } from "crypto";
import { Prisma, type PrismaClient } from "@prisma/client";
import { getPrisma } from "@/lib/prisma";

type RateLimitOptions = {
  bucket: string;
  identifier: string;
  limit: number;
  windowMs: number;
};

type RateLimitResult = {
  allowed: boolean;
  retryAfterSeconds: number;
};

type RateLimitRow = {
  count: number;
  resetAt: Date | string;
};

let tableReady = false;

export async function consumeDurableRateLimit(options: RateLimitOptions): Promise<RateLimitResult> {
  const prisma = getPrisma();
  await ensureRateLimitTable(prisma);

  const now = new Date();
  const resetAt = new Date(now.getTime() + options.windowMs);
  const key = hashRateLimitKey(`${options.bucket}:${options.identifier}`);

  return prisma.$transaction(async (tx) => {
    await tx.$executeRaw(Prisma.sql`delete from rate_limits where reset_at <= ${now}`);

    const rows = await tx.$queryRaw<RateLimitRow[]>(
      Prisma.sql`select count, reset_at as resetAt from rate_limits where \`key\` = ${key} for update`
    );
    const existing = rows[0];

    if (!existing || new Date(existing.resetAt).getTime() <= now.getTime()) {
      await tx.$executeRaw(
        Prisma.sql`insert into rate_limits (\`key\`, count, reset_at) values (${key}, 1, ${resetAt}) on duplicate key update count = 1, reset_at = ${resetAt}`
      );
      return { allowed: true, retryAfterSeconds: 0 };
    }

    const retryAfterSeconds = Math.max(1, Math.ceil((new Date(existing.resetAt).getTime() - now.getTime()) / 1000));
    if (existing.count >= options.limit) {
      return { allowed: false, retryAfterSeconds };
    }

    await tx.$executeRaw(Prisma.sql`update rate_limits set count = count + 1 where \`key\` = ${key}`);
    return { allowed: true, retryAfterSeconds: 0 };
  });
}

export function getClientIdentifier(request: Request, email?: string) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    request.headers.get("x-real-ip") ??
    "unknown";

  return email ? `${ip}:${email.toLowerCase()}` : ip;
}

async function ensureRateLimitTable(prisma: PrismaClient) {
  if (tableReady) return;

  await prisma.$executeRawUnsafe(
    "create table if not exists rate_limits (`key` varchar(191) primary key, count int not null, reset_at datetime not null, updated_at timestamp not null default current_timestamp on update current_timestamp, index rate_limits_reset_at_idx (reset_at)) engine=InnoDB default charset=utf8mb4 collate=utf8mb4_unicode_ci"
  );
  tableReady = true;
}

function hashRateLimitKey(value: string) {
  return createHash("sha256").update(value).digest("hex");
}
