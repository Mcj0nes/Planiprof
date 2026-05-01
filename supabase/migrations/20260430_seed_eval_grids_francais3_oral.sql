-- ============================================================
-- PLANIPROF -- Seed: Grille d'évaluation – Communiquer oralement, Français 3e cycle
-- ============================================================

DO $$
DECLARE
  grid_id uuid;
  fr_id int;
  p5 int; p6 int;
  lA int; lB int; lC int; lD int; lE int;
  c1 uuid; c2 uuid; c3 uuid; c4 uuid; c5 uuid; c6 uuid;
BEGIN

  SELECT id INTO fr_id FROM subjects WHERE slug = 'francais';
  SELECT id INTO p5 FROM grade_levels WHERE education_level = 'primaire' AND grade = 5;
  SELECT id INTO p6 FROM grade_levels WHERE education_level = 'primaire' AND grade = 6;

  INSERT INTO eval_grids (title, subject_id, cycle_label, source, is_baseline, competency)
    VALUES (
      'Grille d''évaluation – Communiquer oralement (Français – 3e cycle)',
      fr_id,
      '3e cycle du primaire',
      'Planiprof',
      true,
      'Communiquer oralement selon des modalités variées'
    )
    RETURNING id INTO grid_id;

  INSERT INTO eval_grid_grades VALUES (grid_id, p5), (grid_id, p6);

  INSERT INTO eval_grid_levels (grid_id, code, label, sort_order) VALUES (grid_id, 'A', 'Excellent',        1) RETURNING id INTO lA;
  INSERT INTO eval_grid_levels (grid_id, code, label, sort_order) VALUES (grid_id, 'B', 'Très bien',        2) RETURNING id INTO lB;
  INSERT INTO eval_grid_levels (grid_id, code, label, sort_order) VALUES (grid_id, 'C', 'Acceptable',       3) RETURNING id INTO lC;
  INSERT INTO eval_grid_levels (grid_id, code, label, sort_order) VALUES (grid_id, 'D', 'Peu satisfaisant', 4) RETURNING id INTO lD;
  INSERT INTO eval_grid_levels (grid_id, code, label, sort_order) VALUES (grid_id, 'E', 'Insuffisant',      5) RETURNING id INTO lE;

  INSERT INTO eval_grid_criteria (grid_id, label, sort_order) VALUES (grid_id, 'S''exprimer avec clarté, cohérence et fluidité',                         1) RETURNING id INTO c1;
  INSERT INTO eval_grid_criteria (grid_id, label, sort_order) VALUES (grid_id, 'Utiliser un vocabulaire précis, varié et adapté',                        2) RETURNING id INTO c2;
  INSERT INTO eval_grid_criteria (grid_id, label, sort_order) VALUES (grid_id, 'Organiser et structurer son discours',                                   3) RETURNING id INTO c3;
  INSERT INTO eval_grid_criteria (grid_id, label, sort_order) VALUES (grid_id, 'Écouter, interpréter et réagir de façon critique',                      4) RETURNING id INTO c4;
  INSERT INTO eval_grid_criteria (grid_id, label, sort_order) VALUES (grid_id, 'Adapter sa communication à l''intention, au contexte et à l''auditoire', 5) RETURNING id INTO c5;
  INSERT INTO eval_grid_criteria (grid_id, label, sort_order) VALUES (grid_id, 'Recourir aux ressources de la langue (syntaxe, registre, procédés)',     6) RETURNING id INTO c6;

  INSERT INTO eval_grid_cells (criterion_id, level_id, descriptor) VALUES
    (c1, lA, 'S''exprime avec une grande clarté, fluidité et cohérence; articulation, volume, débit et intonation bien maîtrisés.'),
    (c1, lB, 'S''exprime clairement et avec fluidité; quelques imprécisions mineures.'),
    (c1, lC, 'Expression généralement compréhensible; quelques difficultés de fluidité ou de cohérence.'),
    (c1, lD, 'Expression souvent difficile à suivre; manque de clarté ou de fluidité marqué.'),
    (c1, lE, 'Incompréhensible ou refus de s''exprimer.'),

    (c2, lA, 'Utilise un vocabulaire riche, précis et varié, parfaitement adapté à la situation et à l''intention.'),
    (c2, lB, 'Vocabulaire précis et généralement varié; quelques imprécisions.'),
    (c2, lC, 'Vocabulaire adéquat mais peu varié; quelques imprécisions ou répétitions.'),
    (c2, lD, 'Vocabulaire restreint ou imprécis; communication parfois compromise.'),
    (c2, lE, 'Vocabulaire très insuffisant; communication difficile.'),

    (c3, lA, 'Discours bien structuré; idées clairement organisées, enchaînées avec cohérence; transitions efficaces.'),
    (c3, lB, 'Organisation claire; enchaînements généralement logiques; quelques transitions manquantes.'),
    (c3, lC, 'Organisation de base présente; enchaînements parfois confus ou abruptes.'),
    (c3, lD, 'Organisation peu claire; idées difficiles à suivre.'),
    (c3, lE, 'Aucune structure perceptible; discours incohérent.'),

    (c4, lA, 'Écoute avec attention et esprit critique; interprète finement; réagit avec pertinence, nuance et développement.'),
    (c4, lB, 'Écoute bien et interprète adéquatement; réactions pertinentes.'),
    (c4, lC, 'Écoute correcte; interprétation simple; réactions présentes mais peu développées.'),
    (c4, lD, 'Écoute inégale; interprétation superficielle; réactions peu pertinentes.'),
    (c4, lE, 'N''écoute pas, n''interprète pas ou ne réagit pas de façon appropriée.'),

    (c5, lA, 'Adapte parfaitement sa communication à l''intention, au contexte et à l''auditoire; registre de langue toujours approprié.'),
    (c5, lB, 'Adapte bien sa communication; registre généralement approprié; quelques ajustements mineurs nécessaires.'),
    (c5, lC, 'Adaptation partielle; registre de langue parfois inadéquat ou communication peu ajustée à l''auditoire.'),
    (c5, lD, 'Peu d''adaptation; registre souvent inadéquat.'),
    (c5, lE, 'Aucune adaptation; communication inadaptée à la situation.'),

    (c6, lA, 'Utilise avec aisance les ressources de la langue (syntaxe correcte, registre varié, procédés expressifs); langue soignée.'),
    (c6, lB, 'Bonne utilisation des ressources de la langue; quelques imprécisions syntaxiques ou stylistiques.'),
    (c6, lC, 'Utilisation adéquate mais limitée des ressources de la langue.'),
    (c6, lD, 'Ressources de la langue peu maîtrisées; erreurs fréquentes.'),
    (c6, lE, 'Ressources de la langue non maîtrisées; communication très déficiente.');

END $$;
