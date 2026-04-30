-- ============================================================
-- PLANIPROF -- Seed: Grille d'évaluation – Interpréter, Musique 2e cycle
-- ============================================================

DO $$
DECLARE
  grid_id uuid;
  musique_id int;
  p3 int; p4 int;
  lA int; lB int; lC int; lD int; lE int;
  c1 uuid; c2 uuid; c3 uuid; c4 uuid; c5 uuid;
BEGIN

  SELECT id INTO musique_id FROM subjects WHERE slug = 'musique';
  SELECT id INTO p3 FROM grade_levels WHERE education_level = 'primaire' AND grade = 3;
  SELECT id INTO p4 FROM grade_levels WHERE education_level = 'primaire' AND grade = 4;

  INSERT INTO eval_grids (title, subject_id, cycle_label, source, is_baseline, competency)
    VALUES (
      'Grille d''évaluation – Compétence : Interpréter (Musique – 2e cycle)',
      musique_id,
      '2e cycle du primaire',
      'Planiprof',
      true,
      'Interpréter des pièces musicales'
    )
    RETURNING id INTO grid_id;

  INSERT INTO eval_grid_grades VALUES (grid_id, p3), (grid_id, p4);

  INSERT INTO eval_grid_levels (grid_id, code, label, sort_order) VALUES (grid_id, 'A', 'Excellent',        1) RETURNING id INTO lA;
  INSERT INTO eval_grid_levels (grid_id, code, label, sort_order) VALUES (grid_id, 'B', 'Très bien',        2) RETURNING id INTO lB;
  INSERT INTO eval_grid_levels (grid_id, code, label, sort_order) VALUES (grid_id, 'C', 'Acceptable',       3) RETURNING id INTO lC;
  INSERT INTO eval_grid_levels (grid_id, code, label, sort_order) VALUES (grid_id, 'D', 'Peu satisfaisant', 4) RETURNING id INTO lD;
  INSERT INTO eval_grid_levels (grid_id, code, label, sort_order) VALUES (grid_id, 'E', 'Insuffisant',      5) RETURNING id INTO lE;

  INSERT INTO eval_grid_criteria (grid_id, label, sort_order) VALUES (grid_id, 'Respect du rythme et de la pulsation',            1) RETURNING id INTO c1;
  INSERT INTO eval_grid_criteria (grid_id, label, sort_order) VALUES (grid_id, 'Exactitude des hauteurs (intonation / mélodie)',   2) RETURNING id INTO c2;
  INSERT INTO eval_grid_criteria (grid_id, label, sort_order) VALUES (grid_id, 'Qualité sonore (timbre, contrôle, technique)',     3) RETURNING id INTO c3;
  INSERT INTO eval_grid_criteria (grid_id, label, sort_order) VALUES (grid_id, 'Expression musicale (nuances, phrasé, intention)', 4) RETURNING id INTO c4;
  INSERT INTO eval_grid_criteria (grid_id, label, sort_order) VALUES (grid_id, 'Autonomie et préparation',                        5) RETURNING id INTO c5;

  INSERT INTO eval_grid_cells (criterion_id, level_id, descriptor) VALUES
    (c1, lA, 'Respecte la pulsation et les rythmes avec constance; exécution précise et stable.'),
    (c1, lB, 'Respecte généralement la pulsation; quelques imprécisions mineures.'),
    (c1, lC, 'Pulsation globalement respectée; plusieurs hésitations.'),
    (c1, lD, 'Pulsation instable; rythme souvent imprécis.'),
    (c1, lE, 'Ne parvient pas à suivre la pulsation ou les rythmes.'),

    (c2, lA, 'Hauteurs justes et stables; mélodie interprétée avec précision.'),
    (c2, lB, 'Quelques écarts, mais la mélodie demeure reconnaissable et juste.'),
    (c2, lC, 'Plusieurs imprécisions, mais l''ensemble reste compréhensible.'),
    (c2, lD, 'Hauteurs souvent incorrectes; mélodie difficile à reconnaître.'),
    (c2, lE, 'Hauteurs non maîtrisées; mélodie non reconnaissable.'),

    (c3, lA, 'Son clair, contrôlé, adapté à l''instrument ou à la voix; technique solide.'),
    (c3, lB, 'Son généralement clair; quelques irrégularités.'),
    (c3, lC, 'Son variable; technique de base présente mais inégale.'),
    (c3, lD, 'Son souvent instable ou inadéquat; technique faible.'),
    (c3, lE, 'Son inadéquat; technique absente ou non maîtrisée.'),

    (c4, lA, 'Interprétation expressive; nuances et phrasé bien intégrés; intention claire.'),
    (c4, lB, 'Expression présente; quelques nuances appliquées.'),
    (c4, lC, 'Expression simple; peu de nuances.'),
    (c4, lD, 'Expression limitée; interprétation monotone.'),
    (c4, lE, 'Aucune expression perceptible.'),

    (c5, lA, 'Travaille de manière autonome; interprétation fluide et bien préparée.'),
    (c5, lB, 'Bonne préparation; quelques hésitations.'),
    (c5, lC, 'Préparation suffisante; interprétation parfois hésitante.'),
    (c5, lD, 'Préparation insuffisante; dépend beaucoup de l''enseignant.'),
    (c5, lE, 'Aucune préparation perceptible.');

END $$;
