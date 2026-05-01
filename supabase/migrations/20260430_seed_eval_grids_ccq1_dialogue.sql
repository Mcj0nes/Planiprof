-- ============================================================
-- PLANIPROF -- Seed: Grille d'évaluation – Pratiquer le dialogue, CCQ 1er cycle
-- ============================================================

DO $$
DECLARE
  grid_id uuid;
  ccq_id int;
  p1 int; p2 int;
  lA int; lB int; lC int; lD int; lE int;
  c1 uuid; c2 uuid; c3 uuid; c4 uuid; c5 uuid;
BEGIN

  SELECT id INTO ccq_id FROM subjects WHERE slug = 'culture-citoyennete-quebecoise';
  SELECT id INTO p1 FROM grade_levels WHERE education_level = 'primaire' AND grade = 1;
  SELECT id INTO p2 FROM grade_levels WHERE education_level = 'primaire' AND grade = 2;

  INSERT INTO eval_grids (title, subject_id, cycle_label, source, is_baseline, competency)
    VALUES (
      'Grille d''évaluation – Compétence : Pratiquer le dialogue (CCQ – 1er cycle)',
      ccq_id,
      '1er cycle du primaire',
      'Planiprof',
      true,
      'Pratiquer le dialogue'
    )
    RETURNING id INTO grid_id;

  INSERT INTO eval_grid_grades VALUES (grid_id, p1), (grid_id, p2);

  INSERT INTO eval_grid_levels (grid_id, code, label, sort_order) VALUES (grid_id, 'A', 'Excellent',        1) RETURNING id INTO lA;
  INSERT INTO eval_grid_levels (grid_id, code, label, sort_order) VALUES (grid_id, 'B', 'Très bien',        2) RETURNING id INTO lB;
  INSERT INTO eval_grid_levels (grid_id, code, label, sort_order) VALUES (grid_id, 'C', 'Acceptable',       3) RETURNING id INTO lC;
  INSERT INTO eval_grid_levels (grid_id, code, label, sort_order) VALUES (grid_id, 'D', 'Peu satisfaisant', 4) RETURNING id INTO lD;
  INSERT INTO eval_grid_levels (grid_id, code, label, sort_order) VALUES (grid_id, 'E', 'Insuffisant',      5) RETURNING id INTO lE;

  INSERT INTO eval_grid_criteria (grid_id, label, sort_order) VALUES (grid_id, 'Exprimer son point de vue simplement',                  1) RETURNING id INTO c1;
  INSERT INTO eval_grid_criteria (grid_id, label, sort_order) VALUES (grid_id, 'Écouter les autres sans interrompre',                   2) RETURNING id INTO c2;
  INSERT INTO eval_grid_criteria (grid_id, label, sort_order) VALUES (grid_id, 'Respecter les règles de base du dialogue',              3) RETURNING id INTO c3;
  INSERT INTO eval_grid_criteria (grid_id, label, sort_order) VALUES (grid_id, 'Reconnaître le point de vue d''un camarade',            4) RETURNING id INTO c4;
  INSERT INTO eval_grid_criteria (grid_id, label, sort_order) VALUES (grid_id, 'Participer activement à l''échange',                   5) RETURNING id INTO c5;

  INSERT INTO eval_grid_cells (criterion_id, level_id, descriptor) VALUES
    (c1, lA, 'Exprime son point de vue clairement avec une raison simple; utilise des mots appropriés.'),
    (c1, lB, 'Exprime son point de vue simplement; justification partielle.'),
    (c1, lC, 'Exprime son point de vue sans justification.'),
    (c1, lD, 'Point de vue difficile à comprendre ou hors sujet.'),
    (c1, lE, 'N''exprime pas son point de vue.'),

    (c2, lA, 'Écoute attentivement sans interrompre; montre des signes d''écoute active (regard, hochement de tête).'),
    (c2, lB, 'Écoute généralement bien; quelques interruptions.'),
    (c2, lC, 'Écoute de façon inégale; interrompt parfois.'),
    (c2, lD, 'Difficulté à écouter; interrompt souvent.'),
    (c2, lE, 'N''écoute pas ou refuse de participer à l''écoute.'),

    (c3, lA, 'Respecte toutes les règles du dialogue (lever la main, attendre son tour, parler à son tour).'),
    (c3, lB, 'Respecte la plupart des règles; quelques oublis mineurs.'),
    (c3, lC, 'Respecte quelques règles; a besoin de rappels.'),
    (c3, lD, 'Difficulté à respecter les règles; a besoin de beaucoup d''aide.'),
    (c3, lE, 'Ne respecte pas les règles du dialogue.'),

    (c4, lA, 'Reconnaît et reformule simplement le point de vue d''un camarade.'),
    (c4, lB, 'Reconnaît le point de vue d''un camarade; reformulation partielle.'),
    (c4, lC, 'Évoque le point de vue de l''autre sans vraiment le reconnaître.'),
    (c4, lD, 'Reconnaissance limitée ou hors sujet.'),
    (c4, lE, 'Ne tient pas compte du point de vue des autres.'),

    (c5, lA, 'Participe activement et avec enthousiasme; contributions pertinentes et régulières.'),
    (c5, lB, 'Participe bien; quelques moments d''hésitation.'),
    (c5, lC, 'Participe, mais de façon inégale.'),
    (c5, lD, 'Participation minimale ou hésitante.'),
    (c5, lE, 'Ne participe pas ou refuse de participer.');

END $$;
