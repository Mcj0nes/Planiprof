-- Éducation physique et à la santé — primaire (PDA)
do $$
declare
  ep_id int;
  g1 int; g2 int; g3 int; g4 int; g5 int; g6 int;
  c_agir      int;
  c_interagir int;
  c_sante     int;
  c_savoirs   int;
begin
  select id into ep_id from subjects    where slug = 'educ-physique';
  select id into g1    from grade_levels where education_level = 'primaire' and grade = 1;
  select id into g2    from grade_levels where education_level = 'primaire' and grade = 2;
  select id into g3    from grade_levels where education_level = 'primaire' and grade = 3;
  select id into g4    from grade_levels where education_level = 'primaire' and grade = 4;
  select id into g5    from grade_levels where education_level = 'primaire' and grade = 5;
  select id into g6    from grade_levels where education_level = 'primaire' and grade = 6;

  if exists (select 1 from competencies where subject_id = ep_id) then
    return;
  end if;

  insert into competencies (subject_id, name_fr, color, sort_order) values
    (ep_id, 'Agir dans des contextes de pratique d''activités physiques', '#EA580C', 10) returning id into c_agir;
  insert into competencies (subject_id, name_fr, color, sort_order) values
    (ep_id, 'Interagir dans des contextes de pratique d''activités physiques', '#0284C7', 20) returning id into c_interagir;
  insert into competencies (subject_id, name_fr, color, sort_order) values
    (ep_id, 'Adopter un mode de vie sain et actif',                           '#059669', 30) returning id into c_sante;
  insert into competencies (subject_id, name_fr, color, sort_order) values
    (ep_id, 'Savoirs corporels et règles de sécurité',                        '#F59E0B', 40) returning id into c_savoirs;

  -- =====================================================================
  -- 1RE ANNÉE
  -- =====================================================================
  insert into content_items (competency_id, grade_level_id, name_fr, sort_order, progression_type) values
    (c_agir, g1, 'Courir, sauter, lancer et attraper dans des situations simples', 1, 'progression'),
    (c_agir, g1, 'Maintenir son équilibre dans différentes positions (sur un pied, en mouvement)', 2, 'progression'),
    (c_agir, g1, 'Ramper, rouler, grimper sur des modules de jeu', 3, 'progression'),
    (c_agir, g1, 'Coordonner ses mouvements dans une séquence simple (courir + sauter)', 4, 'progression');

  insert into content_items (competency_id, grade_level_id, name_fr, sort_order, progression_type) values
    (c_interagir, g1, 'Participer à des jeux coopératifs simples (passer un objet, relais à deux)', 1, 'progression'),
    (c_interagir, g1, 'Respecter les autres et les règles de base lors d''un jeu', 2, 'progression'),
    (c_interagir, g1, 'Attendre son tour et encourager ses camarades', 3, 'progression');

  insert into content_items (competency_id, grade_level_id, name_fr, sort_order, progression_type) values
    (c_sante, g1, 'Reconnaître les bienfaits de bouger tous les jours', 1, 'progression'),
    (c_sante, g1, 'Identifier les aliments qui donnent de l''énergie pour bouger', 2, 'progression'),
    (c_sante, g1, 'S''habiller en fonction de la météo pour l''activité physique extérieure', 3, 'progression');

  insert into content_items (competency_id, grade_level_id, name_fr, sort_order, progression_type) values
    (c_savoirs, g1, 'Les parties du corps sollicitées lors du mouvement', 1, 'progression'),
    (c_savoirs, g1, 'Règles de sécurité dans le gymnase (espace, matériel)', 2, 'progression'),
    (c_savoirs, g1, 'Notions d''espace : devant/derrière, gauche/droite, haut/bas', 3, 'progression');

  -- =====================================================================
  -- 2E ANNÉE
  -- =====================================================================
  insert into content_items (competency_id, grade_level_id, name_fr, sort_order, progression_type) values
    (c_agir, g2, 'Lancer et attraper un ballon avec les deux mains avec précision', 1, 'progression'),
    (c_agir, g2, 'Courir à différentes vitesses et changer de direction sur signal', 2, 'progression'),
    (c_agir, g2, 'Sauter à la corde et enchaîner des sauts', 3, 'progression'),
    (c_agir, g2, 'Réaliser des roulades avant et arrière sur tapis', 4, 'progression');

  insert into content_items (competency_id, grade_level_id, name_fr, sort_order, progression_type) values
    (c_interagir, g2, 'Participer à des jeux de poursuite et d''esquive en équipe', 1, 'progression'),
    (c_interagir, g2, 'Communiquer avec ses coéquipiers pour atteindre un objectif', 2, 'progression'),
    (c_interagir, g2, 'Accepter de gagner ou de perdre avec fair-play', 3, 'progression');

  insert into content_items (competency_id, grade_level_id, name_fr, sort_order, progression_type) values
    (c_sante, g2, 'Comprendre l''importance de l''échauffement avant l''effort', 1, 'progression'),
    (c_sante, g2, 'Distinguer activités physiques intenses et légères', 2, 'progression'),
    (c_sante, g2, 'L''importance de l''hydratation lors de l''activité physique', 3, 'progression');

  insert into content_items (competency_id, grade_level_id, name_fr, sort_order, progression_type) values
    (c_savoirs, g2, 'Les capacités physiques de base : endurance, force, souplesse, équilibre', 1, 'progression'),
    (c_savoirs, g2, 'Règles de base d''un jeu collectif simple', 2, 'progression'),
    (c_savoirs, g2, 'Sensations physiques : essoufflement, transpiration, rythme cardiaque', 3, 'progression');

  -- =====================================================================
  -- 3E ANNÉE
  -- =====================================================================
  insert into content_items (competency_id, grade_level_id, name_fr, sort_order, progression_type) values
    (c_agir, g3, 'Frapper un ballon du pied avec précision vers une cible', 1, 'progression'),
    (c_agir, g3, 'Réaliser des enchaînements gymnasiques simples (roulade + équilibre)', 2, 'progression'),
    (c_agir, g3, 'Nager ou s''initier aux activités aquatiques (si disponible)', 3, 'progression'),
    (c_agir, g3, 'Maîtriser les techniques de base du lancer (par-dessus l''épaule)', 4, 'progression');

  insert into content_items (competency_id, grade_level_id, name_fr, sort_order, progression_type) values
    (c_interagir, g3, 'Jouer un rôle défensif et offensif dans un jeu collectif', 1, 'progression'),
    (c_interagir, g3, 'Appliquer une stratégie simple avec son équipe (passe et déplacement)', 2, 'progression'),
    (c_interagir, g3, 'Résoudre un conflit lors d''un jeu de façon pacifique', 3, 'progression');

  insert into content_items (competency_id, grade_level_id, name_fr, sort_order, progression_type) values
    (c_sante, g3, 'Comprendre les effets de l''activité physique sur le corps (cœur, muscles)', 1, 'progression'),
    (c_sante, g3, 'Identifier des choix alimentaires favorables à la santé', 2, 'progression'),
    (c_sante, g3, 'Pratiquer des exercices de récupération (étirements, retour au calme)', 3, 'progression');

  insert into content_items (competency_id, grade_level_id, name_fr, sort_order, progression_type) values
    (c_savoirs, g3, 'Les systèmes du corps sollicités par l''exercice (musculaire, cardiovasculaire)', 1, 'progression'),
    (c_savoirs, g3, 'Règles des jeux collectifs pratiqués (soccer, ballon-chasseur…)', 2, 'progression'),
    (c_savoirs, g3, 'Notions de stratégie : attaque, défense, espace libre', 3, 'progression');

  -- =====================================================================
  -- 4E ANNÉE
  -- =====================================================================
  insert into content_items (competency_id, grade_level_id, name_fr, sort_order, progression_type) values
    (c_agir, g4, 'Exécuter des habiletés motrices avec fluidité dans plusieurs sports (hockey-cosom, basketball, badminton)', 1, 'progression'),
    (c_agir, g4, 'Améliorer sa technique de course (départ, foulée, arrivée)', 2, 'progression'),
    (c_agir, g4, 'Réaliser une séquence d''acrobaties ou de danse sportive', 3, 'progression');

  insert into content_items (competency_id, grade_level_id, name_fr, sort_order, progression_type) values
    (c_interagir, g4, 'Élaborer et appliquer une stratégie d''équipe dans un jeu', 1, 'progression'),
    (c_interagir, g4, 'Assumer différents rôles dans l''équipe (meneur, suiveur, arbitre)', 2, 'progression'),
    (c_interagir, g4, 'Arbitrer une partie simple et faire respecter les règles', 3, 'progression');

  insert into content_items (competency_id, grade_level_id, name_fr, sort_order, progression_type) values
    (c_sante, g4, 'Établir un lien entre l''activité physique régulière et le bien-être', 1, 'progression'),
    (c_sante, g4, 'Comprendre les risques de la sédentarité (trop de temps d''écran)', 2, 'progression'),
    (c_sante, g4, 'Connaître les groupes alimentaires et la notion d''équilibre alimentaire', 3, 'progression');

  insert into content_items (competency_id, grade_level_id, name_fr, sort_order, progression_type) values
    (c_savoirs, g4, 'Les principes d''entraînement : progression, régularité, récupération', 1, 'progression'),
    (c_savoirs, g4, 'Règles de sécurité spécifiques aux sports pratiqués', 2, 'progression'),
    (c_savoirs, g4, 'Mesurer sa fréquence cardiaque avant et après l''effort', 3, 'progression');

  -- =====================================================================
  -- 5E ANNÉE
  -- =====================================================================
  insert into content_items (competency_id, grade_level_id, name_fr, sort_order, progression_type) values
    (c_agir, g5, 'Raffiner ses techniques dans des sports variés (volleyball, ultimate, athlétisme)', 1, 'progression'),
    (c_agir, g5, 'Adapter ses actions aux contraintes de l''environnement (espace, adversaire)', 2, 'progression'),
    (c_agir, g5, 'Démontrer de la précision et de la fluidité dans une séquence gymnique ou dansée', 3, 'progression');

  insert into content_items (competency_id, grade_level_id, name_fr, sort_order, progression_type) values
    (c_interagir, g5, 'Coordonner ses actions avec celles de l''équipe pour atteindre un objectif commun', 1, 'progression'),
    (c_interagir, g5, 'Analyser le jeu et ajuster la stratégie en cours de partie', 2, 'progression'),
    (c_interagir, g5, 'Manifester du leadership et soutenir ses coéquipiers', 3, 'progression');

  insert into content_items (competency_id, grade_level_id, name_fr, sort_order, progression_type) values
    (c_sante, g5, 'Planifier une routine d''activité physique personnelle hebdomadaire', 1, 'progression'),
    (c_sante, g5, 'Comprendre les effets du stress et les stratégies de gestion (respiration, relaxation)', 2, 'progression'),
    (c_sante, g5, 'Distinguer bonnes et mauvaises habitudes de sommeil et d''alimentation', 3, 'progression');

  insert into content_items (competency_id, grade_level_id, name_fr, sort_order, progression_type) values
    (c_savoirs, g5, 'Les composantes de la condition physique (endurance, force, flexibilité, agilité)', 1, 'progression'),
    (c_savoirs, g5, 'Les règles officielles des sports pratiqués en classe', 2, 'progression'),
    (c_savoirs, g5, 'Les bienfaits de l''activité physique sur la santé mentale', 3, 'progression');

  -- =====================================================================
  -- 6E ANNÉE
  -- =====================================================================
  insert into content_items (competency_id, grade_level_id, name_fr, sort_order, progression_type) values
    (c_agir, g6, 'Maîtriser des habiletés motrices complexes dans plusieurs disciplines', 1, 'progression'),
    (c_agir, g6, 'S''auto-évaluer et fixer des objectifs d''amélioration motrice', 2, 'progression'),
    (c_agir, g6, 'Réaliser une performance personnelle (vitesse, distance, précision) et la mesurer', 3, 'progression');

  insert into content_items (competency_id, grade_level_id, name_fr, sort_order, progression_type) values
    (c_interagir, g6, 'Gérer les conflits et les désaccords de façon autonome lors d''un jeu', 1, 'progression'),
    (c_interagir, g6, 'Concevoir et animer un jeu ou une activité pour ses camarades', 2, 'progression'),
    (c_interagir, g6, 'Valoriser l''inclusion et le respect des différences dans la pratique sportive', 3, 'progression');

  insert into content_items (competency_id, grade_level_id, name_fr, sort_order, progression_type) values
    (c_sante, g6, 'Établir un plan personnel de mise en forme et en évaluer les progrès', 1, 'progression'),
    (c_sante, g6, 'Comprendre l''influence des médias et de la publicité sur les habitudes de vie', 2, 'progression'),
    (c_sante, g6, 'Prévention des blessures : échauffement, équipement de protection, récupération', 3, 'progression');

  insert into content_items (competency_id, grade_level_id, name_fr, sort_order, progression_type) values
    (c_savoirs, g6, 'Concepts avancés de condition physique : VO2 max, fréquence cardiaque cible', 1, 'progression'),
    (c_savoirs, g6, 'Histoire du sport québécois et canadien : repères culturels', 2, 'progression'),
    (c_savoirs, g6, 'Éthique sportive : esprit olympique, fair-play, inclusion', 3, 'progression');

end $$;
