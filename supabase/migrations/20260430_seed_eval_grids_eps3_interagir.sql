-- ============================================================
-- PLANIPROF -- Seed: Grille d'évaluation – Interagir, Éducation physique 3e cycle
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
      'Grille d''évaluation – Compétence : Interagir (Éducation physique – 3e cycle)',
      eps_id,
      '3e cycle du primaire',
      'Planiprof',
      true,
      'Interagir dans divers contextes de pratique d''activités physiques'
    )
    RETURNING id INTO grid_id;

  INSERT INTO eval_grid_grades VALUES (grid_id, p5), (grid_id, p6);

  INSERT INTO eval_grid_levels (grid_id, code, label, sort_order) VALUES (grid_id, 'A', 'Excellent',        1) RETURNING id INTO lA;
  INSERT INTO eval_grid_levels (grid_id, code, label, sort_order) VALUES (grid_id, 'B', 'Très bien',        2) RETURNING id INTO lB;
  INSERT INTO eval_grid_levels (grid_id, code, label, sort_order) VALUES (grid_id, 'C', 'Acceptable',       3) RETURNING id INTO lC;
  INSERT INTO eval_grid_levels (grid_id, code, label, sort_order) VALUES (grid_id, 'D', 'Peu satisfaisant', 4) RETURNING id INTO lD;
  INSERT INTO eval_grid_levels (grid_id, code, label, sort_order) VALUES (grid_id, 'E', 'Insuffisant',      5) RETURNING id INTO lE;

  INSERT INTO eval_grid_criteria (grid_id, label, sort_order) VALUES (grid_id, 'Coopérer et contribuer au succès de l''équipe',              1) RETURNING id INTO c1;
  INSERT INTO eval_grid_criteria (grid_id, label, sort_order) VALUES (grid_id, 'Respecter les règles et faire preuve d''esprit sportif',     2) RETURNING id INTO c2;
  INSERT INTO eval_grid_criteria (grid_id, label, sort_order) VALUES (grid_id, 'Communiquer et prendre des décisions collectives',           3) RETURNING id INTO c3;
  INSERT INTO eval_grid_criteria (grid_id, label, sort_order) VALUES (grid_id, 'Résoudre des conflits de façon constructive',               4) RETURNING id INTO c4;
  INSERT INTO eval_grid_criteria (grid_id, label, sort_order) VALUES (grid_id, 'Assumer des rôles variés avec leadership',                  5) RETURNING id INTO c5;
  INSERT INTO eval_grid_criteria (grid_id, label, sort_order) VALUES (grid_id, 'Adopter des comportements d''équité et d''inclusion',       6) RETURNING id INTO c6;

  INSERT INTO eval_grid_cells (criterion_id, level_id, descriptor) VALUES
    (c1, lA, 'Coopère de façon exemplaire; contributions significatives au succès de l''équipe; mobilise les autres.'),
    (c1, lB, 'Coopère efficacement; contributions régulières et pertinentes.'),
    (c1, lC, 'Coopère de façon adéquate; engagement variable selon les situations.'),
    (c1, lD, 'Coopération limitée; peu engagé dans la réussite collective.'),
    (c1, lE, 'Refuse de coopérer ou nuit au fonctionnement de l''équipe.'),

    (c2, lA, 'Respecte scrupuleusement les règles; esprit sportif exemplaire même dans les situations difficiles.'),
    (c2, lB, 'Respecte les règles et fait preuve de bon esprit sportif; quelques manquements mineurs.'),
    (c2, lC, 'Respecte les règles essentielles; esprit sportif parfois défaillant sous pression.'),
    (c2, lD, 'Difficulté à respecter les règles ou à maintenir un esprit sportif adéquat.'),
    (c2, lE, 'Ne respecte pas les règles; esprit sportif absent.'),

    (c3, lA, 'Communique efficacement; participe activement aux décisions collectives; leadership positif.'),
    (c3, lB, 'Communique bien; contribue aux décisions collectives de façon pertinente.'),
    (c3, lC, 'Communication adéquate; participation aux décisions limitée.'),
    (c3, lD, 'Difficulté à communiquer ou à participer aux décisions collectives.'),
    (c3, lE, 'Ne communique pas ou entrave les décisions collectives.'),

    (c4, lA, 'Résout les conflits de façon autonome, constructive et équitable; propose des solutions créatives.'),
    (c4, lB, 'Résout les conflits de façon généralement constructive; besoin d''un peu d''aide.'),
    (c4, lC, 'Tente de résoudre les conflits; résultats variables.'),
    (c4, lD, 'Difficulté à résoudre les conflits; réactions parfois inappropriées.'),
    (c4, lE, 'Ne résout pas les conflits ou les aggrave.'),

    (c5, lA, 'Assume différents rôles avec aisance et leadership; inspire et guide ses coéquipiers.'),
    (c5, lB, 'Assume différents rôles efficacement; leadership présent.'),
    (c5, lC, 'Assume quelques rôles; leadership limité.'),
    (c5, lD, 'Difficulté à assumer des rôles variés ou à exercer un leadership.'),
    (c5, lE, 'Refuse d''assumer des rôles ou leadership absent.'),

    (c6, lA, 'Adopte spontanément des comportements d''équité et d''inclusion; veille à ce que tous participent pleinement.'),
    (c6, lB, 'Adopte des comportements d''équité et d''inclusion avec régularité.'),
    (c6, lC, 'Comportements d''équité présents mais inégaux.'),
    (c6, lD, 'Peu de comportements d''équité; tendance à exclure ou à favoriser certains.'),
    (c6, lE, 'Comportements inéquitables ou discriminatoires.');

END $$;
