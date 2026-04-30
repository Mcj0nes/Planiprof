-- ============================================================
-- PLANIPROF — Seed: Culture et citoyenneté québécoise (CCQ), primaire
-- Based on the Quebec PDA / programme CCQ (remplace ÉCR)
-- ============================================================

do $$
declare
  ccq_id  int;
  g1 int; g2 int; g3 int; g4 int; g5 int; g6 int;

  c_cult  int;  -- Culture
  c_cito  int;  -- Citoyenneté
  c_eth   int;  -- Éthique
  c_dial  int;  -- Dialogue

begin

  -- ── Ajouter CCQ aux matières si absent ───────────────────
  insert into subjects (name_fr, name_en, slug, color)
    values ('Culture et citoyenneté québécoise', 'Quebec Culture & Citizenship', 'ccq', '#7C3AED')
    on conflict (slug) do nothing;

  select id into ccq_id from subjects where slug = 'ccq';

  select id into g1 from grade_levels where education_level = 'primaire' and grade = 1;
  select id into g2 from grade_levels where education_level = 'primaire' and grade = 2;
  select id into g3 from grade_levels where education_level = 'primaire' and grade = 3;
  select id into g4 from grade_levels where education_level = 'primaire' and grade = 4;
  select id into g5 from grade_levels where education_level = 'primaire' and grade = 5;
  select id into g6 from grade_levels where education_level = 'primaire' and grade = 6;

  -- ── Compétences (domaines) ───────────────────────────────
  insert into competencies (subject_id, name_fr, color, sort_order) values
    (ccq_id, 'Culture et identité', '#7C3AED', 10) returning id into c_cult;
  insert into competencies (subject_id, name_fr, color, sort_order) values
    (ccq_id, 'Vivre-ensemble et citoyenneté', '#6D28D9', 20) returning id into c_cito;
  insert into competencies (subject_id, name_fr, color, sort_order) values
    (ccq_id, 'Éthique et valeurs', '#5B21B6', 30) returning id into c_eth;
  insert into competencies (subject_id, name_fr, color, sort_order) values
    (ccq_id, 'Pratique du dialogue', '#4C1D95', 40) returning id into c_dial;


  -- ── 1re année ───────────────────────────────────────────
  insert into content_items (competency_id, grade_level_id, name_fr, sort_order) values
    (c_cult,  g1, 'Mon identité : qui je suis, ma famille, mes origines', 1),
    (c_cult,  g1, 'Les langues et les traditions dans ma famille', 2),
    (c_cult,  g1, 'Les fêtes et célébrations dans ma communauté', 3);

  insert into content_items (competency_id, grade_level_id, name_fr, sort_order) values
    (c_cito,  g1, 'Règles de vie en classe : coopération et respect', 1),
    (c_cito,  g1, 'Les droits et les responsabilités à l''école', 2);

  insert into content_items (competency_id, grade_level_id, name_fr, sort_order) values
    (c_eth,   g1, 'Reconnaître les émotions et les exprimer de façon appropriée', 1),
    (c_eth,   g1, 'Distinguer le juste et l''injuste dans des situations simples', 2);

  insert into content_items (competency_id, grade_level_id, name_fr, sort_order) values
    (c_dial,  g1, 'Écouter l''autre et attendre son tour pour parler', 1),
    (c_dial,  g1, 'Exprimer son opinion avec des mots appropriés', 2);


  -- ── 2e année ────────────────────────────────────────────
  insert into content_items (competency_id, grade_level_id, name_fr, sort_order) values
    (c_cult,  g2, 'Diversité culturelle dans ma classe et mon école', 1),
    (c_cult,  g2, 'Patrimoine québécois : symboles, musique, contes et légendes', 2),
    (c_cult,  g2, 'Contributions de différentes cultures à la société québécoise', 3);

  insert into content_items (competency_id, grade_level_id, name_fr, sort_order) values
    (c_cito,  g2, 'Vie démocratique simple : vote, prise de décision collective', 1),
    (c_cito,  g2, 'Rôles et responsabilités dans la famille et l''école', 2);

  insert into content_items (competency_id, grade_level_id, name_fr, sort_order) values
    (c_eth,   g2, 'L''empathie : se mettre à la place de l''autre', 1),
    (c_eth,   g2, 'Résolution pacifique de conflits', 2);

  insert into content_items (competency_id, grade_level_id, name_fr, sort_order) values
    (c_dial,  g2, 'La discussion en groupe : règles et attitudes', 1),
    (c_dial,  g2, 'Distinguer un fait d''une opinion', 2);


  -- ── 3e année ────────────────────────────────────────────
  insert into content_items (competency_id, grade_level_id, name_fr, sort_order) values
    (c_cult,  g3, 'Peuples autochtones du Québec : cultures, langues, traditions', 1),
    (c_cult,  g3, 'Arts, littérature et musique du Québec (œuvres représentatives)', 2),
    (c_cult,  g3, 'Influence des cultures du monde sur la culture québécoise', 3);

  insert into content_items (competency_id, grade_level_id, name_fr, sort_order) values
    (c_cito,  g3, 'Institutions politiques du Québec (municipalité, intro)', 1),
    (c_cito,  g3, 'Engagement citoyen : bénévolat, entraide communautaire', 2),
    (c_cito,  g3, 'Droits de l''enfant (Convention des Nations Unies)', 3);

  insert into content_items (competency_id, grade_level_id, name_fr, sort_order) values
    (c_eth,   g3, 'Valeurs individuelles et valeurs collectives', 1),
    (c_eth,   g3, 'Enjeux éthiques liés aux relations en ligne (intro)', 2);

  insert into content_items (competency_id, grade_level_id, name_fr, sort_order) values
    (c_dial,  g3, 'Formes de dialogue : entretien, débat, narration', 1),
    (c_dial,  g3, 'Reconnaître les biais et les généralisations dans un discours', 2);


  -- ── 4e année ────────────────────────────────────────────
  insert into content_items (competency_id, grade_level_id, name_fr, sort_order) values
    (c_cult,  g4, 'Histoire de l''immigration au Québec : qui sont les Québécois?', 1),
    (c_cult,  g4, 'Laïcité et neutralité religieuse dans les institutions', 2),
    (c_cult,  g4, 'Patrimoine immatériel : langue française, expressions, humour québécois', 3);

  insert into content_items (competency_id, grade_level_id, name_fr, sort_order) values
    (c_cito,  g4, 'Système politique québécois : Assemblée nationale (intro)', 1),
    (c_cito,  g4, 'Rôle des médias dans la démocratie', 2),
    (c_cito,  g4, 'Discrimination et inclusion sociale : reconnaître et agir', 3);

  insert into content_items (competency_id, grade_level_id, name_fr, sort_order) values
    (c_eth,   g4, 'Justice, équité et égalité des chances', 1),
    (c_eth,   g4, 'Responsabilité envers l''environnement', 2);

  insert into content_items (competency_id, grade_level_id, name_fr, sort_order) values
    (c_dial,  g4, 'Argumenter une position en s''appuyant sur des faits', 1),
    (c_dial,  g4, 'Écoute active et reformulation dans un débat', 2);


  -- ── 5e année ────────────────────────────────────────────
  insert into content_items (competency_id, grade_level_id, name_fr, sort_order) values
    (c_cult,  g5, 'Diversité religieuse et spirituelle au Québec', 1),
    (c_cult,  g5, 'Expressions artistiques autochtones contemporaines', 2),
    (c_cult,  g5, 'Influence de la culture américaine sur le Québec', 3);

  insert into content_items (competency_id, grade_level_id, name_fr, sort_order) values
    (c_cito,  g5, 'Charte des droits et libertés de la personne du Québec', 1),
    (c_cito,  g5, 'Mouvements sociaux au Québec (féminisme, droits civiques)', 2),
    (c_cito,  g5, 'Participation citoyenne : pétitions, manifestations, engagement', 3);

  insert into content_items (competency_id, grade_level_id, name_fr, sort_order) values
    (c_eth,   g5, 'Enjeux éthiques des technologies numériques', 1),
    (c_eth,   g5, 'Liberté d''expression et ses limites', 2);

  insert into content_items (competency_id, grade_level_id, name_fr, sort_order) values
    (c_dial,  g5, 'Analyser un point de vue et l''apprécier de façon critique', 1),
    (c_dial,  g5, 'Délibération : processus et conditions d''une bonne discussion', 2);


  -- ── 6e année ────────────────────────────────────────────
  insert into content_items (competency_id, grade_level_id, name_fr, sort_order) values
    (c_cult,  g6, 'Identité québécoise : histoire, langue, valeurs communes', 1),
    (c_cult,  g6, 'Relations interculturelles et intercommunautaires au Québec', 2),
    (c_cult,  g6, 'Culture québécoise dans un contexte de mondialisation', 3);

  insert into content_items (competency_id, grade_level_id, name_fr, sort_order) values
    (c_cito,  g6, 'Démocratie : forces, limites et défis actuels', 1),
    (c_cito,  g6, 'Organisations internationales et enjeux mondiaux (ONU, UNESCO)', 2),
    (c_cito,  g6, 'Développement durable : responsabilité individuelle et collective', 3);

  insert into content_items (competency_id, grade_level_id, name_fr, sort_order) values
    (c_eth,   g6, 'Enjeux éthiques contemporains (pauvreté, réfugiés, climat)', 1),
    (c_eth,   g6, 'Notion de bien commun et de solidarité mondiale', 2);

  insert into content_items (competency_id, grade_level_id, name_fr, sort_order) values
    (c_dial,  g6, 'Construire une argumentation rigoureuse et nuancée', 1),
    (c_dial,  g6, 'Rôle du dialogue dans la résolution de conflits sociaux', 2);

end $$;
