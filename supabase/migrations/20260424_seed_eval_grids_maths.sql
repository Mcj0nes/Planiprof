-- ============================================================
-- PLANIPROF -- Seed: Grilles d'évaluation – Mathématique
-- Compétence 1 : Résoudre une situation-problème (1er cycle et 2e-3e cycles)
-- ============================================================

DO $$
DECLARE
  grid1_id uuid; grid2_id uuid;
  math_id  int;
  p1 int; p2 int; p3 int; p4 int; p5 int; p6 int;
  lA int; lB int; lC int; lD int; lE int;
  c1 uuid; c2 uuid; c3 uuid; c4 uuid;
BEGIN

  SELECT id INTO math_id FROM subjects WHERE slug = 'maths';
  SELECT id INTO p1 FROM grade_levels WHERE education_level = 'primaire' AND grade = 1;
  SELECT id INTO p2 FROM grade_levels WHERE education_level = 'primaire' AND grade = 2;
  SELECT id INTO p3 FROM grade_levels WHERE education_level = 'primaire' AND grade = 3;
  SELECT id INTO p4 FROM grade_levels WHERE education_level = 'primaire' AND grade = 4;
  SELECT id INTO p5 FROM grade_levels WHERE education_level = 'primaire' AND grade = 5;
  SELECT id INTO p6 FROM grade_levels WHERE education_level = 'primaire' AND grade = 6;

  -- ──────────────────────────────────────────────────────────
  -- Grille 1 : 1er cycle
  -- ──────────────────────────────────────────────────────────

  INSERT INTO eval_grids (title, subject_id, cycle_label, source, is_baseline, competency)
    VALUES (
      'Grille d''évaluation – SP : Résoudre une situation-problème – 1er cycle',
      math_id,
      '1er cycle du primaire',
      'Cadre d''évaluation des apprentissages – Mathématique, primaire, MEQ, 2011. Descripteurs adaptés au 1er cycle.',
      true,
      'C1 – Résoudre une situation-problème'
    )
    RETURNING id INTO grid1_id;

  INSERT INTO eval_grid_grades VALUES (grid1_id, p1), (grid1_id, p2);

  INSERT INTO eval_grid_levels (grid_id, code, label, sort_order) VALUES (grid1_id, 'A', 'Excellent',        1) RETURNING id INTO lA;
  INSERT INTO eval_grid_levels (grid_id, code, label, sort_order) VALUES (grid1_id, 'B', 'Très bien',        2) RETURNING id INTO lB;
  INSERT INTO eval_grid_levels (grid_id, code, label, sort_order) VALUES (grid1_id, 'C', 'Acceptable',       3) RETURNING id INTO lC;
  INSERT INTO eval_grid_levels (grid_id, code, label, sort_order) VALUES (grid1_id, 'D', 'Peu satisfaisant', 4) RETURNING id INTO lD;
  INSERT INTO eval_grid_levels (grid_id, code, label, sort_order) VALUES (grid1_id, 'E', 'Insuffisant',      5) RETURNING id INTO lE;

  INSERT INTO eval_grid_criteria (grid_id, label, weight, sort_order)
    VALUES (grid1_id, 'Manifestation, oralement ou par écrit, de la compréhension de la situation-problème', NULL, 1) RETURNING id INTO c1;
  INSERT INTO eval_grid_criteria (grid_id, label, weight, sort_order)
    VALUES (grid1_id, 'Mobilisation correcte des concepts et processus requis pour produire une solution appropriée', NULL, 2) RETURNING id INTO c2;
  INSERT INTO eval_grid_criteria (grid_id, label, weight, sort_order)
    VALUES (grid1_id, 'Explicitation (orale ou écrite) des éléments pertinents de la solution', NULL, 3) RETURNING id INTO c3;
  INSERT INTO eval_grid_criteria (grid_id, label, weight, sort_order)
    VALUES (grid1_id, 'Validation de la solution', NULL, 4) RETURNING id INTO c4;

  INSERT INTO eval_grid_cells (criterion_id, level_id, descriptor) VALUES
    (c1, lA, 'L''élève effectue toutes les étapes. Il tient compte de toutes les données pertinentes et de toutes les contraintes à respecter.'),
    (c1, lB, 'L''élève effectue toutes les étapes ou la plupart d''entre elles. Il tient compte de la plupart des données pertinentes et de la plupart des contraintes à respecter.'),
    (c1, lC, 'L''élève effectue plusieurs étapes. Il tient compte de plusieurs données pertinentes et de plusieurs contraintes à respecter.'),
    (c1, lD, 'L''élève effectue quelques étapes. Il tient compte de quelques données pertinentes et de quelques contraintes à respecter.'),
    (c1, lE, 'L''élève amorce quelques étapes ou effectue peu d''étapes. Il tient compte de peu de données pertinentes et de peu de contraintes à respecter.'),

    (c2, lA, 'L''élève fait appel aux concepts et processus mathématiques requis. Il produit une solution exacte ou comportant quelques erreurs mineures (erreurs de calcul, imprécisions, oublis, etc.).'),
    (c2, lB, 'L''élève fait appel à la plupart des concepts et processus mathématiques requis. Il produit une solution ou une démarche comportant peu d''erreurs conceptuelles ou procédurales.'),
    (c2, lC, 'L''élève fait appel à plusieurs concepts et processus mathématiques requis. Il produit une démarche comportant quelques erreurs conceptuelles ou procédurales.'),
    (c2, lD, 'L''élève fait appel à quelques concepts et processus mathématiques requis. Il produit une démarche partielle comportant plusieurs erreurs conceptuelles ou procédurales.'),
    (c2, lE, 'L''élève fait appel à peu de concepts et processus mathématiques requis. Il produit une démarche inappropriée ou peu appropriée comportant plusieurs erreurs conceptuelles ou procédurales.'),

    (c3, lA, 'L''élève laisse des traces complètes et organisées de sa démarche (dessins, mots, nombres, matériel). Les étapes sont faciles à suivre.'),
    (c3, lB, 'L''élève laisse des traces de sa démarche qui sont organisées, bien que certaines étapes soient implicites.'),
    (c3, lC, 'L''élève laisse des traces de sa démarche qui sont peu organisées ou dont plusieurs étapes sont implicites ou manquantes.'),
    (c3, lD, 'L''élève laisse des traces de sa démarche qui sont constituées d''éléments confus et isolés.'),
    (c3, lE, 'L''élève laisse peu ou pas de traces de sa démarche.'),

    (c4, lA, 'L''élève vérifie sa solution de façon appropriée. Il est en mesure de confirmer ou de corriger sa réponse en recourant à un moyen pertinent (reprise du calcul, estimation, matériel de manipulation, dessin, etc.).'),
    (c4, lB, 'L''élève vérifie sa solution de façon généralement appropriée. Il parvient à confirmer ou à corriger partiellement sa réponse.'),
    (c4, lC, 'L''élève tente de vérifier sa solution, mais le moyen utilisé est incomplet ou peu efficace.'),
    (c4, lD, 'L''élève tente de vérifier sa solution, mais le moyen utilisé est inapproprié ou mène à des conclusions erronées.'),
    (c4, lE, 'L''élève ne vérifie pas sa solution ou ne manifeste pas de souci de validation.');

  -- ──────────────────────────────────────────────────────────
  -- Grille 2 : 2e et 3e cycles
  -- ──────────────────────────────────────────────────────────

  INSERT INTO eval_grids (title, subject_id, cycle_label, source, is_baseline, competency)
    VALUES (
      'Grille d''évaluation – SP : Résoudre une situation-problème – 2e et 3e cycles',
      math_id,
      '2e et 3e cycles du primaire',
      'Cadre d''évaluation des apprentissages – Mathématique, primaire (MEQ, 2011), document prescriptif pour la Compétence 1 : Résoudre une situation-problème. Note : le critère de validation fait l''objet d''une rétroaction mais ne doit pas être considéré dans le résultat.',
      true,
      'C1 – Résoudre une situation-problème'
    )
    RETURNING id INTO grid2_id;

  INSERT INTO eval_grid_grades VALUES (grid2_id, p3), (grid2_id, p4), (grid2_id, p5), (grid2_id, p6);

  INSERT INTO eval_grid_levels (grid_id, code, label, sort_order) VALUES (grid2_id, 'A', 'Excellent',        1) RETURNING id INTO lA;
  INSERT INTO eval_grid_levels (grid_id, code, label, sort_order) VALUES (grid2_id, 'B', 'Très bien',        2) RETURNING id INTO lB;
  INSERT INTO eval_grid_levels (grid_id, code, label, sort_order) VALUES (grid2_id, 'C', 'Acceptable',       3) RETURNING id INTO lC;
  INSERT INTO eval_grid_levels (grid_id, code, label, sort_order) VALUES (grid2_id, 'D', 'Peu satisfaisant', 4) RETURNING id INTO lD;
  INSERT INTO eval_grid_levels (grid_id, code, label, sort_order) VALUES (grid2_id, 'E', 'Insuffisant',      5) RETURNING id INTO lE;

  INSERT INTO eval_grid_criteria (grid_id, label, weight, sort_order)
    VALUES (grid2_id, 'Manifestation, oralement ou par écrit, de la compréhension de la situation-problème', NULL, 1) RETURNING id INTO c1;
  INSERT INTO eval_grid_criteria (grid_id, label, weight, sort_order)
    VALUES (grid2_id, 'Mobilisation correcte des concepts et processus requis pour produire une solution appropriée', NULL, 2) RETURNING id INTO c2;
  INSERT INTO eval_grid_criteria (grid_id, label, weight, sort_order)
    VALUES (grid2_id, 'Explicitation (orale ou écrite) des éléments pertinents de la solution', NULL, 3) RETURNING id INTO c3;
  INSERT INTO eval_grid_criteria (grid_id, label, weight, sort_order)
    VALUES (grid2_id, 'Explication adéquate (orale ou écrite) de la validation de la solution *', NULL, 4) RETURNING id INTO c4;

  INSERT INTO eval_grid_cells (criterion_id, level_id, descriptor) VALUES
    (c1, lA, 'L''élève effectue toutes les étapes. Il tient compte de toutes les données pertinentes et de toutes les contraintes à respecter.'),
    (c1, lB, 'L''élève effectue toutes les étapes ou la plupart d''entre elles. Il tient compte de la plupart des données pertinentes et de la plupart des contraintes à respecter.'),
    (c1, lC, 'L''élève effectue plusieurs étapes. Il tient compte de plusieurs données pertinentes et de plusieurs contraintes à respecter.'),
    (c1, lD, 'L''élève effectue quelques étapes. Il tient compte de quelques données pertinentes et de quelques contraintes à respecter.'),
    (c1, lE, 'L''élève amorce quelques étapes ou effectue peu d''étapes. Il tient compte de peu de données pertinentes et de peu de contraintes à respecter.'),

    (c2, lA, 'L''élève fait appel aux concepts et processus mathématiques requis. Il produit une solution exacte ou comportant quelques erreurs mineures (erreurs de calcul, imprécisions, oublis, etc.).'),
    (c2, lB, 'L''élève fait appel à la plupart des concepts et processus mathématiques requis. Il produit une solution ou une démarche comportant peu d''erreurs conceptuelles ou procédurales.'),
    (c2, lC, 'L''élève fait appel à plusieurs concepts et processus mathématiques requis. Il produit une démarche comportant quelques erreurs conceptuelles ou procédurales.'),
    (c2, lD, 'L''élève fait appel à quelques concepts et processus mathématiques requis. Il produit une démarche partielle comportant plusieurs erreurs conceptuelles ou procédurales.'),
    (c2, lE, 'L''élève fait appel à peu de concepts et processus mathématiques requis. Il produit une démarche inappropriée ou peu appropriée comportant plusieurs erreurs conceptuelles ou procédurales.'),

    (c3, lA, 'L''élève laisse des traces complètes et structurées de sa démarche.'),
    (c3, lB, 'L''élève laisse des traces de sa démarche qui sont structurées, bien que certaines étapes soient implicites.'),
    (c3, lC, 'L''élève laisse des traces de sa démarche qui sont peu structurées ou dont plusieurs étapes sont implicites ou manquantes.'),
    (c3, lD, 'L''élève laisse des traces de sa démarche qui sont constituées d''éléments confus et isolés.'),
    (c3, lE, 'L''élève laisse peu de traces.'),

    (c4, lA, 'L''élève valide sa solution et la rectifie, au besoin.'),
    (c4, lB, 'L''élève valide la plupart des étapes de sa démarche et la rectifie, au besoin.'),
    (c4, lC, 'L''élève valide quelques étapes de sa démarche.'),
    (c4, lD, 'L''élève remet peu en question les résultats qu''il obtient.'),
    (c4, lE, 'L''élève ne remet pas en question les résultats qu''il obtient.');

END $$;
