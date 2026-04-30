-- ============================================================
-- PLANIPROF -- Seed: Grille d'évaluation en écriture – 1er cycle
-- ============================================================

DO $$
DECLARE
  grid_id uuid;
  fr_id   int;
  p1 int; p2 int;
  lA int; lB int; lC int; lD int; lE int;
  c1 uuid; c2 uuid; c3 uuid; c4 uuid; c5 uuid;
BEGIN

  SELECT id INTO fr_id FROM subjects WHERE slug = 'francais';
  SELECT id INTO p1   FROM grade_levels WHERE education_level = 'primaire' AND grade = 1;
  SELECT id INTO p2   FROM grade_levels WHERE education_level = 'primaire' AND grade = 2;

  INSERT INTO eval_grids (title, subject_id, cycle_label, source, is_baseline, competency)
    VALUES (
      'Grille d''évaluation en écriture – 1er cycle',
      fr_id,
      '1er cycle du primaire',
      'Cadre d''évaluation des apprentissages – Français, langue d''enseignement, primaire, MEQ. Adaptation pédagogique.',
      true,
      'Écrire des textes variés'
    )
    RETURNING id INTO grid_id;

  INSERT INTO eval_grid_grades VALUES (grid_id, p1), (grid_id, p2);

  INSERT INTO eval_grid_levels (grid_id, code, label, sort_order) VALUES (grid_id, 'A', 'Excellent',        1) RETURNING id INTO lA;
  INSERT INTO eval_grid_levels (grid_id, code, label, sort_order) VALUES (grid_id, 'B', 'Très bien',        2) RETURNING id INTO lB;
  INSERT INTO eval_grid_levels (grid_id, code, label, sort_order) VALUES (grid_id, 'C', 'Acceptable',        3) RETURNING id INTO lC;
  INSERT INTO eval_grid_levels (grid_id, code, label, sort_order) VALUES (grid_id, 'D', 'Peu satisfaisant',  4) RETURNING id INTO lD;
  INSERT INTO eval_grid_levels (grid_id, code, label, sort_order) VALUES (grid_id, 'E', 'Insuffisant',       5) RETURNING id INTO lE;

  INSERT INTO eval_grid_criteria (grid_id, label, weight, sort_order)
    VALUES (grid_id, 'Adaptation à la situation d''écriture', 20, 1) RETURNING id INTO c1;
  INSERT INTO eval_grid_criteria (grid_id, label, weight, sort_order)
    VALUES (grid_id, 'Construction des phrases (sens, présence et ordre des mots)', 20, 2) RETURNING id INTO c2;
  INSERT INTO eval_grid_criteria (grid_id, label, weight, sort_order)
    VALUES (grid_id, 'Ponctuation (majuscule et point)', 20, 3) RETURNING id INTO c3;
  INSERT INTO eval_grid_criteria (grid_id, label, weight, sort_order)
    VALUES (grid_id, 'Orthographe d''usage', 20, 4) RETURNING id INTO c4;
  INSERT INTO eval_grid_criteria (grid_id, label, weight, sort_order)
    VALUES (grid_id, 'Orthographe grammaticale', 20, 5) RETURNING id INTO c5;

  INSERT INTO eval_grid_cells (criterion_id, level_id, descriptor) VALUES
    (c1, lA, 'Les idées, bien développées, tiennent compte du sujet ou du thème.'),
    (c1, lB, 'Les idées, peu développées, tiennent compte du sujet ou du thème.'),
    (c1, lC, 'Les idées tiennent compte du sujet ou du thème. Les idées sont très peu développées ou trop générales, laissant place à l''interprétation, ou alors plusieurs idées sont superflues.'),
    (c1, lD, 'Il manque un élément important pour que le sujet ou le thème soit respecté.'),
    (c1, lE, 'Les idées ont peu ou pas de liens avec le sujet ou le thème.'),

    (c2, lA, 'En général, les phrases sont bien structurées. Certaines sont élaborées. Les phrases élaborées présentent parfois des erreurs d''ordre syntaxique qui ne nuisent pas à la compréhension.'),
    (c2, lB, 'La plupart des phrases sont simples et bien structurées. Elles sont peu variées. Les phrases élaborées sont parfois difficiles à comprendre.'),
    (c2, lC, 'La plupart des phrases sont simples. Certaines sont bien structurées.'),
    (c2, lD, 'Plusieurs phrases sont mal structurées ou sont calquées sur l''oral.'),
    (c2, lE, 'La majorité des phrases sont mal construites ou sont calquées sur l''oral.'),

    (c3, lA, 'La majuscule et le point sont bien utilisés pour délimiter les phrases.'),
    (c3, lB, 'La majuscule et le point sont souvent bien utilisés pour délimiter les phrases.'),
    (c3, lC, 'Certaines phrases sont bien délimitées par la majuscule et le point.'),
    (c3, lD, 'L''utilisation du point pour marquer les frontières des phrases est souvent déficiente : absence ou usage erroné.'),
    (c3, lE, 'L''utilisation de la majuscule et du point pour marquer les frontières des phrases est déficiente : absence ou usage erroné.'),

    (c4, lA, 'La majorité des mots étudiés en classe sont correctement orthographiés.'),
    (c4, lB, 'Un bon nombre de mots étudiés en classe sont bien orthographiés.'),
    (c4, lC, 'La plupart des mots les plus fréquents étudiés en classe sont bien orthographiés. Les autres mots peuvent être écrits au son.'),
    (c4, lD, 'Un petit nombre de mots étudiés en classe sont bien orthographiés.'),
    (c4, lE, 'De fréquentes erreurs nuisent à la compréhension.'),

    (c5, lA, 'Les accords en genre et en nombre dans le groupe du nom sont bien réalisés dans les cas simples. L''accord du verbe avec son sujet est respecté dans les cas simples (phrases de base).'),
    (c5, lB, 'La plupart des accords en genre et en nombre dans le groupe du nom sont réalisés dans les cas simples. L''accord du verbe avec son sujet est généralement respecté dans les cas simples.'),
    (c5, lC, 'Quelques accords en genre et en nombre dans le groupe du nom sont réalisés. L''accord du verbe avec son sujet est parfois respecté dans les cas simples.'),
    (c5, lD, 'Peu d''accords en genre et en nombre sont réalisés. L''accord du verbe avec son sujet est rarement respecté.'),
    (c5, lE, 'Les accords en genre et en nombre sont absents ou erronés. L''accord du verbe avec son sujet n''est pas respecté.');

END $$;
