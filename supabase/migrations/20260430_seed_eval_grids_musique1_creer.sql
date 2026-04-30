-- ============================================================
-- PLANIPROF -- Seed: Grille d'évaluation – Créer, Musique 1er cycle
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
      'Grille d''évaluation – Compétence : Créer (Musique – 1er cycle)',
      musique_id,
      '1er cycle du primaire',
      'Planiprof',
      true,
      'Créer des pièces musicales'
    )
    RETURNING id INTO grid_id;

  INSERT INTO eval_grid_grades VALUES (grid_id, p1), (grid_id, p2);

  INSERT INTO eval_grid_levels (grid_id, code, label, sort_order) VALUES (grid_id, 'A', 'Excellent',        1) RETURNING id INTO lA;
  INSERT INTO eval_grid_levels (grid_id, code, label, sort_order) VALUES (grid_id, 'B', 'Très bien',        2) RETURNING id INTO lB;
  INSERT INTO eval_grid_levels (grid_id, code, label, sort_order) VALUES (grid_id, 'C', 'Acceptable',       3) RETURNING id INTO lC;
  INSERT INTO eval_grid_levels (grid_id, code, label, sort_order) VALUES (grid_id, 'D', 'Peu satisfaisant', 4) RETURNING id INTO lD;
  INSERT INTO eval_grid_levels (grid_id, code, label, sort_order) VALUES (grid_id, 'E', 'Insuffisant',      5) RETURNING id INTO lE;

  INSERT INTO eval_grid_criteria (grid_id, label, sort_order) VALUES (grid_id, 'Proposer une idée sonore',                              1) RETURNING id INTO c1;
  INSERT INTO eval_grid_criteria (grid_id, label, sort_order) VALUES (grid_id, 'Produire des sons avec la voix ou un instrument',       2) RETURNING id INTO c2;
  INSERT INTO eval_grid_criteria (grid_id, label, sort_order) VALUES (grid_id, 'Organiser des sons (ordre, répétition)',                3) RETURNING id INTO c3;
  INSERT INTO eval_grid_criteria (grid_id, label, sort_order) VALUES (grid_id, 'Exprimer une intention simple (fort/doux, vite/lent)',  4) RETURNING id INTO c4;
  INSERT INTO eval_grid_criteria (grid_id, label, sort_order) VALUES (grid_id, 'Parler de sa création',                                5) RETURNING id INTO c5;

  INSERT INTO eval_grid_cells (criterion_id, level_id, descriptor) VALUES
    (c1, lA, 'Propose une idée sonore claire et originale; montre de l''enthousiasme à explorer différentes possibilités.'),
    (c1, lB, 'Propose une idée sonore simple et pertinente; fait quelques essais.'),
    (c1, lC, 'Propose une idée, mais elle reste vague.'),
    (c1, lD, 'A du mal à proposer une idée; a besoin de beaucoup d''aide pour commencer.'),
    (c1, lE, 'Ne propose pas d''idée ou l''idée est hors sujet.'),

    (c2, lA, 'Produit des sons clairs et variés avec la voix ou l''instrument; explore différentes façons de produire des sons.'),
    (c2, lB, 'Produit des sons adéquats; quelques irrégularités.'),
    (c2, lC, 'Produit des sons de façon inégale; contrôle partiel.'),
    (c2, lD, 'Difficulté à produire les sons voulus; a besoin de beaucoup d''aide.'),
    (c2, lE, 'Ne parvient pas à produire des sons adéquats.'),

    (c3, lA, 'Organise les sons de façon claire; une suite ou une répétition est perceptible.'),
    (c3, lB, 'Organisation simple mais présente; une structure est reconnaissable.'),
    (c3, lC, 'Organisation de base; la structure est parfois difficile à suivre.'),
    (c3, lD, 'Organisation très limitée; les sons semblent aléatoires.'),
    (c3, lE, 'Aucune organisation perceptible.'),

    (c4, lA, 'Applique clairement une intention simple (joue fort/doux ou vite/lent) de façon intentionnelle.'),
    (c4, lB, 'Applique une intention simple; l''effet est généralement perceptible.'),
    (c4, lC, 'Tente d''appliquer une intention, mais l''effet est peu clair.'),
    (c4, lD, 'Peu ou pas d''intention expressive; interprétation monotone.'),
    (c4, lE, 'Aucune intention expressive perceptible.'),

    (c5, lA, 'Explique avec enthousiasme ce qu''il/elle a créé et pourquoi il/elle a fait ce choix.'),
    (c5, lB, 'Explique simplement ce qu''il/elle a fait dans sa création.'),
    (c5, lC, 'Nomme un élément de sa création, mais a du mal à expliquer ses choix.'),
    (c5, lD, 'A besoin de beaucoup d''aide pour parler de sa création.'),
    (c5, lE, 'Ne parvient pas à parler de sa création.');

END $$;
