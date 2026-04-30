-- ============================================================
-- PLANIPROF — Seed: Sciences et technologie, secondaire (Sec 1–4)
-- Source: Progression des apprentissages au secondaire —
--   Science et technologie (MEES, 2011)
-- Run AFTER 20260420_initial_schema.sql and
--   20260422_seed_sciences_primaire_detail.sql
-- ============================================================

do $$
declare
  sci_id  int;
  s1 int; s2 int; s3 int; s4 int;

  c_um    int;  -- Univers matériel
  c_uv    int;  -- Univers vivant
  c_te    int;  -- Terre et espace
  c_ut    int;  -- Univers technologique

begin

  select id into sci_id from subjects where slug = 'sciences';

  select id into s1 from grade_levels where education_level = 'secondaire' and grade = 1;
  select id into s2 from grade_levels where education_level = 'secondaire' and grade = 2;
  select id into s3 from grade_levels where education_level = 'secondaire' and grade = 3;
  select id into s4 from grade_levels where education_level = 'secondaire' and grade = 4;

  -- ── Nettoyage des données secondaires existantes ──────────
  -- (Au cas où on relance la migration)
  delete from plan_assignments pa
    using content_items ci
    join competencies co on co.id = ci.competency_id
    where ci.id = pa.content_item_id
      and co.subject_id = sci_id
      and ci.grade_level_id in (s1, s2, s3, s4);

  delete from content_items ci
    using competencies co
    where ci.competency_id = co.id
      and co.subject_id = sci_id
      and ci.grade_level_id in (s1, s2, s3, s4);

  delete from competencies
    where subject_id = sci_id
      and name_fr like '%(secondaire)%';

  -- ── Compétences / domaines ─────────────────────────────────
  insert into competencies (subject_id, name_fr, color, sort_order)
    values (sci_id, 'Univers matériel (secondaire)', '#6366F1', 11)
    returning id into c_um;

  insert into competencies (subject_id, name_fr, color, sort_order)
    values (sci_id, 'Univers vivant (secondaire)', '#22C55E', 12)
    returning id into c_uv;

  insert into competencies (subject_id, name_fr, color, sort_order)
    values (sci_id, 'Terre et espace (secondaire)', '#0EA5E9', 13)
    returning id into c_te;

  insert into competencies (subject_id, name_fr, color, sort_order)
    values (sci_id, 'Univers technologique (secondaire)', '#F59E0B', 14)
    returning id into c_ut;


  -- ═══════════════════════════════════════════════════════════
  -- 1RE SECONDAIRE
  -- ═══════════════════════════════════════════════════════════

  -- Univers matériel – Sec 1
  insert into content_items (competency_id, grade_level_id, name_fr, sort_order) values
    (c_um, s1, 'Définir les concepts de masse et de volume; choisir l''unité appropriée', 1),
    (c_um, s1, 'Décrire les effets d''un apport de chaleur sur l''agitation des particules; définir la température', 2),
    (c_um, s1, 'Nommer les changements d''état de la matière (vaporisation, condensation, solidification, fusion, sublimation)', 3),
    (c_um, s1, 'Déterminer les propriétés observables de solutions acides, basiques ou neutres', 4),
    (c_um, s1, 'Distinguer un mélange homogène d''un mélange hétérogène', 5),
    (c_um, s1, 'Associer une technique de séparation au type de mélange (filtration, décantation, distillation, etc.)', 6),
    (c_um, s1, 'Définir le modèle particulaire et l''utiliser pour décrire les états de la matière', 7),
    (c_um, s1, 'Décrire le modèle atomique de Dalton; définir atome, molécule et élément', 8),
    (c_um, s1, 'Décrire le tableau périodique comme répertoire organisé des éléments', 9),
    (c_um, s1, 'Définir une substance pure; distinguer élément et composé', 10);

  -- Univers vivant – Sec 1
  insert into content_items (competency_id, grade_level_id, name_fr, sort_order) values
    (c_uv, s1, 'Nommer les caractéristiques qui définissent un habitat et une niche écologique', 1),
    (c_uv, s1, 'Distinguer espèce, population et communauté', 2),
    (c_uv, s1, 'Décrire des adaptations physiques et comportementales qui favorisent la survie', 3),
    (c_uv, s1, 'Décrire les étapes de l''évolution des êtres vivants et la sélection naturelle', 4),
    (c_uv, s1, 'Définir la taxonomie; identifier une espèce à l''aide d''une clé taxonomique', 5),
    (c_uv, s1, 'Situer les chromosomes et définir un gène (transmission des caractères héréditaires)', 6);

  -- Terre et espace – Sec 1
  insert into content_items (competency_id, grade_level_id, name_fr, sort_order) values
    (c_te, s1, 'Décrire les trois parties de la structure interne de la Terre (croûte, manteau, noyau)', 1),
    (c_te, s1, 'Définir la gravitation; décrire les marées par l''effet gravitationnel Terre-Lune', 2),
    (c_te, s1, 'Décrire les propriétés de la lumière; expliquer saisons, phases de la Lune et éclipses', 3),
    (c_te, s1, 'Comparer les planètes du système solaire (distances, dimensions, composition)', 4),
    (c_te, s1, 'Expliquer l''alternance du jour et de la nuit par la rotation de la Terre', 5),
    (c_te, s1, 'Décrire les phases lunaires et expliquer les éclipses', 6),
    (c_te, s1, 'Expliquer les saisons par la position de la Terre par rapport au Soleil', 7);

  -- Univers technologique – Sec 1
  insert into content_items (competency_id, grade_level_id, name_fr, sort_order) values
    (c_ut, s1, 'Définir et réaliser un schéma de principes (fonctionnement d''un objet technique)', 1),
    (c_ut, s1, 'Définir et réaliser un schéma de construction (assemblage d''un objet technique)', 2),
    (c_ut, s1, 'Représenter des formes simples en projection orthogonale (vues multiples)', 3),
    (c_ut, s1, 'Nommer les lignes de base d''un dessin technique (contour, axe, cote, attache)', 4),
    (c_ut, s1, 'Associer les échelles à leur usage; interpréter un dessin selon l''échelle', 5);


  -- ═══════════════════════════════════════════════════════════
  -- 2E SECONDAIRE
  -- ═══════════════════════════════════════════════════════════

  -- Univers matériel – Sec 2
  insert into content_items (competency_id, grade_level_id, name_fr, sort_order) values
    (c_um, s2, 'Identifier une substance par son point de fusion ou d''ébullition', 1),
    (c_um, s2, 'Expliquer et calculer la masse volumique; identifier des substances par leur masse volumique', 2),
    (c_um, s2, 'Définir la solubilité; décrire l''effet de la température sur la solubilité', 3),
    (c_um, s2, 'Définir et calculer la concentration d''une solution aqueuse (g/L et pourcentage)', 4),
    (c_um, s2, 'Décrire les caractéristiques d''un changement chimique (indices observables)', 5),
    (c_um, s2, 'Nommer différents types de changements chimiques (décomposition, oxydation)', 6),
    (c_um, s2, 'Représenter des réactions chimiques à l''aide du modèle particulaire', 7),
    (c_um, s2, 'Expliquer le phénomène de dissolution et de dilution à l''aide du modèle particulaire', 8),
    (c_um, s2, 'Décrire les formes d''énergie (chimique, thermique, mécanique, rayonnante)', 9),
    (c_um, s2, 'Expliquer la loi de la conservation de l''énergie', 10),
    (c_um, s2, 'Définir la pression d''un fluide; distinguer fluide compressible et incompressible', 11),
    (c_um, s2, 'Décrire qualitativement la relation entre pression et volume d''un gaz', 12);

  -- Univers vivant – Sec 2
  insert into content_items (competency_id, grade_level_id, name_fr, sort_order) values
    (c_uv, s2, 'Définir la cellule comme unité structurale; distinguer cellule animale et végétale', 1),
    (c_uv, s2, 'Identifier les constituants cellulaires visibles au microscope et leurs rôles', 2),
    (c_uv, s2, 'Distinguer l''osmose de la diffusion; décrire les intrants et extrants cellulaires', 3),
    (c_uv, s2, 'Nommer les intrants/extrants de la photosynthèse et de la respiration; équations équilibrées', 4),
    (c_uv, s2, 'Distinguer la reproduction asexuée de la reproduction sexuée', 5),
    (c_uv, s2, 'Décrire les modes de reproduction chez les végétaux (asexué et sexué)', 6),
    (c_uv, s2, 'Décrire la fécondation chez l''humain; nommer les étapes du développement (zygote, embryon, fœtus)', 7),
    (c_uv, s2, 'Décrire des moyens de contraception et leur fonctionnement', 8);

  -- Terre et espace – Sec 2
  insert into content_items (competency_id, grade_level_id, name_fr, sort_order) values
    (c_te, s2, 'Décrire la théorie de la tectonique des plaques (plaques, subduction, dorsale)', 1),
    (c_te, s2, 'Expliquer la formation des montagnes, plissements et failles (orogénèse)', 2),
    (c_te, s2, 'Décrire le déroulement d''une éruption volcanique et la distribution géographique des volcans', 3),
    (c_te, s2, 'Décrire les processus à l''origine d''un tremblement de terre', 4),
    (c_te, s2, 'Expliquer le cycle de l''eau (changements d''état et échange d''énergie)', 5),
    (c_te, s2, 'Décrire les ressources énergétiques renouvelables et non renouvelables', 6),
    (c_te, s2, 'Décrire l''effet de serre et ses conséquences (réchauffement climatique)', 7),
    (c_te, s2, 'Décrire les facteurs à l''origine des vents et de la circulation atmosphérique', 8),
    (c_te, s2, 'Définir l''unité astronomique et l''année-lumière; situer la Terre dans l''univers', 9);

  -- Univers technologique – Sec 2
  insert into content_items (competency_id, grade_level_id, name_fr, sort_order) values
    (c_ut, s2, 'Représenter des objets en projection isom étrique; interpréter des dessins en vue éclatée', 1),
    (c_ut, s2, 'Réaliser des vues en coupe; appliquer les règles de cotation', 2),
    (c_ut, s2, 'Nommer et décrire les 7 fonctions mécaniques (guidage, liaison, lubrification, étanchéité, etc.)', 3),
    (c_ut, s2, 'Décrire les types de mouvements (translation, rotation, hélicoïdal, oscillant)', 4),
    (c_ut, s2, 'Analyser des systèmes de transmission et de transformation du mouvement', 5),
    (c_ut, s2, 'Calculer le rapport et le facteur de multiplication d''un système de transmission', 6);


  -- ═══════════════════════════════════════════════════════════
  -- 3E SECONDAIRE (thème : l'être humain)
  -- ═══════════════════════════════════════════════════════════

  -- Univers matériel – Sec 3
  insert into content_items (competency_id, grade_level_id, name_fr, sort_order) values
    (c_um, s3, 'Décrire la combustion et expliquer à l''aide du triangle du feu', 1),
    (c_um, s3, 'Représenter une réaction de précipitation à l''aide du modèle particulaire', 2),
    (c_um, s3, 'Décrire la réaction de neutralisation acido-basique (produits : sel et eau)', 3),
    (c_um, s3, 'Définir charge électrique; décrire l''électricité statique', 4),
    (c_um, s3, 'Appliquer la loi d''Ohm (U = RI); décrire les types de branchements en série et en parallèle', 5),
    (c_um, s3, 'Représenter un circuit électrique simple à l''aide d''un schéma', 6),
    (c_um, s3, 'Appliquer les relations W = Fs, Fg = mg, Ep = mgh et Ek = ½mv²', 7),
    (c_um, s3, 'Décrire les ondes (fréquence, longueur d''onde, amplitude); situer le spectre électromagnétique', 8),
    (c_um, s3, 'Décrire la réflexion et la réfraction des rayons lumineux; foyer d''une lentille', 9);

  -- Univers vivant – Sec 3 (corps humain)
  insert into content_items (competency_id, grade_level_id, name_fr, sort_order) values
    (c_uv, s3, 'Identifier les parties et fonctions du système digestif (tube digestif, glandes digestives)', 1),
    (c_uv, s3, 'Décrire les constituants alimentaires (eau, protides, glucides, lipides, vitamines, sels minéraux) et leurs fonctions', 2),
    (c_uv, s3, 'Identifier les parties et fonctions du système respiratoire', 3),
    (c_uv, s3, 'Décrire les composantes du sang et les fonctions des éléments figurés', 4),
    (c_uv, s3, 'Identifier les parties et fonctions du système circulatoire (cœur, vaisseaux, circulations)', 5),
    (c_uv, s3, 'Décrire le système nerveux central et périphérique; identifier les parties du neurone', 6),
    (c_uv, s3, 'Décrire les récepteurs sensoriels (œil, oreille, langue, nez, peau)', 7),
    (c_uv, s3, 'Décrire le système musculosquelettique; distinguer les types de muscles et de mouvements', 8),
    (c_uv, s3, 'Identifier les organes reproducteurs; décrire le cycle menstruel et la spermatogenèse', 9),
    (c_uv, s3, 'Décrire les fonctions de la mitose et de la méiose; distinguer les deux processus', 10),
    (c_uv, s3, 'Décrire les étapes de la puberté; nommer les ITSS et les comportements préventifs', 11),
    (c_uv, s3, 'Identifier les parties et la fonction du système urinaire', 12);

  -- Terre et espace – Sec 3
  insert into content_items (competency_id, grade_level_id, name_fr, sort_order) values
    (c_te, s3, 'Ordonner les divisions de l''échelle des temps géologiques; associer des événements à chaque ère', 1),
    (c_te, s3, 'Expliquer la formation des strates sédimentaires et l''utilité des fossiles pour la datation', 2),
    (c_te, s3, 'Décrire les modes de formation des trois types de roches (ignées, métamorphiques, sédimentaires)', 3),
    (c_te, s3, 'Identifier des minéraux à l''aide de leurs propriétés; distinguer minéral, roche et minerai', 4),
    (c_te, s3, 'Décrire la répartition de l''eau douce et salée; définir un bassin versant', 5),
    (c_te, s3, 'Décrire la circulation océanique thermohaline et son rôle climatique', 6),
    (c_te, s3, 'Situer les couches de l''atmosphère; décrire la composition de l''air pur', 7),
    (c_te, s3, 'Décrire les facteurs géographiques et climatiques qui influencent la distribution des biomes', 8);

  -- Univers technologique – Sec 3 (lié au corps humain)
  insert into content_items (competency_id, grade_level_id, name_fr, sort_order) values
    (c_ut, s3, 'Analyser un objet technique lié au corps humain (prothèse, instrument médical, etc.)', 1),
    (c_ut, s3, 'Décrire les matériaux selon leurs propriétés (conductibilité, résistance, légèreté, biocompatibilité)', 2),
    (c_ut, s3, 'Identifier les contraintes mécaniques (traction, compression, flexion, torsion, cisaillement)', 3),
    (c_ut, s3, 'Réaliser le dossier technique d''un objet (schémas, matériaux, assemblage)', 4),
    (c_ut, s3, 'Concevoir et fabriquer un objet technique répondant à un cahier des charges simple', 5);


  -- ═══════════════════════════════════════════════════════════
  -- 4E SECONDAIRE (thème : l'environnement)
  -- ═══════════════════════════════════════════════════════════

  -- Univers matériel – Sec 4
  insert into content_items (competency_id, grade_level_id, name_fr, sort_order) values
    (c_um, s4, 'Décrire le modèle atomique de Rutherford-Bohr; représenter des atomes avec ce modèle', 1),
    (c_um, s4, 'Situer groupes et périodes dans le tableau périodique; décrire la périodicité des propriétés', 2),
    (c_um, s4, 'Appliquer les règles de nomenclature pour nommer des composés binaires', 3),
    (c_um, s4, 'Définir la mole et le nombre d''Avogadro; exprimer des quantités en moles', 4),
    (c_um, s4, 'Balancer des équations chimiques; déterminer des quantités par calculs stœchiométriques', 5),
    (c_um, s4, 'Distinguer réactions endothermique et exothermique', 6),
    (c_um, s4, 'Décrire la radioactivité; distinguer fission et fusion nucléaires', 7),
    (c_um, s4, 'Appliquer E = mcT; calculer le rendement énergétique d''un appareil', 8),
    (c_um, s4, 'Appliquer P = UI et E = Pt; déterminer courant et tension dans des circuits (lois de Kirchhoff)', 9),
    (c_um, s4, 'Décrire la dissociation électrolytique; définir ions, électrolytes et conductibilité', 10),
    (c_um, s4, 'Déterminer la concentration en g/L, pourcentage et ppm; expliquer la dilution', 11);

  -- Univers vivant – Sec 4
  insert into content_items (competency_id, grade_level_id, name_fr, sort_order) values
    (c_uv, s4, 'Définir biodiversité; expliquer les facteurs qui l''influencent', 1),
    (c_uv, s4, 'Décrire les niveaux trophiques (producteurs, consommateurs, décomposeurs) et les réseaux alimentaires', 2),
    (c_uv, s4, 'Décrire la productivité primaire et le flux de matière et d''énergie dans un écosystème', 3),
    (c_uv, s4, 'Définir contaminant, bioaccumulation et bioconcentration; décrire la bioamplification', 4),
    (c_uv, s4, 'Définir le seuil de toxicité; décrire les facteurs qui influencent la toxicité d''un contaminant', 5),
    (c_uv, s4, 'Définir un gène (segment d''ADN); décrire la structure de l''ADN (double hélice)', 6),
    (c_uv, s4, 'Définir caractère héréditaire, allèle, génotype et phénotype; expliquer dominance/récessivité', 7),
    (c_uv, s4, 'Décrire le rôle de l''ADN dans la synthèse des protéines (transcription et traduction)', 8),
    (c_uv, s4, 'Expliquer l''empreinte écologique; décrire des processus de recyclage chimique', 9);

  -- Terre et espace – Sec 4
  insert into content_items (competency_id, grade_level_id, name_fr, sort_order) values
    (c_te, s4, 'Décrire le cycle du carbone (photosynthèse, décomposition, combustion, dissolution)', 1),
    (c_te, s4, 'Décrire le cycle de l''azote (fixation, nitrification, dénitrification)', 2),
    (c_te, s4, 'Décrire le cycle du phosphore (érosion des roches, engrais, algues)', 3),
    (c_te, s4, 'Expliquer l''eutrophisation naturelle et l''accélération anthropique', 4),
    (c_te, s4, 'Distinguer glacier et banquise; décrire les conséquences de leur fonte', 5),
    (c_te, s4, 'Définir le pergélisol; expliquer les conséquences du réchauffement du pergélisol', 6),
    (c_te, s4, 'Expliquer l''épuisement des sols; définir la capacité tampon d''un sol', 7),
    (c_te, s4, 'Nommer des contaminants du sol, de l''eau et de l''air', 8),
    (c_te, s4, 'Décrire des facteurs qui influencent les populations (natalité, mortalité, immigration)', 9),
    (c_te, s4, 'Décrire des biomes terrestres et aquatiques (faune, flore, climat, type de sol)', 10);

  -- Univers technologique – Sec 4
  insert into content_items (competency_id, grade_level_id, name_fr, sort_order) values
    (c_ut, s4, 'Décrire les composantes d''un circuit électrique; schématiser un circuit (symboles normalisés)', 1),
    (c_ut, s4, 'Analyser un objet technique lié à l''environnement (éolienne, panneau solaire, filtre, etc.)', 2),
    (c_ut, s4, 'Évaluer l''impact environnemental d''un objet ou d''un procédé technique', 3),
    (c_ut, s4, 'Identifier et décrire des sources d''énergie renouvelables utilisées dans des systèmes technologiques', 4),
    (c_ut, s4, 'Concevoir une solution technologique à un problème environnemental; produire un dossier technique', 5);

end $$;
