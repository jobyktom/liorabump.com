import mysql from "mysql2/promise";

let pool: mysql.Pool | null = null;

export type DbValue = string | number | boolean | Date | Buffer | null;

export function hasMysqlEnv() {
  return Boolean(process.env.MYSQL_HOST && process.env.MYSQL_DATABASE && process.env.MYSQL_USER && process.env.MYSQL_PASSWORD);
}

export function getMysqlPool() {
  if (!hasMysqlEnv()) {
    throw new Error("Hostinger MySQL is not configured.");
  }

  if (!pool) {
    pool = mysql.createPool({
      host: process.env.MYSQL_HOST,
      port: Number(process.env.MYSQL_PORT ?? 3306),
      database: process.env.MYSQL_DATABASE,
      user: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASSWORD,
      waitForConnections: true,
      connectionLimit: 5,
      timezone: "Z",
    });
  }

  return pool;
}

export async function queryRows<T>(sql: string, values: DbValue[] = []) {
  const [rows] = await getMysqlPool().execute(sql, values);
  return rows as T[];
}

export async function execute(sql: string, values: DbValue[] = []) {
  return getMysqlPool().execute(sql, values);
}
