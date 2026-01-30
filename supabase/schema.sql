create extension if not exists "pgcrypto";

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  major text,
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.saved_topics (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  description text,
  difficulty text,
  created_at timestamptz not null default now()
);

create index if not exists saved_topics_user_id_idx on public.saved_topics(user_id);

create table if not exists public.history_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  tool text not null,
  request jsonb,
  response jsonb,
  created_at timestamptz not null default now()
);

create index if not exists history_logs_user_id_idx on public.history_logs(user_id);

alter table public.profiles enable row level security;
alter table public.saved_topics enable row level security;
alter table public.history_logs enable row level security;

create policy "profiles_read_own" on public.profiles
  for select using (auth.uid() = id);

create policy "profiles_write_own" on public.profiles
  for insert with check (auth.uid() = id);

create policy "profiles_update_own" on public.profiles
  for update using (auth.uid() = id);

create policy "saved_topics_read_own" on public.saved_topics
  for select using (auth.uid() = user_id);

create policy "saved_topics_write_own" on public.saved_topics
  for insert with check (auth.uid() = user_id);

create policy "saved_topics_update_own" on public.saved_topics
  for update using (auth.uid() = user_id);

create policy "saved_topics_delete_own" on public.saved_topics
  for delete using (auth.uid() = user_id);

create policy "history_logs_read_own" on public.history_logs
  for select using (auth.uid() = user_id);

create policy "history_logs_write_own" on public.history_logs
  for insert with check (auth.uid() = user_id);

create policy "history_logs_delete_own" on public.history_logs
  for delete using (auth.uid() = user_id);

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

alter table public.interested_lecturers enable row level security;

create policy "interested_lecturers_read_own" on public.interested_lecturers
  for select using (auth.uid() = user_id);

create policy "interested_lecturers_write_own" on public.interested_lecturers
  for insert with check (auth.uid() = user_id);

create policy "interested_lecturers_delete_own" on public.interested_lecturers
  for delete using (auth.uid() = user_id);
