-- ============================================================
-- PLANIPROF -- Seed: Grille d'évaluation – Lire, Univers social 3e cycle
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
      'Grille d''évaluation – Compétence : Lire (Univers social – 3e cycle)',
      unisoc_id,
      '3e cycle du primaire',
      'Planiprof',
      true,
      'Lire l''organisation d''une société sur son territoire'
    )
    RETURNING id INTO grid_id;

  INSERT INTO eval_grid_grades VALUES (grid_id, p5), (grid_id, p6);

  INSERT INTO eval_grid_levels (grid_id, code, label, sort_order) VALUES (grid_id, 'A', 'Excellent',        1) RETURNING id INTO lA;
  INSERT INTO eval_grid_levels (grid_id, code, label, sort_order) VALUES (grid_id, 'B', 'Très bien',        2) RETURNING id INTO lB;
  INSERT INTO eval_grid_levels (grid_id, code, label, sort_order) VALUES (grid_id, 'C', 'Acceptable',       3) RETURNING id INTO lC;
  INSERT INTO eval_grid_levels (grid_id, code, label, sort_order) VALUES (grid_id, 'D', 'Peu satisfaisant', 4) RETURNING id INTO lD;
  INSERT INTO eval_grid_levels (grid_id, code, label, sort_order) VALUES (grid_id, 'E', 'Insuffisant',      5) RETURNING id INTO lE;

  INSERT INTO eval_grid_criteria (grid_id, label, sort_order) VALUES (grid_id, 'Lire l''organisation d''une société dans le temps',           1) RETURNING id INTO c1;
  INSERT INTO eval_grid_criteria (grid_id, label, sort_order) VALUES (grid_id, 'Lire l''organisation d''une société dans l''espace',          2) RETURNING id INTO c2;
  INSERT INTO eval_grid_criteria (grid_id, label, sort_order) VALUES (grid_id, 'Lire l''organisation d''une société à partir de ses réalités sociales', 3) RETURNING id INTO c3;
  INSERT INTO eval_grid_criteria (grid_id, label, sort_order) VALUES (grid_id, 'Interpréter des documents variés',                           4) RETURNING id INTO c4;
  INSERT INTO eval_grid_criteria (grid_id, label, sort_order) VALUES (grid_id, 'Utiliser un vocabulaire disciplinaire approprié',            5) RETURNING id INTO c5;
  INSERT INTO eval_grid_criteria (grid_id, label, sort_order) VALUES (grid_id, 'Formuler une interprétation ou une conclusion historique/géographique', 6) RETURNING id INTO c6;

  INSERT INTO eval_grid_cells (criterion_id, level_id, descriptor) VALUES
    (c1, lA, 'Situe avec précision les événements; utilise correctement les repères temporels; explique clairement les changements et continuités.'),
    (c1, lB, 'Situe bien les événements; utilise des repères temporels adéquats; explique quelques changements.'),
    (c1, lC, 'Situe les événements de façon générale; repères temporels simples; explications limitées.'),
    (c1, lD, 'Difficulté à situer les événements; repères temporels imprécis; explications faibles.'),
    (c1, lE, 'Ne parvient pas à situer les événements ni à utiliser les repères temporels.'),

    (c2, lA, 'Lit et interprète une carte avec aisance; localise précisément; explique clairement les liens entre territoire et activités humaines.'),
    (c2, lB, 'Lit bien une carte; localise correctement; établit quelques liens pertinents.'),
    (c2, lC, 'Lit une carte simple; localise de façon générale; liens limités.'),
    (c2, lD, 'Difficulté à lire une carte; localisation imprécise; liens faibles ou absents.'),
    (c2, lE, 'Ne parvient pas à lire une carte ni à localiser des éléments.'),

    (c3, lA, 'Analyse plusieurs documents avec précision; dégage des informations pertinentes; compare efficacement des réalités sociales.'),
    (c3, lB, 'Analyse adéquate; repère des informations pertinentes; comparaison simple mais juste.'),
    (c3, lC, 'Analyse de base; repère quelques informations; comparaison limitée.'),
    (c3, lD, 'Analyse incomplète; repères imprécis; comparaison faible.'),
    (c3, lE, 'Ne parvient pas à analyser les documents ni à dégager des informations.'),

    (c4, lA, 'Interprète avec précision divers types de documents (textes, images, cartes, graphiques, tableaux); fait des liens pertinents entre eux.'),
    (c4, lB, 'Interprète bien les documents; liens simples mais présents.'),
    (c4, lC, 'Interprétation correcte de documents simples; liens limités.'),
    (c4, lD, 'Interprétation partielle ou imprécise.'),
    (c4, lE, 'Ne parvient pas à interpréter les documents.'),

    (c5, lA, 'Utilise un vocabulaire riche, précis et approprié (territoire, société, repère, continuité, changement, activité, ressource).'),
    (c5, lB, 'Utilise plusieurs termes disciplinaires adéquats.'),
    (c5, lC, 'Utilise quelques mots disciplinaires simples.'),
    (c5, lD, 'Vocabulaire limité ou imprécis.'),
    (c5, lE, 'N''utilise aucun vocabulaire disciplinaire.'),

    (c6, lA, 'Formule une interprétation claire, cohérente et bien justifiée.'),
    (c6, lB, 'Interprétation pertinente; justification simple mais adéquate.'),
    (c6, lC, 'Interprétation présente mais justification limitée.'),
    (c6, lD, 'Interprétation vague ou difficile à suivre.'),
    (c6, lE, 'Aucune interprétation formulée.');

END $$;
