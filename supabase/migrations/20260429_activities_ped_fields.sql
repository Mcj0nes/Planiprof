-- Add pedagogical detail fields to user-created activities
ALTER TABLE activities
  ADD COLUMN IF NOT EXISTS trigger_text text,
  ADD COLUMN IF NOT EXISTS open_question text,
  ADD COLUMN IF NOT EXISTS expected_strategies text,
  ADD COLUMN IF NOT EXISTS observation_criteria text,
  ADD COLUMN IF NOT EXISTS pda_link text;
