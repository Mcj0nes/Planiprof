-- ============================================================
-- PLANIPROF -- Seed: Eval Grid – Interacts Orally, English Cycle 1
-- ============================================================

DO $$
DECLARE
  grid_id uuid;
  en_id int;
  p1 int; p2 int;
  lA int; lB int; lC int; lD int; lE int;
  c1 uuid; c2 uuid; c3 uuid; c4 uuid; c5 uuid;
BEGIN

  SELECT id INTO en_id FROM subjects WHERE slug = 'anglais';
  SELECT id INTO p1 FROM grade_levels WHERE education_level = 'primaire' AND grade = 1;
  SELECT id INTO p2 FROM grade_levels WHERE education_level = 'primaire' AND grade = 2;

  INSERT INTO eval_grids (title, subject_id, cycle_label, source, is_baseline, competency)
    VALUES (
      'Evaluation Grid – Interacts Orally (English – Cycle 1)',
      en_id,
      '1er cycle du primaire',
      'Planiprof',
      true,
      'Interacts orally in English'
    )
    RETURNING id INTO grid_id;

  INSERT INTO eval_grid_grades VALUES (grid_id, p1), (grid_id, p2);

  INSERT INTO eval_grid_levels (grid_id, code, label, sort_order) VALUES (grid_id, 'A', 'Excellent',        1) RETURNING id INTO lA;
  INSERT INTO eval_grid_levels (grid_id, code, label, sort_order) VALUES (grid_id, 'B', 'Très bien',        2) RETURNING id INTO lB;
  INSERT INTO eval_grid_levels (grid_id, code, label, sort_order) VALUES (grid_id, 'C', 'Acceptable',       3) RETURNING id INTO lC;
  INSERT INTO eval_grid_levels (grid_id, code, label, sort_order) VALUES (grid_id, 'D', 'Peu satisfaisant', 4) RETURNING id INTO lD;
  INSERT INTO eval_grid_levels (grid_id, code, label, sort_order) VALUES (grid_id, 'E', 'Insuffisant',      5) RETURNING id INTO lE;

  INSERT INTO eval_grid_criteria (grid_id, label, sort_order) VALUES (grid_id, 'Participates in oral activities',                                  1) RETURNING id INTO c1;
  INSERT INTO eval_grid_criteria (grid_id, label, sort_order) VALUES (grid_id, 'Uses familiar words and expressions',                             2) RETURNING id INTO c2;
  INSERT INTO eval_grid_criteria (grid_id, label, sort_order) VALUES (grid_id, 'Shows understanding of simple spoken English',                    3) RETURNING id INTO c3;
  INSERT INTO eval_grid_criteria (grid_id, label, sort_order) VALUES (grid_id, 'Uses communication strategies (gestures, repetition, visuals)',   4) RETURNING id INTO c4;
  INSERT INTO eval_grid_criteria (grid_id, label, sort_order) VALUES (grid_id, 'Respects turn-taking conventions',                               5) RETURNING id INTO c5;

  INSERT INTO eval_grid_cells (criterion_id, level_id, descriptor) VALUES
    (c1, lA, 'Participates enthusiastically and consistently in all oral activities; engages willingly and spontaneously.'),
    (c1, lB, 'Participates well in oral activities; minor hesitations.'),
    (c1, lC, 'Participates in oral activities with some encouragement needed.'),
    (c1, lD, 'Participation minimal; reluctant or inconsistent.'),
    (c1, lE, 'Does not participate or refuses to engage in oral activities.'),

    (c2, lA, 'Uses a range of familiar words and expressions correctly and spontaneously.'),
    (c2, lB, 'Uses familiar words and expressions with minor errors.'),
    (c2, lC, 'Uses a limited set of familiar words and expressions; some inaccuracies.'),
    (c2, lD, 'Very limited vocabulary; frequent errors hinder communication.'),
    (c2, lE, 'Does not use English words or expressions.'),

    (c3, lA, 'Demonstrates clear understanding of simple spoken English; responds appropriately without prompting.'),
    (c3, lB, 'Understands most simple spoken English; minor misunderstandings.'),
    (c3, lC, 'Shows partial understanding; needs repetition or support.'),
    (c3, lD, 'Limited understanding; often misunderstands or does not respond.'),
    (c3, lE, 'Does not demonstrate understanding of spoken English.'),

    (c4, lA, 'Uses a variety of strategies effectively (gestures, visuals, repetition) to support communication.'),
    (c4, lB, 'Uses some strategies to support communication; generally effective.'),
    (c4, lC, 'Uses basic strategies with teacher prompting.'),
    (c4, lD, 'Rarely uses strategies; communication often breaks down.'),
    (c4, lE, 'Does not use communication strategies.'),

    (c5, lA, 'Consistently respects turn-taking; listens attentively to others.'),
    (c5, lB, 'Generally respects turn-taking; minor lapses.'),
    (c5, lC, 'Respects turn-taking with reminders.'),
    (c5, lD, 'Frequently interrupts or does not wait for turn.'),
    (c5, lE, 'Does not respect turn-taking conventions.');

END $$;
