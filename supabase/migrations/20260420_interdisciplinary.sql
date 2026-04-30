-- ============================================================
-- PLANIPROF — Interdisciplinary Projects + Multi-Subject Plans
-- Run this in the Supabase SQL Editor after the initial schema
-- ============================================================

-- ── 1. Make subject_id nullable on annual_plans ─────────────
alter table annual_plans alter column subject_id drop not null;

-- Drop old unique constraint (doesn't handle NULLs well)
alter table annual_plans
  drop constraint if exists annual_plans_user_id_school_year_subject_id_grade_level_id_key;

-- Partial unique index for single-subject plans
create unique index if not exists annual_plans_single_subject_unique
  on annual_plans (user_id, school_year, subject_id, grade_level_id)
  where subject_id is not null;

-- Partial unique index for multi-subject (interdisciplinary) plans
create unique index if not exists annual_plans_multi_subject_unique
  on annual_plans (user_id, school_year, grade_level_id)
  where subject_id is null;


-- ── 2. Interdisciplinary projects ───────────────────────────
create table if not exists interdisciplinary_projects (
  id             uuid primary key default gen_random_uuid(),
  title          text not null,
  description    text,
  grade_level_id int  references grade_levels(id),   -- NULL = all grades
  is_baseline    boolean default true,
  created_by     uuid references auth.users(id),
  created_at     timestamptz default now()
);

-- Which subjects are involved in each project
create table if not exists project_subjects (
  project_id  uuid not null references interdisciplinary_projects(id) on delete cascade,
  subject_id  int  not null references subjects(id),
  primary key (project_id, subject_id)
);

-- Project assignments to months (mirrors plan_assignments for content items)
create table if not exists project_assignments (
  id              uuid     primary key default gen_random_uuid(),
  annual_plan_id  uuid     not null references annual_plans(id) on delete cascade,
  project_id      uuid     not null references interdisciplinary_projects(id),
  month           smallint check (month between 1 and 12),
  sort_order      smallint default 0,
  notes           text
);


-- ── 3. RLS ──────────────────────────────────────────────────
alter table interdisciplinary_projects  enable row level security;
alter table project_subjects            enable row level security;
alter table project_assignments         enable row level security;

do $$ begin
  create policy "interdisciplinary_projects: public read"
    on interdisciplinary_projects for select using (true);
exception when duplicate_object then null; end $$;

do $$ begin
  create policy "interdisciplinary_projects: own insert"
    on interdisciplinary_projects for insert
    with check (is_baseline = false and auth.uid() = created_by);
exception when duplicate_object then null; end $$;

do $$ begin
  create policy "interdisciplinary_projects: own update"
    on interdisciplinary_projects for update
    using (is_baseline = false and auth.uid() = created_by);
exception when duplicate_object then null; end $$;

do $$ begin
  create policy "project_subjects: public read"
    on project_subjects for select using (true);
exception when duplicate_object then null; end $$;

do $$ begin
  create policy "project_assignments: own"
    on project_assignments for all
    using (
      exists (
        select 1 from annual_plans ap
        where ap.id = project_assignments.annual_plan_id
          and ap.user_id = auth.uid()
      )
    );
exception when duplicate_object then null; end $$;


-- ── 4. Seed baseline interdisciplinary projects ─────────────
do $$
declare
  pid uuid;
  s_maths    int; s_sciences int; s_francais  int;
  s_univers  int; s_arts     int; s_educ      int;
begin
  select id into s_maths    from subjects where slug = 'maths';
  select id into s_sciences from subjects where slug = 'sciences';
  select id into s_francais from subjects where slug = 'francais';
  select id into s_univers  from subjects where slug = 'univers-social';
  select id into s_arts     from subjects where slug = 'arts-plastiques';
  select id into s_educ     from subjects where slug = 'educ-physique';

  -- Project 1: Les formes dans la nature (all grades, Maths + Sciences)
  insert into interdisciplinary_projects (title, description, grade_level_id, is_baseline, created_by)
    values ('Les formes dans la nature',
            'Observer et classifier les formes géométriques présentes dans la nature. Relier les concepts de géométrie aux sciences naturelles.',
            null, true, null)
    returning id into pid;
  insert into project_subjects values (pid, s_maths), (pid, s_sciences)
    on conflict do nothing;

  -- Project 2: Notre alimentation (all grades, Sciences + Univers social + Maths)
  insert into interdisciplinary_projects (title, description, grade_level_id, is_baseline, created_by)
    values ('Notre alimentation',
            'Explorer l''alimentation sous l''angle scientifique (nutrition), social (cultures alimentaires) et mathématique (statistiques de consommation).',
            null, true, null)
    returning id into pid;
  insert into project_subjects values (pid, s_sciences), (pid, s_univers), (pid, s_maths)
    on conflict do nothing;

  -- Project 3: Mon portrait (all grades, Français + Arts plastiques)
  insert into interdisciplinary_projects (title, description, grade_level_id, is_baseline, created_by)
    values ('Mon portrait',
            'Créer un autoportrait artistique et rédiger un texte descriptif personnel. Intégrer l''expression écrite et les arts visuels.',
            null, true, null)
    returning id into pid;
  insert into project_subjects values (pid, s_francais), (pid, s_arts)
    on conflict do nothing;

  -- Project 4: La météo (all grades, Sciences + Maths)
  insert into interdisciplinary_projects (title, description, grade_level_id, is_baseline, created_by)
    values ('La météo',
            'Mesurer, consigner et analyser les données météorologiques. Utiliser les statistiques pour interpréter les données climatiques.',
            null, true, null)
    returning id into pid;
  insert into project_subjects values (pid, s_sciences), (pid, s_maths)
    on conflict do nothing;

  -- Project 5: Notre communauté (all grades, Univers social + Français)
  insert into interdisciplinary_projects (title, description, grade_level_id, is_baseline, created_by)
    values ('Notre communauté',
            'Étudier l''organisation sociale et géographique de la communauté locale. Rédiger des textes informatifs et des récits sur la vie dans notre milieu.',
            null, true, null)
    returning id into pid;
  insert into project_subjects values (pid, s_univers), (pid, s_francais)
    on conflict do nothing;

  -- Project 6: Le corps en mouvement (all grades, Éducation physique + Sciences)
  insert into interdisciplinary_projects (title, description, grade_level_id, is_baseline, created_by)
    values ('Le corps en mouvement',
            'Relier les connaissances scientifiques sur le corps humain (muscles, squelette, respiration) aux activités physiques et sportives.',
            null, true, null)
    returning id into pid;
  insert into project_subjects values (pid, s_educ), (pid, s_sciences)
    on conflict do nothing;

  -- Project 7: Enquête environnementale (all grades, Sciences + Univers social + Maths)
  insert into interdisciplinary_projects (title, description, grade_level_id, is_baseline, created_by)
    values ('Enquête environnementale',
            'Analyser un enjeu environnemental local. Collecter des données, les représenter graphiquement et situer l''enjeu dans son contexte géographique.',
            null, true, null)
    returning id into pid;
  insert into project_subjects values (pid, s_sciences), (pid, s_univers), (pid, s_maths)
    on conflict do nothing;

end $$;
