-- ============================================================
-- PLANIPROF -- Seed: Eval Grid – Interacts Orally, English Cycle 3
-- ============================================================

DO $$
DECLARE
  grid_id uuid;
  en_id int;
  p5 int; p6 int;
  lA int; lB int; lC int; lD int; lE int;
  c1 uuid; c2 uuid; c3 uuid; c4 uuid; c5 uuid; c6 uuid;
BEGIN

  SELECT id INTO en_id FROM subjects WHERE slug = 'anglais';
  SELECT id INTO p5 FROM grade_levels WHERE education_level = 'primaire' AND grade = 5;
  SELECT id INTO p6 FROM grade_levels WHERE education_level = 'primaire' AND grade = 6;

  INSERT INTO eval_grids (title, subject_id, cycle_label, source, is_baseline, competency)
    VALUES (
      'Evaluation Grid – Interacts Orally (English – Cycle 3)',
      en_id,
      '3e cycle du primaire',
      'Planiprof',
      true,
      'Interacts orally in English'
    )
    RETURNING id INTO grid_id;

  INSERT INTO eval_grid_grades VALUES (grid_id, p5), (grid_id, p6);

  INSERT INTO eval_grid_levels (grid_id, code, label, sort_order) VALUES (grid_id, 'A', 'Excellent',        1) RETURNING id INTO lA;
  INSERT INTO eval_grid_levels (grid_id, code, label, sort_order) VALUES (grid_id, 'B', 'Très bien',        2) RETURNING id INTO lB;
  INSERT INTO eval_grid_levels (grid_id, code, label, sort_order) VALUES (grid_id, 'C', 'Acceptable',       3) RETURNING id INTO lC;
  INSERT INTO eval_grid_levels (grid_id, code, label, sort_order) VALUES (grid_id, 'D', 'Peu satisfaisant', 4) RETURNING id INTO lD;
  INSERT INTO eval_grid_levels (grid_id, code, label, sort_order) VALUES (grid_id, 'E', 'Insuffisant',      5) RETURNING id INTO lE;

  INSERT INTO eval_grid_criteria (grid_id, label, sort_order) VALUES (grid_id, 'Participates actively and spontaneously in oral activities',            1) RETURNING id INTO c1;
  INSERT INTO eval_grid_criteria (grid_id, label, sort_order) VALUES (grid_id, 'Uses varied vocabulary, expressions, and language structures',          2) RETURNING id INTO c2;
  INSERT INTO eval_grid_criteria (grid_id, label, sort_order) VALUES (grid_id, 'Demonstrates understanding of varied oral messages',                    3) RETURNING id INTO c3;
  INSERT INTO eval_grid_criteria (grid_id, label, sort_order) VALUES (grid_id, 'Maintains and develops a conversation',                                 4) RETURNING id INTO c4;
  INSERT INTO eval_grid_criteria (grid_id, label, sort_order) VALUES (grid_id, 'Uses communication strategies flexibly and independently',              5) RETURNING id INTO c5;
  INSERT INTO eval_grid_criteria (grid_id, label, sort_order) VALUES (grid_id, 'Adapts language and tone to context and audience',                      6) RETURNING id INTO c6;

  INSERT INTO eval_grid_cells (criterion_id, level_id, descriptor) VALUES
    (c1, lA, 'Participates spontaneously and with confidence in all oral activities; initiates, sustains, and redirects interactions independently.'),
    (c1, lB, 'Participates actively and consistently; occasional hesitations but fully engaged.'),
    (c1, lC, 'Participates adequately; may need some encouragement to initiate or sustain interaction.'),
    (c1, lD, 'Participation limited or passive; rarely initiates and often relies on prompting.'),
    (c1, lE, 'Does not participate or refuses to engage in oral activities.'),

    (c2, lA, 'Uses a rich and varied range of vocabulary, idiomatic expressions, and structures accurately and appropriately.'),
    (c2, lB, 'Uses a good range of vocabulary and structures; occasional inaccuracies that do not impede communication.'),
    (c2, lC, 'Uses adequate vocabulary and basic structures; limited variety; some repetition.'),
    (c2, lD, 'Limited vocabulary and restricted structures; errors frequently impede communication.'),
    (c2, lE, 'Vocabulary and structures insufficient for basic communication.'),

    (c3, lA, 'Demonstrates clear, consistent understanding of varied and complex oral messages; responds accurately and with nuance.'),
    (c3, lB, 'Understands most oral messages, including less familiar content; minor misunderstandings.'),
    (c3, lC, 'Understands main ideas; may miss details or need occasional repetition.'),
    (c3, lD, 'Limited understanding; frequently misunderstands or requires significant support.'),
    (c3, lE, 'Does not demonstrate understanding of oral messages.'),

    (c4, lA, 'Maintains and develops a conversation fluently; elaborates, asks relevant questions, and responds with detail.'),
    (c4, lB, 'Maintains a conversation well; develops ideas adequately; occasional breakdowns quickly repaired.'),
    (c4, lC, 'Can maintain a conversation on familiar topics with some support; limited development.'),
    (c4, lD, 'Difficulty maintaining a conversation; frequent breakdowns; minimal development of ideas.'),
    (c4, lE, 'Cannot maintain a conversation in English.'),

    (c5, lA, 'Uses a wide variety of strategies flexibly and independently (paraphrasing, circumlocution, clarification requests) to ensure communication.'),
    (c5, lB, 'Uses strategies effectively; adapts approach when communication breaks down.'),
    (c5, lC, 'Uses basic strategies with some prompting; partially effective.'),
    (c5, lD, 'Rarely uses strategies; communication breaks down without teacher support.'),
    (c5, lE, 'Does not use communication strategies.'),

    (c6, lA, 'Consistently adapts language, register, and tone to the context and audience with ease and appropriateness.'),
    (c6, lB, 'Adapts language and tone appropriately in most situations; minor lapses.'),
    (c6, lC, 'Shows some awareness of context and audience; adaptation partial or inconsistent.'),
    (c6, lD, 'Little adaptation to context or audience; register often inappropriate.'),
    (c6, lE, 'No adaptation; language and tone unsuited to the situation.');

END $$;
