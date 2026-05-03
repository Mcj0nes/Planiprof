-- Mathématique primaire — éléments PDA manquants
-- Ajoute : Statistique (formuler questions), Probabilité 3e année,
--          Géométrie (Relation d'Euler, frises cycle 1), Mesure températures 2e cycle

DO $$
DECLARE
  math_id  int;
  g1 int; g2 int; g3 int; g4 int; g5 int; g6 int;
  c_stat   int;
  c_proba  int;
  c_geo    int;
  c_mesure int;
BEGIN
  SELECT id INTO math_id FROM subjects WHERE slug = 'maths';

  SELECT id INTO g1 FROM grade_levels WHERE education_level = 'primaire' AND grade = 1;
  SELECT id INTO g2 FROM grade_levels WHERE education_level = 'primaire' AND grade = 2;
  SELECT id INTO g3 FROM grade_levels WHERE education_level = 'primaire' AND grade = 3;
  SELECT id INTO g4 FROM grade_levels WHERE education_level = 'primaire' AND grade = 4;
  SELECT id INTO g5 FROM grade_levels WHERE education_level = 'primaire' AND grade = 5;
  SELECT id INTO g6 FROM grade_levels WHERE education_level = 'primaire' AND grade = 6;

  SELECT id INTO c_stat   FROM competencies WHERE subject_id = math_id AND name_fr = 'Statistique';
  SELECT id INTO c_proba  FROM competencies WHERE subject_id = math_id AND name_fr = 'Probabilité';
  SELECT id INTO c_geo    FROM competencies WHERE subject_id = math_id AND name_fr = 'Géométrie';
  SELECT id INTO c_mesure FROM competencies WHERE subject_id = math_id AND name_fr = 'Mesure';

  -- Idempotency guard
  IF EXISTS (
    SELECT 1 FROM content_items
    WHERE competency_id = c_stat AND grade_level_id = g1
      AND name_fr = 'Formuler des questions d''enquête et planifier une collecte de données'
    LIMIT 1
  ) THEN RETURN; END IF;

  -- ════════════════════════════════════════════════════════════
  -- STATISTIQUE — Formuler des questions d'enquête (PDA item 1)
  -- Manquant pour tous les niveaux
  -- ════════════════════════════════════════════════════════════

  INSERT INTO content_items (competency_id, grade_level_id, name_fr, sort_order) VALUES
    (c_stat, g1, 'Formuler des questions d''enquête et planifier une collecte de données', 0),
    (c_stat, g2, 'Formuler des questions d''enquête et planifier une collecte de données', 0),
    (c_stat, g3, 'Formuler des questions d''enquête et planifier une collecte de données', 0),
    (c_stat, g4, 'Formuler des questions d''enquête et planifier une collecte de données', 0),
    (c_stat, g5, 'Formuler des questions d''enquête et planifier une collecte de données', 0),
    (c_stat, g6, 'Formuler des questions d''enquête et planifier une collecte de données', 0);

  -- ════════════════════════════════════════════════════════════
  -- PROBABILITÉ — 3e année : items manquants
  -- La PDA couvre les items 1-8 dès le 2e cycle; on n'avait qu'un seul item
  -- ════════════════════════════════════════════════════════════

  INSERT INTO content_items (competency_id, grade_level_id, name_fr, sort_order) VALUES
    (c_proba, g3, 'Expérimenter des activités liées au hasard avec du matériel varié (dés, roulettes, billes)', 2),
    (c_proba, g3, 'Reconnaître la variabilité des résultats possibles lors d''une expérience aléatoire', 3),
    (c_proba, g3, 'Distinguer la prédiction du résultat obtenu lors d''une expérience', 4),
    (c_proba, g3, 'Colliger des résultats d''expériences aléatoires dans un tableau ou un diagramme', 5);

  -- ════════════════════════════════════════════════════════════
  -- GÉOMÉTRIE — Relation d'Euler (3e cycle)
  -- PDA item B.9 Géométrie : polyèdres convexes
  -- ════════════════════════════════════════════════════════════

  INSERT INTO content_items (competency_id, grade_level_id, name_fr, sort_order) VALUES
    (c_geo, g5, 'Expérimenter la relation d''Euler sur des polyèdres convexes (F + S − A = 2)', 20),
    (c_geo, g6, 'Appliquer la relation d''Euler pour vérifier ou déduire des propriétés des polyèdres', 20);

  -- ════════════════════════════════════════════════════════════
  -- MESURE — Températures (PDA section H)
  -- 2e cycle : estimer et mesurer en degrés Celsius
  -- ════════════════════════════════════════════════════════════

  INSERT INTO content_items (competency_id, grade_level_id, name_fr, sort_order) VALUES
    (c_mesure, g3, 'Estimer et mesurer des températures en degrés Celsius dans des contextes variés', 14),
    (c_mesure, g4, 'Comparer et convertir des mesures de température dans des situations réelles', 13);

  -- ════════════════════════════════════════════════════════════
  -- GÉOMÉTRIE — Frises et dallages 1er cycle
  -- La PDA indique que les frises débutent en 1er cycle avec la réflexion
  -- (déjà partiellement en 2e année via _pda_complet; complète pour 1re année)
  -- ════════════════════════════════════════════════════════════

  INSERT INTO content_items (competency_id, grade_level_id, name_fr, sort_order) VALUES
    (c_geo, g1, 'Observer et produire des régularités à l''aide de figures géométriques (frises simples)', 14),
    (c_geo, g2, 'Observer et produire des frises et dallages à l''aide de la réflexion (symétrie)', 14);

END $$;
