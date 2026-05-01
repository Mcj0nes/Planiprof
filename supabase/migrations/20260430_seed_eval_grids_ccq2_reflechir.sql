-- ============================================================
-- PLANIPROF -- Seed: Grille d'évaluation – Réfléchir, CCQ 2e cycle
-- ============================================================

DO $$
DECLARE
  grid_id uuid;
  ccq_id int;
  p3 int; p4 int;
  lA int; lB int; lC int; lD int; lE int;
  c1 uuid; c2 uuid; c3 uuid; c4 uuid; c5 uuid; c6 uuid;
BEGIN

  SELECT id INTO ccq_id FROM subjects WHERE slug = 'culture-citoyennete-quebecoise';
  SELECT id INTO p3 FROM grade_levels WHERE education_level = 'primaire' AND grade = 3;
  SELECT id INTO p4 FROM grade_levels WHERE education_level = 'primaire' AND grade = 4;

  INSERT INTO eval_grids (title, subject_id, cycle_label, source, is_baseline, competency)
    VALUES (
      'Grille d''évaluation – Compétence : Réfléchir (CCQ – 2e cycle)',
      ccq_id,
      '2e cycle du primaire',
      'Planiprof',
      true,
      'Réfléchir sur des réalités culturelles et éthiques'
    )
    RETURNING id INTO grid_id;

  INSERT INTO eval_grid_grades VALUES (grid_id, p3), (grid_id, p4);

  INSERT INTO eval_grid_levels (grid_id, code, label, sort_order) VALUES (grid_id, 'A', 'Excellent',        1) RETURNING id INTO lA;
  INSERT INTO eval_grid_levels (grid_id, code, label, sort_order) VALUES (grid_id, 'B', 'Très bien',        2) RETURNING id INTO lB;
  INSERT INTO eval_grid_levels (grid_id, code, label, sort_order) VALUES (grid_id, 'C', 'Acceptable',       3) RETURNING id INTO lC;
  INSERT INTO eval_grid_levels (grid_id, code, label, sort_order) VALUES (grid_id, 'D', 'Peu satisfaisant', 4) RETURNING id INTO lD;
  INSERT INTO eval_grid_levels (grid_id, code, label, sort_order) VALUES (grid_id, 'E', 'Insuffisant',      5) RETURNING id INTO lE;

  INSERT INTO eval_grid_criteria (grid_id, label, sort_order) VALUES (grid_id, 'Identifier et décrire une réalité culturelle ou éthique',  1) RETURNING id INTO c1;
  INSERT INTO eval_grid_criteria (grid_id, label, sort_order) VALUES (grid_id, 'Poser des questions pertinentes',                          2) RETURNING id INTO c2;
  INSERT INTO eval_grid_criteria (grid_id, label, sort_order) VALUES (grid_id, 'Recueillir et organiser des informations',                 3) RETURNING id INTO c3;
  INSERT INTO eval_grid_criteria (grid_id, label, sort_order) VALUES (grid_id, 'Comparer différentes perspectives',                       4) RETURNING id INTO c4;
  INSERT INTO eval_grid_criteria (grid_id, label, sort_order) VALUES (grid_id, 'Reconnaître des valeurs et des tensions éthiques',        5) RETURNING id INTO c5;
  INSERT INTO eval_grid_criteria (grid_id, label, sort_order) VALUES (grid_id, 'Formuler une réflexion ou une conclusion',                6) RETURNING id INTO c6;

  INSERT INTO eval_grid_cells (criterion_id, level_id, descriptor) VALUES
    (c1, lA, 'Identifie et décrit clairement la réalité culturelle ou éthique; situe le contexte avec précision.'),
    (c1, lB, 'Identifie et décrit la réalité avec quelques imprécisions mineures.'),
    (c1, lC, 'Identifie la réalité mais la description est partielle.'),
    (c1, lD, 'Identification floue; description vague ou incomplète.'),
    (c1, lE, 'Ne parvient pas à identifier ni à décrire la réalité.'),

    (c2, lA, 'Pose plusieurs questions pertinentes et variées directement liées à la réalité.'),
    (c2, lB, 'Pose quelques questions pertinentes.'),
    (c2, lC, 'Pose une question simple; pertinence limitée.'),
    (c2, lD, 'Questions vagues ou peu liées à la réalité.'),
    (c2, lE, 'Aucune question pertinente.'),

    (c3, lA, 'Recueille plusieurs informations pertinentes et les organise de façon claire.'),
    (c3, lB, 'Recueille quelques informations pertinentes; organisation simple.'),
    (c3, lC, 'Recueille une information; organisation limitée.'),
    (c3, lD, 'Informations imprécises ou mal organisées.'),
    (c3, lE, 'Aucune information recueillie ou pertinente.'),

    (c4, lA, 'Compare clairement plusieurs perspectives; relève des ressemblances et des différences.'),
    (c4, lB, 'Compare deux perspectives; comparaison simple mais juste.'),
    (c4, lC, 'Évoque une autre perspective sans vraiment comparer.'),
    (c4, lD, 'Comparaison vague ou peu pertinente.'),
    (c4, lE, 'Ne tient pas compte d''autres perspectives.'),

    (c5, lA, 'Identifie clairement les valeurs en jeu et explique une tension éthique avec un exemple.'),
    (c5, lB, 'Identifie une ou deux valeurs; tension éthique partiellement expliquée.'),
    (c5, lC, 'Nomme une valeur; lien avec la tension limité.'),
    (c5, lD, 'Reconnaissance vague des valeurs; tension non expliquée.'),
    (c5, lE, 'Ne reconnaît aucune valeur ni tension éthique.'),

    (c6, lA, 'Formule une réflexion claire, cohérente et bien justifiée; conclusion pertinente.'),
    (c6, lB, 'Réflexion pertinente; justification simple mais adéquate.'),
    (c6, lC, 'Réflexion présente mais justification limitée.'),
    (c6, lD, 'Réflexion vague ou difficile à suivre.'),
    (c6, lE, 'Aucune réflexion ni conclusion.');

END $$;
