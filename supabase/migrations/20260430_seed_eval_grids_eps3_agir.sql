-- ============================================================
-- PLANIPROF -- Seed: Grille d'évaluation – Agir, Éducation physique 3e cycle
-- ============================================================

DO $$
DECLARE
  grid_id uuid;
  eps_id int;
  p5 int; p6 int;
  lA int; lB int; lC int; lD int; lE int;
  c1 uuid; c2 uuid; c3 uuid; c4 uuid; c5 uuid; c6 uuid;
BEGIN

  SELECT id INTO eps_id FROM subjects WHERE slug = 'educ-physique';
  SELECT id INTO p5 FROM grade_levels WHERE education_level = 'primaire' AND grade = 5;
  SELECT id INTO p6 FROM grade_levels WHERE education_level = 'primaire' AND grade = 6;

  INSERT INTO eval_grids (title, subject_id, cycle_label, source, is_baseline, competency)
    VALUES (
      'Grille d''évaluation – Compétence : Agir (Éducation physique – 3e cycle)',
      eps_id,
      '3e cycle du primaire',
      'Planiprof',
      true,
      'Agir dans divers contextes de pratique d''activités physiques'
    )
    RETURNING id INTO grid_id;

  INSERT INTO eval_grid_grades VALUES (grid_id, p5), (grid_id, p6);

  INSERT INTO eval_grid_levels (grid_id, code, label, sort_order) VALUES (grid_id, 'A', 'Excellent',        1) RETURNING id INTO lA;
  INSERT INTO eval_grid_levels (grid_id, code, label, sort_order) VALUES (grid_id, 'B', 'Très bien',        2) RETURNING id INTO lB;
  INSERT INTO eval_grid_levels (grid_id, code, label, sort_order) VALUES (grid_id, 'C', 'Acceptable',       3) RETURNING id INTO lC;
  INSERT INTO eval_grid_levels (grid_id, code, label, sort_order) VALUES (grid_id, 'D', 'Peu satisfaisant', 4) RETURNING id INTO lD;
  INSERT INTO eval_grid_levels (grid_id, code, label, sort_order) VALUES (grid_id, 'E', 'Insuffisant',      5) RETURNING id INTO lE;

  INSERT INTO eval_grid_criteria (grid_id, label, sort_order) VALUES (grid_id, 'Exécuter des habiletés motrices avec précision et efficacité', 1) RETURNING id INTO c1;
  INSERT INTO eval_grid_criteria (grid_id, label, sort_order) VALUES (grid_id, 'Coordonner ses mouvements avec fluidité et contrôle',          2) RETURNING id INTO c2;
  INSERT INTO eval_grid_criteria (grid_id, label, sort_order) VALUES (grid_id, 'Adapter ses actions de façon autonome',                        3) RETURNING id INTO c3;
  INSERT INTO eval_grid_criteria (grid_id, label, sort_order) VALUES (grid_id, 'Utiliser des stratégies d''action variées et pertinentes',     4) RETURNING id INTO c4;
  INSERT INTO eval_grid_criteria (grid_id, label, sort_order) VALUES (grid_id, 'Évaluer sa performance et s''améliorer',                      5) RETURNING id INTO c5;
  INSERT INTO eval_grid_criteria (grid_id, label, sort_order) VALUES (grid_id, 'Faire preuve d''engagement et de persévérance',               6) RETURNING id INTO c6;

  INSERT INTO eval_grid_cells (criterion_id, level_id, descriptor) VALUES
    (c1, lA, 'Exécute les habiletés motrices avec précision, efficacité et constance; technique bien maîtrisée dans des contextes variés et complexes.'),
    (c1, lB, 'Exécute les habiletés motrices avec efficacité; quelques imprécisions dans les situations plus complexes.'),
    (c1, lC, 'Exécute les habiletés motrices de façon fonctionnelle; maîtrise partielle de la technique.'),
    (c1, lD, 'Exécution souvent imprécise ou inefficace; technique faible.'),
    (c1, lE, 'Ne parvient pas à exécuter les habiletés motrices de façon adéquate.'),

    (c2, lA, 'Coordonne ses mouvements avec fluidité et contrôle; enchaînements efficaces et bien maîtrisés.'),
    (c2, lB, 'Coordination fluide; quelques maladresses dans des enchaînements complexes.'),
    (c2, lC, 'Coordination présente mais inégale selon les contextes.'),
    (c2, lD, 'Coordination faible; enchaînements difficiles.'),
    (c2, lE, 'Coordination très limitée; mouvements non contrôlés.'),

    (c3, lA, 'Adapte ses actions de façon autonome et réfléchie; anticipe les changements et réagit efficacement.'),
    (c3, lB, 'Adapte ses actions adéquatement avec peu d''aide; réponses généralement pertinentes.'),
    (c3, lC, 'Adapte ses actions partiellement; a parfois besoin de soutien.'),
    (c3, lD, 'Difficulté à adapter ses actions de façon autonome; dépend souvent de l''enseignant.'),
    (c3, lE, 'Ne parvient pas à adapter ses actions de façon autonome.'),

    (c4, lA, 'Choisit et applique des stratégies variées et efficaces; adapte ses choix selon la situation.'),
    (c4, lB, 'Utilise quelques stratégies pertinentes; application généralement efficace.'),
    (c4, lC, 'Utilise une ou deux stratégies simples; application partielle.'),
    (c4, lD, 'Stratégies limitées ou peu efficaces; choix peu adaptés.'),
    (c4, lE, 'N''utilise pas de stratégie d''action pertinente.'),

    (c5, lA, 'Évalue sa performance avec précision; identifie clairement ses forces et ses axes d''amélioration; ajustements efficaces.'),
    (c5, lB, 'Évalue sa performance correctement; quelques ajustements pertinents.'),
    (c5, lC, 'Évaluation partielle; ajustements limités ou peu efficaces.'),
    (c5, lD, 'Peu de capacité à évaluer sa performance ou à s''améliorer.'),
    (c5, lE, 'N''évalue pas sa performance et ne s''ajuste pas.'),

    (c6, lA, 'S''engage pleinement et persévère avec détermination; attitude positive face aux défis.'),
    (c6, lB, 'Bon engagement; persévère généralement face aux obstacles.'),
    (c6, lC, 'Engagement et persévérance inégaux; abandonne parfois trop vite.'),
    (c6, lD, 'Peu d''engagement; abandonne facilement face aux difficultés.'),
    (c6, lE, 'Aucun engagement ou refus de participer.');

END $$;
