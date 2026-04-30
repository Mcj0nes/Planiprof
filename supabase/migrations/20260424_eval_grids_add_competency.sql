-- Add competency column to eval_grids
ALTER TABLE eval_grids ADD COLUMN IF NOT EXISTS competency text;

-- Back-fill any grids already in the database
UPDATE eval_grids SET competency = 'Écrire des textes variés'
  WHERE is_baseline = true AND title ILIKE '%évaluation en écriture%' AND competency IS NULL;
UPDATE eval_grids SET competency = 'C1 – Résoudre une situation-problème'
  WHERE is_baseline = true AND title ILIKE '%Résoudre une situation-problème%' AND competency IS NULL;
UPDATE eval_grids SET competency = 'C1 – Proposer des explications ou des solutions'
  WHERE is_baseline = true AND title ILIKE 'C1 -%' AND competency IS NULL;
UPDATE eval_grids SET competency = 'C2 – Mettre à profit les outils, objets et procédés'
  WHERE is_baseline = true AND title ILIKE 'C2 -%' AND competency IS NULL;
UPDATE eval_grids SET competency = 'C3 – Communiquer à l''aide des langages scientifiques'
  WHERE is_baseline = true AND title ILIKE 'C3 -%' AND competency IS NULL;
