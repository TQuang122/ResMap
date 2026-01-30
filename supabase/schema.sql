-- ============================================================
-- RESMAP DATABASE SCHEMA
-- Supabase PostgreSQL Database for FPTU Research Mapping
-- ============================================================

-- 1. Enable UUID extension
create extension if not exists "pgcrypto";

-- ============================================================
-- 2. USER PROFILES TABLE
-- ============================================================
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  major text,
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ============================================================
-- 3. SAVED TOPICS TABLE
-- ============================================================
create table if not exists public.saved_topics (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  description text,
  difficulty text,
  created_at timestamptz not null default now()
);

create index if not exists saved_topics_user_id_idx on public.saved_topics(user_id);

-- ============================================================
-- 4. HISTORY LOGS TABLE
-- ============================================================
create table if not exists public.history_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  tool text not null,
  request jsonb,
  response jsonb,
  created_at timestamptz not null default now()
);

create index if not exists history_logs_user_id_idx on public.history_logs(user_id);

-- ============================================================
-- 5. INTERESTED LECTURERS TABLE
-- ============================================================
create table if not exists public.interested_lecturers (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  lecturer_id text not null,
  lecturer_name text not null,
  department text,
  research_areas text[],
  research_topics text[],
  lab text,
  email text,
  created_at timestamptz not null default now()
);

create index if not exists interested_lecturers_user_id_idx on public.interested_lecturers(user_id);

-- ============================================================
-- 6. ENABLE ROW LEVEL SECURITY (RLS)
-- ============================================================
alter table public.profiles enable row level security;
alter table public.saved_topics enable row level security;
alter table public.history_logs enable row level security;
alter table public.interested_lecturers enable row level security;

-- ============================================================
-- 7. POLICIES (User can only access their own data)
-- ============================================================

-- Profiles policies
create policy "profiles_read_own" on public.profiles for select using (auth.uid() = id);
create policy "profiles_write_own" on public.profiles for insert with check (auth.uid() = id);
create policy "profiles_update_own" on public.profiles for update using (auth.uid() = id);

-- Saved Topics policies
create policy "saved_topics_read_own" on public.saved_topics for select using (auth.uid() = user_id);
create policy "saved_topics_write_own" on public.saved_topics for insert with check (auth.uid() = user_id);
create policy "saved_topics_update_own" on public.saved_topics for update using (auth.uid() = user_id);
create policy "saved_topics_delete_own" on public.saved_topics for delete using (auth.uid() = user_id);

-- History Logs policies
create policy "history_logs_read_own" on public.history_logs for select using (auth.uid() = user_id);
create policy "history_logs_write_own" on public.history_logs for insert with check (auth.uid() = user_id);
create policy "history_logs_update_own" on public.history_logs for update using (auth.uid() = user_id);
create policy "history_logs_delete_own" on public.history_logs for delete using (auth.uid() = user_id);

-- Interested Lecturers policies
create policy "interested_lecturers_read_own" on public.interested_lecturers for select using (auth.uid() = user_id);
create policy "interested_lecturers_write_own" on public.interested_lecturers for insert with check (auth.uid() = user_id);
create policy "interested_lecturers_update_own" on public.interested_lecturers for update using (auth.uid() = user_id);
create policy "interested_lecturers_delete_own" on public.interested_lecturers for delete using (auth.uid() = user_id);

-- ============================================================
-- 8. AUTO CLEANUP FUNCTIONS
-- ============================================================

-- Cleanup function: Delete history logs older than 3 days
-- Returns: Number of deleted records
create or replace function public.cleanup_old_history_logs()
returns integer as $$
declare
  deleted_count integer;
begin
  delete from public.history_logs where created_at < now() - interval '3 days';
  get diagnostics deleted_count = row_count;
  return deleted_count;
end;
$$ language plpgsql security definer;

-- Cleanup all old data function
-- - History logs: older than 3 days
-- - Saved topics: older than 30 days
-- - Interested lecturers: older than 30 days
-- Returns: JSON with deletion counts
create or replace function public.cleanup_all_old_data()
returns json as $$
declare
  logs_deleted integer;
  topics_deleted integer;
  lecturers_deleted integer;
begin
  -- Delete old history logs (3 days)
  delete from public.history_logs where created_at < now() - interval '3 days';
  get diagnostics logs_deleted = row_count;
  
  -- Delete old saved topics (30 days)
  delete from public.saved_topics where created_at < now() - interval '30 days';
  get diagnostics topics_deleted = row_count;
  
  -- Delete old interested lecturers (30 days)
  delete from public.interested_lecturers where created_at < now() - interval '30 days';
  get diagnostics lecturers_deleted = row_count;
  
  return json_build_object(
    'logs_deleted', logs_deleted,
    'topics_deleted', topics_deleted,
    'lecturers_deleted', lecturers_deleted
  );
end;
$$ language plpgsql security definer;
