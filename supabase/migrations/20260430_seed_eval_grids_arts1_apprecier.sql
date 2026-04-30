-- ============================================================
-- PLANIPROF -- Seed: Grille d'évaluation – Apprécier, Arts plastiques 1er cycle
-- ============================================================

DO $$
DECLARE
  grid_id uuid;
  arts_id int;
  p1 int; p2 int;
  lA int; lB int; lC int; lD int; lE int;
  c1 uuid; c2 uuid; c3 uuid; c4 uuid;
BEGIN

  SELECT id INTO arts_id FROM subjects WHERE slug = 'arts-plastiques';
  SELECT id INTO p1 FROM grade_levels WHERE education_level = 'primaire' AND grade = 1;
  SELECT id INTO p2 FROM grade_levels WHERE education_level = 'primaire' AND grade = 2;

  INSERT INTO eval_grids (title, subject_id, cycle_label, source, is_baseline, competency)
    VALUES (
      'Grille d''évaluation – Compétence : Apprécier (Arts plastiques – 1er cycle)',
      arts_id,
      '1er cycle du primaire',
      'Planiprof',
      true,
      'Apprécier des œuvres d''art, des objets culturels du patrimoine artistique, des images médiatiques, ses réalisations et celles de ses camarades'
    )
    RETURNING id INTO grid_id;

  INSERT INTO eval_grid_grades VALUES (grid_id, p1), (grid_id, p2);

  INSERT INTO eval_grid_levels (grid_id, code, label, sort_order) VALUES (grid_id, 'A', 'Excellent',        1) RETURNING id INTO lA;
  INSERT INTO eval_grid_levels (grid_id, code, label, sort_order) VALUES (grid_id, 'B', 'Très bien',        2) RETURNING id INTO lB;
  INSERT INTO eval_grid_levels (grid_id, code, label, sort_order) VALUES (grid_id, 'C', 'Acceptable',       3) RETURNING id INTO lC;
  INSERT INTO eval_grid_levels (grid_id, code, label, sort_order) VALUES (grid_id, 'D', 'Peu satisfaisant', 4) RETURNING id INTO lD;
  INSERT INTO eval_grid_levels (grid_id, code, label, sort_order) VALUES (grid_id, 'E', 'Insuffisant',      5) RETURNING id INTO lE;

  INSERT INTO eval_grid_criteria (grid_id, label, sort_order) VALUES (grid_id, 'Observer et décrire des éléments visibles',  1) RETURNING id INTO c1;
  INSERT INTO eval_grid_criteria (grid_id, label, sort_order) VALUES (grid_id, 'Exprimer une réaction personnelle',          2) RETURNING id INTO c2;
  INSERT INTO eval_grid_criteria (grid_id, label, sort_order) VALUES (grid_id, 'Faire un lien simple avec son vécu',         3) RETURNING id INTO c3;
  INSERT INTO eval_grid_criteria (grid_id, label, sort_order) VALUES (grid_id, 'Utiliser quelques mots du langage plastique', 4) RETURNING id INTO c4;

  INSERT INTO eval_grid_cells (criterion_id, level_id, descriptor) VALUES
    (c1, lA, 'Observe plusieurs éléments visibles et les décrit clairement (couleurs, formes, lignes, organisation).'),
    (c1, lB, 'Observe et décrit quelques éléments visibles de manière simple et pertinente.'),
    (c1, lC, 'Décrit un ou deux éléments visibles, mais de façon partielle.'),
    (c1, lD, 'Description vague, très générale ou difficile à comprendre.'),
    (c1, lE, 'Ne parvient pas à décrire l''œuvre ou donne des éléments hors sujet.'),

    (c2, lA, 'Exprime clairement ce qu''il/elle aime ou non et donne une raison liée à un élément visible.'),
    (c2, lB, 'Exprime une réaction simple accompagnée d''une raison générale.'),
    (c2, lC, 'Exprime une réaction, mais sans justification.'),
    (c2, lD, 'Réaction difficile à comprendre ou hors sujet.'),
    (c2, lE, 'Aucune réaction exprimée.'),

    (c3, lA, 'Fait un lien clair entre l''œuvre et une expérience personnelle ou une situation connue.'),
    (c3, lB, 'Fait un lien simple avec son vécu, même général.'),
    (c3, lC, 'Évoque un lien, mais celui-ci est peu clair ou peu pertinent.'),
    (c3, lD, 'Lien difficile à suivre ou hors sujet.'),
    (c3, lE, 'Aucun lien avec son vécu.'),

    (c4, lA, 'Utilise plusieurs mots du langage plastique (couleur, forme, ligne, texture) de façon pertinente.'),
    (c4, lB, 'Utilise un ou deux mots du langage plastique.'),
    (c4, lC, 'Utilise surtout des mots très généraux (beau, joli) sans vocabulaire plastique.'),
    (c4, lD, 'Vocabulaire limité ou parfois mal utilisé.'),
    (c4, lE, 'Aucun mot lié au langage plastique.');

END $$;
