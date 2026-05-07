ALTER TABLE annual_plans ADD COLUMN IF NOT EXISTS period_count integer NOT NULL DEFAULT 6;
