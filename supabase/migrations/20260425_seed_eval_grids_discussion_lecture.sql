-- ============================================================
-- PLANIPROF -- Seed: Grilles de discussion / entretien de lecture
-- Lecture + Communication orale – 1er, 2e, 3e cycles du primaire
-- ============================================================

DO $$
DECLARE
  g1_id uuid; g2_id uuid; g3_id uuid;
  fr_id int;
  p1 int; p2 int; p3 int; p4 int; p5 int; p6 int;
  lA int; lB int; lC int; lD int; lE int;
  c1 uuid; c2 uuid; c3 uuid; c4 uuid; c5 uuid; c6 uuid;
BEGIN

  SELECT id INTO fr_id FROM subjects WHERE slug = 'francais';
  SELECT id INTO p1 FROM grade_levels WHERE education_level = 'primaire' AND grade = 1;
  SELECT id INTO p2 FROM grade_levels WHERE education_level = 'primaire' AND grade = 2;
  SELECT id INTO p3 FROM grade_levels WHERE education_level = 'primaire' AND grade = 3;
  SELECT id INTO p4 FROM grade_levels WHERE education_level = 'primaire' AND grade = 4;
  SELECT id INTO p5 FROM grade_levels WHERE education_level = 'primaire' AND grade = 5;
  SELECT id INTO p6 FROM grade_levels WHERE education_level = 'primaire' AND grade = 6;

  -- ──────────────────────────────────────────────────────────
  -- 1er cycle – Grille de discussion
  -- ──────────────────────────────────────────────────────────

  INSERT INTO eval_grids (title, subject_id, cycle_label, source, is_baseline, grid_type, competency)
    VALUES (
      'Grille de discussion – Lecture et communication orale – 1er cycle',
      fr_id,
      '1er cycle du primaire',
      'PFÉQ, MEQ, 2001. Cadre d''évaluation des apprentissages – Français, MEQ, 2011. Progression des apprentissages – Français, MELS, 2009.',
      true,
      'conversation',
      'Discussion de lecture – Lecture et communication orale'
    )
    RETURNING id INTO g1_id;

  INSERT INTO eval_grid_grades VALUES (g1_id, p1), (g1_id, p2);

  INSERT INTO eval_grid_levels (grid_id, code, label, sort_order) VALUES (g1_id, 'A', 'Excellent',        1) RETURNING id INTO lA;
  INSERT INTO eval_grid_levels (grid_id, code, label, sort_order) VALUES (g1_id, 'B', 'Très bien',        2) RETURNING id INTO lB;
  INSERT INTO eval_grid_levels (grid_id, code, label, sort_order) VALUES (g1_id, 'C', 'Acceptable',       3) RETURNING id INTO lC;
  INSERT INTO eval_grid_levels (grid_id, code, label, sort_order) VALUES (g1_id, 'D', 'Peu satisfaisant', 4) RETURNING id INTO lD;
  INSERT INTO eval_grid_levels (grid_id, code, label, sort_order) VALUES (g1_id, 'E', 'Insuffisant',      5) RETURNING id INTO lE;

  INSERT INTO eval_grid_criteria (grid_id, label, weight, sort_order)
    VALUES (g1_id, E'1. Compréhension du texte\n↳ Dimension : Compréhension\nL''élève raconte l''histoire dans ses mots et repère les informations importantes.', NULL, 1) RETURNING id INTO c1;
  INSERT INTO eval_grid_criteria (grid_id, label, weight, sort_order)
    VALUES (g1_id, E'2. Réaction personnelle\n↳ Dimension : Réaction\nL''élève exprime ses émotions, ses sentiments ou fait des liens avec son vécu.', NULL, 2) RETURNING id INTO c2;
  INSERT INTO eval_grid_criteria (grid_id, label, weight, sort_order)
    VALUES (g1_id, E'3. Justification simple\n↳ Dimension : Appréciation\nL''élève donne une raison simple pour appuyer son idée (ex. : « parce que… »).', NULL, 3) RETURNING id INTO c3;
  INSERT INTO eval_grid_criteria (grid_id, label, weight, sort_order)
    VALUES (g1_id, E'4. Interaction\nL''élève écoute, répond aux questions et participe à l''échange.', NULL, 4) RETURNING id INTO c4;
  INSERT INTO eval_grid_criteria (grid_id, label, weight, sort_order)
    VALUES (g1_id, E'5. Expression orale\nL''élève s''exprime clairement avec un vocabulaire approprié.', NULL, 5) RETURNING id INTO c5;

  -- Empty cells (teacher marks A–E during discussion)
  INSERT INTO eval_grid_cells (criterion_id, level_id, descriptor) VALUES
    (c1, lA, ''), (c1, lB, ''), (c1, lC, ''), (c1, lD, ''), (c1, lE, ''),
    (c2, lA, ''), (c2, lB, ''), (c2, lC, ''), (c2, lD, ''), (c2, lE, ''),
    (c3, lA, ''), (c3, lB, ''), (c3, lC, ''), (c3, lD, ''), (c3, lE, ''),
    (c4, lA, ''), (c4, lB, ''), (c4, lC, ''), (c4, lD, ''), (c4, lE, ''),
    (c5, lA, ''), (c5, lB, ''), (c5, lC, ''), (c5, lD, ''), (c5, lE, '');

  -- ──────────────────────────────────────────────────────────
  -- 2e cycle – Grille de discussion
  -- ──────────────────────────────────────────────────────────

  INSERT INTO eval_grids (title, subject_id, cycle_label, source, is_baseline, grid_type, competency)
    VALUES (
      'Grille de discussion – Lecture et communication orale – 2e cycle',
      fr_id,
      '2e cycle du primaire',
      'PFÉQ, MEQ, 2001. Cadre d''évaluation des apprentissages – Français, MEQ, 2011. Progression des apprentissages – Français, MELS, 2009.',
      true,
      'conversation',
      'Discussion de lecture – Lecture et communication orale'
    )
    RETURNING id INTO g2_id;

  INSERT INTO eval_grid_grades VALUES (g2_id, p3), (g2_id, p4);

  INSERT INTO eval_grid_levels (grid_id, code, label, sort_order) VALUES (g2_id, 'A', 'Excellent',        1) RETURNING id INTO lA;
  INSERT INTO eval_grid_levels (grid_id, code, label, sort_order) VALUES (g2_id, 'B', 'Très bien',        2) RETURNING id INTO lB;
  INSERT INTO eval_grid_levels (grid_id, code, label, sort_order) VALUES (g2_id, 'C', 'Acceptable',       3) RETURNING id INTO lC;
  INSERT INTO eval_grid_levels (grid_id, code, label, sort_order) VALUES (g2_id, 'D', 'Peu satisfaisant', 4) RETURNING id INTO lD;
  INSERT INTO eval_grid_levels (grid_id, code, label, sort_order) VALUES (g2_id, 'E', 'Insuffisant',      5) RETURNING id INTO lE;

  INSERT INTO eval_grid_criteria (grid_id, label, weight, sort_order)
    VALUES (g2_id, E'1. Compréhension du texte\n↳ Dimension : Compréhension\nL''élève dégage les informations explicites et implicites et les organise de façon cohérente.', NULL, 1) RETURNING id INTO c1;
  INSERT INTO eval_grid_criteria (grid_id, label, weight, sort_order)
    VALUES (g2_id, E'2. Réaction personnelle\n↳ Dimension : Réaction\nL''élève exprime et justifie ses réactions (émotions, opinions) en s''appuyant sur le texte et son vécu.', NULL, 2) RETURNING id INTO c2;
  INSERT INTO eval_grid_criteria (grid_id, label, weight, sort_order)
    VALUES (g2_id, E'3. Appréciation\n↳ Dimension : Appréciation\nL''élève porte un jugement sur le texte en s''appuyant sur des critères (langue, histoire, comparaison avec d''autres œuvres).', NULL, 3) RETURNING id INTO c3;
  INSERT INTO eval_grid_criteria (grid_id, label, weight, sort_order)
    VALUES (g2_id, E'4. Interaction\nL''élève écoute activement, réagit aux propos des autres et enrichit l''échange.', NULL, 4) RETURNING id INTO c4;
  INSERT INTO eval_grid_criteria (grid_id, label, weight, sort_order)
    VALUES (g2_id, E'5. Expression orale\nL''élève s''exprime avec clarté, précision et un vocabulaire varié.', NULL, 5) RETURNING id INTO c5;

  INSERT INTO eval_grid_cells (criterion_id, level_id, descriptor) VALUES
    (c1, lA, ''), (c1, lB, ''), (c1, lC, ''), (c1, lD, ''), (c1, lE, ''),
    (c2, lA, ''), (c2, lB, ''), (c2, lC, ''), (c2, lD, ''), (c2, lE, ''),
    (c3, lA, ''), (c3, lB, ''), (c3, lC, ''), (c3, lD, ''), (c3, lE, ''),
    (c4, lA, ''), (c4, lB, ''), (c4, lC, ''), (c4, lD, ''), (c4, lE, ''),
    (c5, lA, ''), (c5, lB, ''), (c5, lC, ''), (c5, lD, ''), (c5, lE, '');

  -- ──────────────────────────────────────────────────────────
  -- 3e cycle – Grille d'entretien de lecture
  -- ──────────────────────────────────────────────────────────

  INSERT INTO eval_grids (title, subject_id, cycle_label, source, is_baseline, grid_type, competency)
    VALUES (
      'Grille d''entretien de lecture – Lecture et communication orale – 3e cycle',
      fr_id,
      '3e cycle du primaire',
      'PFÉQ, MEQ, 2001. Cadre d''évaluation des apprentissages – Français, MEQ, 2011. Progression des apprentissages – Français, MELS, 2009.',
      true,
      'conversation',
      'Discussion de lecture – Lecture et communication orale'
    )
    RETURNING id INTO g3_id;

  INSERT INTO eval_grid_grades VALUES (g3_id, p5), (g3_id, p6);

  INSERT INTO eval_grid_levels (grid_id, code, label, sort_order) VALUES (g3_id, 'A', 'Excellent',        1) RETURNING id INTO lA;
  INSERT INTO eval_grid_levels (grid_id, code, label, sort_order) VALUES (g3_id, 'B', 'Très bien',        2) RETURNING id INTO lB;
  INSERT INTO eval_grid_levels (grid_id, code, label, sort_order) VALUES (g3_id, 'C', 'Acceptable',       3) RETURNING id INTO lC;
  INSERT INTO eval_grid_levels (grid_id, code, label, sort_order) VALUES (g3_id, 'D', 'Peu satisfaisant', 4) RETURNING id INTO lD;
  INSERT INTO eval_grid_levels (grid_id, code, label, sort_order) VALUES (g3_id, 'E', 'Insuffisant',      5) RETURNING id INTO lE;

  INSERT INTO eval_grid_criteria (grid_id, label, weight, sort_order)
    VALUES (g3_id, E'1. Compréhension du texte\n↳ Dimension : Compréhension\nL''élève dégage et organise les informations explicites et implicites et en démontre une compréhension approfondie.', NULL, 1) RETURNING id INTO c1;
  INSERT INTO eval_grid_criteria (grid_id, label, weight, sort_order)
    VALUES (g3_id, E'2. Interprétation\n↳ Dimension : Interprétation\nL''élève explore des significations possibles en s''appuyant sur des indices textuels et en justifiant son raisonnement.', NULL, 2) RETURNING id INTO c2;
  INSERT INTO eval_grid_criteria (grid_id, label, weight, sort_order)
    VALUES (g3_id, E'3. Réaction personnelle\n↳ Dimension : Réaction\nL''élève exprime et justifie ses réactions de façon élaborée en établissant des liens avec le texte, son vécu et d''autres œuvres.', NULL, 3) RETURNING id INTO c3;
  INSERT INTO eval_grid_criteria (grid_id, label, weight, sort_order)
    VALUES (g3_id, E'4. Appréciation\n↳ Dimension : Appréciation\nL''élève porte un jugement critique et argumenté en s''appuyant sur des critères variés et des comparaisons pertinentes.', NULL, 4) RETURNING id INTO c4;
  INSERT INTO eval_grid_criteria (grid_id, label, weight, sort_order)
    VALUES (g3_id, E'5. Interaction\nL''élève écoute de façon critique, reformule, questionne et fait avancer la discussion.', NULL, 5) RETURNING id INTO c5;
  INSERT INTO eval_grid_criteria (grid_id, label, weight, sort_order)
    VALUES (g3_id, E'6. Expression orale\nL''élève s''exprime avec aisance, précision et un vocabulaire riche et adapté au contexte.', NULL, 6) RETURNING id INTO c6;

  INSERT INTO eval_grid_cells (criterion_id, level_id, descriptor) VALUES
    (c1, lA, ''), (c1, lB, ''), (c1, lC, ''), (c1, lD, ''), (c1, lE, ''),
    (c2, lA, ''), (c2, lB, ''), (c2, lC, ''), (c2, lD, ''), (c2, lE, ''),
    (c3, lA, ''), (c3, lB, ''), (c3, lC, ''), (c3, lD, ''), (c3, lE, ''),
    (c4, lA, ''), (c4, lB, ''), (c4, lC, ''), (c4, lD, ''), (c4, lE, ''),
    (c5, lA, ''), (c5, lB, ''), (c5, lC, ''), (c5, lD, ''), (c5, lE, ''),
    (c6, lA, ''), (c6, lB, ''), (c6, lC, ''), (c6, lD, ''), (c6, lE, '');

END $$;
