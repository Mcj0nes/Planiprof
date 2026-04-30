-- ============================================================
-- PLANIPROF -- Seed: Grille d'évaluation – Créer, Arts plastiques 2e cycle
-- ============================================================

DO $$
DECLARE
  grid_id uuid;
  arts_id int;
  p3 int; p4 int;
  lA int; lB int; lC int; lD int; lE int;
  c1 uuid; c2 uuid; c3 uuid; c4 uuid; c5 uuid;
BEGIN

  SELECT id INTO arts_id FROM subjects WHERE slug = 'arts-plastiques';
  SELECT id INTO p3 FROM grade_levels WHERE education_level = 'primaire' AND grade = 3;
  SELECT id INTO p4 FROM grade_levels WHERE education_level = 'primaire' AND grade = 4;

  INSERT INTO eval_grids (title, subject_id, cycle_label, source, is_baseline, competency)
    VALUES (
      'Grille d''évaluation – Compétence : Créer (Arts plastiques – 2e cycle)',
      arts_id,
      '2e cycle du primaire',
      'Planiprof',
      true,
      'Créer des images personnelles et médiatiques'
    )
    RETURNING id INTO grid_id;

  INSERT INTO eval_grid_grades VALUES (grid_id, p3), (grid_id, p4);

  INSERT INTO eval_grid_levels (grid_id, code, label, sort_order) VALUES (grid_id, 'A', 'Excellent',        1) RETURNING id INTO lA;
  INSERT INTO eval_grid_levels (grid_id, code, label, sort_order) VALUES (grid_id, 'B', 'Très bien',        2) RETURNING id INTO lB;
  INSERT INTO eval_grid_levels (grid_id, code, label, sort_order) VALUES (grid_id, 'C', 'Acceptable',       3) RETURNING id INTO lC;
  INSERT INTO eval_grid_levels (grid_id, code, label, sort_order) VALUES (grid_id, 'D', 'Peu satisfaisant', 4) RETURNING id INTO lD;
  INSERT INTO eval_grid_levels (grid_id, code, label, sort_order) VALUES (grid_id, 'E', 'Insuffisant',      5) RETURNING id INTO lE;

  INSERT INTO eval_grid_criteria (grid_id, label, sort_order) VALUES (grid_id, 'Explorer des idées et des pistes de création',   1) RETURNING id INTO c1;
  INSERT INTO eval_grid_criteria (grid_id, label, sort_order) VALUES (grid_id, 'Manipuler des matériaux, outils et techniques',  2) RETURNING id INTO c2;
  INSERT INTO eval_grid_criteria (grid_id, label, sort_order) VALUES (grid_id, 'Organiser des éléments du langage plastique',    3) RETURNING id INTO c3;
  INSERT INTO eval_grid_criteria (grid_id, label, sort_order) VALUES (grid_id, 'Communiquer une idée ou une intention simple',   4) RETURNING id INTO c4;
  INSERT INTO eval_grid_criteria (grid_id, label, sort_order) VALUES (grid_id, 'Parler de sa création (justification simple)',   5) RETURNING id INTO c5;

  INSERT INTO eval_grid_cells (criterion_id, level_id, descriptor) VALUES
    (c1, lA, 'Propose plusieurs idées simples et pertinentes; essaie différentes façons de faire avant de choisir.'),
    (c1, lB, 'Propose quelques idées; essaie une ou deux façons de faire.'),
    (c1, lC, 'Propose une idée simple; essais limités.'),
    (c1, lD, 'Idée présente mais peu claire; essais rares.'),
    (c1, lE, 'Aucune idée proposée ou hors sujet.'),

    (c2, lA, 'Manipule les matériaux et outils avec soin; applique les techniques de façon efficace et sécuritaire.'),
    (c2, lB, 'Manipule adéquatement les matériaux; applique quelques techniques simples.'),
    (c2, lC, 'Manipulation fonctionnelle mais parfois maladroite; techniques de base présentes.'),
    (c2, lD, 'Difficulté à manipuler les matériaux ou à appliquer les techniques.'),
    (c2, lE, 'Manipulation inadéquate ou non sécuritaire; techniques absentes.'),

    (c3, lA, 'Organise les éléments de manière claire et réfléchie; composition cohérente.'),
    (c3, lB, 'Organisation simple mais pertinente; composition généralement cohérente.'),
    (c3, lC, 'Organisation de base; composition parfois inégale.'),
    (c3, lD, 'Organisation confuse ou peu réfléchie.'),
    (c3, lE, 'Aucune organisation perceptible.'),

    (c4, lA, 'L''idée ou l''intention est claire et visible dans la création.'),
    (c4, lB, 'L''idée est présente et généralement perceptible.'),
    (c4, lC, 'L''idée est simple mais visible.'),
    (c4, lD, 'L''idée est difficile à comprendre.'),
    (c4, lE, 'Aucune idée perceptible.'),

    (c5, lA, 'Explique clairement ses choix (couleurs, formes, matériaux) avec une raison simple.'),
    (c5, lB, 'Explique quelques choix de manière simple.'),
    (c5, lC, 'Explique un choix, mais sans raison claire.'),
    (c5, lD, 'Explication difficile à suivre ou hors sujet.'),
    (c5, lE, 'Ne parvient pas à expliquer ses choix.');

END $$;
