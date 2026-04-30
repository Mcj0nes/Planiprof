CREATE TABLE week_notes (
  id          uuid    DEFAULT gen_random_uuid() PRIMARY KEY,
  annual_plan_id uuid NOT NULL REFERENCES annual_plans(id) ON DELETE CASCADE,
  week_start  date    NOT NULL,
  special_activities text,
  reflective_review  text,
  UNIQUE(annual_plan_id, week_start)
);

ALTER TABLE week_notes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "owner access" ON week_notes
  USING  (annual_plan_id IN (SELECT id FROM annual_plans WHERE user_id = auth.uid()))
  WITH CHECK (annual_plan_id IN (SELECT id FROM annual_plans WHERE user_id = auth.uid()));
