ALTER TABLE gb_evaluations
  ADD COLUMN IF NOT EXISTS link_id uuid REFERENCES plan_eval_links(id) ON DELETE CASCADE;
