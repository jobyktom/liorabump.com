# LioraBump

LioraBump is a mobile-first pregnancy, baby and family journey web app for expecting parents.

Tagline: From the first scan to the first steps.

## What is included

- Next.js, TypeScript and Tailwind CSS web app
- Updated LioraBump branding: logo mark, app icon, cream/peach/lavender/coral palette
- AI-generated landing page hero image saved in `public/images/liorabump-hero-generated.png`
- Public SEO-ready pages: home, features, pricing, blog, article template, due date calculator
- App preview: onboarding, pregnancy dashboard, health/memory/partner modules
- Week-by-week pregnancy sample content for weeks 1 to 42
- Baby milestone sample content from birth to 24 months
- Admin dashboard preview for content, sponsors, notifications and analytics
- Privacy, terms and medical disclaimer starter pages
- Sponsor-ready labelled offer areas

## Local setup

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Hostinger deployment

If your Hostinger plan supports Node.js apps:

1. Push this repository to GitHub.
2. In Hostinger, create a Node.js app or connect the GitHub repository if your plan supports Git deployment.
3. Set the install command to `npm install`.
4. Set the build command to `npm run build`.
5. Set the start command to `npm run start`.
6. Set the app port to the port Hostinger provides in `PORT`.
7. Point `liorabump.com` to the app in Hostinger DNS/domain settings.
8. Enable SSL for the domain.

If your Hostinger plan only supports static hosting, deploy this to Vercel/Netlify/Render and point the Hostinger DNS records for `liorabump.com` to that platform.

## Stripe pricing setup

The pricing page is wired for Stripe subscription Checkout. The Free plan redirects to onboarding. Premium and Family create Checkout Sessions when these environment variables exist:

```bash
NEXT_PUBLIC_APP_URL=https://liorabump.com
STRIPE_SECRET_KEY=sk_live_or_test_key
STRIPE_WEBHOOK_SECRET=whsec_webhook_secret
STRIPE_PREMIUM_PRICE_ID=price_premium_monthly
STRIPE_FAMILY_PRICE_ID=price_family_monthly
```

Stripe setup steps:

1. Create a Stripe account and keep it in test mode while building.
2. In Stripe Dashboard, create two recurring products/prices:
   - `LioraBump Premium` at `£6.99` monthly
   - `LioraBump Family` at `£9.99` monthly
3. Copy each recurring Price ID into `STRIPE_PREMIUM_PRICE_ID` and `STRIPE_FAMILY_PRICE_ID`.
4. Copy your test secret key into `STRIPE_SECRET_KEY`.
5. Add a webhook endpoint for `https://liorabump.com/api/webhook/stripe`.
6. Listen for at least:
   - `checkout.session.completed`
   - `invoice.payment_succeeded`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
7. Copy the webhook signing secret into `STRIPE_WEBHOOK_SECRET`.
8. Deploy and test with Stripe test cards.
9. When the database/auth layer is added, update `app/api/webhook/stripe/route.ts` to save the customer ID, subscription ID and active plan against the user/family account.

Why Checkout Sessions: it keeps card collection hosted by Stripe, supports subscriptions and promotion codes, and avoids building a custom PCI-sensitive payment form.

## Database status

The production app currently uses Supabase for authentication, app tables and private storage uploads. Hostinger MySQL migration files are included if you want to move app table data into the database hosted beside the website.

Use `supabase/schema.sql` for the current Supabase setup. Use `mysql/schema.sql` plus `npm run migrate:supabase-to-mysql` to copy app table data into Hostinger MySQL.

## Recommended database setup with Supabase

1. Create a Supabase project.
2. Copy the project URL and anon key.
3. Add environment variables to Hostinger:

```bash
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

4. In Supabase Dashboard, open **SQL Editor**.
5. Paste and run the SQL from `supabase/schema.sql`.
6. In **Authentication > Providers**, enable Email.
7. In **Authentication > URL Configuration**, set:
   - Site URL: `https://liorabump.com`
   - Redirect URL: `https://liorabump.com/auth/callback`
8. Create private storage buckets:

- `pregnancy-photos`
- `scan-uploads`
- `health-documents`
- `baby-albums`

9. Run `supabase/storage.sql` in SQL Editor to create/update those private buckets and storage policies.
10. Add Apple and Google sign-in before mobile launch.
11. Move static content from `lib/content.ts` into database tables only after the UI and content model are approved.

Local development:

1. Copy `.env.example` to `.env.local`.
2. Fill in `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
3. Restart `npm run dev`.
4. Visit `/signup`, create an account, confirm email, sign in, then complete `/app/onboarding`.

## Hostinger MySQL migration

The repo includes a MySQL schema and migration script:

- `mysql/schema.sql`
- `scripts/migrate-supabase-to-mysql.mjs`
- `docs/hostinger-mysql-migration.md`

Run `mysql/schema.sql` in Hostinger phpMyAdmin, add the `MYSQL_*` environment variables from `.env.example`, then run:

```bash
npm run migrate:supabase-to-mysql
```

This copies the app tables from Supabase to Hostinger MySQL. It does not replace Supabase Auth or Supabase Storage.

## App data mapping

The signed-in app dashboard and section pages now read from Supabase. Section records save to:

- `/app/calendar` -> `appointments`
- `/app/health-tracker`, `/app/food-guide`, `/app/kick-counter`, `/app/settings` -> `health_entries`
- `/app/journal`, `/app/birth-plan` -> `journal_entries`
- `/app/album`, `/app/scan-uploads` -> Supabase Storage upload + `media_assets`
- `/app/baby-profile` -> `baby_milestones`

Storage upload widgets are enabled for:

- `/app/album` -> `pregnancy-photos`
- `/app/scan-uploads` -> `scan-uploads`
- `/app/health-tracker` -> `health-documents`
- `/app/baby-profile` -> `baby-albums`

Files are stored under `<family_id>/<user_id>/<timestamp>-filename`, and the resulting private storage path is saved in `media_assets`. Saved private files are shown in the app with short-lived signed links so family members can open scans, photos and documents without making the buckets public.

## Initial database schema

```sql
create table profiles (
  id uuid primary key,
  email text not null unique,
  full_name text,
  role text not null check (role in ('mother', 'partner', 'family_viewer', 'admin', 'sponsor')),
  country text,
  created_at timestamptz default now()
);

create table families (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid references profiles(id),
  baby_nickname text,
  due_date date,
  privacy_level text not null default 'private',
  created_at timestamptz default now()
);

create table family_members (
  family_id uuid references families(id) on delete cascade,
  profile_id uuid references profiles(id) on delete cascade,
  member_role text not null,
  consent_granted_at timestamptz,
  primary key (family_id, profile_id)
);

create table appointments (
  id uuid primary key default gen_random_uuid(),
  family_id uuid references families(id) on delete cascade,
  title text not null,
  appointment_type text,
  starts_at timestamptz not null,
  notes text,
  created_at timestamptz default now()
);

create table health_entries (
  id uuid primary key default gen_random_uuid(),
  family_id uuid references families(id) on delete cascade,
  entry_type text not null,
  value jsonb not null,
  recorded_at timestamptz default now()
);

create table media_assets (
  id uuid primary key default gen_random_uuid(),
  family_id uuid references families(id) on delete cascade,
  owner_id uuid references profiles(id),
  asset_type text not null check (asset_type in ('photo', 'video', 'scan', 'document', 'voice_note')),
  storage_path text not null,
  caption text,
  created_at timestamptz default now()
);

create table journal_entries (
  id uuid primary key default gen_random_uuid(),
  family_id uuid references families(id) on delete cascade,
  author_id uuid references profiles(id),
  title text,
  body text not null,
  pregnancy_week int,
  created_at timestamptz default now()
);

create table baby_milestones (
  id uuid primary key default gen_random_uuid(),
  family_id uuid references families(id) on delete cascade,
  title text not null,
  happened_on date,
  notes text,
  media_asset_id uuid references media_assets(id),
  created_at timestamptz default now()
);

create table content_pages (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  category text not null,
  body jsonb not null,
  medically_reviewed_at timestamptz,
  published_at timestamptz
);

create table sponsor_campaigns (
  id uuid primary key default gen_random_uuid(),
  sponsor_name text not null,
  label text not null check (label in ('sponsored', 'affiliate')),
  title text not null,
  target_url text,
  starts_at timestamptz,
  ends_at timestamptz
);

create table sponsor_events (
  id uuid primary key default gen_random_uuid(),
  campaign_id uuid references sponsor_campaigns(id) on delete cascade,
  event_type text not null check (event_type in ('impression', 'click', 'save')),
  created_at timestamptz default now()
);
```

## Mobile apps

Use the same product/API model for iOS and Android. The quickest path is React Native with Expo once the web app content model is signed off.

## Generated image prompt

The current hero asset was generated with the built-in Codex image generation tool using this production prompt:

```text
Create a polished, warm editorial hero image for a pregnancy companion app called LioraBump. No text, no logo, no watermark. Calm cream studio with soft linen textures, subtle botanical leaves, premium wellness feel. Expecting mother with partner in a tender supportive moment, gentle baby bump focus, tasteful and inclusive, natural real-life warmth. Photorealistic editorial lifestyle photography with slight painterly softness. Warm morning window light. Palette: warm cream, soft peach, gentle lavender, deep navy, subtle coral.
```
