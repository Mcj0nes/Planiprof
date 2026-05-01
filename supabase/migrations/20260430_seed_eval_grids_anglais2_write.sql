-- ============================================================
-- PLANIPROF -- Seed: Eval Grid – Writes Texts, English Cycle 2
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
      'Evaluation Grid – Writes Texts (English – Cycle 2)',
      en_id,
      '2e cycle du primaire',
      'Planiprof',
      true,
      'Writes texts'
    )
    RETURNING id INTO grid_id;

  INSERT INTO eval_grid_grades VALUES (grid_id, p3), (grid_id, p4);

  INSERT INTO eval_grid_levels (grid_id, code, label, sort_order) VALUES (grid_id, 'A', 'Excellent',        1) RETURNING id INTO lA;
  INSERT INTO eval_grid_levels (grid_id, code, label, sort_order) VALUES (grid_id, 'B', 'Très bien',        2) RETURNING id INTO lB;
  INSERT INTO eval_grid_levels (grid_id, code, label, sort_order) VALUES (grid_id, 'C', 'Acceptable',       3) RETURNING id INTO lC;
  INSERT INTO eval_grid_levels (grid_id, code, label, sort_order) VALUES (grid_id, 'D', 'Peu satisfaisant', 4) RETURNING id INTO lD;
  INSERT INTO eval_grid_levels (grid_id, code, label, sort_order) VALUES (grid_id, 'E', 'Insuffisant',      5) RETURNING id INTO lE;

  INSERT INTO eval_grid_criteria (grid_id, label, sort_order) VALUES (grid_id, 'Produces a written text with a clear purpose',                         1) RETURNING id INTO c1;
  INSERT INTO eval_grid_criteria (grid_id, label, sort_order) VALUES (grid_id, 'Uses familiar vocabulary and basic structures correctly',               2) RETURNING id INTO c2;
  INSERT INTO eval_grid_criteria (grid_id, label, sort_order) VALUES (grid_id, 'Organizes ideas with a beginning, middle, and end',                    3) RETURNING id INTO c3;
  INSERT INTO eval_grid_criteria (grid_id, label, sort_order) VALUES (grid_id, 'Applies basic conventions of written English',                         4) RETURNING id INTO c4;
  INSERT INTO eval_grid_criteria (grid_id, label, sort_order) VALUES (grid_id, 'Uses the writing process (planning, drafting, revising)',              5) RETURNING id INTO c5;
  INSERT INTO eval_grid_criteria (grid_id, label, sort_order) VALUES (grid_id, 'Reinvests learned vocabulary and language patterns',                   6) RETURNING id INTO c6;

  INSERT INTO eval_grid_cells (criterion_id, level_id, descriptor) VALUES
    (c1, lA, 'Text has a clear, consistent purpose; fully responds to the task; meaning is conveyed effectively throughout.'),
    (c1, lB, 'Text purpose is clear; generally responds to the task; meaning conveyed with minor lapses.'),
    (c1, lC, 'Text has a recognizable purpose; partially responds to the task; some ideas unclear.'),
    (c1, lD, 'Purpose unclear or inconsistent; limited response to the task.'),
    (c1, lE, 'No recognizable purpose; does not respond to the writing task.'),

    (c2, lA, 'Uses familiar vocabulary and basic structures accurately and with variety; language enhances meaning.'),
    (c2, lB, 'Uses vocabulary and structures correctly with minor errors that do not impede meaning.'),
    (c2, lC, 'Uses adequate vocabulary and simple structures; some errors that occasionally impede meaning.'),
    (c2, lD, 'Limited vocabulary and structures; frequent errors that impede communication.'),
    (c2, lE, 'Vocabulary and structures insufficient; text largely incomprehensible.'),

    (c3, lA, 'Text is clearly organized with a strong beginning, developed middle, and satisfying conclusion; ideas flow logically.'),
    (c3, lB, 'Text is well organized; beginning, middle, and end present; transitions mostly logical.'),
    (c3, lC, 'Basic organization present; beginning, middle, and end identifiable but development limited.'),
    (c3, lD, 'Organization weak; ideas difficult to follow; structure unclear.'),
    (c3, lE, 'No discernible organization; text is fragmented or incoherent.'),

    (c4, lA, 'Consistently applies conventions (capitalization, punctuation, spelling); text is clean and polished.'),
    (c4, lB, 'Applies most conventions correctly; minor errors that do not interfere with reading.'),
    (c4, lC, 'Applies basic conventions with some errors; readability occasionally affected.'),
    (c4, lD, 'Frequent convention errors; readability often impaired.'),
    (c4, lE, 'Conventions largely absent or incorrect; text very difficult to read.'),

    (c5, lA, 'Uses the writing process fully and effectively; revisions clearly improve the final text.'),
    (c5, lB, 'Uses the writing process adequately; revisions made with mostly positive results.'),
    (c5, lC, 'Uses some steps of the writing process; limited revision or planning visible.'),
    (c5, lD, 'Writing process minimally applied; little evidence of planning or revision.'),
    (c5, lE, 'Does not use the writing process; no planning or revision evident.'),

    (c6, lA, 'Accurately and creatively reinvests a wide range of learned vocabulary and language patterns from the course.'),
    (c6, lB, 'Reinvests learned vocabulary and patterns correctly; good range.'),
    (c6, lC, 'Reinvests some learned vocabulary and patterns; limited range or occasional inaccuracies.'),
    (c6, lD, 'Minimal reinvestment of learned language; relies on very basic known words.'),
    (c6, lE, 'Does not reinvest learned vocabulary or language patterns.');

END $$;
