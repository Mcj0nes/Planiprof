-- ============================================================
-- PLANIPROF — Seed: Sciences et technologie + Univers social, primaire
-- Based on the Quebec Progression des apprentissages (PDA) 2009
-- ============================================================

do $$
declare
  sci_id  int;
  us_id   int;
  g1 int; g2 int; g3 int; g4 int; g5 int; g6 int;

  c_mat   int;
  c_viv   int;
  c_ter   int;
  c_tech  int;

  c_geo   int;
  c_hist  int;
  c_cit   int;

begin

  select id into sci_id from subjects where slug = 'sciences';
  select id into us_id  from subjects where slug = 'univers-social';

  select id into g1 from grade_levels where education_level = 'primaire' and grade = 1;
  select id into g2 from grade_levels where education_level = 'primaire' and grade = 2;
  select id into g3 from grade_levels where education_level = 'primaire' and grade = 3;
  select id into g4 from grade_levels where education_level = 'primaire' and grade = 4;
  select id into g5 from grade_levels where education_level = 'primaire' and grade = 5;
  select id into g6 from grade_levels where education_level = 'primaire' and grade = 6;

  -- Nettoyage si re-exécution
  delete from plan_assignments where content_item_id in (
    select id from content_items where competency_id in (
      select id from competencies where subject_id in (sci_id, us_id)
    )
  );
  delete from day_periods where content_item_id in (
    select id from content_items where competency_id in (
      select id from competencies where subject_id in (sci_id, us_id)
    )
  );
  delete from content_items where competency_id in (select id from competencies where subject_id in (sci_id, us_id));
  delete from competencies where subject_id in (sci_id, us_id);


  -- ════════════════════════════════════════════════════════════
  -- SCIENCES ET TECHNOLOGIE
  -- ════════════════════════════════════════════════════════════

  insert into competencies (subject_id, name_fr, color, sort_order) values
    (sci_id, 'Univers matériel', '#059669', 10) returning id into c_mat;
  insert into competencies (subject_id, name_fr, color, sort_order) values
    (sci_id, 'Univers vivant', '#16A34A', 20) returning id into c_viv;
  insert into competencies (subject_id, name_fr, color, sort_order) values
    (sci_id, 'Terre et espace', '#0D9488', 30) returning id into c_ter;
  insert into competencies (subject_id, name_fr, color, sort_order) values
    (sci_id, 'Technologie', '#0891B2', 40) returning id into c_tech;

  -- 1re année
  insert into content_items (competency_id, grade_level_id, name_fr, sort_order) values
    (c_mat,  g1, 'Propriétés des matériaux : dur/mou, lourd/léger, souple/rigide', 1),
    (c_mat,  g1, 'États de la matière : solide, liquide, gazeux', 2),
    (c_mat,  g1, 'Changements d''état observables : fonte de la glace, évaporation', 3);
  insert into content_items (competency_id, grade_level_id, name_fr, sort_order) values
    (c_viv,  g1, 'Caractéristiques des êtres vivants : croissance, nutrition, reproduction', 1),
    (c_viv,  g1, 'Parties d''une plante : racine, tige, feuille, fleur, fruit, graine', 2),
    (c_viv,  g1, 'Besoins essentiels des animaux : nourriture, eau, abri, air', 3);
  insert into content_items (competency_id, grade_level_id, name_fr, sort_order) values
    (c_ter,  g1, 'Phénomènes météorologiques : pluie, neige, vent, soleil, nuages', 1),
    (c_ter,  g1, 'Les quatre saisons et leurs caractéristiques', 2);
  insert into content_items (competency_id, grade_level_id, name_fr, sort_order) values
    (c_tech, g1, 'Objets techniques de la vie quotidienne et leur fonction', 1),
    (c_tech, g1, 'Matériaux utilisés pour fabriquer des objets', 2);

  -- 2e année
  insert into content_items (competency_id, grade_level_id, name_fr, sort_order) values
    (c_mat,  g2, 'Mélanges simples et séparation (filtration, décantation)', 1),
    (c_mat,  g2, 'La lumière : sources, ombres, réflexion', 2),
    (c_mat,  g2, 'Le son : production, propagation, intensité', 3);
  insert into content_items (competency_id, grade_level_id, name_fr, sort_order) values
    (c_viv,  g2, 'Classification des animaux : vertébrés et invertébrés', 1),
    (c_viv,  g2, 'Cycle de vie d''un animal (papillon, grenouille)', 2),
    (c_viv,  g2, 'Alimentation des animaux : herbivores, carnivores, omnivores', 3);
  insert into content_items (competency_id, grade_level_id, name_fr, sort_order) values
    (c_ter,  g2, 'Caractéristiques du sol : types et couches', 1),
    (c_ter,  g2, 'Sources d''énergie naturelles : soleil, vent, eau', 2);
  insert into content_items (competency_id, grade_level_id, name_fr, sort_order) values
    (c_tech, g2, 'Mécanismes simples : levier, roue, plan incliné', 1),
    (c_tech, g2, 'Conception et réalisation d''un objet technique simple', 2);

  -- 3e année
  insert into content_items (competency_id, grade_level_id, name_fr, sort_order) values
    (c_mat,  g3, 'Propriétés des liquides : viscosité, miscibilité', 1),
    (c_mat,  g3, 'Séparation avancée de mélanges : filtration, évaporation, tri magnétique', 2);
  insert into content_items (competency_id, grade_level_id, name_fr, sort_order) values
    (c_viv,  g3, 'Habitats et adaptations des animaux à leur milieu', 1),
    (c_viv,  g3, 'Chaînes et réseaux alimentaires', 2),
    (c_viv,  g3, 'Rôle des plantes : photosynthèse (introduction)', 3);
  insert into content_items (competency_id, grade_level_id, name_fr, sort_order) values
    (c_ter,  g3, 'Cycle de l''eau : évaporation, condensation, précipitation, ruissellement', 1),
    (c_ter,  g3, 'Érosion et sédimentation : effets de l''eau et du vent', 2);
  insert into content_items (competency_id, grade_level_id, name_fr, sort_order) values
    (c_tech, g3, 'Circuits électriques simples : pile, ampoule, interrupteur', 1),
    (c_tech, g3, 'Conducteurs et isolants électriques', 2);

  -- 4e année
  insert into content_items (competency_id, grade_level_id, name_fr, sort_order) values
    (c_mat,  g4, 'Propriétés des métaux et des non-métaux', 1),
    (c_mat,  g4, 'Acides et bases : identification par indicateur (papier pH)', 2),
    (c_mat,  g4, 'Forces en action : gravité, friction, poussée', 3);
  insert into content_items (competency_id, grade_level_id, name_fr, sort_order) values
    (c_viv,  g4, 'Systèmes du corps humain : digestif et respiratoire', 1),
    (c_viv,  g4, 'Micro-organismes : bactéries, virus, champignons (introduction)', 2),
    (c_viv,  g4, 'Interdépendance des êtres vivants dans un écosystème', 3);
  insert into content_items (competency_id, grade_level_id, name_fr, sort_order) values
    (c_ter,  g4, 'Le système solaire : planètes, étoiles, satellites', 1),
    (c_ter,  g4, 'Mouvements de la Terre : rotation (jour/nuit) et révolution (saisons)', 2),
    (c_ter,  g4, 'Phases de la Lune', 3);
  insert into content_items (competency_id, grade_level_id, name_fr, sort_order) values
    (c_tech, g4, 'Structures résistantes : conception d''un pont ou d''une tour', 1),
    (c_tech, g4, 'Systèmes mécaniques : engrenages, poulies, courroies', 2);

  -- 5e année
  insert into content_items (competency_id, grade_level_id, name_fr, sort_order) values
    (c_mat,  g5, 'Modèle particulaire : atomes et molécules (introduction)', 1),
    (c_mat,  g5, 'Transfert thermique : conduction, convection, rayonnement', 2),
    (c_mat,  g5, 'Transformation physique vs transformation chimique', 3);
  insert into content_items (competency_id, grade_level_id, name_fr, sort_order) values
    (c_viv,  g5, 'Reproduction sexuée et asexuée des plantes et des animaux', 1),
    (c_viv,  g5, 'Systèmes du corps humain : circulatoire et nerveux', 2),
    (c_viv,  g5, 'Génétique : hérédité et variation (introduction)', 3);
  insert into content_items (competency_id, grade_level_id, name_fr, sort_order) values
    (c_ter,  g5, 'Plaques tectoniques : volcans et tremblements de terre', 1),
    (c_ter,  g5, 'Roches et minéraux : identification et formation', 2),
    (c_ter,  g5, 'Ressources naturelles du Québec et leur exploitation', 3);
  insert into content_items (competency_id, grade_level_id, name_fr, sort_order) values
    (c_tech, g5, 'Sources d''énergie renouvelables et non renouvelables', 1),
    (c_tech, g5, 'Circuits électriques en série et en parallèle', 2),
    (c_tech, g5, 'Introduction à la programmation : séquences et boucles', 3);

  -- 6e année
  insert into content_items (competency_id, grade_level_id, name_fr, sort_order) values
    (c_mat,  g6, 'Réactions chimiques : réactifs, produits, observations', 1),
    (c_mat,  g6, 'Électricité statique et courant électrique', 2),
    (c_mat,  g6, 'Tableau périodique : éléments communs (introduction)', 3);
  insert into content_items (competency_id, grade_level_id, name_fr, sort_order) values
    (c_viv,  g6, 'Cellule végétale et animale : structure et fonctions', 1),
    (c_viv,  g6, 'Écosystèmes : biodiversité et espèces menacées', 2),
    (c_viv,  g6, 'Impact des activités humaines sur l''environnement', 3);
  insert into content_items (competency_id, grade_level_id, name_fr, sort_order) values
    (c_ter,  g6, 'Atmosphère terrestre : couches et composition', 1),
    (c_ter,  g6, 'Changements climatiques : causes, conséquences, actions', 2),
    (c_ter,  g6, 'Exploration spatiale et technologies associées', 3);
  insert into content_items (competency_id, grade_level_id, name_fr, sort_order) values
    (c_tech, g6, 'Programmation et robotique : conditions, capteurs, boucles', 1),
    (c_tech, g6, 'Conception d''un projet technologique : démarche complète', 2),
    (c_tech, g6, 'Technologies numériques et impacts sociaux', 3);


  -- ════════════════════════════════════════════════════════════
  -- UNIVERS SOCIAL — PDA 2009
  -- Trois axes : Géographie, Histoire, Citoyenneté
  -- ════════════════════════════════════════════════════════════

  insert into competencies (subject_id, name_fr, color, sort_order) values
    (us_id, 'Géographie et territoire', '#D97706', 10) returning id into c_geo;
  insert into competencies (subject_id, name_fr, color, sort_order) values
    (us_id, 'Histoire et société', '#B45309', 20) returning id into c_hist;
  insert into competencies (subject_id, name_fr, color, sort_order) values
    (us_id, 'Éducation à la citoyenneté', '#92400E', 30) returning id into c_cit;


  -- ── CYCLE 1 — 1re année : L'espace proche ───────────────
  insert into content_items (competency_id, grade_level_id, name_fr, sort_order) values
    (c_geo,  g1, 'Se repérer dans l''espace familier : maison, école, rue, quartier', 1),
    (c_geo,  g1, 'Réaliser et lire un plan simple de la classe ou de l''école', 2),
    (c_geo,  g1, 'Nommer et utiliser les points cardinaux (N, S, E, O)', 3),
    (c_geo,  g1, 'Identifier les caractéristiques physiques de son milieu de vie', 4);
  insert into content_items (competency_id, grade_level_id, name_fr, sort_order) values
    (c_hist, g1, 'Se situer dans le temps : avant, maintenant, après — chronologie personnelle', 1),
    (c_hist, g1, 'Identifier des traces du passé dans son milieu (bâtiments, photos anciennes)', 2),
    (c_hist, g1, 'Comparer des objets ou des modes de vie d''autrefois et d''aujourd''hui', 3);
  insert into content_items (competency_id, grade_level_id, name_fr, sort_order) values
    (c_cit,  g1, 'Règles de vie en classe et à l''école : raisons d''être et application', 1),
    (c_cit,  g1, 'Droits et responsabilités de l''élève dans son milieu scolaire', 2);

  -- ── CYCLE 1 — 2e année : Milieux de vie ─────────────────
  insert into content_items (competency_id, grade_level_id, name_fr, sort_order) values
    (c_geo,  g2, 'Lire et interpréter une carte simple : légende, symboles, échelle (intro)', 1),
    (c_geo,  g2, 'Comparer deux milieux de vie : urbain et rural — ressemblances et différences', 2),
    (c_geo,  g2, 'Identifier les ressources naturelles de son milieu et leur utilisation', 3),
    (c_geo,  g2, 'Reconnaître les voies de communication (routes, rivières, chemins de fer)', 4);
  insert into content_items (competency_id, grade_level_id, name_fr, sort_order) values
    (c_hist, g2, 'Retracer l''évolution de son milieu de vie sur quelques décennies (photos, entrevues)', 1),
    (c_hist, g2, 'Reconnaître les changements apportés par les êtres humains à leur milieu', 2),
    (c_hist, g2, 'Identifier les services et les métiers présents dans une communauté', 3);
  insert into content_items (competency_id, grade_level_id, name_fr, sort_order) values
    (c_cit,  g2, 'Formes de participation à la vie collective : conseil de classe, vote, assemblée', 1),
    (c_cit,  g2, 'Identifier des besoins communs et la façon dont la société y répond', 2),
    (c_cit,  g2, 'Coopération et solidarité dans un groupe', 3);

  -- ── CYCLE 2 — 3e année : Iroquoiens vers 1500 ───────────
  insert into content_items (competency_id, grade_level_id, name_fr, sort_order) values
    (c_geo,  g3, 'Localiser le territoire des Iroquoiens vers 1500 sur une carte', 1),
    (c_geo,  g3, 'Décrire les caractéristiques du territoire iroquoien : forêts, cours d''eau, ressources', 2),
    (c_geo,  g3, 'Territoire agricole du Québec : localisation et caractéristiques physiques', 3),
    (c_geo,  g3, 'Activités agricoles et aménagement du territoire agricole', 4);
  insert into content_items (competency_id, grade_level_id, name_fr, sort_order) values
    (c_hist, g3, 'Organisation sociale des Iroquoiens : clans matrilinéaires, rôle des femmes, chefs', 1),
    (c_hist, g3, 'Mode de vie iroquoien : agriculture des Trois Sœurs, longues maisons, semi-sédentarisme', 2),
    (c_hist, g3, 'Croyances, cérémonies et rapport à la nature des Iroquoiens', 3),
    (c_hist, g3, 'Échanges commerciaux et relations entre nations iroquoiennes', 4);
  insert into content_items (competency_id, grade_level_id, name_fr, sort_order) values
    (c_cit,  g3, 'Mode de gouvernance des Iroquoiens : prise de décision collective, Grande Loi de la paix', 1),
    (c_cit,  g3, 'Place des femmes et des hommes dans la société iroquoienne', 2),
    (c_cit,  g3, 'Droits de l''enfant : Convention des Nations Unies (introduction)', 3);

  -- ── CYCLE 2 — 4e année : Comparaison et territoire forestier ──
  insert into content_items (competency_id, grade_level_id, name_fr, sort_order) values
    (c_geo,  g4, 'Territoire forestier du Québec : localisation, types de forêts (boréale, mixte, feuillue)', 1),
    (c_geo,  g4, 'Exploitation forestière : activités, acteurs, impacts environnementaux', 2),
    (c_geo,  g4, 'Lire et comparer des cartes à différentes échelles (locale, régionale, nationale)', 3);
  insert into content_items (competency_id, grade_level_id, name_fr, sort_order) values
    (c_hist, g4, 'Comparaison : Iroquoiens et une autre société autochtone d''Amérique vers 1500', 1),
    (c_hist, g4, 'Relations entre les peuples autochtones : alliances, conflits, échanges', 2),
    (c_hist, g4, 'Continuité des cultures autochtones : nations autochtones du Québec aujourd''hui', 3),
    (c_hist, g4, 'Changements apportés par l''arrivée des Européens (introduction)', 4);
  insert into content_items (competency_id, grade_level_id, name_fr, sort_order) values
    (c_cit,  g4, 'Notion de territoire et de droits territoriaux des peuples autochtones', 1),
    (c_cit,  g4, 'Enjeux liés à la gestion durable des ressources forestières', 2),
    (c_cit,  g4, 'Responsabilité collective envers l''environnement', 3);

  -- ── CYCLE 3 — 5e année : Nouvelle-France vers 1745 ──────
  insert into content_items (competency_id, grade_level_id, name_fr, sort_order) values
    (c_geo,  g5, 'Territoire de la Nouvelle-France vers 1745 : étendue, frontières, régions', 1),
    (c_geo,  g5, 'Territoire métropolitain québécois : caractéristiques, fonctions, enjeux', 2),
    (c_geo,  g5, 'Région administrative du Québec : divisions, utilités, repères géographiques', 3);
  insert into content_items (competency_id, grade_level_id, name_fr, sort_order) values
    (c_hist, g5, 'Organisation de la société canadienne en Nouvelle-France : seigneurie, Église, gouvernance royale', 1),
    (c_hist, g5, 'Mode de vie des colons : agriculture, commerce des fourrures, vie quotidienne', 2),
    (c_hist, g5, 'Relations entre Français et Autochtones : alliances, coexistence, tensions', 3),
    (c_hist, g5, 'Rôle de l''Église catholique dans la vie sociale et éducative', 4),
    (c_hist, g5, 'Comparaison de la société de la Nouvelle-France avec la société québécoise actuelle', 5);
  insert into content_items (competency_id, grade_level_id, name_fr, sort_order) values
    (c_cit,  g5, 'Système politique québécois : Assemblée nationale, gouvernement, élections (introduction)', 1),
    (c_cit,  g5, 'Notion de pouvoir et de gouvernance : évolution de la colonie à aujourd''hui', 2),
    (c_cit,  g5, 'Droits et libertés : Charte québécoise des droits et libertés de la personne', 3);

  -- ── CYCLE 3 — 6e année : Société canadienne vers 1820 ───
  insert into content_items (competency_id, grade_level_id, name_fr, sort_order) values
    (c_geo,  g6, 'Territoire autochtone contemporain au Québec : nations, localisations, enjeux', 1),
    (c_geo,  g6, 'Développement durable et aménagement du territoire québécois', 2),
    (c_geo,  g6, 'Enjeux environnementaux et territoriaux : eau, forêts, mines', 3);
  insert into content_items (competency_id, grade_level_id, name_fr, sort_order) values
    (c_hist, g6, 'Conquête britannique de 1760 : causes, déroulement, conséquences sociales', 1),
    (c_hist, g6, 'Organisation de la société canadienne vers 1820 sous le régime britannique', 2),
    (c_hist, g6, 'Tensions entre francophones et anglophones : Acte constitutionnel, Rébellions', 3),
    (c_hist, g6, 'Vie quotidienne vers 1820 : famille, travail, religion, éducation', 4),
    (c_hist, g6, 'Évolution de la société québécoise de 1820 à aujourd''hui : grandes étapes', 5);
  insert into content_items (competency_id, grade_level_id, name_fr, sort_order) values
    (c_cit,  g6, 'Institutions démocratiques : gouvernements municipal, provincial et fédéral', 1),
    (c_cit,  g6, 'Mouvements sociaux au Québec : féminisme, droits des Autochtones, syndicats', 2),
    (c_cit,  g6, 'Engagement citoyen : participation, action collective, démocratie participative', 3),
    (c_cit,  g6, 'Mondialisation : interdépendance des sociétés et enjeux géopolitiques (introduction)', 4);

end $$;
