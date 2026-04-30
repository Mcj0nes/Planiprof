-- ============================================================
-- PLANIPROF -- Seed: Grille d'évaluation – Apprécier, Arts plastiques 3e cycle
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
      'Grille d''évaluation – Compétence : Apprécier (Arts plastiques – 3e cycle)',
      arts_id,
      '3e cycle du primaire',
      'Planiprof',
      true,
      'Apprécier des œuvres d''art, des objets culturels du patrimoine artistique, des images médiatiques, ses réalisations et celles de ses camarades'
    )
    RETURNING id INTO grid_id;

  INSERT INTO eval_grid_grades VALUES (grid_id, p5), (grid_id, p6);

  INSERT INTO eval_grid_levels (grid_id, code, label, sort_order) VALUES (grid_id, 'A', 'Excellent',        1) RETURNING id INTO lA;
  INSERT INTO eval_grid_levels (grid_id, code, label, sort_order) VALUES (grid_id, 'B', 'Très bien',        2) RETURNING id INTO lB;
  INSERT INTO eval_grid_levels (grid_id, code, label, sort_order) VALUES (grid_id, 'C', 'Acceptable',       3) RETURNING id INTO lC;
  INSERT INTO eval_grid_levels (grid_id, code, label, sort_order) VALUES (grid_id, 'D', 'Peu satisfaisant', 4) RETURNING id INTO lD;
  INSERT INTO eval_grid_levels (grid_id, code, label, sort_order) VALUES (grid_id, 'E', 'Insuffisant',      5) RETURNING id INTO lE;

  INSERT INTO eval_grid_criteria (grid_id, label, sort_order) VALUES (grid_id, 'Décrire l''œuvre',                               1) RETURNING id INTO c1;
  INSERT INTO eval_grid_criteria (grid_id, label, sort_order) VALUES (grid_id, 'Interpréter l''œuvre',                           2) RETURNING id INTO c2;
  INSERT INTO eval_grid_criteria (grid_id, label, sort_order) VALUES (grid_id, 'Porter un jugement critique',                    3) RETURNING id INTO c3;
  INSERT INTO eval_grid_criteria (grid_id, label, sort_order) VALUES (grid_id, 'Utiliser le langage plastique',                  4) RETURNING id INTO c4;
  INSERT INTO eval_grid_criteria (grid_id, label, sort_order) VALUES (grid_id, 'Situer l''œuvre dans un contexte socio-historique', 5) RETURNING id INTO c5;

  INSERT INTO eval_grid_cells (criterion_id, level_id, descriptor) VALUES
    (c1, lA, 'Décrit l''œuvre avec précision en nommant plusieurs éléments du langage plastique (formes, lignes, couleurs, textures, composition) et des procédés visibles.'),
    (c1, lB, 'Décrit l''œuvre avec des éléments pertinents et nomme quelques éléments du langage plastique.'),
    (c1, lC, 'Décrit l''œuvre de façon partielle; nomme un ou deux éléments visuels.'),
    (c1, lD, 'Description très générale ou vague; peu d''éléments relevés.'),
    (c1, lE, 'Description absente, incomplète ou hors sujet.'),

    (c2, lA, 'Formule une interprétation personnelle cohérente, appuyée sur plusieurs indices visuels clairement identifiés.'),
    (c2, lB, 'Formule une interprétation simple appuyée sur quelques indices visuels.'),
    (c2, lC, 'Propose une interprétation, mais peu appuyée sur des éléments visuels.'),
    (c2, lD, 'Interprétation présente mais difficile à suivre ou sans lien clair avec l''œuvre.'),
    (c2, lE, 'Aucune interprétation ou interprétation hors sujet.'),

    (c3, lA, 'Exprime un jugement personnel clair et justifié par des observations précises liées à l''œuvre.'),
    (c3, lB, 'Exprime un jugement appuyé sur un ou deux éléments observables.'),
    (c3, lC, 'Exprime un jugement sans justification précise.'),
    (c3, lD, 'Jugement peu clair ou basé uniquement sur des préférences générales.'),
    (c3, lE, 'Aucun jugement ou jugement non justifié.'),

    (c4, lA, 'Utilise adéquatement un vocabulaire varié du langage plastique pour soutenir sa description, son interprétation ou son jugement.'),
    (c4, lB, 'Utilise plusieurs mots du langage plastique de façon pertinente.'),
    (c4, lC, 'Utilise quelques mots du langage plastique.'),
    (c4, lD, 'Vocabulaire limité ou parfois mal utilisé.'),
    (c4, lE, 'Aucun vocabulaire disciplinaire utilisé.'),

    (c5, lA, 'Établit des liens clairs entre l''œuvre et son contexte (époque, culture, courant artistique, fonction), en s''appuyant sur des indices observables.'),
    (c5, lB, 'Établit quelques liens entre l''œuvre et son contexte.'),
    (c5, lC, 'Établit un lien simple entre l''œuvre et un élément de contexte.'),
    (c5, lD, 'Lien présent mais imprécis ou peu pertinent.'),
    (c5, lE, 'Aucun lien avec le contexte socio-historique.');

END $$;
