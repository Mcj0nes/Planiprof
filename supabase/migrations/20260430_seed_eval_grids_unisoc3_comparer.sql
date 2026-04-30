-- ============================================================
-- PLANIPROF -- Seed: Grille d'évaluation – Comparer, Univers social 3e cycle
-- ============================================================

DO $$
DECLARE
  grid_id uuid;
  unisoc_id int;
  p5 int; p6 int;
  lA int; lB int; lC int; lD int; lE int;
  c1 uuid; c2 uuid; c3 uuid; c4 uuid; c5 uuid; c6 uuid;
BEGIN

  SELECT id INTO unisoc_id FROM subjects WHERE slug = 'univers-social';
  SELECT id INTO p5 FROM grade_levels WHERE education_level = 'primaire' AND grade = 5;
  SELECT id INTO p6 FROM grade_levels WHERE education_level = 'primaire' AND grade = 6;

  INSERT INTO eval_grids (title, subject_id, cycle_label, source, is_baseline, competency)
    VALUES (
      'Grille d''évaluation – Compétence : Comparer (Univers social – 3e cycle)',
      unisoc_id,
      '3e cycle du primaire',
      'Planiprof',
      true,
      'Interpréter un changement dans une société et sur son territoire'
    )
    RETURNING id INTO grid_id;

  INSERT INTO eval_grid_grades VALUES (grid_id, p5), (grid_id, p6);

  INSERT INTO eval_grid_levels (grid_id, code, label, sort_order) VALUES (grid_id, 'A', 'Excellent',        1) RETURNING id INTO lA;
  INSERT INTO eval_grid_levels (grid_id, code, label, sort_order) VALUES (grid_id, 'B', 'Très bien',        2) RETURNING id INTO lB;
  INSERT INTO eval_grid_levels (grid_id, code, label, sort_order) VALUES (grid_id, 'C', 'Acceptable',       3) RETURNING id INTO lC;
  INSERT INTO eval_grid_levels (grid_id, code, label, sort_order) VALUES (grid_id, 'D', 'Peu satisfaisant', 4) RETURNING id INTO lD;
  INSERT INTO eval_grid_levels (grid_id, code, label, sort_order) VALUES (grid_id, 'E', 'Insuffisant',      5) RETURNING id INTO lE;

  INSERT INTO eval_grid_criteria (grid_id, label, sort_order) VALUES (grid_id, 'Identifier clairement les réalités à comparer',                1) RETURNING id INTO c1;
  INSERT INTO eval_grid_criteria (grid_id, label, sort_order) VALUES (grid_id, 'Décrire chaque réalité avec des éléments significatifs',       2) RETURNING id INTO c2;
  INSERT INTO eval_grid_criteria (grid_id, label, sort_order) VALUES (grid_id, 'Repérer des ressemblances significatives',                     3) RETURNING id INTO c3;
  INSERT INTO eval_grid_criteria (grid_id, label, sort_order) VALUES (grid_id, 'Repérer des différences significatives',                       4) RETURNING id INTO c4;
  INSERT INTO eval_grid_criteria (grid_id, label, sort_order) VALUES (grid_id, 'Appuyer la comparaison avec des preuves tirées des documents', 5) RETURNING id INTO c5;
  INSERT INTO eval_grid_criteria (grid_id, label, sort_order) VALUES (grid_id, 'Formuler une conclusion comparative structurée',               6) RETURNING id INTO c6;

  INSERT INTO eval_grid_cells (criterion_id, level_id, descriptor) VALUES
    (c1, lA, 'Identifie précisément les deux réalités, les situe correctement (temps, espace, société) et précise le contexte.'),
    (c1, lB, 'Identifie et situe les réalités avec quelques imprécisions mineures.'),
    (c1, lC, 'Identifie les réalités mais la situation temporelle ou spatiale manque de clarté.'),
    (c1, lD, 'Identification partielle, floue ou incomplète.'),
    (c1, lE, 'N''identifie pas correctement les réalités.'),

    (c2, lA, 'Décrit chaque réalité avec des éléments précis, variés et pertinents tirés des documents.'),
    (c2, lB, 'Décrit les réalités avec quelques détails manquants.'),
    (c2, lC, 'Décrit une réalité ou donne des descriptions partielles.'),
    (c2, lD, 'Description vague, incomplète ou peu liée aux documents.'),
    (c2, lE, 'Aucune description pertinente.'),

    (c3, lA, 'Repère plusieurs ressemblances précises, pertinentes et bien appuyées sur les documents.'),
    (c3, lB, 'Repère quelques ressemblances pertinentes.'),
    (c3, lC, 'Repère une ressemblance simple.'),
    (c3, lD, 'Ressemblances vagues ou peu pertinentes.'),
    (c3, lE, 'Aucune ressemblance repérée.'),

    (c4, lA, 'Repère plusieurs différences claires, précises et significatives.'),
    (c4, lB, 'Repère quelques différences pertinentes.'),
    (c4, lC, 'Repère une différence simple.'),
    (c4, lD, 'Différences vagues ou peu pertinentes.'),
    (c4, lE, 'Aucune différence repérée.'),

    (c5, lA, 'Utilise plusieurs preuves exactes et variées provenant des documents pour appuyer ressemblances et différences.'),
    (c5, lB, 'Utilise quelques preuves pertinentes.'),
    (c5, lC, 'Utilise une preuve simple.'),
    (c5, lD, 'Preuves limitées, imprécises ou mal choisies.'),
    (c5, lE, 'Aucune preuve ou preuves erronées.'),

    (c6, lA, 'Conclusion claire, structurée, qui met en évidence les principaux contrastes et ressemblances.'),
    (c6, lB, 'Conclusion pertinente mais partielle.'),
    (c6, lC, 'Conclusion simple mais présente.'),
    (c6, lD, 'Conclusion vague ou difficile à comprendre.'),
    (c6, lE, 'Aucune conclusion.');

END $$;
