-- ============================================================
-- PLANIPROF -- Seed: Grille d'évaluation – Créer, Musique 3e cycle
-- ============================================================

DO $$
DECLARE
  grid_id uuid;
  musique_id int;
  p5 int; p6 int;
  lA int; lB int; lC int; lD int; lE int;
  c1 uuid; c2 uuid; c3 uuid; c4 uuid; c5 uuid; c6 uuid;
BEGIN

  SELECT id INTO musique_id FROM subjects WHERE slug = 'musique';
  SELECT id INTO p5 FROM grade_levels WHERE education_level = 'primaire' AND grade = 5;
  SELECT id INTO p6 FROM grade_levels WHERE education_level = 'primaire' AND grade = 6;

  INSERT INTO eval_grids (title, subject_id, cycle_label, source, is_baseline, competency)
    VALUES (
      'Grille d''évaluation – Compétence : Créer (Musique – 3e cycle)',
      musique_id,
      '3e cycle du primaire',
      'Planiprof',
      true,
      'Créer des pièces musicales'
    )
    RETURNING id INTO grid_id;

  INSERT INTO eval_grid_grades VALUES (grid_id, p5), (grid_id, p6);

  INSERT INTO eval_grid_levels (grid_id, code, label, sort_order) VALUES (grid_id, 'A', 'Excellent',        1) RETURNING id INTO lA;
  INSERT INTO eval_grid_levels (grid_id, code, label, sort_order) VALUES (grid_id, 'B', 'Très bien',        2) RETURNING id INTO lB;
  INSERT INTO eval_grid_levels (grid_id, code, label, sort_order) VALUES (grid_id, 'C', 'Acceptable',       3) RETURNING id INTO lC;
  INSERT INTO eval_grid_levels (grid_id, code, label, sort_order) VALUES (grid_id, 'D', 'Peu satisfaisant', 4) RETURNING id INTO lD;
  INSERT INTO eval_grid_levels (grid_id, code, label, sort_order) VALUES (grid_id, 'E', 'Insuffisant',      5) RETURNING id INTO lE;

  INSERT INTO eval_grid_criteria (grid_id, label, sort_order) VALUES (grid_id, 'Explorer des idées musicales (essais, improvisations, motifs)',         1) RETURNING id INTO c1;
  INSERT INTO eval_grid_criteria (grid_id, label, sort_order) VALUES (grid_id, 'Organiser des éléments musicaux (rythme, mélodie, timbre, intensité, tempo)', 2) RETURNING id INTO c2;
  INSERT INTO eval_grid_criteria (grid_id, label, sort_order) VALUES (grid_id, 'Utiliser des instruments, la voix ou des outils numériques pour créer', 3) RETURNING id INTO c3;
  INSERT INTO eval_grid_criteria (grid_id, label, sort_order) VALUES (grid_id, 'Faire des choix expressifs (nuances, intention, ambiance)',             4) RETURNING id INTO c4;
  INSERT INTO eval_grid_criteria (grid_id, label, sort_order) VALUES (grid_id, 'Structurer la création (début, développement, fin)',                    5) RETURNING id INTO c5;
  INSERT INTO eval_grid_criteria (grid_id, label, sort_order) VALUES (grid_id, 'Justifier ses choix (démarche créative)',                              6) RETURNING id INTO c6;

  INSERT INTO eval_grid_cells (criterion_id, level_id, descriptor) VALUES
    (c1, lA, 'Explore plusieurs idées variées (rythmiques, mélodiques, sonores); essais réfléchis; prend des initiatives créatives.'),
    (c1, lB, 'Explore quelques idées pertinentes; essais simples mais efficaces.'),
    (c1, lC, 'Explore une ou deux idées; essais présents mais limités.'),
    (c1, lD, 'Exploration minimale; essais rares ou peu pertinents.'),
    (c1, lE, 'Aucune exploration ou idées hors sujet.'),

    (c2, lA, 'Organisation claire et cohérente; structure musicale bien définie; transitions efficaces.'),
    (c2, lB, 'Organisation pertinente; structure simple mais fonctionnelle.'),
    (c2, lC, 'Organisation de base; structure perceptible mais inégale.'),
    (c2, lD, 'Organisation confuse; structure difficile à suivre.'),
    (c2, lE, 'Aucune organisation perceptible.'),

    (c3, lA, 'Utilise les instruments, la voix ou les outils numériques avec aisance; maîtrise technique solide; choix sonores pertinents.'),
    (c3, lB, 'Utilisation adéquate; quelques irrégularités techniques.'),
    (c3, lC, 'Utilisation fonctionnelle mais parfois maladroite.'),
    (c3, lD, 'Difficulté à utiliser les instruments ou outils; technique faible.'),
    (c3, lE, 'Utilisation inadéquate ou non maîtrisée.'),

    (c4, lA, 'Choix expressifs clairs et pertinents; intention musicale bien communiquée.'),
    (c4, lB, 'Expression présente; intention généralement perceptible.'),
    (c4, lC, 'Expression simple; intention perceptible mais limitée.'),
    (c4, lD, 'Expression faible; intention difficile à comprendre.'),
    (c4, lE, 'Aucune expression perceptible.'),

    (c5, lA, 'Structure complète et logique; progression musicale bien définie.'),
    (c5, lB, 'Structure simple mais cohérente.'),
    (c5, lC, 'Structure perceptible mais parfois inégale.'),
    (c5, lD, 'Structure faible ou incomplète.'),
    (c5, lE, 'Aucune structure perceptible.'),

    (c6, lA, 'Explique clairement ses choix; fait des liens avec ses essais, son intention et les éléments musicaux utilisés.'),
    (c6, lB, 'Explique quelques choix avec des liens pertinents.'),
    (c6, lC, 'Justification simple; liens parfois vagues.'),
    (c6, lD, 'Justification limitée ou difficile à suivre.'),
    (c6, lE, 'Aucune justification ou hors sujet.');

END $$;
