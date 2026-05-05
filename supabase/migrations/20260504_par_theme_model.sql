-- Planification par thème/projet model support

CREATE TABLE IF NOT EXISTS theme_configs (
  id           uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      uuid        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  school_year  text        NOT NULL,
  sort_order   smallint    NOT NULL DEFAULT 0,
  name         text        NOT NULL,
  start_date   date        NOT NULL,
  end_date     date        NOT NULL,
  created_at   timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, school_year, sort_order)
);

ALTER TABLE theme_configs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "user owns theme_configs" ON theme_configs
  FOR ALL
  USING  (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Add theme_id to plan_assignments (null for non-theme plans)
ALTER TABLE plan_assignments
  ADD COLUMN IF NOT EXISTS theme_id uuid REFERENCES theme_configs(id) ON DELETE SET NULL;
