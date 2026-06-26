import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import mysql from "mysql2/promise";

export const dynamic = "force-dynamic";

type TableConfig = {
  name: string;
  columns: string[];
  primaryKeys: string[];
  jsonColumns?: Set<string>;
  optional?: boolean;
};

type DbValue = string | number | boolean | Date | Buffer | null;
type SupabaseReader = {
  from: (table: string) => {
    select: (columns: string) => {
      range: (from: number, to: number) => unknown;
    };
  };
};

const schemaStatements = [
  "create table if not exists profiles (id char(36) primary key, email varchar(254) not null unique, full_name varchar(255), role enum('mother', 'partner', 'family_viewer', 'admin', 'sponsor') not null default 'mother', country varchar(120), created_at timestamp not null default current_timestamp) engine=InnoDB default charset=utf8mb4 collate=utf8mb4_unicode_ci",
  "alter table profiles add column if not exists password_hash varchar(255) null",
  "alter table profiles add column if not exists email_verified_at timestamp null",
  "alter table profiles add column if not exists auth_provider varchar(40) not null default 'password'",
  "create table if not exists password_reset_tokens (id char(36) primary key, profile_id char(36) not null, token_hash char(64) not null unique, expires_at timestamp not null, used_at timestamp null, created_at timestamp not null default current_timestamp, index password_reset_tokens_profile_id_idx (profile_id), constraint password_reset_tokens_profile_id_fk foreign key (profile_id) references profiles(id) on delete cascade) engine=InnoDB default charset=utf8mb4 collate=utf8mb4_unicode_ci",
  "create table if not exists families (id char(36) primary key, owner_id char(36) not null, baby_nickname varchar(255) not null, due_date date, country varchar(120), privacy_level enum('private', 'partner', 'family') not null default 'private', subscription_plan varchar(50) not null default 'free', stripe_customer_id varchar(255), stripe_subscription_id varchar(255), created_at timestamp not null default current_timestamp, index families_owner_id_idx (owner_id), constraint families_owner_id_fk foreign key (owner_id) references profiles(id) on delete cascade) engine=InnoDB default charset=utf8mb4 collate=utf8mb4_unicode_ci",
  "create table if not exists family_members (family_id char(36) not null, profile_id char(36) not null, member_role enum('mother', 'partner', 'family_viewer', 'admin', 'sponsor') not null, consent_granted_at timestamp null, primary key (family_id, profile_id), index family_members_profile_id_idx (profile_id), constraint family_members_family_id_fk foreign key (family_id) references families(id) on delete cascade, constraint family_members_profile_id_fk foreign key (profile_id) references profiles(id) on delete cascade) engine=InnoDB default charset=utf8mb4 collate=utf8mb4_unicode_ci",
  "create table if not exists partner_invites (id char(36) primary key, family_id char(36) not null, invited_email varchar(254) not null, invited_by char(36) not null, status varchar(40) not null default 'pending', created_at timestamp not null default current_timestamp, index partner_invites_family_id_idx (family_id), index partner_invites_invited_by_idx (invited_by), constraint partner_invites_family_id_fk foreign key (family_id) references families(id) on delete cascade, constraint partner_invites_invited_by_fk foreign key (invited_by) references profiles(id) on delete cascade) engine=InnoDB default charset=utf8mb4 collate=utf8mb4_unicode_ci",
  "create table if not exists appointments (id char(36) primary key, family_id char(36) not null, title varchar(255) not null, appointment_type varchar(120), starts_at timestamp not null, notes text, created_at timestamp not null default current_timestamp, index appointments_family_id_starts_at_idx (family_id, starts_at), constraint appointments_family_id_fk foreign key (family_id) references families(id) on delete cascade) engine=InnoDB default charset=utf8mb4 collate=utf8mb4_unicode_ci",
  "create table if not exists health_entries (id char(36) primary key, family_id char(36) not null, entry_type varchar(120) not null, value json not null, recorded_at timestamp not null default current_timestamp, index health_entries_family_id_recorded_at_idx (family_id, recorded_at), constraint health_entries_family_id_fk foreign key (family_id) references families(id) on delete cascade) engine=InnoDB default charset=utf8mb4 collate=utf8mb4_unicode_ci",
  "create table if not exists journal_entries (id char(36) primary key, family_id char(36) not null, author_id char(36) not null, title varchar(255), body text not null, pregnancy_week int, created_at timestamp not null default current_timestamp, index journal_entries_family_id_created_at_idx (family_id, created_at), index journal_entries_author_id_idx (author_id), constraint journal_entries_family_id_fk foreign key (family_id) references families(id) on delete cascade, constraint journal_entries_author_id_fk foreign key (author_id) references profiles(id) on delete cascade) engine=InnoDB default charset=utf8mb4 collate=utf8mb4_unicode_ci",
  "create table if not exists media_assets (id char(36) primary key, family_id char(36) not null, owner_id char(36) not null, asset_type enum('photo', 'video', 'scan', 'document', 'voice_note') not null, storage_path text not null, caption varchar(500), created_at timestamp not null default current_timestamp, index media_assets_family_id_created_at_idx (family_id, created_at), index media_assets_owner_id_idx (owner_id), constraint media_assets_family_id_fk foreign key (family_id) references families(id) on delete cascade, constraint media_assets_owner_id_fk foreign key (owner_id) references profiles(id) on delete cascade) engine=InnoDB default charset=utf8mb4 collate=utf8mb4_unicode_ci",
  "create table if not exists baby_milestones (id char(36) primary key, family_id char(36) not null, title varchar(255) not null, happened_on date, notes text, media_asset_id char(36), created_at timestamp not null default current_timestamp, index baby_milestones_family_id_created_at_idx (family_id, created_at), index baby_milestones_media_asset_id_idx (media_asset_id), constraint baby_milestones_family_id_fk foreign key (family_id) references families(id) on delete cascade, constraint baby_milestones_media_asset_id_fk foreign key (media_asset_id) references media_assets(id) on delete set null) engine=InnoDB default charset=utf8mb4 collate=utf8mb4_unicode_ci",
  "create table if not exists couple_tasks (id char(36) primary key, family_id char(36) not null, created_by char(36) not null, title varchar(255) not null, notes text, due_date date, assignee_label varchar(120) not null default 'Either of us', status enum('todo', 'in_progress', 'done') not null default 'todo', created_at timestamp not null default current_timestamp, index couple_tasks_family_id_status_due_date_idx (family_id, status, due_date), index couple_tasks_created_by_idx (created_by), constraint couple_tasks_family_id_fk foreign key (family_id) references families(id) on delete cascade, constraint couple_tasks_created_by_fk foreign key (created_by) references profiles(id) on delete cascade) engine=InnoDB default charset=utf8mb4 collate=utf8mb4_unicode_ci",
  "create table if not exists lead_captures (id char(36) primary key, email varchar(254) not null, source varchar(120) not null, marketing_consent boolean not null default false, created_at timestamp not null default current_timestamp, unique key lead_captures_email_source_unique (email, source)) engine=InnoDB default charset=utf8mb4 collate=utf8mb4_unicode_ci",
];

const tables: TableConfig[] = [
  { name: "profiles", columns: ["id", "email", "full_name", "role", "country", "created_at"], primaryKeys: ["id"] },
  { name: "families", columns: ["id", "owner_id", "baby_nickname", "due_date", "country", "privacy_level", "subscription_plan", "stripe_customer_id", "stripe_subscription_id", "created_at"], primaryKeys: ["id"] },
  { name: "family_members", columns: ["family_id", "profile_id", "member_role", "consent_granted_at"], primaryKeys: ["family_id", "profile_id"] },
  { name: "partner_invites", columns: ["id", "family_id", "invited_email", "invited_by", "status", "created_at"], primaryKeys: ["id"] },
  { name: "appointments", columns: ["id", "family_id", "title", "appointment_type", "starts_at", "notes", "created_at"], primaryKeys: ["id"] },
  { name: "health_entries", columns: ["id", "family_id", "entry_type", "value", "recorded_at"], primaryKeys: ["id"], jsonColumns: new Set(["value"]) },
  { name: "journal_entries", columns: ["id", "family_id", "author_id", "title", "body", "pregnancy_week", "created_at"], primaryKeys: ["id"] },
  { name: "media_assets", columns: ["id", "family_id", "owner_id", "asset_type", "storage_path", "caption", "created_at"], primaryKeys: ["id"] },
  { name: "baby_milestones", columns: ["id", "family_id", "title", "happened_on", "notes", "media_asset_id", "created_at"], primaryKeys: ["id"] },
  { name: "couple_tasks", columns: ["id", "family_id", "created_by", "title", "notes", "due_date", "assignee_label", "status", "created_at"], primaryKeys: ["id"], optional: true },
  { name: "lead_captures", columns: ["id", "email", "source", "marketing_consent", "created_at"], primaryKeys: ["id"], optional: true },
];

function missingEnv() {
  return ["MIGRATION_SECRET", "NEXT_PUBLIC_SUPABASE_URL", "SUPABASE_SERVICE_ROLE_KEY", "MYSQL_HOST", "MYSQL_DATABASE", "MYSQL_USER", "MYSQL_PASSWORD"].filter((key) => !process.env[key]);
}

function normalizeValue(value: unknown, column: string, jsonColumns = new Set<string>()): DbValue {
  if (value === undefined) return null;
  if (jsonColumns.has(column)) return JSON.stringify(value);
  if (value === null || typeof value === "string" || typeof value === "number" || typeof value === "boolean" || value instanceof Date || Buffer.isBuffer(value)) return value;
  return String(value);
}

async function readSupabaseRows(table: TableConfig, supabase: SupabaseReader) {
  const pageSize = 1000;
  const rows: Record<string, unknown>[] = [];

  for (let from = 0; ; from += pageSize) {
    const to = from + pageSize - 1;
    const { data, error } = (await supabase.from(table.name).select("*").range(from, to)) as {
      data: Record<string, unknown>[] | null;
      error: { message: string } | null;
    };
    if (error) {
      if (table.optional && error.message.toLowerCase().includes("could not find the table")) return [];
      throw new Error(`Supabase read failed for ${table.name}: ${error.message}`);
    }
    rows.push(...((data as Record<string, unknown>[] | null) ?? []));
    if (!data || data.length < pageSize) break;
  }

  return rows;
}

async function upsertRows(connection: mysql.PoolConnection, table: TableConfig, rows: Record<string, unknown>[]) {
  if (rows.length === 0) return;

  const columnList = table.columns.map((column) => `\`${column}\``).join(", ");
  const placeholders = table.columns.map(() => "?").join(", ");
  const updateList = table.columns
    .filter((column) => !table.primaryKeys.includes(column))
    .map((column) => `\`${column}\` = values(\`${column}\`)`)
    .join(", ");
  const sql = `insert into \`${table.name}\` (${columnList}) values (${placeholders}) on duplicate key update ${updateList}`;

  for (const row of rows) {
    const values: DbValue[] = table.columns.map((column) => normalizeValue(row[column], column, table.jsonColumns));
    await connection.execute(sql, values);
  }
}

function safeError(error: unknown) {
  if (!(error instanceof Error)) return { message: String(error) };
  const details = error as Error & { code?: string; errno?: number; sqlState?: string };
  return {
    message: error.message,
    code: details.code,
    errno: details.errno,
    sqlState: details.sqlState,
  };
}

export async function POST(request: Request) {
  const missing = missingEnv();
  if (missing.length > 0) {
    return NextResponse.json({ error: "Migration is not configured.", missing }, { status: 503 });
  }

  if (request.headers.get("x-migration-secret") !== process.env.MIGRATION_SECRET) {
    return NextResponse.json({ error: "Not found." }, { status: 404 });
  }

  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
  const mysqlPool = mysql.createPool({
    host: process.env.MYSQL_HOST,
    port: Number(process.env.MYSQL_PORT ?? 3306),
    database: process.env.MYSQL_DATABASE,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    waitForConnections: true,
    connectionLimit: 2,
    timezone: "Z",
  });

  const migrated: Record<string, number> = {};
  let connection: mysql.PoolConnection | null = null;
  let phase = "connect";

  try {
    connection = await mysqlPool.getConnection();
    phase = "begin_transaction";
    await connection.beginTransaction();

    phase = "create_schema";
    for (const statement of schemaStatements) {
      await connection.execute(statement);
    }

    for (const table of tables) {
      phase = `read_supabase_${table.name}`;
      const rows = await readSupabaseRows(table, supabase as unknown as SupabaseReader);
      phase = `write_mysql_${table.name}`;
      await upsertRows(connection, table, rows);
      migrated[table.name] = rows.length;
    }

    phase = "commit";
    await connection.commit();
    return NextResponse.json({ ok: true, migrated });
  } catch (error) {
    if (connection) await connection.rollback();
    console.error("MySQL migration failed", error);
    return NextResponse.json({ error: "Migration failed.", phase, details: safeError(error) }, { status: 500 });
  } finally {
    if (connection) connection.release();
    await mysqlPool.end();
  }
}
