-- ============================================================
-- PLANIPROF -- Seed: Grille d'évaluation – Communiquer oralement, Français 1er cycle
-- ============================================================

DO $$
DECLARE
  grid_id uuid;
  fr_id int;
  p1 int; p2 int;
  lA int; lB int; lC int; lD int; lE int;
  c1 uuid; c2 uuid; c3 uuid; c4 uuid; c5 uuid;
BEGIN

  SELECT id INTO fr_id FROM subjects WHERE slug = 'francais';
  SELECT id INTO p1 FROM grade_levels WHERE education_level = 'primaire' AND grade = 1;
  SELECT id INTO p2 FROM grade_levels WHERE education_level = 'primaire' AND grade = 2;

  INSERT INTO eval_grids (title, subject_id, cycle_label, source, is_baseline, competency)
    VALUES (
      'Grille d''évaluation – Communiquer oralement (Français – 1er cycle)',
      fr_id,
      '1er cycle du primaire',
      'Planiprof',
      true,
      'Communiquer oralement selon des modalités variées'
    )
    RETURNING id INTO grid_id;

  INSERT INTO eval_grid_grades VALUES (grid_id, p1), (grid_id, p2);

  INSERT INTO eval_grid_levels (grid_id, code, label, sort_order) VALUES (grid_id, 'A', 'Excellent',        1) RETURNING id INTO lA;
  INSERT INTO eval_grid_levels (grid_id, code, label, sort_order) VALUES (grid_id, 'B', 'Très bien',        2) RETURNING id INTO lB;
  INSERT INTO eval_grid_levels (grid_id, code, label, sort_order) VALUES (grid_id, 'C', 'Acceptable',       3) RETURNING id INTO lC;
  INSERT INTO eval_grid_levels (grid_id, code, label, sort_order) VALUES (grid_id, 'D', 'Peu satisfaisant', 4) RETURNING id INTO lD;
  INSERT INTO eval_grid_levels (grid_id, code, label, sort_order) VALUES (grid_id, 'E', 'Insuffisant',      5) RETURNING id INTO lE;

  INSERT INTO eval_grid_criteria (grid_id, label, sort_order) VALUES (grid_id, 'S''exprimer clairement (articulation, volume, débit)',       1) RETURNING id INTO c1;
  INSERT INTO eval_grid_criteria (grid_id, label, sort_order) VALUES (grid_id, 'Utiliser un vocabulaire approprié au sujet',                 2) RETURNING id INTO c2;
  INSERT INTO eval_grid_criteria (grid_id, label, sort_order) VALUES (grid_id, 'Respecter le sujet de la communication',                    3) RETURNING id INTO c3;
  INSERT INTO eval_grid_criteria (grid_id, label, sort_order) VALUES (grid_id, 'Écouter activement son interlocuteur',                      4) RETURNING id INTO c4;
  INSERT INTO eval_grid_criteria (grid_id, label, sort_order) VALUES (grid_id, 'Respecter les règles de la prise de parole',                5) RETURNING id INTO c5;

  INSERT INTO eval_grid_cells (criterion_id, level_id, descriptor) VALUES
    (c1, lA, 'S''exprime avec une articulation claire, un volume adéquat et un débit régulier; facile à comprendre.'),
    (c1, lB, 'S''exprime généralement bien; quelques imprécisions d''articulation ou de débit.'),
    (c1, lC, 'Expression fonctionnelle; articulation ou volume parfois insuffisant.'),
    (c1, lD, 'Difficile à comprendre; articulation faible ou volume inadapté.'),
    (c1, lE, 'Incompréhensible ou refus de s''exprimer.'),

    (c2, lA, 'Utilise un vocabulaire varié et précis, adapté au sujet et à la situation.'),
    (c2, lB, 'Vocabulaire généralement approprié; quelques imprécisions ou répétitions.'),
    (c2, lC, 'Vocabulaire simple mais suffisant pour se faire comprendre.'),
    (c2, lD, 'Vocabulaire limité; cherche souvent ses mots.'),
    (c2, lE, 'Vocabulaire très insuffisant; communication difficile.'),

    (c3, lA, 'Reste toujours dans le sujet; propos cohérents et bien liés au contexte.'),
    (c3, lB, 'Reste généralement dans le sujet; quelques digressions mineures.'),
    (c3, lC, 'Reste dans le sujet la plupart du temps; parfois hors sujet.'),
    (c3, lD, 'Souvent hors sujet ou propos peu liés à la situation.'),
    (c3, lE, 'Hors sujet ou ne communique pas en lien avec la situation.'),

    (c4, lA, 'Écoute attentivement; montre des signes clairs d''écoute active; réagit de façon pertinente.'),
    (c4, lB, 'Écoute bien; réagit généralement de façon appropriée.'),
    (c4, lC, 'Écoute de façon inégale; réactions parfois inadaptées.'),
    (c4, lD, 'Écoute insuffisante; réactions peu liées à ce qui a été dit.'),
    (c4, lE, 'N''écoute pas ou refuse d''interagir.'),

    (c5, lA, 'Respecte spontanément les règles de prise de parole (lever la main, attendre, ne pas interrompre).'),
    (c5, lB, 'Respecte la plupart des règles; quelques oublis mineurs.'),
    (c5, lC, 'Respecte les règles essentielles; a besoin de rappels.'),
    (c5, lD, 'Difficulté à respecter les règles; interrompt souvent.'),
    (c5, lE, 'Ne respecte pas les règles de la prise de parole.');

END $$;
