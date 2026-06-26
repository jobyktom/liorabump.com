# Hostinger MySQL Migration

This migration moves LioraBump app tables from Supabase Postgres into Hostinger MySQL.

Important: Supabase is currently doing three jobs:

- Authentication and sessions
- Private file storage for scans, photos and documents
- App database tables

Hostinger MySQL only replaces the app database tables. If you also want to remove Supabase Auth and Storage, that is a separate migration to an auth system such as Auth.js plus object/file storage.

## Recommended Route

Use a staged migration:

1. Keep Supabase Auth and Supabase Storage running.
2. Copy app tables into Hostinger MySQL.
3. Verify row counts and important records.
4. Add a MySQL data layer in the app.
5. Switch table reads/writes to MySQL.
6. Keep Supabase only for login and private file URLs until auth/storage are replaced.

This avoids breaking existing logins, password resets, invites and uploaded files.

## Create The Database In Hostinger

1. Open Hostinger hPanel.
2. Go to **Websites** and choose `liorabump.com`.
3. Open **Databases** or **Management > Databases**.
4. Create a new MySQL database.
5. Save these values:
   - MySQL host
   - Database name
   - Database username
   - Database password
   - Port, usually `3306`
6. Open phpMyAdmin for that database.
7. Run the SQL in `mysql/schema.sql`.

## Add Local Environment Variables

Add these to `.env.local` temporarily on your machine:

```bash
MYSQL_HOST=your-hostinger-mysql-host
MYSQL_PORT=3306
MYSQL_DATABASE=your-hostinger-database-name
MYSQL_USER=your-hostinger-database-user
MYSQL_PASSWORD=your-hostinger-database-password
```

Keep your existing Supabase values too:

```bash
NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
```

## Run The Copy

From the project folder:

```bash
npm install
npm run migrate:supabase-to-mysql
```

The script copies these tables in dependency order:

- `profiles`
- `families`
- `family_members`
- `partner_invites`
- `appointments`
- `health_entries`
- `journal_entries`
- `media_assets`
- `baby_milestones`
- `couple_tasks`
- `lead_captures`

It uses upserts, so you can run it more than once during testing.

## If Hostinger Does Not Deploy The Scripts Folder

Some Hostinger Node.js deployments copy only the runtime bundle, so `mysql/` and `scripts/` may not appear in SSH after a Git rebuild.

Use the protected runtime migration endpoint instead:

1. Add these Hostinger environment variables:

```bash
MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_DATABASE=u225675349_liorabump
MYSQL_USER=u225675349_lioraadmin
MYSQL_PASSWORD=your-mysql-password
MIGRATION_SECRET=generate-a-long-random-one-time-secret
```

2. Make sure Supabase variables are also present:

```bash
NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
```

3. Rebuild/redeploy the app.
4. From your computer, call:

```bash
curl -X POST https://liorabump.com/api/admin/mysql-migration \
  -H "x-migration-secret: your-long-random-one-time-secret"
```

5. Confirm the response returns `{"ok":true,...}` with row counts.
6. Remove `MIGRATION_SECRET` from Hostinger environment variables after the migration.

## Verify In phpMyAdmin

Run:

```sql
select count(*) from profiles;
select count(*) from families;
select count(*) from family_members;
select count(*) from appointments;
select count(*) from health_entries;
select count(*) from journal_entries;
select count(*) from media_assets;
select count(*) from baby_milestones;
select count(*) from couple_tasks;
select count(*) from lead_captures;
```

Compare those counts with Supabase Table Editor.

## What Not To Delete Yet

Do not delete the Supabase project after this copy.

The live app still depends on Supabase for:

- Sign up
- Login
- Password reset
- Session cookies
- Invite acceptance user lookup
- Uploading files
- Creating signed private file links

After the MySQL data layer is added and tested, Supabase can be reduced to auth/storage only. Removing Supabase completely needs a second phase.
