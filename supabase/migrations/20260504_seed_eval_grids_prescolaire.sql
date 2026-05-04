-- ============================================================
-- PLANIPROF — Grilles d'évaluation préscolaire (6 grilles)
-- 1 par domaine de développement + 1 portrait global
-- Basées sur le Programme-cycle de l'éducation préscolaire (MEQ 2021)
-- Échelle : DA – En apprentissage – En consolidation – Acquis
-- ============================================================

DO $$
DECLARE
  g4a int; g5a int;
  s_physique int; s_affectif int; s_social int; s_langage int; s_monde int;

  gid uuid;
  lDA int; lEA int; lEC int; lAC int;   -- 4 niveaux préscolaire
  c1 uuid; c2 uuid; c3 uuid; c4 uuid; c5 uuid;

BEGIN

  -- Idempotency guard
  IF EXISTS (
    SELECT 1 FROM eval_grids eg
    JOIN subjects s ON s.id = eg.subject_id
    WHERE s.slug = 'dev-physique' AND eg.is_baseline = true
  ) THEN
    RAISE NOTICE 'Grilles préscolaire already seeded — skipping.';
    RETURN;
  END IF;

  SELECT id INTO g4a FROM grade_levels WHERE education_level = 'préscolaire' AND grade = -2;
  SELECT id INTO g5a FROM grade_levels WHERE education_level = 'préscolaire' AND grade = -1;
  SELECT id INTO s_physique  FROM subjects WHERE slug = 'dev-physique';
  SELECT id INTO s_affectif  FROM subjects WHERE slug = 'dev-affectif';
  SELECT id INTO s_social    FROM subjects WHERE slug = 'dev-social';
  SELECT id INTO s_langage   FROM subjects WHERE slug = 'comm-langage';
  SELECT id INTO s_monde     FROM subjects WHERE slug = 'decouverte-monde';


  -- ══════════════════════════════════════════════════════════
  -- GRILLE 1 — Développement physique et moteur
  -- ══════════════════════════════════════════════════════════

  INSERT INTO eval_grids (title, subject_id, cycle_label, source, is_baseline, competency)
    VALUES (
      'Grille d''évaluation — Développement physique et moteur',
      s_physique,
      'Éducation préscolaire',
      'Programme-cycle de l''éducation préscolaire – MEQ, 2021.',
      true,
      'Agir avec efficacité dans différents contextes sur le plan sensoriel et moteur'
    ) RETURNING id INTO gid;

  INSERT INTO eval_grid_grades VALUES (gid, g4a), (gid, g5a);

  INSERT INTO eval_grid_levels (grid_id, code, label, sort_order) VALUES (gid, 'DA', 'Début d''apprentissage', 1) RETURNING id INTO lDA;
  INSERT INTO eval_grid_levels (grid_id, code, label, sort_order) VALUES (gid, 'EA', 'En apprentissage',       2) RETURNING id INTO lEA;
  INSERT INTO eval_grid_levels (grid_id, code, label, sort_order) VALUES (gid, 'EC', 'En consolidation',       3) RETURNING id INTO lEC;
  INSERT INTO eval_grid_levels (grid_id, code, label, sort_order) VALUES (gid, 'A',  'Acquis',                 4) RETURNING id INTO lAC;

  INSERT INTO eval_grid_criteria (grid_id, label, weight, sort_order)
    VALUES (gid, 'Motricité globale', NULL, 1) RETURNING id INTO c1;
  INSERT INTO eval_grid_criteria (grid_id, label, weight, sort_order)
    VALUES (gid, 'Motricité fine', NULL, 2) RETURNING id INTO c2;
  INSERT INTO eval_grid_criteria (grid_id, label, weight, sort_order)
    VALUES (gid, 'Connaissance du corps et orientation dans l''espace', NULL, 3) RETURNING id INTO c3;
  INSERT INTO eval_grid_criteria (grid_id, label, weight, sort_order)
    VALUES (gid, 'Saines habitudes de vie (hygiène, alimentation, sécurité)', NULL, 4) RETURNING id INTO c4;
  INSERT INTO eval_grid_criteria (grid_id, label, weight, sort_order)
    VALUES (gid, 'Engagement et participation aux activités physiques', NULL, 5) RETURNING id INTO c5;

  INSERT INTO eval_grid_cells (criterion_id, level_id, descriptor) VALUES
    (c1, lDA, 'Effectue des déplacements de base avec difficulté; a besoin d''aide pour maintenir son équilibre.'),
    (c1, lEA, 'Effectue quelques types de déplacements; maintient son équilibre dans des situations simples.'),
    (c1, lEC, 'Effectue plusieurs types de déplacements de façon coordonnée; maintient généralement son équilibre.'),
    (c1, lAC, 'Effectue avec aisance une grande variété de déplacements (courir, sauter, grimper, rouler); maintient son équilibre dans des contextes variés.'),

    (c2, lDA, 'Manipule les outils et matériaux avec beaucoup de difficulté; gestes imprécis malgré le soutien.'),
    (c2, lEA, 'Tient les outils avec effort; effectue des manipulations simples (couper, coller) avec soutien.'),
    (c2, lEC, 'Tient correctement la plupart des outils; effectue des gestes fins avec une précision acceptable.'),
    (c2, lAC, 'Manipule avec aisance les outils scripteurs et matériaux; effectue des gestes fins précis et coordonnés (découper, modeler, tracer).'),

    (c3, lDA, 'Reconnaît peu de parties de son corps; a de la difficulté à se situer dans l''espace.'),
    (c3, lEA, 'Reconnaît les principales parties de son corps; commence à se situer dans l''espace avec aide.'),
    (c3, lEC, 'Reconnaît et nomme les parties de son corps; se situe dans l''espace (dessus/dessous, devant/derrière).'),
    (c3, lAC, 'Nomme avec précision les parties de son corps; se situe aisément dans l''espace; comprend les relations spatiales (gauche/droite).'),

    (c4, lDA, 'Applique rarement les règles d''hygiène et de sécurité; nécessite des rappels constants.'),
    (c4, lEA, 'Applique quelques règles d''hygiène et de sécurité avec rappels fréquents.'),
    (c4, lEC, 'Applique généralement les routines d''hygiène et les règles de sécurité avec peu de rappels.'),
    (c4, lAC, 'Applique de façon autonome les routines d''hygiène et les comportements sécuritaires; reconnaît l''importance d''une saine alimentation.'),

    (c5, lDA, 'S''engage peu dans les activités physiques; abandonne facilement.'),
    (c5, lEA, 'Participe aux activités physiques avec encouragements; s''engage par moments.'),
    (c5, lEC, 'Participe activement à la plupart des activités physiques; manifeste de l''intérêt.'),
    (c5, lAC, 'Participe avec enthousiasme aux activités physiques; reconnaît les bienfaits du mouvement; accepte de se reposer.');


  -- ══════════════════════════════════════════════════════════
  -- GRILLE 2 — Développement affectif
  -- ══════════════════════════════════════════════════════════

  INSERT INTO eval_grids (title, subject_id, cycle_label, source, is_baseline, competency)
    VALUES (
      'Grille d''évaluation — Développement affectif',
      s_affectif,
      'Éducation préscolaire',
      'Programme-cycle de l''éducation préscolaire – MEQ, 2021.',
      true,
      'Affirmer sa personnalité'
    ) RETURNING id INTO gid;

  INSERT INTO eval_grid_grades VALUES (gid, g4a), (gid, g5a);

  INSERT INTO eval_grid_levels (grid_id, code, label, sort_order) VALUES (gid, 'DA', 'Début d''apprentissage', 1) RETURNING id INTO lDA;
  INSERT INTO eval_grid_levels (grid_id, code, label, sort_order) VALUES (gid, 'EA', 'En apprentissage',       2) RETURNING id INTO lEA;
  INSERT INTO eval_grid_levels (grid_id, code, label, sort_order) VALUES (gid, 'EC', 'En consolidation',       3) RETURNING id INTO lEC;
  INSERT INTO eval_grid_levels (grid_id, code, label, sort_order) VALUES (gid, 'A',  'Acquis',                 4) RETURNING id INTO lAC;

  INSERT INTO eval_grid_criteria (grid_id, label, weight, sort_order)
    VALUES (gid, 'Expression et régulation des émotions', NULL, 1) RETURNING id INTO c1;
  INSERT INTO eval_grid_criteria (grid_id, label, weight, sort_order)
    VALUES (gid, 'Connaissance de soi (caractéristiques, goûts, besoins)', NULL, 2) RETURNING id INTO c2;
  INSERT INTO eval_grid_criteria (grid_id, label, weight, sort_order)
    VALUES (gid, 'Autonomie et prise d''initiative', NULL, 3) RETURNING id INTO c3;
  INSERT INTO eval_grid_criteria (grid_id, label, weight, sort_order)
    VALUES (gid, 'Persévérance et confiance en soi face aux défis', NULL, 4) RETURNING id INTO c4;

  INSERT INTO eval_grid_cells (criterion_id, level_id, descriptor) VALUES
    (c1, lDA, 'Exprime ses émotions de façon inadéquate (agressivité, repli) ou ne les identifie pas; réagit impulsivement.'),
    (c1, lEA, 'Identifie quelques émotions de base; les exprime parfois de façon appropriée avec l''aide de l''adulte.'),
    (c1, lEC, 'Identifie et nomme ses émotions (joie, colère, peur, tristesse); les exprime généralement de façon appropriée.'),
    (c1, lAC, 'Identifie et exprime ses émotions avec justesse; commence à les réguler de façon autonome dans la plupart des situations.'),

    (c2, lDA, 'A de la difficulté à identifier ses caractéristiques, ses goûts ou ses besoins.'),
    (c2, lEA, 'Identifie quelques-unes de ses caractéristiques et besoins avec la guidance de l''adulte.'),
    (c2, lEC, 'Reconnaît ses caractéristiques personnelles, ses goûts et ses intérêts; exprime généralement ses besoins.'),
    (c2, lAC, 'Connaît bien ses caractéristiques, ses goûts et ses intérêts; exprime clairement ses besoins; accepte ses forces et ses limites.'),

    (c3, lDA, 'Attend constamment l''aide ou la directive d''un adulte; prend très peu d''initiatives.'),
    (c3, lEA, 'Fait quelques tentatives d''initiative; cherche rapidement l''approbation ou l''aide d''un adulte.'),
    (c3, lEC, 'Prend des initiatives dans les activités connues; fait des choix simples avec peu de soutien.'),
    (c3, lAC, 'Fait preuve d''autonomie dans les routines quotidiennes; prend des initiatives et des décisions de façon indépendante.'),

    (c4, lDA, 'Abandonne rapidement face aux obstacles; se décourage facilement; remet souvent en question ses capacités.'),
    (c4, lEA, 'Tente de surmonter les défis avec beaucoup d''encouragements; persévère brièvement.'),
    (c4, lEC, 'Persévère généralement face aux difficultés; accepte de recommencer avec peu d''encouragements.'),
    (c4, lAC, 'Persévère face aux obstacles; cherche des solutions de façon autonome; accepte les erreurs comme partie de l''apprentissage.');


  -- ══════════════════════════════════════════════════════════
  -- GRILLE 3 — Développement social
  -- ══════════════════════════════════════════════════════════

  INSERT INTO eval_grids (title, subject_id, cycle_label, source, is_baseline, competency)
    VALUES (
      'Grille d''évaluation — Développement social',
      s_social,
      'Éducation préscolaire',
      'Programme-cycle de l''éducation préscolaire – MEQ, 2021.',
      true,
      'Interagir de façon harmonieuse avec les autres'
    ) RETURNING id INTO gid;

  INSERT INTO eval_grid_grades VALUES (gid, g4a), (gid, g5a);

  INSERT INTO eval_grid_levels (grid_id, code, label, sort_order) VALUES (gid, 'DA', 'Début d''apprentissage', 1) RETURNING id INTO lDA;
  INSERT INTO eval_grid_levels (grid_id, code, label, sort_order) VALUES (gid, 'EA', 'En apprentissage',       2) RETURNING id INTO lEA;
  INSERT INTO eval_grid_levels (grid_id, code, label, sort_order) VALUES (gid, 'EC', 'En consolidation',       3) RETURNING id INTO lEC;
  INSERT INTO eval_grid_levels (grid_id, code, label, sort_order) VALUES (gid, 'A',  'Acquis',                 4) RETURNING id INTO lAC;

  INSERT INTO eval_grid_criteria (grid_id, label, weight, sort_order)
    VALUES (gid, 'Qualité des relations avec les pairs et les adultes', NULL, 1) RETURNING id INTO c1;
  INSERT INTO eval_grid_criteria (grid_id, label, weight, sort_order)
    VALUES (gid, 'Participation aux activités collectives', NULL, 2) RETURNING id INTO c2;
  INSERT INTO eval_grid_criteria (grid_id, label, weight, sort_order)
    VALUES (gid, 'Respect des règles de vie et des besoins des autres', NULL, 3) RETURNING id INTO c3;
  INSERT INTO eval_grid_criteria (grid_id, label, weight, sort_order)
    VALUES (gid, 'Coopération et gestion des conflits', NULL, 4) RETURNING id INTO c4;

  INSERT INTO eval_grid_cells (criterion_id, level_id, descriptor) VALUES
    (c1, lDA, 'A de la difficulté à tisser des liens; évite ou craint les interactions avec les pairs et les adultes.'),
    (c1, lEA, 'Établit des liens avec quelques pairs; interactions limitées, nécessite le soutien de l''adulte.'),
    (c1, lEC, 'Tisse des liens positifs avec plusieurs pairs et adultes; participe aux échanges.'),
    (c1, lAC, 'S''intègre aisément au groupe; maintient des relations positives avec pairs et adultes; est ouvert à la diversité.'),

    (c2, lDA, 'Participe peu ou refuse de s''engager dans les activités de groupe; se tient en retrait.'),
    (c2, lEA, 'Participe aux activités collectives avec beaucoup d''encouragements; contribution limitée.'),
    (c2, lEC, 'Participe activement à la plupart des activités collectives; contribue au groupe.'),
    (c2, lAC, 'Participe avec enthousiasme; contribue de façon significative à la vie du groupe; assume des responsabilités.'),

    (c3, lDA, 'Respecte rarement les règles de vie, même avec des rappels fréquents; peu sensible aux besoins des autres.'),
    (c3, lEA, 'Respecte certaines règles de vie avec rappels réguliers; commence à reconnaître les besoins des autres.'),
    (c3, lEC, 'Respecte la plupart des règles de vie avec peu de rappels; reconnaît et respecte généralement les besoins des autres.'),
    (c3, lAC, 'Respecte les règles de vie de façon autonome; reconnaît et respecte les besoins des autres; comprend leur importance pour le vivre-ensemble.'),

    (c4, lDA, 'A de la difficulté à coopérer; gère les conflits de façon inadéquate (agressivité, retrait).'),
    (c4, lEA, 'Coopère dans des situations simples avec soutien; a besoin d''aide pour résoudre les conflits.'),
    (c4, lEC, 'Coopère et travaille en équipe dans la plupart des situations; tente de résoudre les conflits avec peu de soutien.'),
    (c4, lAC, 'Coopère efficacement; résout les conflits de façon pacifique (mots, négociation) de façon autonome.');


  -- ══════════════════════════════════════════════════════════
  -- GRILLE 4 — Communication et langage
  -- ══════════════════════════════════════════════════════════

  INSERT INTO eval_grids (title, subject_id, cycle_label, source, is_baseline, competency)
    VALUES (
      'Grille d''évaluation — Communication et langage',
      s_langage,
      'Éducation préscolaire',
      'Programme-cycle de l''éducation préscolaire – MEQ, 2021.',
      true,
      'Communiquer en utilisant les ressources de la langue'
    ) RETURNING id INTO gid;

  INSERT INTO eval_grid_grades VALUES (gid, g4a), (gid, g5a);

  INSERT INTO eval_grid_levels (grid_id, code, label, sort_order) VALUES (gid, 'DA', 'Début d''apprentissage', 1) RETURNING id INTO lDA;
  INSERT INTO eval_grid_levels (grid_id, code, label, sort_order) VALUES (gid, 'EA', 'En apprentissage',       2) RETURNING id INTO lEA;
  INSERT INTO eval_grid_levels (grid_id, code, label, sort_order) VALUES (gid, 'EC', 'En consolidation',       3) RETURNING id INTO lEC;
  INSERT INTO eval_grid_levels (grid_id, code, label, sort_order) VALUES (gid, 'A',  'Acquis',                 4) RETURNING id INTO lAC;

  INSERT INTO eval_grid_criteria (grid_id, label, weight, sort_order)
    VALUES (gid, 'Expression orale et vocabulaire', NULL, 1) RETURNING id INTO c1;
  INSERT INTO eval_grid_criteria (grid_id, label, weight, sort_order)
    VALUES (gid, 'Compréhension de messages oraux variés', NULL, 2) RETURNING id INTO c2;
  INSERT INTO eval_grid_criteria (grid_id, label, weight, sort_order)
    VALUES (gid, 'Conscience phonologique (rimes, syllabes, sons)', NULL, 3) RETURNING id INTO c3;
  INSERT INTO eval_grid_criteria (grid_id, label, weight, sort_order)
    VALUES (gid, 'Connaissance de l''écrit et des lettres de l''alphabet', NULL, 4) RETURNING id INTO c4;
  INSERT INTO eval_grid_criteria (grid_id, label, weight, sort_order)
    VALUES (gid, 'Initiation à l''écriture', NULL, 5) RETURNING id INTO c5;

  INSERT INTO eval_grid_cells (criterion_id, level_id, descriptor) VALUES
    (c1, lDA, 'S''exprime avec peu de mots; interactions verbales très limitées même avec encouragements.'),
    (c1, lEA, 'S''exprime en phrases simples; participe aux échanges avec encouragements; vocabulaire limité.'),
    (c1, lEC, 'S''exprime en phrases correctes; enrichit son vocabulaire; participe activement aux échanges.'),
    (c1, lAC, 'S''exprime clairement avec un vocabulaire varié et précis; produit des énoncés complexes; interagit aisément à l''oral.'),

    (c2, lDA, 'A de la difficulté à suivre des consignes simples ou à comprendre des récits courts.'),
    (c2, lEA, 'Suit des consignes simples; comprend des récits courts avec répétitions et aide.'),
    (c2, lEC, 'Comprend des consignes, des récits et des messages variés avec peu d''aide.'),
    (c2, lAC, 'Comprend des messages oraux complexes et variés (consignes, récits, explications) de façon autonome.'),

    (c3, lDA, 'Ne reconnaît pas encore les rimes ou les syllabes dans les mots.'),
    (c3, lEA, 'Reconnaît les rimes et certaines syllabes avec modélisation et aide.'),
    (c3, lEC, 'Identifie les rimes, les syllabes et les sons initiaux avec peu de soutien.'),
    (c3, lAC, 'Manipule aisément les sons de la langue (rimes, syllabes, phonèmes initiaux) de façon autonome.'),

    (c4, lDA, 'Montre peu d''intérêt pour l''écrit; ne reconnaît pas encore les lettres ni les fonctions de l''écrit.'),
    (c4, lEA, 'Reconnaît quelques lettres de l''alphabet; commence à comprendre les fonctions de l''écrit avec guidance.'),
    (c4, lEC, 'Reconnaît plusieurs lettres (nom et son correspondant); comprend les principales fonctions de l''écrit.'),
    (c4, lAC, 'Connaît les lettres de l''alphabet (nom et son); reconnaît les fonctions de l''écrit dans son environnement; montre de l''intérêt pour la lecture.'),

    (c5, lDA, 'Ne manifeste pas encore d''intérêt pour l''écriture; gribouillage non dirigé.'),
    (c5, lEA, 'Tente de tracer des lettres avec aide; écriture émergente (pseudo-lettres).'),
    (c5, lEC, 'Trace plusieurs lettres correctement; commence à écrire son prénom et quelques mots familiers.'),
    (c5, lAC, 'Trace les lettres avec précision; écrit son prénom et des mots familiers; respecte les conventions de l''écrit (gauche à droite, haut en bas).');


  -- ══════════════════════════════════════════════════════════
  -- GRILLE 5 — Découverte du monde
  -- ══════════════════════════════════════════════════════════

  INSERT INTO eval_grids (title, subject_id, cycle_label, source, is_baseline, competency)
    VALUES (
      'Grille d''évaluation — Découverte du monde',
      s_monde,
      'Éducation préscolaire',
      'Programme-cycle de l''éducation préscolaire – MEQ, 2021.',
      true,
      'Construire sa compréhension du monde'
    ) RETURNING id INTO gid;

  INSERT INTO eval_grid_grades VALUES (gid, g4a), (gid, g5a);

  INSERT INTO eval_grid_levels (grid_id, code, label, sort_order) VALUES (gid, 'DA', 'Début d''apprentissage', 1) RETURNING id INTO lDA;
  INSERT INTO eval_grid_levels (grid_id, code, label, sort_order) VALUES (gid, 'EA', 'En apprentissage',       2) RETURNING id INTO lEA;
  INSERT INTO eval_grid_levels (grid_id, code, label, sort_order) VALUES (gid, 'EC', 'En consolidation',       3) RETURNING id INTO lEC;
  INSERT INTO eval_grid_levels (grid_id, code, label, sort_order) VALUES (gid, 'A',  'Acquis',                 4) RETURNING id INTO lAC;

  INSERT INTO eval_grid_criteria (grid_id, label, weight, sort_order)
    VALUES (gid, 'Curiosité, exploration et questionnement', NULL, 1) RETURNING id INTO c1;
  INSERT INTO eval_grid_criteria (grid_id, label, weight, sort_order)
    VALUES (gid, 'Raisonnement, créativité et résolution de problèmes', NULL, 2) RETURNING id INTO c2;
  INSERT INTO eval_grid_criteria (grid_id, label, weight, sort_order)
    VALUES (gid, E'Exploration mathématique\n↳ 4 ans : collections jusqu''à 10 | 5 ans : jusqu''à 20', NULL, 3) RETURNING id INTO c3;
  INSERT INTO eval_grid_criteria (grid_id, label, weight, sort_order)
    VALUES (gid, 'Exploration scientifique et naturelle', NULL, 4) RETURNING id INTO c4;
  INSERT INTO eval_grid_criteria (grid_id, label, weight, sort_order)
    VALUES (gid, 'Connaissance de son milieu de vie (univers social)', NULL, 5) RETURNING id INTO c5;

  INSERT INTO eval_grid_cells (criterion_id, level_id, descriptor) VALUES
    (c1, lDA, 'Montre peu de curiosité; s''engage rarement dans l''exploration de l''environnement.'),
    (c1, lEA, 'Explore son environnement avec encouragements; pose quelques questions simples.'),
    (c1, lEC, 'Explore, observe et questionne son environnement; émet des hypothèses simples.'),
    (c1, lAC, 'Manifeste une grande curiosité; explore et questionne avec méthode; émet des hypothèses et anticipe des résultats de façon autonome.'),

    (c2, lDA, 'A de la difficulté à expliquer ses idées ou à résoudre des problèmes simples; peu de pensée créative observée.'),
    (c2, lEA, 'Tente d''expliquer ses idées et de résoudre des problèmes avec beaucoup de soutien; fait preuve de quelque créativité.'),
    (c2, lEC, 'Raisonne et explique ses idées avec peu de soutien; planifie et mène à terme des activités simples; fait preuve de créativité.'),
    (c2, lAC, 'Raisonne, explique et justifie ses idées; résout des problèmes de façon créative et autonome; réfléchit sur ses stratégies.'),

    (c3, lDA, 'A de la difficulté à dénombrer de petites collections; ne reconnaît pas encore les formes de base ni les chiffres.'),
    (c3, lEA, 'Dénombre de petites collections; reconnaît quelques formes géométriques et quelques chiffres avec aide.'),
    (c3, lEC, 'Dénombre des collections; compare des quantités; reconnaît des formes et chiffres; repère des régularités simples.'),
    (c3, lAC, 'Dénombre des collections avec précision; associe chiffres et quantités; reconnaît et nomme des formes; crée des régularités de façon autonome.'),

    (c4, lDA, 'Observe peu son environnement naturel; n''exprime pas de questionnement sur les phénomènes naturels.'),
    (c4, lEA, 'Observe son environnement avec guidance; formule des questions simples avec aide.'),
    (c4, lEC, 'Observe et explore les phénomènes naturels; formule des questions et émet des hypothèses simples.'),
    (c4, lAC, 'Observe, questionne et explore son environnement naturel de façon autonome; explore les propriétés des matériaux; utilise des outils simples.'),

    (c5, lDA, 'A une connaissance très limitée de son milieu de vie; peu de repères temporels ou spatiaux.'),
    (c5, lEA, 'Connaît son milieu immédiat (famille, classe) avec aide; quelques repères temporels de base.'),
    (c5, lEC, 'Comprend son milieu de vie (famille, école, quartier); développe des repères temporels et spatiaux.'),
    (c5, lAC, 'Connaît bien son milieu de vie; utilise des repères temporels (hier, aujourd''hui, demain; saisons) et spatiaux; est ouvert à la diversité culturelle.');


  -- ══════════════════════════════════════════════════════════
  -- GRILLE 6 — Portrait global de l'enfant préscolaire
  -- (grille interdisciplinaire — subject_id NULL)
  -- ══════════════════════════════════════════════════════════

  INSERT INTO eval_grids (title, subject_id, cycle_label, source, is_baseline, competency)
    VALUES (
      'Portrait global de l''enfant préscolaire — 5 domaines',
      NULL,
      'Éducation préscolaire',
      'Programme-cycle de l''éducation préscolaire – MEQ, 2021.',
      true,
      'Développement global'
    ) RETURNING id INTO gid;

  INSERT INTO eval_grid_grades VALUES (gid, g4a), (gid, g5a);

  INSERT INTO eval_grid_levels (grid_id, code, label, sort_order) VALUES (gid, 'DA', 'Début d''apprentissage', 1) RETURNING id INTO lDA;
  INSERT INTO eval_grid_levels (grid_id, code, label, sort_order) VALUES (gid, 'EA', 'En apprentissage',       2) RETURNING id INTO lEA;
  INSERT INTO eval_grid_levels (grid_id, code, label, sort_order) VALUES (gid, 'EC', 'En consolidation',       3) RETURNING id INTO lEC;
  INSERT INTO eval_grid_levels (grid_id, code, label, sort_order) VALUES (gid, 'A',  'Acquis',                 4) RETURNING id INTO lAC;

  INSERT INTO eval_grid_criteria (grid_id, label, weight, sort_order)
    VALUES (gid, 'Développement physique et moteur', 20, 1) RETURNING id INTO c1;
  INSERT INTO eval_grid_criteria (grid_id, label, weight, sort_order)
    VALUES (gid, 'Développement affectif', 20, 2) RETURNING id INTO c2;
  INSERT INTO eval_grid_criteria (grid_id, label, weight, sort_order)
    VALUES (gid, 'Développement social', 20, 3) RETURNING id INTO c3;
  INSERT INTO eval_grid_criteria (grid_id, label, weight, sort_order)
    VALUES (gid, 'Communication et langage', 20, 4) RETURNING id INTO c4;
  INSERT INTO eval_grid_criteria (grid_id, label, weight, sort_order)
    VALUES (gid, 'Découverte du monde', 20, 5) RETURNING id INTO c5;

  INSERT INTO eval_grid_cells (criterion_id, level_id, descriptor) VALUES
    (c1, lDA, 'Présente des difficultés marquées sur le plan de la motricité globale et/ou fine; a de la difficulté à adopter de saines habitudes de vie.'),
    (c1, lEA, 'Se développe sur le plan physique avec soutien; adopte certaines habitudes de vie saines.'),
    (c1, lEC, 'Se développe bien sur le plan physique et moteur; adopte généralement de saines habitudes de vie.'),
    (c1, lAC, 'Démontre un développement physique et moteur bien établi; fait preuve d''habiletés motrices; adopte de saines habitudes de vie de façon autonome.'),

    (c2, lDA, 'A de la difficulté à identifier et à réguler ses émotions; manque d''autonomie et de confiance en soi.'),
    (c2, lEA, 'Commence à identifier ses émotions et à faire preuve d''autonomie avec beaucoup de soutien.'),
    (c2, lEC, 'Exprime et régule généralement ses émotions; fait preuve d''autonomie dans des situations connues.'),
    (c2, lAC, 'Identifie et régule ses émotions de façon appropriée; fait preuve d''autonomie et de confiance en soi.'),

    (c3, lDA, 'A de la difficulté à s''intégrer au groupe; interactions sociales problématiques; gère mal les conflits.'),
    (c3, lEA, 'Commence à s''intégrer au groupe; respecte certaines règles; coopère dans des situations simples.'),
    (c3, lEC, 'S''intègre bien au groupe; respecte les règles; coopère généralement; résout certains conflits.'),
    (c3, lAC, 'Maintient des relations harmonieuses; respecte les règles; coopère efficacement; gère les conflits de façon autonome.'),

    (c4, lDA, 'S''exprime peu à l''oral; montre peu d''intérêt pour l''écrit; conscience phonologique peu développée.'),
    (c4, lEA, 'S''exprime à l''oral avec encouragements; quelques connaissances en émergence sur l''écrit.'),
    (c4, lEC, 'S''exprime correctement à l''oral; développe sa conscience phonologique et sa connaissance de l''écrit.'),
    (c4, lAC, 'Communique efficacement à l''oral; conscience phonologique bien établie; s''initie à l''écrit; prêt pour les apprentissages formels.'),

    (c5, lDA, 'Manifeste peu de curiosité pour son environnement; exploration et raisonnement peu développés; bases mathématiques très fragiles.'),
    (c5, lEA, 'Commence à explorer son environnement avec guidance; fait preuve de quelque curiosité; construit des bases mathématiques.'),
    (c5, lEC, 'Explore son environnement avec curiosité; raisonne et résout des problèmes simples; développe ses concepts mathématiques.'),
    (c5, lAC, 'Manifeste une grande curiosité; raisonne et explore de façon autonome; maîtrise les concepts mathématiques de base du niveau préscolaire.');

END $$;
