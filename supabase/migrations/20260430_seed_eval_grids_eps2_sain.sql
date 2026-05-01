-- ============================================================
-- PLANIPROF -- Seed: Grille d'évaluation – Mode de vie sain, Éducation physique 2e cycle
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
      'Grille d''évaluation – Compétence : Mode de vie sain (Éducation physique – 2e cycle)',
      eps_id,
      '2e cycle du primaire',
      'Planiprof',
      true,
      'Adopter un mode de vie sain et actif'
    )
    RETURNING id INTO grid_id;

  INSERT INTO eval_grid_grades VALUES (grid_id, p3), (grid_id, p4);

  INSERT INTO eval_grid_levels (grid_id, code, label, sort_order) VALUES (grid_id, 'A', 'Excellent',        1) RETURNING id INTO lA;
  INSERT INTO eval_grid_levels (grid_id, code, label, sort_order) VALUES (grid_id, 'B', 'Très bien',        2) RETURNING id INTO lB;
  INSERT INTO eval_grid_levels (grid_id, code, label, sort_order) VALUES (grid_id, 'C', 'Acceptable',       3) RETURNING id INTO lC;
  INSERT INTO eval_grid_levels (grid_id, code, label, sort_order) VALUES (grid_id, 'D', 'Peu satisfaisant', 4) RETURNING id INTO lD;
  INSERT INTO eval_grid_levels (grid_id, code, label, sort_order) VALUES (grid_id, 'E', 'Insuffisant',      5) RETURNING id INTO lE;

  INSERT INTO eval_grid_criteria (grid_id, label, sort_order) VALUES (grid_id, 'Reconnaître les bienfaits de l''activité physique sur la santé',  1) RETURNING id INTO c1;
  INSERT INTO eval_grid_criteria (grid_id, label, sort_order) VALUES (grid_id, 'Adopter des comportements sains et sécuritaires',                 2) RETURNING id INTO c2;
  INSERT INTO eval_grid_criteria (grid_id, label, sort_order) VALUES (grid_id, 'Gérer son énergie et son effort',                                3) RETURNING id INTO c3;
  INSERT INTO eval_grid_criteria (grid_id, label, sort_order) VALUES (grid_id, 'Faire des choix favorables à la santé',                          4) RETURNING id INTO c4;
  INSERT INTO eval_grid_criteria (grid_id, label, sort_order) VALUES (grid_id, 'Établir des liens entre habitudes de vie et santé',              5) RETURNING id INTO c5;
  INSERT INTO eval_grid_criteria (grid_id, label, sort_order) VALUES (grid_id, 'Adopter une hygiène corporelle adéquate',                       6) RETURNING id INTO c6;

  INSERT INTO eval_grid_cells (criterion_id, level_id, descriptor) VALUES
    (c1, lA, 'Explique clairement plusieurs bienfaits de l''activité physique (santé physique, mentale, sociale) avec des exemples précis.'),
    (c1, lB, 'Explique quelques bienfaits de façon adéquate.'),
    (c1, lC, 'Nomme un bienfait; explication limitée.'),
    (c1, lD, 'Connaissance vague ou imprécise des bienfaits.'),
    (c1, lE, 'Ne reconnaît pas les bienfaits de l''activité physique.'),

    (c2, lA, 'Adopte spontanément des comportements sains et sécuritaires; attitude responsable et exemplaire.'),
    (c2, lB, 'Adopte des comportements sains et sécuritaires; quelques oublis mineurs.'),
    (c2, lC, 'Comportements sains présents mais inégaux; a besoin de rappels.'),
    (c2, lD, 'Comportements sains insuffisants; prises de risques occasionnelles.'),
    (c2, lE, 'Ne respecte pas les comportements sains et sécuritaires.'),

    (c3, lA, 'Gère son énergie et son effort de façon efficace; adapte son intensité selon l''activité et ses capacités.'),
    (c3, lB, 'Gère son énergie adéquatement; quelques difficultés de dosage.'),
    (c3, lC, 'Gestion partielle de l''effort; parfois trop intense ou pas assez.'),
    (c3, lD, 'Difficulté à gérer son énergie; effort souvent inadapté.'),
    (c3, lE, 'Ne gère pas son énergie ou son effort.'),

    (c4, lA, 'Fait des choix favorables à la santé de façon autonome et les justifie clairement.'),
    (c4, lB, 'Fait des choix favorables avec quelques justifications.'),
    (c4, lC, 'Fait quelques choix favorables; justification limitée.'),
    (c4, lD, 'Choix peu favorables à la santé; peu de conscience des effets.'),
    (c4, lE, 'Ne fait pas de choix favorables à la santé.'),

    (c5, lA, 'Établit des liens clairs et précis entre ses habitudes de vie et leur impact sur sa santé.'),
    (c5, lB, 'Établit quelques liens pertinents entre habitudes de vie et santé.'),
    (c5, lC, 'Établit un lien simple; compréhension partielle.'),
    (c5, lD, 'Liens vagues ou imprécis.'),
    (c5, lE, 'N''établit pas de lien entre habitudes de vie et santé.'),

    (c6, lA, 'Adopte une hygiène corporelle complète et adéquate après l''effort de façon autonome.'),
    (c6, lB, 'Hygiène corporelle généralement adéquate; quelques oublis.'),
    (c6, lC, 'Hygiène partielle; a besoin de rappels.'),
    (c6, lD, 'Hygiène souvent négligée.'),
    (c6, lE, 'Aucune hygiène corporelle après l''effort.');

END $$;
