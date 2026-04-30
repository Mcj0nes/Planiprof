-- ============================================================
-- PLANIPROF — Seed: Mathématique, secondaire (Sec 1–5)
-- Source: Progression des apprentissages au secondaire —
--   Mathématique (MEES, 2016)
-- Séquences au 2e cycle : CST (Culture, société et technique),
--   TS (Technico-sciences), SN (Sciences naturelles)
-- Run AFTER 20260420_seed_maths_primaire.sql
-- ============================================================

do $$
declare
  math_id int;
  s1 int; s2 int; s3 int; s4 int; s5 int;

  c_arith  int;
  c_alg    int;
  c_geo    int;
  c_stat   int;
  c_proba  int;

begin

  select id into math_id from subjects where slug = 'maths';

  select id into s1 from grade_levels where education_level = 'secondaire' and grade = 1;
  select id into s2 from grade_levels where education_level = 'secondaire' and grade = 2;
  select id into s3 from grade_levels where education_level = 'secondaire' and grade = 3;
  select id into s4 from grade_levels where education_level = 'secondaire' and grade = 4;
  select id into s5 from grade_levels where education_level = 'secondaire' and grade = 5;

  -- ── Nettoyage des données secondaires existantes ──────────
  delete from plan_assignments pa
    using content_items ci
    join competencies co on co.id = ci.competency_id
    where ci.id = pa.content_item_id
      and co.subject_id = math_id
      and ci.grade_level_id in (s1, s2, s3, s4, s5);

  delete from content_items ci
    using competencies co
    where ci.competency_id = co.id
      and co.subject_id = math_id
      and ci.grade_level_id in (s1, s2, s3, s4, s5);

  delete from competencies
    where subject_id = math_id
      and name_fr like '%(secondaire)%';

  -- ── Compétences / domaines ─────────────────────────────────
  insert into competencies (subject_id, name_fr, color, sort_order)
    values (math_id, 'Arithmétique et proportionnalité (secondaire)', '#6366F1', 11)
    returning id into c_arith;

  insert into competencies (subject_id, name_fr, color, sort_order)
    values (math_id, 'Algèbre et fonctions (secondaire)', '#8B5CF6', 12)
    returning id into c_alg;

  insert into competencies (subject_id, name_fr, color, sort_order)
    values (math_id, 'Géométrie et mesure (secondaire)', '#3B82F6', 13)
    returning id into c_geo;

  insert into competencies (subject_id, name_fr, color, sort_order)
    values (math_id, 'Statistique (secondaire)', '#10B981', 14)
    returning id into c_stat;

  insert into competencies (subject_id, name_fr, color, sort_order)
    values (math_id, 'Probabilités (secondaire)', '#F43F5E', 15)
    returning id into c_proba;


  -- ═══════════════════════════════════════════════════════════
  -- 1RE SECONDAIRE
  -- ═══════════════════════════════════════════════════════════

  -- Arithmétique
  insert into content_items (competency_id, grade_level_id, name_fr, sort_order) values
    (c_arith, s1, 'Lire, écrire et représenter des nombres naturels, entiers, décimaux et des fractions', 1),
    (c_arith, s1, 'Exprimer des nombres sous différentes formes (fractionnaire, décimale, pourcentage)', 2),
    (c_arith, s1, 'Effectuer les quatre opérations sur les entiers (application des règles des signes)', 3),
    (c_arith, s1, 'Effectuer les quatre opérations sur les fractions positives et les nombres décimaux', 4),
    (c_arith, s1, 'Calculer la puissance d''un nombre naturel; décomposer en facteurs premiers', 5),
    (c_arith, s1, 'Respecter la priorité des opérations dans des chaînes avec au plus deux niveaux de parenthèses', 6),
    (c_arith, s1, 'Calculer le tant pour cent et le cent pour cent; comparer des rapports et des taux', 7),
    (c_arith, s1, 'Reconnaître une situation de proportionnalité (contexte, table de valeurs, graphique)', 8);

  -- Algèbre
  insert into content_items (competency_id, grade_level_id, name_fr, sort_order) values
    (c_alg, s1, 'Décrire des régularités numériques et des suites de nombres à l''aide du langage algébrique', 1),
    (c_alg, s1, 'Décrire le rôle des composantes algébriques : inconnue, variable, coefficient, terme', 2),
    (c_alg, s1, 'Calculer la valeur numérique d''une expression algébrique', 3),
    (c_alg, s1, 'Effectuer addition, soustraction, multiplication d''expressions algébriques simples (1er degré)', 4),
    (c_alg, s1, 'Résoudre des équations du 1er degré à une inconnue (méthode de l''équilibre, opérations inverses)', 5),
    (c_alg, s1, 'Représenter et interpréter une situation à l''aide d''une table de valeurs et d''un graphique', 6);

  -- Géométrie
  insert into content_items (competency_id, grade_level_id, name_fr, sort_order) values
    (c_geo, s1, 'Identifier et classer des figures planes : triangles, quadrilatères, polygones réguliers, cercle', 1),
    (c_geo, s1, 'Calculer le périmètre, l''aire et l''apothème de figures planes', 2),
    (c_geo, s1, 'Identifier et décrire des solides (prisme, pyramide, cylindre, cône, sphère)', 3),
    (c_geo, s1, 'Calculer l''aire totale et le volume d''un prisme droit et d''un cylindre', 4),
    (c_geo, s1, 'Effectuer des réflexions, translations et rotations dans le plan', 5),
    (c_geo, s1, 'Se repérer dans le plan cartésien (4 quadrants); lire et écrire les coordonnées d''un point', 6),
    (c_geo, s1, 'Reconnaître et mesurer des angles; utiliser les propriétés des angles dans des figures', 7);

  -- Statistique
  insert into content_items (competency_id, grade_level_id, name_fr, sort_order) values
    (c_stat, s1, 'Collecter et organiser des données; calculer moyenne, médiane et mode', 1),
    (c_stat, s1, 'Construire et interpréter des diagrammes (barres, ligne brisée, circulaire)', 2);

  -- Probabilités
  insert into content_items (competency_id, grade_level_id, name_fr, sort_order) values
    (c_proba, s1, 'Décrire la probabilité d''un événement (fraction, décimal, pourcentage)', 1),
    (c_proba, s1, 'Distinguer événements certains, possibles et impossibles; construire un arbre des possibilités', 2);


  -- ═══════════════════════════════════════════════════════════
  -- 2E SECONDAIRE
  -- ═══════════════════════════════════════════════════════════

  -- Arithmétique
  insert into content_items (competency_id, grade_level_id, name_fr, sort_order) values
    (c_arith, s2, 'Effectuer les quatre opérations sur les fractions (tous les cas; numérateurs et dénominateurs quelconques)', 1),
    (c_arith, s2, 'Représenter et écrire des carrés et des racines carrées; calculer en notation exponentielle (exposant entier)', 2),
    (c_arith, s2, 'Résoudre des situations de proportionnalité (variation directe ou inverse)', 3),
    (c_arith, s2, 'Passer d''une forme d''écriture à une autre (notation fractionnaire, décimale, pourcentage)', 4);

  -- Algèbre
  insert into content_items (competency_id, grade_level_id, name_fr, sort_order) values
    (c_alg, s2, 'Manipuler des expressions algébriques : mises en évidence simples, multiplication de polynômes du 1er degré', 1),
    (c_alg, s2, 'Résoudre des équations et inéquations du 1er degré à une variable; représenter la solution', 2),
    (c_alg, s2, 'Manipuler et isoler un élément dans des relations ou formules', 3),
    (c_alg, s2, 'Représenter et analyser une situation à l''aide d''une fonction du 1er degré (table, graphique, règle)', 4),
    (c_alg, s2, 'Décrire les propriétés d''une fonction du 1er degré : domaine, image, variation, signes', 5);

  -- Géométrie
  insert into content_items (competency_id, grade_level_id, name_fr, sort_order) values
    (c_geo, s2, 'Calculer l''aire totale et le volume d''une pyramide droite, d''un cône et d''une sphère', 1),
    (c_geo, s2, 'Reconnaître et appliquer les propriétés des figures isométriques et semblables', 2),
    (c_geo, s2, 'Effectuer des homothéties (agrandissement et réduction); calculer les mesures manquantes', 3),
    (c_geo, s2, 'Utiliser les relations métriques dans un triangle rectangle (Pythagore, trigonométrie de base)', 4);

  -- Statistique
  insert into content_items (competency_id, grade_level_id, name_fr, sort_order) values
    (c_stat, s2, 'Analyser une distribution à un caractère : tableaux de distribution, mesures de tendance centrale', 1),
    (c_stat, s2, 'Lire et interpréter différents types de diagrammes; choisir la représentation appropriée', 2);

  -- Probabilités
  insert into content_items (competency_id, grade_level_id, name_fr, sort_order) values
    (c_proba, s2, 'Calculer la probabilité d''événements simples et composés (addition, multiplication)', 1),
    (c_proba, s2, 'Dénombrer à l''aide d''arbres et de tableaux de contingence', 2);


  -- ═══════════════════════════════════════════════════════════
  -- 3E SECONDAIRE
  -- ═══════════════════════════════════════════════════════════

  -- Arithmétique
  insert into content_items (competency_id, grade_level_id, name_fr, sort_order) values
    (c_arith, s3, 'Distinguer nombres rationnels et irrationnels dans l''ensemble des réels', 1),
    (c_arith, s3, 'Représenter des sous-ensembles de nombres réels en intervalle et sur la droite numérique', 2),
    (c_arith, s3, 'Définir la valeur absolue en contexte; exprimer des nombres en notation scientifique', 3),
    (c_arith, s3, 'Manipuler des expressions avec exposants entiers et fractionnaires; calculer des cubes et racines cubiques', 4);

  -- Algèbre
  insert into content_items (competency_id, grade_level_id, name_fr, sort_order) values
    (c_alg, s3, 'Factoriser des polynômes : mises en évidence simples, double, trinômes décomposables', 1),
    (c_alg, s3, 'Résoudre des équations et inéquations du 2e degré à une variable', 2),
    (c_alg, s3, 'Résoudre un système d''équations du 1er degré à deux variables (comparaison, substitution, addition)', 3),
    (c_alg, s3, 'Analyser une situation à l''aide d''une fonction du 2e degré (parabole) : propriétés et paramètres', 4),
    (c_alg, s3, 'Analyser une situation à l''aide d''une fonction racine carrée ou valeur absolue', 5),
    (c_alg, s3, 'Modéliser verbalement, algébriquement, graphiquement et tabulairement une situation', 6);

  -- Géométrie
  insert into content_items (competency_id, grade_level_id, name_fr, sort_order) values
    (c_geo, s3, 'Appliquer les relations métriques dans le triangle rectangle (sinus, cosinus, tangente)', 1),
    (c_geo, s3, 'Résoudre des problèmes de mesure à l''aide de la trigonométrie dans le triangle rectangle', 2),
    (c_geo, s3, 'Analyser des situations à l''aide de la géométrie analytique : distance, point milieu, droite', 3),
    (c_geo, s3, 'Déterminer l''équation d''une droite (ax + by + c = 0; y = ax + b)', 4);

  -- Statistique
  insert into content_items (competency_id, grade_level_id, name_fr, sort_order) values
    (c_stat, s3, 'Analyser une distribution à deux caractères; construire un nuage de points; droite de régression', 1),
    (c_stat, s3, 'Interpréter la corrélation entre deux variables; estimer par interpolation et extrapolation', 2);

  -- Probabilités
  insert into content_items (competency_id, grade_level_id, name_fr, sort_order) values
    (c_proba, s3, 'Calculer la probabilité d''événements avec et sans remise; probabilité conditionnelle (initiation)', 1),
    (c_proba, s3, 'Dénombrer à l''aide de permutations et de combinaisons (initiation)', 2);


  -- ═══════════════════════════════════════════════════════════
  -- 4E SECONDAIRE
  -- (contenu commun + précisions selon séquences CST / TS / SN)
  -- ═══════════════════════════════════════════════════════════

  -- Arithmétique
  insert into content_items (competency_id, grade_level_id, name_fr, sort_order) values
    (c_arith, s4, 'Manipuler des expressions avec radicaux et exposants rationnels (TS/SN); changement de base (TS/SN)', 1),
    (c_arith, s4, 'Résoudre des situations de proportionnalité avancées (similitude, arcs, secteurs, transformations d''unités)', 2);

  -- Algèbre
  insert into content_items (competency_id, grade_level_id, name_fr, sort_order) values
    (c_alg, s4, 'Analyser des fonctions polynomiales (1er et 2e degré), trigonométriques et exponentielles : propriétés et paramètres', 1),
    (c_alg, s4, 'Analyser une fonction rationnelle ou en escalier : domaine, image, asymptotes (TS/SN)', 2),
    (c_alg, s4, 'Résoudre des systèmes d''équations : 1er degré à deux variables; un 1er et un 2e degré (graphiquement)', 3),
    (c_alg, s4, 'Programmation linéaire : mathématiser une situation, polygone de contraintes, optimisation (CST/TS)', 4),
    (c_alg, s4, 'Rechercher la règle d''une fonction à partir de données (interpolation, modélisation)', 5);

  -- Géométrie
  insert into content_items (competency_id, grade_level_id, name_fr, sort_order) values
    (c_geo, s4, 'Démontrer la congruence et la similitude de triangles (critères ASA, SAS, SSS, AA)', 1),
    (c_geo, s4, 'Appliquer les relations métriques dans des triangles quelconques (loi des sinus, loi des cosinus — TS/SN)', 2),
    (c_geo, s4, 'Analyser des situations à l''aide des cercles et propriétés des angles (inscrit, au centre, tangente)', 3),
    (c_geo, s4, 'Travailler avec des vecteurs : direction, sens, norme, addition, soustraction, multiplication par un scalaire (TS/SN)', 4);

  -- Statistique
  insert into content_items (competency_id, grade_level_id, name_fr, sort_order) values
    (c_stat, s4, 'Analyser une distribution : étendue, variance, écart-type, percentiles et quartiles', 1),
    (c_stat, s4, 'Comparer des distributions à l''aide de boîtes à moustaches et d''indicateurs statistiques', 2);

  -- Probabilités
  insert into content_items (competency_id, grade_level_id, name_fr, sort_order) values
    (c_proba, s4, 'Calculer des probabilités à l''aide de permutations et de combinaisons', 1),
    (c_proba, s4, 'Calculer la probabilité conditionnelle; distinguer événements indépendants et dépendants', 2);


  -- ═══════════════════════════════════════════════════════════
  -- 5E SECONDAIRE
  -- (selon séquences : CST / TS / SN)
  -- ═══════════════════════════════════════════════════════════

  -- Arithmétique/Algèbre
  insert into content_items (competency_id, grade_level_id, name_fr, sort_order) values
    (c_alg, s5, 'Analyser des fonctions exponentielles et logarithmiques : propriétés, règle, représentation (CST/TS/SN)', 1),
    (c_alg, s5, 'Analyser des fonctions trigonométriques (sinus, cosinus, tangente) : période, amplitude, phase (TS/SN)', 2),
    (c_alg, s5, 'Résoudre des équations exponentielles, logarithmiques et trigonométriques (TS/SN)', 3),
    (c_alg, s5, 'Opérations sur les fonctions : composition, réciproque (TS/SN)', 4),
    (c_alg, s5, 'Mathématiques financières : intérêts simples et composés, valeur actuelle et capitalisée (CST)', 5);

  -- Géométrie
  insert into content_items (competency_id, grade_level_id, name_fr, sort_order) values
    (c_geo, s5, 'Géométrie analytique : équations de la droite, de la parabole, du cercle et de la conique (TS/SN)', 1),
    (c_geo, s5, 'Analyser des situations géométriques à l''aide de la géométrie vectorielle (TS/SN)', 2),
    (c_geo, s5, 'Démontrer des propositions géométriques (déduction formelle — SN)', 3);

  -- Statistique
  insert into content_items (competency_id, grade_level_id, name_fr, sort_order) values
    (c_stat, s5, 'Analyser une distribution à deux caractères : régression linéaire ou non linéaire, coefficient de corrélation', 1),
    (c_stat, s5, 'Prendre des décisions à l''aide des statistiques inférentielles (sondage, marge d''erreur — CST)', 2);

  -- Probabilités
  insert into content_items (competency_id, grade_level_id, name_fr, sort_order) values
    (c_proba, s5, 'Calculer des probabilités avec la loi binomiale; simuler des expériences aléatoires (TS/SN)', 1),
    (c_proba, s5, 'Analyser des situations à l''aide d''espérance mathématique et de probabilités conditionnelles', 2);

  -- Mathématiques discrètes (TS/SN)
  insert into content_items (competency_id, grade_level_id, name_fr, sort_order) values
    (c_alg, s5, 'Introduction à la théorie des graphes : sommets, arêtes, chemin, circuit, arbre de recouvrement (TS/SN)', 6),
    (c_alg, s5, 'Initiation aux matrices : opérations, résolution de systèmes (SN)', 7),
    (c_alg, s5, 'Introduction à la théorie du choix social : modes de scrutin, préférences, paradoxes (TS/SN)', 8);

end $$;
