-- One content item per period slot (5 days × 6 periods)
CREATE TABLE day_periods (
  id              uuid     DEFAULT gen_random_uuid() PRIMARY KEY,
  annual_plan_id  uuid     NOT NULL REFERENCES annual_plans(id) ON DELETE CASCADE,
  week_start      date     NOT NULL,
  day_of_week     smallint NOT NULL CHECK (day_of_week BETWEEN 1 AND 5),
  period_number   smallint NOT NULL CHECK (period_number BETWEEN 1 AND 6),
  content_item_id integer  REFERENCES content_items(id) ON DELETE SET NULL,
  UNIQUE(annual_plan_id, week_start, day_of_week, period_number)
);

ALTER TABLE day_periods ENABLE ROW LEVEL SECURITY;

CREATE POLICY "owner access" ON day_periods
  USING  (annual_plan_id IN (SELECT id FROM annual_plans WHERE user_id = auth.uid()))
  WITH CHECK (annual_plan_id IN (SELECT id FROM annual_plans WHERE user_id = auth.uid()));

-- Weekend notes (day_of_week 6=Sat, 7=Sun)
CREATE TABLE day_notes (
  id             uuid     DEFAULT gen_random_uuid() PRIMARY KEY,
  annual_plan_id uuid     NOT NULL REFERENCES annual_plans(id) ON DELETE CASCADE,
  week_start     date     NOT NULL,
  day_of_week    smallint NOT NULL CHECK (day_of_week BETWEEN 6 AND 7),
  note           text,
  UNIQUE(annual_plan_id, week_start, day_of_week)
);

ALTER TABLE day_notes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "owner access" ON day_notes
  USING  (annual_plan_id IN (SELECT id FROM annual_plans WHERE user_id = auth.uid()))
  WITH CHECK (annual_plan_id IN (SELECT id FROM annual_plans WHERE user_id = auth.uid()));
