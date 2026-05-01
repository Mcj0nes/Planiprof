-- ============================================================
-- PLANIPROF -- Seed: Grille d'évaluation – Interagir, Éducation physique 1er cycle
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
      'Grille d''évaluation – Compétence : Interagir (Éducation physique – 1er cycle)',
      eps_id,
      '1er cycle du primaire',
      'Planiprof',
      true,
      'Interagir dans divers contextes de pratique d''activités physiques'
    )
    RETURNING id INTO grid_id;

  INSERT INTO eval_grid_grades VALUES (grid_id, p1), (grid_id, p2);

  INSERT INTO eval_grid_levels (grid_id, code, label, sort_order) VALUES (grid_id, 'A', 'Excellent',        1) RETURNING id INTO lA;
  INSERT INTO eval_grid_levels (grid_id, code, label, sort_order) VALUES (grid_id, 'B', 'Très bien',        2) RETURNING id INTO lB;
  INSERT INTO eval_grid_levels (grid_id, code, label, sort_order) VALUES (grid_id, 'C', 'Acceptable',       3) RETURNING id INTO lC;
  INSERT INTO eval_grid_levels (grid_id, code, label, sort_order) VALUES (grid_id, 'D', 'Peu satisfaisant', 4) RETURNING id INTO lD;
  INSERT INTO eval_grid_levels (grid_id, code, label, sort_order) VALUES (grid_id, 'E', 'Insuffisant',      5) RETURNING id INTO lE;

  INSERT INTO eval_grid_criteria (grid_id, label, sort_order) VALUES (grid_id, 'Coopérer avec ses camarades',                        1) RETURNING id INTO c1;
  INSERT INTO eval_grid_criteria (grid_id, label, sort_order) VALUES (grid_id, 'Respecter les règles du jeu',                        2) RETURNING id INTO c2;
  INSERT INTO eval_grid_criteria (grid_id, label, sort_order) VALUES (grid_id, 'Communiquer avec les autres',                        3) RETURNING id INTO c3;
  INSERT INTO eval_grid_criteria (grid_id, label, sort_order) VALUES (grid_id, 'Prendre en compte les besoins des autres',           4) RETURNING id INTO c4;
  INSERT INTO eval_grid_criteria (grid_id, label, sort_order) VALUES (grid_id, 'Participer activement aux activités collectives',    5) RETURNING id INTO c5;

  INSERT INTO eval_grid_cells (criterion_id, level_id, descriptor) VALUES
    (c1, lA, 'Coopère avec enthousiasme; aide ses camarades et contribue positivement au groupe.'),
    (c1, lB, 'Coopère bien; participe au groupe avec quelques hésitations.'),
    (c1, lC, 'Coopère de façon inégale; a besoin de rappels.'),
    (c1, lD, 'Difficulté à coopérer; comportements parfois perturbateurs.'),
    (c1, lE, 'Refuse de coopérer ou comportements très perturbateurs.'),

    (c2, lA, 'Respecte toutes les règles; comprend leur importance et les applique spontanément.'),
    (c2, lB, 'Respecte la plupart des règles; quelques oublis mineurs.'),
    (c2, lC, 'Respecte les règles essentielles; a besoin de rappels.'),
    (c2, lD, 'Difficulté à respecter les règles; infractions fréquentes.'),
    (c2, lE, 'Ne respecte pas les règles du jeu.'),

    (c3, lA, 'Communique clairement avec ses camarades; utilise des mots et des gestes appropriés.'),
    (c3, lB, 'Communique adéquatement; quelques difficultés dans des situations complexes.'),
    (c3, lC, 'Communication présente mais limitée; a besoin d''encouragement.'),
    (c3, lD, 'Difficulté à communiquer avec les autres pendant les activités.'),
    (c3, lE, 'Ne communique pas ou de façon inappropriée.'),

    (c4, lA, 'Tient compte des besoins des autres spontanément; fait preuve d''empathie et d''inclusion.'),
    (c4, lB, 'Tient compte des autres avec quelques rappels.'),
    (c4, lC, 'Considération partielle des besoins des autres.'),
    (c4, lD, 'Peu attentif aux besoins des autres; comportements parfois exclusifs.'),
    (c4, lE, 'Ne tient pas compte des autres.'),

    (c5, lA, 'Participe activement et avec enthousiasme; s''investit pleinement dans les activités collectives.'),
    (c5, lB, 'Participe bien; quelques moments de retrait.'),
    (c5, lC, 'Participation inégale; s''implique selon les activités.'),
    (c5, lD, 'Participation minimale; souvent en retrait.'),
    (c5, lE, 'Refuse de participer aux activités collectives.');

END $$;
