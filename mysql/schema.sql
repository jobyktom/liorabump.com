-- LioraBump Hostinger MySQL schema.
-- Run this in Hostinger phpMyAdmin before running the migration script.
-- This stores app data only. Supabase Auth and Supabase Storage are separate services.

create table if not exists profiles (
  id char(36) primary key,
  email varchar(254) not null unique,
  full_name varchar(255),
  role enum('mother', 'partner', 'family_viewer', 'admin', 'sponsor') not null default 'mother',
  country varchar(120),
  created_at timestamp not null default current_timestamp
) engine=InnoDB default charset=utf8mb4 collate=utf8mb4_unicode_ci;

create table if not exists families (
  id char(36) primary key,
  owner_id char(36) not null,
  baby_nickname varchar(255) not null,
  due_date date,
  country varchar(120),
  privacy_level enum('private', 'partner', 'family') not null default 'private',
  subscription_plan varchar(50) not null default 'free',
  stripe_customer_id varchar(255),
  stripe_subscription_id varchar(255),
  created_at timestamp not null default current_timestamp,
  index families_owner_id_idx (owner_id),
  constraint families_owner_id_fk foreign key (owner_id) references profiles(id) on delete cascade
) engine=InnoDB default charset=utf8mb4 collate=utf8mb4_unicode_ci;

create table if not exists family_members (
  family_id char(36) not null,
  profile_id char(36) not null,
  member_role enum('mother', 'partner', 'family_viewer', 'admin', 'sponsor') not null,
  consent_granted_at timestamp null,
  primary key (family_id, profile_id),
  index family_members_profile_id_idx (profile_id),
  constraint family_members_family_id_fk foreign key (family_id) references families(id) on delete cascade,
  constraint family_members_profile_id_fk foreign key (profile_id) references profiles(id) on delete cascade
) engine=InnoDB default charset=utf8mb4 collate=utf8mb4_unicode_ci;

create table if not exists partner_invites (
  id char(36) primary key,
  family_id char(36) not null,
  invited_email varchar(254) not null,
  invited_by char(36) not null,
  status varchar(40) not null default 'pending',
  created_at timestamp not null default current_timestamp,
  index partner_invites_family_id_idx (family_id),
  index partner_invites_invited_by_idx (invited_by),
  constraint partner_invites_family_id_fk foreign key (family_id) references families(id) on delete cascade,
  constraint partner_invites_invited_by_fk foreign key (invited_by) references profiles(id) on delete cascade
) engine=InnoDB default charset=utf8mb4 collate=utf8mb4_unicode_ci;

create table if not exists appointments (
  id char(36) primary key,
  family_id char(36) not null,
  title varchar(255) not null,
  appointment_type varchar(120),
  starts_at timestamp not null,
  notes text,
  created_at timestamp not null default current_timestamp,
  index appointments_family_id_starts_at_idx (family_id, starts_at),
  constraint appointments_family_id_fk foreign key (family_id) references families(id) on delete cascade
) engine=InnoDB default charset=utf8mb4 collate=utf8mb4_unicode_ci;

create table if not exists health_entries (
  id char(36) primary key,
  family_id char(36) not null,
  entry_type varchar(120) not null,
  value json not null,
  recorded_at timestamp not null default current_timestamp,
  index health_entries_family_id_recorded_at_idx (family_id, recorded_at),
  constraint health_entries_family_id_fk foreign key (family_id) references families(id) on delete cascade
) engine=InnoDB default charset=utf8mb4 collate=utf8mb4_unicode_ci;

create table if not exists journal_entries (
  id char(36) primary key,
  family_id char(36) not null,
  author_id char(36) not null,
  title varchar(255),
  body text not null,
  pregnancy_week int,
  created_at timestamp not null default current_timestamp,
  index journal_entries_family_id_created_at_idx (family_id, created_at),
  index journal_entries_author_id_idx (author_id),
  constraint journal_entries_family_id_fk foreign key (family_id) references families(id) on delete cascade,
  constraint journal_entries_author_id_fk foreign key (author_id) references profiles(id) on delete cascade
) engine=InnoDB default charset=utf8mb4 collate=utf8mb4_unicode_ci;

create table if not exists media_assets (
  id char(36) primary key,
  family_id char(36) not null,
  owner_id char(36) not null,
  asset_type enum('photo', 'video', 'scan', 'document', 'voice_note') not null,
  storage_path text not null,
  caption varchar(500),
  created_at timestamp not null default current_timestamp,
  index media_assets_family_id_created_at_idx (family_id, created_at),
  index media_assets_owner_id_idx (owner_id),
  constraint media_assets_family_id_fk foreign key (family_id) references families(id) on delete cascade,
  constraint media_assets_owner_id_fk foreign key (owner_id) references profiles(id) on delete cascade
) engine=InnoDB default charset=utf8mb4 collate=utf8mb4_unicode_ci;

create table if not exists baby_milestones (
  id char(36) primary key,
  family_id char(36) not null,
  title varchar(255) not null,
  happened_on date,
  notes text,
  media_asset_id char(36),
  created_at timestamp not null default current_timestamp,
  index baby_milestones_family_id_created_at_idx (family_id, created_at),
  index baby_milestones_media_asset_id_idx (media_asset_id),
  constraint baby_milestones_family_id_fk foreign key (family_id) references families(id) on delete cascade,
  constraint baby_milestones_media_asset_id_fk foreign key (media_asset_id) references media_assets(id) on delete set null
) engine=InnoDB default charset=utf8mb4 collate=utf8mb4_unicode_ci;

create table if not exists couple_tasks (
  id char(36) primary key,
  family_id char(36) not null,
  created_by char(36) not null,
  title varchar(255) not null,
  notes text,
  due_date date,
  assignee_label varchar(120) not null default 'Either of us',
  status enum('todo', 'in_progress', 'done') not null default 'todo',
  created_at timestamp not null default current_timestamp,
  index couple_tasks_family_id_status_due_date_idx (family_id, status, due_date),
  index couple_tasks_created_by_idx (created_by),
  constraint couple_tasks_family_id_fk foreign key (family_id) references families(id) on delete cascade,
  constraint couple_tasks_created_by_fk foreign key (created_by) references profiles(id) on delete cascade
) engine=InnoDB default charset=utf8mb4 collate=utf8mb4_unicode_ci;

create table if not exists lead_captures (
  id char(36) primary key,
  email varchar(254) not null,
  source varchar(120) not null,
  marketing_consent boolean not null default false,
  created_at timestamp not null default current_timestamp,
  unique key lead_captures_email_source_unique (email, source)
) engine=InnoDB default charset=utf8mb4 collate=utf8mb4_unicode_ci;
