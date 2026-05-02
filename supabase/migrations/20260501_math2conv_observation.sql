-- Mathématique – Conversation orale 2e cycle observation grids
do $$ begin

  create table if not exists math2conv_obs_grids (
    id         uuid primary key default gen_random_uuid(),
    user_id    uuid not null references auth.users(id) on delete cascade,
    etape      int,
    created_at timestamptz not null default now()
  );

  create table if not exists math2conv_obs_students (
    id         uuid primary key default gen_random_uuid(),
    grid_id    uuid not null references math2conv_obs_grids(id) on delete cascade,
    name       text not null default '',
    sort_order int  not null default 0
  );

  create table if not exists math2conv_obs_scores (
    id         uuid primary key default gen_random_uuid(),
    student_id uuid not null references math2conv_obs_students(id) on delete cascade,
    criterion  text not null,
    score      int  not null check (score between 1 and 4),
    unique (student_id, criterion)
  );

  if not exists (select 1 from pg_policies where policyname = 'math2conv_obs_grids: own' and tablename = 'math2conv_obs_grids') then
    alter table math2conv_obs_grids    enable row level security;
    alter table math2conv_obs_students enable row level security;
    alter table math2conv_obs_scores   enable row level security;

    create policy "math2conv_obs_grids: own"    on math2conv_obs_grids    for all using (auth.uid() = user_id);
    create policy "math2conv_obs_students: own" on math2conv_obs_students for all using (
      exists (select 1 from math2conv_obs_grids g where g.id = grid_id and g.user_id = auth.uid())
    );
    create policy "math2conv_obs_scores: own"   on math2conv_obs_scores   for all using (
      exists (
        select 1 from math2conv_obs_students s
        join math2conv_obs_grids g on g.id = s.grid_id
        where s.id = student_id and g.user_id = auth.uid()
      )
    );
  end if;

end $$;
