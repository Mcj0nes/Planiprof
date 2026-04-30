-- ============================================================
-- PLANIPROF -- Seed: Grille d'évaluation en écriture – 3e cycle
-- ============================================================

DO $$
DECLARE
  grid_id uuid;
  fr_id   int;
  p5 int; p6 int;
  lA int; lB int; lC int; lD int; lE int;
  c1 uuid; c2 uuid; c3 uuid; c4 uuid; c5 uuid;
BEGIN

  SELECT id INTO fr_id FROM subjects WHERE slug = 'francais';
  SELECT id INTO p5   FROM grade_levels WHERE education_level = 'primaire' AND grade = 5;
  SELECT id INTO p6   FROM grade_levels WHERE education_level = 'primaire' AND grade = 6;

  -- Grid
  INSERT INTO eval_grids (title, subject_id, cycle_label, source, is_baseline, competency)
    VALUES (
      'Grille d''évaluation en écriture – 3e cycle',
      fr_id,
      '3e cycle du primaire',
      'Ministère de l''Éducation, du Loisir et du Sport – Précisions sur la grille d''évaluation',
      true,
      'Écrire des textes variés'
    )
    RETURNING id INTO grid_id;

  INSERT INTO eval_grid_grades VALUES (grid_id, p5), (grid_id, p6);

  -- Performance levels
  INSERT INTO eval_grid_levels (grid_id, code, label, sort_order) VALUES (grid_id, 'A', 'Excellent',          1) RETURNING id INTO lA;
  INSERT INTO eval_grid_levels (grid_id, code, label, sort_order) VALUES (grid_id, 'B', 'Très bien',          2) RETURNING id INTO lB;
  INSERT INTO eval_grid_levels (grid_id, code, label, sort_order) VALUES (grid_id, 'C', 'Acceptable',         3) RETURNING id INTO lC;
  INSERT INTO eval_grid_levels (grid_id, code, label, sort_order) VALUES (grid_id, 'D', 'Peu satisfaisant',   4) RETURNING id INTO lD;
  INSERT INTO eval_grid_levels (grid_id, code, label, sort_order) VALUES (grid_id, 'E', 'Insuffisant',        5) RETURNING id INTO lE;

  -- Criteria
  INSERT INTO eval_grid_criteria (grid_id, label, weight, sort_order)
    VALUES (grid_id, 'Adaptation à la situation d''écriture', 20, 1) RETURNING id INTO c1;
  INSERT INTO eval_grid_criteria (grid_id, label, weight, sort_order)
    VALUES (grid_id, 'Cohérence du texte', 20, 2) RETURNING id INTO c2;
  INSERT INTO eval_grid_criteria (grid_id, label, weight, sort_order)
    VALUES (grid_id, 'Utilisation d''un vocabulaire approprié', 20, 3) RETURNING id INTO c3;
  INSERT INTO eval_grid_criteria (grid_id, label, weight, sort_order)
    VALUES (grid_id, 'Construction des phrases et ponctuation appropriées', 20, 4) RETURNING id INTO c4;
  INSERT INTO eval_grid_criteria (grid_id, label, weight, sort_order)
    VALUES (grid_id, 'Respect des normes relatives à l''orthographe d''usage et à l''orthographe grammaticale', 20, 5) RETURNING id INTO c5;

  -- Cells
  INSERT INTO eval_grid_cells (criterion_id, level_id, descriptor) VALUES
    (c1, lA, 'Les idées, très bien développées, respectent particulièrement bien le projet d''écriture.'),
    (c1, lB, 'Les idées, bien développées, respectent le projet d''écriture.'),
    (c1, lC, 'Dans l''ensemble, les idées respectent le projet d''écriture. Certaines sont peu développées.'),
    (c1, lD, 'Il manque une idée importante pour respecter le projet d''écriture. OU Plusieurs idées sont imprécises ou superflues.'),
    (c1, lE, 'Les idées ne respectent pas le projet d''écriture.'),

    (c2, lA, 'Les idées progressent aisément, de façon logique ou chronologique. Elles sont judicieusement groupées en paragraphes. Des liens appropriés sont souvent établis entre les phrases et entre les paragraphes.'),
    (c2, lB, 'Les idées progressent de façon logique ou chronologique. Elles sont groupées en paragraphes. Des liens appropriés sont établis entre les phrases.'),
    (c2, lC, 'Les idées progressent, la plupart du temps de façon logique ou chronologique. Elles sont groupées en paragraphes, parfois de façon malhabile. Quelques liens appropriés sont établis entre les phrases.'),
    (c2, lD, 'Plusieurs idées ne sont pas assemblées de façon logique ou chronologique. OU Les idées ne sont pas groupées en paragraphes ou le sont de façon inappropriée.'),
    (c2, lE, 'Les idées sont très difficiles à suivre.'),

    (c3, lA, 'Les expressions et les mots sont très précis et très variés.'),
    (c3, lB, 'Les expressions et les mots sont souvent précis et variés.'),
    (c3, lC, 'Les expressions et les mots sont simples et parfois précis.'),
    (c3, lD, 'Les expressions et les mots sont souvent imprécis ou répétitifs.'),
    (c3, lE, 'Les expressions et les mots sont très souvent imprécis ou répétitifs.'),

    (c4, lA, 'Les phrases sont bien structurées et bien ponctuées. Plusieurs sont élaborées.'),
    (c4, lB, 'Les phrases sont bien structurées et bien ponctuées. Certaines phrases élaborées peuvent comporter des maladresses.'),
    (c4, lC, 'En général, les phrases sont bien structurées et bien ponctuées. Certaines phrases élaborées sont mal structurées.'),
    (c4, lD, 'Plusieurs phrases sont mal structurées ou mal ponctuées.'),
    (c4, lE, 'La plupart des phrases sont mal structurées ou mal ponctuées.'),

    (c5, lA, 'Le texte présente moins de 4 % d''erreurs.'),
    (c5, lB, 'Le texte présente de 4 % à 7 % d''erreurs.'),
    (c5, lC, 'Le texte présente de 8 % à 10 % d''erreurs.'),
    (c5, lD, 'Le texte présente de 11 % à 14 % d''erreurs.'),
    (c5, lE, 'Le texte présente plus de 14 % d''erreurs.');

END $$;
