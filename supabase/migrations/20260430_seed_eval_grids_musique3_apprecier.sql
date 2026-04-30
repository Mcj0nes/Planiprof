-- ============================================================
-- PLANIPROF -- Seed: Grille d'évaluation – Apprécier, Musique 3e cycle
-- ============================================================

DO $$
DECLARE
  grid_id uuid;
  musique_id int;
  p5 int; p6 int;
  lA int; lB int; lC int; lD int; lE int;
  c1 uuid; c2 uuid; c3 uuid; c4 uuid; c5 uuid; c6 uuid;
BEGIN

  SELECT id INTO musique_id FROM subjects WHERE slug = 'musique';
  SELECT id INTO p5 FROM grade_levels WHERE education_level = 'primaire' AND grade = 5;
  SELECT id INTO p6 FROM grade_levels WHERE education_level = 'primaire' AND grade = 6;

  INSERT INTO eval_grids (title, subject_id, cycle_label, source, is_baseline, competency)
    VALUES (
      'Grille d''évaluation – Compétence : Apprécier (Musique – 3e cycle)',
      musique_id,
      '3e cycle du primaire',
      'Planiprof',
      true,
      'Apprécier des œuvres musicales, ses réalisations et celles de ses camarades'
    )
    RETURNING id INTO grid_id;

  INSERT INTO eval_grid_grades VALUES (grid_id, p5), (grid_id, p6);

  INSERT INTO eval_grid_levels (grid_id, code, label, sort_order) VALUES (grid_id, 'A', 'Excellent',        1) RETURNING id INTO lA;
  INSERT INTO eval_grid_levels (grid_id, code, label, sort_order) VALUES (grid_id, 'B', 'Très bien',        2) RETURNING id INTO lB;
  INSERT INTO eval_grid_levels (grid_id, code, label, sort_order) VALUES (grid_id, 'C', 'Acceptable',       3) RETURNING id INTO lC;
  INSERT INTO eval_grid_levels (grid_id, code, label, sort_order) VALUES (grid_id, 'D', 'Peu satisfaisant', 4) RETURNING id INTO lD;
  INSERT INTO eval_grid_levels (grid_id, code, label, sort_order) VALUES (grid_id, 'E', 'Insuffisant',      5) RETURNING id INTO lE;

  INSERT INTO eval_grid_criteria (grid_id, label, sort_order) VALUES (grid_id, 'Écouter activement une œuvre musicale',                                   1) RETURNING id INTO c1;
  INSERT INTO eval_grid_criteria (grid_id, label, sort_order) VALUES (grid_id, 'Décrire des éléments musicaux',                                           2) RETURNING id INTO c2;
  INSERT INTO eval_grid_criteria (grid_id, label, sort_order) VALUES (grid_id, 'Exprimer une réaction personnelle',                                       3) RETURNING id INTO c3;
  INSERT INTO eval_grid_criteria (grid_id, label, sort_order) VALUES (grid_id, 'Porter un jugement simple sur l''œuvre ou l''interprétation',             4) RETURNING id INTO c4;
  INSERT INTO eval_grid_criteria (grid_id, label, sort_order) VALUES (grid_id, 'Faire des liens avec son vécu, d''autres œuvres ou d''autres interprétations', 5) RETURNING id INTO c5;
  INSERT INTO eval_grid_criteria (grid_id, label, sort_order) VALUES (grid_id, 'Utiliser un vocabulaire musical approprié',                               6) RETURNING id INTO c6;

  INSERT INTO eval_grid_cells (criterion_id, level_id, descriptor) VALUES
    (c1, lA, 'Écoute attentive et soutenue; repère plusieurs éléments musicaux sans aide; reste concentré tout au long de l''écoute.'),
    (c1, lB, 'Écoute attentive; repère quelques éléments musicaux; concentration généralement stable.'),
    (c1, lC, 'Écoute correcte; repère un ou deux éléments musicaux simples.'),
    (c1, lD, 'Écoute inégale; difficulté à repérer des éléments musicaux.'),
    (c1, lE, 'Écoute minimale; ne repère aucun élément musical.'),

    (c2, lA, 'Décrit plusieurs éléments musicaux avec précision (tempo, intensité, timbre, rythme, mélodie, texture, forme); vocabulaire musical approprié.'),
    (c2, lB, 'Décrit quelques éléments musicaux; vocabulaire généralement adéquat.'),
    (c2, lC, 'Décrit un ou deux éléments simples; vocabulaire limité.'),
    (c2, lD, 'Descriptions vagues ou inexactes; vocabulaire musical faible.'),
    (c2, lE, 'Ne parvient pas à décrire des éléments musicaux.'),

    (c3, lA, 'Exprime une réaction claire et nuancée; explique ce qu''il/elle ressent et pourquoi.'),
    (c3, lB, 'Exprime une réaction simple; donne une raison pertinente.'),
    (c3, lC, 'Exprime une réaction, mais sans justification claire.'),
    (c3, lD, 'Réaction vague ou hors sujet.'),
    (c3, lE, 'Aucune réaction exprimée.'),

    (c4, lA, 'Porte un jugement clair et pertinent; s''appuie sur des éléments musicaux précis.'),
    (c4, lB, 'Porte un jugement simple; fait un lien avec un élément musical.'),
    (c4, lC, 'Porte un jugement, mais sans lien musical clair.'),
    (c4, lD, 'Jugement vague ou non justifié.'),
    (c4, lE, 'Aucun jugement exprimé.'),

    (c5, lA, 'Établit des liens pertinents et variés (vécu, œuvres, styles, interprétations).'),
    (c5, lB, 'Établit un lien pertinent avec son vécu ou une autre œuvre.'),
    (c5, lC, 'Lien simple mais présent.'),
    (c5, lD, 'Lien vague ou difficile à comprendre.'),
    (c5, lE, 'Aucun lien établi.'),

    (c6, lA, 'Utilise un vocabulaire musical riche et précis (tempo, timbre, intensité, phrasé, texture).'),
    (c6, lB, 'Utilise plusieurs mots musicaux adéquats.'),
    (c6, lC, 'Utilise quelques mots musicaux simples.'),
    (c6, lD, 'Vocabulaire musical limité ou inexact.'),
    (c6, lE, 'N''utilise aucun vocabulaire musical.');

END $$;
