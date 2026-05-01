-- ============================================================
-- PLANIPROF -- Seed: Grille d'évaluation – Interagir, Éducation physique 2e cycle
-- ============================================================

DO $$
DECLARE
  grid_id uuid;
  eps_id int;
  p3 int; p4 int;
  lA int; lB int; lC int; lD int; lE int;
  c1 uuid; c2 uuid; c3 uuid; c4 uuid; c5 uuid; c6 uuid;
BEGIN

  SELECT id INTO eps_id FROM subjects WHERE slug = 'educ-physique';
  SELECT id INTO p3 FROM grade_levels WHERE education_level = 'primaire' AND grade = 3;
  SELECT id INTO p4 FROM grade_levels WHERE education_level = 'primaire' AND grade = 4;

  INSERT INTO eval_grids (title, subject_id, cycle_label, source, is_baseline, competency)
    VALUES (
      'Grille d''évaluation – Compétence : Interagir (Éducation physique – 2e cycle)',
      eps_id,
      '2e cycle du primaire',
      'Planiprof',
      true,
      'Interagir dans divers contextes de pratique d''activités physiques'
    )
    RETURNING id INTO grid_id;

  INSERT INTO eval_grid_grades VALUES (grid_id, p3), (grid_id, p4);

  INSERT INTO eval_grid_levels (grid_id, code, label, sort_order) VALUES (grid_id, 'A', 'Excellent',        1) RETURNING id INTO lA;
  INSERT INTO eval_grid_levels (grid_id, code, label, sort_order) VALUES (grid_id, 'B', 'Très bien',        2) RETURNING id INTO lB;
  INSERT INTO eval_grid_levels (grid_id, code, label, sort_order) VALUES (grid_id, 'C', 'Acceptable',       3) RETURNING id INTO lC;
  INSERT INTO eval_grid_levels (grid_id, code, label, sort_order) VALUES (grid_id, 'D', 'Peu satisfaisant', 4) RETURNING id INTO lD;
  INSERT INTO eval_grid_levels (grid_id, code, label, sort_order) VALUES (grid_id, 'E', 'Insuffisant',      5) RETURNING id INTO lE;

  INSERT INTO eval_grid_criteria (grid_id, label, sort_order) VALUES (grid_id, 'Coopérer efficacement dans des activités collectives',     1) RETURNING id INTO c1;
  INSERT INTO eval_grid_criteria (grid_id, label, sort_order) VALUES (grid_id, 'Respecter les règles et l''esprit sportif',               2) RETURNING id INTO c2;
  INSERT INTO eval_grid_criteria (grid_id, label, sort_order) VALUES (grid_id, 'Communiquer et s''organiser avec ses coéquipiers',        3) RETURNING id INTO c3;
  INSERT INTO eval_grid_criteria (grid_id, label, sort_order) VALUES (grid_id, 'Adopter des comportements d''équité',                    4) RETURNING id INTO c4;
  INSERT INTO eval_grid_criteria (grid_id, label, sort_order) VALUES (grid_id, 'Assumer différents rôles au sein du groupe',             5) RETURNING id INTO c5;
  INSERT INTO eval_grid_criteria (grid_id, label, sort_order) VALUES (grid_id, 'Gérer les conflits de façon constructive',               6) RETURNING id INTO c6;

  INSERT INTO eval_grid_cells (criterion_id, level_id, descriptor) VALUES
    (c1, lA, 'Coopère avec efficacité et enthousiasme; contribue activement au succès du groupe.'),
    (c1, lB, 'Coopère bien; contributions généralement pertinentes.'),
    (c1, lC, 'Coopère de façon inégale; participation variable.'),
    (c1, lD, 'Difficulté à coopérer; peu engagé dans le groupe.'),
    (c1, lE, 'Refuse de coopérer ou comportements nuisibles au groupe.'),

    (c2, lA, 'Respecte toutes les règles et démontre un excellent esprit sportif; attitude exemplaire en toutes circonstances.'),
    (c2, lB, 'Respecte les règles et fait preuve de bon esprit sportif; quelques manquements mineurs.'),
    (c2, lC, 'Respecte les règles essentielles; esprit sportif parfois défaillant.'),
    (c2, lD, 'Difficulté à respecter les règles ou à faire preuve d''esprit sportif.'),
    (c2, lE, 'Ne respecte pas les règles; esprit sportif absent.'),

    (c3, lA, 'Communique clairement et s''organise efficacement avec ses coéquipiers; contributions pertinentes aux décisions du groupe.'),
    (c3, lB, 'Communique bien; organisation avec les autres généralement adéquate.'),
    (c3, lC, 'Communication et organisation présentes mais limitées.'),
    (c3, lD, 'Difficulté à communiquer ou à s''organiser avec les autres.'),
    (c3, lE, 'Ne communique pas ou de façon inadéquate avec ses coéquipiers.'),

    (c4, lA, 'Adopte spontanément des comportements d''équité; s''assure que tous participent et sont inclus.'),
    (c4, lB, 'Adopte des comportements d''équité avec quelques rappels.'),
    (c4, lC, 'Équité présente mais inégale; certains comportements exclusifs.'),
    (c4, lD, 'Peu de comportements d''équité; tend à favoriser certains au détriment d''autres.'),
    (c4, lE, 'Comportements inéquitables ou discriminatoires.'),

    (c5, lA, 'Assume différents rôles avec aisance et efficacité; s''adapte facilement.'),
    (c5, lB, 'Assume différents rôles adéquatement; quelques difficultés dans certains rôles.'),
    (c5, lC, 'Assume un ou deux rôles; difficulté à en varier.'),
    (c5, lD, 'Difficulté à assumer des rôles variés; préfère toujours le même.'),
    (c5, lE, 'Refuse d''assumer des rôles au sein du groupe.'),

    (c6, lA, 'Gère les conflits de façon constructive et autonome; propose des solutions justes.'),
    (c6, lB, 'Tente de gérer les conflits de façon positive; besoin d''un peu d''aide.'),
    (c6, lC, 'Gestion des conflits partielle; a besoin de soutien.'),
    (c6, lD, 'Difficulté à gérer les conflits; réactions souvent inappropriées.'),
    (c6, lE, 'Ne gère pas les conflits ou aggrave les situations.');

END $$;
