-- ============================================================
-- PLANIPROF -- Seed: Grille d'évaluation – Agir, Éducation physique 1er cycle
-- ============================================================

DO $$
DECLARE
  grid_id uuid;
  eps_id int;
  p1 int; p2 int;
  lA int; lB int; lC int; lD int; lE int;
  c1 uuid; c2 uuid; c3 uuid; c4 uuid; c5 uuid;
BEGIN

  SELECT id INTO eps_id FROM subjects WHERE slug = 'educ-physique';
  SELECT id INTO p1 FROM grade_levels WHERE education_level = 'primaire' AND grade = 1;
  SELECT id INTO p2 FROM grade_levels WHERE education_level = 'primaire' AND grade = 2;

  INSERT INTO eval_grids (title, subject_id, cycle_label, source, is_baseline, competency)
    VALUES (
      'Grille d''évaluation – Compétence : Agir (Éducation physique – 1er cycle)',
      eps_id,
      '1er cycle du primaire',
      'Planiprof',
      true,
      'Agir dans divers contextes de pratique d''activités physiques'
    )
    RETURNING id INTO grid_id;

  INSERT INTO eval_grid_grades VALUES (grid_id, p1), (grid_id, p2);

  INSERT INTO eval_grid_levels (grid_id, code, label, sort_order) VALUES (grid_id, 'A', 'Excellent',        1) RETURNING id INTO lA;
  INSERT INTO eval_grid_levels (grid_id, code, label, sort_order) VALUES (grid_id, 'B', 'Très bien',        2) RETURNING id INTO lB;
  INSERT INTO eval_grid_levels (grid_id, code, label, sort_order) VALUES (grid_id, 'C', 'Acceptable',       3) RETURNING id INTO lC;
  INSERT INTO eval_grid_levels (grid_id, code, label, sort_order) VALUES (grid_id, 'D', 'Peu satisfaisant', 4) RETURNING id INTO lD;
  INSERT INTO eval_grid_levels (grid_id, code, label, sort_order) VALUES (grid_id, 'E', 'Insuffisant',      5) RETURNING id INTO lE;

  INSERT INTO eval_grid_criteria (grid_id, label, sort_order) VALUES (grid_id, 'Exécuter des habiletés motrices de base (locomotion, équilibre, manipulation)', 1) RETURNING id INTO c1;
  INSERT INTO eval_grid_criteria (grid_id, label, sort_order) VALUES (grid_id, 'Coordonner ses mouvements',                                                    2) RETURNING id INTO c2;
  INSERT INTO eval_grid_criteria (grid_id, label, sort_order) VALUES (grid_id, 'Adapter ses actions à l''environnement',                                       3) RETURNING id INTO c3;
  INSERT INTO eval_grid_criteria (grid_id, label, sort_order) VALUES (grid_id, 'Respecter les consignes de sécurité',                                          4) RETURNING id INTO c4;
  INSERT INTO eval_grid_criteria (grid_id, label, sort_order) VALUES (grid_id, 'Persévérer dans l''effort',                                                    5) RETURNING id INTO c5;

  INSERT INTO eval_grid_cells (criterion_id, level_id, descriptor) VALUES
    (c1, lA, 'Exécute les habiletés motrices de base avec aisance et précision; mouvements fluides et bien contrôlés.'),
    (c1, lB, 'Exécute les habiletés motrices de base correctement; quelques imprécisions mineures.'),
    (c1, lC, 'Exécute les habiletés motrices de base de façon fonctionnelle; maîtrise partielle.'),
    (c1, lD, 'Difficulté à exécuter certaines habiletés; a besoin de beaucoup d''aide.'),
    (c1, lE, 'Ne parvient pas à exécuter les habiletés motrices de base.'),

    (c2, lA, 'Coordonne ses mouvements avec fluidité et efficacité; enchaînements bien maîtrisés.'),
    (c2, lB, 'Coordination généralement bonne; quelques maladresses.'),
    (c2, lC, 'Coordination de base présente mais inégale.'),
    (c2, lD, 'Coordination faible; mouvements souvent désordonnés.'),
    (c2, lE, 'Coordination très limitée; mouvements non contrôlés.'),

    (c3, lA, 'Adapte ses actions à l''environnement avec aisance; réagit rapidement aux changements.'),
    (c3, lB, 'Adapte ses actions avec quelques hésitations; adaptation généralement adéquate.'),
    (c3, lC, 'Adapte ses actions de façon partielle; a besoin de rappels.'),
    (c3, lD, 'Difficulté à adapter ses actions; réponse souvent inadaptée.'),
    (c3, lE, 'Ne parvient pas à adapter ses actions à l''environnement.'),

    (c4, lA, 'Respecte toutes les consignes de sécurité; attitude exemplaire et responsable.'),
    (c4, lB, 'Respecte la plupart des consignes; quelques oublis mineurs.'),
    (c4, lC, 'Respecte les consignes essentielles; a besoin de rappels.'),
    (c4, lD, 'Difficulté à respecter les consignes; comportements parfois à risque.'),
    (c4, lE, 'Ne respecte pas les consignes de sécurité.'),

    (c5, lA, 'Persévère avec enthousiasme; s''engage pleinement dans toutes les activités.'),
    (c5, lB, 'Persévère bien; quelques moments d''hésitation.'),
    (c5, lC, 'Persévère de façon inégale; abandon parfois prématuré.'),
    (c5, lD, 'Peu de persévérance; abandonne facilement.'),
    (c5, lE, 'Aucune persévérance ou refus de participer.');

END $$;
