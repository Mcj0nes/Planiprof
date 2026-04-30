-- ============================================================
-- PLANIPROF -- Seed: Grille d'évaluation – Apprécier, Arts plastiques 2e cycle
-- ============================================================

DO $$
DECLARE
  grid_id uuid;
  arts_id int;
  p3 int; p4 int;
  lA int; lB int; lC int; lD int;
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

  INSERT INTO eval_grid_levels (grid_id, code, label, sort_order) VALUES (grid_id, 'A', 'Très bien développé', 1) RETURNING id INTO lA;
  INSERT INTO eval_grid_levels (grid_id, code, label, sort_order) VALUES (grid_id, 'B', 'Développé',           2) RETURNING id INTO lB;
  INSERT INTO eval_grid_levels (grid_id, code, label, sort_order) VALUES (grid_id, 'C', 'En développement',   3) RETURNING id INTO lC;
  INSERT INTO eval_grid_levels (grid_id, code, label, sort_order) VALUES (grid_id, 'D', 'À développer',       4) RETURNING id INTO lD;

  INSERT INTO eval_grid_criteria (grid_id, label, sort_order) VALUES (grid_id, 'Observer et décrire l''œuvre',              1) RETURNING id INTO c1;
  INSERT INTO eval_grid_criteria (grid_id, label, sort_order) VALUES (grid_id, 'Exprimer une réaction personnelle',          2) RETURNING id INTO c2;
  INSERT INTO eval_grid_criteria (grid_id, label, sort_order) VALUES (grid_id, 'Faire des liens simples avec l''œuvre',      3) RETURNING id INTO c3;
  INSERT INTO eval_grid_criteria (grid_id, label, sort_order) VALUES (grid_id, 'Utiliser un vocabulaire de base du langage plastique', 4) RETURNING id INTO c4;

  INSERT INTO eval_grid_cells (criterion_id, level_id, descriptor) VALUES
    (c1, lA, 'Décrit plusieurs éléments visibles de l''œuvre (formes, couleurs, lignes, textures, organisation) avec précision.'),
    (c1, lB, 'Décrit quelques éléments visibles de l''œuvre.'),
    (c1, lC, 'Décrit un ou deux éléments, de façon générale ou incomplète.'),
    (c1, lD, 'Ne parvient pas à décrire l''œuvre ou donne des éléments hors sujet.'),

    (c2, lA, 'Exprime clairement sa réaction (ce qu''il/elle aime ou non) et explique pourquoi en s''appuyant sur un élément de l''œuvre.'),
    (c2, lB, 'Exprime une réaction simple (j''aime / je n''aime pas) avec une raison générale.'),
    (c2, lC, 'Réaction présente mais sans raison ou difficile à comprendre.'),
    (c2, lD, 'Aucune réaction exprimée.'),

    (c3, lA, 'Fait un lien clair entre l''œuvre et son vécu, une situation, une émotion ou une image connue, en nommant un élément précis de l''œuvre.'),
    (c3, lB, 'Fait un lien simple avec son vécu, une émotion ou une situation, même si le lien reste général.'),
    (c3, lC, 'Lien évoqué mais peu clair, peu pertinent ou difficile à suivre.'),
    (c3, lD, 'Aucun lien avec son vécu, une émotion ou une situation.'),

    (c4, lA, 'Utilise quelques mots du langage plastique (forme, couleur, ligne, texture, grand/petit, contraste) pour parler de l''œuvre.'),
    (c4, lB, 'Utilise un ou deux mots du langage plastique de façon pertinente.'),
    (c4, lC, 'Utilise surtout des mots très généraux (beau, laid, correct) sans vocabulaire plastique.'),
    (c4, lD, 'Aucun mot lié au langage plastique.');

END $$;
