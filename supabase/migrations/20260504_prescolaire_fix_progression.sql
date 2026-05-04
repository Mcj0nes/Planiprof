-- Fix préscolaire content items: set progression_type = 'progression'
-- so they appear in the annual planning grid (items with NULL are filtered out)

UPDATE content_items
SET progression_type = 'progression'
WHERE grade_level_id IN (
  SELECT id FROM grade_levels WHERE education_level = 'préscolaire'
)
AND progression_type IS NULL;
