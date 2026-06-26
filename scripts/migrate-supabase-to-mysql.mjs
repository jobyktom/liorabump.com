import { createClient } from "@supabase/supabase-js";
import mysql from "mysql2/promise";

const requiredEnv = [
  "NEXT_PUBLIC_SUPABASE_URL",
  "SUPABASE_SERVICE_ROLE_KEY",
  "MYSQL_HOST",
  "MYSQL_DATABASE",
  "MYSQL_USER",
  "MYSQL_PASSWORD",
];

for (const name of requiredEnv) {
  if (!process.env[name]) {
    console.error(`Missing required environment variable: ${name}`);
    process.exit(1);
  }
}

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const mysqlPool = mysql.createPool({
  host: process.env.MYSQL_HOST,
  port: Number(process.env.MYSQL_PORT ?? 3306),
  database: process.env.MYSQL_DATABASE,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  waitForConnections: true,
  connectionLimit: 4,
  namedPlaceholders: true,
  timezone: "Z",
});

const tables = [
  {
    name: "profiles",
    columns: ["id", "email", "full_name", "role", "country", "created_at"],
  },
  {
    name: "families",
    columns: [
      "id",
      "owner_id",
      "baby_nickname",
      "due_date",
      "country",
      "privacy_level",
      "subscription_plan",
      "stripe_customer_id",
      "stripe_subscription_id",
      "created_at",
    ],
  },
  {
    name: "family_members",
    columns: ["family_id", "profile_id", "member_role", "consent_granted_at"],
  },
  {
    name: "partner_invites",
    columns: ["id", "family_id", "invited_email", "invited_by", "status", "created_at"],
  },
  {
    name: "appointments",
    columns: ["id", "family_id", "title", "appointment_type", "starts_at", "notes", "created_at"],
  },
  {
    name: "health_entries",
    columns: ["id", "family_id", "entry_type", "value", "recorded_at"],
    jsonColumns: new Set(["value"]),
  },
  {
    name: "journal_entries",
    columns: ["id", "family_id", "author_id", "title", "body", "pregnancy_week", "created_at"],
  },
  {
    name: "media_assets",
    columns: ["id", "family_id", "owner_id", "asset_type", "storage_path", "caption", "created_at"],
  },
  {
    name: "baby_milestones",
    columns: ["id", "family_id", "title", "happened_on", "notes", "media_asset_id", "created_at"],
  },
  {
    name: "couple_tasks",
    columns: ["id", "family_id", "created_by", "title", "notes", "due_date", "assignee_label", "status", "created_at"],
  },
  {
    name: "lead_captures",
    columns: ["id", "email", "source", "marketing_consent", "created_at"],
  },
];

function normalizeValue(value, column, jsonColumns = new Set()) {
  if (value === undefined) return null;
  if (jsonColumns.has(column)) return JSON.stringify(value);
  return value;
}

async function readSupabaseRows(table) {
  const pageSize = 1000;
  const rows = [];

  for (let from = 0; ; from += pageSize) {
    const to = from + pageSize - 1;
    const { data, error } = await supabase.from(table.name).select("*").range(from, to);

    if (error) {
      throw new Error(`Supabase read failed for ${table.name}: ${error.message}`);
    }

    rows.push(...(data ?? []));
    if (!data || data.length < pageSize) break;
  }

  return rows;
}

async function upsertRows(connection, table, rows) {
  if (rows.length === 0) return;

  const columnList = table.columns.map((column) => `\`${column}\``).join(", ");
  const placeholders = table.columns.map(() => "?").join(", ");
  const updateList = table.columns
    .filter((column) => column !== "id")
    .map((column) => `\`${column}\` = values(\`${column}\`)`)
    .join(", ");
  const sql = `insert into \`${table.name}\` (${columnList}) values (${placeholders}) on duplicate key update ${updateList}`;

  for (const row of rows) {
    const values = table.columns.map((column) => normalizeValue(row[column], column, table.jsonColumns));
    await connection.execute(sql, values);
  }
}

async function main() {
  const connection = await mysqlPool.getConnection();

  try {
    await connection.beginTransaction();

    for (const table of tables) {
      const rows = await readSupabaseRows(table);
      await upsertRows(connection, table, rows);
      console.log(`Migrated ${rows.length} row(s): ${table.name}`);
    }

    await connection.commit();
    console.log("Migration completed successfully.");
  } catch (error) {
    await connection.rollback();
    console.error(error);
    process.exitCode = 1;
  } finally {
    connection.release();
    await mysqlPool.end();
  }
}

await main();
