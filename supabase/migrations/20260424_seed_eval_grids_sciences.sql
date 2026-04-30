-- ============================================================
-- PLANIPROF -- Seed: Grilles d'évaluation – Science et technologie
-- C1 : Proposer des explications ou des solutions
-- C2 : Mettre à profit les outils, objets et procédés
-- C3 : Communiquer à l'aide des langages scientifiques
-- 2e et 3e cycles du primaire
-- ============================================================

DO $$
DECLARE
  gc1_id uuid; gc2_id uuid; gc3_id uuid;
  sci_id int;
  p3 int; p4 int; p5 int; p6 int;
  lA int; lB int; lC int; lD int; lE int;
  c1 uuid; c2 uuid; c3 uuid; c4 uuid;
BEGIN

  SELECT id INTO sci_id FROM subjects WHERE slug = 'sciences';
  SELECT id INTO p3 FROM grade_levels WHERE education_level = 'primaire' AND grade = 3;
  SELECT id INTO p4 FROM grade_levels WHERE education_level = 'primaire' AND grade = 4;
  SELECT id INTO p5 FROM grade_levels WHERE education_level = 'primaire' AND grade = 5;
  SELECT id INTO p6 FROM grade_levels WHERE education_level = 'primaire' AND grade = 6;

  -- ──────────────────────────────────────────────────────────
  -- C1 : Proposer des explications ou des solutions
  -- ──────────────────────────────────────────────────────────

  INSERT INTO eval_grids (title, subject_id, cycle_label, source, is_baseline, competency)
    VALUES (
      'C1 – Proposer des explications ou des solutions à des problèmes d''ordre scientifique ou technologique',
      sci_id,
      '2e et 3e cycles du primaire',
      'PFÉQ et Cadre d''évaluation des apprentissages du MEQ. Inspirée du cadre didactique de Thouin, M. (2009). Adaptation pédagogique.',
      true,
      'C1 – Proposer des explications ou des solutions'
    )
    RETURNING id INTO gc1_id;

  INSERT INTO eval_grid_grades VALUES (gc1_id, p3), (gc1_id, p4), (gc1_id, p5), (gc1_id, p6);

  INSERT INTO eval_grid_levels (grid_id, code, label, sort_order) VALUES (gc1_id, 'A', 'Excellent',        1) RETURNING id INTO lA;
  INSERT INTO eval_grid_levels (grid_id, code, label, sort_order) VALUES (gc1_id, 'B', 'Très bien',        2) RETURNING id INTO lB;
  INSERT INTO eval_grid_levels (grid_id, code, label, sort_order) VALUES (gc1_id, 'C', 'Acceptable',        3) RETURNING id INTO lC;
  INSERT INTO eval_grid_levels (grid_id, code, label, sort_order) VALUES (gc1_id, 'D', 'Peu satisfaisant',  4) RETURNING id INTO lD;
  INSERT INTO eval_grid_levels (grid_id, code, label, sort_order) VALUES (gc1_id, 'E', 'Insuffisant',       5) RETURNING id INTO lE;

  INSERT INTO eval_grid_criteria (grid_id, label, weight, sort_order)
    VALUES (gc1_id, 'Expression et évolution des conceptions initiales', 20, 1) RETURNING id INTO c1;
  INSERT INTO eval_grid_criteria (grid_id, label, weight, sort_order)
    VALUES (gc1_id, 'Description adéquate du problème', 20, 2) RETURNING id INTO c2;
  INSERT INTO eval_grid_criteria (grid_id, label, weight, sort_order)
    VALUES (gc1_id, 'Mise en œuvre d''une démarche de résolution appropriée', 35, 3) RETURNING id INTO c3;
  INSERT INTO eval_grid_criteria (grid_id, label, weight, sort_order)
    VALUES (gc1_id, 'Utilisation appropriée des connaissances scientifiques', 25, 4) RETURNING id INTO c4;

  INSERT INTO eval_grid_cells (criterion_id, level_id, descriptor) VALUES
    (c1, lA, 'L''élève exprime clairement ses conceptions initiales et les confronte de manière réfléchie à ses observations et résultats. Il reconnaît explicitement l''évolution de sa pensée.'),
    (c1, lB, 'L''élève exprime ses conceptions initiales et les compare à ses résultats. Il reconnaît certains changements dans sa compréhension.'),
    (c1, lC, 'L''élève exprime ses conceptions initiales, mais les confronte peu à ses résultats. L''évolution de sa pensée est implicite.'),
    (c1, lD, 'L''élève exprime des conceptions initiales vagues ou incomplètes. Il n''établit pas de lien entre celles-ci et ses résultats.'),
    (c1, lE, 'L''élève n''exprime pas ses conceptions initiales ou ne les distingue pas de ses résultats.'),

    (c2, lA, 'L''élève cerne la problématique de façon claire et complète. Il identifie tous les éléments clés et formule une hypothèse détaillée et pertinente.'),
    (c2, lB, 'L''élève cerne la problématique en tenant compte de la plupart des éléments pertinents. Il formule une hypothèse adéquate.'),
    (c2, lC, 'L''élève reformule partiellement la problématique. Son hypothèse ne tient compte que de quelques éléments.'),
    (c2, lD, 'L''élève présente la problématique en sélectionnant quelques mots-clés isolés. Son hypothèse est inappropriée.'),
    (c2, lE, 'L''élève présente des éléments non pertinents en guise de formulation de la problématique. Il ne propose pas d''hypothèse.'),

    (c3, lA, 'L''élève planifie et réalise une démarche rigoureuse et complète. Il suit les étapes de façon méthodique et s''ajuste efficacement au besoin de manière autonome.'),
    (c3, lB, 'L''élève planifie et réalise sa démarche de façon adéquate. Les étapes sont suivies correctement avec des ajustements au besoin.'),
    (c3, lC, 'L''élève réalise partiellement sa démarche. Certaines étapes sont présentes mais comportent des oublis ou des incohérences.'),
    (c3, lD, 'L''élève présente une démarche incomplète ou peu structurée. Les étapes sont difficiles à suivre ou manquent de rigueur.'),
    (c3, lE, 'L''élève ne parvient pas à mettre en œuvre une démarche ou réalise des actions sans lien avec la problématique.'),

    (c4, lA, 'L''élève fournit une explication détaillée en faisant référence aux concepts étudiés et à ses observations. Ses conclusions sont justes et bien appuyées.'),
    (c4, lB, 'L''élève explique ses résultats en faisant référence aux concepts étudiés et à ses observations. Ses conclusions sont généralement justes.'),
    (c4, lC, 'L''élève explique ses résultats en faisant référence à ses observations seulement. Ses conclusions sont parfois imprécises.'),
    (c4, lD, 'L''élève fournit des explications peu valables. Les liens avec les concepts sont faibles ou absents.'),
    (c4, lE, 'L''élève fournit des explications peu ou pas liées à ses résultats ou aux concepts étudiés.');

  -- ──────────────────────────────────────────────────────────
  -- C2 : Mettre à profit les outils, objets et procédés
  -- ──────────────────────────────────────────────────────────

  INSERT INTO eval_grids (title, subject_id, cycle_label, source, is_baseline, competency)
    VALUES (
      'C2 – Mettre à profit les outils, objets et procédés de la science et de la technologie',
      sci_id,
      '2e et 3e cycles du primaire',
      'PFÉQ et Cadre d''évaluation des apprentissages du MEQ. Inspirée du cadre didactique de Thouin, M. (2009). Adaptation pédagogique.',
      true,
      'C2 – Mettre à profit les outils, objets et procédés'
    )
    RETURNING id INTO gc2_id;

  INSERT INTO eval_grid_grades VALUES (gc2_id, p3), (gc2_id, p4), (gc2_id, p5), (gc2_id, p6);

  INSERT INTO eval_grid_levels (grid_id, code, label, sort_order) VALUES (gc2_id, 'A', 'Excellent',        1) RETURNING id INTO lA;
  INSERT INTO eval_grid_levels (grid_id, code, label, sort_order) VALUES (gc2_id, 'B', 'Très bien',        2) RETURNING id INTO lB;
  INSERT INTO eval_grid_levels (grid_id, code, label, sort_order) VALUES (gc2_id, 'C', 'Acceptable',        3) RETURNING id INTO lC;
  INSERT INTO eval_grid_levels (grid_id, code, label, sort_order) VALUES (gc2_id, 'D', 'Peu satisfaisant',  4) RETURNING id INTO lD;
  INSERT INTO eval_grid_levels (grid_id, code, label, sort_order) VALUES (gc2_id, 'E', 'Insuffisant',       5) RETURNING id INTO lE;

  INSERT INTO eval_grid_criteria (grid_id, label, weight, sort_order)
    VALUES (gc2_id, 'Exploration fonctionnelle du matériel et des outils', 15, 1) RETURNING id INTO c1;
  INSERT INTO eval_grid_criteria (grid_id, label, weight, sort_order)
    VALUES (gc2_id, 'Manipulation d''objets, d''outils ou d''instruments', 30, 2) RETURNING id INTO c2;
  INSERT INTO eval_grid_criteria (grid_id, label, weight, sort_order)
    VALUES (gc2_id, 'Conception et fabrication d''instruments, d''outils ou de modèles', 35, 3) RETURNING id INTO c3;
  INSERT INTO eval_grid_criteria (grid_id, label, weight, sort_order)
    VALUES (gc2_id, 'Respect des règles de sécurité', 20, 4) RETURNING id INTO c4;

  INSERT INTO eval_grid_cells (criterion_id, level_id, descriptor) VALUES
    (c1, lA, 'L''élève explore le matériel et les outils avec curiosité et méthode. Il identifie leur rôle et leur fonctionnement de façon autonome et efficace. Il pose des questions pertinentes sur les propriétés des objets.'),
    (c1, lB, 'L''élève explore le matériel et les outils adéquatement. Il identifie leur rôle et leur fonctionnement correctement.'),
    (c1, lC, 'L''élève explore le matériel avec un certain soutien. Il identifie le rôle de certains outils, mais pas tous.'),
    (c1, lD, 'L''élève explore peu le matériel. Il tient peu compte du rôle et du fonctionnement des outils malgré l''aide apportée.'),
    (c1, lE, 'L''élève ne s''engage pas dans l''exploration ou choisit des outils non appropriés.'),

    (c2, lA, 'L''élève choisit des objets, des outils et des instruments de façon appropriée selon la tâche à réaliser, leur rôle et leur fonctionnement. Il les manipule avec un souci d''économie et d''efficacité.'),
    (c2, lB, 'L''élève choisit des objets, des outils et des instruments de façon appropriée selon la tâche à réaliser. Il les manipule adéquatement.'),
    (c2, lC, 'L''élève choisit avec aide des objets, des outils et des instruments selon leur rôle. Il les manipule avec un certain soutien.'),
    (c2, lD, 'L''élève choisit des objets et des instruments en tenant peu compte de leur rôle et de leur fonctionnement. Il est impulsif dans la manipulation.'),
    (c2, lE, 'L''élève choisit des objets et des instruments non appropriés. Il les manipule de façon inappropriée.'),

    (c3, lA, 'L''élève conçoit et fabrique un instrument, un outil ou un modèle qui répond rigoureusement aux exigences de la tâche. Le produit est fonctionnel, bien réalisé et témoigne d''un souci de précision.'),
    (c3, lB, 'L''élève conçoit et fabrique un instrument, un outil ou un modèle qui répond adéquatement aux exigences de la tâche. Le produit est fonctionnel.'),
    (c3, lC, 'L''élève conçoit et fabrique un produit qui répond partiellement aux exigences de la tâche. Certains ajustements seraient nécessaires pour le rendre pleinement fonctionnel.'),
    (c3, lD, 'L''élève conçoit un produit qui répond peu aux exigences de la tâche. Le résultat est peu fonctionnel malgré le soutien offert.'),
    (c3, lE, 'L''élève ne parvient pas à concevoir ou fabriquer un produit en lien avec la tâche.'),

    (c4, lA, 'L''élève respecte rigoureusement toutes les règles de sécurité en tout temps. Il fait preuve de vigilance pour sa sécurité et celle des autres.'),
    (c4, lB, 'L''élève respecte les règles de sécurité de façon constante.'),
    (c4, lC, 'L''élève respecte les règles de sécurité avec quelques rappels occasionnels.'),
    (c4, lD, 'L''élève ne respecte pas certaines règles de sécurité malgré les rappels. Son comportement peut présenter des risques.'),
    (c4, lE, 'L''élève ne respecte pas les règles de sécurité et met en danger sa sécurité ou celle des autres.');

  -- ──────────────────────────────────────────────────────────
  -- C3 : Communiquer à l'aide des langages scientifiques
  -- ──────────────────────────────────────────────────────────

  INSERT INTO eval_grids (title, subject_id, cycle_label, source, is_baseline, competency)
    VALUES (
      'C3 – Communiquer à l''aide des langages utilisés en science et en technologie',
      sci_id,
      '2e et 3e cycles du primaire',
      'PFÉQ et Cadre d''évaluation des apprentissages du MEQ. Inspirée du cadre didactique de Thouin, M. (2009). Adaptation pédagogique.',
      true,
      'C3 – Communiquer à l''aide des langages scientifiques'
    )
    RETURNING id INTO gc3_id;

  INSERT INTO eval_grid_grades VALUES (gc3_id, p3), (gc3_id, p4), (gc3_id, p5), (gc3_id, p6);

  INSERT INTO eval_grid_levels (grid_id, code, label, sort_order) VALUES (gc3_id, 'A', 'Excellent',        1) RETURNING id INTO lA;
  INSERT INTO eval_grid_levels (grid_id, code, label, sort_order) VALUES (gc3_id, 'B', 'Très bien',        2) RETURNING id INTO lB;
  INSERT INTO eval_grid_levels (grid_id, code, label, sort_order) VALUES (gc3_id, 'C', 'Acceptable',        3) RETURNING id INTO lC;
  INSERT INTO eval_grid_levels (grid_id, code, label, sort_order) VALUES (gc3_id, 'D', 'Peu satisfaisant',  4) RETURNING id INTO lD;
  INSERT INTO eval_grid_levels (grid_id, code, label, sort_order) VALUES (gc3_id, 'E', 'Insuffisant',       5) RETURNING id INTO lE;

  INSERT INTO eval_grid_criteria (grid_id, label, weight, sort_order)
    VALUES (gc3_id, 'Structuration et organisation de la communication', 25, 1) RETURNING id INTO c1;
  INSERT INTO eval_grid_criteria (grid_id, label, weight, sort_order)
    VALUES (gc3_id, 'Utilisation de la terminologie, des règles et des conventions', 25, 2) RETURNING id INTO c2;
  INSERT INTO eval_grid_criteria (grid_id, label, weight, sort_order)
    VALUES (gc3_id, 'Utilisation appropriée des modes de représentation', 25, 3) RETURNING id INTO c3;
  INSERT INTO eval_grid_criteria (grid_id, label, weight, sort_order)
    VALUES (gc3_id, 'Transmission claire et adaptée au destinataire', 25, 4) RETURNING id INTO c4;

  INSERT INTO eval_grid_cells (criterion_id, level_id, descriptor) VALUES
    (c1, lA, 'L''élève organise sa communication de façon claire, logique et structurée. Les résultats, les explications et les conclusions sont présentés dans un ordre cohérent et facile à suivre.'),
    (c1, lB, 'L''élève organise sa communication de façon adéquate. L''ordre de présentation est généralement logique et compréhensible.'),
    (c1, lC, 'L''élève organise partiellement sa communication. Certains éléments sont présentés de façon désordonnée ou manquent de clarté.'),
    (c1, lD, 'L''élève présente ses résultats de façon confuse et peu organisée. Le lecteur ou l''auditeur a de la difficulté à suivre.'),
    (c1, lE, 'L''élève ne structure pas sa communication ou ne présente pas ses résultats de façon compréhensible.'),

    (c2, lA, 'L''élève fait preuve de rigueur dans l''utilisation du langage propre à la science et à la technologie. Il utilise correctement les termes, symboles, unités de mesure et conventions scientifiques.'),
    (c2, lB, 'L''élève emploie correctement les termes associés aux concepts abordés et respecte généralement les règles et conventions du langage scientifique.'),
    (c2, lC, 'L''élève emploie certains termes associés aux concepts abordés et respecte certaines conventions scientifiques, mais avec des imprécisions.'),
    (c2, lD, 'L''élève utilise peu les termes associés aux concepts abordés. Le vocabulaire scientifique est souvent absent ou utilisé incorrectement.'),
    (c2, lE, 'L''élève n''utilise pas les termes associés aux concepts abordés ou les utilise de façon erronée.'),

    (c3, lA, 'L''élève utilise de façon pertinente et rigoureuse divers modes de représentation (schémas, tableaux, graphiques, dessins, diagrammes) pour appuyer ses explications et ses résultats. Les représentations sont claires, complètes et bien identifiées.'),
    (c3, lB, 'L''élève utilise adéquatement des modes de représentation appropriés pour présenter ses résultats. Les représentations sont généralement claires et identifiées.'),
    (c3, lC, 'L''élève utilise quelques modes de représentation, mais de façon parfois imprécise ou incomplète. Certaines représentations manquent d''identification ou de clarté.'),
    (c3, lD, 'L''élève utilise peu de modes de représentation ou les utilise de façon inappropriée. Les représentations sont difficiles à interpréter.'),
    (c3, lE, 'L''élève n''utilise pas de modes de représentation ou ceux utilisés ne sont pas en lien avec les résultats.'),

    (c4, lA, 'L''élève transmet ses résultats et explications de façon claire, complète et adaptée à son auditoire. Il vulgarise efficacement les concepts tout en maintenant la rigueur scientifique.'),
    (c4, lB, 'L''élève transmet ses résultats de façon adéquate et généralement adaptée à son auditoire. Le message est compréhensible.'),
    (c4, lC, 'L''élève transmet ses résultats de façon partielle. Le message est parfois difficile à comprendre pour l''auditoire visé.'),
    (c4, lD, 'L''élève transmet ses résultats de façon confuse. Le message est peu adapté à l''auditoire et manque de clarté.'),
    (c4, lE, 'L''élève ne parvient pas à transmettre ses résultats de façon compréhensible.');

END $$;
