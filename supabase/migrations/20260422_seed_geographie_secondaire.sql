-- ============================================================
-- PLANIPROF -- Seed: Geographie, 1er cycle du secondaire
-- Source: Progression des apprentissages au secondaire
--   Geographie 1er cycle (Ministere de l'Education, 2010)
-- Niveaux : 1re secondaire (territoires urbains + touristique + forestier)
--           2e secondaire (territoires energetique, industriel, agricoles,
--                          autochtone, protege)
-- ============================================================

do $$
declare
  geo_id   int;
  s1 int; s2 int;

  c_lire   int;
  c_interp int;
  c_cito   int;

begin

  insert into subjects (name_fr, name_en, slug, color)
    values ('Geographie', 'Geography', 'geographie', '#0D9488')
    on conflict (slug) do nothing;

  select id into geo_id from subjects where slug = 'geographie';
  select id into s1 from grade_levels where education_level = 'secondaire' and grade = 1;
  select id into s2 from grade_levels where education_level = 'secondaire' and grade = 2;

  delete from plan_assignments pa
    using content_items ci
    join competencies co on co.id = ci.competency_id
    where ci.id = pa.content_item_id
      and co.subject_id = geo_id
      and ci.grade_level_id in (s1, s2);

  delete from content_items ci
    using competencies co
    where ci.competency_id = co.id
      and co.subject_id = geo_id
      and ci.grade_level_id in (s1, s2);

  delete from competencies where subject_id = geo_id;

  insert into competencies (subject_id, name_fr, color, sort_order)
    values (geo_id, 'Lire l''organisation d''un territoire', '#0D9488', 1)
    returning id into c_lire;

  insert into competencies (subject_id, name_fr, color, sort_order)
    values (geo_id, 'Interpreter un enjeu territorial', '#0F766E', 2)
    returning id into c_interp;

  insert into competencies (subject_id, name_fr, color, sort_order)
    values (geo_id, 'Construire sa conscience citoyenne a l''echelle planetaire', '#115E59', 3)
    returning id into c_cito;


  -- 1RE SECONDAIRE

  insert into content_items (competency_id, grade_level_id, name_fr, sort_order) values

    -- Metropole (obligatoire: Montreal + choix: Le Caire, Mexico, New York, Sydney)
    (c_lire,   s1, 'Territoire urbain -- Metropole : localisation; site; densite et population; lieux de concentration du pouvoir politique, economique et des services; quartiers, banlieues, reseaux de transport', 1),
    (c_interp, s1, 'Territoire urbain -- Metropole : enjeux du logement (bidonvilles, logements sociaux), des deplacements (congestion, transport en commun) et de la gestion des dechets et de l''eau potable dans des metropoles comme Montreal, Le Caire, Mexico, New York ou Sydney', 2),
    (c_cito,   s1, 'Territoire urbain -- Metropole : conscience citoyenne -- defis de l''urbanisation mondiale; responsabilite face a l''acces equitable au logement, a l''eau et aux services', 3),

    -- Ville soumise a des risques naturels (choix: Manille, Quito, San Francisco)
    (c_lire,   s1, 'Territoire urbain -- Ville soumise a des risques naturels : localisation et type de risques (seismes, volcans, typhons); lien entre site et risques; niveau de developpement du pays; mesures d''amenagement parasismique ou anti-inondation', 4),
    (c_interp, s1, 'Territoire urbain -- Ville soumise a des risques naturels : enjeux de la prevention et de la gestion des catastrophes; consequences pour la population selon le niveau de developpement economique (ex. Manille, Quito, San Francisco)', 5),
    (c_cito,   s1, 'Territoire urbain -- Ville soumise a des risques naturels : conscience citoyenne -- solidarite internationale face aux catastrophes; lien entre developpement economique et vulnerabilite des populations', 6),

    -- Ville patrimoniale (obligatoire: Quebec intra-muros + choix: Athenes, Paris, Rome, Beijing)
    (c_lire,   s1, 'Territoire urbain -- Ville patrimoniale : identification et localisation; criteres de valeur patrimoniale (UNESCO, OVPM); description du site classe; contraintes d''amenagement et infrastructures d''accueil des visiteurs', 7),
    (c_interp, s1, 'Territoire urbain -- Ville patrimoniale : enjeux de la conservation vs expansion urbaine; affluence touristique et degradation du site; obligations UNESCO; tension entre besoins des residents et preservation du patrimoine (ex. Quebec intra-muros, Paris, Rome)', 8),
    (c_cito,   s1, 'Territoire urbain -- Ville patrimoniale : conscience citoyenne -- responsabilite collective envers le patrimoine culturel mondial; role de l''UNESCO et des organismes patrimoniaux', 9),

    -- Territoire touristique
    (c_lire,   s1, 'Territoire region -- Territoire touristique : localisation; ressources naturelles et culturelles d''attraction; infrastructures d''hebergement et de transport; organisation spatiale du territoire', 10),
    (c_interp, s1, 'Territoire region -- Territoire touristique : enjeux du developpement touristique; impacts environnementaux et sociaux du tourisme de masse; strategies de developpement durable', 11),
    (c_cito,   s1, 'Territoire region -- Territoire touristique : conscience citoyenne -- tourisme responsable; preservation des milieux naturels et culturels pour les generations futures', 12),

    -- Territoire forestier
    (c_lire,   s1, 'Territoire region -- Territoire forestier : localisation et etendue; types de forets; organisation de la gestion forestiere; coupes, reboisement, amenagement forestier durable', 13),
    (c_interp, s1, 'Territoire region -- Territoire forestier : enjeux de l''exploitation vs preservation; effets de la deforestation; certifications forestieres; conflits entre interets economiques et environnementaux', 14),
    (c_cito,   s1, 'Territoire region -- Territoire forestier : conscience citoyenne -- consommation responsable de produits forestiers; role des forets dans les ecosystemes planetaires', 15);


  -- 2E SECONDAIRE

  insert into content_items (competency_id, grade_level_id, name_fr, sort_order) values

    -- Territoire energetique
    (c_lire,   s2, 'Territoire region -- Territoire energetique : localisation des ressources energetiques; types d''energie (hydraulique, fossilees, renouvelables); infrastructures de production et de distribution; organisation spatiale', 1),
    (c_interp, s2, 'Territoire region -- Territoire energetique : enjeux de la dependance energetique; impacts environnementaux de l''exploitation; transition energetique; conflits d''usage du territoire', 2),
    (c_cito,   s2, 'Territoire region -- Territoire energetique : conscience citoyenne -- consommation d''energie et empreinte ecologique; cooperation internationale pour la transition vers les energies renouvelables', 3),

    -- Territoire industriel
    (c_lire,   s2, 'Territoire region -- Territoire industriel : localisation des zones industrielles; types d''industries; facteurs d''implantation (ressources, main-d''oeuvre, transport, capital); organisation spatiale', 4),
    (c_interp, s2, 'Territoire region -- Territoire industriel : enjeux de la pollution industrielle; reconversion des zones en declin; conditions de travail; mondialisation et delocalisation des industries', 5),
    (c_cito,   s2, 'Territoire region -- Territoire industriel : conscience citoyenne -- impacts de la consommation sur les zones industrielles mondiales; responsabilite des consommateurs et des entreprises', 6),

    -- Territoire agricole national
    (c_lire,   s2, 'Territoire agricole -- Territoire agricole national : localisation; types de productions agricoles; organisation fonciere; systemes d''irrigation et d''amenagement; zonage agricole', 7),
    (c_interp, s2, 'Territoire agricole -- Territoire agricole national : enjeux de la securite alimentaire; etalement urbain sur les terres agricoles; agriculture intensive vs durable; protection du territoire agricole (ex. Loi de protection au Quebec)', 8),
    (c_cito,   s2, 'Territoire agricole -- Territoire agricole national : conscience citoyenne -- autonomie alimentaire; agriculture locale vs mondialisation; choix alimentaires et durabilite', 9),

    -- Territoire agricole soumis a des risques naturels
    (c_lire,   s2, 'Territoire agricole -- Territoire soumis a des risques naturels : localisation; types de risques (secheresse, inondation, erosion, volcanisme); caracteristiques de la production agricole; vulnerabilite des populations rurales', 10),
    (c_interp, s2, 'Territoire agricole -- Territoire soumis a des risques naturels : enjeux des crises alimentaires liees aux risques naturels; strategies d''adaptation; aide internationale vs autonomie locale', 11),
    (c_cito,   s2, 'Territoire agricole -- Territoire soumis a des risques naturels : conscience citoyenne -- solidarite face a l''insecurite alimentaire mondiale; effets des changements climatiques sur l''agriculture', 12),

    -- Territoire autochtone
    (c_lire,   s2, 'Territoire autochtone : localisation et etendue; occupation traditionnelle du territoire; modes de vie et d''exploitation des ressources; organisations politiques autochtones; reserves, traites et droits ancestraux', 13),
    (c_interp, s2, 'Territoire autochtone : enjeux de l''autodetermination et des droits territoriaux autochtones; impacts de l''exploitation des ressources sur les communautes; revendications et processus de reconciliation', 14),
    (c_cito,   s2, 'Territoire autochtone : conscience citoyenne -- reconnaissance des droits des peuples autochtones; reconciliation et coexistence; vision autochtone du rapport au territoire et a l''environnement', 15),

    -- Territoire protege
    (c_lire,   s2, 'Territoire protege : localisation et types (parcs nationaux, reserves naturelles, sites UNESCO); criteres de protection; reglementation des activites humaines; gestion et financement', 16),
    (c_interp, s2, 'Territoire protege : enjeux de la preservation de la biodiversite vs acces et developpement; pressions du tourisme; efficacite des politiques de conservation a l''echelle mondiale', 17),
    (c_cito,   s2, 'Territoire protege : conscience citoyenne -- responsabilite mondiale pour la preservation de la biodiversite; role des citoyens et des etats dans la protection des milieux naturels', 18);

end $$;