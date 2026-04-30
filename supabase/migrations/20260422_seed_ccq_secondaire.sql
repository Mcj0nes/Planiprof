-- ============================================================
-- PLANIPROF — Seed: Culture et citoyenneté québécoise (CCQ), secondaire
-- Source: Progression des apprentissages — Programme CCQ, secondaire
--   (Ministère de l'Éducation, 2e éd. 2024)
-- Niveaux couverts : 1re, 2e, 4e et 5e secondaire
--   (le programme CCQ n'est pas offert en 3e secondaire)
-- Run AFTER 20260421_seed_ccq.sql
-- ============================================================

do $$
declare
  ccq_id  int;
  s1 int; s2 int; s4 int; s5 int;

  c_cult  int;  -- Étudier des réalités culturelles
  c_eth   int;  -- Réfléchir sur des questions éthiques

begin

  select id into ccq_id from subjects where slug = 'ccq';

  select id into s1 from grade_levels where education_level = 'secondaire' and grade = 1;
  select id into s2 from grade_levels where education_level = 'secondaire' and grade = 2;
  select id into s4 from grade_levels where education_level = 'secondaire' and grade = 4;
  select id into s5 from grade_levels where education_level = 'secondaire' and grade = 5;

  -- ── Nettoyage des données secondaires existantes ──────────
  delete from plan_assignments pa
    using content_items ci
    join competencies co on co.id = ci.competency_id
    where ci.id = pa.content_item_id
      and co.subject_id = ccq_id
      and ci.grade_level_id in (s1, s2, s4, s5);

  delete from content_items ci
    using competencies co
    where ci.competency_id = co.id
      and co.subject_id = ccq_id
      and ci.grade_level_id in (s1, s2, s4, s5);

  delete from competencies
    where subject_id = ccq_id
      and name_fr like '%(secondaire)%';

  -- ── Compétences ────────────────────────────────────────────
  insert into competencies (subject_id, name_fr, color, sort_order)
    values (ccq_id, 'Étudier des réalités culturelles (secondaire)', '#7C3AED', 11)
    returning id into c_cult;

  insert into competencies (subject_id, name_fr, color, sort_order)
    values (ccq_id, 'Réfléchir sur des questions éthiques (secondaire)', '#A855F7', 12)
    returning id into c_eth;


  -- ═══════════════════════════════════════════════════════════
  -- 1RE SECONDAIRE
  -- Thèmes : Identités et appartenances | Vie collective et espace public
  -- ═══════════════════════════════════════════════════════════

  insert into content_items (competency_id, grade_level_id, name_fr, sort_order) values
    (c_cult, s1, 'Identités et appartenances — Identité individuelle et collective; dimensions de l''identité (âge, genre, classe sociale, appartenance ethnoculturelle)', 1),
    (c_cult, s1, 'Identités et appartenances — Identités plurielles et intersectionnalité; transformation identitaire à l''adolescence (puberté, image corporelle)', 2),
    (c_cult, s1, 'Identités et appartenances — Socialisation primaire et secondaire; espaces de socialisation (famille, pairs, école, médias sociaux)', 3),
    (c_cult, s1, 'Identités et appartenances — Culture première et culture seconde; rôles sociaux et socialisation de genre', 4),
    (c_cult, s1, 'Identités et appartenances — Orientation sexuelle; éveils amoureux et sexuel', 5),
    (c_cult, s1, 'Identités et appartenances — Dynamiques d''appartenance : identification, différenciation, conformisme, contestation', 6),
    (c_cult, s1, 'Vie collective et espace public — Espace public et espace privé; frontières changeantes selon les technologies numériques', 7),
    (c_cult, s1, 'Vie collective et espace public — Citoyenneté : conditions d''accès, statuts; institutions publiques communes (hôpitaux, écoles, gouvernements)', 8),
    (c_cult, s1, 'Vie collective et espace public — Héritages culturels : Premiers Peuples, héritages français et britannique, laïcité', 9),
    (c_cult, s1, 'Vie collective et espace public — Diversité sociale : ethnoculturelle, linguistique, religieuse, économique, de genre', 10),
    (c_cult, s1, 'Vie collective et espace public — Cohésion sociale; participation citoyenne (formes publique, sociale et électorale)', 11),
    (c_cult, s1, 'Vie collective et espace public — Écoresponsabilité; vision holistique (approche communautaire, roue de médecine)', 12);

  insert into content_items (competency_id, grade_level_id, name_fr, sort_order) values
    (c_eth, s1, 'Identités et appartenances — Réfléchir aux tensions entre dimensions de l''identité; enjeux des attentes de conformité de groupe', 1),
    (c_eth, s1, 'Vie collective et espace public — Réfléchir sur les conceptions de la frontière vie privée/vie publique; enjeux de l''écoresponsabilité', 2);


  -- ═══════════════════════════════════════════════════════════
  -- 2E SECONDAIRE
  -- Thèmes : Autonomie et interdépendance | Démocratie et ordre social
  -- ═══════════════════════════════════════════════════════════

  insert into content_items (competency_id, grade_level_id, name_fr, sort_order) values
    (c_cult, s2, 'Autonomie et interdépendance — Autonomie : autorégulation, autodétermination, liberté de choix, individualisme', 1),
    (c_cult, s2, 'Autonomie et interdépendance — Interdépendance : liens intergénérationnels, division du travail, écosystème', 2),
    (c_cult, s2, 'Autonomie et interdépendance — Relations intimes à l''adolescence : trajectoires amoureuses, mutualité, agir sexuel, défis relationnels', 3),
    (c_cult, s2, 'Autonomie et interdépendance — Consentement et violence sexuelle : composantes, validation, prévention et dénonciation', 4),
    (c_cult, s2, 'Autonomie et interdépendance — Solidarité sociale : entraide familiale, entraide collective, organisations publiques et civiles', 5),
    (c_cult, s2, 'Démocratie et ordre social — Types de démocratie (représentative, participative, directe); séparation des pouvoirs', 6),
    (c_cult, s2, 'Démocratie et ordre social — Paliers gouvernementaux (municipal, provincial, fédéral); fonctionnement du système politique québécois et canadien', 7),
    (c_cult, s2, 'Démocratie et ordre social — Laïcité de l''État québécois; partis et associations politiques', 8),
    (c_cult, s2, 'Démocratie et ordre social — Organisation politique des Premiers Peuples (conseils de bande, autodétermination)', 9),
    (c_cult, s2, 'Démocratie et ordre social — Droits des personnes, intérêts de la collectivité, responsabilités citoyennes', 10),
    (c_cult, s2, 'Démocratie et ordre social — Ordre social : normes, transgressions et sanctions; contre-pouvoirs (médias, syndicats, mouvements sociaux)', 11);

  insert into content_items (competency_id, grade_level_id, name_fr, sort_order) values
    (c_eth, s2, 'Autonomie et interdépendance — Tensions entre intérêts personnels et solidarité; enjeux du consentement et de la violence relationnelle', 1),
    (c_eth, s2, 'Démocratie et ordre social — Tensions entre droits individuels et intérêts collectifs; limites de la démocratie représentative; désobéissance civile', 2);


  -- ═══════════════════════════════════════════════════════════
  -- 4E SECONDAIRE
  -- Thèmes : Relations et bienveillance | Justice et droit |
  --          Culture et productions symboliques | Technologies et défis d'avenir
  -- ═══════════════════════════════════════════════════════════

  insert into content_items (competency_id, grade_level_id, name_fr, sort_order) values
    (c_cult, s4, 'Relations et bienveillance — Expériences intimes positives : désir, plaisir, intimités affective et sexuelle, relations égalitaires', 1),
    (c_cult, s4, 'Relations et bienveillance — Violence dans les relations intimes : continuum de la violence, signes annonciateurs, prévention', 2),
    (c_cult, s4, 'Relations et bienveillance — Pratiques de bienveillance : care, altruisme, écologisme', 3),
    (c_cult, s4, 'Relations et bienveillance — Communication numérique : bienveillance/hostilité en ligne, authenticité, expression numérique de la sexualité', 4),
    (c_cult, s4, 'Justice et droit — Justice : types (pénale, civile, sociale, environnementale); injustice, discrimination directe et indirecte', 5),
    (c_cult, s4, 'Justice et droit — Institutions juridiques et judiciaires : tribunaux, chartes des droits, codes civil et criminel', 6),
    (c_cult, s4, 'Justice et droit — Encadrement juridique de la vie amoureuse et sexuelle : consentement, violence conjugale, Code criminel', 7),
    (c_cult, s4, 'Culture et productions symboliques — Culture matérielle et immatérielle; culture numérique; transformation culturelle', 8),
    (c_cult, s4, 'Culture et productions symboliques — Sous-cultures : classique, populaire, de masse, alternatives; cultures autochtones', 9),
    (c_cult, s4, 'Culture et productions symboliques — Représentations de la sexualité dans les arts, le cinéma, la musique', 10),
    (c_cult, s4, 'Technologies et défis d''avenir — Technologie : usages, technophilie/technophobie, technosolutionnisme', 11),
    (c_cult, s4, 'Technologies et défis d''avenir — Innovations : transhumanisme, posthumanisme, biotechnologies, intelligence artificielle', 12),
    (c_cult, s4, 'Technologies et défis d''avenir — Technologies de l''information : médias sociaux, algorithmes, données massives, protection des renseignements personnels', 13),
    (c_cult, s4, 'Technologies et défis d''avenir — Technologie environnementale : développement durable, transition énergétique, décroissance', 14);

  insert into content_items (competency_id, grade_level_id, name_fr, sort_order) values
    (c_eth, s4, 'Relations et bienveillance — Réfléchir sur l''équilibre entre désir, autonomie et souci de l''autre dans les relations', 1),
    (c_eth, s4, 'Justice et droit — Enjeux éthiques de la justice : réhabilitation vs punition; droits reproductifs; justice sociale et environnementale', 2),
    (c_eth, s4, 'Technologies et défis d''avenir — Enjeux éthiques des biotechnologies et de l''IA; droits individuels vs intérêts collectifs', 3);


  -- ═══════════════════════════════════════════════════════════
  -- 5E SECONDAIRE
  -- Thèmes : Quête de sens et visions du monde |
  --          Groupes sociaux et rapports de pouvoir
  -- ═══════════════════════════════════════════════════════════

  insert into content_items (competency_id, grade_level_id, name_fr, sort_order) values
    (c_cult, s5, 'Quête de sens et visions du monde — Construction de soi : questions philosophiques existentielles, agentivité sexuelle, réflexion sur soi et introspection', 1),
    (c_cult, s5, 'Quête de sens et visions du monde — Intégration sociale et culturelle : rites de passage, choix relatifs à l''âge adulte (profession, parentalité)', 2),
    (c_cult, s5, 'Quête de sens et visions du monde — Relations interpersonnelles, affectives et amoureuses; engagement social', 3),
    (c_cult, s5, 'Quête de sens et visions du monde — Formes de savoirs : religions et spiritualités, philosophies, idéologies, savoirs autochtones, sciences', 4),
    (c_cult, s5, 'Groupes sociaux et rapports de pouvoir — Pouvoir : formes, capacités, délégation, légitimité', 5),
    (c_cult, s5, 'Groupes sociaux et rapports de pouvoir — Inégalités sociales : types, effets (discrimination, stigmatisation, exclusion)', 6),
    (c_cult, s5, 'Groupes sociaux et rapports de pouvoir — Sexisme et inégalités de genre; racisme et colonialisme; inégalités socioéconomiques', 7),
    (c_cult, s5, 'Groupes sociaux et rapports de pouvoir — Inégalités environnementales; justice climatique', 8),
    (c_cult, s5, 'Groupes sociaux et rapports de pouvoir — Égalité et inclusion sociale : politiques publiques égalitaires, réconciliation avec les Premiers Peuples', 9),
    (c_cult, s5, 'Groupes sociaux et rapports de pouvoir — Mouvements sociaux (féminisme, syndicalisme, décolonialisme, mouvement LGBTQ+, écologisme)', 10),
    (c_cult, s5, 'Groupes sociaux et rapports de pouvoir — Changement social : réforme, révolution, facteurs de changement', 11);

  insert into content_items (competency_id, grade_level_id, name_fr, sort_order) values
    (c_eth, s5, 'Quête de sens — Réfléchir sur les réponses des religions, philosophies et idéologies aux grandes questions existentielles', 1),
    (c_eth, s5, 'Groupes sociaux — Réfléchir sur les fondements des inégalités et sur les actions collectives en faveur de la justice et de l''égalité', 2);

end $$;
