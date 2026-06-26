import { PrismaClient } from "@prisma/client";

declare global {
  var liorabumpPrisma: PrismaClient | undefined;
}

export function hasDatabaseUrl() {
  return Boolean(getDatabaseUrl());
}

export function getPrisma() {
  const databaseUrl = getDatabaseUrl();
  if (!databaseUrl) {
    throw new Error("DATABASE_URL is not configured.");
  }

  process.env.DATABASE_URL = databaseUrl;

  if (!globalThis.liorabumpPrisma) {
    globalThis.liorabumpPrisma = new PrismaClient();
  }

  return globalThis.liorabumpPrisma;
}

function getDatabaseUrl() {
  if (process.env.DATABASE_URL) return process.env.DATABASE_URL;
  if (!process.env.MYSQL_HOST || !process.env.MYSQL_DATABASE || !process.env.MYSQL_USER || !process.env.MYSQL_PASSWORD) return null;

  const user = encodeURIComponent(process.env.MYSQL_USER);
  const password = encodeURIComponent(process.env.MYSQL_PASSWORD);
  const host = process.env.MYSQL_HOST;
  const port = process.env.MYSQL_PORT ?? "3306";
  const database = encodeURIComponent(process.env.MYSQL_DATABASE);
  return `mysql://${user}:${password}@${host}:${port}/${database}`;
}
