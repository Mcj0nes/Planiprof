-- ============================================================
-- PLANIPROF -- Seed: Grille d'évaluation – Communiquer oralement, Français 2e cycle
-- ============================================================

DO $$
DECLARE
  grid_id uuid;
  fr_id int;
  p3 int; p4 int;
  lA int; lB int; lC int; lD int; lE int;
  c1 uuid; c2 uuid; c3 uuid; c4 uuid; c5 uuid; c6 uuid;
BEGIN

  SELECT id INTO fr_id FROM subjects WHERE slug = 'francais';
  SELECT id INTO p3 FROM grade_levels WHERE education_level = 'primaire' AND grade = 3;
  SELECT id INTO p4 FROM grade_levels WHERE education_level = 'primaire' AND grade = 4;

  INSERT INTO eval_grids (title, subject_id, cycle_label, source, is_baseline, competency)
    VALUES (
      'Grille d''évaluation – Communiquer oralement (Français – 2e cycle)',
      fr_id,
      '2e cycle du primaire',
      'Planiprof',
      true,
      'Communiquer oralement selon des modalités variées'
    )
    RETURNING id INTO grid_id;

  INSERT INTO eval_grid_grades VALUES (grid_id, p3), (grid_id, p4);

  INSERT INTO eval_grid_levels (grid_id, code, label, sort_order) VALUES (grid_id, 'A', 'Excellent',        1) RETURNING id INTO lA;
  INSERT INTO eval_grid_levels (grid_id, code, label, sort_order) VALUES (grid_id, 'B', 'Très bien',        2) RETURNING id INTO lB;
  INSERT INTO eval_grid_levels (grid_id, code, label, sort_order) VALUES (grid_id, 'C', 'Acceptable',       3) RETURNING id INTO lC;
  INSERT INTO eval_grid_levels (grid_id, code, label, sort_order) VALUES (grid_id, 'D', 'Peu satisfaisant', 4) RETURNING id INTO lD;
  INSERT INTO eval_grid_levels (grid_id, code, label, sort_order) VALUES (grid_id, 'E', 'Insuffisant',      5) RETURNING id INTO lE;

  INSERT INTO eval_grid_criteria (grid_id, label, sort_order) VALUES (grid_id, 'S''exprimer clairement et de façon cohérente',                  1) RETURNING id INTO c1;
  INSERT INTO eval_grid_criteria (grid_id, label, sort_order) VALUES (grid_id, 'Utiliser un vocabulaire varié et approprié',                    2) RETURNING id INTO c2;
  INSERT INTO eval_grid_criteria (grid_id, label, sort_order) VALUES (grid_id, 'Organiser son discours',                                       3) RETURNING id INTO c3;
  INSERT INTO eval_grid_criteria (grid_id, label, sort_order) VALUES (grid_id, 'Écouter activement et réagir de façon pertinente',             4) RETURNING id INTO c4;
  INSERT INTO eval_grid_criteria (grid_id, label, sort_order) VALUES (grid_id, 'Adapter sa communication au contexte et à l''auditoire',       5) RETURNING id INTO c5;
  INSERT INTO eval_grid_criteria (grid_id, label, sort_order) VALUES (grid_id, 'Respecter les règles de la prise de parole',                  6) RETURNING id INTO c6;

  INSERT INTO eval_grid_cells (criterion_id, level_id, descriptor) VALUES
    (c1, lA, 'S''exprime avec clarté, fluidité et cohérence; articulation, volume et débit bien maîtrisés.'),
    (c1, lB, 'S''exprime clairement; quelques imprécisions d''articulation, de volume ou de débit.'),
    (c1, lC, 'Expression généralement compréhensible; quelques difficultés de clarté.'),
    (c1, lD, 'Expression souvent difficile à comprendre; manque de clarté ou de cohérence.'),
    (c1, lE, 'Incompréhensible ou refus de s''exprimer.'),

    (c2, lA, 'Utilise un vocabulaire riche, précis et varié; emploie des termes appropriés à la situation.'),
    (c2, lB, 'Vocabulaire varié et généralement approprié; quelques imprécisions.'),
    (c2, lC, 'Vocabulaire adéquat mais limité; quelques répétitions.'),
    (c2, lD, 'Vocabulaire restreint; cherche souvent ses mots.'),
    (c2, lE, 'Vocabulaire très insuffisant; communication difficile.'),

    (c3, lA, 'Organise son discours de façon claire et logique; idées bien enchaînées; introduction et conclusion présentes.'),
    (c3, lB, 'Organisation généralement claire; enchaînements généralement logiques.'),
    (c3, lC, 'Organisation de base présente; enchaînements parfois confus.'),
    (c3, lD, 'Organisation peu claire; idées difficiles à suivre.'),
    (c3, lE, 'Aucune organisation perceptible; discours incohérent.'),

    (c4, lA, 'Écoute attentivement; réagit de façon pertinente et développée; fait des liens avec ce qui a été dit.'),
    (c4, lB, 'Écoute bien; réagit de façon généralement pertinente.'),
    (c4, lC, 'Écoute correcte; réactions simples mais présentes.'),
    (c4, lD, 'Écoute inégale; réactions peu liées au discours de l''autre.'),
    (c4, lE, 'N''écoute pas ou ne réagit pas de façon appropriée.'),

    (c5, lA, 'Adapte clairement sa communication au contexte et à l''auditoire; registre de langue approprié.'),
    (c5, lB, 'Adapte sa communication avec quelques ajustements nécessaires.'),
    (c5, lC, 'Adaptation partielle; registre de langue parfois inadéquat.'),
    (c5, lD, 'Peu d''adaptation au contexte ou à l''auditoire.'),
    (c5, lE, 'Aucune adaptation; communication inadaptée à la situation.'),

    (c6, lA, 'Respecte spontanément toutes les règles de la prise de parole; attitude exemplaire.'),
    (c6, lB, 'Respecte la plupart des règles; quelques oublis mineurs.'),
    (c6, lC, 'Respecte les règles essentielles; a besoin de rappels.'),
    (c6, lD, 'Difficulté à respecter les règles; interrompt souvent.'),
    (c6, lE, 'Ne respecte pas les règles de la prise de parole.');

END $$;
