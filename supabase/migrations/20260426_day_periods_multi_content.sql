-- Allow multiple content items per period slot
DO $$
DECLARE cname text;
BEGIN
  SELECT conname INTO cname
  FROM pg_constraint
  JOIN pg_class ON pg_class.oid = pg_constraint.conrelid
  WHERE pg_class.relname = 'day_periods' AND contype = 'u';
  IF cname IS NOT NULL THEN
    EXECUTE 'ALTER TABLE day_periods DROP CONSTRAINT ' || quote_ident(cname);
  END IF;
END $$;

-- Widen the period_number check to allow gap slots (10-15) in legacy rows
ALTER TABLE day_periods DROP CONSTRAINT IF EXISTS day_periods_period_number_check;
ALTER TABLE day_periods ADD CONSTRAINT day_periods_period_number_check CHECK (period_number BETWEEN 1 AND 15);
