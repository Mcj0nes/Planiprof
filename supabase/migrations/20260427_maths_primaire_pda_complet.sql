-- Seed: Mathématique primaire — PDA 2009 — contenu additionnel
-- Comble les lacunes par niveau dans les 5 domaines officiels de la PDA primaire :
-- Arithmétique, Mesure, Géométrie, Statistique, Probabilité

DO $$
DECLARE
  math_id   int;
  g1 int; g2 int; g3 int; g4 int; g5 int; g6 int;
  c_arith   int;
  c_mesure  int;
  c_geo     int;
  c_stat    int;
  c_proba   int;
BEGIN

  SELECT id INTO math_id FROM subjects WHERE slug = 'maths';

  SELECT id INTO g1 FROM grade_levels WHERE education_level = 'primaire' AND grade = 1;
  SELECT id INTO g2 FROM grade_levels WHERE education_level = 'primaire' AND grade = 2;
  SELECT id INTO g3 FROM grade_levels WHERE education_level = 'primaire' AND grade = 3;
  SELECT id INTO g4 FROM grade_levels WHERE education_level = 'primaire' AND grade = 4;
  SELECT id INTO g5 FROM grade_levels WHERE education_level = 'primaire' AND grade = 5;
  SELECT id INTO g6 FROM grade_levels WHERE education_level = 'primaire' AND grade = 6;

  SELECT id INTO c_arith  FROM competencies WHERE subject_id = math_id AND name_fr = 'Arithmétique — Sens du nombre et des opérations';
  SELECT id INTO c_mesure FROM competencies WHERE subject_id = math_id AND name_fr = 'Mesure';
  SELECT id INTO c_geo    FROM competencies WHERE subject_id = math_id AND name_fr = 'Géométrie';
  SELECT id INTO c_stat   FROM competencies WHERE subject_id = math_id AND name_fr = 'Statistique';
  SELECT id INTO c_proba  FROM competencies WHERE subject_id = math_id AND name_fr = 'Probabilité';

  -- ════════════════════════════════════════════════════════════
  -- 1RE ANNÉE
  -- ════════════════════════════════════════════════════════════

  INSERT INTO content_items (competency_id, grade_level_id, name_fr, sort_order) VALUES
    (c_arith, g1, 'Lire et écrire les nombres naturels jusqu''à 100', 10),
    (c_arith, g1, 'Compter par bonds de 2, de 5 et de 10', 11),
    (c_arith, g1, 'Ordonner des nombres jusqu''à 100 sur une droite numérique', 12),
    (c_arith, g1, 'Stratégies de calcul mental : compter à partir d''un nombre, compléter à 10', 13),
    (c_arith, g1, 'Résoudre des situations-problèmes d''addition et de soustraction en contexte', 14),
    (c_arith, g1, 'Trouver l''inconnue dans une égalité simple (3 + ? = 7)', 15);

  INSERT INTO content_items (competency_id, grade_level_id, name_fr, sort_order) VALUES
    (c_mesure, g1, 'Comparer des durées et les ordonner (avant, pendant, après)', 10),
    (c_mesure, g1, 'Identifier les instruments de mesure appropriés selon l''attribut', 11),
    (c_mesure, g1, 'Notion de périmètre : le contour d''une figure', 12);

  INSERT INTO content_items (competency_id, grade_level_id, name_fr, sort_order) VALUES
    (c_geo, g1, 'Décrire les solides : faces, arêtes et sommets', 10),
    (c_geo, g1, 'Reconnaître des figures planes dans l''environnement', 11),
    (c_geo, g1, 'Identifier des droites : horizontales, verticales et obliques', 12),
    (c_geo, g1, 'Réaliser des frises et des dallages simples', 13);

  -- ════════════════════════════════════════════════════════════
  -- 2E ANNÉE
  -- ════════════════════════════════════════════════════════════

  INSERT INTO content_items (competency_id, grade_level_id, name_fr, sort_order) VALUES
    (c_arith, g2, 'Lire, écrire et représenter les nombres naturels jusqu''à 1 000', 10),
    (c_arith, g2, 'Valeur de position : centaines, dizaines, unités', 11),
    (c_arith, g2, 'Addition et soustraction jusqu''à 999', 12),
    (c_arith, g2, 'Sens de la multiplication : groupements égaux et tableaux rectangulaires', 13),
    (c_arith, g2, 'Sens de la division : partage en parties égales et contenance', 14),
    (c_arith, g2, 'Tables de multiplication de 2 et de 5', 15),
    (c_arith, g2, 'Stratégies de calcul mental : doubler, compléter à la dizaine', 16),
    (c_arith, g2, 'Résoudre des situations-problèmes à une étape avec les 4 opérations', 17);

  INSERT INTO content_items (competency_id, grade_level_id, name_fr, sort_order) VALUES
    (c_mesure, g2, 'Relation entre les unités de longueur : dm, cm, m', 10),
    (c_mesure, g2, 'Calculer le périmètre de polygones simples', 11),
    (c_mesure, g2, 'Lire la température sur un thermomètre', 12);

  INSERT INTO content_items (competency_id, grade_level_id, name_fr, sort_order) VALUES
    (c_geo, g2, 'Droites parallèles et droites perpendiculaires dans l''environnement', 10),
    (c_geo, g2, 'L''angle droit : reconnaître et vérifier à l''aide d''une équerre', 11),
    (c_geo, g2, 'Classifier les quadrilatères : carré, rectangle, losange, trapèze, parallélogramme', 12),
    (c_geo, g2, 'Identifier les caractéristiques des polygones (côtés, angles)', 13);

  -- ════════════════════════════════════════════════════════════
  -- 3E ANNÉE
  -- ════════════════════════════════════════════════════════════

  INSERT INTO content_items (competency_id, grade_level_id, name_fr, sort_order) VALUES
    (c_arith, g3, 'Lire, écrire et représenter les nombres naturels jusqu''à 10 000', 10),
    (c_arith, g3, 'Valeur de position : milliers, centaines, dizaines, unités', 11),
    (c_arith, g3, 'Division à 2 chiffres au quotient (avec et sans reste)', 12),
    (c_arith, g3, 'Comparer des fractions de même dénominateur', 13),
    (c_arith, g3, 'Comparer des fractions de même numérateur', 14),
    (c_arith, g3, 'Stratégies de multiplication mentale : distributivité, doublement', 15),
    (c_arith, g3, 'Résoudre des situations-problèmes à deux étapes', 16);

  INSERT INTO content_items (competency_id, grade_level_id, name_fr, sort_order) VALUES
    (c_mesure, g3, 'Relation entre les unités : m, dm, cm, mm', 10),
    (c_mesure, g3, 'Durée : heures, minutes, secondes — conversion et calcul', 11),
    (c_mesure, g3, 'Température : lire un thermomètre en degrés Celsius', 12),
    (c_mesure, g3, 'Calculer l''aire en dénombrant des unités carrées', 13);

  INSERT INTO content_items (competency_id, grade_level_id, name_fr, sort_order) VALUES
    (c_geo, g3, 'Propriétés des quadrilatères : côtés parallèles, angles droits', 10),
    (c_geo, g3, 'Distinguer les triangles selon leurs angles (acutangle, obtusangle, rectangle)', 11),
    (c_geo, g3, 'Reproduire des figures sur papier quadrillé', 12),
    (c_geo, g3, 'Identifier des diagonales dans un polygone', 13);

  -- ════════════════════════════════════════════════════════════
  -- 4E ANNÉE
  -- ════════════════════════════════════════════════════════════

  INSERT INTO content_items (competency_id, grade_level_id, name_fr, sort_order) VALUES
    (c_arith, g4, 'Lire, écrire et représenter les nombres naturels jusqu''à 100 000', 10),
    (c_arith, g4, 'Multiplication de nombres à 3 chiffres par un nombre à 2 chiffres', 11),
    (c_arith, g4, 'Division : diviseur à 2 chiffres, quotient à 2 chiffres', 12),
    (c_arith, g4, 'Additionner et soustraire des fractions de même dénominateur', 13),
    (c_arith, g4, 'Nombres premiers et nombres composés', 14),
    (c_arith, g4, 'Critères de divisibilité par 2, 5 et 10', 15),
    (c_arith, g4, 'Multiplication et division de nombres décimaux par 10, 100, 1 000', 16);

  INSERT INTO content_items (competency_id, grade_level_id, name_fr, sort_order) VALUES
    (c_mesure, g4, 'Conversions de longueur : km, m, dm, cm, mm', 10),
    (c_mesure, g4, 'Aire du parallélogramme et du triangle (avec formule)', 11),
    (c_mesure, g4, 'Calculer des durées : opérations sur les heures et les minutes', 12);

  INSERT INTO content_items (competency_id, grade_level_id, name_fr, sort_order) VALUES
    (c_geo, g4, 'Identifier les axes de réflexion d''une figure', 10),
    (c_geo, g4, 'Somme des angles d''un triangle (180°) et d''un quadrilatère (360°)', 11),
    (c_geo, g4, 'Développement (patron) des prismes et pyramides', 12),
    (c_geo, g4, 'Identifier les propriétés des polyèdres : faces, arêtes, sommets', 13);

  INSERT INTO content_items (competency_id, grade_level_id, name_fr, sort_order) VALUES
    (c_proba, g4, 'Distinguer événements simples et composés', 3),
    (c_proba, g4, 'Probabilité d''événements complémentaires (P(A) + P(non-A) = 1)', 4);

  -- ════════════════════════════════════════════════════════════
  -- 5E ANNÉE
  -- ════════════════════════════════════════════════════════════

  INSERT INTO content_items (competency_id, grade_level_id, name_fr, sort_order) VALUES
    (c_arith, g5, 'Lire, écrire et représenter les nombres naturels jusqu''à 1 000 000', 10),
    (c_arith, g5, 'Critères de divisibilité par 3, 4, 6, 8 et 9', 11),
    (c_arith, g5, 'Additionner et soustraire des fractions de dénominateurs différents', 12),
    (c_arith, g5, 'Multiplication et division de nombres décimaux', 13),
    (c_arith, g5, 'Sens des pourcentages : passer de fraction à pourcentage et vice-versa', 14),
    (c_arith, g5, 'Résoudre des situations-problèmes à plusieurs étapes', 15);

  INSERT INTO content_items (competency_id, grade_level_id, name_fr, sort_order) VALUES
    (c_mesure, g5, 'Relation entre unités de volume et de capacité : 1 dm³ = 1 L', 10),
    (c_mesure, g5, 'Surface latérale et surface totale d''un prisme droit', 11),
    (c_mesure, g5, 'Estimation de mesures dans des contextes réels', 12);

  INSERT INTO content_items (competency_id, grade_level_id, name_fr, sort_order) VALUES
    (c_geo, g5, 'Développement (patron) de solides variés', 10),
    (c_geo, g5, 'Agrandissement et réduction de figures à l''aide d''un rapport', 11);

  INSERT INTO content_items (competency_id, grade_level_id, name_fr, sort_order) VALUES
    (c_stat, g5, 'Calculer le mode et l''étendue d''une distribution', 3),
    (c_stat, g5, 'Choisir le type de diagramme approprié selon la situation', 4),
    (c_stat, g5, 'Lire et critiquer des représentations statistiques (biais, échelle trompeuse)', 5);

  INSERT INTO content_items (competency_id, grade_level_id, name_fr, sort_order) VALUES
    (c_proba, g5, 'Énumérer les résultats possibles d''une expérience à l''aide d''un tableau ou d''un arbre', 3),
    (c_proba, g5, 'Distinguer probabilité théorique et fréquence expérimentale', 4);

  -- ════════════════════════════════════════════════════════════
  -- 6E ANNÉE
  -- ════════════════════════════════════════════════════════════

  INSERT INTO content_items (competency_id, grade_level_id, name_fr, sort_order) VALUES
    (c_arith, g6, 'Lire et écrire des nombres naturels au-delà de 1 000 000', 10),
    (c_arith, g6, 'Comparer et ordonner des nombres relatifs (entiers et décimaux)', 11),
    (c_arith, g6, 'Multiplication et division de fractions : sens et procédures', 12),
    (c_arith, g6, 'Calcul de pourcentages dans des contextes variés (taxes, rabais)', 13),
    (c_arith, g6, 'Taux et rapports : sens et résolution de problèmes', 14),
    (c_arith, g6, 'Résoudre des situations-problèmes impliquant la proportionnalité', 15);

  INSERT INTO content_items (competency_id, grade_level_id, name_fr, sort_order) VALUES
    (c_mesure, g6, 'Circonférence et aire du cercle (π)', 10),
    (c_mesure, g6, 'Volume de la pyramide (notion)', 11),
    (c_mesure, g6, 'Conversions d''unités de superficie (cm², dm², m²)', 12);

  INSERT INTO content_items (competency_id, grade_level_id, name_fr, sort_order) VALUES
    (c_geo, g6, 'Propriétés des pyramides et des prismes : comparaison systématique', 10),
    (c_geo, g6, 'Construire des figures composées et calculer leur aire et périmètre', 11),
    (c_geo, g6, 'Repérer des points dans les 4 quadrants du plan cartésien', 12);

  INSERT INTO content_items (competency_id, grade_level_id, name_fr, sort_order) VALUES
    (c_stat, g6, 'Calculer et interpréter les mesures de tendance centrale (moyenne, médiane, mode)', 10),
    (c_stat, g6, 'Construire et interpréter des diagrammes à tiges et feuilles', 11);

  INSERT INTO content_items (competency_id, grade_level_id, name_fr, sort_order) VALUES
    (c_proba, g6, 'Dénombrer les résultats d''expériences à deux étapes', 3),
    (c_proba, g6, 'Simulation et comparaison : probabilité théorique vs fréquence observée', 4);

END $$;
