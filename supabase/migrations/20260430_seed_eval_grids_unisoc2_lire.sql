-- ============================================================
-- PLANIPROF -- Seed: Grille d'évaluation – Lire, Univers social 2e cycle
-- ============================================================

DO $$
DECLARE
  grid_id uuid;
  unisoc_id int;
  p3 int; p4 int;
  lA int; lB int; lC int; lD int; lE int;
  c1 uuid; c2 uuid; c3 uuid; c4 uuid; c5 uuid; c6 uuid;
BEGIN

  SELECT id INTO unisoc_id FROM subjects WHERE slug = 'univers-social';
  SELECT id INTO p3 FROM grade_levels WHERE education_level = 'primaire' AND grade = 3;
  SELECT id INTO p4 FROM grade_levels WHERE education_level = 'primaire' AND grade = 4;

  INSERT INTO eval_grids (title, subject_id, cycle_label, source, is_baseline, competency)
    VALUES (
      'Grille d''évaluation – Compétence : Lire (Univers social – 2e cycle)',
      unisoc_id,
      '2e cycle du primaire',
      'Planiprof',
      true,
      'Lire l''organisation d''une société sur son territoire'
    )
    RETURNING id INTO grid_id;

  INSERT INTO eval_grid_grades VALUES (grid_id, p3), (grid_id, p4);

  INSERT INTO eval_grid_levels (grid_id, code, label, sort_order) VALUES (grid_id, 'A', 'Excellent',        1) RETURNING id INTO lA;
  INSERT INTO eval_grid_levels (grid_id, code, label, sort_order) VALUES (grid_id, 'B', 'Très bien',        2) RETURNING id INTO lB;
  INSERT INTO eval_grid_levels (grid_id, code, label, sort_order) VALUES (grid_id, 'C', 'Acceptable',       3) RETURNING id INTO lC;
  INSERT INTO eval_grid_levels (grid_id, code, label, sort_order) VALUES (grid_id, 'D', 'Peu satisfaisant', 4) RETURNING id INTO lD;
  INSERT INTO eval_grid_levels (grid_id, code, label, sort_order) VALUES (grid_id, 'E', 'Insuffisant',      5) RETURNING id INTO lE;

  INSERT INTO eval_grid_criteria (grid_id, label, sort_order) VALUES (grid_id, 'Lire l''organisation d''une société dans le temps',           1) RETURNING id INTO c1;
  INSERT INTO eval_grid_criteria (grid_id, label, sort_order) VALUES (grid_id, 'Lire l''organisation d''une société dans l''espace',          2) RETURNING id INTO c2;
  INSERT INTO eval_grid_criteria (grid_id, label, sort_order) VALUES (grid_id, 'Lire l''organisation d''une société à partir de ses réalités sociales', 3) RETURNING id INTO c3;
  INSERT INTO eval_grid_criteria (grid_id, label, sort_order) VALUES (grid_id, 'Interpréter des documents variés',                           4) RETURNING id INTO c4;
  INSERT INTO eval_grid_criteria (grid_id, label, sort_order) VALUES (grid_id, 'Utiliser un vocabulaire disciplinaire simple',               5) RETURNING id INTO c5;
  INSERT INTO eval_grid_criteria (grid_id, label, sort_order) VALUES (grid_id, 'Formuler une conclusion simple à partir des informations',   6) RETURNING id INTO c6;

  INSERT INTO eval_grid_cells (criterion_id, level_id, descriptor) VALUES
    (c1, lA, 'Situe correctement les événements; utilise des repères temporels simples; explique clairement un changement ou une continuité.'),
    (c1, lB, 'Situe bien les événements; utilise quelques repères temporels; explique un changement simple.'),
    (c1, lC, 'Situe les événements de façon générale; repères temporels limités; explication simple.'),
    (c1, lD, 'Difficulté à situer les événements; repères temporels imprécis; explication faible.'),
    (c1, lE, 'Ne parvient pas à situer les événements ni à utiliser des repères temporels.'),

    (c2, lA, 'Lit une carte simple; localise correctement; explique un lien clair entre territoire et activités humaines.'),
    (c2, lB, 'Lit bien une carte; localise adéquatement; établit un lien simple.'),
    (c2, lC, 'Lit une carte de base; localisation générale; lien limité.'),
    (c2, lD, 'Difficulté à lire une carte; localisation imprécise; lien faible.'),
    (c2, lE, 'Ne parvient pas à lire une carte ni à localiser des éléments.'),

    (c3, lA, 'Analyse un document simple; repère des informations pertinentes; compare deux réalités sociales de façon claire.'),
    (c3, lB, 'Analyse adéquate; repère quelques informations; comparaison simple.'),
    (c3, lC, 'Analyse de base; repère une information; comparaison limitée.'),
    (c3, lD, 'Analyse incomplète; repères imprécis; comparaison faible.'),
    (c3, lE, 'Ne parvient pas à analyser un document ni à dégager des informations.'),

    (c4, lA, 'Interprète correctement différents types de documents (images, textes courts, cartes simples, tableaux); fait un lien pertinent entre eux.'),
    (c4, lB, 'Interprète bien un document; lien simple présent.'),
    (c4, lC, 'Interprétation correcte d''un document simple; lien limité.'),
    (c4, lD, 'Interprétation partielle ou imprécise.'),
    (c4, lE, 'Ne parvient pas à interpréter les documents.'),

    (c5, lA, 'Utilise plusieurs mots disciplinaires justes et appropriés (territoire, société, repère, activité, ressource, changement).'),
    (c5, lB, 'Utilise quelques mots disciplinaires adéquats.'),
    (c5, lC, 'Utilise un mot disciplinaire simple.'),
    (c5, lD, 'Vocabulaire limité ou imprécis.'),
    (c5, lE, 'N''utilise aucun vocabulaire disciplinaire.'),

    (c6, lA, 'Formule une conclusion claire et cohérente; justification simple mais pertinente.'),
    (c6, lB, 'Conclusion pertinente; justification partielle.'),
    (c6, lC, 'Conclusion présente mais justification limitée.'),
    (c6, lD, 'Conclusion vague ou difficile à comprendre.'),
    (c6, lE, 'Aucune conclusion formulée.');

END $$;
