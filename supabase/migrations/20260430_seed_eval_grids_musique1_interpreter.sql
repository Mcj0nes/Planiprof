-- ============================================================
-- PLANIPROF -- Seed: Grille d'évaluation – Interpréter, Musique 1er cycle
-- ============================================================

DO $$
DECLARE
  grid_id uuid;
  musique_id int;
  p1 int; p2 int;
  lA int; lB int; lC int; lD int; lE int;
  c1 uuid; c2 uuid; c3 uuid; c4 uuid; c5 uuid;
BEGIN

  SELECT id INTO musique_id FROM subjects WHERE slug = 'musique';
  SELECT id INTO p1 FROM grade_levels WHERE education_level = 'primaire' AND grade = 1;
  SELECT id INTO p2 FROM grade_levels WHERE education_level = 'primaire' AND grade = 2;

  INSERT INTO eval_grids (title, subject_id, cycle_label, source, is_baseline, competency)
    VALUES (
      'Grille d''évaluation – Compétence : Interpréter (Musique – 1er cycle)',
      musique_id,
      '1er cycle du primaire',
      'Planiprof',
      true,
      'Interpréter des pièces musicales'
    )
    RETURNING id INTO grid_id;

  INSERT INTO eval_grid_grades VALUES (grid_id, p1), (grid_id, p2);

  INSERT INTO eval_grid_levels (grid_id, code, label, sort_order) VALUES (grid_id, 'A', 'Excellent',        1) RETURNING id INTO lA;
  INSERT INTO eval_grid_levels (grid_id, code, label, sort_order) VALUES (grid_id, 'B', 'Très bien',        2) RETURNING id INTO lB;
  INSERT INTO eval_grid_levels (grid_id, code, label, sort_order) VALUES (grid_id, 'C', 'Acceptable',       3) RETURNING id INTO lC;
  INSERT INTO eval_grid_levels (grid_id, code, label, sort_order) VALUES (grid_id, 'D', 'Peu satisfaisant', 4) RETURNING id INTO lD;
  INSERT INTO eval_grid_levels (grid_id, code, label, sort_order) VALUES (grid_id, 'E', 'Insuffisant',      5) RETURNING id INTO lE;

  INSERT INTO eval_grid_criteria (grid_id, label, sort_order) VALUES (grid_id, 'Respect de la pulsation',                        1) RETURNING id INTO c1;
  INSERT INTO eval_grid_criteria (grid_id, label, sort_order) VALUES (grid_id, 'Exécution de rythmes simples',                   2) RETURNING id INTO c2;
  INSERT INTO eval_grid_criteria (grid_id, label, sort_order) VALUES (grid_id, 'Production de sons (voix ou instrument)',        3) RETURNING id INTO c3;
  INSERT INTO eval_grid_criteria (grid_id, label, sort_order) VALUES (grid_id, 'Participation active à l''interprétation',       4) RETURNING id INTO c4;
  INSERT INTO eval_grid_criteria (grid_id, label, sort_order) VALUES (grid_id, 'Expression simple (intention, nuances de base)', 5) RETURNING id INTO c5;

  INSERT INTO eval_grid_cells (criterion_id, level_id, descriptor) VALUES
    (c1, lA, 'Suit la pulsation avec constance tout au long de la pièce.'),
    (c1, lB, 'Suit la pulsation la plupart du temps; quelques hésitations.'),
    (c1, lC, 'Suit la pulsation de façon irrégulière; plusieurs hésitations.'),
    (c1, lD, 'Pulsation souvent perdue; difficulté à rester avec le groupe.'),
    (c1, lE, 'Ne parvient pas à suivre la pulsation.'),

    (c2, lA, 'Exécute les rythmes simples avec précision et régularité.'),
    (c2, lB, 'Exécute les rythmes simples avec quelques imprécisions.'),
    (c2, lC, 'Exécute les rythmes simples, mais avec plusieurs erreurs.'),
    (c2, lD, 'Rythmes souvent incorrects ou incomplets.'),
    (c2, lE, 'Ne parvient pas à exécuter les rythmes simples.'),

    (c3, lA, 'Produit un son clair et contrôlé; utilise adéquatement l''instrument ou la voix.'),
    (c3, lB, 'Son généralement clair; quelques irrégularités.'),
    (c3, lC, 'Son variable; contrôle partiel.'),
    (c3, lD, 'Son souvent instable ou trop faible/fort.'),
    (c3, lE, 'Son inadéquat ou non maîtrisé.'),

    (c4, lA, 'Participe activement; suit les consignes et reste engagé tout au long de la pièce.'),
    (c4, lB, 'Participe bien; quelques moments d''inattention.'),
    (c4, lC, 'Participe, mais de façon inégale.'),
    (c4, lD, 'Participation minimale ou hésitante.'),
    (c4, lE, 'Ne participe pas ou refuse de participer.'),

    (c5, lA, 'Exprime clairement une intention simple; applique des nuances de base (fort/doux).'),
    (c5, lB, 'Expression présente; applique parfois des nuances.'),
    (c5, lC, 'Expression simple; peu ou pas de nuances.'),
    (c5, lD, 'Expression limitée; interprétation monotone.'),
    (c5, lE, 'Aucune expression perceptible.');

END $$;
