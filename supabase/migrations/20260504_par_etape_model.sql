-- Planification par étape model support

-- 1. Add planning_model to annual_plans
ALTER TABLE annual_plans
  ADD COLUMN IF NOT EXISTS planning_model text NOT NULL DEFAULT 'mensuelle';

-- 2. Étape date configs per user + school year
CREATE TABLE IF NOT EXISTS etape_configs (
  id            uuid     PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       uuid     NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  school_year   text     NOT NULL,
  etape_number  smallint NOT NULL CHECK (etape_number BETWEEN 1 AND 3),
  start_date    date     NOT NULL,
  end_date      date     NOT NULL,
  created_at    timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, school_year, etape_number)
);

ALTER TABLE etape_configs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "user owns etape_configs" ON etape_configs
  FOR ALL
  USING  (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- 3. Add etape_number to plan_assignments (null for mensuelle plans)
ALTER TABLE plan_assignments
  ADD COLUMN IF NOT EXISTS etape_number smallint;
