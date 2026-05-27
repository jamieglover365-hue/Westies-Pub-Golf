create table if not exists public.games (
  code text primary key,
  course_name text not null default 'Westies Pub Golf',
  par_total integer not null default 72,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.teams (
  id uuid primary key,
  game_code text not null references public.games(code) on delete cascade,
  name text not null,
  scores jsonb not null default '[]'::jsonb,
  total integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists teams_game_code_idx on public.teams(game_code);

alter table public.games enable row level security;
alter table public.teams enable row level security;

drop policy if exists "Anyone can read games" on public.games;
drop policy if exists "Anyone can create games" on public.games;
drop policy if exists "Anyone can update games" on public.games;
drop policy if exists "Anyone can read teams" on public.teams;
drop policy if exists "Anyone can create teams" on public.teams;
drop policy if exists "Anyone can update teams" on public.teams;
drop policy if exists "Anyone can delete teams" on public.teams;

create policy "Anyone can read games"
  on public.games for select
  to anon
  using (true);

create policy "Anyone can create games"
  on public.games for insert
  to anon
  with check (true);

create policy "Anyone can update games"
  on public.games for update
  to anon
  using (true)
  with check (true);

create policy "Anyone can read teams"
  on public.teams for select
  to anon
  using (true);

create policy "Anyone can create teams"
  on public.teams for insert
  to anon
  with check (true);

create policy "Anyone can update teams"
  on public.teams for update
  to anon
  using (true)
  with check (true);

create policy "Anyone can delete teams"
  on public.teams for delete
  to anon
  using (true);

alter publication supabase_realtime add table public.teams;
