-- Custom observation grid system
do $$ begin

  create table if not exists custom_obs_definitions (
    id             uuid primary key default gen_random_uuid(),
    user_id        uuid not null references auth.users(id) on delete cascade,
    title          text not null,
    subject_id     int  references subjects(id),
    grade_level_id int  references grade_levels(id),
    criteria       jsonb not null default '[]',
    created_at     timestamptz not null default now()
  );

  create table if not exists custom_obs_sessions (
    id            uuid primary key default gen_random_uuid(),
    definition_id uuid not null references custom_obs_definitions(id) on delete cascade,
    user_id       uuid not null references auth.users(id) on delete cascade,
    etape         int,
    created_at    timestamptz not null default now()
  );

  create table if not exists custom_obs_students (
    id         uuid primary key default gen_random_uuid(),
    session_id uuid not null references custom_obs_sessions(id) on delete cascade,
    name       text not null default '',
    sort_order int  not null default 0
  );

  create table if not exists custom_obs_scores (
    id            uuid primary key default gen_random_uuid(),
    student_id    uuid not null references custom_obs_students(id) on delete cascade,
    criterion_key text not null,
    score         int  not null check (score between 1 and 4),
    unique (student_id, criterion_key)
  );

  create table if not exists custom_obs_jugements (
    id            uuid primary key default gen_random_uuid(),
    definition_id uuid not null references custom_obs_definitions(id) on delete cascade,
    user_id       uuid not null references auth.users(id) on delete cascade,
    etape         int  not null,
    student_name  text not null,
    score         int  not null check (score between 1 and 4),
    unique (definition_id, user_id, etape, student_name)
  );

  if not exists (select 1 from pg_policies where policyname = 'custom_obs_definitions: own' and tablename = 'custom_obs_definitions') then
    alter table custom_obs_definitions enable row level security;
    alter table custom_obs_sessions    enable row level security;
    alter table custom_obs_students    enable row level security;
    alter table custom_obs_scores      enable row level security;
    alter table custom_obs_jugements   enable row level security;

    create policy "custom_obs_definitions: own" on custom_obs_definitions for all using (auth.uid() = user_id);
    create policy "custom_obs_sessions: own"    on custom_obs_sessions    for all using (auth.uid() = user_id);
    create policy "custom_obs_students: own"    on custom_obs_students    for all using (
      exists (select 1 from custom_obs_sessions s where s.id = session_id and s.user_id = auth.uid())
    );
    create policy "custom_obs_scores: own"      on custom_obs_scores      for all using (
      exists (
        select 1 from custom_obs_students st
        join custom_obs_sessions s on s.id = st.session_id
        where st.id = student_id and s.user_id = auth.uid()
      )
    );
    create policy "custom_obs_jugements: own"   on custom_obs_jugements   for all using (auth.uid() = user_id);
  end if;

end $$;
