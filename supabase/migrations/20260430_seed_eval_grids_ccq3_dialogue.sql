-- ============================================================
-- PLANIPROF -- Seed: Grille d'évaluation – Pratiquer le dialogue, CCQ 3e cycle
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
      'Grille d''évaluation – Compétence : Pratiquer le dialogue (CCQ – 3e cycle)',
      ccq_id,
      '3e cycle du primaire',
      'Planiprof',
      true,
      'Pratiquer le dialogue'
    )
    RETURNING id INTO grid_id;

  INSERT INTO eval_grid_grades VALUES (grid_id, p5), (grid_id, p6);

  INSERT INTO eval_grid_levels (grid_id, code, label, sort_order) VALUES (grid_id, 'A', 'Excellent',        1) RETURNING id INTO lA;
  INSERT INTO eval_grid_levels (grid_id, code, label, sort_order) VALUES (grid_id, 'B', 'Très bien',        2) RETURNING id INTO lB;
  INSERT INTO eval_grid_levels (grid_id, code, label, sort_order) VALUES (grid_id, 'C', 'Acceptable',       3) RETURNING id INTO lC;
  INSERT INTO eval_grid_levels (grid_id, code, label, sort_order) VALUES (grid_id, 'D', 'Peu satisfaisant', 4) RETURNING id INTO lD;
  INSERT INTO eval_grid_levels (grid_id, code, label, sort_order) VALUES (grid_id, 'E', 'Insuffisant',      5) RETURNING id INTO lE;

  INSERT INTO eval_grid_criteria (grid_id, label, sort_order) VALUES (grid_id, 'Exprimer et défendre son point de vue avec des arguments',   1) RETURNING id INTO c1;
  INSERT INTO eval_grid_criteria (grid_id, label, sort_order) VALUES (grid_id, 'Écouter et analyser les points de vue des autres',          2) RETURNING id INTO c2;
  INSERT INTO eval_grid_criteria (grid_id, label, sort_order) VALUES (grid_id, 'Respecter les règles et l''éthique du dialogue',            3) RETURNING id INTO c3;
  INSERT INTO eval_grid_criteria (grid_id, label, sort_order) VALUES (grid_id, 'Utiliser différentes formes de dialogue',                  4) RETURNING id INTO c4;
  INSERT INTO eval_grid_criteria (grid_id, label, sort_order) VALUES (grid_id, 'Développer et nuancer sa pensée',                         5) RETURNING id INTO c5;
  INSERT INTO eval_grid_criteria (grid_id, label, sort_order) VALUES (grid_id, 'Formuler une synthèse ou une conclusion structurée',       6) RETURNING id INTO c6;

  INSERT INTO eval_grid_cells (criterion_id, level_id, descriptor) VALUES
    (c1, lA, 'Exprime et défend son point de vue avec plusieurs arguments clairs, pertinents et bien développés.'),
    (c1, lB, 'Exprime et défend son point de vue avec quelques arguments pertinents.'),
    (c1, lC, 'Exprime son point de vue avec un argument simple.'),
    (c1, lD, 'Point de vue peu clair ou peu argumenté.'),
    (c1, lE, 'N''exprime pas son point de vue ou ne l''argumente pas.'),

    (c2, lA, 'Écoute attentivement; analyse et reformule avec précision les points de vue des autres; identifie convergences et divergences.'),
    (c2, lB, 'Écoute et analyse adéquatement; quelques imprécisions dans la reformulation.'),
    (c2, lC, 'Écoute correctement; analyse partielle des points de vue.'),
    (c2, lD, 'Écoute inégale; analyse superficielle.'),
    (c2, lE, 'N''écoute pas ou ne tient pas compte des autres.'),

    (c3, lA, 'Respecte scrupuleusement les règles et l''éthique du dialogue; attitude exemplaire et bienveillante.'),
    (c3, lB, 'Respecte bien les règles et l''éthique; quelques oublis mineurs.'),
    (c3, lC, 'Respecte les règles essentielles; éthique partiellement présente.'),
    (c3, lD, 'Difficulté à respecter les règles ou l''éthique; a besoin de rappels fréquents.'),
    (c3, lE, 'Ne respecte pas les règles ni l''éthique du dialogue.'),

    (c4, lA, 'Utilise différentes formes de dialogue avec aisance (discussion, débat, délibération, entrevue).'),
    (c4, lB, 'Utilise quelques formes de dialogue de façon adéquate.'),
    (c4, lC, 'Utilise une ou deux formes de dialogue; maîtrise partielle.'),
    (c4, lD, 'Utilisation limitée ou inadéquate des formes de dialogue.'),
    (c4, lE, 'N''utilise pas les formes de dialogue de façon adéquate.'),

    (c5, lA, 'Développe et nuance sa pensée de façon significative; intègre les points de vue des autres dans sa réflexion.'),
    (c5, lB, 'Développe sa pensée et tente de la nuancer; intégration partielle des autres points de vue.'),
    (c5, lC, 'Développe légèrement sa pensée; peu de nuances.'),
    (c5, lD, 'Peu de développement; pensée rigide ou répétitive.'),
    (c5, lE, 'Aucun développement ni nuance.'),

    (c6, lA, 'Formule une synthèse ou conclusion structurée, cohérente, qui intègre les différents points de vue et dégages l''essentiel.'),
    (c6, lB, 'Synthèse pertinente et structurée; quelques éléments manquants.'),
    (c6, lC, 'Synthèse simple mais présente; structure partielle.'),
    (c6, lD, 'Synthèse vague ou peu structurée.'),
    (c6, lE, 'Aucune synthèse ni conclusion.');

END $$;
