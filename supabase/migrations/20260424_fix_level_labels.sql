-- Fix baseline grids that were seeded with 'Très satisfaisant' / 'Satisfaisant'
-- Standardize all baseline grid level labels to: Excellent / Très bien

UPDATE eval_grid_levels
SET label = 'Excellent'
WHERE label = 'Très satisfaisant'
  AND grid_id IN (SELECT id FROM eval_grids WHERE is_baseline = true);

UPDATE eval_grid_levels
SET label = 'Très bien'
WHERE label = 'Satisfaisant'
  AND grid_id IN (SELECT id FROM eval_grids WHERE is_baseline = true);
