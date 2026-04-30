-- ============================================================
-- PLANIPROF -- Seed: Grille d'evaluation en ecriture, 2e cycle
-- Source : ministere de l'Education, du Loisir et du Sport
-- ============================================================

DO $$
DECLARE
  grid_id uuid;
  fr_id   int;
  p3 int; p4 int;
  lA int; lB int; lC int; lD int; lE int;
  c1 uuid; c2 uuid; c3 uuid; c4 uuid; c5 uuid;
BEGIN

  SELECT id INTO fr_id FROM subjects WHERE slug = 'francais';
  SELECT id INTO p3   FROM grade_levels WHERE education_level = 'primaire' AND grade = 3;
  SELECT id INTO p4   FROM grade_levels WHERE education_level = 'primaire' AND grade = 4;

  -- Grid
  INSERT INTO eval_grids (title, subject_id, cycle_label, source, is_baseline, competency)
    VALUES (
      'Grille d''évaluation en écriture – 2e cycle',
      fr_id,
      '2e cycle du primaire',
      'Ministère de l''Éducation, du Loisir et du Sport – Précisions sur la grille d''évaluation',
      true,
      'Écrire des textes variés'
    )
    RETURNING id INTO grid_id;

  INSERT INTO eval_grid_grades VALUES (grid_id, p3), (grid_id, p4);

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
    (c1, lC, 'Les idées, peu développées, respectent les principales exigences du projet d''écriture.'),
    (c1, lD, 'Il manque un élément important pour que le projet d''écriture soit respecté. OU Plusieurs idées sont imprécises ou superflues.'),
    (c1, lE, 'Les idées ont peu ou pas de liens avec le projet d''écriture.'),

    (c2, lA, 'Les idées sont présentées dans un ordre logique. Des liens appropriés sont assez souvent établis entre les phrases. Le texte est divisé en paragraphes qui correspondent assez bien aux différentes parties.'),
    (c2, lB, 'En général, les idées sont présentées dans un ordre logique. Quelques liens appropriés sont établis entre les phrases. Le texte est divisé en paragraphes qui correspondent un peu aux différentes parties.'),
    (c2, lC, 'Les idées, présentées la plupart du temps selon un ordre logique, sont à certains moments décousues. Le texte comprend un ou plusieurs paragraphes.'),
    (c2, lD, 'Les idées sont assez souvent décousues, malgré la présence d''une certaine organisation.'),
    (c2, lE, 'Les idées sont décousues.'),

    (c3, lA, 'Les expressions et les mots sont souvent précis et variés.'),
    (c3, lB, 'Les expressions et les mots sont corrects. À l''occasion, les termes utilisés sont précis et variés.'),
    (c3, lC, 'Les expressions et les mots sont corrects.'),
    (c3, lD, 'Les expressions et les mots sont parfois imprécis et souvent répétés.'),
    (c3, lE, 'Les expressions et les mots sont souvent imprécis ou relèvent de la langue familière.'),

    (c4, lA, 'En général, les phrases sont bien structurées et bien ponctuées, malgré la présence de maladresses dans les phrases élaborées.'),
    (c4, lB, 'Les phrases sont souvent bien structurées et bien ponctuées, malgré la présence de maladresses dans les phrases élaborées. Quelques phrases élaborées sont mal structurées ou mal ponctuées.'),
    (c4, lC, 'Les phrases simples sont bien structurées. Elles sont généralement délimitées par la majuscule et le point. Certaines phrases élaborées sont bien structurées et bien ponctuées.'),
    (c4, lD, 'Plusieurs phrases sont mal structurées ou mal ponctuées.'),
    (c4, lE, 'La plupart des phrases sont mal structurées ou mal ponctuées.'),

    (c5, lA, 'Le texte présente moins de 4 % d''erreurs.'),
    (c5, lB, 'Le texte présente de 4 % à moins de 8 % d''erreurs.'),
    (c5, lC, 'Le texte présente de 8 % à moins de 11 % d''erreurs.'),
    (c5, lD, 'Le texte présente de 11 % à moins de 14 % d''erreurs.'),
    (c5, lE, 'Le texte présente au moins 14 % d''erreurs.');

END $$;