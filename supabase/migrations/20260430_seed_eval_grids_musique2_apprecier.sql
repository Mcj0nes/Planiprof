-- ============================================================
-- PLANIPROF -- Seed: Grille d'évaluation – Apprécier, Musique 2e cycle
-- ============================================================

DO $$
DECLARE
  grid_id uuid;
  musique_id int;
  p3 int; p4 int;
  lA int; lB int; lC int; lD int; lE int;
  c1 uuid; c2 uuid; c3 uuid; c4 uuid; c5 uuid; c6 uuid;
BEGIN

  SELECT id INTO musique_id FROM subjects WHERE slug = 'musique';
  SELECT id INTO p3 FROM grade_levels WHERE education_level = 'primaire' AND grade = 3;
  SELECT id INTO p4 FROM grade_levels WHERE education_level = 'primaire' AND grade = 4;

  INSERT INTO eval_grids (title, subject_id, cycle_label, source, is_baseline, competency)
    VALUES (
      'Grille d''évaluation – Compétence : Apprécier (Musique – 2e cycle)',
      musique_id,
      '2e cycle du primaire',
      'Planiprof',
      true,
      'Apprécier des œuvres musicales, ses réalisations et celles de ses camarades'
    )
    RETURNING id INTO grid_id;

  INSERT INTO eval_grid_grades VALUES (grid_id, p3), (grid_id, p4);

  INSERT INTO eval_grid_levels (grid_id, code, label, sort_order) VALUES (grid_id, 'A', 'Excellent',        1) RETURNING id INTO lA;
  INSERT INTO eval_grid_levels (grid_id, code, label, sort_order) VALUES (grid_id, 'B', 'Très bien',        2) RETURNING id INTO lB;
  INSERT INTO eval_grid_levels (grid_id, code, label, sort_order) VALUES (grid_id, 'C', 'Acceptable',       3) RETURNING id INTO lC;
  INSERT INTO eval_grid_levels (grid_id, code, label, sort_order) VALUES (grid_id, 'D', 'Peu satisfaisant', 4) RETURNING id INTO lD;
  INSERT INTO eval_grid_levels (grid_id, code, label, sort_order) VALUES (grid_id, 'E', 'Insuffisant',      5) RETURNING id INTO lE;

  INSERT INTO eval_grid_criteria (grid_id, label, sort_order) VALUES (grid_id, 'Écouter activement une œuvre musicale',                       1) RETURNING id INTO c1;
  INSERT INTO eval_grid_criteria (grid_id, label, sort_order) VALUES (grid_id, 'Décrire des éléments musicaux simples',                       2) RETURNING id INTO c2;
  INSERT INTO eval_grid_criteria (grid_id, label, sort_order) VALUES (grid_id, 'Exprimer une réaction personnelle',                           3) RETURNING id INTO c3;
  INSERT INTO eval_grid_criteria (grid_id, label, sort_order) VALUES (grid_id, 'Porter un jugement simple sur l''œuvre ou l''interprétation', 4) RETURNING id INTO c4;
  INSERT INTO eval_grid_criteria (grid_id, label, sort_order) VALUES (grid_id, 'Faire un lien avec son vécu ou une autre œuvre',              5) RETURNING id INTO c5;
  INSERT INTO eval_grid_criteria (grid_id, label, sort_order) VALUES (grid_id, 'Utiliser un vocabulaire musical simple',                      6) RETURNING id INTO c6;

  INSERT INTO eval_grid_cells (criterion_id, level_id, descriptor) VALUES
    (c1, lA, 'Écoute attentive et soutenue; repère plusieurs éléments musicaux sans aide.'),
    (c1, lB, 'Écoute attentive; repère quelques éléments musicaux.'),
    (c1, lC, 'Écoute correcte; repère un élément musical simple.'),
    (c1, lD, 'Écoute inégale; difficulté à repérer des éléments musicaux.'),
    (c1, lE, 'Écoute minimale; ne repère aucun élément musical.'),

    (c2, lA, 'Décrit plusieurs éléments musicaux avec précision (tempo, intensité, timbre, rythme, mélodie); vocabulaire musical adéquat.'),
    (c2, lB, 'Décrit quelques éléments musicaux; vocabulaire simple mais juste.'),
    (c2, lC, 'Décrit un élément musical; vocabulaire limité.'),
    (c2, lD, 'Descriptions vagues ou inexactes.'),
    (c2, lE, 'Ne parvient pas à décrire des éléments musicaux.'),

    (c3, lA, 'Exprime clairement ce qu''il/elle ressent et pourquoi.'),
    (c3, lB, 'Exprime une réaction simple avec une raison.'),
    (c3, lC, 'Exprime une réaction, mais sans justification.'),
    (c3, lD, 'Réaction vague ou hors sujet.'),
    (c3, lE, 'Aucune réaction exprimée.'),

    (c4, lA, 'Porte un jugement clair et pertinent; s''appuie sur un élément musical.'),
    (c4, lB, 'Porte un jugement simple; justification partielle.'),
    (c4, lC, 'Porte un jugement, mais sans lien musical.'),
    (c4, lD, 'Jugement vague ou non justifié.'),
    (c4, lE, 'Aucun jugement exprimé.'),

    (c5, lA, 'Établit un lien clair et pertinent (vécu, autre œuvre, situation).'),
    (c5, lB, 'Établit un lien simple mais pertinent.'),
    (c5, lC, 'Lien présent mais limité.'),
    (c5, lD, 'Lien vague ou difficile à comprendre.'),
    (c5, lE, 'Aucun lien établi.'),

    (c6, lA, 'Utilise plusieurs mots musicaux justes (fort, doux, rapide, lent, timbre).'),
    (c6, lB, 'Utilise quelques mots musicaux adéquats.'),
    (c6, lC, 'Utilise un mot musical simple.'),
    (c6, lD, 'Vocabulaire musical limité ou inexact.'),
    (c6, lE, 'N''utilise aucun vocabulaire musical.');

END $$;
