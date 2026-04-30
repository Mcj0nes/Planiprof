-- ============================================================
-- PLANIPROF -- Seed: Grilles d'évaluation – Mathématique
-- Compétence 2 : Raisonner à l'aide de concepts et de processus mathématiques
-- SA (Situation d'application) – 1er, 2e et 3e cycles du primaire
-- ============================================================

DO $$
DECLARE
  g1_id uuid; g2_id uuid; g3_id uuid;
  math_id int;
  p1 int; p2 int; p3 int; p4 int; p5 int; p6 int;
  lA int; lB int; lC int; lD int; lE int;
  c1 uuid; c2 uuid; c3 uuid;
BEGIN

  SELECT id INTO math_id FROM subjects WHERE slug = 'maths';
  SELECT id INTO p1 FROM grade_levels WHERE education_level = 'primaire' AND grade = 1;
  SELECT id INTO p2 FROM grade_levels WHERE education_level = 'primaire' AND grade = 2;
  SELECT id INTO p3 FROM grade_levels WHERE education_level = 'primaire' AND grade = 3;
  SELECT id INTO p4 FROM grade_levels WHERE education_level = 'primaire' AND grade = 4;
  SELECT id INTO p5 FROM grade_levels WHERE education_level = 'primaire' AND grade = 5;
  SELECT id INTO p6 FROM grade_levels WHERE education_level = 'primaire' AND grade = 6;

  -- ──────────────────────────────────────────────────────────
  -- 1er cycle
  -- ──────────────────────────────────────────────────────────

  INSERT INTO eval_grids (title, subject_id, cycle_label, source, is_baseline, competency)
    VALUES (
      'Grille d''évaluation – SA : Raisonner – 1er cycle',
      math_id,
      '1er cycle du primaire',
      'Cadre d''évaluation des apprentissages – Mathématique, primaire, MEQ, 2011. Compétence 2 : Raisonner à l''aide de concepts et de processus mathématiques. Descripteurs adaptés au 1er cycle.',
      true,
      'C2 – Raisonner à l''aide de concepts et de processus mathématiques'
    )
    RETURNING id INTO g1_id;

  INSERT INTO eval_grid_grades VALUES (g1_id, p1), (g1_id, p2);

  INSERT INTO eval_grid_levels (grid_id, code, label, sort_order) VALUES (g1_id, 'A', 'Excellent',        1) RETURNING id INTO lA;
  INSERT INTO eval_grid_levels (grid_id, code, label, sort_order) VALUES (g1_id, 'B', 'Très bien',        2) RETURNING id INTO lB;
  INSERT INTO eval_grid_levels (grid_id, code, label, sort_order) VALUES (g1_id, 'C', 'Acceptable',       3) RETURNING id INTO lC;
  INSERT INTO eval_grid_levels (grid_id, code, label, sort_order) VALUES (g1_id, 'D', 'Peu satisfaisant', 4) RETURNING id INTO lD;
  INSERT INTO eval_grid_levels (grid_id, code, label, sort_order) VALUES (g1_id, 'E', 'Insuffisant',      5) RETURNING id INTO lE;

  INSERT INTO eval_grid_criteria (grid_id, label, weight, sort_order)
    VALUES (g1_id, 'Analyse adéquate de la situation d''application', NULL, 1) RETURNING id INTO c1;
  INSERT INTO eval_grid_criteria (grid_id, label, weight, sort_order)
    VALUES (g1_id, 'Application adéquate des processus requis', NULL, 2) RETURNING id INTO c2;
  INSERT INTO eval_grid_criteria (grid_id, label, weight, sort_order)
    VALUES (g1_id, 'Justification correcte d''actions ou d''énoncés à l''aide de concepts et de processus mathématiques', NULL, 3) RETURNING id INTO c3;

  INSERT INTO eval_grid_cells (criterion_id, level_id, descriptor) VALUES
    (c1, lA, 'L''élève analyse la situation d''application de manière approfondie. Il repère toutes les données pertinentes (nombres, informations, consignes) et comprend ce qui est demandé. Il identifie correctement l''opération ou les actions à poser.'),
    (c1, lB, 'L''élève analyse la situation d''application de manière adéquate. Il repère la plupart des données pertinentes et comprend généralement ce qui est demandé.'),
    (c1, lC, 'L''élève analyse la situation d''application de manière partielle. Il repère plusieurs données pertinentes, mais certaines sont omises ou mal interprétées.'),
    (c1, lD, 'L''élève analyse la situation d''application de manière superficielle. Il repère quelques données pertinentes, mais sa compréhension de la tâche est incomplète ou erronée.'),
    (c1, lE, 'L''élève ne parvient pas à analyser la situation d''application. Les données pertinentes ne sont pas repérées ou la tâche n''est pas comprise.'),

    (c2, lA, 'L''élève applique correctement les processus mathématiques requis (opérations, dénombrement, mesure, construction, etc.). Il produit une solution exacte ou comportant quelques erreurs mineures (erreurs de calcul, imprécisions).'),
    (c2, lB, 'L''élève applique la plupart des processus mathématiques requis. Il produit une solution comportant peu d''erreurs conceptuelles ou procédurales.'),
    (c2, lC, 'L''élève applique plusieurs processus mathématiques requis. Sa solution comporte quelques erreurs conceptuelles ou procédurales.'),
    (c2, lD, 'L''élève applique quelques processus mathématiques requis. Sa solution est partielle et comporte plusieurs erreurs conceptuelles ou procédurales.'),
    (c2, lE, 'L''élève applique peu ou pas de processus mathématiques requis. Sa solution est inappropriée ou absente.'),

    (c3, lA, 'L''élève justifie ses choix et sa démarche de manière claire et complète (à l''oral, par des dessins, des mots ou des nombres). Ses traces rendent explicite son raisonnement et sont faciles à suivre.'),
    (c3, lB, 'L''élève justifie ses choix et sa démarche de manière adéquate. Ses traces sont organisées, bien que certaines étapes soient implicites.'),
    (c3, lC, 'L''élève justifie ses choix et sa démarche de manière partielle. Ses traces sont peu organisées ou plusieurs étapes sont implicites ou manquantes.'),
    (c3, lD, 'L''élève justifie ses choix et sa démarche de manière insuffisante. Ses traces sont constituées d''éléments confus et isolés.'),
    (c3, lE, 'L''élève ne justifie pas ses choix ou sa démarche, ou laisse peu ou pas de traces.');

  -- ──────────────────────────────────────────────────────────
  -- 2e cycle
  -- ──────────────────────────────────────────────────────────

  INSERT INTO eval_grids (title, subject_id, cycle_label, source, is_baseline, competency)
    VALUES (
      'Grille d''évaluation – SA : Raisonner – 2e cycle',
      math_id,
      '2e cycle du primaire',
      'Cadre d''évaluation des apprentissages – Mathématique, primaire, MEQ, 2011. Compétence 2 : Raisonner à l''aide de concepts et de processus mathématiques. Descripteurs adaptés au 2e cycle.',
      true,
      'C2 – Raisonner à l''aide de concepts et de processus mathématiques'
    )
    RETURNING id INTO g2_id;

  INSERT INTO eval_grid_grades VALUES (g2_id, p3), (g2_id, p4);

  INSERT INTO eval_grid_levels (grid_id, code, label, sort_order) VALUES (g2_id, 'A', 'Excellent',        1) RETURNING id INTO lA;
  INSERT INTO eval_grid_levels (grid_id, code, label, sort_order) VALUES (g2_id, 'B', 'Très bien',        2) RETURNING id INTO lB;
  INSERT INTO eval_grid_levels (grid_id, code, label, sort_order) VALUES (g2_id, 'C', 'Acceptable',       3) RETURNING id INTO lC;
  INSERT INTO eval_grid_levels (grid_id, code, label, sort_order) VALUES (g2_id, 'D', 'Peu satisfaisant', 4) RETURNING id INTO lD;
  INSERT INTO eval_grid_levels (grid_id, code, label, sort_order) VALUES (g2_id, 'E', 'Insuffisant',      5) RETURNING id INTO lE;

  INSERT INTO eval_grid_criteria (grid_id, label, weight, sort_order)
    VALUES (g2_id, 'Analyse adéquate de la situation d''application', NULL, 1) RETURNING id INTO c1;
  INSERT INTO eval_grid_criteria (grid_id, label, weight, sort_order)
    VALUES (g2_id, 'Application adéquate des processus requis', NULL, 2) RETURNING id INTO c2;
  INSERT INTO eval_grid_criteria (grid_id, label, weight, sort_order)
    VALUES (g2_id, 'Justification correcte d''actions ou d''énoncés à l''aide de concepts et de processus mathématiques', NULL, 3) RETURNING id INTO c3;

  INSERT INTO eval_grid_cells (criterion_id, level_id, descriptor) VALUES
    (c1, lA, 'L''élève analyse la situation d''application de manière approfondie. Il repère toutes les données pertinentes et toutes les contraintes à respecter. Il identifie correctement les opérations ou les étapes à réaliser et établit des liens justes entre les données.'),
    (c1, lB, 'L''élève analyse la situation d''application de manière adéquate. Il repère la plupart des données pertinentes et la plupart des contraintes à respecter. Il identifie généralement les opérations ou les étapes à réaliser.'),
    (c1, lC, 'L''élève analyse la situation d''application de manière partielle. Il repère plusieurs données pertinentes et plusieurs contraintes, mais certaines sont omises ou mal interprétées.'),
    (c1, lD, 'L''élève analyse la situation d''application de manière superficielle. Il repère quelques données pertinentes, mais sa compréhension de la tâche est incomplète ou comporte des erreurs d''interprétation.'),
    (c1, lE, 'L''élève ne parvient pas à analyser la situation d''application. Les données pertinentes ne sont pas repérées ou la tâche n''est pas comprise.'),

    (c2, lA, 'L''élève applique correctement tous les processus mathématiques requis (opérations, conversions, constructions géométriques, mesures, etc.). Il produit une solution exacte ou comportant quelques erreurs mineures (erreurs de calcul, imprécisions, oublis).'),
    (c2, lB, 'L''élève applique la plupart des processus mathématiques requis. Il produit une solution comportant peu d''erreurs conceptuelles ou procédurales.'),
    (c2, lC, 'L''élève applique plusieurs processus mathématiques requis. Sa solution comporte quelques erreurs conceptuelles ou procédurales.'),
    (c2, lD, 'L''élève applique quelques processus mathématiques requis. Sa solution est partielle et comporte plusieurs erreurs conceptuelles ou procédurales.'),
    (c2, lE, 'L''élève applique peu ou pas de processus mathématiques requis. Sa solution est inappropriée ou absente.'),

    (c3, lA, 'L''élève justifie ses choix et sa démarche de manière claire, complète et structurée. Il laisse des traces écrites organisées (calculs, dessins, schémas, mots, phrases) qui rendent explicite son raisonnement. Les étapes sont faciles à suivre.'),
    (c3, lB, 'L''élève justifie ses choix et sa démarche de manière adéquate. Ses traces sont structurées, bien que certaines étapes soient implicites.'),
    (c3, lC, 'L''élève justifie ses choix et sa démarche de manière partielle. Ses traces sont peu structurées ou plusieurs étapes sont implicites ou manquantes.'),
    (c3, lD, 'L''élève justifie ses choix et sa démarche de manière insuffisante. Ses traces sont constituées d''éléments confus et isolés.'),
    (c3, lE, 'L''élève ne justifie pas ses choix ou sa démarche, ou laisse peu ou pas de traces.');

  -- ──────────────────────────────────────────────────────────
  -- 3e cycle
  -- ──────────────────────────────────────────────────────────

  INSERT INTO eval_grids (title, subject_id, cycle_label, source, is_baseline, competency)
    VALUES (
      'Grille d''évaluation – SA : Raisonner – 3e cycle',
      math_id,
      '3e cycle du primaire',
      'Cadre d''évaluation des apprentissages – Mathématique, primaire, MEQ, 2011. Compétence 2 : Raisonner à l''aide de concepts et de processus mathématiques. Descripteurs adaptés au 3e cycle.',
      true,
      'C2 – Raisonner à l''aide de concepts et de processus mathématiques'
    )
    RETURNING id INTO g3_id;

  INSERT INTO eval_grid_grades VALUES (g3_id, p5), (g3_id, p6);

  INSERT INTO eval_grid_levels (grid_id, code, label, sort_order) VALUES (g3_id, 'A', 'Excellent',        1) RETURNING id INTO lA;
  INSERT INTO eval_grid_levels (grid_id, code, label, sort_order) VALUES (g3_id, 'B', 'Très bien',        2) RETURNING id INTO lB;
  INSERT INTO eval_grid_levels (grid_id, code, label, sort_order) VALUES (g3_id, 'C', 'Acceptable',       3) RETURNING id INTO lC;
  INSERT INTO eval_grid_levels (grid_id, code, label, sort_order) VALUES (g3_id, 'D', 'Peu satisfaisant', 4) RETURNING id INTO lD;
  INSERT INTO eval_grid_levels (grid_id, code, label, sort_order) VALUES (g3_id, 'E', 'Insuffisant',      5) RETURNING id INTO lE;

  INSERT INTO eval_grid_criteria (grid_id, label, weight, sort_order)
    VALUES (g3_id, 'Analyse adéquate de la situation d''application', NULL, 1) RETURNING id INTO c1;
  INSERT INTO eval_grid_criteria (grid_id, label, weight, sort_order)
    VALUES (g3_id, 'Application adéquate des processus requis', NULL, 2) RETURNING id INTO c2;
  INSERT INTO eval_grid_criteria (grid_id, label, weight, sort_order)
    VALUES (g3_id, 'Justification correcte d''actions ou d''énoncés à l''aide de concepts et de processus mathématiques', NULL, 3) RETURNING id INTO c3;

  INSERT INTO eval_grid_cells (criterion_id, level_id, descriptor) VALUES
    (c1, lA, 'L''élève analyse la situation d''application de manière approfondie et rigoureuse. Il repère toutes les données pertinentes, y compris les données implicites, et tient compte de toutes les contraintes à respecter. Il identifie correctement les opérations et les étapes à réaliser et établit des liens justes et complets entre les données.'),
    (c1, lB, 'L''élève analyse la situation d''application de manière adéquate. Il repère la plupart des données pertinentes et tient compte de la plupart des contraintes. Il identifie généralement les opérations et les étapes à réaliser et établit des liens adéquats entre les données.'),
    (c1, lC, 'L''élève analyse la situation d''application de manière partielle. Il repère plusieurs données pertinentes et tient compte de plusieurs contraintes, mais certaines données sont omises, mal interprétées ou les liens entre elles sont incomplets.'),
    (c1, lD, 'L''élève analyse la situation d''application de manière superficielle. Il repère quelques données pertinentes, mais sa compréhension de la tâche est incomplète ou comporte des erreurs d''interprétation significatives.'),
    (c1, lE, 'L''élève ne parvient pas à analyser la situation d''application. Les données pertinentes ne sont pas repérées ou la tâche n''est pas comprise.'),

    (c2, lA, 'L''élève applique correctement tous les processus mathématiques requis (opérations sur les nombres naturels, décimaux et fractions, conversions de mesures, constructions géométriques, traitement de données statistiques, calcul de probabilités, etc.). Il produit une solution exacte ou comportant quelques erreurs mineures (erreurs de calcul, imprécisions, oublis).'),
    (c2, lB, 'L''élève applique la plupart des processus mathématiques requis. Il produit une solution comportant peu d''erreurs conceptuelles ou procédurales.'),
    (c2, lC, 'L''élève applique plusieurs processus mathématiques requis. Sa solution comporte quelques erreurs conceptuelles ou procédurales.'),
    (c2, lD, 'L''élève applique quelques processus mathématiques requis. Sa solution est partielle et comporte plusieurs erreurs conceptuelles ou procédurales.'),
    (c2, lE, 'L''élève applique peu ou pas de processus mathématiques requis. Sa solution est inappropriée ou absente.'),

    (c3, lA, 'L''élève justifie ses choix et sa démarche de manière claire, complète et rigoureuse. Il laisse des traces écrites structurées et détaillées (calculs, équations, schémas, tableaux, diagrammes, phrases mathématiques) qui rendent explicite chaque étape de son raisonnement. Les arguments sont pertinents et s''appuient sur des concepts mathématiques.'),
    (c3, lB, 'L''élève justifie ses choix et sa démarche de manière adéquate. Ses traces sont structurées, bien que certaines étapes soient implicites. Les arguments sont généralement pertinents.'),
    (c3, lC, 'L''élève justifie ses choix et sa démarche de manière partielle. Ses traces sont peu structurées ou plusieurs étapes sont implicites ou manquantes. Certains arguments sont imprécis ou incomplets.'),
    (c3, lD, 'L''élève justifie ses choix et sa démarche de manière insuffisante. Ses traces sont constituées d''éléments confus et isolés. Les arguments sont vagues ou peu pertinents.'),
    (c3, lE, 'L''élève ne justifie pas ses choix ou sa démarche, ou laisse peu ou pas de traces.');

END $$;
