-- ============================================================
-- PLANIPROF -- Seed: Grille d'évaluation – Réfléchir, CCQ 3e cycle
-- ============================================================

DO $$
DECLARE
  grid_id uuid;
  ccq_id int;
  p5 int; p6 int;
  lA int; lB int; lC int; lD int; lE int;
  c1 uuid; c2 uuid; c3 uuid; c4 uuid; c5 uuid; c6 uuid;
BEGIN

  SELECT id INTO ccq_id FROM subjects WHERE slug = 'ccq';
  SELECT id INTO p5 FROM grade_levels WHERE education_level = 'primaire' AND grade = 5;
  SELECT id INTO p6 FROM grade_levels WHERE education_level = 'primaire' AND grade = 6;

  INSERT INTO eval_grids (title, subject_id, cycle_label, source, is_baseline, competency)
    VALUES (
      'Grille d''évaluation – Compétence : Réfléchir (CCQ – 3e cycle)',
      ccq_id,
      '3e cycle du primaire',
      'Planiprof',
      true,
      'Réfléchir sur des réalités culturelles et éthiques'
    )
    RETURNING id INTO grid_id;

  INSERT INTO eval_grid_grades VALUES (grid_id, p5), (grid_id, p6);

  INSERT INTO eval_grid_levels (grid_id, code, label, sort_order) VALUES (grid_id, 'A', 'Excellent',        1) RETURNING id INTO lA;
  INSERT INTO eval_grid_levels (grid_id, code, label, sort_order) VALUES (grid_id, 'B', 'Très bien',        2) RETURNING id INTO lB;
  INSERT INTO eval_grid_levels (grid_id, code, label, sort_order) VALUES (grid_id, 'C', 'Acceptable',       3) RETURNING id INTO lC;
  INSERT INTO eval_grid_levels (grid_id, code, label, sort_order) VALUES (grid_id, 'D', 'Peu satisfaisant', 4) RETURNING id INTO lD;
  INSERT INTO eval_grid_levels (grid_id, code, label, sort_order) VALUES (grid_id, 'E', 'Insuffisant',      5) RETURNING id INTO lE;

  INSERT INTO eval_grid_criteria (grid_id, label, sort_order) VALUES (grid_id, 'Identifier et analyser une réalité culturelle ou éthique',     1) RETURNING id INTO c1;
  INSERT INTO eval_grid_criteria (grid_id, label, sort_order) VALUES (grid_id, 'Formuler des questions de réflexion pertinentes',              2) RETURNING id INTO c2;
  INSERT INTO eval_grid_criteria (grid_id, label, sort_order) VALUES (grid_id, 'Recueillir, comparer et évaluer des informations',             3) RETURNING id INTO c3;
  INSERT INTO eval_grid_criteria (grid_id, label, sort_order) VALUES (grid_id, 'Analyser des perspectives multiples',                         4) RETURNING id INTO c4;
  INSERT INTO eval_grid_criteria (grid_id, label, sort_order) VALUES (grid_id, 'Identifier des valeurs et des tensions éthiques',             5) RETURNING id INTO c5;
  INSERT INTO eval_grid_criteria (grid_id, label, sort_order) VALUES (grid_id, 'Formuler une réflexion nuancée et justifiée',                 6) RETURNING id INTO c6;

  INSERT INTO eval_grid_cells (criterion_id, level_id, descriptor) VALUES
    (c1, lA, 'Identifie et analyse avec précision la réalité culturelle ou éthique; situe le contexte et les enjeux clairement.'),
    (c1, lB, 'Identifie et analyse la réalité avec quelques imprécisions mineures.'),
    (c1, lC, 'Identifie la réalité; analyse partielle ou peu approfondie.'),
    (c1, lD, 'Identification floue; analyse vague ou incomplète.'),
    (c1, lE, 'Ne parvient pas à identifier ni à analyser la réalité.'),

    (c2, lA, 'Formule plusieurs questions de réflexion précises, variées et directement liées aux enjeux de la réalité.'),
    (c2, lB, 'Formule quelques questions pertinentes et bien ciblées.'),
    (c2, lC, 'Formule une ou deux questions simples; pertinence variable.'),
    (c2, lD, 'Questions vagues, superficielles ou peu liées à la réalité.'),
    (c2, lE, 'Aucune question pertinente formulée.'),

    (c3, lA, 'Recueille des informations variées, les compare et évalue leur pertinence de façon critique.'),
    (c3, lB, 'Recueille et compare quelques informations pertinentes.'),
    (c3, lC, 'Recueille des informations sans vraiment les comparer ou les évaluer.'),
    (c3, lD, 'Informations limitées, imprécises ou mal utilisées.'),
    (c3, lE, 'Aucune information recueillie ou pertinente.'),

    (c4, lA, 'Analyse plusieurs perspectives de façon critique; explique les convergences et les divergences.'),
    (c4, lB, 'Analyse quelques perspectives; comparaison pertinente.'),
    (c4, lC, 'Évoque quelques perspectives sans analyse approfondie.'),
    (c4, lD, 'Prise en compte des perspectives limitée ou superficielle.'),
    (c4, lE, 'Ne tient pas compte d''autres perspectives.'),

    (c5, lA, 'Identifie plusieurs valeurs en jeu et explique clairement les tensions éthiques avec des exemples précis.'),
    (c5, lB, 'Identifie les valeurs et explique une tension éthique de façon adéquate.'),
    (c5, lC, 'Identifie une ou deux valeurs; tension éthique partiellement expliquée.'),
    (c5, lD, 'Identification vague des valeurs; tension peu expliquée.'),
    (c5, lE, 'Ne reconnaît aucune valeur ni tension éthique.'),

    (c6, lA, 'Formule une réflexion nuancée, structurée et bien justifiée; intègre différentes perspectives.'),
    (c6, lB, 'Réflexion pertinente et justifiée; quelques nuances présentes.'),
    (c6, lC, 'Réflexion présente mais peu nuancée ou justifiée.'),
    (c6, lD, 'Réflexion vague ou difficile à suivre.'),
    (c6, lE, 'Aucune réflexion ni conclusion.');

END $$;
