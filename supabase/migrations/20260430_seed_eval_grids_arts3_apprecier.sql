-- ============================================================
-- PLANIPROF -- Seed: Grille d'évaluation – Apprécier, Arts plastiques 3e cycle
-- ============================================================

DO $$
DECLARE
  grid_id uuid;
  arts_id int;
  p5 int; p6 int;
  lA int; lB int; lC int; lD int;
  c1 uuid; c2 uuid; c3 uuid; c4 uuid; c5 uuid;
BEGIN

  SELECT id INTO arts_id FROM subjects WHERE slug = 'arts-plastiques';
  SELECT id INTO p5 FROM grade_levels WHERE education_level = 'primaire' AND grade = 5;
  SELECT id INTO p6 FROM grade_levels WHERE education_level = 'primaire' AND grade = 6;

  INSERT INTO eval_grids (title, subject_id, cycle_label, source, is_baseline, competency)
    VALUES (
      'Grille d''évaluation – Compétence : Apprécier (Arts plastiques – 3e cycle)',
      arts_id,
      '3e cycle du primaire',
      'Planiprof',
      true,
      'Apprécier des œuvres d''art, des objets culturels du patrimoine artistique, des images médiatiques, ses réalisations et celles de ses camarades'
    )
    RETURNING id INTO grid_id;

  INSERT INTO eval_grid_grades VALUES (grid_id, p5), (grid_id, p6);

  INSERT INTO eval_grid_levels (grid_id, code, label, sort_order) VALUES (grid_id, 'A', 'Très bien développé', 1) RETURNING id INTO lA;
  INSERT INTO eval_grid_levels (grid_id, code, label, sort_order) VALUES (grid_id, 'B', 'Développé',           2) RETURNING id INTO lB;
  INSERT INTO eval_grid_levels (grid_id, code, label, sort_order) VALUES (grid_id, 'C', 'En développement',   3) RETURNING id INTO lC;
  INSERT INTO eval_grid_levels (grid_id, code, label, sort_order) VALUES (grid_id, 'D', 'À développer',       4) RETURNING id INTO lD;

  INSERT INTO eval_grid_criteria (grid_id, label, sort_order) VALUES (grid_id, 'Décrire l''œuvre',                      1) RETURNING id INTO c1;
  INSERT INTO eval_grid_criteria (grid_id, label, sort_order) VALUES (grid_id, 'Interpréter l''œuvre',                  2) RETURNING id INTO c2;
  INSERT INTO eval_grid_criteria (grid_id, label, sort_order) VALUES (grid_id, 'Porter un jugement critique',           3) RETURNING id INTO c3;
  INSERT INTO eval_grid_criteria (grid_id, label, sort_order) VALUES (grid_id, 'Utiliser le langage plastique',         4) RETURNING id INTO c4;
  INSERT INTO eval_grid_criteria (grid_id, label, sort_order) VALUES (grid_id, 'Situer l''œuvre dans un contexte socio-historique', 5) RETURNING id INTO c5;

  INSERT INTO eval_grid_cells (criterion_id, level_id, descriptor) VALUES
    (c1, lA, 'Décrit l''œuvre avec précision en nommant plusieurs éléments du langage plastique (formes, lignes, couleurs, textures, composition) et des procédés visibles.'),
    (c1, lB, 'Décrit l''œuvre avec des éléments pertinents et nomme quelques éléments du langage plastique.'),
    (c1, lC, 'Décrit l''œuvre de façon partielle ou générale; peu d''éléments visuels relevés.'),
    (c1, lD, 'Description vague, incomplète ou hors sujet.'),

    (c2, lA, 'Formule une interprétation personnelle cohérente, appuyée sur plusieurs indices visuels clairement identifiés.'),
    (c2, lB, 'Formule une interprétation simple appuyée sur quelques indices visuels.'),
    (c2, lC, 'Interprétation présente mais peu appuyée ou difficile à suivre.'),
    (c2, lD, 'Aucune interprétation ou interprétation hors sujet.'),

    (c3, lA, 'Exprime un jugement personnel clair et justifié par des observations précises liées à l''œuvre.'),
    (c3, lB, 'Exprime un jugement simple appuyé sur un ou deux éléments observables.'),
    (c3, lC, 'Jugement exprimé mais peu justifié ou basé sur des préférences générales.'),
    (c3, lD, 'Aucun jugement ou jugement non justifié.'),

    (c4, lA, 'Utilise adéquatement un vocabulaire varié du langage plastique pour soutenir sa description, son interprétation ou son jugement.'),
    (c4, lB, 'Utilise quelques mots du langage plastique de façon pertinente.'),
    (c4, lC, 'Vocabulaire limité ou parfois mal utilisé.'),
    (c4, lD, 'Aucun vocabulaire disciplinaire utilisé.'),

    (c5, lA, 'Établit des liens clairs entre l''œuvre et son contexte (époque, culture, courant artistique, fonction), en s''appuyant sur des indices observables.'),
    (c5, lB, 'Établit un lien simple entre l''œuvre et un élément de contexte.'),
    (c5, lC, 'Lien présent mais imprécis ou peu pertinent.'),
    (c5, lD, 'Aucun lien avec le contexte socio-historique.');

END $$;
