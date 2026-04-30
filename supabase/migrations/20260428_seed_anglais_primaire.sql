-- Anglais, langue seconde — primaire (PDA)
do $$
declare
  ang_id  int;
  g1 int; g2 int; g3 int; g4 int; g5 int; g6 int;
  c_interagir  int;
  c_comprendre int;
  c_produire   int;
  c_savoirs    int;
begin
  select id into ang_id from subjects    where slug = 'anglais';
  select id into g1     from grade_levels where education_level = 'primaire' and grade = 1;
  select id into g2     from grade_levels where education_level = 'primaire' and grade = 2;
  select id into g3     from grade_levels where education_level = 'primaire' and grade = 3;
  select id into g4     from grade_levels where education_level = 'primaire' and grade = 4;
  select id into g5     from grade_levels where education_level = 'primaire' and grade = 5;
  select id into g6     from grade_levels where education_level = 'primaire' and grade = 6;

  -- Skip if already seeded
  if exists (select 1 from competencies where subject_id = ang_id) then
    return;
  end if;

  insert into competencies (subject_id, name_fr, color, sort_order) values
    (ang_id, 'Interagir oralement en anglais',           '#0284C7', 10) returning id into c_interagir;
  insert into competencies (subject_id, name_fr, color, sort_order) values
    (ang_id, 'Comprendre des textes lus et entendus',    '#7C3AED', 20) returning id into c_comprendre;
  insert into competencies (subject_id, name_fr, color, sort_order) values
    (ang_id, 'Produire des textes en anglais',           '#059669', 30) returning id into c_produire;
  insert into competencies (subject_id, name_fr, color, sort_order) values
    (ang_id, 'Savoirs linguistiques',                    '#F59E0B', 40) returning id into c_savoirs;

  -- =====================================================================
  -- 1RE ANNÉE
  -- =====================================================================
  insert into content_items (competency_id, grade_level_id, name_fr, sort_order, progression_type) values
    (c_interagir, g1, 'Salutations et présentations (Hello, My name is…, How are you?)', 1, 'progression'),
    (c_interagir, g1, 'Commandes de classe (Open your book, Sit down, Listen, Look…)', 2, 'progression'),
    (c_interagir, g1, 'Nommer des objets de la classe (desk, chair, pencil, book…)', 3, 'progression'),
    (c_interagir, g1, 'Exprimer des préférences simples (I like / I don''t like…)', 4, 'progression');

  insert into content_items (competency_id, grade_level_id, name_fr, sort_order, progression_type) values
    (c_comprendre, g1, 'Comprendre des consignes simples accompagnées de gestes', 1, 'progression'),
    (c_comprendre, g1, 'Identifier des mots et expressions dans des comptines et chansons', 2, 'progression'),
    (c_comprendre, g1, 'Associer des images à des mots entendus', 3, 'progression');

  insert into content_items (competency_id, grade_level_id, name_fr, sort_order, progression_type) values
    (c_produire, g1, 'Copier des mots et expressions modèles', 1, 'progression'),
    (c_produire, g1, 'Écrire son prénom en anglais', 2, 'progression');

  insert into content_items (competency_id, grade_level_id, name_fr, sort_order, progression_type) values
    (c_savoirs, g1, 'Vocabulaire : couleurs, chiffres (1–10), formes, animaux familiers', 1, 'progression'),
    (c_savoirs, g1, 'Structures de base : I am…, It is a…, I have…', 2, 'progression'),
    (c_savoirs, g1, 'Phonologie : sons simples de l''anglais, intonation des questions', 3, 'progression');

  -- =====================================================================
  -- 2E ANNÉE
  -- =====================================================================
  insert into content_items (competency_id, grade_level_id, name_fr, sort_order, progression_type) values
    (c_interagir, g2, 'Raconter des événements simples du quotidien', 1, 'progression'),
    (c_interagir, g2, 'Exprimer ses goûts et émotions (I love / I''m happy / I''m sad…)', 2, 'progression'),
    (c_interagir, g2, 'Décrire des personnes et des objets (big, small, tall, short…)', 3, 'progression'),
    (c_interagir, g2, 'Interactions sur les animaux, la famille, les couleurs', 4, 'progression');

  insert into content_items (competency_id, grade_level_id, name_fr, sort_order, progression_type) values
    (c_comprendre, g2, 'Comprendre le sens global d''une histoire simple', 1, 'progression'),
    (c_comprendre, g2, 'Identifier des personnages et des éléments d''une histoire', 2, 'progression'),
    (c_comprendre, g2, 'Comprendre des textes illustrés courts', 3, 'progression');

  insert into content_items (competency_id, grade_level_id, name_fr, sort_order, progression_type) values
    (c_produire, g2, 'Écrire des phrases modèles (I have a ___. My ___ is ___)', 1, 'progression'),
    (c_produire, g2, 'Composer de courtes listes (shopping list, wish list…)', 2, 'progression');

  insert into content_items (competency_id, grade_level_id, name_fr, sort_order, progression_type) values
    (c_savoirs, g2, 'Vocabulaire : chiffres (1–20), jours de la semaine, mois, saisons', 1, 'progression'),
    (c_savoirs, g2, 'Adjectifs de base (big, small, tall, short, red, blue, happy…)', 2, 'progression'),
    (c_savoirs, g2, 'Verbes be et have au présent simple', 3, 'progression');

  -- =====================================================================
  -- 3E ANNÉE
  -- =====================================================================
  insert into content_items (competency_id, grade_level_id, name_fr, sort_order, progression_type) values
    (c_interagir, g3, 'Poser des questions simples et y répondre (What? Who? Where?)', 1, 'progression'),
    (c_interagir, g3, 'Décrire sa routine quotidienne', 2, 'progression'),
    (c_interagir, g3, 'Parler de sa famille et de son environnement immédiat', 3, 'progression'),
    (c_interagir, g3, 'Utiliser des formules de politesse (Please, Thank you, Excuse me)', 4, 'progression');

  insert into content_items (competency_id, grade_level_id, name_fr, sort_order, progression_type) values
    (c_comprendre, g3, 'Identifier les éléments d''un récit (personnages, lieu, événements)', 1, 'progression'),
    (c_comprendre, g3, 'Comprendre des textes narratifs simples', 2, 'progression'),
    (c_comprendre, g3, 'Dégager les informations principales d''un texte court', 3, 'progression');

  insert into content_items (competency_id, grade_level_id, name_fr, sort_order, progression_type) values
    (c_produire, g3, 'Rédiger de courtes phrases décrivant des images ou des personnages', 1, 'progression'),
    (c_produire, g3, 'Compléter des textes à trous à partir de modèles', 2, 'progression'),
    (c_produire, g3, 'Écrire une carte de souhaits ou un message simple', 3, 'progression');

  insert into content_items (competency_id, grade_level_id, name_fr, sort_order, progression_type) values
    (c_savoirs, g3, 'Présent simple (affirmatif, négatif, interrogatif) — verbes courants', 1, 'progression'),
    (c_savoirs, g3, 'Prépositions de lieu (in, on, under, beside, between…)', 2, 'progression'),
    (c_savoirs, g3, 'Vocabulaire thématique : alimentation, sports, météo, corps humain', 3, 'progression');

  -- =====================================================================
  -- 4E ANNÉE
  -- =====================================================================
  insert into content_items (competency_id, grade_level_id, name_fr, sort_order, progression_type) values
    (c_interagir, g4, 'Exprimer son opinion (I think…, In my opinion…, I agree/disagree…)', 1, 'progression'),
    (c_interagir, g4, 'Décrire des événements passés simples', 2, 'progression'),
    (c_interagir, g4, 'Participer à un jeu de rôle ou à une saynète courte', 3, 'progression'),
    (c_interagir, g4, 'Demander et donner des directions (Go straight, Turn left…)', 4, 'progression');

  insert into content_items (competency_id, grade_level_id, name_fr, sort_order, progression_type) values
    (c_comprendre, g4, 'Comprendre des textes documentaires courts (animal facts, seasons…)', 1, 'progression'),
    (c_comprendre, g4, 'Identifier le but d''un texte (informer, divertir, convaincre…)', 2, 'progression'),
    (c_comprendre, g4, 'Inférer le sens de mots inconnus à partir du contexte', 3, 'progression');

  insert into content_items (competency_id, grade_level_id, name_fr, sort_order, progression_type) values
    (c_produire, g4, 'Écrire un paragraphe descriptif sur un sujet familier', 1, 'progression'),
    (c_produire, g4, 'Composer un texte narratif simple (début, milieu, fin)', 2, 'progression'),
    (c_produire, g4, 'Utiliser des connecteurs simples (first, then, after that, finally)', 3, 'progression');

  insert into content_items (competency_id, grade_level_id, name_fr, sort_order, progression_type) values
    (c_savoirs, g4, 'Passé simple — verbes réguliers (walk → walked, play → played)', 1, 'progression'),
    (c_savoirs, g4, 'Adverbes de temps (yesterday, last week, last year, ago)', 2, 'progression'),
    (c_savoirs, g4, 'Vocabulaire thématique : communauté, environnement, loisirs, professions', 3, 'progression');

  -- =====================================================================
  -- 5E ANNÉE
  -- =====================================================================
  insert into content_items (competency_id, grade_level_id, name_fr, sort_order, progression_type) values
    (c_interagir, g5, 'Soutenir une conversation sur des sujets familiers', 1, 'progression'),
    (c_interagir, g5, 'Exprimer son accord ou désaccord et justifier', 2, 'progression'),
    (c_interagir, g5, 'Présenter un exposé oral court devant la classe', 3, 'progression'),
    (c_interagir, g5, 'Utiliser des stratégies de communication (reformuler, demander de répéter)', 4, 'progression');

  insert into content_items (competency_id, grade_level_id, name_fr, sort_order, progression_type) values
    (c_comprendre, g5, 'Lire des textes plus longs et variés (conte, article, poème)', 1, 'progression'),
    (c_comprendre, g5, 'Identifier les caractéristiques des différents genres de textes', 2, 'progression'),
    (c_comprendre, g5, 'Faire des inférences à partir du contexte et des illustrations', 3, 'progression'),
    (c_comprendre, g5, 'Repérer l''idée principale et les idées secondaires', 4, 'progression');

  insert into content_items (competency_id, grade_level_id, name_fr, sort_order, progression_type) values
    (c_produire, g5, 'Rédiger un texte d''opinion avec arguments simples', 1, 'progression'),
    (c_produire, g5, 'Écrire un texte narratif en respectant la structure (plan)', 2, 'progression'),
    (c_produire, g5, 'Réviser son texte à l''aide d''une grille de correction', 3, 'progression');

  insert into content_items (competency_id, grade_level_id, name_fr, sort_order, progression_type) values
    (c_savoirs, g5, 'Futur avec will et be going to', 1, 'progression'),
    (c_savoirs, g5, 'Passé irrégulier fréquent (go/went, have/had, do/did, come/came…)', 2, 'progression'),
    (c_savoirs, g5, 'Vocabulaire thématique : droits, santé, environnement, médias', 3, 'progression'),
    (c_savoirs, g5, 'Comparatifs et superlatifs (bigger, the biggest…)', 4, 'progression');

  -- =====================================================================
  -- 6E ANNÉE
  -- =====================================================================
  insert into content_items (competency_id, grade_level_id, name_fr, sort_order, progression_type) values
    (c_interagir, g6, 'Présenter un point de vue et le justifier avec des exemples', 1, 'progression'),
    (c_interagir, g6, 'Participer à des discussions et débats sur des enjeux simples', 2, 'progression'),
    (c_interagir, g6, 'Adapter son registre à la situation de communication (formel/informel)', 3, 'progression'),
    (c_interagir, g6, 'Utiliser des éléments culturels anglophones dans ses interactions', 4, 'progression');

  insert into content_items (competency_id, grade_level_id, name_fr, sort_order, progression_type) values
    (c_comprendre, g6, 'Comprendre des textes avec arguments (texte d''opinion, article)', 1, 'progression'),
    (c_comprendre, g6, 'Analyser des éléments culturels et les relier à sa propre expérience', 2, 'progression'),
    (c_comprendre, g6, 'Évaluer la fiabilité et la pertinence de l''information lue ou entendue', 3, 'progression'),
    (c_comprendre, g6, 'Comprendre des textes d''auteurs québécois et canadiens anglophones', 4, 'progression');

  insert into content_items (competency_id, grade_level_id, name_fr, sort_order, progression_type) values
    (c_produire, g6, 'Rédiger des textes variés (narratif, descriptif, explicatif, poétique)', 1, 'progression'),
    (c_produire, g6, 'Réviser et corriger ses textes de façon autonome', 2, 'progression'),
    (c_produire, g6, 'Produire un projet créatif en anglais (affiche, saynète, court récit)', 3, 'progression'),
    (c_produire, g6, 'Intégrer des éléments culturels anglophones dans ses productions', 4, 'progression');

  insert into content_items (competency_id, grade_level_id, name_fr, sort_order, progression_type) values
    (c_savoirs, g6, 'Présent progressif vs présent simple (I am reading / I read)', 1, 'progression'),
    (c_savoirs, g6, 'Questions avec auxiliaires (do/does/did/will/can/have…)', 2, 'progression'),
    (c_savoirs, g6, 'Introduction aux modaux (can, could, should, would, must)', 3, 'progression'),
    (c_savoirs, g6, 'Vocabulaire thématique : identité, culture, société, technologie', 4, 'progression');

end $$;
