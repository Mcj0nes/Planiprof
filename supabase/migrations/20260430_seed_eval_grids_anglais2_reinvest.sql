-- ============================================================
-- PLANIPROF -- Seed: Eval Grid – Reinvests Understanding of Texts, English Cycle 2
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
      'Evaluation Grid – Reinvests Understanding of Texts (English – Cycle 2)',
      en_id,
      '2e cycle du primaire',
      'Planiprof',
      true,
      'Reinvests understanding of texts'
    )
    RETURNING id INTO grid_id;

  INSERT INTO eval_grid_grades VALUES (grid_id, p3), (grid_id, p4);

  INSERT INTO eval_grid_levels (grid_id, code, label, sort_order) VALUES (grid_id, 'A', 'Excellent',        1) RETURNING id INTO lA;
  INSERT INTO eval_grid_levels (grid_id, code, label, sort_order) VALUES (grid_id, 'B', 'Très bien',        2) RETURNING id INTO lB;
  INSERT INTO eval_grid_levels (grid_id, code, label, sort_order) VALUES (grid_id, 'C', 'Acceptable',       3) RETURNING id INTO lC;
  INSERT INTO eval_grid_levels (grid_id, code, label, sort_order) VALUES (grid_id, 'D', 'Peu satisfaisant', 4) RETURNING id INTO lD;
  INSERT INTO eval_grid_levels (grid_id, code, label, sort_order) VALUES (grid_id, 'E', 'Insuffisant',      5) RETURNING id INTO lE;

  INSERT INTO eval_grid_criteria (grid_id, label, sort_order) VALUES (grid_id, 'Demonstrates understanding of the text',                               1) RETURNING id INTO c1;
  INSERT INTO eval_grid_criteria (grid_id, label, sort_order) VALUES (grid_id, 'Identifies main ideas and key information',                            2) RETURNING id INTO c2;
  INSERT INTO eval_grid_criteria (grid_id, label, sort_order) VALUES (grid_id, 'Makes connections (text to self, text to world)',                      3) RETURNING id INTO c3;
  INSERT INTO eval_grid_criteria (grid_id, label, sort_order) VALUES (grid_id, 'Reinvests understanding in a meaningful task',                         4) RETURNING id INTO c4;
  INSERT INTO eval_grid_criteria (grid_id, label, sort_order) VALUES (grid_id, 'Uses vocabulary drawn from the text',                                  5) RETURNING id INTO c5;
  INSERT INTO eval_grid_criteria (grid_id, label, sort_order) VALUES (grid_id, 'Engages with a variety of text types and formats',                     6) RETURNING id INTO c6;

  INSERT INTO eval_grid_cells (criterion_id, level_id, descriptor) VALUES
    (c1, lA, 'Demonstrates clear, accurate understanding of the text; identifies explicit and some implicit meaning without support.'),
    (c1, lB, 'Demonstrates good understanding; minor misinterpretations that do not affect overall comprehension.'),
    (c1, lC, 'Shows adequate understanding of the main message; some details missed or misunderstood.'),
    (c1, lD, 'Partial understanding; frequently misinterprets or misses key elements.'),
    (c1, lE, 'Does not demonstrate understanding of the text.'),

    (c2, lA, 'Accurately identifies all main ideas and key details; can distinguish essential from non-essential information.'),
    (c2, lB, 'Identifies most main ideas and key information; minor omissions.'),
    (c2, lC, 'Identifies the overall main idea; some key details missing.'),
    (c2, lD, 'Has difficulty identifying main ideas; often focuses on irrelevant details.'),
    (c2, lE, 'Cannot identify main ideas or key information.'),

    (c3, lA, 'Makes insightful, relevant connections to self and the world; enriches understanding of the text.'),
    (c3, lB, 'Makes relevant and clear connections; generally supported by the text.'),
    (c3, lC, 'Makes basic connections; limited development or relevance.'),
    (c3, lD, 'Attempts connections but they are superficial or poorly linked to the text.'),
    (c3, lE, 'Does not make connections to the text.'),

    (c4, lA, 'Reinvests understanding accurately, creatively, and completely in the task; product clearly reflects text comprehension.'),
    (c4, lB, 'Reinvests understanding well; task product reflects good comprehension with minor gaps.'),
    (c4, lC, 'Reinvests basic understanding; task product partially reflects the text.'),
    (c4, lD, 'Reinvestment limited or inaccurate; task product shows minimal connection to the text.'),
    (c4, lE, 'Does not reinvest understanding; task product unrelated to the text.'),

    (c5, lA, 'Uses a rich range of vocabulary from the text accurately and in appropriate contexts.'),
    (c5, lB, 'Uses vocabulary from the text correctly; occasional errors in usage.'),
    (c5, lC, 'Uses some vocabulary from the text; limited range or inaccurate usage.'),
    (c5, lD, 'Rarely uses vocabulary from the text; relies on very basic or known words only.'),
    (c5, lE, 'Does not use vocabulary from the text.'),

    (c6, lA, 'Engages confidently with varied text types; adjusts reading/viewing strategies according to format.'),
    (c6, lB, 'Engages well with different text types; minor difficulty with less familiar formats.'),
    (c6, lC, 'Engages adequately with familiar text types; limited flexibility with new formats.'),
    (c6, lD, 'Engages with difficulty; struggles with texts beyond simple, familiar formats.'),
    (c6, lE, 'Does not engage with the text types presented.');

END $$;
