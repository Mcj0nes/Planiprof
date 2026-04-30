-- Seed: Univers social — PDA 2009 — 6e année
-- Éléments manquants : Inuit et Mi'kmaq contemporains,
-- comparaison société démocratique vs non démocratique

DO $$
DECLARE
  us_id   int;
  g6      int;
  c_geo   int;
  c_hist  int;
  c_cit   int;
BEGIN
  SELECT id INTO us_id  FROM subjects     WHERE slug = 'univers-social';
  SELECT id INTO g6     FROM grade_levels WHERE education_level = 'primaire' AND grade = 6;
  SELECT id INTO c_geo  FROM competencies WHERE subject_id = us_id AND name_fr = 'Géographie et territoire';
  SELECT id INTO c_hist FROM competencies WHERE subject_id = us_id AND name_fr = 'Histoire et société';
  SELECT id INTO c_cit  FROM competencies WHERE subject_id = us_id AND name_fr = 'Éducation à la citoyenneté';

  -- ══════════════════════════════════════════════════════════════
  -- 6e ANNÉE — Les Inuit aujourd'hui
  -- ══════════════════════════════════════════════════════════════

  INSERT INTO content_items (competency_id, grade_level_id, name_fr, sort_order) VALUES
    (c_geo,  g6, 'Territoire inuit contemporain : Nunavut, Nunavik (Québec), Nunatsiavut (Labrador)', 20),
    (c_geo,  g6, 'Enjeux territoriaux des Inuit : ressources naturelles, changements climatiques, passage du Nord-Ouest', 21);

  INSERT INTO content_items (competency_id, grade_level_id, name_fr, sort_order) VALUES
    (c_hist, g6, 'Création du territoire du Nunavut en 1999 : revendications, négociations, autonomie', 20),
    (c_hist, g6, 'Mode de vie des Inuit aujourd''hui : continuité culturelle et transformations contemporaines', 21),
    (c_hist, g6, 'Défis des communautés inuites : isolement géographique, coûts de la vie, enjeux sociaux', 22);

  INSERT INTO content_items (competency_id, grade_level_id, name_fr, sort_order) VALUES
    (c_cit,  g6, 'Gouvernance inuite contemporaine : Gouvernement du Nunavut, Nunavik et droits collectifs', 20),
    (c_cit,  g6, 'Droits et revendications des Inuit : droits territoriaux, Convention de la Baie-James (1975)', 21);

  -- ══════════════════════════════════════════════════════════════
  -- 6e ANNÉE — Les Mi'kmaq aujourd'hui
  -- ══════════════════════════════════════════════════════════════

  INSERT INTO content_items (competency_id, grade_level_id, name_fr, sort_order) VALUES
    (c_geo,  g6, 'Territoire mi''kmaq contemporain : Gaspésie (Québec), Maritimes, Terre-Neuve', 30),
    (c_geo,  g6, 'Enjeux territoriaux mi''kmaq : droits de pêche, gestion des ressources côtières', 31);

  INSERT INTO content_items (competency_id, grade_level_id, name_fr, sort_order) VALUES
    (c_hist, g6, 'Histoire mi''kmaque sous la colonisation : traités, dépossessions, réserves', 30),
    (c_hist, g6, 'Renaissance culturelle mi''kmaque : langue, traditions, transmission aux jeunes', 31);

  INSERT INTO content_items (competency_id, grade_level_id, name_fr, sort_order) VALUES
    (c_cit,  g6, 'Gouvernance mi''kmaque contemporaine : conseils de bande, Grand Conseil Wabanaki', 30),
    (c_cit,  g6, 'Droits des Mi''kmaq : arrêt Marshall (1999), droits de pêche et de chasse reconnus', 31);

  -- ══════════════════════════════════════════════════════════════
  -- 6e ANNÉE — Comparaison Inuit — Mi'kmaq
  -- ══════════════════════════════════════════════════════════════

  INSERT INTO content_items (competency_id, grade_level_id, name_fr, sort_order) VALUES
    (c_hist, g6, 'Comparaison Inuit — Mi''kmaq : territoire, histoire coloniale, défis contemporains', 40),
    (c_hist, g6, 'Points communs et différences dans les revendications autochtones actuelles (Inuit et Mi''kmaq)', 41);

  INSERT INTO content_items (competency_id, grade_level_id, name_fr, sort_order) VALUES
    (c_cit,  g6, 'Responsabilité des citoyens canadiens envers les droits des peuples autochtones', 40);

  -- ══════════════════════════════════════════════════════════════
  -- 6e ANNÉE — Société démocratique vs société non démocratique
  -- ══════════════════════════════════════════════════════════════

  INSERT INTO content_items (competency_id, grade_level_id, name_fr, sort_order) VALUES
    (c_hist, g6, 'Caractéristiques d''une société démocratique : élections libres, droits individuels, séparation des pouvoirs', 50),
    (c_hist, g6, 'Caractéristiques d''une société non démocratique : pouvoir concentré, absence d''élections libres, censure', 51),
    (c_hist, g6, 'Le régime colonial vers 1820 : démocratie en formation ou régime non démocratique? Arguments des deux côtés', 52),
    (c_hist, g6, 'Exemples historiques de sociétés non démocratiques vs démocratiques (monarchie absolue, dictature, démocratie)', 53);

  INSERT INTO content_items (competency_id, grade_level_id, name_fr, sort_order) VALUES
    (c_cit,  g6, 'Valeurs d''une société démocratique : liberté, égalité, justice, participation citoyenne', 50),
    (c_cit,  g6, 'Comparer les droits des citoyens canadiens en 1820 avec ceux d''aujourd''hui : progrès et limites', 51),
    (c_cit,  g6, 'Enjeux actuels de la démocratie : désinformation, participation électorale, représentation', 52),
    (c_cit,  g6, 'Rôle du citoyen dans une démocratie : voter, s''informer, participer, revendiquer', 53);

END $$;
