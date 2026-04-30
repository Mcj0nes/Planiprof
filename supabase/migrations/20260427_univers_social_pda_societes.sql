-- Seed: Univers social — PDA 2009 — Détail Cycle 2
-- Ajoute les éléments manquants pour les sociétés autochtones comparées aux Iroquoiens
-- (Inuit, Mi'kmaq, Algonquins) ainsi que du détail supplémentaire pour les Iroquoiens (3e année)

DO $$
DECLARE
  us_id   int;
  g3      int;
  g4      int;
  c_geo   int;
  c_hist  int;
  c_cit   int;
BEGIN
  SELECT id INTO us_id  FROM subjects    WHERE slug = 'univers-social';
  SELECT id INTO g3     FROM grade_levels WHERE education_level = 'primaire' AND grade = 3;
  SELECT id INTO g4     FROM grade_levels WHERE education_level = 'primaire' AND grade = 4;
  SELECT id INTO c_geo  FROM competencies WHERE subject_id = us_id AND name_fr = 'Géographie et territoire';
  SELECT id INTO c_hist FROM competencies WHERE subject_id = us_id AND name_fr = 'Histoire et société';
  SELECT id INTO c_cit  FROM competencies WHERE subject_id = us_id AND name_fr = 'Éducation à la citoyenneté';

  -- ══════════════════════════════════════════════════════════════
  -- 3e ANNÉE — Iroquoiens vers 1500 (contenu additionnel)
  -- ══════════════════════════════════════════════════════════════
  INSERT INTO content_items (competency_id, grade_level_id, name_fr, sort_order) VALUES
    (c_geo,  g3, 'Comparer le territoire iroquoien avec celui d''une autre société autochtone (cartes)', 5),
    (c_geo,  g3, 'Aménagement du territoire : villages palissadés, champs de maïs, forêts exploitées', 6);

  INSERT INTO content_items (competency_id, grade_level_id, name_fr, sort_order) VALUES
    (c_hist, g3, 'Alimentation iroquoienne : les Trois Sœurs (maïs, courge, haricot), chasse, pêche', 5),
    (c_hist, g3, 'Rôle de l''enfant et transmission des savoirs dans la société iroquoienne', 6),
    (c_hist, g3, 'Confédération des Cinq Nations : alliances politiques entre nations iroquoiennes', 7);

  INSERT INTO content_items (competency_id, grade_level_id, name_fr, sort_order) VALUES
    (c_cit,  g3, 'Comparaison de la gouvernance iroquoienne avec les formes de gouvernance actuelles', 4);

  -- ══════════════════════════════════════════════════════════════
  -- 4e ANNÉE — Les Inuit vers 1500
  -- ══════════════════════════════════════════════════════════════
  INSERT INTO content_items (competency_id, grade_level_id, name_fr, sort_order) VALUES
    (c_geo,  g4, 'Localiser le territoire inuit : Arctique, Nunavik, côtes du Labrador, détroit d''Hudson', 10),
    (c_geo,  g4, 'Caractéristiques physiques du territoire inuit : toundra, banquise, ressources marines', 11);

  INSERT INTO content_items (competency_id, grade_level_id, name_fr, sort_order) VALUES
    (c_hist, g4, 'Mode de vie inuit vers 1500 : chasse (phoque, caribou, baleine), pêche, nomadisme', 10),
    (c_hist, g4, 'Habitations inuites : igloo (qarmaq) l''hiver, tente en peau de phoque l''été', 11),
    (c_hist, g4, 'Organisation sociale des Inuit : famille élargie, bande, rôle du chasseur et de l''aîné', 12),
    (c_hist, g4, 'Croyances et spiritualité inuites : animisme, angakkuq (chaman), respect des animaux', 13),
    (c_hist, g4, 'Outils et techniques inuits : kayak, umiak, traîneaux à chiens, harpons', 14);

  INSERT INTO content_items (competency_id, grade_level_id, name_fr, sort_order) VALUES
    (c_cit,  g4, 'Gouvernance inuite : conseil de bande, décisions collectives, rôle des aînés', 10);

  -- ══════════════════════════════════════════════════════════════
  -- 4e ANNÉE — Les Mi'kmaq (Micmacs) vers 1500
  -- ══════════════════════════════════════════════════════════════
  INSERT INTO content_items (competency_id, grade_level_id, name_fr, sort_order) VALUES
    (c_geo,  g4, 'Localiser le territoire mi''kmaq : Gaspésie, Maritimes, nord-est de l''Amérique', 20),
    (c_geo,  g4, 'Caractéristiques du territoire mi''kmaq : côtes maritimes, forêts, ressources halieutiques', 21);

  INSERT INTO content_items (competency_id, grade_level_id, name_fr, sort_order) VALUES
    (c_hist, g4, 'Mode de vie mi''kmaq vers 1500 : pêche, chasse, cueillette, semi-nomadisme saisonnier', 20),
    (c_hist, g4, 'Habitation mi''kmaque : wigwam en écorce de bouleau', 21),
    (c_hist, g4, 'Organisation sociale mi''kmaque : clans, sagamos (chefs), rôles selon l''âge et le genre', 22),
    (c_hist, g4, 'Croyances et spiritualité mi''kmaques : respect de la nature, Créateur, cérémonies', 23);

  INSERT INTO content_items (competency_id, grade_level_id, name_fr, sort_order) VALUES
    (c_cit,  g4, 'Gouvernance mi''kmaque : Grand Conseil, sagamos, prise de décision collective', 20);

  -- ══════════════════════════════════════════════════════════════
  -- 4e ANNÉE — Les Algonquins vers 1500
  -- ══════════════════════════════════════════════════════════════
  INSERT INTO content_items (competency_id, grade_level_id, name_fr, sort_order) VALUES
    (c_geo,  g4, 'Localiser le territoire algonquin : vallée de l''Outaouais, Laurentides, Abitibi', 30),
    (c_geo,  g4, 'Caractéristiques du territoire algonquin : forêts boréales, lacs, cours d''eau', 31);

  INSERT INTO content_items (competency_id, grade_level_id, name_fr, sort_order) VALUES
    (c_hist, g4, 'Mode de vie algonquin vers 1500 : chasse, pêche, cueillette, nomadisme saisonnier', 30),
    (c_hist, g4, 'Habitation algonquine : wigwam léger et démontable, adapté au nomadisme', 31),
    (c_hist, g4, 'Organisation sociale algonquine : bandes familiales, chef de bande, chamanes', 32),
    (c_hist, g4, 'Croyances algonquines : Manitou, animisme, rôle du rêve et des visions', 33);

  INSERT INTO content_items (competency_id, grade_level_id, name_fr, sort_order) VALUES
    (c_cit,  g4, 'Gouvernance algonquine : chef de bande, consensus, liens avec autres Algonquins', 30);

  -- ══════════════════════════════════════════════════════════════
  -- 4e ANNÉE — Comparaisons entre sociétés autochtones
  -- ══════════════════════════════════════════════════════════════
  INSERT INTO content_items (competency_id, grade_level_id, name_fr, sort_order) VALUES
    (c_hist, g4, 'Comparaison Iroquoiens — Inuit : territoire, alimentation, habitation, organisation sociale', 40),
    (c_hist, g4, 'Comparaison Iroquoiens — Mi''kmaq : territoire, mode de vie, habitation, gouvernance', 41),
    (c_hist, g4, 'Comparaison Iroquoiens — Algonquins : sédentarité vs nomadisme, agriculture vs chasse-cueillette', 42),
    (c_hist, g4, 'Facteurs explicatifs des différences entre sociétés autochtones : territoire, climat, ressources', 43),
    (c_hist, g4, 'Points communs entre sociétés autochtones : rapport à la nature, oralité, spiritualité animiste', 44);

  INSERT INTO content_items (competency_id, grade_level_id, name_fr, sort_order) VALUES
    (c_cit,  g4, 'Droits territoriaux et reconnaissance des nations autochtones (Inuit, Mi''kmaq, Algonquins) aujourd''hui', 40);

END $$;
