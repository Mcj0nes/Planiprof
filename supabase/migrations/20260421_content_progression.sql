-- Add progression_type to content_items (★ finalite | → progression | null = not this year)
ALTER TABLE content_items
  ADD COLUMN IF NOT EXISTS progression_type text
  CHECK (progression_type IN ('finalite', 'progression'));

-- All existing content items seeded without progression_type are
-- intended for their respective grade years, so default to 'progression'.
UPDATE content_items
SET progression_type = 'progression'
WHERE progression_type IS NULL AND is_baseline = true;
