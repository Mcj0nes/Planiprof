-- ============================================================
-- PLANIPROF — Initial Schema
-- Run this in the Supabase SQL Editor
-- Safe to re-run (uses IF NOT EXISTS / OR REPLACE throughout)
-- ============================================================

-- ── Profiles ────────────────────────────────────────────────
create table if not exists profiles (
  id            uuid primary key references auth.users(id) on delete cascade,
  display_name  text,
  school        text,
  created_at    timestamptz default now()
);

-- Auto-create profile on signup
create or replace function handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into profiles (id) values (new.id);
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure handle_new_user();


-- ── Reference / PDA content ─────────────────────────────────

create table if not exists subjects (
  id       serial primary key,
  name_fr  text not null,
  name_en  text,
  slug     text unique not null,
  color    text
);

create table if not exists grade_levels (
  id               serial primary key,
  education_level  text not null check (education_level in ('primaire', 'secondaire')),
  grade            smallint not null,
  label_fr         text not null,
  unique (education_level, grade)
);

create table if not exists competencies (
  id             serial primary key,
  subject_id     int not null references subjects(id),
  name_fr        text not null,
  description_fr text,
  color          text,
  sort_order     smallint default 0
);

create table if not exists content_items (
  id              serial primary key,
  competency_id   int  not null references competencies(id),
  grade_level_id  int  not null references grade_levels(id),
  name_fr         text not null,
  description_fr  text,
  sort_order      smallint default 0,
  is_baseline     boolean default true,
  created_by      uuid references auth.users(id)
);


-- ── Teacher planning ─────────────────────────────────────────

create table if not exists annual_plans (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid not null references auth.users(id) on delete cascade,
  school_year     text not null,
  subject_id      int  not null references subjects(id),
  grade_level_id  int  not null references grade_levels(id),
  title           text,
  created_at      timestamptz default now(),
  unique (user_id, school_year, subject_id, grade_level_id)
);

-- month alone       → annual view
-- month + week_start → weekly view
-- month null        → backlog
create table if not exists plan_assignments (
  id               uuid primary key default gen_random_uuid(),
  annual_plan_id   uuid     not null references annual_plans(id) on delete cascade,
  content_item_id  int      not null references content_items(id),
  month            smallint check (month between 1 and 12),
  week_start       date,
  sort_order       smallint default 0,
  notes            text
);


-- ── Activity suggestions ─────────────────────────────────────

create table if not exists activity_suggestions (
  id               uuid primary key default gen_random_uuid(),
  content_item_id  int  not null references content_items(id),
  user_id          uuid not null references auth.users(id) on delete cascade,
  title            text not null,
  description      text,
  sharing_type     text not null default 'private'
                     check (sharing_type in ('private', 'public', 'paid')),
  price_cents      int  check (price_cents is null or price_cents > 0),
  created_at       timestamptz default now(),
  updated_at       timestamptz default now()
);

create table if not exists activity_purchases (
  id                     uuid primary key default gen_random_uuid(),
  activity_suggestion_id uuid not null references activity_suggestions(id),
  buyer_id               uuid not null references auth.users(id),
  purchased_at           timestamptz default now(),
  unique (activity_suggestion_id, buyer_id)
);

create or replace function set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists activity_suggestions_updated_at on activity_suggestions;
create trigger activity_suggestions_updated_at
  before update on activity_suggestions
  for each row execute procedure set_updated_at();


-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

alter table profiles           enable row level security;
alter table subjects           enable row level security;
alter table grade_levels       enable row level security;
alter table competencies       enable row level security;
alter table content_items      enable row level security;
alter table annual_plans       enable row level security;
alter table plan_assignments   enable row level security;
alter table activity_suggestions enable row level security;
alter table activity_purchases enable row level security;

-- Profiles: users manage their own
do $$ begin
  create policy "profiles: own read"   on profiles for select using (auth.uid() = id);
exception when duplicate_object then null; end $$;
do $$ begin
  create policy "profiles: own insert" on profiles for insert with check (auth.uid() = id);
exception when duplicate_object then null; end $$;
do $$ begin
  create policy "profiles: own update" on profiles for update using (auth.uid() = id);
exception when duplicate_object then null; end $$;

-- Reference data: everyone can read
do $$ begin
  create policy "subjects: public read"      on subjects      for select using (true);
exception when duplicate_object then null; end $$;
do $$ begin
  create policy "grade_levels: public read"  on grade_levels  for select using (true);
exception when duplicate_object then null; end $$;
do $$ begin
  create policy "competencies: public read"  on competencies  for select using (true);
exception when duplicate_object then null; end $$;

-- Content items
do $$ begin
  create policy "content_items: public read" on content_items for select using (true);
exception when duplicate_object then null; end $$;
do $$ begin
  create policy "content_items: own insert"  on content_items for insert
    with check (is_baseline = false and auth.uid() = created_by);
exception when duplicate_object then null; end $$;
do $$ begin
  create policy "content_items: own update"  on content_items for update
    using (is_baseline = false and auth.uid() = created_by);
exception when duplicate_object then null; end $$;
do $$ begin
  create policy "content_items: own delete"  on content_items for delete
    using (is_baseline = false and auth.uid() = created_by);
exception when duplicate_object then null; end $$;

-- Annual plans: own only
do $$ begin
  create policy "annual_plans: own" on annual_plans for all using (auth.uid() = user_id);
exception when duplicate_object then null; end $$;

-- Plan assignments: own only (via annual_plan ownership)
do $$ begin
  create policy "plan_assignments: own" on plan_assignments for all
    using (
      exists (
        select 1 from annual_plans ap
        where ap.id = plan_assignments.annual_plan_id
          and ap.user_id = auth.uid()
      )
    );
exception when duplicate_object then null; end $$;

-- Activity suggestions
do $$ begin
  create policy "activity_suggestions: creator" on activity_suggestions for all
    using (auth.uid() = user_id);
exception when duplicate_object then null; end $$;
do $$ begin
  create policy "activity_suggestions: public/paid read" on activity_suggestions for select
    using (sharing_type in ('public', 'paid') and auth.uid() != user_id);
exception when duplicate_object then null; end $$;

-- Purchases
do $$ begin
  create policy "activity_purchases: buyer" on activity_purchases for select
    using (auth.uid() = buyer_id);
exception when duplicate_object then null; end $$;
do $$ begin
  create policy "activity_purchases: seller" on activity_purchases for select
    using (
      exists (
        select 1 from activity_suggestions a
        where a.id = activity_purchases.activity_suggestion_id
          and a.user_id = auth.uid()
      )
    );
exception when duplicate_object then null; end $$;
do $$ begin
  create policy "activity_purchases: insert" on activity_purchases for insert
    with check (auth.uid() = buyer_id);
exception when duplicate_object then null; end $$;


-- ============================================================
-- SEED — Subjects & Grade levels
-- ============================================================

insert into subjects (name_fr, name_en, slug, color) values
  ('Français',                     'French',            'francais',       '#4F46E5'),
  ('Mathématique',                 'Mathematics',       'maths',          '#0891B2'),
  ('Sciences et technologie',      'Science & Tech',    'sciences',       '#059669'),
  ('Univers social',               'Social Studies',    'univers-social', '#D97706'),
  ('Arts plastiques',              'Visual Arts',       'arts-plastiques','#DB2777'),
  ('Musique',                      'Music',             'musique',        '#7C3AED'),
  ('Éducation physique',           'Physical Ed.',      'educ-physique',  '#EA580C'),
  ('Éthique et culture religieuse','Ethics & Religion', 'ethique',        '#65A30D'),
  ('Anglais, langue seconde',      'English as Second', 'anglais',        '#0284C7')
on conflict (slug) do nothing;

insert into grade_levels (education_level, grade, label_fr) values
  ('primaire',   1, '1re année'),
  ('primaire',   2, '2e année'),
  ('primaire',   3, '3e année'),
  ('primaire',   4, '4e année'),
  ('primaire',   5, '5e année'),
  ('primaire',   6, '6e année'),
  ('secondaire', 1, '1re secondaire'),
  ('secondaire', 2, '2e secondaire'),
  ('secondaire', 3, '3e secondaire'),
  ('secondaire', 4, '4e secondaire'),
  ('secondaire', 5, '5e secondaire')
on conflict (education_level, grade) do nothing;
