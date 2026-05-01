-- ============================================================
-- PLANIPROF -- Seed: Eval Grid – Interacts Orally, English Cycle 2
-- ============================================================

DO $$
DECLARE
  grid_id uuid;
  en_id int;
  p3 int; p4 int;
  lA int; lB int; lC int; lD int; lE int;
  c1 uuid; c2 uuid; c3 uuid; c4 uuid; c5 uuid; c6 uuid;
BEGIN

  SELECT id INTO en_id FROM subjects WHERE slug = 'anglais';
  SELECT id INTO p3 FROM grade_levels WHERE education_level = 'primaire' AND grade = 3;
  SELECT id INTO p4 FROM grade_levels WHERE education_level = 'primaire' AND grade = 4;

  INSERT INTO eval_grids (title, subject_id, cycle_label, source, is_baseline, competency)
    VALUES (
      'Evaluation Grid – Interacts Orally (English – Cycle 2)',
      en_id,
      '2e cycle du primaire',
      'Planiprof',
      true,
      'Interacts orally in English'
    )
    RETURNING id INTO grid_id;

  INSERT INTO eval_grid_grades VALUES (grid_id, p3), (grid_id, p4);

  INSERT INTO eval_grid_levels (grid_id, code, label, sort_order) VALUES (grid_id, 'A', 'Excellent',        1) RETURNING id INTO lA;
  INSERT INTO eval_grid_levels (grid_id, code, label, sort_order) VALUES (grid_id, 'B', 'Très bien',        2) RETURNING id INTO lB;
  INSERT INTO eval_grid_levels (grid_id, code, label, sort_order) VALUES (grid_id, 'C', 'Acceptable',       3) RETURNING id INTO lC;
  INSERT INTO eval_grid_levels (grid_id, code, label, sort_order) VALUES (grid_id, 'D', 'Peu satisfaisant', 4) RETURNING id INTO lD;
  INSERT INTO eval_grid_levels (grid_id, code, label, sort_order) VALUES (grid_id, 'E', 'Insuffisant',      5) RETURNING id INTO lE;

  INSERT INTO eval_grid_criteria (grid_id, label, sort_order) VALUES (grid_id, 'Participates actively in oral activities',                          1) RETURNING id INTO c1;
  INSERT INTO eval_grid_criteria (grid_id, label, sort_order) VALUES (grid_id, 'Uses a range of vocabulary and expressions',                       2) RETURNING id INTO c2;
  INSERT INTO eval_grid_criteria (grid_id, label, sort_order) VALUES (grid_id, 'Shows understanding of oral messages',                            3) RETURNING id INTO c3;
  INSERT INTO eval_grid_criteria (grid_id, label, sort_order) VALUES (grid_id, 'Maintains a simple conversation',                                 4) RETURNING id INTO c4;
  INSERT INTO eval_grid_criteria (grid_id, label, sort_order) VALUES (grid_id, 'Uses communication strategies effectively',                       5) RETURNING id INTO c5;
  INSERT INTO eval_grid_criteria (grid_id, label, sort_order) VALUES (grid_id, 'Respects conventions of spoken interaction',                     6) RETURNING id INTO c6;

  INSERT INTO eval_grid_cells (criterion_id, level_id, descriptor) VALUES
    (c1, lA, 'Participates actively and with confidence in all oral activities; initiates and sustains interactions spontaneously.'),
    (c1, lB, 'Participates actively; occasional hesitations but generally engaged.'),
    (c1, lC, 'Participates adequately; may need encouragement in some activities.'),
    (c1, lD, 'Participation limited or inconsistent; rarely initiates.'),
    (c1, lE, 'Does not participate or refuses to engage.'),

    (c2, lA, 'Uses a varied and accurate range of vocabulary and expressions appropriate to the context.'),
    (c2, lB, 'Uses a good range of vocabulary; occasional inaccuracies.'),
    (c2, lC, 'Uses adequate vocabulary; limited variety; some repetition.'),
    (c2, lD, 'Limited vocabulary; errors interfere with communication.'),
    (c2, lE, 'Vocabulary insufficient for basic communication.'),

    (c3, lA, 'Demonstrates clear and consistent understanding of varied oral messages; responds accurately.'),
    (c3, lB, 'Understands most oral messages; minor misunderstandings.'),
    (c3, lC, 'Shows partial understanding; needs some repetition or support.'),
    (c3, lD, 'Limited understanding; frequently misunderstands.'),
    (c3, lE, 'Does not demonstrate understanding of oral messages.'),

    (c4, lA, 'Maintains a simple conversation fluently; responds relevantly and asks follow-up questions.'),
    (c4, lB, 'Maintains a conversation adequately; occasional breakdowns.'),
    (c4, lC, 'Can maintain a brief conversation with support.'),
    (c4, lD, 'Difficulty maintaining a conversation; frequent breakdowns.'),
    (c4, lE, 'Cannot maintain a conversation in English.'),

    (c5, lA, 'Uses a variety of strategies effectively and independently to maintain communication.'),
    (c5, lB, 'Uses strategies adequately; generally maintains communication.'),
    (c5, lC, 'Uses basic strategies with some prompting.'),
    (c5, lD, 'Rarely uses strategies; communication often breaks down.'),
    (c5, lE, 'Does not use communication strategies.'),

    (c6, lA, 'Consistently respects interaction conventions (turn-taking, active listening, polite exchanges).'),
    (c6, lB, 'Generally respects conventions; minor lapses.'),
    (c6, lC, 'Respects basic conventions with occasional reminders.'),
    (c6, lD, 'Frequently disregards conventions; disrupts exchanges.'),
    (c6, lE, 'Does not respect conventions of spoken interaction.');

END $$;
