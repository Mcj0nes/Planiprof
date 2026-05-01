-- ============================================================
-- PLANIPROF -- Seed: Eval Grid – Writes Texts, English Cycle 3
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
      'Evaluation Grid – Writes Texts (English – Cycle 3)',
      en_id,
      '3e cycle du primaire',
      'Planiprof',
      true,
      'Writes texts'
    )
    RETURNING id INTO grid_id;

  INSERT INTO eval_grid_grades VALUES (grid_id, p5), (grid_id, p6);

  INSERT INTO eval_grid_levels (grid_id, code, label, sort_order) VALUES (grid_id, 'A', 'Excellent',        1) RETURNING id INTO lA;
  INSERT INTO eval_grid_levels (grid_id, code, label, sort_order) VALUES (grid_id, 'B', 'Très bien',        2) RETURNING id INTO lB;
  INSERT INTO eval_grid_levels (grid_id, code, label, sort_order) VALUES (grid_id, 'C', 'Acceptable',       3) RETURNING id INTO lC;
  INSERT INTO eval_grid_levels (grid_id, code, label, sort_order) VALUES (grid_id, 'D', 'Peu satisfaisant', 4) RETURNING id INTO lD;
  INSERT INTO eval_grid_levels (grid_id, code, label, sort_order) VALUES (grid_id, 'E', 'Insuffisant',      5) RETURNING id INTO lE;

  INSERT INTO eval_grid_criteria (grid_id, label, sort_order) VALUES (grid_id, 'Produces a text with a clear purpose for a specific audience',          1) RETURNING id INTO c1;
  INSERT INTO eval_grid_criteria (grid_id, label, sort_order) VALUES (grid_id, 'Uses varied vocabulary and language structures accurately',              2) RETURNING id INTO c2;
  INSERT INTO eval_grid_criteria (grid_id, label, sort_order) VALUES (grid_id, 'Organizes and develops ideas logically and coherently',                  3) RETURNING id INTO c3;
  INSERT INTO eval_grid_criteria (grid_id, label, sort_order) VALUES (grid_id, 'Applies conventions of written English correctly',                       4) RETURNING id INTO c4;
  INSERT INTO eval_grid_criteria (grid_id, label, sort_order) VALUES (grid_id, 'Uses the writing process effectively',                                   5) RETURNING id INTO c5;
  INSERT INTO eval_grid_criteria (grid_id, label, sort_order) VALUES (grid_id, 'Demonstrates creativity and personal voice in writing',                  6) RETURNING id INTO c6;

  INSERT INTO eval_grid_cells (criterion_id, level_id, descriptor) VALUES
    (c1, lA, 'Text has a strong, consistent purpose clearly tailored to a specific audience; fully and compellingly responds to the task.'),
    (c1, lB, 'Text purpose and audience awareness are clear; responds well to the task with minor lapses.'),
    (c1, lC, 'Purpose and audience somewhat clear; response to the task adequate but not fully developed.'),
    (c1, lD, 'Purpose unclear or audience not considered; task only partially addressed.'),
    (c1, lE, 'No recognizable purpose or audience awareness; task not addressed.'),

    (c2, lA, 'Uses a rich, varied, and accurate range of vocabulary and complex structures; language is precise and effective.'),
    (c2, lB, 'Uses varied vocabulary and structures correctly; minor errors that do not impede meaning.'),
    (c2, lC, 'Uses adequate vocabulary; structures mostly simple; some errors that occasionally impede meaning.'),
    (c2, lD, 'Limited vocabulary and structures; frequent errors that impede communication.'),
    (c2, lE, 'Vocabulary and structures insufficient for the task; text largely incomprehensible.'),

    (c3, lA, 'Ideas are logically and coherently developed; text flows naturally with effective transitions and paragraphing.'),
    (c3, lB, 'Ideas are well organized and developed; transitions mostly effective; minor structural lapses.'),
    (c3, lC, 'Basic organization present; ideas developed to some extent; transitions limited or repetitive.'),
    (c3, lD, 'Organization weak; ideas underdeveloped or hard to follow; transitions absent or ineffective.'),
    (c3, lE, 'No discernible organization; ideas fragmented or incoherent.'),

    (c4, lA, 'Applies all conventions (grammar, punctuation, capitalization, spelling) consistently and accurately; text is polished.'),
    (c4, lB, 'Applies conventions correctly in most cases; minor errors that do not interfere with reading.'),
    (c4, lC, 'Applies basic conventions with some errors; readability occasionally affected.'),
    (c4, lD, 'Frequent convention errors; readability often impaired.'),
    (c4, lE, 'Conventions largely absent or incorrect; text very difficult to read.'),

    (c5, lA, 'Uses all stages of the writing process thoroughly and effectively; revisions and editing demonstrably improve the text.'),
    (c5, lB, 'Uses the writing process well; evidence of planning, drafting, and revision with positive results.'),
    (c5, lC, 'Uses some stages of the writing process; revision present but limited in scope or effectiveness.'),
    (c5, lD, 'Writing process minimally applied; little evidence of planning, revision, or editing.'),
    (c5, lE, 'Does not use the writing process; no planning, revision, or editing evident.'),

    (c6, lA, 'Writing is highly creative with a distinctive personal voice; original ideas and engaging style throughout.'),
    (c6, lB, 'Writing shows creativity and a developing personal voice; some original and engaging elements.'),
    (c6, lC, 'Some creativity evident; personal voice emerging but inconsistent.'),
    (c6, lD, 'Little creativity or personal voice; writing feels formulaic or copied.'),
    (c6, lE, 'No creativity or personal voice; writing does not reflect individual expression.');

END $$;
