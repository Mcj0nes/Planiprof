-- ============================================================
-- PLANIPROF -- Seed: Grille d'évaluation – Mode de vie sain, Éducation physique 1er cycle
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
      'Grille d''évaluation – Compétence : Mode de vie sain (Éducation physique – 1er cycle)',
      eps_id,
      '1er cycle du primaire',
      'Planiprof',
      true,
      'Adopter un mode de vie sain et actif'
    )
    RETURNING id INTO grid_id;

  INSERT INTO eval_grid_grades VALUES (grid_id, p1), (grid_id, p2);

  INSERT INTO eval_grid_levels (grid_id, code, label, sort_order) VALUES (grid_id, 'A', 'Excellent',        1) RETURNING id INTO lA;
  INSERT INTO eval_grid_levels (grid_id, code, label, sort_order) VALUES (grid_id, 'B', 'Très bien',        2) RETURNING id INTO lB;
  INSERT INTO eval_grid_levels (grid_id, code, label, sort_order) VALUES (grid_id, 'C', 'Acceptable',       3) RETURNING id INTO lC;
  INSERT INTO eval_grid_levels (grid_id, code, label, sort_order) VALUES (grid_id, 'D', 'Peu satisfaisant', 4) RETURNING id INTO lD;
  INSERT INTO eval_grid_levels (grid_id, code, label, sort_order) VALUES (grid_id, 'E', 'Insuffisant',      5) RETURNING id INTO lE;

  INSERT INTO eval_grid_criteria (grid_id, label, sort_order) VALUES (grid_id, 'Nommer des activités physiques bénéfiques',                   1) RETURNING id INTO c1;
  INSERT INTO eval_grid_criteria (grid_id, label, sort_order) VALUES (grid_id, 'Reconnaître les effets de l''effort sur son corps',           2) RETURNING id INTO c2;
  INSERT INTO eval_grid_criteria (grid_id, label, sort_order) VALUES (grid_id, 'Adopter des comportements sécuritaires',                      3) RETURNING id INTO c3;
  INSERT INTO eval_grid_criteria (grid_id, label, sort_order) VALUES (grid_id, 'Prendre soin de son hygiène après l''effort',                 4) RETURNING id INTO c4;
  INSERT INTO eval_grid_criteria (grid_id, label, sort_order) VALUES (grid_id, 'Exprimer ses préférences en matière d''activités physiques',  5) RETURNING id INTO c5;

  INSERT INTO eval_grid_cells (criterion_id, level_id, descriptor) VALUES
    (c1, lA, 'Nomme plusieurs activités physiques bénéfiques et explique simplement pourquoi elles sont bonnes pour la santé.'),
    (c1, lB, 'Nomme quelques activités bénéfiques; lien avec la santé simple mais présent.'),
    (c1, lC, 'Nomme une activité bénéfique; lien avec la santé limité.'),
    (c1, lD, 'Identification vague ou peu pertinente.'),
    (c1, lE, 'Ne parvient pas à nommer des activités bénéfiques.'),

    (c2, lA, 'Reconnaît clairement plusieurs effets de l''effort (essoufflement, rythme cardiaque, transpiration) et les nomme.'),
    (c2, lB, 'Reconnaît quelques effets de l''effort; vocabulaire simple.'),
    (c2, lC, 'Reconnaît un effet de l''effort; lien limité.'),
    (c2, lD, 'Reconnaissance vague ou erronée des effets de l''effort.'),
    (c2, lE, 'Ne reconnaît pas les effets de l''effort sur son corps.'),

    (c3, lA, 'Adopte tous les comportements sécuritaires spontanément; attitude responsable exemplaire.'),
    (c3, lB, 'Adopte la plupart des comportements sécuritaires; quelques oublis.'),
    (c3, lC, 'Adopte les comportements essentiels; a besoin de rappels.'),
    (c3, lD, 'Comportements sécuritaires insuffisants; prises de risques occasionnelles.'),
    (c3, lE, 'Ne respecte pas les comportements sécuritaires.'),

    (c4, lA, 'Prend soin de son hygiène après l''effort de façon autonome et complète.'),
    (c4, lB, 'Prend soin de son hygiène avec quelques rappels.'),
    (c4, lC, 'Hygiène partielle; a besoin de guidance.'),
    (c4, lD, 'Hygiène après l''effort souvent négligée.'),
    (c4, lE, 'Ne prend pas soin de son hygiène après l''effort.'),

    (c5, lA, 'Exprime clairement ses préférences avec des raisons simples; montre de l''enthousiasme pour l''activité physique.'),
    (c5, lB, 'Exprime ses préférences simplement; justification partielle.'),
    (c5, lC, 'Exprime une préférence sans justification.'),
    (c5, lD, 'Expression vague ou difficile à comprendre.'),
    (c5, lE, 'N''exprime pas ses préférences ou indifférence totale.');

END $$;
