-- ============================================================
-- PLANIPROF -- Seed: Grille d'évaluation – Pratiquer le dialogue, CCQ 2e cycle
-- ============================================================

DO $$
DECLARE
  grid_id uuid;
  ccq_id int;
  p3 int; p4 int;
  lA int; lB int; lC int; lD int; lE int;
  c1 uuid; c2 uuid; c3 uuid; c4 uuid; c5 uuid; c6 uuid;
BEGIN

  SELECT id INTO ccq_id FROM subjects WHERE slug = 'ccq';
  SELECT id INTO p3 FROM grade_levels WHERE education_level = 'primaire' AND grade = 3;
  SELECT id INTO p4 FROM grade_levels WHERE education_level = 'primaire' AND grade = 4;

  INSERT INTO eval_grids (title, subject_id, cycle_label, source, is_baseline, competency)
    VALUES (
      'Grille d''évaluation – Compétence : Pratiquer le dialogue (CCQ – 2e cycle)',
      ccq_id,
      '2e cycle du primaire',
      'Planiprof',
      true,
      'Pratiquer le dialogue'
    )
    RETURNING id INTO grid_id;

  INSERT INTO eval_grid_grades VALUES (grid_id, p3), (grid_id, p4);

  INSERT INTO eval_grid_levels (grid_id, code, label, sort_order) VALUES (grid_id, 'A', 'Excellent',        1) RETURNING id INTO lA;
  INSERT INTO eval_grid_levels (grid_id, code, label, sort_order) VALUES (grid_id, 'B', 'Très bien',        2) RETURNING id INTO lB;
  INSERT INTO eval_grid_levels (grid_id, code, label, sort_order) VALUES (grid_id, 'C', 'Acceptable',       3) RETURNING id INTO lC;
  INSERT INTO eval_grid_levels (grid_id, code, label, sort_order) VALUES (grid_id, 'D', 'Peu satisfaisant', 4) RETURNING id INTO lD;
  INSERT INTO eval_grid_levels (grid_id, code, label, sort_order) VALUES (grid_id, 'E', 'Insuffisant',      5) RETURNING id INTO lE;

  INSERT INTO eval_grid_criteria (grid_id, label, sort_order) VALUES (grid_id, 'Exprimer son point de vue clairement',                    1) RETURNING id INTO c1;
  INSERT INTO eval_grid_criteria (grid_id, label, sort_order) VALUES (grid_id, 'Écouter et reconnaître les points de vue des autres',     2) RETURNING id INTO c2;
  INSERT INTO eval_grid_criteria (grid_id, label, sort_order) VALUES (grid_id, 'Respecter les règles du dialogue',                       3) RETURNING id INTO c3;
  INSERT INTO eval_grid_criteria (grid_id, label, sort_order) VALUES (grid_id, 'Utiliser des formes de dialogue appropriées',            4) RETURNING id INTO c4;
  INSERT INTO eval_grid_criteria (grid_id, label, sort_order) VALUES (grid_id, 'Nuancer ou ajuster sa pensée',                          5) RETURNING id INTO c5;
  INSERT INTO eval_grid_criteria (grid_id, label, sort_order) VALUES (grid_id, 'Formuler une synthèse simple',                          6) RETURNING id INTO c6;

  INSERT INTO eval_grid_cells (criterion_id, level_id, descriptor) VALUES
    (c1, lA, 'Exprime son point de vue clairement et avec assurance; justification pertinente et développée.'),
    (c1, lB, 'Exprime son point de vue clairement; justification simple mais présente.'),
    (c1, lC, 'Exprime son point de vue sans justification claire.'),
    (c1, lD, 'Point de vue peu clair ou difficile à comprendre.'),
    (c1, lE, 'N''exprime pas son point de vue.'),

    (c2, lA, 'Écoute attentivement; reformule et reconnaît les points de vue des autres avec précision.'),
    (c2, lB, 'Écoute bien; reconnaît les points de vue avec quelques imprécisions.'),
    (c2, lC, 'Écoute correctement; reconnaissance partielle des points de vue.'),
    (c2, lD, 'Écoute inégale; difficulté à reconnaître les points de vue.'),
    (c2, lE, 'N''écoute pas ou ne tient pas compte des autres.'),

    (c3, lA, 'Respecte toutes les règles du dialogue; attitude exemplaire envers les autres participants.'),
    (c3, lB, 'Respecte bien les règles; quelques oublis mineurs.'),
    (c3, lC, 'Respecte les règles essentielles; a besoin de rappels.'),
    (c3, lD, 'Difficulté à respecter les règles; a besoin de beaucoup d''aide.'),
    (c3, lE, 'Ne respecte pas les règles du dialogue.'),

    (c4, lA, 'Utilise des formes de dialogue variées et appropriées (discussion, débat, partage de points de vue).'),
    (c4, lB, 'Utilise des formes de dialogue adéquates; quelques maladresses.'),
    (c4, lC, 'Utilise une forme de dialogue simple; maîtrise partielle.'),
    (c4, lD, 'Utilisation limitée ou inadéquate des formes de dialogue.'),
    (c4, lE, 'N''utilise pas les formes de dialogue de façon adéquate.'),

    (c5, lA, 'Nuance ou ajuste clairement sa pensée en tenant compte des échanges; fait des liens explicites.'),
    (c5, lB, 'Tente de nuancer sa pensée; ajustements partiels.'),
    (c5, lC, 'Légère nuance présente; peu d''ajustements.'),
    (c5, lD, 'Peu ou pas de nuance; pensée rigide.'),
    (c5, lE, 'Aucune nuance ou ajustement.'),

    (c6, lA, 'Formule une synthèse claire qui intègre les principaux points de vue exprimés.'),
    (c6, lB, 'Synthèse pertinente mais partielle.'),
    (c6, lC, 'Synthèse simple mais présente.'),
    (c6, lD, 'Synthèse vague ou difficile à comprendre.'),
    (c6, lE, 'Aucune synthèse formulée.');

END $$;
