ALTER TABLE plan_eval_links
  ADD COLUMN IF NOT EXISTS weight_pct smallint CHECK (weight_pct BETWEEN 1 AND 100);
