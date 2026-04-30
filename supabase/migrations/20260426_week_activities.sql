-- Activities assigned to a specific week in the planner (not tied to a specific period)
CREATE TABLE IF NOT EXISTS week_activities (
  id             uuid    DEFAULT gen_random_uuid() PRIMARY KEY,
  annual_plan_id uuid    NOT NULL REFERENCES annual_plans(id) ON DELETE CASCADE,
  week_start     date    NOT NULL,
  activity_id    uuid    REFERENCES activities(id) ON DELETE CASCADE,
  template_id    uuid    REFERENCES activity_templates(id) ON DELETE SET NULL,
  sort_order     smallint DEFAULT 0,
  created_at     timestamptz DEFAULT now(),
  CONSTRAINT week_activities_has_source CHECK (activity_id IS NOT NULL OR template_id IS NOT NULL)
);

ALTER TABLE week_activities ENABLE ROW LEVEL SECURITY;

CREATE POLICY "wa_select" ON week_activities FOR SELECT
  USING (annual_plan_id IN (SELECT id FROM annual_plans WHERE user_id = auth.uid()));

CREATE POLICY "wa_insert" ON week_activities FOR INSERT
  WITH CHECK (annual_plan_id IN (SELECT id FROM annual_plans WHERE user_id = auth.uid()));

CREATE POLICY "wa_delete" ON week_activities FOR DELETE
  USING (annual_plan_id IN (SELECT id FROM annual_plans WHERE user_id = auth.uid()));
