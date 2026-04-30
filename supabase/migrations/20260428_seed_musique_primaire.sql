-- Musique — primaire (PDA)
do $$
declare
  mus_id int;
  g1 int; g2 int; g3 int; g4 int; g5 int; g6 int;
  c_creer      int;
  c_interpreter int;
  c_apprecier  int;
  c_savoirs    int;
begin
  select id into mus_id from subjects    where slug = 'musique';
  select id into g1     from grade_levels where education_level = 'primaire' and grade = 1;
  select id into g2     from grade_levels where education_level = 'primaire' and grade = 2;
  select id into g3     from grade_levels where education_level = 'primaire' and grade = 3;
  select id into g4     from grade_levels where education_level = 'primaire' and grade = 4;
  select id into g5     from grade_levels where education_level = 'primaire' and grade = 5;
  select id into g6     from grade_levels where education_level = 'primaire' and grade = 6;

  if exists (select 1 from competencies where subject_id = mus_id) then
    return;
  end if;

  insert into competencies (subject_id, name_fr, color, sort_order) values
    (mus_id, 'Créer des pièces vocales ou instrumentales', '#7C3AED', 10) returning id into c_creer;
  insert into competencies (subject_id, name_fr, color, sort_order) values
    (mus_id, 'Interpréter des pièces musicales',           '#0284C7', 20) returning id into c_interpreter;
  insert into competencies (subject_id, name_fr, color, sort_order) values
    (mus_id, 'Apprécier des œuvres musicales',             '#059669', 30) returning id into c_apprecier;
  insert into competencies (subject_id, name_fr, color, sort_order) values
    (mus_id, 'Savoirs musicaux',                           '#F59E0B', 40) returning id into c_savoirs;

  -- =====================================================================
  -- 1RE ANNÉE
  -- =====================================================================
  insert into content_items (competency_id, grade_level_id, name_fr, sort_order, progression_type) values
    (c_creer, g1, 'Explorer sa voix (parler, chuchoter, chanter, crier)', 1, 'progression'),
    (c_creer, g1, 'Inventer de courtes séquences rythmiques corporelles (frapper, taper)', 2, 'progression'),
    (c_creer, g1, 'Improviser de courts motifs vocaux en réponse à une image ou une histoire', 3, 'progression');

  insert into content_items (competency_id, grade_level_id, name_fr, sort_order, progression_type) values
    (c_interpreter, g1, 'Chanter en groupe des chansons simples avec la mélodie', 1, 'progression'),
    (c_interpreter, g1, 'Reproduire des rythmes simples par imitation (écho rythmique)', 2, 'progression'),
    (c_interpreter, g1, 'Utiliser des instruments de percussion non mélodiques (tambourin, maracas, triangle)', 3, 'progression');

  insert into content_items (competency_id, grade_level_id, name_fr, sort_order, progression_type) values
    (c_apprecier, g1, 'Réagir à une pièce musicale en exprimant ses émotions', 1, 'progression'),
    (c_apprecier, g1, 'Distinguer musique rapide/lente et forte/douce', 2, 'progression'),
    (c_apprecier, g1, 'Identifier des sons de l''environnement et de la vie quotidienne', 3, 'progression');

  insert into content_items (competency_id, grade_level_id, name_fr, sort_order, progression_type) values
    (c_savoirs, g1, 'La pulsation (le battement régulier de la musique)', 1, 'progression'),
    (c_savoirs, g1, 'Tempo : rapide et lent', 2, 'progression'),
    (c_savoirs, g1, 'Dynamique : fort (f) et doux (p)', 3, 'progression'),
    (c_savoirs, g1, 'Hauteur des sons : aigu et grave', 4, 'progression');

  -- =====================================================================
  -- 2E ANNÉE
  -- =====================================================================
  insert into content_items (competency_id, grade_level_id, name_fr, sort_order, progression_type) values
    (c_creer, g2, 'Composer une courte mélodie avec 2 ou 3 notes', 1, 'progression'),
    (c_creer, g2, 'Inventer un ostinato rythmique simple pour accompagner une chanson', 2, 'progression'),
    (c_creer, g2, 'Créer une courte pièce en combinant sons courts et sons longs', 3, 'progression');

  insert into content_items (competency_id, grade_level_id, name_fr, sort_order, progression_type) values
    (c_interpreter, g2, 'Chanter à l''unisson en respectant la mélodie et les paroles', 1, 'progression'),
    (c_interpreter, g2, 'Jouer un rythme simple sur un instrument de percussion', 2, 'progression'),
    (c_interpreter, g2, 'Respecter le tempo lors d''une interprétation de groupe', 3, 'progression');

  insert into content_items (competency_id, grade_level_id, name_fr, sort_order, progression_type) values
    (c_apprecier, g2, 'Identifier des caractéristiques d''une pièce (tempo, dynamique, hauteur)', 1, 'progression'),
    (c_apprecier, g2, 'Comparer deux pièces musicales et nommer une différence', 2, 'progression'),
    (c_apprecier, g2, 'Utiliser un vocabulaire simple pour décrire ce qu''on entend', 3, 'progression');

  insert into content_items (competency_id, grade_level_id, name_fr, sort_order, progression_type) values
    (c_savoirs, g2, 'Sons courts et sons longs (noire et blanche)', 1, 'progression'),
    (c_savoirs, g2, 'Les premières notes : do, ré, mi', 2, 'progression'),
    (c_savoirs, g2, 'Les familles d''instruments (cordes, vents, percussions)', 3, 'progression');

  -- =====================================================================
  -- 3E ANNÉE
  -- =====================================================================
  insert into content_items (competency_id, grade_level_id, name_fr, sort_order, progression_type) values
    (c_creer, g3, 'Composer une mélodie courte sur une gamme pentatonique', 1, 'progression'),
    (c_creer, g3, 'Organiser des sons pour créer une ambiance (calme, mystère, joie)', 2, 'progression'),
    (c_creer, g3, 'Improviser une réponse musicale à un thème ou une image', 3, 'progression');

  insert into content_items (competency_id, grade_level_id, name_fr, sort_order, progression_type) values
    (c_interpreter, g3, 'Chanter en tenant sa voix avec justesse mélodique', 1, 'progression'),
    (c_interpreter, g3, 'Lire et jouer un rythme simple noté sur une partition', 2, 'progression'),
    (c_interpreter, g3, 'Jouer un ostinato mélodique simple (xylophone, métallophone)', 3, 'progression');

  insert into content_items (competency_id, grade_level_id, name_fr, sort_order, progression_type) values
    (c_apprecier, g3, 'Identifier la forme d''une pièce (couplet/refrain, ABA…)', 1, 'progression'),
    (c_apprecier, g3, 'Reconnaître quelques instruments à l''écoute', 2, 'progression'),
    (c_apprecier, g3, 'Formuler un avis personnel sur une œuvre en utilisant le vocabulaire musical', 3, 'progression');

  insert into content_items (competency_id, grade_level_id, name_fr, sort_order, progression_type) values
    (c_savoirs, g3, 'La portée et les clés (introduction à la notation musicale)', 1, 'progression'),
    (c_savoirs, g3, 'Les notes : do, ré, mi, fa, sol', 2, 'progression'),
    (c_savoirs, g3, 'La mesure à 2/4 et 4/4 (temps forts et faibles)', 3, 'progression'),
    (c_savoirs, g3, 'La gamme pentatonique', 4, 'progression');

  -- =====================================================================
  -- 4E ANNÉE
  -- =====================================================================
  insert into content_items (competency_id, grade_level_id, name_fr, sort_order, progression_type) values
    (c_creer, g4, 'Composer une courte pièce en respectant une structure (ex. : ABA)', 1, 'progression'),
    (c_creer, g4, 'Choisir des timbres et des dynamiques pour exprimer une intention', 2, 'progression'),
    (c_creer, g4, 'Écrire sa composition en notation musicale simplifiée', 3, 'progression');

  insert into content_items (competency_id, grade_level_id, name_fr, sort_order, progression_type) values
    (c_interpreter, g4, 'Chanter en canon ou en deux parties', 1, 'progression'),
    (c_interpreter, g4, 'Interpréter une pièce instrumentale simple en respectant les nuances', 2, 'progression'),
    (c_interpreter, g4, 'Lire une partition simple (notes et rythmes de base)', 3, 'progression');

  insert into content_items (competency_id, grade_level_id, name_fr, sort_order, progression_type) values
    (c_apprecier, g4, 'Identifier le genre musical d''une pièce (classique, jazz, folk, pop…)', 1, 'progression'),
    (c_apprecier, g4, 'Établir des liens entre une œuvre et son contexte culturel ou historique', 2, 'progression'),
    (c_apprecier, g4, 'Comparer sa production à une référence et identifier des pistes d''amélioration', 3, 'progression');

  insert into content_items (competency_id, grade_level_id, name_fr, sort_order, progression_type) values
    (c_savoirs, g4, 'Toutes les notes de la gamme do majeur (do à do)', 1, 'progression'),
    (c_savoirs, g4, 'Les nuances : piano, forte, crescendo, decrescendo', 2, 'progression'),
    (c_savoirs, g4, 'Le timbre : caractéristiques sonores des instruments', 3, 'progression'),
    (c_savoirs, g4, 'Introduction aux accords simples (do majeur, sol majeur)', 4, 'progression');

  -- =====================================================================
  -- 5E ANNÉE
  -- =====================================================================
  insert into content_items (competency_id, grade_level_id, name_fr, sort_order, progression_type) values
    (c_creer, g5, 'Composer une pièce vocale ou instrumentale avec une intention artistique claire', 1, 'progression'),
    (c_creer, g5, 'Utiliser la répétition, le contraste et la variation comme outils de composition', 2, 'progression'),
    (c_creer, g5, 'Intégrer des éléments culturels ou narratifs dans sa création musicale', 3, 'progression');

  insert into content_items (competency_id, grade_level_id, name_fr, sort_order, progression_type) values
    (c_interpreter, g5, 'Interpréter une pièce vocale ou instrumentale avec expression et précision', 1, 'progression'),
    (c_interpreter, g5, 'Jouer en ensemble en respectant sa partie et en écoutant les autres', 2, 'progression'),
    (c_interpreter, g5, 'Mémoriser et présenter une pièce devant un auditoire', 3, 'progression');

  insert into content_items (competency_id, grade_level_id, name_fr, sort_order, progression_type) values
    (c_apprecier, g5, 'Analyser une œuvre musicale (forme, texture, style, intention)', 1, 'progression'),
    (c_apprecier, g5, 'Situer une œuvre dans son contexte culturel (pays, époque, tradition)', 2, 'progression'),
    (c_apprecier, g5, 'Comparer deux œuvres de genres ou de cultures différentes', 3, 'progression');

  insert into content_items (competency_id, grade_level_id, name_fr, sort_order, progression_type) values
    (c_savoirs, g5, 'Intervalles mélodiques simples (tierce, quinte, octave)', 1, 'progression'),
    (c_savoirs, g5, 'La mesure à 3/4 et les notes pointées', 2, 'progression'),
    (c_savoirs, g5, 'Les genres musicaux du monde : introduction (musique africaine, latine, asiatique…)', 3, 'progression'),
    (c_savoirs, g5, 'La texture musicale : monophonie, polyphonie, homophonie', 4, 'progression');

  -- =====================================================================
  -- 6E ANNÉE
  -- =====================================================================
  insert into content_items (competency_id, grade_level_id, name_fr, sort_order, progression_type) values
    (c_creer, g6, 'Composer une pièce originale en choisissant les éléments musicaux de façon autonome', 1, 'progression'),
    (c_creer, g6, 'Réviser et améliorer sa composition à partir d''une écoute critique', 2, 'progression'),
    (c_creer, g6, 'Présenter et expliquer ses choix créatifs devant la classe', 3, 'progression');

  insert into content_items (competency_id, grade_level_id, name_fr, sort_order, progression_type) values
    (c_interpreter, g6, 'Interpréter une pièce en faisant des choix d''interprétation justifiés', 1, 'progression'),
    (c_interpreter, g6, 'Participer à une performance musicale collective (concert, spectacle)', 2, 'progression'),
    (c_interpreter, g6, 'S''auto-évaluer et ajuster son interprétation selon les critères appris', 3, 'progression');

  insert into content_items (competency_id, grade_level_id, name_fr, sort_order, progression_type) values
    (c_apprecier, g6, 'Porter un jugement critique sur une œuvre en s''appuyant sur des critères musicaux', 1, 'progression'),
    (c_apprecier, g6, 'Établir des liens entre musique, culture et identité québécoise', 2, 'progression'),
    (c_apprecier, g6, 'Comparer sa démarche créative à celle d''un artiste professionnel', 3, 'progression');

  insert into content_items (competency_id, grade_level_id, name_fr, sort_order, progression_type) values
    (c_savoirs, g6, 'Lecture et écriture de partitions simples (clé de sol, lignes et interlignes)', 1, 'progression'),
    (c_savoirs, g6, 'Les modes et les gammes (majeur, mineur — introduction)', 2, 'progression'),
    (c_savoirs, g6, 'L''histoire de la musique québécoise : repères culturels', 3, 'progression'),
    (c_savoirs, g6, 'Technologies musicales : enregistrement, édition sonore (notions de base)', 4, 'progression');

end $$;
