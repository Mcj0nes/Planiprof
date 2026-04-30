-- ============================================================
-- PLANIPROF -- Seed: Grilles d'évaluation – Univers social
-- C1 : Lire l'organisation d'une société sur son territoire
-- C2 : Interpréter le changement dans une société et sur son territoire
-- C3 : S'ouvrir à la diversité des sociétés et de leur territoire
-- 2e et 3e cycles du primaire (grades 3–6)
-- Sources : Cadre d'évaluation des apprentissages – Géographie, histoire
-- et éducation à la citoyenneté, primaire, MEQ, 2011. PFÉQ chap. 7, MEQ
-- 2001. Précisions MELS 2011. RÉCIT univers social.
-- ============================================================

DO $$
DECLARE
  g1_id uuid; g2_id uuid; g3_id uuid;
  us_id int;
  p3 int; p4 int; p5 int; p6 int;
  lA int; lB int; lC int; lD int; lE int;
  c1 uuid; c2 uuid; c3 uuid; c4 uuid;
BEGIN

  SELECT id INTO us_id FROM subjects WHERE slug = 'univers-social';
  SELECT id INTO p3 FROM grade_levels WHERE education_level = 'primaire' AND grade = 3;
  SELECT id INTO p4 FROM grade_levels WHERE education_level = 'primaire' AND grade = 4;
  SELECT id INTO p5 FROM grade_levels WHERE education_level = 'primaire' AND grade = 5;
  SELECT id INTO p6 FROM grade_levels WHERE education_level = 'primaire' AND grade = 6;

  -- ──────────────────────────────────────────────────────────
  -- C1 : Lire l'organisation d'une société sur son territoire
  -- ──────────────────────────────────────────────────────────

  INSERT INTO eval_grids (title, subject_id, cycle_label, source, is_baseline, competency)
    VALUES (
      'Grille d''évaluation – Univers social : C1 – Lire l''organisation d''une société sur son territoire',
      us_id,
      '2e et 3e cycles du primaire',
      'Cadre d''évaluation des apprentissages – Géographie, histoire et éducation à la citoyenneté, primaire, MEQ, 2011. PFÉQ chapitre 7, MEQ, 2001. Précisions MELS, 2011. RÉCIT univers social.',
      true,
      'C1 – Lire l''organisation d''une société sur son territoire'
    )
    RETURNING id INTO g1_id;

  INSERT INTO eval_grid_grades VALUES (g1_id, p3), (g1_id, p4), (g1_id, p5), (g1_id, p6);

  INSERT INTO eval_grid_levels (grid_id, code, label, sort_order) VALUES (g1_id, 'A', 'Excellent',        1) RETURNING id INTO lA;
  INSERT INTO eval_grid_levels (grid_id, code, label, sort_order) VALUES (g1_id, 'B', 'Très bien',        2) RETURNING id INTO lB;
  INSERT INTO eval_grid_levels (grid_id, code, label, sort_order) VALUES (g1_id, 'C', 'Acceptable',       3) RETURNING id INTO lC;
  INSERT INTO eval_grid_levels (grid_id, code, label, sort_order) VALUES (g1_id, 'D', 'Peu satisfaisant', 4) RETURNING id INTO lD;
  INSERT INTO eval_grid_levels (grid_id, code, label, sort_order) VALUES (g1_id, 'E', 'Insuffisant',      5) RETURNING id INTO lE;

  INSERT INTO eval_grid_criteria (grid_id, label, weight, sort_order)
    VALUES (g1_id, 'Maîtrise des connaissances ciblées par la progression des apprentissages', NULL, 1) RETURNING id INTO c1;
  INSERT INTO eval_grid_criteria (grid_id, label, weight, sort_order)
    VALUES (g1_id, 'Situer dans le temps et dans l''espace', NULL, 2) RETURNING id INTO c2;
  INSERT INTO eval_grid_criteria (grid_id, label, weight, sort_order)
    VALUES (g1_id, 'Établir des faits / Caractériser un territoire', NULL, 3) RETURNING id INTO c3;
  INSERT INTO eval_grid_criteria (grid_id, label, weight, sort_order)
    VALUES (g1_id, 'Établir des liens entre la société et son territoire', NULL, 4) RETURNING id INTO c4;

  INSERT INTO eval_grid_cells (criterion_id, level_id, descriptor) VALUES
    (c1, lA, 'L''élève démontre une maîtrise approfondie des connaissances liées à l''organisation de la société à l''étude (personnages, événements, modes de vie, activités économiques, organisation politique, aspects culturels, territoriaux). Il répond correctement et avec précision aux questions de connaissances factuelles.'),
    (c1, lB, 'L''élève démontre une bonne maîtrise de la plupart des connaissances liées à l''organisation de la société à l''étude. Il répond correctement à la majorité des questions de connaissances factuelles.'),
    (c1, lC, 'L''élève démontre une maîtrise partielle des connaissances liées à l''organisation de la société. Il répond correctement à plusieurs questions factuelles, mais commet des erreurs ou des oublis sur certains éléments.'),
    (c1, lD, 'L''élève démontre une maîtrise insuffisante des connaissances. Il répond correctement à quelques questions factuelles seulement. Plusieurs connaissances sont absentes ou erronées.'),
    (c1, lE, 'L''élève ne démontre pas de maîtrise des connaissances liées à la société à l''étude. Les réponses sont absentes, erronées ou incohérentes.'),

    (c2, lA, 'L''élève situe avec précision la société à l''étude dans le temps (époque, dates, séquence chronologique) et dans l''espace (territoire, localisation, frontières). Il utilise correctement les repères temporels et spatiaux (lignes du temps, cartes).'),
    (c2, lB, 'L''élève situe adéquatement la société dans le temps et dans l''espace. Il utilise la plupart des repères temporels et spatiaux de manière correcte.'),
    (c2, lC, 'L''élève situe partiellement la société dans le temps et dans l''espace. Certains repères temporels ou spatiaux sont imprécis ou incomplets.'),
    (c2, lD, 'L''élève situe difficilement la société dans le temps et dans l''espace. Les repères temporels et spatiaux sont souvent incorrects ou absents.'),
    (c2, lE, 'L''élève ne parvient pas à situer la société dans le temps ou dans l''espace.'),

    (c3, lA, 'L''élève établit correctement tous les faits pertinents relatifs à la société et à son territoire. Il caractérise le territoire avec précision (ressources, climat, relief, hydrographie) et décrit les liens entre le territoire et l''organisation de la société. Il justifie ses réponses à l''aide d''exemples et de documents.'),
    (c3, lB, 'L''élève établit correctement la majorité des faits pertinents et caractérise le territoire de manière adéquate. Il propose une justification généralement cohérente.'),
    (c3, lC, 'L''élève établit correctement certains faits pertinents et caractérise le territoire de manière partielle. La justification manque parfois de cohérence ou de précision.'),
    (c3, lD, 'L''élève établit peu de faits pertinents et caractérise le territoire de manière superficielle. La justification manque souvent de cohérence.'),
    (c3, lE, 'L''élève n''établit pas les faits pertinents ou les établit incorrectement. Le territoire n''est pas caractérisé. Aucune justification n''est proposée ou celle-ci est incohérente.'),

    (c4, lA, 'L''élève établit des liens pertinents, complets et bien justifiés entre les caractéristiques de la société (modes de vie, activités économiques, organisation politique) et l''aménagement de son territoire. Il utilise un vocabulaire précis lié à la géographie et à l''histoire.'),
    (c4, lB, 'L''élève établit des liens généralement pertinents entre la société et son territoire. La justification est adéquate et le vocabulaire est approprié.'),
    (c4, lC, 'L''élève établit quelques liens entre la société et son territoire, mais ceux-ci sont parfois imprécis ou incomplets. Le vocabulaire est peu précis.'),
    (c4, lD, 'L''élève établit peu de liens entre la société et son territoire. Les liens sont souvent incorrects ou vagues.'),
    (c4, lE, 'L''élève n''établit pas de liens entre la société et son territoire ou les liens proposés sont incohérents.');

  -- ──────────────────────────────────────────────────────────
  -- C2 : Interpréter le changement dans une société
  -- ──────────────────────────────────────────────────────────

  INSERT INTO eval_grids (title, subject_id, cycle_label, source, is_baseline, competency)
    VALUES (
      'Grille d''évaluation – Univers social : C2 – Interpréter le changement dans une société et sur son territoire',
      us_id,
      '2e et 3e cycles du primaire',
      'Cadre d''évaluation des apprentissages – Géographie, histoire et éducation à la citoyenneté, primaire, MEQ, 2011. PFÉQ chapitre 7, MEQ, 2001. Précisions MELS, 2011. RÉCIT univers social.',
      true,
      'C2 – Interpréter le changement dans une société et sur son territoire'
    )
    RETURNING id INTO g2_id;

  INSERT INTO eval_grid_grades VALUES (g2_id, p3), (g2_id, p4), (g2_id, p5), (g2_id, p6);

  INSERT INTO eval_grid_levels (grid_id, code, label, sort_order) VALUES (g2_id, 'A', 'Excellent',        1) RETURNING id INTO lA;
  INSERT INTO eval_grid_levels (grid_id, code, label, sort_order) VALUES (g2_id, 'B', 'Très bien',        2) RETURNING id INTO lB;
  INSERT INTO eval_grid_levels (grid_id, code, label, sort_order) VALUES (g2_id, 'C', 'Acceptable',       3) RETURNING id INTO lC;
  INSERT INTO eval_grid_levels (grid_id, code, label, sort_order) VALUES (g2_id, 'D', 'Peu satisfaisant', 4) RETURNING id INTO lD;
  INSERT INTO eval_grid_levels (grid_id, code, label, sort_order) VALUES (g2_id, 'E', 'Insuffisant',      5) RETURNING id INTO lE;

  INSERT INTO eval_grid_criteria (grid_id, label, weight, sort_order)
    VALUES (g2_id, 'Maîtrise des connaissances ciblées par la progression des apprentissages', NULL, 1) RETURNING id INTO c1;
  INSERT INTO eval_grid_criteria (grid_id, label, weight, sort_order)
    VALUES (g2_id, 'Déterminer des changements', NULL, 2) RETURNING id INTO c2;
  INSERT INTO eval_grid_criteria (grid_id, label, weight, sort_order)
    VALUES (g2_id, 'Mettre en relation des faits / Établir des liens de causalité', NULL, 3) RETURNING id INTO c3;
  INSERT INTO eval_grid_criteria (grid_id, label, weight, sort_order)
    VALUES (g2_id, 'Interprétation et communication du changement', NULL, 4) RETURNING id INTO c4;

  INSERT INTO eval_grid_cells (criterion_id, level_id, descriptor) VALUES
    (c1, lA, 'L''élève démontre une maîtrise approfondie des connaissances liées aux changements survenus dans la société à l''étude (événements marquants, personnages, transformations sociales, politiques, économiques, culturelles et territoriales). Il répond correctement et avec précision aux questions de connaissances factuelles.'),
    (c1, lB, 'L''élève démontre une bonne maîtrise de la plupart des connaissances liées aux changements dans la société à l''étude. Il répond correctement à la majorité des questions factuelles.'),
    (c1, lC, 'L''élève démontre une maîtrise partielle des connaissances liées aux changements. Il répond correctement à plusieurs questions factuelles, mais commet des erreurs ou des oublis.'),
    (c1, lD, 'L''élève démontre une maîtrise insuffisante des connaissances. Il répond correctement à quelques questions factuelles seulement.'),
    (c1, lE, 'L''élève ne démontre pas de maîtrise des connaissances liées aux changements dans la société. Les réponses sont absentes, erronées ou incohérentes.'),

    (c2, lA, 'L''élève détermine avec précision tous les changements pertinents survenus dans la société et sur son territoire entre deux époques. Il distingue clairement les éléments de continuité des éléments de changement. Il justifie ses réponses à l''aide d''exemples et de documents.'),
    (c2, lB, 'L''élève détermine correctement la majorité des changements pertinents et distingue généralement les éléments de continuité et de changement. La justification est adéquate.'),
    (c2, lC, 'L''élève détermine certains changements pertinents, mais omet des éléments importants ou confond parfois continuité et changement. La justification manque parfois de cohérence.'),
    (c2, lD, 'L''élève détermine peu de changements pertinents. Il a de la difficulté à distinguer la continuité du changement. La justification manque souvent de cohérence.'),
    (c2, lE, 'L''élève ne détermine pas les changements ou les identifie incorrectement. Aucune justification n''est proposée ou celle-ci est incohérente.'),

    (c3, lA, 'L''élève met en relation des faits de manière pertinente et complète. Il établit correctement les liens de causalité entre les événements, les actions des personnages et les transformations de la société et de son territoire. Il explique les causes et les conséquences des changements avec rigueur.'),
    (c3, lB, 'L''élève met en relation la plupart des faits pertinents et établit des liens de causalité généralement corrects. L''explication des causes et des conséquences est adéquate.'),
    (c3, lC, 'L''élève met en relation plusieurs faits, mais les liens de causalité sont parfois imprécis ou incomplets. L''explication des causes et des conséquences est partielle.'),
    (c3, lD, 'L''élève met en relation quelques faits, mais les liens de causalité sont souvent incorrects ou absents. L''explication des causes et des conséquences est insuffisante.'),
    (c3, lE, 'L''élève ne met pas en relation les faits ou les liens de causalité proposés sont incohérents.'),

    (c4, lA, 'L''élève formule une interprétation claire, cohérente et bien appuyée du changement survenu dans la société. Il communique ses constats à l''aide d''un vocabulaire précis lié à l''histoire et à la géographie. Ses traces (textes, schémas, lignes du temps) sont complètes et structurées.'),
    (c4, lB, 'L''élève formule une interprétation adéquate du changement. Il communique ses constats à l''aide d''un vocabulaire approprié. Ses traces sont organisées, bien que certains éléments soient implicites.'),
    (c4, lC, 'L''élève formule une interprétation partielle du changement. Le vocabulaire est peu précis. Ses traces sont peu organisées ou incomplètes.'),
    (c4, lD, 'L''élève formule une interprétation vague ou peu appuyée du changement. Le vocabulaire est imprécis. Ses traces sont confuses ou isolées.'),
    (c4, lE, 'L''élève ne formule pas d''interprétation du changement ou celle-ci est incohérente. Aucune trace pertinente n''est laissée.');

  -- ──────────────────────────────────────────────────────────
  -- C3 : S'ouvrir à la diversité des sociétés
  -- ──────────────────────────────────────────────────────────

  INSERT INTO eval_grids (title, subject_id, cycle_label, source, is_baseline, competency)
    VALUES (
      'Grille d''évaluation – Univers social : C3 – S''ouvrir à la diversité des sociétés et de leur territoire',
      us_id,
      '2e et 3e cycles du primaire',
      'Cadre d''évaluation des apprentissages – Géographie, histoire et éducation à la citoyenneté, primaire, MEQ, 2011. PFÉQ chapitre 7, MEQ, 2001. Précisions MELS, 2011. RÉCIT univers social.',
      true,
      'C3 – S''ouvrir à la diversité des sociétés et de leur territoire'
    )
    RETURNING id INTO g3_id;

  INSERT INTO eval_grid_grades VALUES (g3_id, p3), (g3_id, p4), (g3_id, p5), (g3_id, p6);

  INSERT INTO eval_grid_levels (grid_id, code, label, sort_order) VALUES (g3_id, 'A', 'Excellent',        1) RETURNING id INTO lA;
  INSERT INTO eval_grid_levels (grid_id, code, label, sort_order) VALUES (g3_id, 'B', 'Très bien',        2) RETURNING id INTO lB;
  INSERT INTO eval_grid_levels (grid_id, code, label, sort_order) VALUES (g3_id, 'C', 'Acceptable',       3) RETURNING id INTO lC;
  INSERT INTO eval_grid_levels (grid_id, code, label, sort_order) VALUES (g3_id, 'D', 'Peu satisfaisant', 4) RETURNING id INTO lD;
  INSERT INTO eval_grid_levels (grid_id, code, label, sort_order) VALUES (g3_id, 'E', 'Insuffisant',      5) RETURNING id INTO lE;

  INSERT INTO eval_grid_criteria (grid_id, label, weight, sort_order)
    VALUES (g3_id, 'Maîtrise des connaissances ciblées par la progression des apprentissages', NULL, 1) RETURNING id INTO c1;
  INSERT INTO eval_grid_criteria (grid_id, label, weight, sort_order)
    VALUES (g3_id, 'Établir des comparaisons', NULL, 2) RETURNING id INTO c2;
  INSERT INTO eval_grid_criteria (grid_id, label, weight, sort_order)
    VALUES (g3_id, 'Caractériser un territoire / Établir des liens entre la société et son territoire', NULL, 3) RETURNING id INTO c3;
  INSERT INTO eval_grid_criteria (grid_id, label, weight, sort_order)
    VALUES (g3_id, 'Ouverture à la diversité et communication', NULL, 4) RETURNING id INTO c4;

  INSERT INTO eval_grid_cells (criterion_id, level_id, descriptor) VALUES
    (c1, lA, 'L''élève démontre une maîtrise approfondie des connaissances liées aux sociétés comparées (caractéristiques sociales, politiques, économiques, culturelles et territoriales des deux sociétés à l''étude). Il répond correctement et avec précision aux questions de connaissances factuelles.'),
    (c1, lB, 'L''élève démontre une bonne maîtrise de la plupart des connaissances liées aux sociétés comparées. Il répond correctement à la majorité des questions factuelles.'),
    (c1, lC, 'L''élève démontre une maîtrise partielle des connaissances liées aux sociétés comparées. Il répond correctement à plusieurs questions factuelles, mais commet des erreurs ou des oublis.'),
    (c1, lD, 'L''élève démontre une maîtrise insuffisante des connaissances. Il répond correctement à quelques questions factuelles seulement.'),
    (c1, lE, 'L''élève ne démontre pas de maîtrise des connaissances liées aux sociétés comparées. Les réponses sont absentes, erronées ou incohérentes.'),

    (c2, lA, 'L''élève établit des comparaisons précises, pertinentes et complètes entre les deux sociétés à l''étude. Il identifie correctement toutes les ressemblances et les différences significatives sur les plans social, politique, économique, culturel et territorial.'),
    (c2, lB, 'L''élève établit des comparaisons adéquates entre les deux sociétés. Il identifie la plupart des ressemblances et des différences significatives.'),
    (c2, lC, 'L''élève établit certaines comparaisons entre les deux sociétés, mais elles sont parfois incomplètes ou imprécises. Il identifie plusieurs ressemblances et différences, mais en omet certaines.'),
    (c2, lD, 'L''élève établit peu de comparaisons entre les deux sociétés. Les ressemblances et différences identifiées sont vagues ou peu pertinentes.'),
    (c2, lE, 'L''élève n''établit pas de comparaisons entre les deux sociétés ou les comparaisons proposées sont incorrectes ou incohérentes.'),

    (c3, lA, 'L''élève caractérise avec précision le territoire de chacune des sociétés comparées. Il établit des liens clairs et pertinents entre les atouts et contraintes du territoire et l''organisation de chaque société (mode de vie, activités économiques, occupation du territoire). Il explique avec rigueur comment le territoire influence les différences et les ressemblances entre les sociétés.'),
    (c3, lB, 'L''élève caractérise adéquatement le territoire des sociétés comparées. Il établit des liens généralement corrects entre le territoire et l''organisation de chaque société.'),
    (c3, lC, 'L''élève caractérise partiellement le territoire des sociétés comparées. Les liens entre le territoire et l''organisation de la société sont parfois imprécis ou incomplets.'),
    (c3, lD, 'L''élève caractérise peu le territoire des sociétés. Les liens entre le territoire et la société sont vagues ou peu pertinents.'),
    (c3, lE, 'L''élève ne caractérise pas le territoire des sociétés ou les liens proposés sont incohérents.'),

    (c4, lA, 'L''élève démontre une ouverture réfléchie à la diversité des sociétés. Il reconnaît et respecte les différences entre les sociétés dans ses constats. Il communique ses observations à l''aide d''un vocabulaire précis lié à l''histoire et à la géographie. Ses traces (textes, tableaux comparatifs, schémas) sont complètes et structurées.'),
    (c4, lB, 'L''élève démontre une bonne ouverture à la diversité des sociétés. Il communique ses observations à l''aide d''un vocabulaire approprié. Ses traces sont organisées, bien que certains éléments soient implicites.'),
    (c4, lC, 'L''élève démontre une ouverture partielle à la diversité des sociétés. Le vocabulaire est peu précis. Ses traces sont peu organisées ou incomplètes.'),
    (c4, lD, 'L''élève démontre une ouverture limitée à la diversité. Le vocabulaire est imprécis. Ses traces sont confuses ou isolées.'),
    (c4, lE, 'L''élève ne démontre pas d''ouverture à la diversité des sociétés. Aucune trace pertinente n''est laissée.');

END $$;
