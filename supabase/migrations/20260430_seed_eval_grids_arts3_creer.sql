-- ============================================================
-- PLANIPROF -- Seed: Grille d'évaluation – Créer, Arts plastiques 3e cycle
-- ============================================================

DO $$
DECLARE
  grid_id uuid;
  arts_id int;
  p5 int; p6 int;
  lA int; lB int; lC int; lD int; lE int;
  c1 uuid; c2 uuid; c3 uuid; c4 uuid; c5 uuid;
BEGIN

  SELECT id INTO arts_id FROM subjects WHERE slug = 'arts-plastiques';
  SELECT id INTO p5 FROM grade_levels WHERE education_level = 'primaire' AND grade = 5;
  SELECT id INTO p6 FROM grade_levels WHERE education_level = 'primaire' AND grade = 6;

  INSERT INTO eval_grids (title, subject_id, cycle_label, source, is_baseline, competency)
    VALUES (
      'Grille d''évaluation – Compétence : Créer (Arts plastiques – 3e cycle)',
      arts_id,
      '3e cycle du primaire',
      'Planiprof',
      true,
      'Créer des images personnelles et médiatiques'
    )
    RETURNING id INTO grid_id;

  INSERT INTO eval_grid_grades VALUES (grid_id, p5), (grid_id, p6);

  INSERT INTO eval_grid_levels (grid_id, code, label, sort_order) VALUES (grid_id, 'A', 'Excellent',        1) RETURNING id INTO lA;
  INSERT INTO eval_grid_levels (grid_id, code, label, sort_order) VALUES (grid_id, 'B', 'Très bien',        2) RETURNING id INTO lB;
  INSERT INTO eval_grid_levels (grid_id, code, label, sort_order) VALUES (grid_id, 'C', 'Acceptable',       3) RETURNING id INTO lC;
  INSERT INTO eval_grid_levels (grid_id, code, label, sort_order) VALUES (grid_id, 'D', 'Peu satisfaisant', 4) RETURNING id INTO lD;
  INSERT INTO eval_grid_levels (grid_id, code, label, sort_order) VALUES (grid_id, 'E', 'Insuffisant',      5) RETURNING id INTO lE;

  INSERT INTO eval_grid_criteria (grid_id, label, sort_order) VALUES (grid_id, 'Explorer des idées et des pistes de création',          1) RETURNING id INTO c1;
  INSERT INTO eval_grid_criteria (grid_id, label, sort_order) VALUES (grid_id, 'Exploiter des matériaux, outils, techniques et procédés', 2) RETURNING id INTO c2;
  INSERT INTO eval_grid_criteria (grid_id, label, sort_order) VALUES (grid_id, 'Organiser les éléments du langage plastique',            3) RETURNING id INTO c3;
  INSERT INTO eval_grid_criteria (grid_id, label, sort_order) VALUES (grid_id, 'Communiquer une intention ou un message',                4) RETURNING id INTO c4;
  INSERT INTO eval_grid_criteria (grid_id, label, sort_order) VALUES (grid_id, 'Justifier ses choix (réflexion sur la démarche)',        5) RETURNING id INTO c5;

  INSERT INTO eval_grid_cells (criterion_id, level_id, descriptor) VALUES
    (c1, lA, 'Explore plusieurs pistes variées, pertinentes et originales; fait des essais réfléchis et ajuste ses choix avec intention.'),
    (c1, lB, 'Explore quelques pistes pertinentes; fait des essais simples et ajuste certains choix.'),
    (c1, lC, 'Explore une ou deux pistes; essais présents mais limités.'),
    (c1, lD, 'Exploration minimale; essais rares ou peu pertinents.'),
    (c1, lE, 'Aucune exploration ou essais hors sujet.'),

    (c2, lA, 'Utilise les matériaux, outils et techniques avec maîtrise; applique des procédés variés de façon efficace et sécuritaire.'),
    (c2, lB, 'Utilise adéquatement les matériaux et techniques; applique quelques procédés pertinents.'),
    (c2, lC, 'Utilisation fonctionnelle mais limitée; maîtrise partielle des techniques.'),
    (c2, lD, 'Difficulté à utiliser les matériaux ou techniques; procédés mal appliqués.'),
    (c2, lE, 'Utilisation inadéquate ou non sécuritaire; procédés absents ou hors sujet.'),

    (c3, lA, 'Organise les éléments de manière cohérente, expressive et réfléchie; composition efficace et intention claire.'),
    (c3, lB, 'Organisation pertinente; composition généralement cohérente.'),
    (c3, lC, 'Organisation simple; composition parfois inégale.'),
    (c3, lD, 'Organisation confuse ou peu réfléchie; composition faible.'),
    (c3, lE, 'Aucune organisation perceptible; composition absente ou hors sujet.'),

    (c4, lA, 'Intention claire, bien exprimée et soutenue par des choix visuels pertinents.'),
    (c4, lB, 'Intention présente et généralement bien soutenue.'),
    (c4, lC, 'Intention simple mais perceptible.'),
    (c4, lD, 'Intention difficile à comprendre ou peu soutenue.'),
    (c4, lE, 'Aucune intention perceptible.'),

    (c5, lA, 'Explique clairement ses choix, fait des liens avec ses essais, ses intentions et les éléments du langage plastique.'),
    (c5, lB, 'Explique quelques choix avec des liens pertinents.'),
    (c5, lC, 'Justification simple; liens parfois vagues.'),
    (c5, lD, 'Justification limitée ou difficile à suivre.'),
    (c5, lE, 'Aucune justification ou hors sujet.');

END $$;
