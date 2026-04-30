-- Table: activity_templates (pre-loaded activities visible to all authenticated users)
CREATE TABLE IF NOT EXISTS activity_templates (
  id              uuid    DEFAULT gen_random_uuid() PRIMARY KEY,
  title           text    NOT NULL,
  description     text,
  subject_id      integer REFERENCES subjects(id) ON DELETE SET NULL,
  type_tag        text,
  duration_min    integer CHECK (duration_min > 0),
  grade_level_tag text,
  category        text,
  created_at      timestamptz DEFAULT now()
);

ALTER TABLE activity_templates ENABLE ROW LEVEL SECURITY;
CREATE POLICY "tpl_select" ON activity_templates FOR SELECT TO authenticated USING (true);

-- Seed: Causeries mathématiques — 3e cycle (5e-6e année)
DO $$
DECLARE
  math_id integer;
BEGIN
  SELECT id INTO math_id FROM subjects WHERE name_fr ILIKE '%math%' ORDER BY id LIMIT 1;

  INSERT INTO activity_templates (title, description, subject_id, type_tag, duration_min, grade_level_tag, category) VALUES

  -- ── 1. Nombres ────────────────────────────────────────────────
  ('La valeur de position jusqu''à 1 000 000',
   'Afficher 847 293. Quelle est la valeur de chaque chiffre? Comment le sais-tu?',
   math_id, 'Number Talk', 15, '5e-6e année', 'Causerie — Nombres'),

  ('Décomposition de nombres',
   '45 000 = 40 000 + 5 000 et 44 000 + 1 000. Ces deux décompositions représentent-elles le même nombre?',
   math_id, 'Pareil mais différent', 15, '5e-6e année', 'Causerie — Nombres'),

  ('Comparaison de grands nombres',
   'Afficher 305 200, 350 200, 305 020, 503 200. Lequel ne va pas avec les autres? Pourquoi?',
   math_id, 'QELI', 15, '5e-6e année', 'Causerie — Nombres'),

  ('Estimation de grandes quantités',
   'Image d''un stade, section de 250 personnes identifiée. Combien de personnes dans tout le stade?',
   math_id, 'Estimation', 15, '5e-6e année', 'Causerie — Nombres'),

  ('Nombres pairs, impairs et carrés',
   'Afficher 16, 25, 36, 48. Lequel ne fait pas partie du groupe? Trouve au moins deux arguments.',
   math_id, 'QELI', 15, '5e-6e année', 'Causerie — Nombres'),

  ('Situer un nombre sur la droite numérique',
   'Droite de 0 à 1 000 000 avec repères; point mystère aux ¾. Quel nombre pourrait se trouver à cet endroit?',
   math_id, 'Image ouverte', 15, '5e-6e année', 'Causerie — Nombres'),

  ('Arrondir au bon ordre de grandeur',
   '678 432 — arrondir à la dizaine de mille, puis à la centaine de mille. Explique ta règle.',
   math_id, 'Number Talk', 15, '5e-6e année', 'Causerie — Nombres'),

  -- ── 2. Fractions et décimaux ──────────────────────────────────
  ('Fractions équivalentes',
   'Cercle en 4 parts avec 2 colorées (2/4) et cercle en 2 parts avec 1 colorée (1/2). Même quantité? Trouve d''autres fractions équivalentes.',
   math_id, 'Pareil mais différent', 15, '5e-6e année', 'Causerie — Fractions et décimaux'),

  ('Comparer des fractions',
   '3/4, 6/8, 9/12, 5/8 — Laquelle est l''intruse? Justifie.',
   math_id, 'QELI', 15, '5e-6e année', 'Causerie — Fractions et décimaux'),

  ('Pourcentage, fraction et décimal',
   '75 % — Exprime en fraction et en décimal. Et 40 %? Explique le lien entre les trois représentations.',
   math_id, 'Number Talk', 15, '5e-6e année', 'Causerie — Fractions et décimaux'),

  ('Ordonner des nombres décimaux',
   '3,45 — 3,405 — 3,5 — 3,045 — Place-les en ordre du plus petit au plus grand. Comment procèdes-tu?',
   math_id, 'Estimation', 15, '5e-6e année', 'Causerie — Fractions et décimaux'),

  ('Fraction d''un tout',
   'Tablette de chocolat 4×6 (24 carrés), 9 mangés. Quelle fraction a été mangée? Restante? Simplifie.',
   math_id, 'Image ouverte', 15, '5e-6e année', 'Causerie — Fractions et décimaux'),

  ('Splat — fractions et pourcentages',
   'Cercle de 100 éléments, 35 visibles, reste sous Splat. Combien sont cachés? Quelle fraction? Quel pourcentage?',
   math_id, 'Splat', 15, '5e-6e année', 'Causerie — Fractions et décimaux'),

  ('Placer des fractions sur la droite',
   'Droite de 0 à 2 avec repères 0, 1/2, 1, 3/2, 2; points mystères à 1/4 et 7/4. Quels nombres?',
   math_id, 'Image ouverte', 15, '5e-6e année', 'Causerie — Fractions et décimaux'),

  -- ── 3. Opérations ─────────────────────────────────────────────
  ('Addition mentale — 398 + 276',
   '398 + 276 — Comment calcules-tu de tête? Partage ta stratégie.',
   math_id, 'Number Talk', 15, '5e-6e année', 'Causerie — Opérations'),

  ('Soustraction par compensation — 1 003 − 597',
   '1 003 − 597 — Trouve deux stratégies différentes et compare leur efficacité.',
   math_id, 'Number Talk', 15, '5e-6e année', 'Causerie — Opérations'),

  ('Multiplication et distributivité — 6 × 14',
   '6 × 14 — Calcule sans utiliser l''algorithme. Montre ta stratégie.',
   math_id, 'Number Talk', 15, '5e-6e année', 'Causerie — Opérations'),

  ('Division et multiplication — 144 ÷ 6',
   '144 ÷ 6 — Comment utilises-tu la multiplication pour trouver ta réponse?',
   math_id, 'Number Talk', 15, '5e-6e année', 'Causerie — Opérations'),

  ('Commutativité et associativité',
   '(3 × 5) × 2 et 3 × (5 × 2) — Toujours le même résultat? Nomme la propriété et vérifie avec la soustraction.',
   math_id, 'Pareil mais différent', 15, '5e-6e année', 'Causerie — Opérations'),

  ('Estimation du produit — 48 × 23',
   '48 × 23 — Estime sans calculer. Quelle est ta stratégie d''arrondissement?',
   math_id, 'Estimation', 15, '5e-6e année', 'Causerie — Opérations'),

  ('Splat — opérations cachées',
   '3 groupes égaux, total 72, taille de groupe cachée. Quelle opération utilises-tu? Vérifie ta réponse.',
   math_id, 'Splat', 15, '5e-6e année', 'Causerie — Opérations'),

  ('Priorité des opérations — 3 + 4 × 5',
   '3 + 4 × 5 — Pourquoi la réponse n''est-elle pas 35? Explique la règle de priorité.',
   math_id, 'Number Talk', 15, '5e-6e année', 'Causerie — Opérations'),

  -- ── 4. Géométrie ──────────────────────────────────────────────
  ('Quadrilatères — Quel est l''intrus?',
   'Carré, rectangle, losange, trapèze — Lequel est l''intrus? Deux réponses possibles.',
   math_id, 'QELI', 15, '5e-6e année', 'Causerie — Géométrie'),

  ('Parallèles, perpendiculaires et sécantes',
   'Plan de ville — Identifie les droites parallèles, perpendiculaires et sécantes. Utilise le vocabulaire précis.',
   math_id, 'Image ouverte', 15, '5e-6e année', 'Causerie — Géométrie'),

  ('Polygones réguliers vs irréguliers',
   'Hexagone régulier et hexagone irrégulier — Qu''est-ce qui est pareil? Qu''est-ce qui est différent?',
   math_id, 'Pareil mais différent', 15, '5e-6e année', 'Causerie — Géométrie'),

  ('Réflexion et symétrie axiale',
   'Papillon avec axe vertical — Comment vérifies-tu que la figure est symétrique?',
   math_id, 'Image ouverte', 15, '5e-6e année', 'Causerie — Géométrie'),

  ('Translation dans un plan cartésien',
   'Triangle (1,1),(3,1),(2,3); flèche (4 droite, 2 haut) — Quelles sont les nouvelles coordonnées des sommets?',
   math_id, 'Number Talk', 15, '5e-6e année', 'Causerie — Géométrie'),

  ('Rotation d''un quart de tour',
   'Lettre L, centre identifié, rotation horaire — Dessine le résultat. Comment appliques-tu la règle?',
   math_id, 'Image ouverte', 15, '5e-6e année', 'Causerie — Géométrie'),

  ('Splat — 4e sommet d''un carré',
   'Points (2,1),(5,1),(5,4); 4e sommet d''un carré caché. Quelles sont les coordonnées manquantes?',
   math_id, 'Splat', 15, '5e-6e année', 'Causerie — Géométrie'),

  -- ── 5. Mesure ─────────────────────────────────────────────────
  ('Estimer le périmètre d''un objet',
   'Pupitre + crayon (18 cm) comme référence. Quel est le périmètre approximatif du pupitre?',
   math_id, 'Estimation', 15, '5e-6e année', 'Causerie — Mesure'),

  ('Aire de figures décomposées',
   'Figure en L sur quadrillage — Trouve deux façons différentes de calculer l''aire.',
   math_id, 'Image ouverte', 15, '5e-6e année', 'Causerie — Mesure'),

  ('Périmètre vs aire',
   'Rectangle 3×6 cm et rectangle 4×5 cm — Ont-ils le même périmètre? La même aire? Qu''est-ce qui est pareil?',
   math_id, 'Pareil mais différent', 15, '5e-6e année', 'Causerie — Mesure'),

  ('Volume avec cubes-unités',
   'Prisme 4×3×2 avec des cubes cachés à l''intérieur — Combien de cubes au total? Comment le sais-tu?',
   math_id, 'Estimation', 15, '5e-6e année', 'Causerie — Mesure'),

  ('Conversions de longueur',
   '3,5 km = ? m ; 4 200 m = ? km — Quelle est ta stratégie mentale? Quel lien entre les unités?',
   math_id, 'Number Talk', 15, '5e-6e année', 'Causerie — Mesure'),

  ('Estimation d''angles',
   '4 angles d''environ 45°, 90°, 120°, 160° — Aigu, droit ou obtus? Quelle mesure approximative?',
   math_id, 'Estimation', 15, '5e-6e année', 'Causerie — Mesure'),

  ('Splat — dimension cachée d''un rectangle',
   'Rectangle L=8 cm, A=56 cm², largeur cachée — Quelle est la largeur? Quelle opération utilises-tu?',
   math_id, 'Splat', 15, '5e-6e année', 'Causerie — Mesure'),

  -- ── 6. Statistique et probabilité ────────────────────────────
  ('Interpréter un diagramme à bandes',
   'Fruits préférés de 120 élèves — Lequel est le plus populaire? Calcule la différence et la fraction.',
   math_id, 'Image ouverte', 15, '5e-6e année', 'Causerie — Statistique et probabilité'),

  ('Moyenne, mode et médiane',
   'Notes : 72, 85, 85, 90, 68 — Calcule la moyenne, le mode et la médiane. Quelle est la différence?',
   math_id, 'Number Talk', 15, '5e-6e année', 'Causerie — Statistique et probabilité'),

  ('Quel diagramme est l''intrus?',
   'Diagramme à bandes, circulaire, ligne brisée, pictogramme — Lequel montre des données différentes?',
   math_id, 'QELI', 15, '5e-6e année', 'Causerie — Statistique et probabilité'),

  ('Probabilité simple',
   'Sac : 3 rouges, 5 bleues, 2 vertes — Quelle est la probabilité de piger une bille bleue? Rouge? Jaune?',
   math_id, 'Estimation', 15, '5e-6e année', 'Causerie — Statistique et probabilité'),

  ('Probabilité théorique vs expérimentale',
   '60 lancers d''un dé; le 3 est sorti 15 fois (théorique : 10). Pareil ou différent? Et avec 600 lancers?',
   math_id, 'Pareil mais différent', 15, '5e-6e année', 'Causerie — Statistique et probabilité'),

  ('Splat — donnée cachée dans un diagramme',
   'Total 80 élèves; bandes 15, 25, 20; 4e bande cachée. Quelle est la valeur manquante?',
   math_id, 'Splat', 15, '5e-6e année', 'Causerie — Statistique et probabilité'),

  ('Sondage et biais',
   'Sport préféré demandé seulement à l''équipe de soccer. Ce sondage est-il fiable? Comment l''améliorer?',
   math_id, 'Image ouverte', 15, '5e-6e année', 'Causerie — Statistique et probabilité');

END $$;
