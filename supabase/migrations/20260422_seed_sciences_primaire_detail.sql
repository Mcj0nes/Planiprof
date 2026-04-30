-- ============================================================
-- PLANIPROF — Seed: Sciences et technologie, primaire (détail)
-- Source : PDA PFEQ Science et technologie, 24 août 2009
-- Trois domaines : Univers matériel · Terre et espace · Univers vivant
-- ============================================================

do $$
declare
  sci_id  int;
  g1 int; g2 int; g3 int; g4 int; g5 int; g6 int;
  c_mat int; c_ter int; c_viv int;

begin

  select id into sci_id from subjects where slug = 'sciences';

  select id into g1 from grade_levels where education_level = 'primaire' and grade = 1;
  select id into g2 from grade_levels where education_level = 'primaire' and grade = 2;
  select id into g3 from grade_levels where education_level = 'primaire' and grade = 3;
  select id into g4 from grade_levels where education_level = 'primaire' and grade = 4;
  select id into g5 from grade_levels where education_level = 'primaire' and grade = 5;
  select id into g6 from grade_levels where education_level = 'primaire' and grade = 6;

  -- Nettoyage
  delete from plan_assignments where content_item_id in (
    select id from content_items where competency_id in (
      select id from competencies where subject_id = sci_id));
  delete from day_periods where content_item_id in (
    select id from content_items where competency_id in (
      select id from competencies where subject_id = sci_id));
  delete from content_items where competency_id in (
    select id from competencies where subject_id = sci_id);
  delete from competencies where subject_id = sci_id;


  -- ── Compétences (3 domaines PDA) ─────────────────────────
  insert into competencies (subject_id, name_fr, color, sort_order) values
    (sci_id, 'Univers matériel', '#059669', 10) returning id into c_mat;
  insert into competencies (subject_id, name_fr, color, sort_order) values
    (sci_id, 'Terre et espace', '#0D9488', 20) returning id into c_ter;
  insert into competencies (subject_id, name_fr, color, sort_order) values
    (sci_id, 'Univers vivant', '#16A34A', 30) returning id into c_viv;


  -- ════════════════════════════════════════════════════════
  -- UNIVERS MATÉRIEL
  -- ════════════════════════════════════════════════════════

  -- 1re année
  insert into content_items (competency_id, grade_level_id, name_fr, sort_order) values
    (c_mat, g1, 'Classer des objets à l''aide de leurs propriétés : couleur, forme, taille, texture, odeur', 1),
    (c_mat, g1, 'Classer des matériaux selon leur degré d''absorption', 2),
    (c_mat, g1, 'Décrire la forme, la couleur et la texture d''un objet ou d''une substance', 3),
    (c_mat, g1, 'Distinguer trois états de la matière : solide, liquide, gazeux', 4),
    (c_mat, g1, 'Reconnaître l''eau sous l''état solide (glace, neige), liquide et gazeux (vapeur)', 5),
    (c_mat, g1, 'Identifier des manifestations d''une force : tirer, pousser, lancer, comprimer, étirer', 6),
    (c_mat, g1, 'Décrire les caractéristiques d''un mouvement : direction et vitesse', 7),
    (c_mat, g1, 'Décrire des pièces et des mécanismes qui composent un objet', 8),
    (c_mat, g1, 'Identifier des besoins à l''origine d''un objet technique', 9);

  -- 2e année
  insert into content_items (competency_id, grade_level_id, name_fr, sort_order) values
    (c_mat, g2, 'Distinguer les matériaux perméables à l''eau de ceux qui ne le sont pas', 1),
    (c_mat, g2, 'Distinguer les substances translucides (transparentes ou colorées) des substances opaques', 2),
    (c_mat, g2, 'Reconnaître des matériaux qui composent un objet', 3),
    (c_mat, g2, 'Reconnaître des mélanges dans son milieu (ex. : air, jus, vinaigrette, soupe)', 4),
    (c_mat, g2, 'Décrire les opérations pour transformer l''eau d''un état à un autre (chauffer ou refroidir)', 5),
    (c_mat, g2, 'Déterminer l''état de divers objets et substances dans l''environnement', 6),
    (c_mat, g2, 'Reconnaître les effets du magnétisme dans des aimants (attraction ou répulsion)', 7),
    (c_mat, g2, 'Identifier des situations dans lesquelles des aimants sont utilisés', 8),
    (c_mat, g2, 'Identifier des situations où la force de frottement (friction) est présente', 9),
    (c_mat, g2, 'Reconnaître des machines simples dans un objet : levier, plan incliné, vis, poulie, treuil, roue', 10),
    (c_mat, g2, 'Reconnaître des produits d''usage courant qui présentent un danger (pictogrammes de sécurité)', 11);

  -- 3e année
  insert into content_items (competency_id, grade_level_id, name_fr, sort_order) values
    (c_mat, g3, 'Distinguer la masse (quantité de matière) d''un objet de son poids (force de gravité)', 1),
    (c_mat, g3, 'Distinguer un mélange de liquides miscibles d''un mélange de liquides non miscibles (ex. : eau et lait; eau et huile)', 2),
    (c_mat, g3, 'Distinguer une substance soluble dans l''eau (ex. : sel, sucre) d''une substance non soluble (ex. : poivre, sable)', 3),
    (c_mat, g3, 'Décrire diverses propriétés physiques : élasticité, dureté, solubilité', 4),
    (c_mat, g3, 'Reconnaître la conservation de la quantité de matière lors d''une transformation physique', 5),
    (c_mat, g3, 'Décrire l''effet de l''attraction gravitationnelle sur un objet (ex. : chute libre)', 6),
    (c_mat, g3, 'Décrire comment une force agit sur un corps (le mettre en mouvement, modifier, arrêter)', 7),
    (c_mat, g3, 'Identifier les composantes d''un circuit électrique simple : fil, source, ampoule, interrupteur', 8),
    (c_mat, g3, 'Identifier des sources d''énergie dans son environnement (ex. : eau en mouvement, pile, rayonnement solaire)', 9),
    (c_mat, g3, 'Décrire des situations dans lesquelles les humains consomment de l''énergie (chauffage, transport, alimentation, loisirs)', 10),
    (c_mat, g3, 'Décrire l''utilité de certaines machines simples (variation de l''effort à fournir)', 11),
    (c_mat, g3, 'Reconnaître deux types de mouvements : rotation et translation', 12);

  -- 4e année
  insert into content_items (competency_id, grade_level_id, name_fr, sort_order) values
    (c_mat, g4, 'Classer des solides selon leur masse volumique (volumes identiques et masses différentes, ou l''inverse)', 1),
    (c_mat, g4, 'Associer la flottabilité d''un volume de liquide sur un autre à leur masse volumique respective', 2),
    (c_mat, g4, 'Associer les usages de certains produits domestiques à leurs propriétés (ex. : produits nettoyants, vinaigre)', 3),
    (c_mat, g4, 'Démontrer que des changements physiques (déformation, cassure, broyage, changement d''état) ne modifient pas les propriétés de la matière', 4),
    (c_mat, g4, 'Distinguer les conducteurs thermiques des isolants thermiques', 5),
    (c_mat, g4, 'Distinguer les conducteurs électriques des isolants électriques', 6),
    (c_mat, g4, 'Décrire la fonction des composantes d''un circuit électrique simple (conducteur, isolant, source, ampoule, interrupteur)', 7),
    (c_mat, g4, 'Nommer des moyens utilisés pour limiter la consommation d''énergie (ampoule fluorescente, minuterie) et pour la conserver (isolation)', 8),
    (c_mat, g4, 'Décrire l''effet de l''attraction électrostatique (ex. : papier attiré par un objet chargé)', 9),
    (c_mat, g4, 'Distinguer un aimant d''un électroaimant', 10),
    (c_mat, g4, 'Décrire l''effet d''une force sur un matériau ou une structure', 11),
    (c_mat, g4, 'Identifier des pièces mécaniques : engrenages, cames, ressorts, machines simples, bielles', 12),
    (c_mat, g4, 'Identifier la fonction principale de quelques machines complexes (ex. : chariot, roue hydraulique, éolienne)', 13);

  -- 5e année
  insert into content_items (competency_id, grade_level_id, name_fr, sort_order) values
    (c_mat, g5, 'Expliquer la flottabilité d''une substance sur une autre par leur masse volumique respective', 1),
    (c_mat, g5, 'Démontrer que des changements chimiques (cuisson, combustion, oxydation, réaction acide-base) modifient les propriétés de la matière', 2),
    (c_mat, g5, 'Expliquer le mode de fabrication de certains produits domestiques (ex. : savon, papier)', 3),
    (c_mat, g5, 'Décrire différentes formes d''énergie : mécanique, électrique, lumineuse, chimique, calorifique, sonore, nucléaire', 4),
    (c_mat, g5, 'Identifier des caractéristiques d''une onde sonore (volume, timbre, écho)', 5),
    (c_mat, g5, 'Décrire le comportement d''un rayon lumineux : réflexion, réfraction', 6),
    (c_mat, g5, 'Expliquer les propriétés isolantes de diverses substances (ex. : polystyrène, laine minérale, paille)', 7),
    (c_mat, g5, 'Décrire des transformations de l''énergie d''une forme à une autre', 8),
    (c_mat, g5, 'Identifier des objets qui utilisent le principe de l''électromagnétisme (ex. : grue à électroaimant)', 9),
    (c_mat, g5, 'Reconnaître diverses manifestations de la pression (ex. : ballon, pression atmosphérique, aile d''avion)', 10),
    (c_mat, g5, 'Prévoir l''effet combiné de plusieurs forces sur un objet au repos ou en déplacement rectiligne', 11),
    (c_mat, g5, 'Décrire une séquence simple de pièces mécaniques en mouvement', 12),
    (c_mat, g5, 'Reconnaître l''influence et l''impact des technologies du transport sur le mode de vie et l''environnement', 13);

  -- 6e année
  insert into content_items (competency_id, grade_level_id, name_fr, sort_order) values
    (c_mat, g6, 'Reconnaître des transformations de l''énergie dans différents appareils (ex. : lampe de poche : chimique → lumineuse; bouilloire : électrique → calorifique)', 1),
    (c_mat, g6, 'Expliquer le mouvement de convection dans les liquides et les gaz (ex. : eau en ébullition)', 2),
    (c_mat, g6, 'Décrire comment la pression agit sur un corps (compression, déplacement, augmentation de la température)', 3),
    (c_mat, g6, 'Reconnaître des structures robotisées utilisant un servoméchanisme', 4),
    (c_mat, g6, 'Reconnaître l''influence et l''impact des appareils électriques sur le mode de vie et l''environnement (ex. : téléphone, radio, télévision, ordinateur)', 5);


  -- ════════════════════════════════════════════════════════
  -- TERRE ET ESPACE
  -- ════════════════════════════════════════════════════════

  -- 1re année
  insert into content_items (competency_id, grade_level_id, name_fr, sort_order) values
    (c_ter, g1, 'Décrire différents types de précipitations : pluie, neige, grêle, pluie verglaçante', 1),
    (c_ter, g1, 'Décrire des changements selon les saisons : température, luminosité, type de précipitations', 2),
    (c_ter, g1, 'Décrire l''influence de la position apparente du Soleil sur la longueur des ombres', 3);

  -- 2e année
  insert into content_items (competency_id, grade_level_id, name_fr, sort_order) values
    (c_ter, g2, 'Identifier des sources naturelles d''eau douce (ruisseaux, lacs, rivières) et d''eau salée (mers, océans)', 1),
    (c_ter, g2, 'Expliquer les sensations éprouvées (chaud, froid, confortable) liées à la mesure de la température', 2);

  -- 3e année
  insert into content_items (competency_id, grade_level_id, name_fr, sort_order) values
    (c_ter, g3, 'Comparer les propriétés de différents types de sols : composition, capacité à retenir l''eau et la chaleur', 1),
    (c_ter, g3, 'Expliquer que le Soleil est la principale source d''énergie sur Terre', 2),
    (c_ter, g3, 'Identifier des sources d''énergie naturelles : soleil, eau en mouvement, vent', 3),
    (c_ter, g3, 'Associer le cycle du jour et de la nuit à la rotation de la Terre', 4),
    (c_ter, g3, 'Associer le Soleil à une étoile, la Terre à une planète et la Lune à un satellite naturel', 5),
    (c_ter, g3, 'Reconnaître les principaux constituants du système solaire : Soleil, planètes, satellites naturels', 6);

  -- 4e année
  insert into content_items (competency_id, grade_level_id, name_fr, sort_order) values
    (c_ter, g4, 'Décrire les principales structures à la surface de la Terre (ex. : continent, océan, calotte glaciaire, montagne, volcan)', 1),
    (c_ter, g4, 'Décrire divers impacts de la qualité de l''eau, du sol ou de l''air sur les vivants', 2),
    (c_ter, g4, 'Expliquer le cycle de l''eau : évaporation, condensation, précipitation, ruissellement et infiltration', 3),
    (c_ter, g4, 'Décrire ce qu''est une énergie renouvelable', 4),
    (c_ter, g4, 'Expliquer que la lumière, l''eau en mouvement et le vent sont des sources d''énergie renouvelables', 5),
    (c_ter, g4, 'Décrire les mouvements de rotation et de révolution de la Terre et de la Lune', 6),
    (c_ter, g4, 'Illustrer les phases du cycle lunaire : pleine lune, nouvelle lune, premier et dernier quartiers', 7),
    (c_ter, g4, 'Faire un lien entre les conditions météorologiques et les types de nuages présents dans le ciel', 8);

  -- 5e année
  insert into content_items (competency_id, grade_level_id, name_fr, sort_order) values
    (c_ter, g5, 'Distinguer un fossile (ou une trace de vivant) d''une roche', 1),
    (c_ter, g5, 'Distinguer une roche d''un minéral', 2),
    (c_ter, g5, 'Identifier des sources d''énergie fossiles : pétrole, charbon, gaz naturel', 3),
    (c_ter, g5, 'Décrire des moyens fabriqués par l''humain pour transformer des sources d''énergie renouvelables en électricité (barrage, éolienne, panneau solaire)', 4),
    (c_ter, g5, 'Expliquer ce qu''est une énergie non renouvelable', 5),
    (c_ter, g5, 'Décrire certains phénomènes naturels : érosion, foudre, tornade, ouragan', 6),
    (c_ter, g5, 'Associer l''alternance des saisons avec la révolution et l''inclinaison de la Terre', 7),
    (c_ter, g5, 'Illustrer la formation des éclipses (lunaire, solaire)', 8),
    (c_ter, g5, 'Décrire des caractéristiques des principaux corps du système solaire (composition, taille, orbite, température)', 9),
    (c_ter, g5, 'Reconnaître des étoiles et des constellations sur une carte céleste', 10),
    (c_ter, g5, 'Décrire le rythme des marées (hausse et baisse du niveau de la mer)', 11),
    (c_ter, g5, 'Associer la quantité moyenne de précipitations au climat d''une région (sec, humide)', 12);

  -- 6e année
  insert into content_items (competency_id, grade_level_id, name_fr, sort_order) values
    (c_ter, g6, 'Classer des roches (présence de strates, grosseur des cristaux) et des minéraux (couleur, texture, éclat, dureté) selon leurs propriétés', 1),
    (c_ter, g6, 'Décrire les propriétés observables des cristaux : couleur, régularités géométriques', 2),
    (c_ter, g6, 'Expliquer que les combustibles fossiles sont des sources d''énergie non renouvelables', 3),
    (c_ter, g6, 'Nommer des combustibles issus du pétrole (ex. : essence, propane, butane, mazout, gaz naturel)', 4),
    (c_ter, g6, 'Décrire les modes de transmission de l''énergie thermique : rayonnement, convection, conduction', 5),
    (c_ter, g6, 'Décrire l''impact de certains phénomènes naturels sur l''environnement ou le bien-être des individus', 6),
    (c_ter, g6, 'Distinguer une étoile, une constellation et une galaxie', 7),
    (c_ter, g6, 'Associer la température moyenne au climat d''une région : polaire, froid, tempéré, doux, chaud', 8),
    (c_ter, g6, 'Reconnaître l''influence et l''impact des technologies de la Terre, de l''atmosphère et de l''espace sur le mode de vie et l''environnement', 9);


  -- ════════════════════════════════════════════════════════
  -- UNIVERS VIVANT
  -- ════════════════════════════════════════════════════════

  -- 1re année
  insert into content_items (competency_id, grade_level_id, name_fr, sort_order) values
    (c_viv, g1, 'Expliquer les besoins essentiels au métabolisme des êtres vivants (ex. : se nourrir, respirer)', 1),
    (c_viv, g1, 'Décrire les fonctions de certaines parties de son anatomie (ex. : membres, tête, cœur, estomac)', 2),
    (c_viv, g1, 'Décrire divers modes de locomotion chez les animaux : marche, reptation, vol, saut', 3);

  -- 2e année
  insert into content_items (competency_id, grade_level_id, name_fr, sort_order) values
    (c_viv, g2, 'Nommer les besoins essentiels à la croissance d''une plante : eau, air, lumière, sels minéraux', 1),
    (c_viv, g2, 'Décrire les parties de l''anatomie d''une plante : racines, tiges, feuilles, fleurs, fruits et graines', 2),
    (c_viv, g2, 'Comparer l''alimentation d''animaux domestiques et d''animaux sauvages', 3),
    (c_viv, g2, 'Donner des exemples d''utilisation du vivant (ex. : viande, légume, bois, cuir)', 4);

  -- 3e année
  insert into content_items (competency_id, grade_level_id, name_fr, sort_order) values
    (c_viv, g3, 'Décrire les caractéristiques de différents règnes : micro-organismes, champignons, végétaux, animaux', 1),
    (c_viv, g3, 'Classer des êtres vivants selon leur règne', 2),
    (c_viv, g3, 'Associer les parties d''une plante à leur fonction générale (racines, tiges, feuilles, fleurs, fruits et graines)', 3),
    (c_viv, g3, 'Expliquer la fonction sensorielle de certaines parties de l''anatomie : peau, yeux, bouche, oreilles, nez', 4),
    (c_viv, g3, 'Décrire les stades de croissance d''une plante à fleurs', 5),
    (c_viv, g3, 'Décrire les stades de croissance de différents animaux', 6),
    (c_viv, g3, 'Associer des animaux à leur régime alimentaire : carnivore, herbivore, omnivore', 7),
    (c_viv, g3, 'Illustrer une chaîne alimentaire simple (3 ou 4 maillons)', 8),
    (c_viv, g3, 'Décrire des caractéristiques physiques qui témoignent de l''adaptation d''un animal à son milieu', 9),
    (c_viv, g3, 'Décrire des comportements d''un animal qui lui permettent de s''adapter à son milieu', 10),
    (c_viv, g3, 'Nommer d''autres types de mouvements chez les animaux et leur fonction (ex. : défense, parade nuptiale)', 11);

  -- 4e année
  insert into content_items (competency_id, grade_level_id, name_fr, sort_order) values
    (c_viv, g4, 'Répertorier les animaux selon leur classe : mammifères, reptiles, oiseaux, poissons, amphibiens', 1),
    (c_viv, g4, 'Associer des parties et des systèmes de l''anatomie des animaux à leur fonction principale', 2),
    (c_viv, g4, 'Décrire les activités liées au métabolisme des êtres vivants : transformation de l''énergie, croissance, entretien des systèmes', 3),
    (c_viv, g4, 'Décrire des changements dans l''apparence d''un animal qui subit une métamorphose (ex. : papillon, grenouille)', 4),
    (c_viv, g4, 'Expliquer les besoins alimentaires communs à tous les animaux : eau, glucides, lipides, protéines, vitamines, minéraux', 5),
    (c_viv, g4, 'Identifier des habitats ainsi que les populations animales et végétales qui y sont associées', 6),
    (c_viv, g4, 'Décrire comment les animaux satisfont à leurs besoins fondamentaux à l''intérieur de leur habitat', 7),
    (c_viv, g4, 'Décrire les principales étapes de production de divers aliments de base (ex. : beurre, pain, yogourt)', 8);

  -- 5e année
  insert into content_items (competency_id, grade_level_id, name_fr, sort_order) values
    (c_viv, g5, 'Distinguer des modes de développement de l''embryon : vivipare (mammifères), ovipare ou ovovivipare (autres)', 1),
    (c_viv, g5, 'Décrire le mode de reproduction sexuée des animaux (rôles du mâle et de la femelle)', 2),
    (c_viv, g5, 'Décrire le mode de reproduction sexuée des végétaux (pistil, étamine, pollen, graine et fruit)', 3),
    (c_viv, g5, 'Décrire la fonction de la photosynthèse', 4),
    (c_viv, g5, 'Distinguer la photosynthèse de la respiration', 5),
    (c_viv, g5, 'Expliquer en quoi l''eau, la lumière, les sels minéraux et le gaz carbonique sont essentiels aux végétaux', 6),
    (c_viv, g5, 'Expliquer les étapes de la croissance et du développement des humains', 7),
    (c_viv, g5, 'Décrire des relations entre les vivants : parasitisme, prédation', 8),
    (c_viv, g5, 'Expliquer des adaptations d''animaux et de végétaux permettant d''augmenter leurs chances de survie (ex. : mimétisme, camouflage)', 9),
    (c_viv, g5, 'Décrire une pyramide alimentaire d''un milieu donné', 10),
    (c_viv, g5, 'Décrire des impacts des activités humaines sur l''environnement (exploitation des ressources, pollution, gestion des déchets, urbanisation)', 11),
    (c_viv, g5, 'Distinguer trois mouvements chez les végétaux : géotropisme, hydrotropisme, phototropisme', 12);

  -- 6e année
  insert into content_items (competency_id, grade_level_id, name_fr, sort_order) values
    (c_viv, g6, 'Décrire des modes de reproduction asexuée des végétaux (ex. : bourgeonnement, bouturage, rhizomes, tubercules)', 1),
    (c_viv, g6, 'Décrire l''anatomie et la fonction des principaux organes du système reproducteur de l''homme et de la femme', 2),
    (c_viv, g6, 'Décrire des changements physiques propres à la puberté', 3),
    (c_viv, g6, 'Décrire les grandes étapes de l''évolution des êtres vivants', 4),
    (c_viv, g6, 'Décrire des technologies de l''agriculture et de l''alimentation (ex. : croisement de plantes, sélection d''animaux, pasteurisation)', 5),
    (c_viv, g6, 'Expliquer en quoi les mouvements des végétaux leur permettent de répondre à leurs besoins fondamentaux', 6),
    (c_viv, g6, 'Expliquer des concepts scientifiques liés au recyclage et au compostage (propriétés de la matière, chaîne alimentaire, énergie)', 7);

end $$;
