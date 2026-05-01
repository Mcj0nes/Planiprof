-- ============================================================
-- PLANIPROF -- Seed: Eval Grid – Reinvests Understanding of Texts, English Cycle 3
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
      'Evaluation Grid – Reinvests Understanding of Texts (English – Cycle 3)',
      en_id,
      '3e cycle du primaire',
      'Planiprof',
      true,
      'Reinvests understanding of texts'
    )
    RETURNING id INTO grid_id;

  INSERT INTO eval_grid_grades VALUES (grid_id, p5), (grid_id, p6);

  INSERT INTO eval_grid_levels (grid_id, code, label, sort_order) VALUES (grid_id, 'A', 'Excellent',        1) RETURNING id INTO lA;
  INSERT INTO eval_grid_levels (grid_id, code, label, sort_order) VALUES (grid_id, 'B', 'Très bien',        2) RETURNING id INTO lB;
  INSERT INTO eval_grid_levels (grid_id, code, label, sort_order) VALUES (grid_id, 'C', 'Acceptable',       3) RETURNING id INTO lC;
  INSERT INTO eval_grid_levels (grid_id, code, label, sort_order) VALUES (grid_id, 'D', 'Peu satisfaisant', 4) RETURNING id INTO lD;
  INSERT INTO eval_grid_levels (grid_id, code, label, sort_order) VALUES (grid_id, 'E', 'Insuffisant',      5) RETURNING id INTO lE;

  INSERT INTO eval_grid_criteria (grid_id, label, sort_order) VALUES (grid_id, 'Demonstrates clear and detailed understanding of the text',             1) RETURNING id INTO c1;
  INSERT INTO eval_grid_criteria (grid_id, label, sort_order) VALUES (grid_id, 'Identifies main ideas, details, and makes inferences',                  2) RETURNING id INTO c2;
  INSERT INTO eval_grid_criteria (grid_id, label, sort_order) VALUES (grid_id, 'Makes critical connections (self, world, other texts)',                  3) RETURNING id INTO c3;
  INSERT INTO eval_grid_criteria (grid_id, label, sort_order) VALUES (grid_id, 'Reinvests understanding creatively and accurately in a task',            4) RETURNING id INTO c4;
  INSERT INTO eval_grid_criteria (grid_id, label, sort_order) VALUES (grid_id, 'Uses and expands vocabulary drawn from the text',                       5) RETURNING id INTO c5;
  INSERT INTO eval_grid_criteria (grid_id, label, sort_order) VALUES (grid_id, 'Demonstrates critical appreciation of texts and reading strategies',    6) RETURNING id INTO c6;

  INSERT INTO eval_grid_cells (criterion_id, level_id, descriptor) VALUES
    (c1, lA, 'Demonstrates thorough, nuanced understanding of explicit and implicit meaning; interprets complex ideas accurately.'),
    (c1, lB, 'Demonstrates good, detailed understanding; minor misreadings that do not affect overall interpretation.'),
    (c1, lC, 'Shows adequate understanding of the main message and most key ideas; some implicit meaning missed.'),
    (c1, lD, 'Partial understanding; misses key details or misinterprets important elements.'),
    (c1, lE, 'Does not demonstrate understanding of the text.'),

    (c2, lA, 'Accurately identifies all main ideas, supporting details, and makes well-supported, insightful inferences.'),
    (c2, lB, 'Identifies main ideas and key details; makes reasonable inferences; minor omissions.'),
    (c2, lC, 'Identifies the main ideas; some details missed; inferences basic or partially supported.'),
    (c2, lD, 'Has difficulty distinguishing main ideas from details; inferences unsupported or missing.'),
    (c2, lE, 'Cannot identify main ideas, details, or make inferences.'),

    (c3, lA, 'Makes perceptive, well-developed critical connections to self, the world, and other texts; deepens interpretation.'),
    (c3, lB, 'Makes relevant and developed connections; mostly supported by the text.'),
    (c3, lC, 'Makes connections of varying relevance; limited development or critical thinking.'),
    (c3, lD, 'Attempts connections but they are superficial, vague, or poorly linked to the text.'),
    (c3, lE, 'Does not make connections or demonstrates no critical engagement with the text.'),

    (c4, lA, 'Reinvests understanding with creativity, accuracy, and depth; product demonstrates sophisticated text comprehension.'),
    (c4, lB, 'Reinvests understanding accurately and with some creativity; product clearly reflects comprehension.'),
    (c4, lC, 'Reinvests basic understanding adequately; task product partially reflects the text.'),
    (c4, lD, 'Reinvestment limited, inaccurate, or superficial; minimal connection to the text in the product.'),
    (c4, lE, 'Does not reinvest understanding; task product unrelated to the text.'),

    (c5, lA, 'Uses and accurately extends vocabulary from the text; explores word relationships and contextual meaning.'),
    (c5, lB, 'Uses vocabulary from the text correctly and in varied contexts; minor errors.'),
    (c5, lC, 'Uses some vocabulary from the text; limited expansion or occasional inaccuracies.'),
    (c5, lD, 'Rarely uses vocabulary from the text; relies mainly on basic, known words.'),
    (c5, lE, 'Does not use vocabulary from the text.'),

    (c6, lA, 'Demonstrates strong critical appreciation; evaluates text choices, identifies author''s purpose, and reflects on strategies used.'),
    (c6, lB, 'Shows good critical appreciation; comments on text features and identifies some strategies used.'),
    (c6, lC, 'Shows basic appreciation; identifies obvious text features; limited reflection on strategies.'),
    (c6, lD, 'Limited critical appreciation; struggles to identify text features or reflect on reading process.'),
    (c6, lE, 'Does not demonstrate critical appreciation of texts.');

END $$;
