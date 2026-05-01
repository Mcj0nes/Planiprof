-- ============================================================
-- PLANIPROF -- Seed: Grille d'évaluation – Réfléchir, CCQ 1er cycle
-- ============================================================

DO $$
DECLARE
  grid_id uuid;
  ccq_id int;
  p1 int; p2 int;
  lA int; lB int; lC int; lD int; lE int;
  c1 uuid; c2 uuid; c3 uuid; c4 uuid; c5 uuid;
BEGIN

  SELECT id INTO ccq_id FROM subjects WHERE slug = 'ccq';
  SELECT id INTO p1 FROM grade_levels WHERE education_level = 'primaire' AND grade = 1;
  SELECT id INTO p2 FROM grade_levels WHERE education_level = 'primaire' AND grade = 2;

  INSERT INTO eval_grids (title, subject_id, cycle_label, source, is_baseline, competency)
    VALUES (
      'Grille d''évaluation – Compétence : Réfléchir (CCQ – 1er cycle)',
      ccq_id,
      '1er cycle du primaire',
      'Planiprof',
      true,
      'Réfléchir sur des réalités culturelles et éthiques'
    )
    RETURNING id INTO grid_id;

  INSERT INTO eval_grid_grades VALUES (grid_id, p1), (grid_id, p2);

  INSERT INTO eval_grid_levels (grid_id, code, label, sort_order) VALUES (grid_id, 'A', 'Excellent',        1) RETURNING id INTO lA;
  INSERT INTO eval_grid_levels (grid_id, code, label, sort_order) VALUES (grid_id, 'B', 'Très bien',        2) RETURNING id INTO lB;
  INSERT INTO eval_grid_levels (grid_id, code, label, sort_order) VALUES (grid_id, 'C', 'Acceptable',       3) RETURNING id INTO lC;
  INSERT INTO eval_grid_levels (grid_id, code, label, sort_order) VALUES (grid_id, 'D', 'Peu satisfaisant', 4) RETURNING id INTO lD;
  INSERT INTO eval_grid_levels (grid_id, code, label, sort_order) VALUES (grid_id, 'E', 'Insuffisant',      5) RETURNING id INTO lE;

  INSERT INTO eval_grid_criteria (grid_id, label, sort_order) VALUES (grid_id, 'Identifier une réalité culturelle ou éthique simple',      1) RETURNING id INTO c1;
  INSERT INTO eval_grid_criteria (grid_id, label, sort_order) VALUES (grid_id, 'Poser une question sur la réalité observée',               2) RETURNING id INTO c2;
  INSERT INTO eval_grid_criteria (grid_id, label, sort_order) VALUES (grid_id, 'Reconnaître des émotions ou des valeurs en jeu',           3) RETURNING id INTO c3;
  INSERT INTO eval_grid_criteria (grid_id, label, sort_order) VALUES (grid_id, 'Comparer sa perspective avec celle d''un camarade',        4) RETURNING id INTO c4;
  INSERT INTO eval_grid_criteria (grid_id, label, sort_order) VALUES (grid_id, 'Exprimer une réflexion simple',                           5) RETURNING id INTO c5;

  INSERT INTO eval_grid_cells (criterion_id, level_id, descriptor) VALUES
    (c1, lA, 'Nomme clairement la réalité culturelle ou éthique et la situe dans son quotidien avec un exemple pertinent.'),
    (c1, lB, 'Nomme la réalité avec quelques imprécisions; fait un lien avec son vécu.'),
    (c1, lC, 'Nomme la réalité de façon vague; lien avec le vécu limité.'),
    (c1, lD, 'Identification partielle ou floue; a besoin de beaucoup d''aide.'),
    (c1, lE, 'Ne parvient pas à identifier la réalité.'),

    (c2, lA, 'Pose une question claire, pertinente et en lien direct avec la réalité observée.'),
    (c2, lB, 'Pose une question simple mais généralement pertinente.'),
    (c2, lC, 'Pose une question, mais elle est peu précise ou peu liée à la réalité.'),
    (c2, lD, 'Question vague ou hors sujet.'),
    (c2, lE, 'Ne pose pas de question ou la question est sans lien avec la réalité.'),

    (c3, lA, 'Nomme clairement les émotions ou les valeurs en jeu; fait un lien avec la situation.'),
    (c3, lB, 'Nomme une émotion ou une valeur simple avec un lien partiel.'),
    (c3, lC, 'Nomme une émotion ou une valeur, mais sans lien clair.'),
    (c3, lD, 'Reconnaissance vague ou hors sujet.'),
    (c3, lE, 'Ne reconnaît aucune émotion ni valeur.'),

    (c4, lA, 'Compare clairement sa perspective avec celle d''un camarade; relève une ressemblance ou une différence.'),
    (c4, lB, 'Tente une comparaison simple; lien partiel avec la perspective de l''autre.'),
    (c4, lC, 'Évoque la perspective de l''autre sans vraiment comparer.'),
    (c4, lD, 'Comparaison très limitée ou difficile à comprendre.'),
    (c4, lE, 'Ne tient pas compte de la perspective de l''autre.'),

    (c5, lA, 'Exprime une réflexion claire, pertinente et liée à la réalité; donne une raison simple.'),
    (c5, lB, 'Exprime une réflexion simple avec une raison partielle.'),
    (c5, lC, 'Exprime une réflexion, mais sans raison claire.'),
    (c5, lD, 'Réflexion vague ou difficile à suivre.'),
    (c5, lE, 'Aucune réflexion exprimée.');

END $$;
