-- Activities planned for specific content items within an annual plan.
-- One row per (plan, content_item, activity or template).
CREATE TABLE IF NOT EXISTS plan_content_activities (
  id              uuid    DEFAULT gen_random_uuid() PRIMARY KEY,
  plan_id         uuid    NOT NULL REFERENCES annual_plans(id)     ON DELETE CASCADE,
  content_item_id integer NOT NULL REFERENCES content_items(id)    ON DELETE CASCADE,
  activity_id     uuid    REFERENCES activities(id)                ON DELETE CASCADE,
  template_id     uuid    REFERENCES activity_templates(id)        ON DELETE CASCADE,
  user_id         uuid    NOT NULL REFERENCES auth.users(id)       ON DELETE CASCADE,
  created_at      timestamptz DEFAULT now(),
  CONSTRAINT pca_one_type CHECK (
    (activity_id IS NOT NULL)::int + (template_id IS NOT NULL)::int = 1
  )
);

-- Prevent duplicates
CREATE UNIQUE INDEX IF NOT EXISTS pca_activity_unique
  ON plan_content_activities(plan_id, content_item_id, activity_id)
  WHERE activity_id IS NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS pca_template_unique
  ON plan_content_activities(plan_id, content_item_id, template_id)
  WHERE template_id IS NOT NULL;

ALTER TABLE plan_content_activities ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  CREATE POLICY "pca_select" ON plan_content_activities
    FOR SELECT TO authenticated USING (user_id = auth.uid());
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "pca_insert" ON plan_content_activities
    FOR INSERT WITH CHECK (user_id = auth.uid());
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "pca_delete" ON plan_content_activities
    FOR DELETE USING (user_id = auth.uid());
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
