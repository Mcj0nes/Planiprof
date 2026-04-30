-- Seed: Causeries mathématiques — 2e cycle (3e-4e année)
DO $$
DECLARE
  math_id integer;
BEGIN
  SELECT id INTO math_id FROM subjects WHERE name_fr ILIKE '%math%' ORDER BY id LIMIT 1;

  INSERT INTO activity_templates (title, description, subject_id, type_tag, duration_min, grade_level_tag, category) VALUES

  -- ── 1. Nombres ────────────────────────────────────────────────
  ('La valeur de position jusqu''à 100 000',
   'Afficher 47 315. Quelle est la valeur du chiffre 7? Et du 3?',
   math_id, 'Number Talk', 15, '3e-4e année', 'Causerie — Nombres'),

  ('Décomposition de nombres',
   '5 200 = 5 000 + 200 et 5 200 = 4 000 + 1 200. Ces deux décompositions représentent-elles le même nombre?',
   math_id, 'Pareil mais différent', 15, '3e-4e année', 'Causerie — Nombres'),

  ('Comparaison de nombres',
   'Afficher : 32 450, 34 250, 32 540, 23 450. Lequel ne va pas avec les autres?',
   math_id, 'QELI', 15, '3e-4e année', 'Causerie — Nombres'),

  ('Estimation de quantités',
   'Pot rempli de billes. Un groupe de 25 billes est visible comme référence. Combien dans le pot?',
   math_id, 'Estimation', 15, '3e-4e année', 'Causerie — Nombres'),

  ('Nombres pairs et impairs',
   'Afficher : 24, 36, 15, 48. Lequel ne fait pas partie du groupe? Trouve deux arguments.',
   math_id, 'QELI', 15, '3e-4e année', 'Causerie — Nombres'),

  ('Situer un nombre sur la droite',
   'Droite de 0 à 10 000 avec repères 0, 5 000 et 10 000. Point mystère aux 3/4.',
   math_id, 'Image ouverte', 15, '3e-4e année', 'Causerie — Nombres'),

  ('Arrondir à la centaine et au millier',
   'Afficher 6 738. Arrondir à la centaine, puis au millier. Explique ta règle.',
   math_id, 'Number Talk', 15, '3e-4e année', 'Causerie — Nombres'),

  -- ── 2. Fractions ──────────────────────────────────────────────
  ('Reconnaître une fraction',
   'Pizza coupée en 8 pointes égales, 2 mangées. Quelle fraction a été mangée?',
   math_id, 'Image ouverte', 15, '3e-4e année', 'Causerie — Fractions'),

  ('Fractions équivalentes simples',
   'Deux rectangles : 1/2 coloré vs 2/4 coloré. Même quantité? Comment le sais-tu?',
   math_id, 'Pareil mais différent', 15, '3e-4e année', 'Causerie — Fractions'),

  ('Comparer des fractions — même dénominateur',
   'Afficher : 2/6, 4/6, 5/6, 4/8. Laquelle n''est pas comme les autres? Pourquoi?',
   math_id, 'QELI', 15, '3e-4e année', 'Causerie — Fractions'),

  ('Fraction d''un ensemble',
   '20 crayons : 12 rouges, 8 bleus. Quelle fraction est rouge? Bleue? Simplifie.',
   math_id, 'Estimation', 15, '3e-4e année', 'Causerie — Fractions'),

  ('Fractions sur la droite numérique',
   'Droite de 0 à 1, point mystère au milieu. Quelle fraction est ici? Et chaque quart?',
   math_id, 'Image ouverte', 15, '3e-4e année', 'Causerie — Fractions'),

  ('Splat — fractions cachées',
   'Rectangle divisé en 6 parties, 2 colorées visibles. Splat cache le reste. Quelle fraction est cachée?',
   math_id, 'Splat', 15, '3e-4e année', 'Causerie — Fractions'),

  ('Associer fractions et images',
   '3/4 d''un cercle coloré et 3/4 d''un rectangle coloré. Même fraction? Pareil et différent?',
   math_id, 'Pareil mais différent', 15, '3e-4e année', 'Causerie — Fractions'),

  -- ── 3. Opérations ─────────────────────────────────────────────
  ('Addition mentale — 198 + 45',
   '198 + 45, sans papier. Comment calcules-tu de tête? Partage ta stratégie.',
   math_id, 'Number Talk', 15, '3e-4e année', 'Causerie — Opérations'),

  ('Soustraction par compensation — 503 − 298',
   '503 − 298, sans crayon. Comment calcules-tu mentalement? Deux stratégies.',
   math_id, 'Number Talk', 15, '3e-4e année', 'Causerie — Opérations'),

  ('Multiplication et distributivité — 4 × 13',
   '4 × 13, sans algorithme. Comment calcules-tu? Montre ta démarche.',
   math_id, 'Number Talk', 15, '3e-4e année', 'Causerie — Opérations'),

  ('Tables de multiplication — l''intrus',
   'Afficher : 12, 18, 24, 25. Lequel est l''intrus? Deux arguments.',
   math_id, 'QELI', 15, '3e-4e année', 'Causerie — Opérations'),

  ('Division — partage et contenance',
   '24 biscuits ÷ 6 amis vs 24 biscuits en sacs de 6. Même opération? Pareil et différent?',
   math_id, 'Pareil mais différent', 15, '3e-4e année', 'Causerie — Opérations'),

  ('Estimation du produit — 8 × 47',
   '8 × 47, estimer avant de calculer. Estime sans calculer. Comment procèdes-tu?',
   math_id, 'Estimation', 15, '3e-4e année', 'Causerie — Opérations'),

  ('Splat — opérations cachées',
   '4 groupes égaux, total 36. Splat cache le nombre par groupe. Combien par groupe?',
   math_id, 'Splat', 15, '3e-4e année', 'Causerie — Opérations'),

  ('Commutativité de la multiplication',
   '3 × 7 et 7 × 3, avec tableaux visuels. Même résultat? Pareil et différent?',
   math_id, 'Pareil mais différent', 15, '3e-4e année', 'Causerie — Opérations'),

  -- ── 4. Géométrie ──────────────────────────────────────────────
  ('Classification des triangles',
   '4 triangles : équilatéral, isocèle, scalène, rectangle. Lequel est l''intrus? Deux réponses possibles.',
   math_id, 'QELI', 15, '3e-4e année', 'Causerie — Géométrie'),

  ('Quadrilatères — l''intrus',
   'Carré, rectangle, losange, pentagone. Laquelle n''est pas un quadrilatère?',
   math_id, 'QELI', 15, '3e-4e année', 'Causerie — Géométrie'),

  ('Parallèles et perpendiculaires',
   'Photo d''une fenêtre à carreaux. Identifie parallèles et perpendiculaires.',
   math_id, 'Image ouverte', 15, '3e-4e année', 'Causerie — Géométrie'),

  ('La symétrie',
   'Papillon avec axe de symétrie vertical en pointillé. Symétrique? Comment vérifier?',
   math_id, 'Image ouverte', 15, '3e-4e année', 'Causerie — Géométrie'),

  ('Figures planes vs solides',
   'Un carré et un cube côte à côte. Qu''est-ce qui est pareil? Différent?',
   math_id, 'Pareil mais différent', 15, '3e-4e année', 'Causerie — Géométrie'),

  ('Compléter une figure symétrique',
   'Quadrillage avec moitié gauche d''un dessin et axe de symétrie vertical. Complète le dessin.',
   math_id, 'Image ouverte', 15, '3e-4e année', 'Causerie — Géométrie'),

  ('Solides et empreintes',
   '4 solides (cube, cylindre, cône, prisme). Splat cache l''empreinte circulaire. Quel solide?',
   math_id, 'Splat', 15, '3e-4e année', 'Causerie — Géométrie'),

  -- ── 5. Mesure ─────────────────────────────────────────────────
  ('Estimer des longueurs',
   'Bureau de classe, cahier de 30 cm visible comme référence. Longueur du bureau? De la classe?',
   math_id, 'Estimation', 15, '3e-4e année', 'Causerie — Mesure'),

  ('Le périmètre',
   'Rectangle 8 cm × 5 cm. Quel est le périmètre? Comment calcules-tu mentalement?',
   math_id, 'Number Talk', 15, '3e-4e année', 'Causerie — Mesure'),

  ('Périmètre — même ou différent?',
   'Carré 4 × 4 et rectangle 2 × 6 sur quadrillage. Même périmètre? Même aire?',
   math_id, 'Pareil mais différent', 15, '3e-4e année', 'Causerie — Mesure'),

  ('Mesurer le temps',
   'Horloge à 10 h 45. Combien de temps jusqu''à 12 h 15?',
   math_id, 'Estimation', 15, '3e-4e année', 'Causerie — Mesure'),

  ('Conversions m, dm, cm',
   '3 m = ? cm et 250 cm = ? m ? cm. Comment convertis-tu mètres ↔ centimètres?',
   math_id, 'Number Talk', 15, '3e-4e année', 'Causerie — Mesure'),

  ('Surface sur quadrillage',
   'Figure irrégulière en T ou L sur quadrillage. Surface en carrés-unités? Deux façons de compter.',
   math_id, 'Image ouverte', 15, '3e-4e année', 'Causerie — Mesure'),

  ('Splat — mesures cachées',
   'Rectangle, longueur 6 cm, périmètre 20 cm. Splat cache la largeur. Quelle est-elle?',
   math_id, 'Splat', 15, '3e-4e année', 'Causerie — Mesure'),

  -- ── 6. Statistique et probabilité ─────────────────────────────
  ('Lire un diagramme à bandes',
   'Diagramme : animaux préférés de 60 élèves. Quel est le plus populaire? Calculer les différences.',
   math_id, 'Image ouverte', 15, '3e-4e année', 'Causerie — Statistique et probabilité'),

  ('Lire un pictogramme',
   'Pictogramme : livres lus par 5 élèves. 1 symbole = 2 livres. Combien Maya en a lus?',
   math_id, 'Image ouverte', 15, '3e-4e année', 'Causerie — Statistique et probabilité'),

  ('Diagrammes — lequel est l''intrus?',
   '4 diagrammes à bandes, 3 identiques, 1 différent. Lequel ne représente pas les mêmes données?',
   math_id, 'QELI', 15, '3e-4e année', 'Causerie — Statistique et probabilité'),

  ('Probabilité — certain, possible, impossible',
   'Sac opaque : 4 billes rouges, 3 bleues. Certain, possible ou impossible de piger rouge? Verte?',
   math_id, 'Estimation', 15, '3e-4e année', 'Causerie — Statistique et probabilité'),

  ('Expérience aléatoire — pièce de monnaie',
   '20 lancers : 12 pile, 8 face. Théorique : 10 et 10. Résultats réels pareils ou différents?',
   math_id, 'Pareil mais différent', 15, '3e-4e année', 'Causerie — Statistique et probabilité'),

  ('Splat — données cachées',
   'Diagramme, 3 catégories, total 50. Visible : 15 et 20. Splat cache la 3e valeur.',
   math_id, 'Splat', 15, '3e-4e année', 'Causerie — Statistique et probabilité'),

  ('Formuler un sondage',
   'Résultats : Quel est ton dessert préféré? Résultats surprenants? Comment améliorer le sondage?',
   math_id, 'Image ouverte', 15, '3e-4e année', 'Causerie — Statistique et probabilité');

END $$;
