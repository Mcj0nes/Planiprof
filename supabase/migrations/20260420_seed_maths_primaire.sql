-- ============================================================
-- PLANIPROF — Seed: Mathématique, primaire (grades 1–6)
-- Based on the Quebec Progression des apprentissages (PDA)
-- Run AFTER 20260420_initial_schema.sql
-- ============================================================

do $$
declare
  math_id   int;
  g1 int; g2 int; g3 int; g4 int; g5 int; g6 int;

  -- competency ids
  c_arith   int;
  c_mesure  int;
  c_geo     int;
  c_stat    int;
  c_proba   int;

begin

  -- ── Resolve foreign keys ──────────────────────────────────
  select id into math_id from subjects where slug = 'maths';

  select id into g1 from grade_levels where education_level = 'primaire' and grade = 1;
  select id into g2 from grade_levels where education_level = 'primaire' and grade = 2;
  select id into g3 from grade_levels where education_level = 'primaire' and grade = 3;
  select id into g4 from grade_levels where education_level = 'primaire' and grade = 4;
  select id into g5 from grade_levels where education_level = 'primaire' and grade = 5;
  select id into g6 from grade_levels where education_level = 'primaire' and grade = 6;


  -- ── Competencies ─────────────────────────────────────────
  insert into competencies (subject_id, name_fr, sort_order) values
    (math_id, 'Résoudre une situation-problème', 1)
    returning id into c_arith;  -- reused below as a var; we insert real comp ids next

  -- Re-query properly
  select id into c_arith from competencies
    where subject_id = math_id and name_fr = 'Résoudre une situation-problème';

  insert into competencies (subject_id, name_fr, sort_order) values
    (math_id, 'Raisonner à l''aide de concepts et de processus mathématiques', 2),
    (math_id, 'Communiquer à l''aide du langage mathématique', 3);

  -- Domain "competencies" used to group content (not official competencies, but
  -- we model content domains as competencies for easier grouping in the UI)
  insert into competencies (subject_id, name_fr, color, sort_order) values
    (math_id, 'Arithmétique — Sens du nombre et des opérations', '#6366F1', 10)
    returning id into c_arith;

  insert into competencies (subject_id, name_fr, color, sort_order) values
    (math_id, 'Mesure', '#F97316', 20)
    returning id into c_mesure;

  insert into competencies (subject_id, name_fr, color, sort_order) values
    (math_id, 'Géométrie', '#3B82F6', 30)
    returning id into c_geo;

  insert into competencies (subject_id, name_fr, color, sort_order) values
    (math_id, 'Statistique', '#10B981', 40)
    returning id into c_stat;

  insert into competencies (subject_id, name_fr, color, sort_order) values
    (math_id, 'Probabilité', '#F43F5E', 50)
    returning id into c_proba;


  -- ═══════════════════════════════════════════════════════════
  -- 1RE ANNÉE
  -- ═══════════════════════════════════════════════════════════

  -- Arithmétique
  insert into content_items (competency_id, grade_level_id, name_fr, sort_order) values
    (c_arith, g1, 'Dénombrer, lire et écrire les nombres naturels jusqu''à 30', 1),
    (c_arith, g1, 'Comparer et ordonner des nombres naturels (jusqu''à 30)', 2),
    (c_arith, g1, 'Identifier des régularités et compléter des suites de nombres', 3),
    (c_arith, g1, 'Décomposer des nombres de différentes façons', 4),
    (c_arith, g1, 'Sens de l''addition et de la soustraction (jusqu''à 10)', 5),
    (c_arith, g1, 'Calculer des additions et soustractions jusqu''à 20', 6),
    (c_arith, g1, 'Reconnaître le partage en deux parties égales (moitiés)', 7);

  -- Mesure
  insert into content_items (competency_id, grade_level_id, name_fr, sort_order) values
    (c_mesure, g1, 'Comparer et ordonner des objets selon leur longueur', 1),
    (c_mesure, g1, 'Comparer des objets selon leur masse et leur capacité', 2),
    (c_mesure, g1, 'Notions de temps : jours, semaines, mois, saisons', 3);

  -- Géométrie
  insert into content_items (competency_id, grade_level_id, name_fr, sort_order) values
    (c_geo, g1, 'Identifier et décrire des solides (cube, sphère, cylindre, cône, prisme, pyramide)', 1),
    (c_geo, g1, 'Identifier et décrire des figures planes (carré, rectangle, triangle, cercle)', 2),
    (c_geo, g1, 'Se repérer dans l''espace (devant/derrière, gauche/droite, dessus/dessous)', 3);

  -- Statistique
  insert into content_items (competency_id, grade_level_id, name_fr, sort_order) values
    (c_stat, g1, 'Collecter des données et les organiser dans un tableau simple', 1),
    (c_stat, g1, 'Lire et interpréter un tableau simple ou un diagramme à images', 2);


  -- ═══════════════════════════════════════════════════════════
  -- 2E ANNÉE
  -- ═══════════════════════════════════════════════════════════

  insert into content_items (competency_id, grade_level_id, name_fr, sort_order) values
    (c_arith, g2, 'Dénombrer, lire et écrire les nombres naturels jusqu''à 100', 1),
    (c_arith, g2, 'Valeur de position : unités et dizaines', 2),
    (c_arith, g2, 'Nombres pairs et impairs', 3),
    (c_arith, g2, 'Comparer et ordonner des nombres jusqu''à 100', 4),
    (c_arith, g2, 'Addition et soustraction jusqu''à 99 (avec et sans retenue)', 5),
    (c_arith, g2, 'Introduction à la multiplication par groupements égaux', 6),
    (c_arith, g2, 'Fractions simples : demis et quarts (parties d''un tout)', 7);

  insert into content_items (competency_id, grade_level_id, name_fr, sort_order) values
    (c_mesure, g2, 'Mesurer des longueurs avec des unités non conventionnelles', 1),
    (c_mesure, g2, 'Introduction aux unités conventionnelles : cm et m', 2),
    (c_mesure, g2, 'Lire l''heure : heures et demies sur une horloge', 3),
    (c_mesure, g2, 'Utiliser le calendrier (jours, semaines, mois)', 4);

  insert into content_items (competency_id, grade_level_id, name_fr, sort_order) values
    (c_geo, g2, 'Identifier et décrire des frises et des dallages', 1),
    (c_geo, g2, 'Reconnaître un axe de réflexion (symétrie)', 2),
    (c_geo, g2, 'Décrire la position d''un objet sur un plan quadrillé', 3);

  insert into content_items (competency_id, grade_level_id, name_fr, sort_order) values
    (c_stat, g2, 'Collecter et organiser des données dans un tableau à double entrée', 1),
    (c_stat, g2, 'Construire et lire un diagramme à bandes', 2);


  -- ═══════════════════════════════════════════════════════════
  -- 3E ANNÉE
  -- ═══════════════════════════════════════════════════════════

  insert into content_items (competency_id, grade_level_id, name_fr, sort_order) values
    (c_arith, g3, 'Lire, écrire et représenter les nombres naturels jusqu''à 1 000', 1),
    (c_arith, g3, 'Valeur de position : centaines, dizaines, unités', 2),
    (c_arith, g3, 'Tables de multiplication (1 à 10) et tables de division correspondantes', 3),
    (c_arith, g3, 'Addition et soustraction de nombres à 3 chiffres', 4),
    (c_arith, g3, 'Multiplication d''un nombre à 2 chiffres par un nombre à 1 chiffre', 5),
    (c_arith, g3, 'Fractions simples : demis, tiers, quarts, cinquièmes, sixièmes, dixièmes', 6),
    (c_arith, g3, 'Introduction aux nombres décimaux : dixièmes', 7);

  insert into content_items (competency_id, grade_level_id, name_fr, sort_order) values
    (c_mesure, g3, 'Calculer le périmètre de figures planes', 1),
    (c_mesure, g3, 'Comparer des aires (sans formule)', 2),
    (c_mesure, g3, 'Masses : gramme (g) et kilogramme (kg)', 3),
    (c_mesure, g3, 'Capacités : millilitre (mL) et litre (L)', 4),
    (c_mesure, g3, 'Lire l''heure au quart d''heure près', 5);

  insert into content_items (competency_id, grade_level_id, name_fr, sort_order) values
    (c_geo, g3, 'Identifier et classer des quadrilatères (carré, rectangle, losange, trapèze)', 1),
    (c_geo, g3, 'Reconnaître l''angle droit', 2),
    (c_geo, g3, 'Effectuer des réflexions (symétrie) dans le plan', 3);

  insert into content_items (competency_id, grade_level_id, name_fr, sort_order) values
    (c_stat, g3, 'Construire et interpréter des diagrammes à pictogrammes', 1),
    (c_stat, g3, 'Lire et interpréter des tableaux à double entrée', 2);

  insert into content_items (competency_id, grade_level_id, name_fr, sort_order) values
    (c_proba, g3, 'Identifier des événements certains, possibles et impossibles', 1);


  -- ═══════════════════════════════════════════════════════════
  -- 4E ANNÉE
  -- ═══════════════════════════════════════════════════════════

  insert into content_items (competency_id, grade_level_id, name_fr, sort_order) values
    (c_arith, g4, 'Lire, écrire et représenter les nombres naturels jusqu''à 10 000', 1),
    (c_arith, g4, 'Estimation de résultats d''opérations', 2),
    (c_arith, g4, 'Multiplication de nombres à 2 chiffres', 3),
    (c_arith, g4, 'Division avec reste (diviseur à 1 chiffre)', 4),
    (c_arith, g4, 'Fractions équivalentes', 5),
    (c_arith, g4, 'Comparer et ordonner des fractions', 6),
    (c_arith, g4, 'Nombres décimaux : dixièmes et centièmes', 7),
    (c_arith, g4, 'Addition et soustraction de nombres décimaux', 8);

  insert into content_items (competency_id, grade_level_id, name_fr, sort_order) values
    (c_mesure, g4, 'Calculer l''aire de rectangles et de triangles (cm², m²)', 1),
    (c_mesure, g4, 'Volumes et capacités : litre, millilitre', 2),
    (c_mesure, g4, 'Identifier et mesurer des angles (aigu, droit, obtus)', 3),
    (c_mesure, g4, 'Lire l''heure à la minute près', 4);

  insert into content_items (competency_id, grade_level_id, name_fr, sort_order) values
    (c_geo, g4, 'Identifier et classer des triangles (scalène, isocèle, équilatéral)', 1),
    (c_geo, g4, 'Construire des figures symétriques (réflexion)', 2),
    (c_geo, g4, 'Repérer des points dans le plan cartésien (1er quadrant)', 3);

  insert into content_items (competency_id, grade_level_id, name_fr, sort_order) values
    (c_stat, g4, 'Calculer la moyenne arithmétique d''une série de données', 1),
    (c_stat, g4, 'Construire et interpréter des diagrammes à bandes et à ligne brisée', 2);

  insert into content_items (competency_id, grade_level_id, name_fr, sort_order) values
    (c_proba, g4, 'Décrire la probabilité d''un événement (vocabulaire et fractions)', 1),
    (c_proba, g4, 'Réaliser une expérience aléatoire simple et noter les résultats', 2);


  -- ═══════════════════════════════════════════════════════════
  -- 5E ANNÉE
  -- ═══════════════════════════════════════════════════════════

  insert into content_items (competency_id, grade_level_id, name_fr, sort_order) values
    (c_arith, g5, 'Lire, écrire et représenter les nombres naturels jusqu''à 100 000', 1),
    (c_arith, g5, 'Introduction aux nombres entiers négatifs', 2),
    (c_arith, g5, 'Multiplication de nombres à plusieurs chiffres', 3),
    (c_arith, g5, 'Division à 2 chiffres au diviseur', 4),
    (c_arith, g5, 'Fractions impropres et nombres mixtes', 5),
    (c_arith, g5, 'Nombres décimaux : millièmes', 6),
    (c_arith, g5, 'Introduction aux pourcentages', 7),
    (c_arith, g5, 'Priorité des opérations (sans exposants)', 8);

  insert into content_items (competency_id, grade_level_id, name_fr, sort_order) values
    (c_mesure, g5, 'Calculer le périmètre et l''aire de polygones variés', 1),
    (c_mesure, g5, 'Introduction au volume de prismes (cm³, m³)', 2),
    (c_mesure, g5, 'Mesurer des angles avec un rapporteur', 3),
    (c_mesure, g5, 'Conversions d''unités de mesure (longueur, masse, capacité)', 4);

  insert into content_items (competency_id, grade_level_id, name_fr, sort_order) values
    (c_geo, g5, 'Identifier les éléments d''un cercle (rayon, diamètre, circonférence)', 1),
    (c_geo, g5, 'Effectuer des translations dans le plan', 2),
    (c_geo, g5, 'Effectuer des rotations dans le plan', 3),
    (c_geo, g5, 'Construire des figures isométriques', 4);

  insert into content_items (competency_id, grade_level_id, name_fr, sort_order) values
    (c_stat, g5, 'Construire et interpréter des diagrammes circulaires', 1),
    (c_stat, g5, 'Interpréter des données présentées sous différentes formes', 2);

  insert into content_items (competency_id, grade_level_id, name_fr, sort_order) values
    (c_proba, g5, 'Comparer la probabilité théorique et expérimentale', 1),
    (c_proba, g5, 'Dénombrer les résultats possibles d''une expérience', 2);


  -- ═══════════════════════════════════════════════════════════
  -- 6E ANNÉE
  -- ═══════════════════════════════════════════════════════════

  insert into content_items (competency_id, grade_level_id, name_fr, sort_order) values
    (c_arith, g6, 'Lire, écrire et représenter les nombres naturels jusqu''à 1 000 000', 1),
    (c_arith, g6, 'Opérations sur les nombres entiers négatifs (addition, soustraction)', 2),
    (c_arith, g6, 'Addition et soustraction de fractions (dénominateurs différents)', 3),
    (c_arith, g6, 'Multiplication et division de fractions (introduction)', 4),
    (c_arith, g6, 'Opérations sur les nombres décimaux', 5),
    (c_arith, g6, 'Pourcentages : calcul d''un pourcentage d''une quantité', 6),
    (c_arith, g6, 'Introduction à la proportionnalité et aux rapports', 7),
    (c_arith, g6, 'Priorité des opérations avec parenthèses et exposants', 8);

  insert into content_items (competency_id, grade_level_id, name_fr, sort_order) values
    (c_mesure, g6, 'Calculer l''aire de figures composées', 1),
    (c_mesure, g6, 'Calculer le volume et la capacité de prismes droits', 2),
    (c_mesure, g6, 'Relation entre volume et capacité (1 L = 1 dm³)', 3),
    (c_mesure, g6, 'Calculer la somme des angles d''un polygone', 4);

  insert into content_items (competency_id, grade_level_id, name_fr, sort_order) values
    (c_geo, g6, 'Effectuer une homothétie (agrandissement et réduction)', 1),
    (c_geo, g6, 'Repérer des points dans le plan cartésien (4 quadrants)', 2),
    (c_geo, g6, 'Identifier les propriétés des polygones réguliers', 3),
    (c_geo, g6, 'Construire et interpréter des figures à l''aide de transformations', 4);

  insert into content_items (competency_id, grade_level_id, name_fr, sort_order) values
    (c_stat, g6, 'Choisir le type de diagramme approprié selon les données', 1),
    (c_stat, g6, 'Interpréter et critiquer des représentations statistiques', 2),
    (c_stat, g6, 'Calculer la médiane et le mode d''une distribution', 3);

  insert into content_items (competency_id, grade_level_id, name_fr, sort_order) values
    (c_proba, g6, 'Calculer la probabilité théorique d''événements simples et composés', 1),
    (c_proba, g6, 'Construire un arbre des possibilités', 2);

end $$;
