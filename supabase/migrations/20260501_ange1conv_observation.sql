-- Anglais — Écriture Cycle 1 conversation observation grids
do $$ begin

  create table if not exists ange1conv_obs_grids (
    id         uuid primary key default gen_random_uuid(),
    user_id    uuid not null references auth.users(id) on delete cascade,
    etape      int,
    created_at timestamptz not null default now()
  );

  create table if not exists ange1conv_obs_students (
    id         uuid primary key default gen_random_uuid(),
    grid_id    uuid not null references ange1conv_obs_grids(id) on delete cascade,
    name       text not null default '',
    sort_order int  not null default 0
  );

  create table if not exists ange1conv_obs_scores (
    id         uuid primary key default gen_random_uuid(),
    student_id uuid not null references ange1conv_obs_students(id) on delete cascade,
    criterion  text not null,
    score      int  not null check (score between 1 and 4),
    unique (student_id, criterion)
  );

  if not exists (select 1 from pg_policies where policyname = 'ange1conv_obs_grids: own' and tablename = 'ange1conv_obs_grids') then
    alter table ange1conv_obs_grids    enable row level security;
    alter table ange1conv_obs_students enable row level security;
    alter table ange1conv_obs_scores   enable row level security;

    create policy "ange1conv_obs_grids: own"    on ange1conv_obs_grids    for all using (auth.uid() = user_id);
    create policy "ange1conv_obs_students: own" on ange1conv_obs_students for all using (
      exists (select 1 from ange1conv_obs_grids g where g.id = grid_id and g.user_id = auth.uid())
    );
    create policy "ange1conv_obs_scores: own"   on ange1conv_obs_scores   for all using (
      exists (
        select 1 from ange1conv_obs_students s
        join ange1conv_obs_grids g on g.id = s.grid_id
        where s.id = student_id and g.user_id = auth.uid()
      )
    );
  end if;

end $$;
