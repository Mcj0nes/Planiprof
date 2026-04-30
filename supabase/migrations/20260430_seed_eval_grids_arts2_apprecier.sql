-- ============================================================
-- PLANIPROF -- Seed: Grille d'évaluation – Apprécier, Arts plastiques 2e cycle
-- ============================================================

DO $$
DECLARE
  grid_id uuid;
  arts_id int;
  p3 int; p4 int;
  lA int; lB int; lC int; lD int; lE int;
  c1 uuid; c2 uuid; c3 uuid; c4 uuid;
BEGIN

  SELECT id INTO arts_id FROM subjects WHERE slug = 'arts-plastiques';
  SELECT id INTO p3 FROM grade_levels WHERE education_level = 'primaire' AND grade = 3;
  SELECT id INTO p4 FROM grade_levels WHERE education_level = 'primaire' AND grade = 4;

  INSERT INTO eval_grids (title, subject_id, cycle_label, source, is_baseline, competency)
    VALUES (
      'Grille d''évaluation – Compétence : Apprécier (Arts plastiques – 2e cycle)',
      arts_id,
      '2e cycle du primaire',
      'Planiprof',
      true,
      'Apprécier des œuvres d''art, des objets culturels du patrimoine artistique, des images médiatiques, ses réalisations et celles de ses camarades'
    )
    RETURNING id INTO grid_id;

  INSERT INTO eval_grid_grades VALUES (grid_id, p3), (grid_id, p4);

  INSERT INTO eval_grid_levels (grid_id, code, label, sort_order) VALUES (grid_id, 'A', 'Excellent',        1) RETURNING id INTO lA;
  INSERT INTO eval_grid_levels (grid_id, code, label, sort_order) VALUES (grid_id, 'B', 'Très bien',        2) RETURNING id INTO lB;
  INSERT INTO eval_grid_levels (grid_id, code, label, sort_order) VALUES (grid_id, 'C', 'Acceptable',       3) RETURNING id INTO lC;
  INSERT INTO eval_grid_levels (grid_id, code, label, sort_order) VALUES (grid_id, 'D', 'Peu satisfaisant', 4) RETURNING id INTO lD;
  INSERT INTO eval_grid_levels (grid_id, code, label, sort_order) VALUES (grid_id, 'E', 'Insuffisant',      5) RETURNING id INTO lE;

  INSERT INTO eval_grid_criteria (grid_id, label, sort_order) VALUES (grid_id, 'Observer et décrire l''œuvre',                       1) RETURNING id INTO c1;
  INSERT INTO eval_grid_criteria (grid_id, label, sort_order) VALUES (grid_id, 'Exprimer une réaction personnelle',                   2) RETURNING id INTO c2;
  INSERT INTO eval_grid_criteria (grid_id, label, sort_order) VALUES (grid_id, 'Faire des liens simples avec l''œuvre',               3) RETURNING id INTO c3;
  INSERT INTO eval_grid_criteria (grid_id, label, sort_order) VALUES (grid_id, 'Utiliser un vocabulaire de base du langage plastique', 4) RETURNING id INTO c4;

  INSERT INTO eval_grid_cells (criterion_id, level_id, descriptor) VALUES
    (c1, lA, 'Décrit plusieurs éléments visibles de l''œuvre (formes, couleurs, lignes, textures, organisation) avec précision.'),
    (c1, lB, 'Décrit quelques éléments visibles de l''œuvre de façon pertinente.'),
    (c1, lC, 'Décrit un ou deux éléments de l''œuvre.'),
    (c1, lD, 'Description générale ou incomplète.'),
    (c1, lE, 'Ne parvient pas à décrire l''œuvre ou donne des éléments hors sujet.'),

    (c2, lA, 'Exprime clairement sa réaction et explique pourquoi en s''appuyant sur plusieurs éléments de l''œuvre.'),
    (c2, lB, 'Exprime sa réaction et l''explique en s''appuyant sur un élément de l''œuvre.'),
    (c2, lC, 'Exprime une réaction simple avec une raison générale.'),
    (c2, lD, 'Réaction présente mais sans raison ou difficile à comprendre.'),
    (c2, lE, 'Aucune réaction exprimée.'),

    (c3, lA, 'Fait un lien clair entre l''œuvre et son vécu, une situation, une émotion ou une image connue, en nommant un élément précis de l''œuvre.'),
    (c3, lB, 'Fait un lien pertinent avec son vécu ou une émotion, en faisant référence à l''œuvre.'),
    (c3, lC, 'Fait un lien simple avec son vécu, une émotion ou une situation, même si le lien reste général.'),
    (c3, lD, 'Lien évoqué mais peu clair, peu pertinent ou difficile à suivre.'),
    (c3, lE, 'Aucun lien avec son vécu, une émotion ou une situation.'),

    (c4, lA, 'Utilise plusieurs mots du langage plastique (forme, couleur, ligne, texture, grand/petit, contraste) pour parler de l''œuvre.'),
    (c4, lB, 'Utilise quelques mots du langage plastique de façon pertinente.'),
    (c4, lC, 'Utilise un ou deux mots du langage plastique.'),
    (c4, lD, 'Utilise surtout des mots très généraux (beau, laid, correct) sans vocabulaire plastique.'),
    (c4, lE, 'Aucun mot lié au langage plastique.');

END $$;
