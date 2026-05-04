-- ============================================================
-- PLANIPROF — Grilles de conversation préscolaire (6 grilles)
-- 1 par domaine de développement + 1 portrait global
-- Basées sur le Programme-cycle de l'éducation préscolaire (MEQ 2021)
-- Échelle : DA – En apprentissage – En consolidation – Acquis
-- ============================================================

DO $$
DECLARE
  g4a int; g5a int;
  s_physique int; s_affectif int; s_social int; s_langage int; s_monde int;

  gid uuid;
  lDA int; lEA int; lEC int; lAC int;
  c1 uuid; c2 uuid; c3 uuid; c4 uuid; c5 uuid;

BEGIN

  -- Idempotency guard
  IF EXISTS (
    SELECT 1 FROM eval_grids eg
    JOIN subjects s ON s.id = eg.subject_id
    WHERE s.slug = 'dev-physique' AND eg.is_baseline = true AND eg.grid_type = 'conversation'
  ) THEN
    RAISE NOTICE 'Grilles de conversation préscolaire already seeded — skipping.';
    RETURN;
  END IF;

  SELECT id INTO g4a FROM grade_levels WHERE education_level = 'préscolaire' AND grade = -2;
  SELECT id INTO g5a FROM grade_levels WHERE education_level = 'préscolaire' AND grade = -1;
  SELECT id INTO s_physique FROM subjects WHERE slug = 'dev-physique';
  SELECT id INTO s_affectif FROM subjects WHERE slug = 'dev-affectif';
  SELECT id INTO s_social   FROM subjects WHERE slug = 'dev-social';
  SELECT id INTO s_langage  FROM subjects WHERE slug = 'comm-langage';
  SELECT id INTO s_monde    FROM subjects WHERE slug = 'decouverte-monde';


  -- ══════════════════════════════════════════════════════════
  -- GRILLE 1 — Développement physique et moteur
  -- ══════════════════════════════════════════════════════════

  INSERT INTO eval_grids (title, subject_id, cycle_label, source, is_baseline, grid_type, competency)
    VALUES (
      'Conversation — Développement physique et moteur',
      s_physique,
      'Éducation préscolaire',
      'Programme-cycle de l''éducation préscolaire – MEQ, 2021.',
      true,
      'conversation',
      'Agir avec efficacité dans différents contextes sur le plan sensoriel et moteur'
    ) RETURNING id INTO gid;

  INSERT INTO eval_grid_grades VALUES (gid, g4a), (gid, g5a);

  INSERT INTO eval_grid_levels (grid_id, code, label, sort_order) VALUES (gid, 'DA', 'Début d''apprentissage', 1) RETURNING id INTO lDA;
  INSERT INTO eval_grid_levels (grid_id, code, label, sort_order) VALUES (gid, 'EA', 'En apprentissage',       2) RETURNING id INTO lEA;
  INSERT INTO eval_grid_levels (grid_id, code, label, sort_order) VALUES (gid, 'EC', 'En consolidation',       3) RETURNING id INTO lEC;
  INSERT INTO eval_grid_levels (grid_id, code, label, sort_order) VALUES (gid, 'A',  'Acquis',                 4) RETURNING id INTO lAC;

  INSERT INTO eval_grid_criteria (grid_id, label, weight, sort_order)
    VALUES (gid, 'Expression verbale de ses capacités physiques et motrices', NULL, 1) RETURNING id INTO c1;
  INSERT INTO eval_grid_criteria (grid_id, label, weight, sort_order)
    VALUES (gid, 'Vocabulaire du corps, du mouvement et de l''espace', NULL, 2) RETURNING id INTO c2;
  INSERT INTO eval_grid_criteria (grid_id, label, weight, sort_order)
    VALUES (gid, 'Verbalisation de ses habitudes de vie et préférences d''activités', NULL, 3) RETURNING id INTO c3;
  INSERT INTO eval_grid_criteria (grid_id, label, weight, sort_order)
    VALUES (gid, 'Engagement et participation verbale lors de l''échange', NULL, 4) RETURNING id INTO c4;

  INSERT INTO eval_grid_cells (criterion_id, level_id, descriptor) VALUES
    (c1, lDA, 'Ne décrit pas ses capacités physiques; répond peu ou pas aux questions sur son corps et ses mouvements.'),
    (c1, lEA, 'Décrit ses capacités en termes très simples; a besoin de questions directes pour s''exprimer.'),
    (c1, lEC, 'Décrit plusieurs de ses capacités (ce qu''il/elle sait faire, ce qui est difficile) avec quelques relances.'),
    (c1, lAC, 'Décrit aisément ses capacités physiques et motrices; compare ses habiletés; commente ses progrès.'),

    (c2, lDA, 'Utilise peu ou pas de vocabulaire lié au corps, aux mouvements ou à l''espace.'),
    (c2, lEA, 'Nomme quelques parties du corps et mouvements de base (courir, sauter); vocabulaire limité.'),
    (c2, lEC, 'Utilise un vocabulaire varié lié au corps et au mouvement; nomme des relations spatiales simples.'),
    (c2, lAC, 'Utilise avec précision le vocabulaire du corps, du mouvement et de l''espace; décrit positions et déplacements.'),

    (c3, lDA, 'N''exprime pas de préférences d''activités ni ses habitudes de vie; réponses très limitées.'),
    (c3, lEA, 'Nomme une ou deux activités qu''il/elle aime; mentionne une habitude de vie avec aide.'),
    (c3, lEC, 'Nomme plusieurs activités physiques préférées; évoque ses habitudes de vie avec peu de relances.'),
    (c3, lAC, 'Explique ses préférences d''activités et leurs raisons; décrit ses habitudes de vie saines de façon autonome.'),

    (c4, lDA, 'Participe peu; répond par monosyllabes ou ne répond pas; posture fermée ou inattentive.'),
    (c4, lEA, 'Participe avec encouragements; réponses courtes; maintient un contact visuel intermittent.'),
    (c4, lEC, 'Participe activement; répond aux questions; maintient une posture attentive; s''engage dans l''échange.'),
    (c4, lAC, 'Participe avec enthousiasme; pose des questions; prend des initiatives dans la conversation; posture engagée tout au long.');


  -- ══════════════════════════════════════════════════════════
  -- GRILLE 2 — Développement affectif
  -- ══════════════════════════════════════════════════════════

  INSERT INTO eval_grids (title, subject_id, cycle_label, source, is_baseline, grid_type, competency)
    VALUES (
      'Conversation — Développement affectif',
      s_affectif,
      'Éducation préscolaire',
      'Programme-cycle de l''éducation préscolaire – MEQ, 2021.',
      true,
      'conversation',
      'Affirmer sa personnalité'
    ) RETURNING id INTO gid;

  INSERT INTO eval_grid_grades VALUES (gid, g4a), (gid, g5a);

  INSERT INTO eval_grid_levels (grid_id, code, label, sort_order) VALUES (gid, 'DA', 'Début d''apprentissage', 1) RETURNING id INTO lDA;
  INSERT INTO eval_grid_levels (grid_id, code, label, sort_order) VALUES (gid, 'EA', 'En apprentissage',       2) RETURNING id INTO lEA;
  INSERT INTO eval_grid_levels (grid_id, code, label, sort_order) VALUES (gid, 'EC', 'En consolidation',       3) RETURNING id INTO lEC;
  INSERT INTO eval_grid_levels (grid_id, code, label, sort_order) VALUES (gid, 'A',  'Acquis',                 4) RETURNING id INTO lAC;

  INSERT INTO eval_grid_criteria (grid_id, label, weight, sort_order)
    VALUES (gid, 'Expression verbale de ses émotions', NULL, 1) RETURNING id INTO c1;
  INSERT INTO eval_grid_criteria (grid_id, label, weight, sort_order)
    VALUES (gid, 'Connaissance de soi (goûts, besoins, caractéristiques)', NULL, 2) RETURNING id INTO c2;
  INSERT INTO eval_grid_criteria (grid_id, label, weight, sort_order)
    VALUES (gid, 'Autonomie et prise de décision lors de l''échange', NULL, 3) RETURNING id INTO c3;
  INSERT INTO eval_grid_criteria (grid_id, label, weight, sort_order)
    VALUES (gid, 'Réaction face à un défi ou une difficulté évoquée', NULL, 4) RETURNING id INTO c4;

  INSERT INTO eval_grid_cells (criterion_id, level_id, descriptor) VALUES
    (c1, lDA, 'N''identifie pas ses émotions ou les exprime de façon inadéquate; réactions intenses ou repli lors de l''échange.'),
    (c1, lEA, 'Nomme une ou deux émotions de base (content, triste, fâché) avec aide; peut avoir du mal à relier l''émotion à la situation.'),
    (c1, lEC, 'Nomme et relie plusieurs émotions à des situations vécues; les exprime de façon généralement appropriée.'),
    (c1, lAC, 'Nomme et explique ses émotions avec nuance; relie cause et effet; démontre un début de régulation lors de l''échange.'),

    (c2, lDA, 'A de la difficulté à parler de ses goûts, besoins ou caractéristiques; réponses très limitées.'),
    (c2, lEA, 'Nomme un ou deux goûts ou besoins avec l''aide de l''adulte; peu d''initiative pour se décrire.'),
    (c2, lEC, 'Parle de ses goûts, besoins et caractéristiques avec quelques relances; connaît ses préférences.'),
    (c2, lAC, 'Se décrit avec assurance (goûts, forces, besoins); accepte ses limites; fait des liens entre ses caractéristiques et ses apprentissages.'),

    (c3, lDA, 'Cherche constamment l''approbation de l''adulte; ne prend pas de décisions, même simples.'),
    (c3, lEA, 'Tente de faire des choix avec beaucoup d''encouragements; dépend largement du soutien de l''adulte.'),
    (c3, lEC, 'Fait des choix et de petites décisions avec peu de soutien; s''exprime de façon relativement autonome.'),
    (c3, lAC, 'Exprime clairement ses choix de façon indépendante; prend des initiatives dans la conversation; justifie ses décisions.'),

    (c4, lDA, 'Se décourage ou se ferme face à un défi évoqué; ne verbalise pas de stratégie pour surmonter la difficulté.'),
    (c4, lEA, 'Reconnaît la difficulté; tente de nommer une stratégie avec beaucoup d''aide.'),
    (c4, lEC, 'Verbalise sa réaction face au défi; nomme une ou deux stratégies avec peu de soutien; montre une certaine persévérance.'),
    (c4, lAC, 'Décrit avec calme sa réaction face aux défis; propose des stratégies de façon autonome; démontre de la confiance en ses capacités.');


  -- ══════════════════════════════════════════════════════════
  -- GRILLE 3 — Développement social
  -- ══════════════════════════════════════════════════════════

  INSERT INTO eval_grids (title, subject_id, cycle_label, source, is_baseline, grid_type, competency)
    VALUES (
      'Conversation — Développement social',
      s_social,
      'Éducation préscolaire',
      'Programme-cycle de l''éducation préscolaire – MEQ, 2021.',
      true,
      'conversation',
      'Interagir de façon harmonieuse avec les autres'
    ) RETURNING id INTO gid;

  INSERT INTO eval_grid_grades VALUES (gid, g4a), (gid, g5a);

  INSERT INTO eval_grid_levels (grid_id, code, label, sort_order) VALUES (gid, 'DA', 'Début d''apprentissage', 1) RETURNING id INTO lDA;
  INSERT INTO eval_grid_levels (grid_id, code, label, sort_order) VALUES (gid, 'EA', 'En apprentissage',       2) RETURNING id INTO lEA;
  INSERT INTO eval_grid_levels (grid_id, code, label, sort_order) VALUES (gid, 'EC', 'En consolidation',       3) RETURNING id INTO lEC;
  INSERT INTO eval_grid_levels (grid_id, code, label, sort_order) VALUES (gid, 'A',  'Acquis',                 4) RETURNING id INTO lAC;

  INSERT INTO eval_grid_criteria (grid_id, label, weight, sort_order)
    VALUES (gid, 'Tour de parole et écoute active lors de l''échange', NULL, 1) RETURNING id INTO c1;
  INSERT INTO eval_grid_criteria (grid_id, label, weight, sort_order)
    VALUES (gid, 'Verbalisation des règles de vie et du vivre-ensemble', NULL, 2) RETURNING id INTO c2;
  INSERT INTO eval_grid_criteria (grid_id, label, weight, sort_order)
    VALUES (gid, 'Compréhension et verbalisation de situations relationnelles', NULL, 3) RETURNING id INTO c3;
  INSERT INTO eval_grid_criteria (grid_id, label, weight, sort_order)
    VALUES (gid, 'Ouverture à la diversité et à l''autre', NULL, 4) RETURNING id INTO c4;

  INSERT INTO eval_grid_cells (criterion_id, level_id, descriptor) VALUES
    (c1, lDA, 'A de la difficulté à attendre son tour; interrompt souvent; écoute peu ce que l''adulte dit.'),
    (c1, lEA, 'Attend son tour avec rappels; écoute partiellement; peut se distraire lors de l''échange.'),
    (c1, lEC, 'Attend généralement son tour; écoute les propos de l''adulte; réagit de façon appropriée à ce qui est dit.'),
    (c1, lAC, 'Respecte le tour de parole spontanément; écoute attentivement; reprend et commente ce qui vient d''être dit.'),

    (c2, lDA, 'Ne peut pas nommer les règles de vie ni leur raison d''être; peu de compréhension du vivre-ensemble.'),
    (c2, lEA, 'Nomme une ou deux règles de vie avec aide; commence à en comprendre l''importance.'),
    (c2, lEC, 'Nomme plusieurs règles de vie et explique pourquoi elles sont importantes avec quelques relances.'),
    (c2, lAC, 'Explique les règles, leur utilité et les conséquences de leur non-respect de façon autonome; relie les règles au bien commun.'),

    (c3, lDA, 'A du mal à décrire une situation de conflit ou de coopération; peu de conscience des relations avec les autres.'),
    (c3, lEA, 'Décrit sommairement une situation sociale avec beaucoup d''aide; peu de recul.'),
    (c3, lEC, 'Décrit une situation de conflit ou de coopération; identifie les émotions en jeu; propose une solution simple.'),
    (c3, lAC, 'Décrit et analyse des situations relationnelles; identifie causes et conséquences; propose des solutions pacifiques et réfléchies.'),

    (c4, lDA, 'Montre peu d''intérêt pour les différences; peut avoir des réactions négatives face à ce qui est différent.'),
    (c4, lEA, 'Accepte la présence des différences avec guidance; exprime peu de curiosité pour l''autre.'),
    (c4, lEC, 'Exprime de la curiosité pour ce qui est différent; parle positivement des autres lors des échanges.'),
    (c4, lAC, 'Démontre une ouverture sincère à la diversité; fait des liens entre ce qu''il/elle connaît et ce que les autres lui apportent; valorise les différences.');


  -- ══════════════════════════════════════════════════════════
  -- GRILLE 4 — Communication et langage
  -- ══════════════════════════════════════════════════════════

  INSERT INTO eval_grids (title, subject_id, cycle_label, source, is_baseline, grid_type, competency)
    VALUES (
      'Conversation — Communication et langage',
      s_langage,
      'Éducation préscolaire',
      'Programme-cycle de l''éducation préscolaire – MEQ, 2021.',
      true,
      'conversation',
      'Communiquer en utilisant les ressources de la langue'
    ) RETURNING id INTO gid;

  INSERT INTO eval_grid_grades VALUES (gid, g4a), (gid, g5a);

  INSERT INTO eval_grid_levels (grid_id, code, label, sort_order) VALUES (gid, 'DA', 'Début d''apprentissage', 1) RETURNING id INTO lDA;
  INSERT INTO eval_grid_levels (grid_id, code, label, sort_order) VALUES (gid, 'EA', 'En apprentissage',       2) RETURNING id INTO lEA;
  INSERT INTO eval_grid_levels (grid_id, code, label, sort_order) VALUES (gid, 'EC', 'En consolidation',       3) RETURNING id INTO lEC;
  INSERT INTO eval_grid_levels (grid_id, code, label, sort_order) VALUES (gid, 'A',  'Acquis',                 4) RETURNING id INTO lAC;

  INSERT INTO eval_grid_criteria (grid_id, label, weight, sort_order)
    VALUES (gid, 'Clarté et fluidité de l''expression orale', NULL, 1) RETURNING id INTO c1;
  INSERT INTO eval_grid_criteria (grid_id, label, weight, sort_order)
    VALUES (gid, 'Richesse du vocabulaire', NULL, 2) RETURNING id INTO c2;
  INSERT INTO eval_grid_criteria (grid_id, label, weight, sort_order)
    VALUES (gid, 'Structure des phrases et cohérence du discours', NULL, 3) RETURNING id INTO c3;
  INSERT INTO eval_grid_criteria (grid_id, label, weight, sort_order)
    VALUES (gid, 'Compréhension des questions et consignes verbales', NULL, 4) RETURNING id INTO c4;
  INSERT INTO eval_grid_criteria (grid_id, label, weight, sort_order)
    VALUES (gid, 'Conscience phonologique lors de jeux de langage', NULL, 5) RETURNING id INTO c5;

  INSERT INTO eval_grid_cells (criterion_id, level_id, descriptor) VALUES
    (c1, lDA, 'Discours très difficile à comprendre; nombreuses hésitations, silences prolongés ou refus de parler.'),
    (c1, lEA, 'Discours compréhensible avec effort; hésitations fréquentes; nécessite beaucoup de relances.'),
    (c1, lEC, 'Discours généralement clair et fluide; quelques hésitations; s''exprime sans trop de difficultés.'),
    (c1, lAC, 'Discours clair, fluide et bien articulé; s''exprime avec aisance et confiance; peu d''hésitations.'),

    (c2, lDA, 'Vocabulaire très limité; utilise les mêmes mots génériques ou ne trouve pas ses mots.'),
    (c2, lEA, 'Vocabulaire limité mais fonctionnel; mots simples et génériques; manque de précision.'),
    (c2, lEC, 'Vocabulaire varié et généralement précis; cherche parfois ses mots; peu d''erreurs de sens.'),
    (c2, lAC, 'Vocabulaire riche, précis et varié; utilise des mots spécifiques pour exprimer ses idées; lexique étendu.'),

    (c3, lDA, 'S''exprime en mots isolés ou phrases incomplètes; discours peu cohérent.'),
    (c3, lEA, 'Produit des phrases simples (sujet-verbe); quelques liens logiques; discours parfois difficile à suivre.'),
    (c3, lEC, 'Produit des phrases complètes et correctes; utilise des connecteurs (parce que, alors, et puis); discours généralement cohérent.'),
    (c3, lAC, 'Produit des phrases complexes et variées; discours bien structuré et logique; utilise les connecteurs avec aisance.'),

    (c4, lDA, 'Ne comprend pas les questions directes ou les consignes; nécessite une reformulation constante.'),
    (c4, lEA, 'Comprend les questions simples avec reformulations; peut mal interpréter des consignes à plusieurs éléments.'),
    (c4, lEC, 'Comprend la plupart des questions et consignes; demande une clarification à l''occasion; répond de façon pertinente.'),
    (c4, lAC, 'Comprend rapidement les questions complexes et consignes multi-étapes; répond de façon pertinente et complète.'),

    (c5, lDA, 'Ne reconnaît pas les rimes ou les syllabes même avec modélisation lors du jeu de langage.'),
    (c5, lEA, 'Reconnaît les rimes et peut scander quelques syllabes avec aide et modélisation.'),
    (c5, lEC, 'Identifie les rimes et scande les syllabes avec peu de soutien; commence à manipuler les sons initiaux.'),
    (c5, lAC, 'Manipule les sons aisément (rimes, syllabes, sons initiaux); anticipe les rimes; joue avec les sons de façon autonome.');


  -- ══════════════════════════════════════════════════════════
  -- GRILLE 5 — Découverte du monde
  -- ══════════════════════════════════════════════════════════

  INSERT INTO eval_grids (title, subject_id, cycle_label, source, is_baseline, grid_type, competency)
    VALUES (
      'Conversation — Découverte du monde',
      s_monde,
      'Éducation préscolaire',
      'Programme-cycle de l''éducation préscolaire – MEQ, 2021.',
      true,
      'conversation',
      'Construire sa compréhension du monde'
    ) RETURNING id INTO gid;

  INSERT INTO eval_grid_grades VALUES (gid, g4a), (gid, g5a);

  INSERT INTO eval_grid_levels (grid_id, code, label, sort_order) VALUES (gid, 'DA', 'Début d''apprentissage', 1) RETURNING id INTO lDA;
  INSERT INTO eval_grid_levels (grid_id, code, label, sort_order) VALUES (gid, 'EA', 'En apprentissage',       2) RETURNING id INTO lEA;
  INSERT INTO eval_grid_levels (grid_id, code, label, sort_order) VALUES (gid, 'EC', 'En consolidation',       3) RETURNING id INTO lEC;
  INSERT INTO eval_grid_levels (grid_id, code, label, sort_order) VALUES (gid, 'A',  'Acquis',                 4) RETURNING id INTO lAC;

  INSERT INTO eval_grid_criteria (grid_id, label, weight, sort_order)
    VALUES (gid, 'Curiosité, questionnement et formulation d''hypothèses', NULL, 1) RETURNING id INTO c1;
  INSERT INTO eval_grid_criteria (grid_id, label, weight, sort_order)
    VALUES (gid, 'Raisonnement et verbalisation de sa démarche', NULL, 2) RETURNING id INTO c2;
  INSERT INTO eval_grid_criteria (grid_id, label, weight, sort_order)
    VALUES (gid, 'Expression de connaissances mathématiques', NULL, 3) RETURNING id INTO c3;
  INSERT INTO eval_grid_criteria (grid_id, label, weight, sort_order)
    VALUES (gid, 'Expression de connaissances sur son milieu naturel et social', NULL, 4) RETURNING id INTO c4;

  INSERT INTO eval_grid_cells (criterion_id, level_id, descriptor) VALUES
    (c1, lDA, 'Ne pose pas de questions; montre peu de curiosité; n''émet pas d''hypothèses lors de la conversation.'),
    (c1, lEA, 'Pose quelques questions simples avec encouragements; émet une hypothèse approximative avec beaucoup d''aide.'),
    (c1, lEC, 'Pose des questions pertinentes; manifeste de la curiosité; formule des hypothèses simples avec peu de relances.'),
    (c1, lAC, 'Pose des questions variées et pertinentes de façon spontanée; émet des hypothèses expliquées; anticipe des résultats.'),

    (c2, lDA, 'Ne peut pas expliquer sa façon de penser; réponses très courtes sans justification.'),
    (c2, lEA, 'Explique sommairement sa pensée avec beaucoup d''aide; utilise peu de connecteurs causaux.'),
    (c2, lEC, 'Explique son raisonnement avec quelques relances; utilise « parce que », « alors », etc.'),
    (c2, lAC, 'Explique clairement son raisonnement; décrit les étapes de sa démarche; justifie ses choix de façon autonome.'),

    (c3, lDA, 'Peu de connaissances mathématiques observables; ne reconnaît pas encore les chiffres ou les formes de base.'),
    (c3, lEA, 'Nomme quelques chiffres ou formes avec aide; peut compter une petite collection avec soutien.'),
    (c3, lEC, 'Compte et dénombre avec précision; reconnaît et nomme des formes; explique des régularités simples.'),
    (c3, lAC, 'Démontre des connaissances solides (dénombrement, quantités, formes, régularités); explique ses raisonnements de façon autonome.'),

    (c4, lDA, 'Connaissances très limitées sur son milieu; ne peut pas nommer des éléments de son environnement naturel ou social.'),
    (c4, lEA, 'Nomme quelques éléments de son milieu immédiat (famille, école) avec aide; peu de connaissances sur la nature.'),
    (c4, lEC, 'Parle de son milieu de vie (famille, quartier, saisons) avec quelques relances; reconnaît des éléments naturels.'),
    (c4, lAC, 'Explique son milieu de vie avec précision; utilise des repères temporels et spatiaux; établit des liens entre les phénomènes naturels et son quotidien.');


  -- ══════════════════════════════════════════════════════════
  -- GRILLE 6 — Portrait global — 5 domaines
  -- (subject_id NULL = interdisciplinaire)
  -- ══════════════════════════════════════════════════════════

  INSERT INTO eval_grids (title, subject_id, cycle_label, source, is_baseline, grid_type, competency)
    VALUES (
      'Conversation — Portrait global préscolaire — 5 domaines',
      NULL,
      'Éducation préscolaire',
      'Programme-cycle de l''éducation préscolaire – MEQ, 2021.',
      true,
      'conversation',
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
    (c1, lDA, 'Décrit peu ses capacités physiques; vocabulaire du corps et du mouvement très limité; peu d''engagement lors de l''échange sur ce domaine.'),
    (c1, lEA, 'Décrit quelques capacités physiques avec aide; utilise un vocabulaire de base lié au corps et aux activités.'),
    (c1, lEC, 'Décrit ses capacités et habitudes de vie avec assurance; utilise un vocabulaire approprié lors des échanges.'),
    (c1, lAC, 'Décrit aisément ses habiletés physiques; explique ses habitudes de vie; utilise un vocabulaire précis du corps et du mouvement.'),

    (c2, lDA, 'Difficulté à nommer et à exprimer ses émotions; peu de connaissance de soi exprimée lors de l''échange.'),
    (c2, lEA, 'Nomme quelques émotions de base; décrit sommairement quelques caractéristiques personnelles avec aide.'),
    (c2, lEC, 'Exprime ses émotions et sa connaissance de soi avec quelques relances; fait preuve d''une certaine autonomie.'),
    (c2, lAC, 'Exprime ses émotions avec nuance; se décrit avec assurance; fait preuve d''autonomie et de confiance lors des échanges.'),

    (c3, lDA, 'A de la difficulté à respecter le tour de parole; peu de verbalisation des règles sociales ou des situations relationnelles.'),
    (c3, lEA, 'Respecte le tour de parole avec rappels; nomme une ou deux règles sociales avec aide.'),
    (c3, lEC, 'Respecte généralement le tour de parole; explique des règles sociales et des situations relationnelles avec peu de soutien.'),
    (c3, lAC, 'Respecte spontanément le tour de parole; explique les règles de vie et les situations sociales avec aisance et nuance.'),

    (c4, lDA, 'Discours difficile à comprendre; vocabulaire très limité; compréhension des questions difficile.'),
    (c4, lEA, 'S''exprime en phrases simples; vocabulaire limité; comprend les questions directes avec reformulations.'),
    (c4, lEC, 'S''exprime clairement; utilise un vocabulaire varié; comprend les questions et consignes avec peu d''aide.'),
    (c4, lAC, 'S''exprime avec fluidité et précision; vocabulaire riche; comprend et répond à des questions complexes de façon autonome.'),

    (c5, lDA, 'Peu de curiosité exprimée; ne formule pas d''hypothèses; connaissances mathématiques et du milieu très limitées.'),
    (c5, lEA, 'Pose quelques questions avec aide; explique sommairement sa pensée; quelques connaissances de base.'),
    (c5, lEC, 'Pose des questions pertinentes; verbalise son raisonnement; démontre des connaissances du milieu et des notions mathématiques.'),
    (c5, lAC, 'Manifeste une grande curiosité; raisonne et explique avec autonomie; démontre des connaissances solides du monde et des mathématiques.');

END $$;
