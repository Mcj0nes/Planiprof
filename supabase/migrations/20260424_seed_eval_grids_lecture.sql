-- ============================================================
-- PLANIPROF -- Seed: Grilles d'évaluation – Français, lecture
-- Compétence : Lire des textes variés
-- 1er cycle (grades 1–2) / 2e cycle (grades 3–4) / 3e cycle (grades 5–6)
-- Sources : Cadre d'évaluation des apprentissages – Français, langue
-- d'enseignement, primaire, MEQ, 2011. PFÉQ, MEQ, 2001. Progression
-- des apprentissages – Français, MELS, 2009.
-- ============================================================

DO $$
DECLARE
  g1_id uuid; g2_id uuid; g3_id uuid;
  fr_id int;
  p1 int; p2 int; p3 int; p4 int; p5 int; p6 int;
  lA int; lB int; lC int; lD int; lE int;
  c1 uuid; c2 uuid; c3 uuid; c4 uuid;
BEGIN

  SELECT id INTO fr_id FROM subjects WHERE slug = 'francais';
  SELECT id INTO p1 FROM grade_levels WHERE education_level = 'primaire' AND grade = 1;
  SELECT id INTO p2 FROM grade_levels WHERE education_level = 'primaire' AND grade = 2;
  SELECT id INTO p3 FROM grade_levels WHERE education_level = 'primaire' AND grade = 3;
  SELECT id INTO p4 FROM grade_levels WHERE education_level = 'primaire' AND grade = 4;
  SELECT id INTO p5 FROM grade_levels WHERE education_level = 'primaire' AND grade = 5;
  SELECT id INTO p6 FROM grade_levels WHERE education_level = 'primaire' AND grade = 6;

  -- ──────────────────────────────────────────────────────────
  -- 1er cycle (grades 1–2) – 3 dimensions
  -- ──────────────────────────────────────────────────────────

  INSERT INTO eval_grids (title, subject_id, cycle_label, source, is_baseline, competency)
    VALUES (
      'Grille d''évaluation en lecture – 1er cycle',
      fr_id,
      '1er cycle du primaire',
      'Cadre d''évaluation des apprentissages – Français, langue d''enseignement, primaire, MEQ, 2011. PFÉQ, MEQ, 2001. Progression des apprentissages – Français, MELS, 2009. Note : l''interprétation plausible n''est pas formellement évaluée au 1er cycle (Annexe I du Cadre d''évaluation).',
      true,
      'Lire des textes variés'
    )
    RETURNING id INTO g1_id;

  INSERT INTO eval_grid_grades VALUES (g1_id, p1), (g1_id, p2);

  INSERT INTO eval_grid_levels (grid_id, code, label, sort_order) VALUES (g1_id, 'A', 'Excellent',        1) RETURNING id INTO lA;
  INSERT INTO eval_grid_levels (grid_id, code, label, sort_order) VALUES (g1_id, 'B', 'Très bien',        2) RETURNING id INTO lB;
  INSERT INTO eval_grid_levels (grid_id, code, label, sort_order) VALUES (g1_id, 'C', 'Acceptable',       3) RETURNING id INTO lC;
  INSERT INTO eval_grid_levels (grid_id, code, label, sort_order) VALUES (g1_id, 'D', 'Peu satisfaisant', 4) RETURNING id INTO lD;
  INSERT INTO eval_grid_levels (grid_id, code, label, sort_order) VALUES (g1_id, 'E', 'Insuffisant',      5) RETURNING id INTO lE;

  INSERT INTO eval_grid_criteria (grid_id, label, weight, sort_order)
    VALUES (g1_id, 'Compréhension des éléments significatifs d''un texte', NULL, 1) RETURNING id INTO c1;
  INSERT INTO eval_grid_criteria (grid_id, label, weight, sort_order)
    VALUES (g1_id, 'Réaction pertinente à un texte (justification)', NULL, 2) RETURNING id INTO c2;
  INSERT INTO eval_grid_criteria (grid_id, label, weight, sort_order)
    VALUES (g1_id, 'Jugement critique sur des textes littéraires et courants (premières impressions)', NULL, 3) RETURNING id INTO c3;

  INSERT INTO eval_grid_cells (criterion_id, level_id, descriptor) VALUES
    (c1, lA, 'L''élève démontre une compréhension approfondie du texte. Il repère tous les éléments d''information explicites pertinents (personnages, lieux, temps, événements principaux). Il suit la séquence des événements et fait des liens entre les éléments du texte. Il répond correctement aux questions sur le texte.'),
    (c1, lB, 'L''élève démontre une compréhension adéquate du texte. Il repère la plupart des éléments d''information explicites pertinents et suit généralement la séquence des événements.'),
    (c1, lC, 'L''élève démontre une compréhension partielle du texte. Il repère plusieurs éléments d''information explicites, mais omet certains éléments importants ou confond l''ordre des événements.'),
    (c1, lD, 'L''élève démontre une compréhension superficielle du texte. Il repère quelques éléments d''information explicites de façon isolée. La séquence des événements est mal comprise.'),
    (c1, lE, 'L''élève ne démontre pas une compréhension du texte. Les éléments d''information pertinents ne sont pas repérés ou sont confondus.'),

    (c2, lA, 'L''élève exprime des réactions pertinentes et personnelles au texte (ce qu''il a aimé ou non, ce qui l''a surpris, ce qui lui rappelle son vécu). Il justifie ses réactions en s''appuyant sur des éléments du texte et sur des exemples tirés de son expérience personnelle.'),
    (c2, lB, 'L''élève exprime des réactions pertinentes au texte. Il justifie ses réactions en s''appuyant sur quelques éléments du texte ou sur son expérience personnelle.'),
    (c2, lC, 'L''élève exprime quelques réactions en lien avec le texte, mais la justification est partielle. Il a de la difficulté à nommer précisément ce qui a motivé sa réaction.'),
    (c2, lD, 'L''élève exprime des réactions vagues ou peu en lien avec le texte. La justification est absente ou ne s''appuie sur aucun élément du texte.'),
    (c2, lE, 'L''élève n''exprime pas de réaction au texte ou ses réactions n''ont pas de lien avec le contenu du texte.'),

    (c3, lA, 'L''élève exprime son appréciation du texte en s''appuyant sur ses premières impressions et sur des éléments observables (illustrations, choix de mots, personnages, fin de l''histoire). Il commence à dire pourquoi il a aimé ou non le texte en donnant des raisons simples mais pertinentes.'),
    (c3, lB, 'L''élève exprime son appréciation du texte en s''appuyant sur ses premières impressions. Il nomme quelques éléments du texte pour expliquer son jugement.'),
    (c3, lC, 'L''élève exprime une appréciation simple du texte (« j''ai aimé » ou « je n''ai pas aimé »), mais donne peu de raisons ou s''appuie sur peu d''éléments du texte.'),
    (c3, lD, 'L''élève exprime une appréciation très vague ou sans lien avec le texte. Il ne parvient pas à nommer de raisons pour son jugement.'),
    (c3, lE, 'L''élève n''exprime pas d''appréciation du texte ou ne parvient pas à formuler un jugement, même simple.');

  -- ──────────────────────────────────────────────────────────
  -- 2e cycle (grades 3–4) – 4 dimensions
  -- ──────────────────────────────────────────────────────────

  INSERT INTO eval_grids (title, subject_id, cycle_label, source, is_baseline, competency)
    VALUES (
      'Grille d''évaluation en lecture – 2e cycle',
      fr_id,
      '2e cycle du primaire',
      'Cadre d''évaluation des apprentissages – Français, langue d''enseignement, primaire, MEQ, 2011. PFÉQ, MEQ, 2001. Progression des apprentissages – Français, MELS, 2009.',
      true,
      'Lire des textes variés'
    )
    RETURNING id INTO g2_id;

  INSERT INTO eval_grid_grades VALUES (g2_id, p3), (g2_id, p4);

  INSERT INTO eval_grid_levels (grid_id, code, label, sort_order) VALUES (g2_id, 'A', 'Excellent',        1) RETURNING id INTO lA;
  INSERT INTO eval_grid_levels (grid_id, code, label, sort_order) VALUES (g2_id, 'B', 'Très bien',        2) RETURNING id INTO lB;
  INSERT INTO eval_grid_levels (grid_id, code, label, sort_order) VALUES (g2_id, 'C', 'Acceptable',       3) RETURNING id INTO lC;
  INSERT INTO eval_grid_levels (grid_id, code, label, sort_order) VALUES (g2_id, 'D', 'Peu satisfaisant', 4) RETURNING id INTO lD;
  INSERT INTO eval_grid_levels (grid_id, code, label, sort_order) VALUES (g2_id, 'E', 'Insuffisant',      5) RETURNING id INTO lE;

  INSERT INTO eval_grid_criteria (grid_id, label, weight, sort_order)
    VALUES (g2_id, 'Compréhension des éléments significatifs d''un texte', NULL, 1) RETURNING id INTO c1;
  INSERT INTO eval_grid_criteria (grid_id, label, weight, sort_order)
    VALUES (g2_id, 'Interprétation plausible d''un texte', NULL, 2) RETURNING id INTO c2;
  INSERT INTO eval_grid_criteria (grid_id, label, weight, sort_order)
    VALUES (g2_id, 'Réaction pertinente à un texte (justification)', NULL, 3) RETURNING id INTO c3;
  INSERT INTO eval_grid_criteria (grid_id, label, weight, sort_order)
    VALUES (g2_id, 'Appréciation des textes littéraires et courants', NULL, 4) RETURNING id INTO c4;

  INSERT INTO eval_grid_cells (criterion_id, level_id, descriptor) VALUES
    (c1, lA, 'L''élève démontre une compréhension approfondie du texte. Il repère et relie entre eux tous les éléments d''information explicites pertinents (idées principales, personnages, temps, lieux, séquence des événements). Il dégage correctement des éléments d''information implicites simples.'),
    (c1, lB, 'L''élève démontre une compréhension adéquate du texte. Il repère la plupart des éléments d''information explicites pertinents et établit généralement des liens justes entre eux. Il dégage certains éléments d''information implicites simples.'),
    (c1, lC, 'L''élève démontre une compréhension partielle du texte. Il repère plusieurs éléments d''information explicites, mais a de la difficulté à les relier entre eux. Les éléments d''information implicites sont rarement dégagés.'),
    (c1, lD, 'L''élève démontre une compréhension superficielle du texte. Il repère quelques éléments d''information explicites de façon isolée. Les liens entre les éléments et les éléments implicites ne sont pas relevés.'),
    (c1, lE, 'L''élève ne démontre pas une compréhension du texte. Les éléments d''information pertinents ne sont pas repérés ou sont confondus.'),

    (c2, lA, 'L''élève propose une interprétation personnelle cohérente et plausible du texte. Il s''appuie sur des éléments textuels précis (indices, passages, illustrations) et sur ses connaissances antérieures pour justifier son interprétation. Il commence à aller au-delà du sens littéral.'),
    (c2, lB, 'L''élève propose une interprétation plausible du texte. Il s''appuie sur des éléments textuels pour justifier son interprétation. Il tente d''aller au-delà du sens littéral dans certains cas.'),
    (c2, lC, 'L''élève propose une interprétation partiellement plausible du texte. Quelques éléments textuels sont utilisés pour la justifier, mais l''interprétation reste près du sens littéral ou manque de cohérence.'),
    (c2, lD, 'L''élève propose une interprétation peu plausible ou peu appuyée. Les éléments textuels utilisés sont insuffisants ou mal choisis.'),
    (c2, lE, 'L''élève ne propose pas d''interprétation ou celle-ci n''a pas de lien avec le texte.'),

    (c3, lA, 'L''élève exprime des réactions pertinentes et personnelles au texte (émotions, questionnements, opinions, liens avec son vécu ou d''autres textes). Il justifie ses réactions de manière claire en s''appuyant sur des éléments du texte et sur ses expériences ou connaissances.'),
    (c3, lB, 'L''élève exprime des réactions pertinentes au texte. Il justifie ses réactions de manière adéquate en s''appuyant sur quelques éléments du texte et sur ses expériences.'),
    (c3, lC, 'L''élève exprime quelques réactions en lien avec le texte. La justification est partielle ou s''appuie sur peu d''éléments du texte. Les liens avec le vécu sont généraux ou vagues.'),
    (c3, lD, 'L''élève exprime des réactions vagues ou peu en lien avec le texte. La justification est absente ou insuffisante.'),
    (c3, lE, 'L''élève n''exprime pas de réaction au texte ou ses réactions n''ont pas de lien avec le contenu du texte.'),

    (c4, lA, 'L''élève porte un jugement critique pertinent sur le texte. Il exprime son appréciation en s''appuyant sur des éléments observables du texte (choix de mots, illustrations, vraisemblance, organisation). Il commence à distinguer le réel du fictif et à évaluer la pertinence des informations.'),
    (c4, lB, 'L''élève porte un jugement critique adéquat sur le texte. Il exprime son appréciation en s''appuyant sur quelques éléments observables du texte. Il distingue généralement le réel du fictif.'),
    (c4, lC, 'L''élève porte un jugement critique partiel sur le texte. Il tente d''exprimer son appréciation, mais s''appuie sur peu d''éléments du texte. La distinction entre le réel et le fictif est parfois difficile.'),
    (c4, lD, 'L''élève porte un jugement critique vague ou peu appuyé. L''appréciation est peu liée aux caractéristiques du texte.'),
    (c4, lE, 'L''élève ne porte pas de jugement critique sur le texte ou le jugement exprimé n''a pas de lien avec le contenu ou les caractéristiques du texte.');

  -- ──────────────────────────────────────────────────────────
  -- 3e cycle (grades 5–6) – 4 dimensions
  -- ──────────────────────────────────────────────────────────

  INSERT INTO eval_grids (title, subject_id, cycle_label, source, is_baseline, competency)
    VALUES (
      'Grille d''évaluation en lecture – 3e cycle',
      fr_id,
      '3e cycle du primaire',
      'Cadre d''évaluation des apprentissages – Français, langue d''enseignement, primaire, MEQ, 2011. PFÉQ, MEQ, 2001. Progression des apprentissages – Français, MELS, 2009.',
      true,
      'Lire des textes variés'
    )
    RETURNING id INTO g3_id;

  INSERT INTO eval_grid_grades VALUES (g3_id, p5), (g3_id, p6);

  INSERT INTO eval_grid_levels (grid_id, code, label, sort_order) VALUES (g3_id, 'A', 'Excellent',        1) RETURNING id INTO lA;
  INSERT INTO eval_grid_levels (grid_id, code, label, sort_order) VALUES (g3_id, 'B', 'Très bien',        2) RETURNING id INTO lB;
  INSERT INTO eval_grid_levels (grid_id, code, label, sort_order) VALUES (g3_id, 'C', 'Acceptable',       3) RETURNING id INTO lC;
  INSERT INTO eval_grid_levels (grid_id, code, label, sort_order) VALUES (g3_id, 'D', 'Peu satisfaisant', 4) RETURNING id INTO lD;
  INSERT INTO eval_grid_levels (grid_id, code, label, sort_order) VALUES (g3_id, 'E', 'Insuffisant',      5) RETURNING id INTO lE;

  INSERT INTO eval_grid_criteria (grid_id, label, weight, sort_order)
    VALUES (g3_id, 'Dimension 1 : Compréhension des éléments significatifs d''un texte', NULL, 1) RETURNING id INTO c1;
  INSERT INTO eval_grid_criteria (grid_id, label, weight, sort_order)
    VALUES (g3_id, 'Dimension 2 : Interprétation plausible d''un texte', NULL, 2) RETURNING id INTO c2;
  INSERT INTO eval_grid_criteria (grid_id, label, weight, sort_order)
    VALUES (g3_id, 'Dimension 3 : Réaction pertinente à un texte (justification)', NULL, 3) RETURNING id INTO c3;
  INSERT INTO eval_grid_criteria (grid_id, label, weight, sort_order)
    VALUES (g3_id, 'Dimension 4 : Appréciation des textes littéraires et courants', NULL, 4) RETURNING id INTO c4;

  INSERT INTO eval_grid_cells (criterion_id, level_id, descriptor) VALUES
    (c1, lA, 'L''élève démontre une compréhension approfondie et précise du texte. Il repère et relie entre eux tous les éléments d''information explicites et implicites pertinents (idées principales, idées secondaires, personnages, temps, lieux, séquence des événements, liens de causalité). Il distingue clairement les faits des opinions.'),
    (c1, lB, 'L''élève démontre une compréhension adéquate du texte. Il repère la plupart des éléments d''information explicites et implicites pertinents et établit généralement des liens justes entre eux. Il distingue les faits des opinions dans la plupart des cas.'),
    (c1, lC, 'L''élève démontre une compréhension partielle du texte. Il repère plusieurs éléments d''information explicites, mais a de la difficulté à repérer les éléments implicites. Les liens entre les éléments sont parfois incomplets ou imprécis.'),
    (c1, lD, 'L''élève démontre une compréhension superficielle du texte. Il repère quelques éléments d''information explicites, mais les éléments implicites ne sont pas relevés. Les liens entre les éléments sont absents ou erronés.'),
    (c1, lE, 'L''élève ne démontre pas une compréhension du texte. Les éléments d''information pertinents ne sont pas repérés ou sont confondus.'),

    (c2, lA, 'L''élève propose une interprétation personnelle riche, cohérente et plausible du texte. Il va au-delà du sens littéral et s''appuie sur des éléments textuels précis (indices, passages, mots-clés) et sur ses connaissances pour justifier son interprétation. Il explore le non-dit, les symboles ou les intentions de l''auteur avec nuance.'),
    (c2, lB, 'L''élève propose une interprétation plausible du texte. Il s''appuie sur des éléments textuels et sur ses connaissances pour justifier son interprétation. Il va au-delà du sens littéral dans la plupart des cas.'),
    (c2, lC, 'L''élève propose une interprétation partiellement plausible du texte. Certains éléments textuels sont utilisés pour la justifier, mais l''interprétation reste en surface ou manque de nuance.'),
    (c2, lD, 'L''élève propose une interprétation peu plausible ou peu appuyée. Les éléments textuels utilisés sont insuffisants, mal choisis ou mal interprétés.'),
    (c2, lE, 'L''élève ne propose pas d''interprétation ou celle-ci n''a pas de lien avec le texte.'),

    (c3, lA, 'L''élève exprime des réactions pertinentes, variées et personnelles au texte (émotions, questionnements, opinions, liens avec son vécu ou d''autres textes). Il justifie ses réactions de manière claire et détaillée en s''appuyant sur des éléments précis du texte et sur ses expériences ou connaissances.'),
    (c3, lB, 'L''élève exprime des réactions pertinentes au texte. Il justifie ses réactions de manière adéquate en s''appuyant sur des éléments du texte et sur ses expériences ou connaissances.'),
    (c3, lC, 'L''élève exprime quelques réactions en lien avec le texte. La justification est partielle ou s''appuie sur peu d''éléments du texte. Les liens avec le vécu ou d''autres textes sont vagues.'),
    (c3, lD, 'L''élève exprime des réactions vagues ou peu en lien avec le texte. La justification est absente ou insuffisante.'),
    (c3, lE, 'L''élève n''exprime pas de réaction au texte ou ses réactions n''ont pas de lien avec le contenu du texte.'),

    (c4, lA, 'L''élève porte un jugement critique pertinent, nuancé et appuyé sur le texte. Il évalue avec justesse certains aspects du texte (crédibilité des informations, qualité de l''argumentation, procédés littéraires, point de vue de l''auteur, efficacité du texte par rapport à son intention) en s''appuyant sur des critères explicites et des exemples précis tirés du texte.'),
    (c4, lB, 'L''élève porte un jugement critique pertinent sur le texte. Il évalue certains aspects du texte en s''appuyant sur des critères et des exemples généralement appropriés.'),
    (c4, lC, 'L''élève porte un jugement critique partiel sur le texte. Il tente d''évaluer certains aspects du texte, mais les critères utilisés manquent de précision ou les exemples sont peu pertinents.'),
    (c4, lD, 'L''élève porte un jugement critique vague ou peu appuyé sur le texte. Les critères et les exemples sont insuffisants ou inappropriés.'),
    (c4, lE, 'L''élève ne porte pas de jugement critique sur le texte ou le jugement exprimé n''a pas de lien avec le contenu ou les caractéristiques du texte.');

END $$;
