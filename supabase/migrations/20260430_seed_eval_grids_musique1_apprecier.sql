-- ============================================================
-- PLANIPROF -- Seed: Grille d'évaluation – Apprécier, Musique 1er cycle
-- ============================================================

DO $$
DECLARE
  grid_id uuid;
  musique_id int;
  p1 int; p2 int;
  lA int; lB int; lC int; lD int; lE int;
  c1 uuid; c2 uuid; c3 uuid; c4 uuid; c5 uuid; c6 uuid;
BEGIN

  SELECT id INTO musique_id FROM subjects WHERE slug = 'musique';
  SELECT id INTO p1 FROM grade_levels WHERE education_level = 'primaire' AND grade = 1;
  SELECT id INTO p2 FROM grade_levels WHERE education_level = 'primaire' AND grade = 2;

  INSERT INTO eval_grids (title, subject_id, cycle_label, source, is_baseline, competency)
    VALUES (
      'Grille d''évaluation – Compétence : Apprécier (Musique – 1er cycle)',
      musique_id,
      '1er cycle du primaire',
      'Planiprof',
      true,
      'Apprécier des œuvres musicales, ses réalisations et celles de ses camarades'
    )
    RETURNING id INTO grid_id;

  INSERT INTO eval_grid_grades VALUES (grid_id, p1), (grid_id, p2);

  INSERT INTO eval_grid_levels (grid_id, code, label, sort_order) VALUES (grid_id, 'A', 'Excellent',        1) RETURNING id INTO lA;
  INSERT INTO eval_grid_levels (grid_id, code, label, sort_order) VALUES (grid_id, 'B', 'Très bien',        2) RETURNING id INTO lB;
  INSERT INTO eval_grid_levels (grid_id, code, label, sort_order) VALUES (grid_id, 'C', 'Acceptable',       3) RETURNING id INTO lC;
  INSERT INTO eval_grid_levels (grid_id, code, label, sort_order) VALUES (grid_id, 'D', 'Peu satisfaisant', 4) RETURNING id INTO lD;
  INSERT INTO eval_grid_levels (grid_id, code, label, sort_order) VALUES (grid_id, 'E', 'Insuffisant',      5) RETURNING id INTO lE;

  INSERT INTO eval_grid_criteria (grid_id, label, sort_order) VALUES (grid_id, 'Écouter activement une œuvre musicale',        1) RETURNING id INTO c1;
  INSERT INTO eval_grid_criteria (grid_id, label, sort_order) VALUES (grid_id, 'Décrire un élément musical simple',            2) RETURNING id INTO c2;
  INSERT INTO eval_grid_criteria (grid_id, label, sort_order) VALUES (grid_id, 'Exprimer une réaction personnelle',            3) RETURNING id INTO c3;
  INSERT INTO eval_grid_criteria (grid_id, label, sort_order) VALUES (grid_id, 'Porter un jugement simple sur l''œuvre',       4) RETURNING id INTO c4;
  INSERT INTO eval_grid_criteria (grid_id, label, sort_order) VALUES (grid_id, 'Faire un lien avec son vécu',                  5) RETURNING id INTO c5;
  INSERT INTO eval_grid_criteria (grid_id, label, sort_order) VALUES (grid_id, 'Utiliser un vocabulaire musical simple',       6) RETURNING id INTO c6;

  INSERT INTO eval_grid_cells (criterion_id, level_id, descriptor) VALUES
    (c1, lA, 'Écoute attentive; reste concentré; repère un ou deux éléments musicaux sans aide.'),
    (c1, lB, 'Écoute généralement attentive; repère un élément musical avec un peu d''aide.'),
    (c1, lC, 'Écoute correcte; repère un élément simple lorsque guidé.'),
    (c1, lD, 'Écoute inégale; difficulté à repérer un élément musical même avec aide.'),
    (c1, lE, 'Écoute minimale; ne repère aucun élément musical.'),

    (c2, lA, 'Décrit clairement un élément musical avec un mot juste (fort/doux, rapide/lent, voix/instrument, aigu/grave).'),
    (c2, lB, 'Décrit un élément musical simple; vocabulaire parfois approximatif.'),
    (c2, lC, 'Décrit vaguement un élément musical; vocabulaire limité.'),
    (c2, lD, 'Description difficile à comprendre ou hors sujet.'),
    (c2, lE, 'Ne parvient pas à décrire un élément musical.'),

    (c3, lA, 'Exprime ce qu''il/elle ressent et donne une raison simple.'),
    (c3, lB, 'Exprime une réaction simple; justification partielle.'),
    (c3, lC, 'Exprime une réaction sans justification.'),
    (c3, lD, 'Réaction vague ou hors sujet.'),
    (c3, lE, 'Aucune réaction exprimée.'),

    (c4, lA, 'Porte un jugement clair (ex. « j''aime / je n''aime pas ») et donne une raison simple.'),
    (c4, lB, 'Porte un jugement simple; justification limitée.'),
    (c4, lC, 'Porte un jugement sans justification.'),
    (c4, lD, 'Jugement vague ou hors sujet.'),
    (c4, lE, 'Aucun jugement exprimé.'),

    (c5, lA, 'Établit un lien clair avec une expérience personnelle ou une situation connue.'),
    (c5, lB, 'Établit un lien simple mais pertinent.'),
    (c5, lC, 'Lien présent mais limité.'),
    (c5, lD, 'Lien vague ou difficile à comprendre.'),
    (c5, lE, 'Aucun lien établi.'),

    (c6, lA, 'Utilise plusieurs mots musicaux justes (fort, doux, rapide, lent, aigu, grave).'),
    (c6, lB, 'Utilise quelques mots musicaux adéquats.'),
    (c6, lC, 'Utilise un mot musical simple.'),
    (c6, lD, 'Vocabulaire musical limité ou inexact.'),
    (c6, lE, 'N''utilise aucun vocabulaire musical.');

END $$;
