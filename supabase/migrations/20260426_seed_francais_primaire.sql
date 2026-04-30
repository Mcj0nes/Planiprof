-- ============================================================
-- PLANIPROF — Seed: Français, langue d'enseignement, primaire
-- Programme provisoire 2025-2026 (MEES)
-- Basé sur les tableaux de compétences (savoir-faire) du programme
-- Légende originale : → Appropriation  ★ Consolidation  ☆ Réutilisation
-- grade_level_id correspond au grade où → apparaît en premier
-- ============================================================

DO $$
DECLARE
  fr_id  int;
  g1 int; g2 int; g3 int; g4 int; g5 int; g6 int;

  c_lire   int;  -- Lire des textes variés
  c_ecrire int;  -- Écrire des textes variés
  c_oral   int;  -- Communiquer oralement selon des modalités variées

BEGIN

  SELECT id INTO fr_id FROM subjects WHERE slug = 'francais';

  SELECT id INTO g1 FROM grade_levels WHERE education_level = 'primaire' AND grade = 1;
  SELECT id INTO g2 FROM grade_levels WHERE education_level = 'primaire' AND grade = 2;
  SELECT id INTO g3 FROM grade_levels WHERE education_level = 'primaire' AND grade = 3;
  SELECT id INTO g4 FROM grade_levels WHERE education_level = 'primaire' AND grade = 4;
  SELECT id INTO g5 FROM grade_levels WHERE education_level = 'primaire' AND grade = 5;
  SELECT id INTO g6 FROM grade_levels WHERE education_level = 'primaire' AND grade = 6;

  -- ── Compétences ──────────────────────────────────────────────
  INSERT INTO competencies (subject_id, name_fr, color, sort_order)
    VALUES (fr_id, 'Lire des textes variés', '#4F46E5', 10) RETURNING id INTO c_lire;
  INSERT INTO competencies (subject_id, name_fr, color, sort_order)
    VALUES (fr_id, 'Écrire des textes variés', '#7C3AED', 20) RETURNING id INTO c_ecrire;
  INSERT INTO competencies (subject_id, name_fr, color, sort_order)
    VALUES (fr_id, 'Communiquer oralement selon des modalités variées', '#0369A1', 30) RETURNING id INTO c_oral;

  -- ════════════════════════════════════════════════════════════
  -- LIRE DES TEXTES VARIÉS
  -- ════════════════════════════════════════════════════════════

  -- ── 1re année ── (→ Appropriation en 1re)
  INSERT INTO content_items (competency_id, grade_level_id, name_fr, sort_order, progression_type) VALUES
    -- DÉCODER
    (c_lire, g1, 'Décoder – Segmenter le mot écrit en unités écrites (dont les graphèmes)', 1, 'finalite'),
    (c_lire, g1, 'Décoder – Associer les unités écrites (dont les graphèmes) aux unités orales correspondantes (dont les phonèmes)', 2, 'finalite'),
    (c_lire, g1, 'Décoder – Fusionner les unités orales (dont les phonèmes) pour former des syllabes (simples et complexes) et des mots', 3, 'finalite'),
    -- COMPRENDRE
    (c_lire, g1, 'Comprendre – Identifier le genre d''un discours ou d''un texte en s''appuyant sur ses caractéristiques', 4, 'progression'),
    (c_lire, g1, 'Comprendre – Donner du sens aux mots et aux expressions (indices contextuels, syntaxiques, morphologiques)', 5, 'progression'),
    (c_lire, g1, 'Comprendre – Donner du sens aux informations explicites', 6, 'progression'),
    (c_lire, g1, 'Comprendre – Construire le sens global du texte', 7, 'progression'),
    (c_lire, g1, 'Comprendre – Identifier les bris de compréhension et y remédier', 8, 'progression'),
    -- INTERPRÉTER
    (c_lire, g1, 'Interpréter – Attribuer une ou des significations personnelles au texte', 9, 'progression'),
    (c_lire, g1, 'Interpréter – Explorer différentes significations et s''ouvrir aux interprétations d''autres personnes', 10, 'progression'),
    -- RÉAGIR
    (c_lire, g1, 'Réagir – Identifier les émotions et les effets que le texte provoque sur soi', 11, 'progression'),
    -- JUGEMENT CRITIQUE
    (c_lire, g1, 'Formuler un jugement critique – Recourir à un ou des critères permettant de porter un regard distancié sur le texte', 12, 'progression');

  -- ── 2e année ── (→ Appropriation en 2e)
  INSERT INTO content_items (competency_id, grade_level_id, name_fr, sort_order, progression_type) VALUES
    (c_lire, g2, 'Comprendre – Inférer les informations implicites (anaphorique, causale, logique)', 1, 'finalite'),
    (c_lire, g2, 'Comprendre – Effectuer le rappel du texte à l''aide d''informations essentielles ou de mots-clés', 2, 'finalite'),
    (c_lire, g2, 'Comprendre – Établir des liens à l''aide des temps verbaux employés', 3, 'finalite'),
    (c_lire, g2, 'Réagir – Justifier ses réactions en s''appuyant sur son bagage langagier et culturel', 4, 'finalite'),
    (c_lire, g2, 'Réagir – S''identifier aux éléments du texte ou s''en dissocier', 5, 'progression'),
    (c_lire, g2, 'Formuler un jugement critique – Considérer la structure et l''organisation des informations du texte', 6, 'progression'),
    (c_lire, g2, 'Interpréter – Formuler des significations plausibles et vérifier la cohérence avec le texte', 7, 'progression');

  -- ── 3e année ── (→ Appropriation en 3e)
  INSERT INTO content_items (competency_id, grade_level_id, name_fr, sort_order, progression_type) VALUES
    (c_lire, g3, 'Comprendre – Résumer le texte en distinguant les informations essentielles des idées secondaires', 1, 'finalite'),
    (c_lire, g3, 'Comprendre – Regrouper les informations dispersées dans le texte', 2, 'finalite'),
    (c_lire, g3, 'Interpréter – Justifier son ou ses interprétations personnelles en s''appuyant sur le texte et son bagage culturel', 3, 'finalite'),
    (c_lire, g3, 'Réagir – Constater la diversité des effets produits par un même texte selon les lecteurs', 4, 'finalite'),
    (c_lire, g3, 'Formuler un jugement critique – Comparer le discours ou le texte à d''autres discours ou textes (ressemblances et différences)', 5, 'finalite'),
    (c_lire, g3, 'Formuler un jugement critique – Considérer la façon de traiter le sujet, les aspects et les sous-aspects', 6, 'progression'),
    (c_lire, g3, 'Formuler un jugement critique – Considérer les valeurs véhiculées dans le texte', 7, 'progression');

  -- ── 4e année ── (→ Appropriation en 4e)
  INSERT INTO content_items (competency_id, grade_level_id, name_fr, sort_order, progression_type) VALUES
    (c_lire, g4, 'Comprendre – Sélectionner les informations dans plusieurs discours ou textes', 1, 'finalite'),
    (c_lire, g4, 'Interpréter – Confirmer, nuancer ou changer ses interprétations à la suite d''échanges', 2, 'finalite'),
    (c_lire, g4, 'Formuler un jugement critique – Comparer son jugement critique à celui d''autrui', 3, 'finalite'),
    (c_lire, g4, 'Formuler un jugement critique – Constater qu''il peut exister des variantes d''un même texte (transposition, adaptation)', 4, 'finalite'),
    (c_lire, g4, 'Formuler un jugement critique – Considérer la chronologie des événements et la façon de mener l''intrigue', 5, 'progression'),
    (c_lire, g4, 'Formuler un jugement critique – Considérer la façon de présenter les protagonistes (stéréotypie, caractérisation)', 6, 'progression'),
    (c_lire, g4, 'Formuler un jugement critique – Évaluer la crédibilité et la fiabilité des informations et des sources', 7, 'progression');

  -- ── 5e année ── (→ Appropriation en 5e)
  INSERT INTO content_items (competency_id, grade_level_id, name_fr, sort_order, progression_type) VALUES
    (c_lire, g5, 'Comprendre – Résumer le texte en regroupant plusieurs idées similaires en une idée plus générale', 1, 'finalite'),
    (c_lire, g5, 'Formuler un jugement critique – Justifier son jugement critique en s''appuyant sur des critères ciblés', 2, 'finalite'),
    (c_lire, g5, 'Formuler un jugement critique – Dégager ce qui fait la singularité d''un discours ou d''un texte', 3, 'finalite'),
    (c_lire, g5, 'Formuler un jugement critique – Considérer les choix linguistiques et le style de l''autrice ou de l''auteur', 4, 'finalite'),
    (c_lire, g5, 'Interpréter – Juger de la plausibilité et de la recevabilité des hypothèses d''interprétation présentées', 5, 'progression'),
    (c_lire, g5, 'Formuler un jugement critique – S''appuyer sur son bagage langagier et culturel pour justifier un jugement', 6, 'progression'),
    (c_lire, g5, 'Formuler un jugement critique – Considérer le cadre spatiotemporel dans le texte', 7, 'progression');

  -- ── 6e année ── (→ Appropriation en 6e)
  INSERT INTO content_items (competency_id, grade_level_id, name_fr, sort_order, progression_type) VALUES
    (c_lire, g6, 'Formuler un jugement critique – Justifier son jugement en s''appuyant sur des extraits du texte', 1, 'finalite'),
    (c_lire, g6, 'Formuler un jugement critique – Considérer la présence d''intertextualité (références à d''autres textes ou repères culturels)', 2, 'finalite'),
    (c_lire, g6, 'Formuler un jugement critique – Recommander ou déconseiller un texte selon des critères établis', 3, 'finalite'),
    (c_lire, g6, 'Formuler un jugement critique – S''appuyer sur d''autres discours ou textes connus pour justifier un jugement', 4, 'finalite'),
    (c_lire, g6, 'Comprendre – Veiller à construire ou à reconstruire la cohérence lors du résumé', 5, 'progression'),
    (c_lire, g6, 'Formuler un jugement critique – Considérer les éléments modaux (paratexte, illustration, schéma)', 6, 'progression'),
    (c_lire, g6, 'Interpréter – Vérifier l''absence de contradiction avec ses hypothèses dans le texte', 7, 'progression');

  -- ════════════════════════════════════════════════════════════
  -- ÉCRIRE DES TEXTES VARIÉS
  -- ════════════════════════════════════════════════════════════

  -- ── 1re année ──
  INSERT INTO content_items (competency_id, grade_level_id, name_fr, sort_order, progression_type) VALUES
    -- IDÉER
    (c_ecrire, g1, 'Idéer – S''adapter ou recourir à un genre et à une forme en fonction de l''intention de communication', 1, 'progression'),
    (c_ecrire, g1, 'Idéer – Générer des idées et les développer en s''inspirant de son bagage langagier et culturel', 2, 'progression'),
    (c_ecrire, g1, 'Idéer – Organiser son texte en s''appuyant sur des traits caractéristiques du genre', 3, 'progression'),
    -- ÉNONCER
    (c_ecrire, g1, 'Énoncer – Formuler ses idées en phrases qui respectent la syntaxe propre à l''écrit', 4, 'progression'),
    (c_ecrire, g1, 'Énoncer – Ordonner les groupes de mots qui composent les phrases', 5, 'progression'),
    -- ENCODER
    (c_ecrire, g1, 'Encoder – Recourir à ses connaissances en orthographe lexicale (rechercher en mémoire l''orthographe des mots connus)', 6, 'finalite'),
    (c_ecrire, g1, 'Encoder – Délimiter correctement les phrases (majuscule initiale et point final)', 7, 'finalite'),
    -- MATÉRIALISER
    (c_ecrire, g1, 'Matérialiser – Tracer les mots du texte à la main (écriture manuscrite)', 8, 'finalite'),
    (c_ecrire, g1, 'Matérialiser – Respecter les caractéristiques du genre et de la forme choisis lors de la mise en page', 9, 'progression');

  -- ── 2e année ──
  INSERT INTO content_items (competency_id, grade_level_id, name_fr, sort_order, progression_type) VALUES
    (c_ecrire, g2, 'Idéer – Dégager les caractéristiques du genre à produire à partir de discours ou de textes modèles', 1, 'finalite'),
    (c_ecrire, g2, 'Idéer – Préciser ses idées à l''aide de procédés (explication, exemple, comparaison) et d''éléments modaux', 2, 'finalite'),
    (c_ecrire, g2, 'Énoncer – Faire progresser l''information (organisateurs textuels, marqueurs de relation)', 3, 'finalite'),
    (c_ecrire, g2, 'Énoncer – Choisir les formes verbales selon le temps dominant (passé, présent, futur)', 4, 'finalite'),
    (c_ecrire, g2, 'Encoder – Recourir à ses connaissances en orthographe grammaticale (accords dans le groupe du nom)', 5, 'finalite'),
    (c_ecrire, g2, 'Encoder – Utiliser le point d''interrogation (?) et le point d''exclamation (!)', 6, 'finalite'),
    (c_ecrire, g2, 'Matérialiser – Saisir les mots du texte dans un environnement numérique', 7, 'progression'),
    (c_ecrire, g2, 'Énoncer – Varier la longueur, la forme ou le type des phrases pour assurer la fluidité', 8, 'progression');

  -- ── 3e année ──
  INSERT INTO content_items (competency_id, grade_level_id, name_fr, sort_order, progression_type) VALUES
    (c_ecrire, g3, 'Idéer – Analyser les différents éléments de la situation de communication avant d''écrire', 1, 'finalite'),
    (c_ecrire, g3, 'Énoncer – Varier les façons de reprendre l''information (pronoms de reprise, synonymes)', 2, 'finalite'),
    (c_ecrire, g3, 'Énoncer – Choisir le vocabulaire approprié (mots et expressions justes)', 3, 'finalite'),
    (c_ecrire, g3, 'Encoder – Effectuer les accords régis par le sujet (verbe-sujet) selon les temps et verbes à l''étude', 4, 'finalite'),
    (c_ecrire, g3, 'Encoder – Utiliser adéquatement la virgule dans les énumérations', 5, 'finalite'),
    (c_ecrire, g3, 'Encoder – Utiliser ses connaissances du système orthographique pour orthographier des mots inconnus', 6, 'finalite'),
    (c_ecrire, g3, 'Énoncer – Ajouter ou retrancher des groupes de mots (compléments) pour enrichir les phrases', 7, 'progression'),
    (c_ecrire, g3, 'Matérialiser – Ajouter des éléments modaux (illustrations, environnement sonore) pour bonifier le texte', 8, 'progression');

  -- ── 4e année ──
  INSERT INTO content_items (competency_id, grade_level_id, name_fr, sort_order, progression_type) VALUES
    (c_ecrire, g4, 'Énoncer – Varier les mots du texte pour éviter les répétitions', 1, 'finalite'),
    (c_ecrire, g4, 'Énoncer – Recourir au registre de langue approprié selon le contexte et la situation de communication', 2, 'finalite'),
    (c_ecrire, g4, 'Encoder – Marquer adéquatement les paroles rapportées (deux-points, guillemets)', 3, 'finalite'),
    (c_ecrire, g4, 'Encoder – Utiliser adéquatement la virgule pour encadrer ou isoler des formules incises', 4, 'finalite'),
    (c_ecrire, g4, 'Matérialiser – Employer un support numérique pour diffuser et mettre en page le texte', 5, 'finalite'),
    (c_ecrire, g4, 'Idéer – Effectuer une sélection d''idées et préciser les plus pertinentes selon le genre', 6, 'progression'),
    (c_ecrire, g4, 'Matérialiser – Faire des choix graphiques et typographiques qui mettent le texte en valeur', 7, 'progression'),
    (c_ecrire, g4, 'Encoder – Effectuer des accords grammaticaux plus complexes (participe passé, accords particuliers)', 8, 'progression');

  -- ── 5e année ──
  INSERT INTO content_items (competency_id, grade_level_id, name_fr, sort_order, progression_type) VALUES
    (c_ecrire, g5, 'Idéer – Analyser les éléments de la situation de communication pour orienter son texte avec précision', 1, 'finalite'),
    (c_ecrire, g5, 'Énoncer – Varier intentionnellement la longueur, la forme et le type des phrases pour créer des effets', 2, 'finalite'),
    (c_ecrire, g5, 'Énoncer – Employer des mots précis et variés pour enrichir le texte', 3, 'finalite'),
    (c_ecrire, g5, 'Matérialiser – Choisir un support (imprimé ou numérique) en fonction des effets souhaités sur le destinataire', 4, 'finalite'),
    (c_ecrire, g5, 'Matérialiser – Ajouter judicieusement des éléments modaux (images, sons, vidéos) en respectant les droits d''auteur', 5, 'finalite'),
    (c_ecrire, g5, 'Idéer – Organiser et développer ses idées de façon élaborée selon le genre et l''intention', 6, 'progression'),
    (c_ecrire, g5, 'Encoder – Recourir de façon autonome croissante aux outils d''aide (dictionnaire, grammaire, ressources numériques)', 7, 'progression');

  -- ── 6e année ──
  INSERT INTO content_items (competency_id, grade_level_id, name_fr, sort_order, progression_type) VALUES
    (c_ecrire, g6, 'Idéer – Produire un texte dont les idées sont développées avec profondeur et cohérence', 1, 'finalite'),
    (c_ecrire, g6, 'Énoncer – Formuler des phrases variées et complexes adaptées au genre et au destinataire', 2, 'finalite'),
    (c_ecrire, g6, 'Énoncer – Adopter un style personnel dans ses productions écrites', 3, 'finalite'),
    (c_ecrire, g6, 'Encoder – Maîtriser les accords grammaticaux selon l''ensemble des cas à l''étude', 4, 'finalite'),
    (c_ecrire, g6, 'Matérialiser – Diffuser ses textes sur différents supports en tenant compte des droits d''auteur et des sources', 5, 'finalite'),
    (c_ecrire, g6, 'Idéer – Analyser et justifier ses choix lors de la planification, de la rédaction et de la révision', 6, 'progression'),
    (c_ecrire, g6, 'Énoncer – Faire progresser l''information de façon cohérente, variée et nuancée', 7, 'progression');

  -- ════════════════════════════════════════════════════════════
  -- COMMUNIQUER ORALEMENT SELON DES MODALITÉS VARIÉES
  -- ════════════════════════════════════════════════════════════

  -- ── 1re année ──
  INSERT INTO content_items (competency_id, grade_level_id, name_fr, sort_order, progression_type) VALUES
    -- ÉCOUTER (réception)
    (c_oral, g1, 'Écouter – Donner du sens aux mots et aux expressions entendus', 1, 'progression'),
    (c_oral, g1, 'Écouter – Donner du sens aux informations explicites d''un discours entendu', 2, 'progression'),
    (c_oral, g1, 'Écouter – Construire le sens global d''un discours entendu', 3, 'progression'),
    (c_oral, g1, 'Écouter – Identifier les bris de compréhension à l''écoute et y remédier', 4, 'progression'),
    -- PRENDRE LA PAROLE (production)
    (c_oral, g1, 'Prendre la parole – S''adapter au genre et à la forme selon l''intention de communication', 5, 'progression'),
    (c_oral, g1, 'Prendre la parole – Formuler ses idées en énoncés complets et compréhensibles', 6, 'finalite'),
    (c_oral, g1, 'Prendre la parole – Recourir aux éléments verbaux, paraverbaux (intonation, débit) et non verbaux (gestes, mimiques)', 7, 'finalite'),
    (c_oral, g1, 'Prendre la parole – Émettre les mots du discours en utilisant les appuis de l''oral (pauses, ponctuation orale)', 8, 'progression');

  -- ── 2e année ──
  INSERT INTO content_items (competency_id, grade_level_id, name_fr, sort_order, progression_type) VALUES
    (c_oral, g2, 'Écouter – Identifier le genre d''un discours oral en s''appuyant sur ses caractéristiques', 1, 'finalite'),
    (c_oral, g2, 'Écouter – Inférer les informations implicites d''un discours oral', 2, 'finalite'),
    (c_oral, g2, 'Prendre la parole – Choisir les formes verbales selon le temps dominant (passé, présent, futur)', 3, 'finalite'),
    (c_oral, g2, 'Prendre la parole – Recourir au registre de langue approprié selon la situation (familier ou soutenu)', 4, 'finalite'),
    (c_oral, g2, 'Écouter – Attribuer une ou des significations personnelles à un discours oral (interpréter)', 5, 'progression'),
    (c_oral, g2, 'Écouter – Identifier les émotions et les effets que le discours produit sur soi (réagir)', 6, 'progression'),
    (c_oral, g2, 'Prendre la parole – Faire progresser l''information (organisateurs textuels, marqueurs de relation)', 7, 'progression');

  -- ── 3e année ──
  INSERT INTO content_items (competency_id, grade_level_id, name_fr, sort_order, progression_type) VALUES
    (c_oral, g3, 'Écouter – Justifier ses réactions à un discours oral', 1, 'finalite'),
    (c_oral, g3, 'Écouter – Comparer le discours à d''autres discours ou textes connus (jugement critique)', 2, 'finalite'),
    (c_oral, g3, 'Prendre la parole – Varier la longueur et la forme des énoncés pour assurer la fluidité du discours', 3, 'finalite'),
    (c_oral, g3, 'Prendre la parole – Recourir efficacement aux éléments paraverbaux (prosodie : volume, débit, intonation)', 4, 'finalite'),
    (c_oral, g3, 'Écouter – Formuler un jugement critique en s''appuyant sur un ou des critères', 5, 'progression'),
    (c_oral, g3, 'Prendre la parole – Organiser un discours oral en respectant les caractéristiques du genre', 6, 'progression'),
    (c_oral, g3, 'Prendre la parole – Dégager les caractéristiques du genre à produire à partir de discours modèles', 7, 'progression');

  -- ── 4e année ──
  INSERT INTO content_items (competency_id, grade_level_id, name_fr, sort_order, progression_type) VALUES
    (c_oral, g4, 'Prendre la parole – Varier les mots de son discours (vocabulaire précis et varié)', 1, 'finalite'),
    (c_oral, g4, 'Écouter – Comparer son jugement critique à celui d''autrui sur un même discours', 2, 'finalite'),
    (c_oral, g4, 'Prendre la parole – Recourir aux éléments non verbaux (gestes, mimiques, supports visuels) de façon intentionnelle', 3, 'finalite'),
    (c_oral, g4, 'Écouter – Évaluer la crédibilité et la fiabilité d''un discours oral (source, point de vue)', 4, 'finalite'),
    (c_oral, g4, 'Écouter – Distinguer l''énonciatrice ou l''énonciateur de la narratrice ou du narrateur, s''il y a lieu', 5, 'progression'),
    (c_oral, g4, 'Prendre la parole – Préciser ses idées à l''aide de procédés (explication, exemple, comparaison)', 6, 'progression'),
    (c_oral, g4, 'Écouter – Constater la diversité des jugements émis sur un même discours (pluralité des critères)', 7, 'progression');

  -- ── 5e année ──
  INSERT INTO content_items (competency_id, grade_level_id, name_fr, sort_order, progression_type) VALUES
    (c_oral, g5, 'Prendre la parole – Ajouter ou retrancher des groupes de mots pour enrichir les énoncés et créer des effets', 1, 'finalite'),
    (c_oral, g5, 'Écouter – Justifier son jugement critique en s''appuyant sur des extraits du discours', 2, 'finalite'),
    (c_oral, g5, 'Prendre la parole – Analyser les éléments de la situation de communication avant une prise de parole planifiée', 3, 'finalite'),
    (c_oral, g5, 'Écouter – Analyser le style de l''énonciatrice ou de l''énonciateur (registre de langue, choix lexicaux)', 4, 'progression'),
    (c_oral, g5, 'Prendre la parole – Adapter son discours en fonction des réactions de l''interlocuteur ou de l''auditoire', 5, 'progression'),
    (c_oral, g5, 'Écouter – Dégager ce qui fait la singularité d''un discours ou d''un texte oral', 6, 'progression');

  -- ── 6e année ──
  INSERT INTO content_items (competency_id, grade_level_id, name_fr, sort_order, progression_type) VALUES
    (c_oral, g6, 'Prendre la parole – Employer un style personnel et varié à l''oral', 1, 'finalite'),
    (c_oral, g6, 'Écouter – Formuler un jugement critique élaboré et autonome sur un discours ou un texte oral', 2, 'finalite'),
    (c_oral, g6, 'Prendre la parole – Diffuser oralement sur différents supports (enregistrement, présentation numérique)', 3, 'finalite'),
    (c_oral, g6, 'Écouter – Évaluer la présence d''éléments d''intertextualité dans un discours', 4, 'finalite'),
    (c_oral, g6, 'Prendre la parole – Adopter des choix linguistiques intentionnels pour créer des effets sur l''auditoire', 5, 'progression'),
    (c_oral, g6, 'Écouter – Justifier son jugement en s''appuyant sur d''autres discours ou textes connus', 6, 'progression');

END $$;
