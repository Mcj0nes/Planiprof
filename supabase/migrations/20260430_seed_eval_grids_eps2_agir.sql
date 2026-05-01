-- ============================================================
-- PLANIPROF -- Seed: Grille d'évaluation – Agir, Éducation physique 2e cycle
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
      'Grille d''évaluation – Compétence : Agir (Éducation physique – 2e cycle)',
      eps_id,
      '2e cycle du primaire',
      'Planiprof',
      true,
      'Agir dans divers contextes de pratique d''activités physiques'
    )
    RETURNING id INTO grid_id;

  INSERT INTO eval_grid_grades VALUES (grid_id, p3), (grid_id, p4);

  INSERT INTO eval_grid_levels (grid_id, code, label, sort_order) VALUES (grid_id, 'A', 'Excellent',        1) RETURNING id INTO lA;
  INSERT INTO eval_grid_levels (grid_id, code, label, sort_order) VALUES (grid_id, 'B', 'Très bien',        2) RETURNING id INTO lB;
  INSERT INTO eval_grid_levels (grid_id, code, label, sort_order) VALUES (grid_id, 'C', 'Acceptable',       3) RETURNING id INTO lC;
  INSERT INTO eval_grid_levels (grid_id, code, label, sort_order) VALUES (grid_id, 'D', 'Peu satisfaisant', 4) RETURNING id INTO lD;
  INSERT INTO eval_grid_levels (grid_id, code, label, sort_order) VALUES (grid_id, 'E', 'Insuffisant',      5) RETURNING id INTO lE;

  INSERT INTO eval_grid_criteria (grid_id, label, sort_order) VALUES (grid_id, 'Exécuter des habiletés motrices avec efficacité',          1) RETURNING id INTO c1;
  INSERT INTO eval_grid_criteria (grid_id, label, sort_order) VALUES (grid_id, 'Coordonner ses mouvements avec fluidité',                  2) RETURNING id INTO c2;
  INSERT INTO eval_grid_criteria (grid_id, label, sort_order) VALUES (grid_id, 'Adapter ses actions selon le contexte et les défis',       3) RETURNING id INTO c3;
  INSERT INTO eval_grid_criteria (grid_id, label, sort_order) VALUES (grid_id, 'Utiliser des stratégies d''action appropriées',            4) RETURNING id INTO c4;
  INSERT INTO eval_grid_criteria (grid_id, label, sort_order) VALUES (grid_id, 'Respecter les consignes de sécurité',                     5) RETURNING id INTO c5;
  INSERT INTO eval_grid_criteria (grid_id, label, sort_order) VALUES (grid_id, 'Évaluer et ajuster ses actions',                         6) RETURNING id INTO c6;

  INSERT INTO eval_grid_cells (criterion_id, level_id, descriptor) VALUES
    (c1, lA, 'Exécute les habiletés motrices avec précision, efficacité et constance dans des contextes variés.'),
    (c1, lB, 'Exécute les habiletés motrices correctement; quelques imprécisions dans des contextes plus complexes.'),
    (c1, lC, 'Exécute les habiletés motrices de façon fonctionnelle; maîtrise partielle.'),
    (c1, lD, 'Exécution souvent imprécise ou inefficace; a besoin de beaucoup d''aide.'),
    (c1, lE, 'Ne parvient pas à exécuter les habiletés motrices de façon adéquate.'),

    (c2, lA, 'Coordonne ses mouvements avec fluidité et enchaîne les actions de façon efficace.'),
    (c2, lB, 'Coordination généralement fluide; quelques maladresses dans les enchaînements.'),
    (c2, lC, 'Coordination présente mais inégale; enchaînements parfois laborieux.'),
    (c2, lD, 'Coordination faible; enchaînements difficiles.'),
    (c2, lE, 'Coordination très limitée; actions non coordonnées.'),

    (c3, lA, 'Adapte ses actions avec aisance selon les différents contextes; réagit rapidement et pertinemment.'),
    (c3, lB, 'Adapte ses actions adéquatement; quelques hésitations face aux défis.'),
    (c3, lC, 'Adapte ses actions partiellement; a besoin de rappels ou de modelage.'),
    (c3, lD, 'Difficulté à adapter ses actions; répond souvent de façon inadaptée.'),
    (c3, lE, 'Ne parvient pas à adapter ses actions selon le contexte.'),

    (c4, lA, 'Identifie et utilise des stratégies d''action variées et pertinentes; choix stratégiques efficaces.'),
    (c4, lB, 'Utilise quelques stratégies pertinentes; efficacité variable.'),
    (c4, lC, 'Utilise une stratégie simple; application partielle.'),
    (c4, lD, 'Stratégies limitées ou peu efficaces.'),
    (c4, lE, 'N''utilise pas de stratégie d''action.'),

    (c5, lA, 'Respecte toutes les consignes de sécurité; attitude responsable et exemplaire.'),
    (c5, lB, 'Respecte la plupart des consignes; quelques oublis mineurs.'),
    (c5, lC, 'Respecte les consignes essentielles; a besoin de rappels.'),
    (c5, lD, 'Difficulté à respecter les consignes; comportements parfois à risque.'),
    (c5, lE, 'Ne respecte pas les consignes de sécurité.'),

    (c6, lA, 'Évalue sa performance avec précision et ajuste efficacement ses actions pour s''améliorer.'),
    (c6, lB, 'Évalue sa performance et tente quelques ajustements pertinents.'),
    (c6, lC, 'Évaluation partielle; ajustements limités.'),
    (c6, lD, 'Peu de capacité à évaluer ou à ajuster ses actions.'),
    (c6, lE, 'N''évalue pas sa performance et n''ajuste pas ses actions.');

END $$;
