-- Détails pédagogiques : Causeries mathématiques — 3e-4e année

-- ── Section 1 : Nombres ───────────────────────────────────────

UPDATE activity_templates SET
  trigger_text        = 'Afficher le nombre 47 315. Demander : « Quelle est la valeur du chiffre 7? Et du 3? »',
  open_question       = 'Quelle est la valeur de chaque chiffre dans ce nombre? Comment le sais-tu?',
  expected_strategies = 'Utiliser un tableau de valeur de position; décomposer en unités, dizaines, centaines, unités de mille, dizaines de mille.',
  observation_criteria= 'L''élève identifie correctement la valeur de chaque chiffre; utilise le vocabulaire de position.',
  pda_link            = 'Lire, écrire, représenter des nombres naturels jusqu''à 100 000.'
WHERE title = 'La valeur de position jusqu''à 100 000' AND grade_level_tag = '3e-4e année';

UPDATE activity_templates SET
  trigger_text        = 'Présenter : 5 200 = 5 000 + 200  et  5 200 = 4 000 + 1 200.',
  open_question       = 'Ces deux décompositions représentent-elles le même nombre? Qu''est-ce qui est pareil et différent?',
  expected_strategies = 'Identifier que les deux égalent 5 200; noter les façons différentes de séparer; proposer d''autres décompositions.',
  observation_criteria= 'L''élève génère plusieurs décompositions; comprend l''équivalence.',
  pda_link            = 'Décomposer un nombre naturel de différentes façons.'
WHERE title = 'Décomposition de nombres' AND grade_level_tag = '3e-4e année';

UPDATE activity_templates SET
  trigger_text        = 'Afficher : 32 450, 34 250, 32 540, 23 450.',
  open_question       = 'Lequel de ces nombres ne va pas avec les autres? Pourquoi?',
  expected_strategies = 'Comparer chiffre par chiffre; 23 450 commence par 2 (les autres par 3); disposition des chiffres.',
  observation_criteria= 'L''élève justifie avec un argument logique; compare systématiquement.',
  pda_link            = 'Comparer et ordonner des nombres naturels.'
WHERE title = 'Comparaison de nombres' AND grade_level_tag = '3e-4e année';

UPDATE activity_templates SET
  trigger_text        = 'Image d''un pot rempli de billes. Un petit groupe de 25 billes est mis à côté pour référence.',
  open_question       = 'Combien de billes y a-t-il dans ce pot? Comment peux-tu estimer?',
  expected_strategies = 'Utiliser le groupe de 25 pour multiplier; estimer combien de groupes entrent dans le pot.',
  observation_criteria= 'L''élève utilise une stratégie de groupement; estimation raisonnable.',
  pda_link            = 'Estimer une quantité; situer un nombre sur une droite numérique.'
WHERE title = 'Estimation de quantités' AND grade_level_tag = '3e-4e année';

UPDATE activity_templates SET
  trigger_text        = 'Afficher : 24, 36, 15, 48.',
  open_question       = 'Lequel ne fait pas partie du groupe? Trouve deux arguments.',
  expected_strategies = '15 est le seul impair; 15 n''est pas dans la table de 12; divisibilité par 2.',
  observation_criteria= 'L''élève identifie pair/impair; argumente.',
  pda_link            = 'Reconnaître les propriétés des nombres : pair, impair.'
WHERE title = 'Nombres pairs et impairs' AND grade_level_tag = '3e-4e année';

UPDATE activity_templates SET
  trigger_text        = 'Droite numérique de 0 à 10 000 avec repères 0, 5 000 et 10 000. Point mystère aux 3/4.',
  open_question       = 'Quel nombre pourrait se trouver à cet endroit? Explique.',
  expected_strategies = 'Trouver le milieu (7 500); estimer par proportionnalité.',
  observation_criteria= 'L''élève utilise des repères; raisonne proportionnellement.',
  pda_link            = 'Situer des nombres naturels sur une droite numérique.'
WHERE title = 'Situer un nombre sur la droite' AND grade_level_tag = '3e-4e année';

UPDATE activity_templates SET
  trigger_text        = 'Afficher 6 738. Demander d''arrondir à la centaine, puis au millier.',
  open_question       = 'Quel est ce nombre arrondi à la centaine? Au millier? Explique ta règle.',
  expected_strategies = 'Règle du 5; 6 738 ≈ 6 700 (centaine), ≈ 7 000 (millier).',
  observation_criteria= 'L''élève applique les conventions d''arrondissement; explique la règle.',
  pda_link            = 'Arrondir un nombre naturel à une position donnée.'
WHERE title = 'Arrondir à la centaine et au millier' AND grade_level_tag = '3e-4e année';

-- ── Section 2 : Fractions ─────────────────────────────────────

UPDATE activity_templates SET
  trigger_text        = 'Pizza coupée en 8 pointes égales, 2 mangées.',
  open_question       = 'Quelle fraction a été mangée? Quelle fraction reste?',
  expected_strategies = '2/8 mangée; 6/8 reste; 2/8 + 6/8 = 1.',
  observation_criteria= 'L''élève identifie le tout (8); forme la fraction.',
  pda_link            = 'Représenter une fraction : partie d''un tout.'
WHERE title = 'Reconnaître une fraction' AND grade_level_tag = '3e-4e année';

UPDATE activity_templates SET
  trigger_text        = 'Deux rectangles : l''un avec 1/2 coloré, l''autre avec 2/4 coloré.',
  open_question       = 'Représentent-ils la même quantité? Comment le sais-tu?',
  expected_strategies = 'Comparer visuellement; 1/2 = 2/4.',
  observation_criteria= 'L''élève reconnaît l''équivalence.',
  pda_link            = 'Reconnaître des fractions équivalentes à l''aide de matériel.'
WHERE title = 'Fractions équivalentes simples' AND grade_level_tag = '3e-4e année';

UPDATE activity_templates SET
  trigger_text        = 'Afficher : 2/6, 4/6, 5/6, 4/8.',
  open_question       = 'Laquelle n''est pas comme les autres? Pourquoi?',
  expected_strategies = '4/8 a un dénominateur différent; 4/8 = 1/2.',
  observation_criteria= 'L''élève utilise le dénominateur pour justifier.',
  pda_link            = 'Comparer des fractions ayant un même dénominateur.'
WHERE title = 'Comparer des fractions — même dénominateur' AND grade_level_tag = '3e-4e année';

UPDATE activity_templates SET
  trigger_text        = '20 crayons : 12 rouges, 8 bleus.',
  open_question       = 'Quelle fraction est rouge? Bleue? Simplifie.',
  expected_strategies = '12/20 = 3/5; 8/20 = 2/5; total = 1.',
  observation_criteria= 'L''élève forme la fraction sur le total; simplifie.',
  pda_link            = 'Fraction comme partie d''un ensemble.'
WHERE title = 'Fraction d''un ensemble' AND grade_level_tag = '3e-4e année';

UPDATE activity_templates SET
  trigger_text        = 'Droite de 0 à 1, point mystère au milieu.',
  open_question       = 'Quelle fraction se trouve ici? Et chaque quart?',
  expected_strategies = 'Milieu = 1/2; quarts = 1/4, 2/4, 3/4.',
  observation_criteria= 'L''élève divise en parts égales; place correctement.',
  pda_link            = 'Situer des fractions sur une droite (0 à 1).'
WHERE title = 'Fractions sur la droite numérique' AND grade_level_tag = '3e-4e année';

UPDATE activity_templates SET
  trigger_text        = 'Rectangle divisé en 6 parties, 2 colorées visibles. Splat cache le reste.',
  open_question       = 'Combien de parties sont cachées? Quelle fraction cela représente-t-il?',
  expected_strategies = '6 − 2 = 4 cachées; 4/6 = 2/3.',
  observation_criteria= 'L''élève calcule le complément; simplifie.',
  pda_link            = 'Représenter des fractions; comprendre le complément.'
WHERE title = 'Splat — fractions cachées' AND grade_level_tag = '3e-4e année';

UPDATE activity_templates SET
  trigger_text        = '3/4 d''un cercle coloré et 3/4 d''un rectangle coloré.',
  open_question       = 'Est-ce la même fraction? Qu''est-ce qui est pareil et différent?',
  expected_strategies = 'Les deux montrent 3/4; forme différente mais fraction identique.',
  observation_criteria= 'L''élève comprend que 3/4 est la même fraction peu importe la forme.',
  pda_link            = 'Représenter une fraction de différentes façons.'
WHERE title = 'Associer fractions et images' AND grade_level_tag = '3e-4e année';

-- ── Section 3 : Opérations ────────────────────────────────────

UPDATE activity_templates SET
  trigger_text        = '198 + 45, sans papier.',
  open_question       = 'Comment calcules-tu de tête? Partage ta stratégie.',
  expected_strategies = 'Compenser (200 + 45 − 2 = 243); décomposer; bonds de dizaines.',
  observation_criteria= 'L''élève utilise une stratégie efficace; explique.',
  pda_link            = 'Calculer mentalement la somme.'
WHERE title = 'Addition mentale — 198 + 45' AND grade_level_tag = '3e-4e année';

UPDATE activity_templates SET
  trigger_text        = '503 − 298, sans crayon.',
  open_question       = 'Comment calcules-tu mentalement? Trouve deux stratégies.',
  expected_strategies = 'Compenser (503 − 300 + 2 = 205); ajouter au plus petit.',
  observation_criteria= 'L''élève choisit la stratégie adaptée.',
  pda_link            = 'Calculer mentalement la différence.'
WHERE title = 'Soustraction par compensation — 503 − 298' AND grade_level_tag = '3e-4e année';

UPDATE activity_templates SET
  trigger_text        = '4 × 13, sans algorithme écrit.',
  open_question       = 'Comment calcules-tu 4 × 13? Montre ta démarche.',
  expected_strategies = '4 × 10 + 4 × 3 = 52; doubler 2 × 13 = 26, puis × 2.',
  observation_criteria= 'L''élève utilise la distributivité ou le doublage.',
  pda_link            = 'Multiplier 1 chiffre × 2 chiffres.'
WHERE title = 'Multiplication et distributivité — 4 × 13' AND grade_level_tag = '3e-4e année';

UPDATE activity_templates SET
  trigger_text        = 'Afficher : 12, 18, 24, 25.',
  open_question       = 'Lequel est l''intrus? Trouve deux arguments.',
  expected_strategies = '25 n''est pas dans la table de 6; 25 seul impair; 25 est un carré parfait.',
  observation_criteria= 'L''élève identifie les multiples; utilise les propriétés des tables.',
  pda_link            = 'Maîtriser les tables de multiplication.'
WHERE title = 'Tables de multiplication — l''intrus' AND grade_level_tag = '3e-4e année';

UPDATE activity_templates SET
  trigger_text        = '24 biscuits ÷ 6 amis  vs  24 biscuits en sacs de 6.',
  open_question       = 'Est-ce la même opération? Qu''est-ce qui est pareil et différent?',
  expected_strategies = 'Les deux = 4; partage vs contenance.',
  observation_criteria= 'L''élève distingue les deux sens de la division.',
  pda_link            = 'Sens de la division : partage et contenance.'
WHERE title = 'Division — partage et contenance' AND grade_level_tag = '3e-4e année';

UPDATE activity_templates SET
  trigger_text        = '8 × 47, estimer avant de calculer.',
  open_question       = 'Estime sans calculer. Comment procèdes-tu?',
  expected_strategies = '8 × 50 = 400; encadrer entre 320 et 400.',
  observation_criteria= 'L''élève arrondit; estimation raisonnable.',
  pda_link            = 'Estimer le produit.'
WHERE title = 'Estimation du produit — 8 × 47' AND grade_level_tag = '3e-4e année';

UPDATE activity_templates SET
  trigger_text        = '4 groupes égaux, total 36. Splat cache le nombre par groupe.',
  open_question       = 'Combien par groupe? Quelle opération utilises-tu?',
  expected_strategies = '36 ÷ 4 = 9; vérifier 9 × 4 = 36.',
  observation_criteria= 'L''élève identifie la division; vérifie par multiplication.',
  pda_link            = 'Division; sens des opérations.'
WHERE title = 'Splat — opérations cachées' AND grade_level_tag = '3e-4e année';

UPDATE activity_templates SET
  trigger_text        = '3 × 7 et 7 × 3, avec tableaux de 3 rangées de 7 et 7 rangées de 3.',
  open_question       = 'Même résultat? Comment les images sont-elles pareilles et différentes?',
  expected_strategies = 'Les deux = 21; disposition différente; c''est la commutativité.',
  observation_criteria= 'L''élève identifie la propriété; vérifie.',
  pda_link            = 'Commutativité de la multiplication.'
WHERE title = 'Commutativité de la multiplication' AND grade_level_tag = '3e-4e année';

-- ── Section 4 : Géométrie ─────────────────────────────────────

UPDATE activity_templates SET
  trigger_text        = '4 triangles présentés : équilatéral, isocèle, scalène, rectangle.',
  open_question       = 'Lequel est l''intrus? Deux réponses possibles.',
  expected_strategies = 'Équilatéral : 3 côtés égaux; scalène : aucun côté égal; rectangle : angle 90°.',
  observation_criteria= 'L''élève utilise les propriétés pour classer.',
  pda_link            = 'Classer des triangles.'
WHERE title = 'Classification des triangles' AND grade_level_tag = '3e-4e année';

UPDATE activity_templates SET
  trigger_text        = 'Présenter : carré, rectangle, losange, pentagone.',
  open_question       = 'Laquelle n''est pas un quadrilatère? Pourquoi?',
  expected_strategies = 'Pentagone a 5 côtés, pas 4.',
  observation_criteria= 'L''élève reconnaît les quadrilatères; nomme les propriétés.',
  pda_link            = 'Identifier et classer des quadrilatères.'
WHERE title = 'Quadrilatères — l''intrus' AND grade_level_tag = '3e-4e année';

UPDATE activity_templates SET
  trigger_text        = 'Photo d''une fenêtre à carreaux.',
  open_question       = 'Identifie les parallèles et les perpendiculaires. Comment les reconnais-tu?',
  expected_strategies = 'Montants horizontaux parallèles; verticaux perpendiculaires aux horizontaux.',
  observation_criteria= 'L''élève utilise le vocabulaire précis.',
  pda_link            = 'Reconnaître parallèles et perpendiculaires.'
WHERE title = 'Parallèles et perpendiculaires' AND grade_level_tag = '3e-4e année';

UPDATE activity_templates SET
  trigger_text        = 'Image d''un papillon avec axe de symétrie vertical en pointillé.',
  open_question       = 'Ce papillon est-il symétrique? Comment peux-tu vérifier? Donne d''autres exemples.',
  expected_strategies = 'Plier sur l''axe; vérifier correspondance; exemples du quotidien.',
  observation_criteria= 'L''élève identifie l''axe; vérifie la symétrie.',
  pda_link            = 'Identifier des axes de symétrie.'
WHERE title = 'La symétrie' AND grade_level_tag = '3e-4e année';

UPDATE activity_templates SET
  trigger_text        = 'Un carré et un cube présentés côte à côte.',
  open_question       = 'Qu''est-ce qui est pareil? Qu''est-ce qui est différent?',
  expected_strategies = 'Carré = 2D, cube = 3D; cube a 6 faces carrées.',
  observation_criteria= 'L''élève distingue 2D/3D; utilise le vocabulaire (face, arête, sommet).',
  pda_link            = 'Distinguer figures planes et solides.'
WHERE title = 'Figures planes vs solides' AND grade_level_tag = '3e-4e année';

UPDATE activity_templates SET
  trigger_text        = 'Quadrillage avec la moitié gauche d''un dessin et un axe de symétrie vertical.',
  open_question       = 'Complète le dessin. Comment places-tu chaque point?',
  expected_strategies = 'Compter carrés depuis l''axe; placer le point symétrique à même distance.',
  observation_criteria= 'L''élève reproduit symétriquement; utilise le comptage.',
  pda_link            = 'Compléter une figure par réflexion.'
WHERE title = 'Compléter une figure symétrique' AND grade_level_tag = '3e-4e année';

UPDATE activity_templates SET
  trigger_text        = '4 solides (cube, cylindre, cône, prisme). Splat cache l''empreinte d''un solide. L''empreinte visible est un cercle.',
  open_question       = 'Lequel de ces solides à base circulaire a servi d''inspiration au nouveau jouet de Splat le chat?',
  expected_strategies = 'Cylindre et cône ont des faces circulaires.',
  observation_criteria= 'L''élève associe solide à empreinte.',
  pda_link            = 'Associer un solide à ses empreintes.'
WHERE title = 'Solides et empreintes' AND grade_level_tag = '3e-4e année';

-- ── Section 5 : Mesure ────────────────────────────────────────

UPDATE activity_templates SET
  trigger_text        = 'Bureau de classe, cahier de 30 cm visible comme référence.',
  open_question       = 'Quelle est la longueur du bureau? De la classe? Comment estimes-tu?',
  expected_strategies = 'Cahier comme référence; multiplier; convertir cm → m.',
  observation_criteria= 'L''élève utilise un référent; estimation réaliste.',
  pda_link            = 'Estimer et mesurer en cm, dm, m.'
WHERE title = 'Estimer des longueurs' AND grade_level_tag = '3e-4e année';

UPDATE activity_templates SET
  trigger_text        = 'Rectangle 8 cm × 5 cm, dimensions indiquées.',
  open_question       = 'Quel est le périmètre? Comment calcules-tu mentalement?',
  expected_strategies = '8 + 5 + 8 + 5 = 26 cm; ou 2 × (8 + 5) = 26 cm.',
  observation_criteria= 'L''élève calcule correctement; connaît la formule.',
  pda_link            = 'Calculer le périmètre d''un polygone.'
WHERE title = 'Le périmètre' AND grade_level_tag = '3e-4e année';

UPDATE activity_templates SET
  trigger_text        = 'Carré 4 × 4 et rectangle 2 × 6 sur quadrillage.',
  open_question       = 'Ont-ils le même périmètre? La même aire?',
  expected_strategies = 'Périmètres : 16 et 16 (identiques); aires : 16 et 12 (différentes).',
  observation_criteria= 'L''élève distingue périmètre et aire.',
  pda_link            = 'Distinguer périmètre et surface.'
WHERE title = 'Périmètre — même ou différent?' AND grade_level_tag = '3e-4e année';

UPDATE activity_templates SET
  trigger_text        = 'Horloge affichant 10 h 45.',
  open_question       = 'Combien de temps s''écoule entre 10 h 45 et 12 h 15?',
  expected_strategies = '10 h 45 → 12 h 00 = 1 h 15 min; + 15 min = 1 h 30 min.',
  observation_criteria= 'L''élève calcule des durées; utilise des bonds d''heures et minutes.',
  pda_link            = 'Calculer le temps écoulé.'
WHERE title = 'Mesurer le temps' AND grade_level_tag = '3e-4e année';

UPDATE activity_templates SET
  trigger_text        = '3 m = ? cm  et  250 cm = ? m ? cm.',
  open_question       = 'Comment convertis-tu les mètres en centimètres (et vice-versa)?',
  expected_strategies = '× 100 (3 m = 300 cm); 250 cm = 2 m 50 cm.',
  observation_criteria= 'L''élève connaît les relations; convertit mentalement.',
  pda_link            = 'Relations entre unités (m, dm, cm).'
WHERE title = 'Conversions m, dm, cm' AND grade_level_tag = '3e-4e année';

UPDATE activity_templates SET
  trigger_text        = 'Figure irrégulière en forme de T ou de L sur quadrillage.',
  open_question       = 'Quelle est la surface en carrés-unités? Trouve deux façons de compter.',
  expected_strategies = 'Compter un par un; découper en rectangles; encadrer et soustraire.',
  observation_criteria= 'L''élève utilise deux stratégies; obtient le même résultat.',
  pda_link            = 'Mesurer la surface avec des carrés-unités.'
WHERE title = 'Surface sur quadrillage' AND grade_level_tag = '3e-4e année';

UPDATE activity_templates SET
  trigger_text        = 'Rectangle : longueur 6 cm, périmètre 20 cm. Splat cache la largeur.',
  open_question       = 'Quelle est la largeur cachée? Comment l''as-tu trouvée?',
  expected_strategies = 'P = 2(L + l); 20 = 2(6 + l); l = 4 cm.',
  observation_criteria= 'L''élève isole la dimension inconnue; utilise la formule.',
  pda_link            = 'Trouver une dimension manquante à partir du périmètre.'
WHERE title = 'Splat — mesures cachées' AND grade_level_tag = '3e-4e année';

-- ── Section 6 : Statistique et probabilité ────────────────────

UPDATE activity_templates SET
  trigger_text        = 'Diagramme à bandes : animaux préférés de 60 élèves (chat, chien, poisson, hamster, lapin).',
  open_question       = 'Quel est l''animal le plus populaire? Quelle est la différence entre la bande du poisson et celle du chien?',
  expected_strategies = 'Lire les hauteurs des bandes; calculer la différence.',
  observation_criteria= 'L''élève lit correctement; calcule les différences.',
  pda_link            = 'Interpréter des diagrammes à bandes.'
WHERE title = 'Lire un diagramme à bandes' AND grade_level_tag = '3e-4e année';

UPDATE activity_templates SET
  trigger_text        = 'Pictogramme : livres lus par 5 élèves. 1 symbole = 2 livres.',
  open_question       = 'Combien de livres Maya a-t-elle lus? Qui en a lu le plus?',
  expected_strategies = 'Compter symboles × 2; additionner; comparer.',
  observation_criteria= 'L''élève interprète la légende; calcule.',
  pda_link            = 'Interpréter des pictogrammes.'
WHERE title = 'Lire un pictogramme' AND grade_level_tag = '3e-4e année';

UPDATE activity_templates SET
  trigger_text        = '4 diagrammes à bandes : 3 identiques, 1 différent.',
  open_question       = 'Lequel ne représente pas les mêmes données?',
  expected_strategies = 'Comparer les hauteurs dans chaque diagramme.',
  observation_criteria= 'L''élève compare; justifie avec des valeurs.',
  pda_link            = 'Représenter et interpréter des données.'
WHERE title = 'Diagrammes — lequel est l''intrus?' AND grade_level_tag = '3e-4e année';

UPDATE activity_templates SET
  trigger_text        = 'Sac opaque contenant 4 billes rouges et 3 bleues.',
  open_question       = 'Est-il certain, possible ou impossible de piger rouge? Et une bille verte?',
  expected_strategies = 'P(rouge) > P(bleue); impossible de piger vert.',
  observation_criteria= 'L''élève utilise le vocabulaire de probabilité.',
  pda_link            = 'Classer un événement : certain, possible, impossible.'
WHERE title = 'Probabilité — certain, possible, impossible' AND grade_level_tag = '3e-4e année';

UPDATE activity_templates SET
  trigger_text        = '20 lancers d''une pièce : 12 pile, 8 face. Théorique attendu : 10 et 10.',
  open_question       = 'Les résultats réels sont-ils pareils ou différents de l''attendu? Pourquoi?',
  expected_strategies = 'Théorique = 1/2; réel varie; plus on lance, plus ça se rapproche.',
  observation_criteria= 'L''élève distingue résultat attendu vs résultat réel.',
  pda_link            = 'Comparer résultats obtenus et résultats attendus.'
WHERE title = 'Expérience aléatoire — pièce de monnaie' AND grade_level_tag = '3e-4e année';

UPDATE activity_templates SET
  trigger_text        = 'Diagramme à 3 catégories, total 50. Visible : 15 et 20. Splat cache la 3ᵉ valeur.',
  open_question       = 'Quelle est la valeur cachée? Comment l''as-tu trouvée?',
  expected_strategies = '50 − 35 = 15; vérifier que le total est bien 50.',
  observation_criteria= 'L''élève utilise le complément; vérifie le total.',
  pda_link            = 'Opérations sur les données d''un diagramme.'
WHERE title = 'Splat — données cachées' AND grade_level_tag = '3e-4e année';

UPDATE activity_templates SET
  trigger_text        = 'Résultats d''un sondage : « Quel est ton dessert préféré? » présentés en diagramme.',
  open_question       = 'Y a-t-il des résultats surprenants? Comment améliorer ce sondage?',
  expected_strategies = 'Vérifier la clarté de la question; proposer des catégories; discuter de l''échantillon.',
  observation_criteria= 'L''élève analyse la question; propose des améliorations.',
  pda_link            = 'Formuler des questions de sondage.'
WHERE title = 'Formuler un sondage' AND grade_level_tag = '3e-4e année';
