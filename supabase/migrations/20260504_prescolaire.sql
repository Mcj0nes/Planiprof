-- ============================================================
-- PLANIPROF — Préscolaire : niveaux, domaines et PDA
-- Basé sur le Programme-cycle de l'éducation préscolaire (MEQ 2021)
-- ============================================================

-- ── 1. Contrainte education_level : ajouter 'préscolaire' ────
do $outer$
declare
  cname text;
begin
  select conname into cname
  from pg_constraint
  where conrelid = 'grade_levels'::regclass
    and contype = 'c'
    and pg_get_constraintdef(oid) like '%education_level%'
  limit 1;

  if cname is not null then
    execute format('alter table grade_levels drop constraint %I', cname);
  end if;

  begin
    alter table grade_levels add constraint grade_levels_education_level_check
      check (education_level in ('primaire', 'secondaire', 'préscolaire'));
  exception when duplicate_object then null;
  end;
end $outer$;


-- ── 2. Niveaux scolaires préscolaires ────────────────────────
-- Grades négatifs (-2, -1) pour un tri naturel avant la 1re année
insert into grade_levels (education_level, grade, label_fr) values
  ('préscolaire', -2, 'Maternelle 4 ans'),
  ('préscolaire', -1, 'Maternelle 5 ans')
on conflict (education_level, grade) do nothing;


-- ── 3. Matières — 5 domaines de développement ────────────────
insert into subjects (name_fr, name_en, slug, color) values
  ('Développement physique et moteur', 'Physical and Motor Development', 'dev-physique',     '#EA580C'),
  ('Développement affectif',           'Affective Development',          'dev-affectif',     '#EC4899'),
  ('Développement social',             'Social Development',             'dev-social',       '#8B5CF6'),
  ('Communication et langage',         'Communication and Language',     'comm-langage',     '#4F46E5'),
  ('Découverte du monde',              'Discovering the World',          'decouverte-monde', '#10B981')
on conflict (slug) do nothing;


-- ── 4. Compétences (axes) et éléments de la PDA ──────────────
do $$
declare
  g4a int; g5a int;

  s_physique int; s_affectif int; s_social int; s_langage int; s_monde int;

  c_motricite  int; c_habitudes int;
  c_conso      int; c_confiance int;
  c_appart     int; c_habiletes int;
  c_oral       int; c_ecrit     int;
  c_pensee     int; c_math      int; c_sciences int; c_univers int;

begin

  -- Idempotency guard: skip if préscolaire content already seeded
  if exists (
    select 1 from competencies c
    join subjects s on s.id = c.subject_id
    where s.slug = 'dev-physique'
  ) then
    raise notice 'Préscolaire content already seeded — skipping.';
    return;
  end if;

  -- Résoudre les IDs de niveau
  select id into g4a from grade_levels where education_level = 'préscolaire' and grade = -2;
  select id into g5a from grade_levels where education_level = 'préscolaire' and grade = -1;

  -- Résoudre les IDs de matière
  select id into s_physique from subjects where slug = 'dev-physique';
  select id into s_affectif from subjects where slug = 'dev-affectif';
  select id into s_social   from subjects where slug = 'dev-social';
  select id into s_langage  from subjects where slug = 'comm-langage';
  select id into s_monde    from subjects where slug = 'decouverte-monde';


  -- ══════════════════════════════════════════════════════════
  -- DOMAINE 1 — Développement physique et moteur
  -- ══════════════════════════════════════════════════════════

  insert into competencies (subject_id, name_fr, sort_order)
    values (s_physique, 'Motricité', 1) returning id into c_motricite;
  insert into competencies (subject_id, name_fr, sort_order)
    values (s_physique, 'Saines habitudes de vie', 2) returning id into c_habitudes;

  insert into content_items (competency_id, grade_level_id, name_fr, sort_order) values
    -- Motricité — Maternelle 4 ans
    (c_motricite, g4a, 'Effectuer des déplacements variés (courir, sauter, grimper, rouler)', 1),
    (c_motricite, g4a, 'Maintenir son équilibre statique et dynamique', 2),
    (c_motricite, g4a, 'Coordonner ses mouvements dans des activités physiques', 3),
    (c_motricite, g4a, 'Manipuler des objets avec précision (attraper, lancer, frapper)', 4),
    (c_motricite, g4a, 'Développer la motricité fine (tenir des outils, couper, coller, modeler)', 5),
    (c_motricite, g4a, 'Reconnaître et nommer les parties de son corps', 6),
    (c_motricite, g4a, 'Se situer dans l''espace (dessus/dessous, devant/derrière, gauche/droite)', 7),
    -- Saines habitudes — Maternelle 4 ans
    (c_habitudes, g4a, 'Reconnaître l''importance de l''activité physique pour sa santé', 1),
    (c_habitudes, g4a, 'Explorer les aliments nutritifs et les groupes alimentaires', 2),
    (c_habitudes, g4a, 'Pratiquer les routines d''hygiène personnelle (mains, dents)', 3),
    (c_habitudes, g4a, 'Reconnaître les situations à risque et appliquer les règles de sécurité', 4),
    (c_habitudes, g4a, 'Accepter de se reposer et de se détendre', 5),
    -- Motricité — Maternelle 5 ans
    (c_motricite, g5a, 'Effectuer des déplacements variés (courir, sauter, grimper, rouler)', 1),
    (c_motricite, g5a, 'Maintenir son équilibre statique et dynamique', 2),
    (c_motricite, g5a, 'Coordonner ses mouvements dans des activités physiques', 3),
    (c_motricite, g5a, 'Manipuler des objets avec précision (attraper, lancer, frapper)', 4),
    (c_motricite, g5a, 'Développer la motricité fine (tenir des outils, couper, coller, modeler)', 5),
    (c_motricite, g5a, 'Reconnaître et nommer les parties de son corps', 6),
    (c_motricite, g5a, 'Se situer dans l''espace (dessus/dessous, devant/derrière, gauche/droite)', 7),
    -- Saines habitudes — Maternelle 5 ans
    (c_habitudes, g5a, 'Reconnaître l''importance de l''activité physique pour sa santé', 1),
    (c_habitudes, g5a, 'Explorer les aliments nutritifs et les groupes alimentaires', 2),
    (c_habitudes, g5a, 'Pratiquer les routines d''hygiène personnelle (mains, dents)', 3),
    (c_habitudes, g5a, 'Reconnaître les situations à risque et appliquer les règles de sécurité', 4),
    (c_habitudes, g5a, 'Accepter de se reposer et de se détendre', 5);


  -- ══════════════════════════════════════════════════════════
  -- DOMAINE 2 — Développement affectif
  -- ══════════════════════════════════════════════════════════

  insert into competencies (subject_id, name_fr, sort_order)
    values (s_affectif, 'Connaissance de soi', 1) returning id into c_conso;
  insert into competencies (subject_id, name_fr, sort_order)
    values (s_affectif, 'Confiance en soi et autonomie', 2) returning id into c_confiance;

  insert into content_items (competency_id, grade_level_id, name_fr, sort_order) values
    -- Connaissance de soi — 4 ans
    (c_conso,     g4a, 'Reconnaître et exprimer ses émotions (joie, colère, peur, tristesse)', 1),
    (c_conso,     g4a, 'Reconnaître ses caractéristiques personnelles, ses goûts et ses intérêts', 2),
    (c_conso,     g4a, 'Exprimer ses besoins de façon appropriée', 3),
    (c_conso,     g4a, 'Accepter ses erreurs et ses réussites', 4),
    -- Confiance — 4 ans
    (c_confiance, g4a, 'Faire preuve d''initiative dans les activités', 1),
    (c_confiance, g4a, 'Faire des choix et prendre des décisions simples', 2),
    (c_confiance, g4a, 'Persévérer malgré les obstacles et les difficultés', 3),
    (c_confiance, g4a, 'Gérer ses émotions et ses comportements', 4),
    (c_confiance, g4a, 'Développer son autonomie dans les routines quotidiennes', 5),
    -- Connaissance de soi — 5 ans
    (c_conso,     g5a, 'Reconnaître et exprimer ses émotions (joie, colère, peur, tristesse)', 1),
    (c_conso,     g5a, 'Reconnaître ses caractéristiques personnelles, ses goûts et ses intérêts', 2),
    (c_conso,     g5a, 'Exprimer ses besoins de façon appropriée', 3),
    (c_conso,     g5a, 'Accepter ses erreurs et ses réussites', 4),
    -- Confiance — 5 ans
    (c_confiance, g5a, 'Faire preuve d''initiative dans les activités', 1),
    (c_confiance, g5a, 'Faire des choix et prendre des décisions simples', 2),
    (c_confiance, g5a, 'Persévérer malgré les obstacles et les difficultés', 3),
    (c_confiance, g5a, 'Gérer ses émotions et ses comportements', 4),
    (c_confiance, g5a, 'Développer son autonomie dans les routines quotidiennes', 5);


  -- ══════════════════════════════════════════════════════════
  -- DOMAINE 3 — Développement social
  -- ══════════════════════════════════════════════════════════

  insert into competencies (subject_id, name_fr, sort_order)
    values (s_social, 'Sentiment d''appartenance au groupe', 1) returning id into c_appart;
  insert into competencies (subject_id, name_fr, sort_order)
    values (s_social, 'Habiletés sociales', 2) returning id into c_habiletes;

  insert into content_items (competency_id, grade_level_id, name_fr, sort_order) values
    -- Appartenance — 4 ans
    (c_appart,    g4a, 'Tisser des liens avec les autres enfants et les adultes', 1),
    (c_appart,    g4a, 'Participer activement aux activités collectives', 2),
    (c_appart,    g4a, 'Contribuer à la vie du groupe (responsabilités, règles communes)', 3),
    (c_appart,    g4a, 'Être ouvert à la diversité des autres', 4),
    -- Habiletés — 4 ans
    (c_habiletes, g4a, 'Respecter les règles de vie en groupe', 1),
    (c_habiletes, g4a, 'Coopérer et travailler en équipe', 2),
    (c_habiletes, g4a, 'Résoudre des conflits de façon pacifique (mots, négociation)', 3),
    (c_habiletes, g4a, 'Maîtriser ses comportements et s''autoréguler', 4),
    (c_habiletes, g4a, 'Reconnaître et respecter les besoins des autres', 5),
    -- Appartenance — 5 ans
    (c_appart,    g5a, 'Tisser des liens avec les autres enfants et les adultes', 1),
    (c_appart,    g5a, 'Participer activement aux activités collectives', 2),
    (c_appart,    g5a, 'Contribuer à la vie du groupe (responsabilités, règles communes)', 3),
    (c_appart,    g5a, 'Être ouvert à la diversité des autres', 4),
    -- Habiletés — 5 ans
    (c_habiletes, g5a, 'Respecter les règles de vie en groupe', 1),
    (c_habiletes, g5a, 'Coopérer et travailler en équipe', 2),
    (c_habiletes, g5a, 'Résoudre des conflits de façon pacifique (mots, négociation)', 3),
    (c_habiletes, g5a, 'Maîtriser ses comportements et s''autoréguler', 4),
    (c_habiletes, g5a, 'Reconnaître et respecter les besoins des autres', 5);


  -- ══════════════════════════════════════════════════════════
  -- DOMAINE 4 — Communication et langage
  -- ══════════════════════════════════════════════════════════

  insert into competencies (subject_id, name_fr, sort_order)
    values (s_langage, 'Langage oral', 1) returning id into c_oral;
  insert into competencies (subject_id, name_fr, sort_order)
    values (s_langage, 'Langage écrit', 2) returning id into c_ecrit;

  insert into content_items (competency_id, grade_level_id, name_fr, sort_order) values
    -- Oral — 4 ans
    (c_oral,  g4a, 'Interagir verbalement et non verbalement avec les autres', 1),
    (c_oral,  g4a, 'Comprendre des consignes, des récits et des messages variés', 2),
    (c_oral,  g4a, 'Enrichir son vocabulaire et utiliser des mots précis', 3),
    (c_oral,  g4a, 'Produire des énoncés de plus en plus complets et structurés', 4),
    (c_oral,  g4a, 'Développer la conscience phonologique (rimes, syllabes, sons initiaux)', 5),
    (c_oral,  g4a, 'Manifester de l''intérêt pour les histoires, les livres et la lecture', 6),
    -- Écrit — 4 ans
    (c_ecrit, g4a, 'Reconnaître les fonctions de l''écrit dans son environnement', 1),
    (c_ecrit, g4a, 'Connaître des lettres de l''alphabet (nom et son correspondant)', 2),
    (c_ecrit, g4a, 'Reconnaître son prénom écrit et quelques mots familiers', 3),
    (c_ecrit, g4a, 'S''initier à l''écriture (gribouillage dirigé, tracer des lettres)', 4),
    (c_ecrit, g4a, 'Comprendre les conventions de l''écrit (gauche à droite, haut en bas)', 5),
    -- Oral — 5 ans
    (c_oral,  g5a, 'Interagir verbalement et non verbalement avec les autres', 1),
    (c_oral,  g5a, 'Comprendre des consignes, des récits et des messages variés', 2),
    (c_oral,  g5a, 'Enrichir son vocabulaire et utiliser des mots précis', 3),
    (c_oral,  g5a, 'Produire des énoncés de plus en plus complets et structurés', 4),
    (c_oral,  g5a, 'Développer la conscience phonologique (rimes, syllabes, sons initiaux)', 5),
    (c_oral,  g5a, 'Manifester de l''intérêt pour les histoires, les livres et la lecture', 6),
    -- Écrit — 5 ans
    (c_ecrit, g5a, 'Reconnaître les fonctions de l''écrit dans son environnement', 1),
    (c_ecrit, g5a, 'Connaître les lettres de l''alphabet (nom et son correspondant)', 2),
    (c_ecrit, g5a, 'Reconnaître son prénom écrit et des mots familiers', 3),
    (c_ecrit, g5a, 'S''initier à l''écriture (écriture émergente, tracer des lettres et des mots)', 4),
    (c_ecrit, g5a, 'Comprendre les conventions de l''écrit (gauche à droite, haut en bas)', 5),
    (c_ecrit, g5a, 'Établir des liens entre la langue orale et l''écrit (conscience phonème-graphème)', 6);


  -- ══════════════════════════════════════════════════════════
  -- DOMAINE 5 — Découverte du monde (domaine cognitif)
  -- ══════════════════════════════════════════════════════════

  insert into competencies (subject_id, name_fr, sort_order)
    values (s_monde, 'Développement de la pensée', 1) returning id into c_pensee;
  insert into competencies (subject_id, name_fr, sort_order)
    values (s_monde, 'Exploration mathématique', 2) returning id into c_math;
  insert into competencies (subject_id, name_fr, sort_order)
    values (s_monde, 'Exploration scientifique', 3) returning id into c_sciences;
  insert into competencies (subject_id, name_fr, sort_order)
    values (s_monde, 'Univers social', 4) returning id into c_univers;

  -- Développement de la pensée — identique pour les deux niveaux
  insert into content_items (competency_id, grade_level_id, name_fr, sort_order) values
    (c_pensee, g4a, 'Explorer, observer et questionner son environnement', 1),
    (c_pensee, g4a, 'Émettre des hypothèses et anticiper des résultats', 2),
    (c_pensee, g4a, 'Raisonner, expliquer et justifier ses idées', 3),
    (c_pensee, g4a, 'Faire preuve de créativité et d''imagination', 4),
    (c_pensee, g4a, 'Planifier et mener à terme un projet ou une activité', 5),
    (c_pensee, g4a, 'Réfléchir sur ses apprentissages et ses stratégies', 6),

    (c_pensee, g5a, 'Explorer, observer et questionner son environnement', 1),
    (c_pensee, g5a, 'Émettre des hypothèses et anticiper des résultats', 2),
    (c_pensee, g5a, 'Raisonner, expliquer et justifier ses idées', 3),
    (c_pensee, g5a, 'Faire preuve de créativité et d''imagination', 4),
    (c_pensee, g5a, 'Planifier et mener à terme un projet ou une activité', 5),
    (c_pensee, g5a, 'Réfléchir sur ses apprentissages et ses stratégies', 6);

  -- Exploration mathématique — contenu différencié par niveau
  insert into content_items (competency_id, grade_level_id, name_fr, sort_order) values
    -- 4 ans : dénombrement jusqu'à 10
    (c_math, g4a, 'Dénombrer des collections d''objets (jusqu''à 10)', 1),
    (c_math, g4a, 'Associer les chiffres de 1 à 10 aux quantités correspondantes', 2),
    (c_math, g4a, 'Comparer des quantités (plus, moins, autant)', 3),
    (c_math, g4a, 'Reconnaître des formes géométriques (cercle, carré, triangle, rectangle)', 4),
    (c_math, g4a, 'Explorer les notions de mesure (grand/petit, lourd/léger, long/court)', 5),
    (c_math, g4a, 'Repérer et reproduire une régularité simple (suite AB)', 6),
    -- 5 ans : dénombrement jusqu'à 20
    (c_math, g5a, 'Dénombrer des collections d''objets (jusqu''à 20)', 1),
    (c_math, g5a, 'Reconnaître et écrire les chiffres de 1 à 20', 2),
    (c_math, g5a, 'Comparer et ordonner des quantités', 3),
    (c_math, g5a, 'Reconnaître et nommer des formes géométriques', 4),
    (c_math, g5a, 'Utiliser la mesure non conventionnelle pour comparer des longueurs', 5),
    (c_math, g5a, 'Repérer, reproduire et créer des régularités (suites ABAB, AABB)', 6);

  -- Exploration scientifique — identique pour les deux niveaux
  insert into content_items (competency_id, grade_level_id, name_fr, sort_order) values
    (c_sciences, g4a, 'Observer et explorer les phénomènes naturels (saisons, météo, êtres vivants)', 1),
    (c_sciences, g4a, 'Formuler des questions et émettre des hypothèses simples', 2),
    (c_sciences, g4a, 'Explorer les propriétés des matériaux (solide/liquide, dur/mou, chaud/froid)', 3),
    (c_sciences, g4a, 'Utiliser des outils simples pour explorer et expérimenter', 4),

    (c_sciences, g5a, 'Observer et explorer les phénomènes naturels (saisons, météo, êtres vivants)', 1),
    (c_sciences, g5a, 'Formuler des questions et émettre des hypothèses simples', 2),
    (c_sciences, g5a, 'Explorer les propriétés des matériaux (solide/liquide, dur/mou, chaud/froid)', 3),
    (c_sciences, g5a, 'Utiliser des outils simples pour explorer et expérimenter', 4);

  -- Univers social — identique pour les deux niveaux
  insert into content_items (competency_id, grade_level_id, name_fr, sort_order) values
    (c_univers, g4a, 'Comprendre son milieu de vie immédiat (famille, école, quartier)', 1),
    (c_univers, g4a, 'Développer des repères temporels (hier, aujourd''hui, demain; les saisons)', 2),
    (c_univers, g4a, 'Explorer des représentations de l''espace (plan de la classe, environnement)', 3),
    (c_univers, g4a, 'Découvrir la diversité culturelle et les modes de vie différents', 4),

    (c_univers, g5a, 'Comprendre son milieu de vie immédiat (famille, école, quartier)', 1),
    (c_univers, g5a, 'Développer des repères temporels (hier, aujourd''hui, demain; les saisons)', 2),
    (c_univers, g5a, 'Explorer des représentations de l''espace (plan de la classe, environnement)', 3),
    (c_univers, g5a, 'Découvrir la diversité culturelle et les modes de vie différents', 4);

end $$;
