-- ============================================================
-- PLANIPROF -- Seed: Grille d'évaluation – Créer, Arts plastiques 1er cycle
-- ============================================================

DO $$
DECLARE
  grid_id uuid;
  arts_id int;
  p1 int; p2 int;
  lA int; lB int; lC int; lD int; lE int;
  c1 uuid; c2 uuid; c3 uuid; c4 uuid; c5 uuid;
BEGIN

  SELECT id INTO arts_id FROM subjects WHERE slug = 'arts-plastiques';
  SELECT id INTO p1 FROM grade_levels WHERE education_level = 'primaire' AND grade = 1;
  SELECT id INTO p2 FROM grade_levels WHERE education_level = 'primaire' AND grade = 2;

  INSERT INTO eval_grids (title, subject_id, cycle_label, source, is_baseline, competency)
    VALUES (
      'Grille d''évaluation – Compétence : Créer (Arts plastiques – 1er cycle)',
      arts_id,
      '1er cycle du primaire',
      'Planiprof',
      true,
      'Créer des images personnelles et médiatiques'
    )
    RETURNING id INTO grid_id;

  INSERT INTO eval_grid_grades VALUES (grid_id, p1), (grid_id, p2);

  INSERT INTO eval_grid_levels (grid_id, code, label, sort_order) VALUES (grid_id, 'A', 'Excellent',        1) RETURNING id INTO lA;
  INSERT INTO eval_grid_levels (grid_id, code, label, sort_order) VALUES (grid_id, 'B', 'Très bien',        2) RETURNING id INTO lB;
  INSERT INTO eval_grid_levels (grid_id, code, label, sort_order) VALUES (grid_id, 'C', 'Acceptable',       3) RETURNING id INTO lC;
  INSERT INTO eval_grid_levels (grid_id, code, label, sort_order) VALUES (grid_id, 'D', 'Peu satisfaisant', 4) RETURNING id INTO lD;
  INSERT INTO eval_grid_levels (grid_id, code, label, sort_order) VALUES (grid_id, 'E', 'Insuffisant',      5) RETURNING id INTO lE;

  INSERT INTO eval_grid_criteria (grid_id, label, sort_order) VALUES (grid_id, 'Proposer une idée de création',                        1) RETURNING id INTO c1;
  INSERT INTO eval_grid_criteria (grid_id, label, sort_order) VALUES (grid_id, 'Manipuler des matériaux et des outils',                2) RETURNING id INTO c2;
  INSERT INTO eval_grid_criteria (grid_id, label, sort_order) VALUES (grid_id, 'Utiliser des éléments visuels (couleurs, formes)',     3) RETURNING id INTO c3;
  INSERT INTO eval_grid_criteria (grid_id, label, sort_order) VALUES (grid_id, 'Réaliser une image qui exprime une idée simple',       4) RETURNING id INTO c4;
  INSERT INTO eval_grid_criteria (grid_id, label, sort_order) VALUES (grid_id, 'Parler de sa création',                               5) RETURNING id INTO c5;

  INSERT INTO eval_grid_cells (criterion_id, level_id, descriptor) VALUES
    (c1, lA, 'Propose une idée claire et originale; montre de l''enthousiasme à explorer différentes possibilités.'),
    (c1, lB, 'Propose une idée simple et pertinente; fait quelques essais.'),
    (c1, lC, 'Propose une idée, mais elle reste vague ou difficile à identifier.'),
    (c1, lD, 'A du mal à proposer une idée; a besoin de beaucoup d''aide pour commencer.'),
    (c1, lE, 'Ne propose pas d''idée ou l''idée est hors sujet.'),

    (c2, lA, 'Manipule les matériaux et outils avec soin et de façon sécuritaire; explore plusieurs façons de les utiliser.'),
    (c2, lB, 'Manipule adéquatement les matériaux et outils; respecte les consignes de sécurité.'),
    (c2, lC, 'Manipulation fonctionnelle mais parfois maladroite; a besoin de rappels.'),
    (c2, lD, 'Difficulté à manipuler les matériaux ou les outils; manipulation souvent non sécuritaire.'),
    (c2, lE, 'Ne manipule pas les matériaux ou outils de façon adéquate ou sécuritaire.'),

    (c3, lA, 'Utilise les couleurs et les formes de façon intentionnelle et variée pour enrichir sa création.'),
    (c3, lB, 'Utilise les couleurs et les formes de façon pertinente.'),
    (c3, lC, 'Utilise quelques couleurs ou formes, mais de manière aléatoire.'),
    (c3, lD, 'Utilisation très limitée des éléments visuels; peu de variété.'),
    (c3, lE, 'N''utilise pas les éléments visuels de façon reconnaissable.'),

    (c4, lA, 'La création exprime clairement une idée simple; l''image est cohérente et organisée.'),
    (c4, lB, 'La création exprime une idée simple; l''image est généralement cohérente.'),
    (c4, lC, 'La création montre une idée, mais elle est difficile à identifier sans aide.'),
    (c4, lD, 'La création est peu reconnaissable; l''idée n''est pas visible.'),
    (c4, lE, 'La création ne correspond pas à la consigne ou ne montre aucune idée.'),

    (c5, lA, 'Explique avec enthousiasme ce qu''il/elle a fait et pourquoi il/elle a fait ce choix.'),
    (c5, lB, 'Explique simplement ce qu''il/elle a fait dans sa création.'),
    (c5, lC, 'Nomme un élément de sa création, mais a du mal à expliquer ses choix.'),
    (c5, lD, 'A besoin de beaucoup d''aide pour parler de sa création.'),
    (c5, lE, 'Ne parvient pas à parler de sa création.');

END $$;
