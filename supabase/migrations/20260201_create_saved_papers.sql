create table if not exists public.saved_papers (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  paper_id text not null,
  title text not null,
  authors jsonb,
  year integer,
  venue text,
  abstract text,
  cited_by_count integer,
  open_access_url text,
  scores jsonb,
  decision text,
  created_at timestamptz not null default now()
);

create index if not exists saved_papers_user_id_idx on public.saved_papers(user_id);
create unique index if not exists saved_papers_user_paper_unique on public.saved_papers(user_id, paper_id);

alter table public.saved_papers enable row level security;

create policy "saved_papers_read_own" on public.saved_papers
  for select
  using (auth.uid() = user_id);

create policy "saved_papers_write_own" on public.saved_papers
  for insert
  with check (auth.uid() = user_id);

create policy "saved_papers_delete_own" on public.saved_papers
  for delete
  using (auth.uid() = user_id);
