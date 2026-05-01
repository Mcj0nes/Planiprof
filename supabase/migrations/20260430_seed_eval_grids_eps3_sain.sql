-- ============================================================
-- PLANIPROF -- Seed: Grille d'évaluation – Mode de vie sain, Éducation physique 3e cycle
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
      'Grille d''évaluation – Compétence : Mode de vie sain (Éducation physique – 3e cycle)',
      eps_id,
      '3e cycle du primaire',
      'Planiprof',
      true,
      'Adopter un mode de vie sain et actif'
    )
    RETURNING id INTO grid_id;

  INSERT INTO eval_grid_grades VALUES (grid_id, p5), (grid_id, p6);

  INSERT INTO eval_grid_levels (grid_id, code, label, sort_order) VALUES (grid_id, 'A', 'Excellent',        1) RETURNING id INTO lA;
  INSERT INTO eval_grid_levels (grid_id, code, label, sort_order) VALUES (grid_id, 'B', 'Très bien',        2) RETURNING id INTO lB;
  INSERT INTO eval_grid_levels (grid_id, code, label, sort_order) VALUES (grid_id, 'C', 'Acceptable',       3) RETURNING id INTO lC;
  INSERT INTO eval_grid_levels (grid_id, code, label, sort_order) VALUES (grid_id, 'D', 'Peu satisfaisant', 4) RETURNING id INTO lD;
  INSERT INTO eval_grid_levels (grid_id, code, label, sort_order) VALUES (grid_id, 'E', 'Insuffisant',      5) RETURNING id INTO lE;

  INSERT INTO eval_grid_criteria (grid_id, label, sort_order) VALUES (grid_id, 'Analyser ses habitudes de vie et leur impact sur la santé',          1) RETURNING id INTO c1;
  INSERT INTO eval_grid_criteria (grid_id, label, sort_order) VALUES (grid_id, 'Adopter des comportements sains, sécuritaires et éthiques',          2) RETURNING id INTO c2;
  INSERT INTO eval_grid_criteria (grid_id, label, sort_order) VALUES (grid_id, 'Planifier et gérer son activité physique',                           3) RETURNING id INTO c3;
  INSERT INTO eval_grid_criteria (grid_id, label, sort_order) VALUES (grid_id, 'Faire des choix éclairés pour un mode de vie actif',                 4) RETURNING id INTO c4;
  INSERT INTO eval_grid_criteria (grid_id, label, sort_order) VALUES (grid_id, 'Exercer son esprit critique face aux influences sur la santé',       5) RETURNING id INTO c5;
  INSERT INTO eval_grid_criteria (grid_id, label, sort_order) VALUES (grid_id, 'Gérer son effort et récupérer adéquatement',                        6) RETURNING id INTO c6;

  INSERT INTO eval_grid_cells (criterion_id, level_id, descriptor) VALUES
    (c1, lA, 'Analyse ses habitudes de vie avec précision; identifie clairement leurs impacts positifs et négatifs sur sa santé; propose des pistes d''amélioration.'),
    (c1, lB, 'Analyse adéquatement ses habitudes de vie; identifie quelques impacts sur la santé.'),
    (c1, lC, 'Analyse partielle; identification d''un impact simple.'),
    (c1, lD, 'Analyse vague ou superficielle; peu de liens établis.'),
    (c1, lE, 'N''analyse pas ses habitudes de vie ni leurs impacts.'),

    (c2, lA, 'Adopte spontanément des comportements sains, sécuritaires et éthiques; attitude exemplaire et responsable.'),
    (c2, lB, 'Adopte des comportements sains et sécuritaires avec régularité; quelques manquements mineurs.'),
    (c2, lC, 'Comportements sains présents mais inégaux; a besoin de rappels.'),
    (c2, lD, 'Comportements insuffisants; prises de risques ou manquements éthiques occasionnels.'),
    (c2, lE, 'Ne respecte pas les comportements sains, sécuritaires ou éthiques.'),

    (c3, lA, 'Planifie et gère son activité physique de façon autonome et réfléchie; objectifs clairs et réalistes.'),
    (c3, lB, 'Planifie et gère son activité physique adéquatement; quelques imprécisions.'),
    (c3, lC, 'Planification partielle; gestion de l''activité limitée.'),
    (c3, lD, 'Difficulté à planifier ou à gérer son activité physique.'),
    (c3, lE, 'Ne planifie pas ni ne gère son activité physique.'),

    (c4, lA, 'Fait des choix éclairés et autonomes pour un mode de vie actif; justifie ses choix avec des arguments solides.'),
    (c4, lB, 'Fait des choix généralement éclairés; justifications adéquates.'),
    (c4, lC, 'Fait quelques choix favorables; justifications limitées.'),
    (c4, lD, 'Choix peu éclairés; peu de réflexion sur le mode de vie actif.'),
    (c4, lE, 'Ne fait pas de choix favorables à un mode de vie actif.'),

    (c5, lA, 'Exerce un esprit critique développé face aux influences externes (médias, publicité, pairs); distingue les informations fiables.'),
    (c5, lB, 'Exerce un esprit critique adéquat; quelques nuances présentes.'),
    (c5, lC, 'Esprit critique limité; peu de remise en question des influences.'),
    (c5, lD, 'Peu d''esprit critique; facilement influencé.'),
    (c5, lE, 'Aucun esprit critique; aucune remise en question des influences.'),

    (c6, lA, 'Gère son effort et sa récupération de façon optimale; adapte l''intensité selon ses besoins et ses capacités.'),
    (c6, lB, 'Gère bien son effort et récupère adéquatement; quelques difficultés de dosage.'),
    (c6, lC, 'Gestion de l''effort et récupération partielles; inégales selon les contextes.'),
    (c6, lD, 'Difficulté à gérer son effort ou à récupérer adéquatement.'),
    (c6, lE, 'Ne gère pas son effort ni sa récupération.');

END $$;
