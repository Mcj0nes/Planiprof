-- Seed: Univers social — PDA 2009 — Cycle 3 (5e et 6e années)
-- Contenu additionnel : Nouvelle-France vers 1745 et société canadienne vers 1820

DO $$
DECLARE
  us_id   int;
  g5      int;
  g6      int;
  c_geo   int;
  c_hist  int;
  c_cit   int;
BEGIN
  SELECT id INTO us_id  FROM subjects     WHERE slug = 'univers-social';
  SELECT id INTO g5     FROM grade_levels WHERE education_level = 'primaire' AND grade = 5;
  SELECT id INTO g6     FROM grade_levels WHERE education_level = 'primaire' AND grade = 6;
  SELECT id INTO c_geo  FROM competencies WHERE subject_id = us_id AND name_fr = 'Géographie et territoire';
  SELECT id INTO c_hist FROM competencies WHERE subject_id = us_id AND name_fr = 'Histoire et société';
  SELECT id INTO c_cit  FROM competencies WHERE subject_id = us_id AND name_fr = 'Éducation à la citoyenneté';

  -- ══════════════════════════════════════════════════════════════
  -- 5e ANNÉE — La Nouvelle-France vers 1745 (contenu additionnel)
  -- ══════════════════════════════════════════════════════════════

  INSERT INTO content_items (competency_id, grade_level_id, name_fr, sort_order) VALUES
    (c_geo, g5, 'Carte de la Nouvelle-France vers 1745 : vallée du Saint-Laurent, Grands Lacs, Acadie, Mississippi', 10),
    (c_geo, g5, 'Principales villes et forts : Québec, Montréal, Trois-Rivières, Fort Frontenac', 11),
    (c_geo, g5, 'Voies navigables comme axes de développement : le Saint-Laurent et ses affluents', 12),
    (c_geo, g5, 'Territoire de la Nouvelle-France vs colonies britanniques : comparaison cartographique', 13);

  INSERT INTO content_items (competency_id, grade_level_id, name_fr, sort_order) VALUES
    (c_hist, g5, 'Organisation politique de la Nouvelle-France : gouverneur général, intendant, Conseil souverain', 10),
    (c_hist, g5, 'Système seigneurial : seigneurs, habitants, obligations réciproques, corvées, dîme au seigneur', 11),
    (c_hist, g5, 'Classes sociales en Nouvelle-France : noblesse, clergé, marchands, artisans, habitants (paysans)', 12),
    (c_hist, g5, 'Commerce des fourrures : traite, compagnies, coureurs des bois et voyageurs', 13),
    (c_hist, g5, 'Relations franco-autochtones : nations alliées (Hurons-Wendat, Algonquins), rôle des interprètes', 14),
    (c_hist, g5, 'Conflits avec les Iroquois des Cinq-Nations : impact sur la colonie', 15),
    (c_hist, g5, 'Exploration et expansion territoriale : Champlain, La Salle, La Vérendrye', 16),
    (c_hist, g5, 'Rôle de l''Église catholique : missions jésuites, hôpitaux, éducation (Ursulines, Sulpiciens)', 17),
    (c_hist, g5, 'Femmes en Nouvelle-France : Madeleine de Verchères, Marguerite Bourgeoys, Marie de l''Incarnation', 18),
    (c_hist, g5, 'Guerres coloniales franco-anglaises et leur impact sur la Nouvelle-France', 19);

  INSERT INTO content_items (competency_id, grade_level_id, name_fr, sort_order) VALUES
    (c_cit, g5, 'Comparaison du système de gouvernance de la Nouvelle-France avec celui du Québec actuel', 10),
    (c_cit, g5, 'Qui détient le pouvoir en Nouvelle-France? Qui en est exclu? Réflexion sur les inégalités', 11);

  -- ══════════════════════════════════════════════════════════════
  -- 6e ANNÉE — Société canadienne vers 1820 (contenu additionnel)
  -- ══════════════════════════════════════════════════════════════

  INSERT INTO content_items (competency_id, grade_level_id, name_fr, sort_order) VALUES
    (c_geo, g6, 'Proclamation royale de 1763 : nouveaux territoires sous régime britannique (carte)', 10),
    (c_geo, g6, 'Acte constitutionnel de 1791 : création du Haut-Canada et du Bas-Canada (cartes, frontières)', 11),
    (c_geo, g6, 'Croissance des villes vers 1820 : Québec et Montréal, fonctions économiques et sociales', 12);

  INSERT INTO content_items (competency_id, grade_level_id, name_fr, sort_order) VALUES
    (c_hist, g6, 'Proclamation royale de 1763 : nouvelles règles pour les Canadiens sous l''Empire britannique', 10),
    (c_hist, g6, 'Acte de Québec de 1774 : reconnaissance des droits religieux, civils et linguistiques des Canadiens', 11),
    (c_hist, g6, 'Acte constitutionnel de 1791 : création du Bas-Canada, première Chambre d''assemblée', 12),
    (c_hist, g6, 'Classes sociales vers 1820 : marchands anglais, bourgeoisie canadienne-française, habitants, artisans', 13),
    (c_hist, g6, 'Le Parti canadien (Parti patriote) : Louis-Joseph Papineau et les 92 Résolutions', 14),
    (c_hist, g6, 'Économie vers 1820 : passage du commerce des fourrures au commerce du bois équarri', 15),
    (c_hist, g6, 'Rôle de l''Église catholique sous le régime britannique : survivance culturelle et sociale', 16),
    (c_hist, g6, 'Condition des femmes vers 1820 : droits limités, rôle familial, femmes notables', 17);

  INSERT INTO content_items (competency_id, grade_level_id, name_fr, sort_order) VALUES
    (c_cit, g6, 'La Chambre d''assemblée du Bas-Canada : première expérience démocratique des Canadiens français', 10),
    (c_cit, g6, 'Les Rébellions de 1837-1838 : causes, acteurs (Patriotes), conséquences (Acte d''Union 1840)', 11),
    (c_cit, g6, 'Comparaison des droits politiques en 1820 avec ceux du Québec aujourd''hui', 12);

END $$;
