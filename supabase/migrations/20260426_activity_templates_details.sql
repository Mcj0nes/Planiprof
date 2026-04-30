-- Add detailed fields to activity_templates (for causeries: full pedagogical info)
ALTER TABLE activity_templates
  ADD COLUMN IF NOT EXISTS trigger_text       text,
  ADD COLUMN IF NOT EXISTS open_question      text,
  ADD COLUMN IF NOT EXISTS expected_strategies text,
  ADD COLUMN IF NOT EXISTS observation_criteria text,
  ADD COLUMN IF NOT EXISTS pda_link           text;

-- ── Seed: full details for all 43 causeries mathématiques ─────

-- Section 1 : Nombres
UPDATE activity_templates SET
  trigger_text = 'Afficher le nombre 847 293. Demander : « Quelle est la valeur du chiffre 4? Et du 7? »',
  open_question = 'Quelle est la valeur de chaque chiffre dans ce nombre? Comment le sais-tu?',
  expected_strategies = 'Utiliser un tableau de valeur de position; décomposer en unités, dizaines, centaines, milliers, etc.',
  observation_criteria = 'L''élève identifie correctement la valeur de chaque chiffre; utilise le vocabulaire de position.',
  pda_link = 'Lire, écrire, représenter des nombres naturels jusqu''à 1 000 000.'
WHERE title = 'La valeur de position jusqu''à 1 000 000' AND category = 'Causerie — Nombres';

UPDATE activity_templates SET
  trigger_text = '45 000 = 40 000 + 5 000  et  45 000 = 44 000 + 1 000.',
  open_question = 'Ces deux décompositions représentent-elles le même nombre? Qu''est-ce qui est pareil et différent?',
  expected_strategies = 'Identifier que les deux égalent 45 000; proposer d''autres décompositions.',
  observation_criteria = 'L''élève peut générer plusieurs décompositions; comprend l''équivalence.',
  pda_link = 'Décomposer un nombre naturel de différentes façons.'
WHERE title = 'Décomposition de nombres' AND category = 'Causerie — Nombres';

UPDATE activity_templates SET
  trigger_text = 'Afficher : 305 200, 350 200, 305 020, 503 200.',
  open_question = 'Lequel ne va pas avec les autres? Pourquoi?',
  expected_strategies = 'Comparer les chiffres position par position; ordre de grandeur.',
  observation_criteria = 'L''élève justifie son choix avec un argument logique.',
  pda_link = 'Comparer et ordonner des nombres naturels.'
WHERE title = 'Comparaison de grands nombres' AND category = 'Causerie — Nombres';

UPDATE activity_templates SET
  trigger_text = 'Image d''un stade avec une section de 250 personnes identifiée.',
  open_question = 'Combien de personnes dans tout le stade?',
  expected_strategies = 'Utiliser la section comme référence; multiplier; estimer par groupes de 1000.',
  observation_criteria = 'Stratégie de groupement; estimation raisonnable.',
  pda_link = 'Estimer le résultat d''une opération.'
WHERE title = 'Estimation de grandes quantités' AND category = 'Causerie — Nombres';

UPDATE activity_templates SET
  trigger_text = 'Afficher : 16, 25, 36, 48.',
  open_question = 'Lequel ne fait pas partie du groupe? Trouve au moins deux arguments.',
  expected_strategies = '48 n''est pas un carré parfait; 25 est le seul impair.',
  observation_criteria = 'L''élève identifie les propriétés; argumente.',
  pda_link = 'Reconnaître pair, impair, premier, composé, carré.'
WHERE title = 'Nombres pairs, impairs et carrés' AND category = 'Causerie — Nombres';

UPDATE activity_templates SET
  trigger_text = 'Droite de 0 à 1 000 000 avec repères 0, 500 000, 1 000 000. Point mystère aux ¾.',
  open_question = 'Quel nombre pourrait se trouver à cet endroit?',
  expected_strategies = 'Trouver le milieu (750 000); estimer par proportionnalité.',
  observation_criteria = 'Utilise des repères; raisonne proportionnellement.',
  pda_link = 'Situer des nombres naturels sur une droite numérique.'
WHERE title = 'Situer un nombre sur la droite numérique' AND category = 'Causerie — Nombres';

UPDATE activity_templates SET
  trigger_text = '678 432 — arrondir à la dizaine de mille, puis à la centaine de mille.',
  open_question = 'Explique ta règle.',
  expected_strategies = 'Règle du 5; 678 432 ≈ 680 000 et ≈ 700 000.',
  observation_criteria = 'Applique correctement les conventions; explique la règle.',
  pda_link = 'Arrondir à une position donnée.'
WHERE title = 'Arrondir au bon ordre de grandeur' AND category = 'Causerie — Nombres';

-- Section 2 : Fractions et décimaux
UPDATE activity_templates SET
  trigger_text = 'Cercle en 4 parts avec 2 colorées (2/4) et cercle en 2 parts avec 1 colorée (1/2).',
  open_question = 'Même quantité? Trouve d''autres fractions équivalentes.',
  expected_strategies = 'Comparer les aires; multiplier numérateur et dénominateur par le même nombre.',
  observation_criteria = 'Reconnaît l''équivalence; génère d''autres fractions.',
  pda_link = 'Reconnaître des fractions équivalentes; simplifier.'
WHERE title = 'Fractions équivalentes' AND category = 'Causerie — Fractions et décimaux';

UPDATE activity_templates SET
  trigger_text = '3/4, 6/8, 9/12, 5/8.',
  open_question = 'Laquelle est l''intruse? Justifie.',
  expected_strategies = '3/4, 6/8, 9/12 sont équivalentes; 5/8 est différente.',
  observation_criteria = 'Utilise l''équivalence pour justifier.',
  pda_link = 'Comparer des fractions.'
WHERE title = 'Comparer des fractions' AND category = 'Causerie — Fractions et décimaux';

UPDATE activity_templates SET
  trigger_text = '75 %.',
  open_question = 'Exprime en fraction et en décimal. Et 40 %?',
  expected_strategies = '75 % = 75/100 = 3/4 = 0,75.',
  observation_criteria = 'Conversions correctes; explique le lien.',
  pda_link = 'Liens entre fraction, décimal et pourcentage.'
WHERE title = 'Pourcentage, fraction et décimal' AND category = 'Causerie — Fractions et décimaux';

UPDATE activity_templates SET
  trigger_text = '3,45 — 3,405 — 3,5 — 3,045.',
  open_question = 'Place-les en ordre du plus petit au plus grand.',
  expected_strategies = 'Aligner les décimales; convertir en millièmes.',
  observation_criteria = 'Compare systématiquement.',
  pda_link = 'Ordonner des nombres décimaux.'
WHERE title = 'Ordonner des nombres décimaux' AND category = 'Causerie — Fractions et décimaux';

UPDATE activity_templates SET
  trigger_text = 'Tablette de chocolat 4×6 (24 carrés), 9 mangés.',
  open_question = 'Quelle fraction mangée? Restante? Simplifie.',
  expected_strategies = '9/24 = 3/8; reste 5/8.',
  observation_criteria = 'Identifie le tout; simplifie.',
  pda_link = 'Fraction comme partie d''un tout.'
WHERE title = 'Fraction d''un tout' AND category = 'Causerie — Fractions et décimaux';

UPDATE activity_templates SET
  trigger_text = 'Cercle de 100 éléments, 35 visibles, le reste sous Splat.',
  open_question = 'Combien sont cachés? Quelle fraction? Quel pourcentage?',
  expected_strategies = '100 − 35 = 65; 65/100 = 13/20 = 65 %.',
  observation_criteria = 'Calcule le complément; convertit.',
  pda_link = 'Pourcentage comme fraction sur 100.'
WHERE title = 'Splat — fractions et pourcentages' AND category = 'Causerie — Fractions et décimaux';

UPDATE activity_templates SET
  trigger_text = 'Droite de 0 à 2 avec repères 0, 1/2, 1, 3/2, 2. Points mystères à 1/4 et 7/4.',
  open_question = 'Quels nombres se trouvent à ces endroits?',
  expected_strategies = 'Subdiviser; 1/4 entre 0 et 1/2; 7/4 entre 3/2 et 2.',
  observation_criteria = 'Utilise les repères pour subdiviser.',
  pda_link = 'Situer des fractions sur une droite.'
WHERE title = 'Placer des fractions sur la droite' AND category = 'Causerie — Fractions et décimaux';

-- Section 3 : Opérations
UPDATE activity_templates SET
  trigger_text = '398 + 276.',
  open_question = 'Comment calcules-tu de tête? Partage ta stratégie.',
  expected_strategies = 'Compenser (400 + 276 − 2 = 674); décomposer.',
  observation_criteria = 'Stratégie efficace; étapes claires.',
  pda_link = 'Calculer mentalement la somme.'
WHERE title = 'Addition mentale — 398 + 276' AND category = 'Causerie — Opérations';

UPDATE activity_templates SET
  trigger_text = '1 003 − 597.',
  open_question = 'Trouve deux stratégies différentes et compare leur efficacité.',
  expected_strategies = 'Compenser; ajouter au plus petit.',
  observation_criteria = 'Stratégie adaptée; compare l''efficacité.',
  pda_link = 'Calculer mentalement la différence.'
WHERE title = 'Soustraction par compensation — 1 003 − 597' AND category = 'Causerie — Opérations';

UPDATE activity_templates SET
  trigger_text = '6 × 14.',
  open_question = 'Calcule sans utiliser l''algorithme. Montre ta stratégie.',
  expected_strategies = '6 × 10 + 6 × 4 = 84; ou 6 × 15 − 6 = 84.',
  observation_criteria = 'Utilise la distributivité.',
  pda_link = 'Distributivité de la multiplication.'
WHERE title = 'Multiplication et distributivité — 6 × 14' AND category = 'Causerie — Opérations';

UPDATE activity_templates SET
  trigger_text = '144 ÷ 6.',
  open_question = 'Comment utilises-tu la multiplication pour trouver ta réponse?',
  expected_strategies = '6 × ? = 144; 120 ÷ 6 + 24 ÷ 6 = 24.',
  observation_criteria = 'Lien division/multiplication; décompose.',
  pda_link = 'Lien entre multiplication et division.'
WHERE title = 'Division et multiplication — 144 ÷ 6' AND category = 'Causerie — Opérations';

UPDATE activity_templates SET
  trigger_text = '(3 × 5) × 2  et  3 × (5 × 2).',
  open_question = 'Toujours le même résultat? Nommez la propriété et vérifiez avec la soustraction.',
  expected_strategies = 'Calculer les deux; nommer l''associativité; tester avec soustraction.',
  observation_criteria = 'Identifie la propriété; vérifie.',
  pda_link = 'Propriétés des opérations.'
WHERE title = 'Commutativité et associativité' AND category = 'Causerie — Opérations';

UPDATE activity_templates SET
  trigger_text = '48 × 23.',
  open_question = 'Estime sans calculer. Quelle est ta stratégie d''arrondissement?',
  expected_strategies = '50 × 20 = 1 000; encadrer entre 40 × 23 et 50 × 23.',
  observation_criteria = 'Arrondit judicieusement.',
  pda_link = 'Estimer le produit.'
WHERE title = 'Estimation du produit — 48 × 23' AND category = 'Causerie — Opérations';

UPDATE activity_templates SET
  trigger_text = '3 groupes égaux, total 72, taille de groupe cachée (Splat).',
  open_question = 'Quelle opération utilises-tu? Vérifie ta réponse.',
  expected_strategies = '72 ÷ 3 = 24; vérifier 24 × 3 = 72.',
  observation_criteria = 'Identifie la division; vérifie.',
  pda_link = 'Sens des opérations.'
WHERE title = 'Splat — opérations cachées' AND category = 'Causerie — Opérations';

UPDATE activity_templates SET
  trigger_text = '3 + 4 × 5.',
  open_question = 'Pourquoi la réponse n''est-elle pas 35? Explique la règle de priorité.',
  expected_strategies = '× avant + → 3 + 20 = 23.',
  observation_criteria = 'Connaît la priorité.',
  pda_link = 'Priorité des opérations.'
WHERE title = 'Priorité des opérations — 3 + 4 × 5' AND category = 'Causerie — Opérations';

-- Section 4 : Géométrie
UPDATE activity_templates SET
  trigger_text = 'Figures : carré, rectangle, losange, trapèze.',
  open_question = 'Lequel est l''intrus? Deux réponses possibles.',
  expected_strategies = 'Trapèze : 1 seule paire de côtés //; carré : 4 angles droits + 4 côtés égaux.',
  observation_criteria = 'Utilise les propriétés pour argumenter.',
  pda_link = 'Classer des quadrilatères.'
WHERE title = 'Quadrilatères — Quel est l''intrus?' AND category = 'Causerie — Géométrie';

UPDATE activity_templates SET
  trigger_text = 'Plan de ville (image avec rues).',
  open_question = 'Identifie les droites parallèles, perpendiculaires et sécantes. Utilise le vocabulaire précis.',
  expected_strategies = 'Rues parallèles (ne se croisent jamais); perpendiculaires (angle 90°); sécantes (autre angle).',
  observation_criteria = 'Vocabulaire précis; justification.',
  pda_link = 'Reconnaître droites //, ⊥ et sécantes.'
WHERE title = 'Parallèles, perpendiculaires et sécantes' AND category = 'Causerie — Géométrie';

UPDATE activity_templates SET
  trigger_text = 'Hexagone régulier et hexagone irrégulier côte à côte.',
  open_question = 'Qu''est-ce qui est pareil? Qu''est-ce qui est différent?',
  expected_strategies = 'Mêmes 6 côtés et 6 angles; régulier = tous les côtés et angles égaux.',
  observation_criteria = 'Distingue régulier/irrégulier avec précision.',
  pda_link = 'Décrire et classer des polygones.'
WHERE title = 'Polygones réguliers vs irréguliers' AND category = 'Causerie — Géométrie';

UPDATE activity_templates SET
  trigger_text = 'Image d''un papillon avec axe de symétrie vertical.',
  open_question = 'Comment vérifies-tu que la figure est symétrique?',
  expected_strategies = 'Plier mentalement; vérifier que chaque point est à distance égale de l''axe.',
  observation_criteria = 'Identifie l''axe; vérifie la correspondance des points.',
  pda_link = 'Effectuer une réflexion (symétrie axiale).'
WHERE title = 'Réflexion et symétrie axiale' AND category = 'Causerie — Géométrie';

UPDATE activity_templates SET
  trigger_text = 'Triangle avec sommets (1,1), (3,1), (2,3); flèche de translation : 4 droite, 2 haut.',
  open_question = 'Quelles sont les nouvelles coordonnées des sommets?',
  expected_strategies = 'Ajouter (4,2) à chaque sommet → (5,3), (7,3), (6,5).',
  observation_criteria = 'Applique la règle systématiquement à chaque sommet.',
  pda_link = 'Effectuer une translation.'
WHERE title = 'Translation dans un plan cartésien' AND category = 'Causerie — Géométrie';

UPDATE activity_templates SET
  trigger_text = 'Lettre L sur quadrillage; centre de rotation identifié; rotation d''un quart de tour horaire.',
  open_question = 'Dessine le résultat. Comment appliques-tu la règle?',
  expected_strategies = '(x,y) → (y,−x) pour un quart de tour horaire; ou utiliser papier calque.',
  observation_criteria = 'Effectue correctement; identifie le sens de rotation.',
  pda_link = 'Effectuer une rotation.'
WHERE title = 'Rotation d''un quart de tour' AND category = 'Causerie — Géométrie';

UPDATE activity_templates SET
  trigger_text = 'Points (2,1), (5,1), (5,4) sur quadrillage; 4e sommet d''un carré caché (Splat).',
  open_question = 'Quelles sont les coordonnées du 4e sommet?',
  expected_strategies = '(2,4); côtés de 3 unités; vérifier avec les propriétés du carré.',
  observation_criteria = 'Raisonne par propriétés du carré.',
  pda_link = 'Repérer des points dans un plan cartésien.'
WHERE title = 'Splat — 4e sommet d''un carré' AND category = 'Causerie — Géométrie';

-- Section 5 : Mesure
UPDATE activity_templates SET
  trigger_text = 'Pupitre de l''élève + crayon (18 cm) comme unité de mesure de référence.',
  open_question = 'Quel est le périmètre approximatif du pupitre?',
  expected_strategies = 'Utiliser le crayon comme unité; appliquer P = 2(L+l).',
  observation_criteria = 'Utilise un référent; estimation réaliste.',
  pda_link = 'Estimer et mesurer le périmètre.'
WHERE title = 'Estimer le périmètre d''un objet' AND category = 'Causerie — Mesure';

UPDATE activity_templates SET
  trigger_text = 'Figure en L tracée sur un quadrillage (aire connue).',
  open_question = 'Trouve deux façons différentes de calculer l''aire.',
  expected_strategies = 'Décomposer en 2 rectangles; ou encadrer par un grand rectangle et soustraire.',
  observation_criteria = 'Utilise deux stratégies distinctes; obtient le même résultat.',
  pda_link = 'Calculer l''aire de polygones décomposables.'
WHERE title = 'Aire de figures décomposées' AND category = 'Causerie — Mesure';

UPDATE activity_templates SET
  trigger_text = 'Rectangle 3×6 cm et rectangle 4×5 cm.',
  open_question = 'Ont-ils le même périmètre? La même aire? Qu''est-ce qui est pareil?',
  expected_strategies = 'P = 18 et 18 (même périmètre); A = 18 et 20 cm² (aires différentes).',
  observation_criteria = 'Distingue périmètre et aire; calcule correctement.',
  pda_link = 'Distinguer périmètre et aire.'
WHERE title = 'Périmètre vs aire' AND category = 'Causerie — Mesure';

UPDATE activity_templates SET
  trigger_text = 'Prisme rectangulaire 4×3×2 avec des cubes cachés à l''intérieur.',
  open_question = 'Combien de cubes au total? Comment le sais-tu?',
  expected_strategies = 'Compter par couches : 4×3 = 12 par couche × 2 couches = 24; ou L×l×h.',
  observation_criteria = 'Visualise les cubes cachés; utilise la formule.',
  pda_link = 'Estimer et mesurer le volume.'
WHERE title = 'Volume avec cubes-unités' AND category = 'Causerie — Mesure';

UPDATE activity_templates SET
  trigger_text = '3,5 km = ? m  ;  4 200 m = ? km.',
  open_question = 'Quelle est ta stratégie mentale? Quel lien entre les unités?',
  expected_strategies = 'Multiplier ou diviser par 1000; déplacer la virgule de 3 positions.',
  observation_criteria = 'Connaît les relations entre unités; explique la stratégie.',
  pda_link = 'Relations entre unités de longueur.'
WHERE title = 'Conversions de longueur' AND category = 'Causerie — Mesure';

UPDATE activity_templates SET
  trigger_text = '4 angles dessinés d''environ 45°, 90°, 120° et 160°.',
  open_question = 'Aigu, droit ou obtus? Quelle mesure approximative?',
  expected_strategies = 'Utiliser 90° et 180° comme références; comparer visuellement.',
  observation_criteria = 'Utilise des angles de référence; vocabulaire correct.',
  pda_link = 'Estimer et mesurer des angles.'
WHERE title = 'Estimation d''angles' AND category = 'Causerie — Mesure';

UPDATE activity_templates SET
  trigger_text = 'Rectangle : L = 8 cm, A = 56 cm², largeur cachée (Splat).',
  open_question = 'Quelle est la largeur? Quelle opération utilises-tu?',
  expected_strategies = '56 ÷ 8 = 7 cm; vérifier : 8 × 7 = 56.',
  observation_criteria = 'Isole la dimension manquante; utilise la division.',
  pda_link = 'Calculer une dimension manquante.'
WHERE title = 'Splat — dimension cachée d''un rectangle' AND category = 'Causerie — Mesure';

-- Section 6 : Statistique et probabilité
UPDATE activity_templates SET
  trigger_text = 'Diagramme à bandes : fruits préférés de 120 élèves.',
  open_question = 'Lequel est le plus populaire? Calcule la différence et la fraction.',
  expected_strategies = 'Lire les bandes; calculer la différence; exprimer en fraction sur 120.',
  observation_criteria = 'Lecture exacte; calcule la fraction.',
  pda_link = 'Interpréter des diagrammes à bandes.'
WHERE title = 'Interpréter un diagramme à bandes' AND category = 'Causerie — Statistique et probabilité';

UPDATE activity_templates SET
  trigger_text = 'Notes d''un groupe : 72, 85, 85, 90, 68.',
  open_question = 'Calcule la moyenne, le mode et la médiane. Quelle est la différence?',
  expected_strategies = 'Moyenne = (72+85+85+90+68)÷5 = 80; mode = 85; médiane = 85 (ordre : 68,72,85,85,90).',
  observation_criteria = 'Distingue les trois mesures; calcule correctement.',
  pda_link = 'Moyenne, mode, médiane.'
WHERE title = 'Moyenne, mode et médiane' AND category = 'Causerie — Statistique et probabilité';

UPDATE activity_templates SET
  trigger_text = '4 diagrammes : à bandes, circulaire, à ligne brisée, pictogramme — l''un montre des données différentes.',
  open_question = 'Lequel est l''intrus? Justifie en comparant les proportions.',
  expected_strategies = 'Comparer les proportions; repérer celui dont les données ne correspondent pas.',
  observation_criteria = 'Compare; justifie avec des valeurs.',
  pda_link = 'Représenter des données avec différents diagrammes.'
WHERE title = 'Quel diagramme est l''intrus?' AND category = 'Causerie — Statistique et probabilité';

UPDATE activity_templates SET
  trigger_text = 'Sac contenant : 3 billes rouges, 5 bleues, 2 vertes.',
  open_question = 'Quelle est la probabilité de piger une bille bleue? Rouge? Jaune?',
  expected_strategies = 'P(bleue) = 5/10 = 1/2; P(rouge) = 3/10; P(jaune) = 0/10 (impossible).',
  observation_criteria = 'Exprime en fraction; utilise le vocabulaire approprié.',
  pda_link = 'Probabilité d''un événement simple.'
WHERE title = 'Probabilité simple' AND category = 'Causerie — Statistique et probabilité';

UPDATE activity_templates SET
  trigger_text = '60 lancers d''un dé; le 3 est sorti 15 fois (théorique : 10 fois).',
  open_question = 'Résultats pareils ou différents? Et avec 600 lancers?',
  expected_strategies = 'P théorique = 1/6; avec plus de lancers, on se rapproche de la probabilité théorique.',
  observation_criteria = 'Distingue probabilité théorique et expérimentale.',
  pda_link = 'Comparer probabilité théorique et expérimentale.'
WHERE title = 'Probabilité théorique vs expérimentale' AND category = 'Causerie — Statistique et probabilité';

UPDATE activity_templates SET
  trigger_text = 'Diagramme à 4 bandes : total 80 élèves; bandes 15, 25, 20; 4e bande cachée (Splat).',
  open_question = 'Quelle est la valeur manquante?',
  expected_strategies = '80 − (15+25+20) = 80 − 60 = 20.',
  observation_criteria = 'Utilise le complément; vérifie.',
  pda_link = 'Opérations sur données statistiques.'
WHERE title = 'Splat — donnée cachée dans un diagramme' AND category = 'Causerie — Statistique et probabilité';

UPDATE activity_templates SET
  trigger_text = 'Sondage sur le sport préféré posé uniquement aux membres de l''équipe de soccer.',
  open_question = 'Ce sondage est-il fiable? Comment l''améliorer?',
  expected_strategies = 'Échantillon biaisé; sonder des élèves variés, sans lien avec le sport.',
  observation_criteria = 'Identifie le biais; propose une amélioration concrète.',
  pda_link = 'Identifier les biais dans un sondage.'
WHERE title = 'Sondage et biais' AND category = 'Causerie — Statistique et probabilité';
