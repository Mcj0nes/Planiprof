-- Nettoyage : retire le domaine Algèbre (secondaire) et les items hors-PDA primaire
-- insérés par erreur dans 20260427_maths_primaire_pda_complet.sql

DO $$
DECLARE
  math_id int;
  alg_id  int;
  arith_id int;
  g5 int; g6 int;
BEGIN
  SELECT id INTO math_id FROM subjects WHERE slug = 'maths';

  -- ── Supprimer le domaine Algèbre (cascade sur les content_items) ──
  SELECT id INTO alg_id FROM competencies
    WHERE subject_id = math_id AND name_fr = 'Algèbre';

  IF alg_id IS NOT NULL THEN
    DELETE FROM plan_assignments  WHERE content_item_id IN (SELECT id FROM content_items WHERE competency_id = alg_id);
    DELETE FROM day_periods       WHERE content_item_id IN (SELECT id FROM content_items WHERE competency_id = alg_id);
    DELETE FROM content_items     WHERE competency_id = alg_id;
    DELETE FROM competencies      WHERE id = alg_id;
  END IF;

  -- ── Retirer les items de niveau secondaire dans Arithmétique 5e-6e ──
  SELECT id INTO arith_id FROM competencies
    WHERE subject_id = math_id AND name_fr = 'Arithmétique — Sens du nombre et des opérations';
  SELECT id INTO g5 FROM grade_levels WHERE education_level = 'primaire' AND grade = 5;
  SELECT id INTO g6 FROM grade_levels WHERE education_level = 'primaire' AND grade = 6;

  IF arith_id IS NOT NULL THEN
    DELETE FROM content_items
      WHERE competency_id = arith_id
        AND grade_level_id IN (g5, g6)
        AND name_fr IN (
          'Priorité des opérations (sans exposants)',
          'Priorité des opérations avec parenthèses et exposants'
        );
  END IF;

END $$;
