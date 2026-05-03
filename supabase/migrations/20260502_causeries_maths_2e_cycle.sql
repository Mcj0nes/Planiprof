-- Causeries mathématiques — 2e cycle (3e-4e année)
-- 42 activités réparties en 6 catégories

DO $$
DECLARE
  math_id integer;
BEGIN
  SELECT id INTO math_id FROM subjects WHERE name_fr ILIKE '%math%' ORDER BY id LIMIT 1;

  IF EXISTS (
    SELECT 1 FROM activity_templates
    WHERE category = 'Causerie — Nombres' AND grade_level_tag = '3e-4e année'
    LIMIT 1
  ) THEN RETURN; END IF;

  INSERT INTO activity_templates
    (title, description, subject_id, type_tag, duration_min, grade_level_tag, category,
     open_question, expected_strategies, observation_criteria, pda_link)
  VALUES

  -- ── 1. Nombres ─────────────────────────────────────────────────────────────

  ('Nombres naturels jusqu''à 10 000',
   'Afficher 3 048, 3 408, 3 480, 4 308. Lequel ne va pas avec les autres? Trouve au moins deux arguments.',
   math_id, 'WODB', 15, '3e-4e année', 'Causerie — Nombres',
   'Lequel ne va pas avec les autres? Justifie.',
   'Comparer la valeur de position des chiffres, identifier des régularités',
   'Cartes de nombres (3 000–10 000)',
   'Arithmétique – Sens et écriture des nombres'),

  ('Valeur de position',
   'Dans le nombre 5 274 : quelle est la valeur du chiffre 2? Et si on échangeait le 2 et le 7, quel nombre obtiendrait-on?',
   math_id, 'Number Talk', 15, '3e-4e année', 'Causerie — Nombres',
   'Quelle est la valeur du chiffre 2?',
   'Identifier centaines, dizaines, unités; expliquer l''échange de position',
   'Tableau de numération',
   'Arithmétique – Sens et écriture des nombres'),

  ('Régularités numériques',
   'Suite : 5, 10, 20, 35, 55, … Trouve les 3 prochains termes et explique la règle.',
   math_id, 'Image ouverte', 15, '3e-4e année', 'Causerie — Nombres',
   'Quelle est la règle de cette suite?',
   'Calculer les écarts, identifier les bonds, généraliser la règle',
   'Tableau de nombres',
   'Arithmétique – Opérations sur des nombres'),

  ('Nombres premiers ou composés',
   'Afficher 12, 13, 15, 17, 21. Lesquels sont premiers? Comment le vérifies-tu sans calculatrice?',
   math_id, 'WODB', 15, '4e année', 'Causerie — Nombres',
   'Comment vérifies-tu qu''un nombre est premier?',
   'Tester la divisibilité par 2, 3, 5; utiliser des dispositions rectangulaires',
   'Grille de nombres 1-100',
   'Arithmétique – Opérations sur des nombres'),

  ('Arrondir à différents ordres de grandeur',
   '7 638 — Arrondis à la dizaine, à la centaine, au millier. Explique ta règle pour chaque cas.',
   math_id, 'Estimation', 15, '3e-4e année', 'Causerie — Nombres',
   'Comment décides-tu vers quel nombre arrondir?',
   'Repérer le chiffre à droite de l''ordre visé, règle du 5',
   'Droite numérique (milliers)',
   'Arithmétique – Sens et écriture des nombres'),

  ('Fractions équivalentes — introduction',
   'Image : rectangle partagé en 4 parts égales (2 colorées) et rectangle partagé en 8 parts égales (4 colorées). Ces rectangles montrent-ils la même quantité?',
   math_id, 'Pareil mais différent', 15, '3e année', 'Causerie — Nombres',
   'Ces fractions représentent-elles la même quantité?',
   'Comparer visuellement, trouver d''autres fractions équivalentes',
   'Bandes de fractions ou cercles de fractions',
   'Arithmétique – Sens et écriture des nombres'),

  ('Splat — Nombres naturels',
   'Grille de 1 000 points : 632 visibles, reste caché sous Splat. Combien sont cachés? Comment le calcules-tu?',
   math_id, 'Splat', 15, '3e-4e année', 'Causerie — Nombres',
   'Combien de points sont cachés?',
   'Soustraction, complément à 1000, décomposition',
   'Image Splat projetée',
   'Arithmétique – Sens et écriture des nombres'),

  -- ── 2. Opérations ──────────────────────────────────────────────────────────

  ('Stratégies de multiplication — 7 × 8',
   '7 × 8 — Trouve au moins 3 façons différentes de calculer ce produit sans utiliser l''algorithme.',
   math_id, 'Number Talk', 15, '3e-4e année', 'Causerie — Opérations',
   'Comment calcules-tu 7 × 8 sans l''algorithme?',
   'Doubler, utiliser une table connue, décomposer (5×8 + 2×8), produit cartésien',
   'Tables de multiplication',
   'Arithmétique – Opérations sur des nombres'),

  ('Division avec reste',
   '29 ÷ 4 — Quelle est la réponse? Comment exprimes-tu le reste? Y a-t-il plusieurs façons?',
   math_id, 'Splat', 15, '3e-4e année', 'Causerie — Opérations',
   'Que signifie le reste dans la division?',
   'Regrouper par 4, soustraction répétée, exprimer le reste en fraction',
   'Tuiles ou cubes de manipulation',
   'Arithmétique – Opérations sur des nombres'),

  ('Addition mentale — 3 et 4 chiffres',
   '2 487 + 1 356 — Comment calcules-tu de tête? Partage au moins deux stratégies.',
   math_id, 'Number Talk', 15, '3e-4e année', 'Causerie — Opérations',
   'Quelle stratégie te semble la plus efficace?',
   'Compenser, additionner par parties, utiliser des repères (2500, 3000)',
   'Tableau de numération',
   'Arithmétique – Opérations sur des nombres'),

  ('Sens de la division',
   '36 ÷ 4 : modèle de partage vs modèle de contenance. Quelle histoire de mots correspond à chaque modèle?',
   math_id, 'WODB', 15, '3e-4e année', 'Causerie — Opérations',
   'Comment ces deux modèles de division se distinguent-ils?',
   'Construire une histoire de mots pour chaque sens, représenter avec du matériel',
   'Tuiles ou jetons',
   'Arithmétique – Sens des opérations sur des nombres'),

  ('Terme manquant dans une équation',
   'Afficher : □ × 6 = 48 et 72 ÷ □ = 9. Trouve la valeur de □. Ces deux équations sont-elles liées?',
   math_id, 'Image ouverte', 15, '3e-4e année', 'Causerie — Opérations',
   'Comment trouves-tu le terme manquant?',
   'Opération inverse, famille d''opérations, estimation',
   'Tableau ou équation au tableau',
   'Arithmétique – Sens des opérations sur des nombres'),

  ('Estimation d''un produit — 34 × 6',
   '34 × 6 — Sans calculer, estime le résultat. Ton estimation est-elle supérieure ou inférieure au résultat exact?',
   math_id, 'Estimation', 15, '3e-4e année', 'Causerie — Opérations',
   'Comment estimes-tu un produit mentalement?',
   'Arrondir à la dizaine la plus proche, distributivité mentale (30×6 + 4×6)',
   'Aucun matériel',
   'Arithmétique – Opérations sur des nombres'),

  ('Splat — Facteur caché',
   'Tableau rectangulaire : □ rangées de 9. Total = 63. Combien de rangées? Quelle opération utilises-tu?',
   math_id, 'Splat', 15, '3e-4e année', 'Causerie — Opérations',
   'Quelle opération te permet de trouver le facteur manquant?',
   'Division, opération inverse, grille de multiplication',
   'Image projetée',
   'Arithmétique – Opérations sur des nombres'),

  -- ── 3. Fractions et décimaux ───────────────────────────────────────────────

  ('Fractions d''un tout',
   'Cercle partagé en 6 parts égales, 4 colorées. Quelle fraction est colorée? Non colorée? Ces fractions forment-elles un tout?',
   math_id, 'Pareil mais différent', 15, '3e année', 'Causerie — Fractions et décimaux',
   'La fraction colorée et la fraction non colorée, que représentent-elles ensemble?',
   'Identifier numérateur et dénominateur, complémentarité, sens de la fraction',
   'Cercles de fractions ou disques',
   'Arithmétique – Sens et écriture des nombres'),

  ('Comparer des fractions',
   'Afficher 2/3, 3/4, 5/6, 1/2. Ordonne-les du plus petit au plus grand. Explique ta stratégie.',
   math_id, 'Estimation', 15, '3e-4e année', 'Causerie — Fractions et décimaux',
   'Comment compares-tu des fractions de dénominateurs différents?',
   'Comparer à ½, utiliser un repère commun, dessiner des bandes',
   'Bandes de fractions',
   'Arithmétique – Sens et écriture des nombres'),

  ('Fractions équivalentes',
   'Afficher : 2/4, 3/6, 1/2, 4/8, 5/9. Laquelle n''est pas équivalente aux autres? Prouve-le.',
   math_id, 'WODB', 15, '3e-4e année', 'Causerie — Fractions et décimaux',
   'Comment vérifies-tu si deux fractions sont équivalentes?',
   'Simplifier, multiplier par 1 (n/n), représenter sur une droite',
   'Bandes de fractions',
   'Arithmétique – Sens et écriture des nombres'),

  ('Introduction aux décimaux — dixièmes',
   'Règle de 10 cm. Je colorie 3 cm. Comment peut-on écrire cette longueur en décimal? Quelle fraction correspond à 0,3?',
   math_id, 'Image ouverte', 15, '3e année', 'Causerie — Fractions et décimaux',
   'Comment le décimal et la fraction sont-ils liés?',
   'Associer 3/10 ↔ 0,3, utiliser la droite numérique, identifier dixièmes',
   'Règle graduée en dixièmes',
   'Arithmétique – Sens et écriture des nombres'),

  ('Nombres décimaux — centièmes',
   '0,35 — 0,3 — 0,305 — 0,5. Ordonne du plus petit au plus grand. Explique pourquoi 0,35 > 0,3.',
   math_id, 'Number Talk', 15, '4e année', 'Causerie — Fractions et décimaux',
   'Pourquoi est-ce que 0,35 est plus grand que 0,3?',
   'Comparer les chiffres à chaque position, utiliser la droite numérique',
   'Droite numérique graduée en centièmes',
   'Arithmétique – Sens et écriture des nombres'),

  ('Ordonner fractions et décimaux',
   '1/2, 0,6, 3/4, 0,25 — Place ces nombres en ordre croissant sur une droite numérique.',
   math_id, 'Estimation', 15, '4e année', 'Causerie — Fractions et décimaux',
   'Comment convertis-tu pour pouvoir comparer?',
   'Convertir fractions en décimaux ou vice versa, utiliser des repères (½ = 0,5)',
   'Droite numérique vierge',
   'Arithmétique – Sens et écriture des nombres'),

  ('Splat — Fraction cachée',
   'Bande de 12 cases : 8 visibles (colorées), le reste sous Splat. Quelle fraction est cachée? Simplifie si possible.',
   math_id, 'Splat', 15, '3e-4e année', 'Causerie — Fractions et décimaux',
   'Comment trouves-tu la fraction cachée?',
   'Soustraction, complémentarité, simplification de fractions',
   'Image Splat projetée',
   'Arithmétique – Sens et écriture des nombres'),

  -- ── 4. Géométrie ───────────────────────────────────────────────────────────

  ('Classer les quadrilatères',
   'Afficher carré, rectangle, losange, trapèze, parallélogramme. Lequel est l''intrus? Trouve une règle de classement.',
   math_id, 'WODB', 15, '3e-4e année', 'Causerie — Géométrie',
   'Quelles propriétés utilises-tu pour classer ces quadrilatères?',
   'Identifier côtés parallèles, angles droits, longueurs des côtés',
   'Figures géométriques plastiques ou images',
   'Géométrie – Figures planes'),

  ('Angles : aigu, droit, obtus',
   'Afficher 4 angles d''environ 45°, 90°, 120°, 160°. Classe-les. Comment sais-tu si un angle est aigu ou obtus?',
   math_id, 'WODB', 15, '3e-4e année', 'Causerie — Géométrie',
   'Comment décides-tu de la classification d''un angle?',
   'Comparer à l''angle droit, utiliser un coin de feuille comme référence',
   'Rapporteur ou coin de page comme référence',
   'Géométrie – Figures planes'),

  ('Droites parallèles et perpendiculaires',
   'Image d''une grille de ville avec des rues. Identifie des droites parallèles et perpendiculaires. Comment les reconnais-tu?',
   math_id, 'Image ouverte', 15, '3e-4e année', 'Causerie — Géométrie',
   'Comment distingues-tu droites parallèles et perpendiculaires?',
   'Utiliser une équerre, vérifier l''angle droit, observer la distance constante',
   'Règle et équerre',
   'Géométrie – Figures planes'),

  ('Symétrie axiale',
   'Lettre H et lettre R. Laquelle a un axe de symétrie? Combien d''axes? Comment le vérifies-tu?',
   math_id, 'Pareil mais différent', 15, '3e-4e année', 'Causerie — Géométrie',
   'Comment vérifies-tu qu''une figure a un axe de symétrie?',
   'Plier, utiliser un miroir, reproduire sur papier quadrillé',
   'Miroir géométrique ou papier à plier',
   'Géométrie – Frises et dallages'),

  ('Plan cartésien — 1er quadrant',
   'Plan cartésien affiché. Repère le point (4, 3). Quel point est à 2 cases à droite et 1 case en haut? À toi de créer un chemin.',
   math_id, 'Number Talk', 15, '4e année', 'Causerie — Géométrie',
   'Comment repères-tu un point dans le plan cartésien?',
   'Lire (x, y) dans l''ordre : horizontal puis vertical, utiliser les axes',
   'Grille de plan cartésien',
   'Géométrie – Espace'),

  ('Frises et dallages — réflexion et translation',
   'Image d''une frise produite par réflexion et une par translation. Quelle est la différence entre les deux transformations?',
   math_id, 'Pareil mais différent', 15, '3e-4e année', 'Causerie — Géométrie',
   'Comment distingues-tu une réflexion d''une translation dans une frise?',
   'Identifier l''axe de réflexion, la direction de la flèche de translation',
   'Figures en carton et papier quadrillé',
   'Géométrie – Frises et dallages'),

  ('Splat — 4e sommet d''un rectangle',
   'Points (1,1), (5,1), (5,4) formant trois sommets d''un rectangle; le 4e est caché. Quelles sont ses coordonnées?',
   math_id, 'Splat', 15, '4e année', 'Causerie — Géométrie',
   'Comment détermines-tu la position du sommet manquant?',
   'Utiliser les propriétés du rectangle (côtés parallèles et perpendiculaires), plan cartésien',
   'Grille de plan cartésien',
   'Géométrie – Espace'),

  -- ── 5. Mesure ──────────────────────────────────────────────────────────────

  ('Périmètre vs aire',
   'Rectangle 3×8 cm et rectangle 4×6 cm. Ont-ils le même périmètre? La même aire? Explore avec d''autres rectangles.',
   math_id, 'Pareil mais différent', 15, '3e-4e année', 'Causerie — Mesure',
   'Est-ce qu''un même périmètre implique une même aire?',
   'Calculer périmètre (2L + 2l) et aire (L × l), trouver des contre-exemples',
   'Papier quadrillé ou tuiles carrées',
   'Mesure – Surfaces'),

  ('Estimation d''une aire',
   'Image d''une main tracée sur papier quadrillé. Estime l''aire. Quelle stratégie utilises-tu? Comment la rendre plus précise?',
   math_id, 'Estimation', 15, '3e-4e année', 'Causerie — Mesure',
   'Comment estimes-tu une aire irrégulière?',
   'Compter les cases complètes, regrouper les demi-cases',
   'Main tracée sur papier quadrillé',
   'Mesure – Surfaces'),

  ('Unités de longueur — conversions',
   '3 m = ? dm = ? cm = ? mm. Ensuite : 4 500 m = ? km. Quelle relation relie ces unités?',
   math_id, 'WODB', 15, '3e-4e année', 'Causerie — Mesure',
   'Quelle relation y a-t-il entre les unités de longueur?',
   'Multiplier ou diviser par 10 selon la conversion, utiliser le tableau des unités',
   'Tableau des unités métriques',
   'Mesure – Longueurs'),

  ('Masse — gramme et kilogramme',
   'Afficher : 250 g, ½ kg, 500 g, 0,5 kg. Ces mesures représentent-elles la même masse? Comment le sais-tu?',
   math_id, 'Pareil mais différent', 15, '3e-4e année', 'Causerie — Mesure',
   'Ces mesures sont-elles équivalentes? Prouve-le.',
   'Conversion g ↔ kg, 1 kg = 1000 g, représentations équivalentes',
   'Balance et masses standard',
   'Mesure – Masses'),

  ('Lire l''heure et calculer des durées',
   'Départ : 10 h 25 min. Arrivée : 12 h 10 min. Quelle est la durée du trajet? Montre deux stratégies.',
   math_id, 'Image ouverte', 15, '3e-4e année', 'Causerie — Mesure',
   'Comment calcules-tu une durée à partir de deux heures?',
   'Décomposer en heures et minutes, utiliser la droite des heures, compter par bonds',
   'Horloge ou droite du temps',
   'Mesure – Temps'),

  ('Températures en Celsius',
   'Thermomètre montrant 22°C. En hiver, il fait −5°C. Quelle est la différence de température? Et si ça montait de 30°C?',
   math_id, 'Number Talk', 15, '3e-4e année', 'Causerie — Mesure',
   'Comment calcules-tu la différence entre une température positive et négative?',
   'Droite numérique avec nombres négatifs, soustraction, sens physique de la mesure',
   'Thermomètre ou droite numérique',
   'Mesure – Températures'),

  ('Splat — Dimension cachée',
   'Rectangle dont la longueur est 9 cm et l''aire est 45 cm². La largeur est cachée. Trouve-la. Quelle opération utilises-tu?',
   math_id, 'Splat', 15, '4e année', 'Causerie — Mesure',
   'Quelle opération te permet de trouver la dimension manquante?',
   'Division (A ÷ L = l), relation entre aire et dimensions',
   'Image Splat projetée',
   'Mesure – Surfaces'),

  -- ── 6. Statistique et probabilité ──────────────────────────────────────────

  ('Lire un diagramme à bandes',
   'Diagramme des sports préférés de 120 élèves (soccer 45, natation 30, vélo 25, autre 20). Quelle question peut-on répondre avec ce diagramme? Quelle question ne peut-on pas?',
   math_id, 'Image ouverte', 15, '3e-4e année', 'Causerie — Statistique et probabilité',
   'Quelles questions ce diagramme permet-il de répondre?',
   'Lire les barres, calculer différences et fractions, critiquer les limites du diagramme',
   'Diagramme projeté',
   'Statistique'),

  ('Formuler des questions d''enquête',
   'On veut savoir comment les élèves viennent à l''école. Formule 3 questions différentes pour récolter cette information. Laquelle est la meilleure? Pourquoi?',
   math_id, 'Image ouverte', 15, '3e-4e année', 'Causerie — Statistique et probabilité',
   'Qu''est-ce qui rend une question d''enquête bonne ou mauvaise?',
   'Questions fermées vs ouvertes, catégories mutuellement exclusives, biais possible',
   'Aucun matériel',
   'Statistique'),

  ('Diagramme à ligne brisée',
   'Graphique de la température d''une journée (6 h : 8°C, 12 h : 18°C, 15 h : 21°C, 18 h : 16°C, 21 h : 11°C). Que montre ce type de diagramme? Quelle température prévois-tu à 9 h?',
   math_id, 'Image ouverte', 15, '3e-4e année', 'Causerie — Statistique et probabilité',
   'Pourquoi utilise-t-on un diagramme à ligne brisée plutôt qu''à bandes ici?',
   'Identifier la tendance, interpoler, choisir le bon type de diagramme selon les données',
   'Diagramme projeté',
   'Statistique'),

  ('Événements certains, possibles, impossibles',
   'Sac de billes (4 rouges, 3 bleues). Événement A : piger une bille rouge. Événement B : piger une bille verte. Événement C : piger une bille d''une couleur quelconque. Classe chaque événement.',
   math_id, 'WODB', 15, '3e année', 'Causerie — Statistique et probabilité',
   'Comment décides-tu si un événement est certain, possible ou impossible?',
   'Identifier les résultats possibles, vérifier si l''événement peut se produire',
   'Sac de billes ou jetons colorés',
   'Probabilité'),

  ('Expérience aléatoire — prévoir vs observer',
   'On lance un dé 24 fois. On prédit 4 fois le chiffre 3 (théorique). On obtient 6 fois. Est-ce surprenant? Que se passerait-il avec 240 lancers?',
   math_id, 'Pareil mais différent', 15, '3e-4e année', 'Causerie — Statistique et probabilité',
   'Pourquoi le résultat observé diffère-t-il du résultat prédit?',
   'Variabilité des résultats, loi des grands nombres (informelle), P(3) = 1/6',
   'Dé à 6 faces',
   'Probabilité'),

  ('Dénombrer les résultats possibles',
   'On lance un dé et on lance une pièce de monnaie. Combien de résultats différents sont possibles? Fais un tableau ou un arbre.',
   math_id, 'Estimation', 15, '4e année', 'Causerie — Statistique et probabilité',
   'Comment t''assures-tu de compter tous les résultats sans oublier ni répéter?',
   'Tableau à double entrée, diagramme en arbre, principe de multiplication',
   'Dé et pièce de monnaie',
   'Probabilité'),

  ('Splat — Donnée manquante dans un diagramme',
   'Diagramme à bandes : 4 sports, total 100 élèves. Soccer 35, natation 25, vélo 20, 4e barre cachée. Quelle est la valeur cachée?',
   math_id, 'Splat', 15, '3e-4e année', 'Causerie — Statistique et probabilité',
   'Comment trouves-tu la valeur manquante dans un diagramme?',
   'Soustraction du total, complémentarité, vérification',
   'Diagramme Splat projeté',
   'Statistique');

END $$;
