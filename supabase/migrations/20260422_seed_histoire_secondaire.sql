-- ============================================================
-- PLANIPROF -- Seed: Histoire du Quebec et du Canada, 2e cycle
-- Source: Programme de formation de l'ecole quebecoise
--   Histoire du Quebec et du Canada, 3e et 4e secondaire
--   (Ministere de l'Education, 2017)
-- Remplace le programme de 2006 (Histoire et education a la citoyennete)
-- ============================================================

do $$
declare
  hist_id  int;
  s3 int; s4 int;

  c_caract int;
  c_interp int;

begin

  insert into subjects (name_fr, name_en, slug, color)
    values ('Histoire du Quebec et du Canada', 'History of Quebec and Canada', 'histoire', '#B45309')
    on conflict (slug) do update set
      name_fr = EXCLUDED.name_fr,
      name_en = EXCLUDED.name_en;

  select id into hist_id from subjects where slug = 'histoire';
  select id into s3 from grade_levels where education_level = 'secondaire' and grade = 3;
  select id into s4 from grade_levels where education_level = 'secondaire' and grade = 4;

  delete from plan_assignments pa
    using content_items ci
    join competencies co on co.id = ci.competency_id
    where ci.id = pa.content_item_id
      and co.subject_id = hist_id
      and ci.grade_level_id in (s3, s4);

  delete from content_items ci
    using competencies co
    where ci.competency_id = co.id
      and co.subject_id = hist_id
      and ci.grade_level_id in (s3, s4);

  delete from competencies where subject_id = hist_id;

  insert into competencies (subject_id, name_fr, color, sort_order)
    values (hist_id, 'Caracteriser une periode de l''histoire du Quebec et du Canada', '#B45309', 1)
    returning id into c_caract;

  insert into competencies (subject_id, name_fr, color, sort_order)
    values (hist_id, 'Interpreter une realite sociale', '#92400E', 2)
    returning id into c_interp;


  -- 3E SECONDAIRE

  insert into content_items (competency_id, grade_level_id, name_fr, sort_order) values

    -- Periode 1 : Des origines a 1608
    (c_caract, s3, 'Des origines a 1608 -- Caracteriser la periode : migrations asiatiques; peuples autochtones (Iroquoiens, Algonquiens, Inuits); familles linguistiques; modes de vie, rapports sociaux, prise de decision; explorations europeennes (Cartier); alliances et rivalites autochtones; premiers contacts europeens-autochtones', 1),
    (c_interp, s3, 'Des origines a 1608 -- Realite sociale : L''experience des Autochtones et le projet de colonie -- reseaux d''echange autochtones; premiers contacts (pecheries, produits echanges, perspective autochtone); explorations et tentatives de colonisation francaise; alliance franco-amerindienne de 1603', 2),

    -- Periode 2 : 1608-1760
    (c_caract, s3, '1608-1760 -- Caracteriser la periode : fondation de Quebec; monopole des compagnies; gouvernement royal (absolutisme, gouverneur, intendant, conseil souverain); territoire francais en Amerique; guerres intercoloniales; guerre de la Conquete (Plaines d''Abraham)', 3),
    (c_interp, s3, '1608-1760 -- Realite sociale : L''evolution de la societe coloniale sous l''autorite de la metropole francaise -- commerce des fourrures; regime seigneurial; croissance de la population (Filles du Roy); Eglise catholique; diversification economique; adaptation des colons; populations autochtones (domicilies, choc microbien)', 4),

    -- Periode 3 : 1760-1791
    (c_caract, s3, '1760-1791 -- Caracteriser la periode : regime militaire; capitulation de Montreal; Proclamation royale (1763); Province de Quebec; Instructions au gouverneur Murray; Acte de Quebec (1774); invasion americaine; arrivee des Loyalistes; Acte constitutionnel (1791)', 5),
    (c_interp, s3, '1760-1791 -- Realite sociale : La Conquete et le changement d''empire -- conditions imposees aux Canadiens; statut des Indiens (revolte de Pontiac); mouvements de revendication; politique economique britannique; commerce des fourrures sous controle britannique; Eglise catholique vs anglicane; situation sociodemographique', 6),

    -- Periode 4 : 1791-1840
    (c_caract, s3, '1791-1840 -- Caracteriser la periode : Acte constitutionnel; Chambre d''assemblee; debats parlementaires (Parti canadien/Parti patriote); nationalismes; idees liberales; soul evements de 1837-1838; Rapport Durham; Acte d''Union (1840)', 7),
    (c_interp, s3, '1791-1840 -- Realite sociale : Les revendications et les luttes nationales -- dualite linguistique; presse ecrite et diffusion des idees; commerce du bois; agriculture et crise des annees 1830; capitaux et infrastructures (canaux, chemins de fer); mouvements migratoires; guerre anglo-americaine de 1812', 8);


  -- 4E SECONDAIRE

  insert into content_items (competency_id, grade_level_id, name_fr, sort_order) values

    -- Periode 5 : 1840-1896
    (c_caract, s4, '1840-1896 -- Caracteriser la periode : Acte d''Union; responsabilite ministerielle (1848); Confederation (1867, AANB); formation des provinces; Politique nationale; expansion vers l''Ouest; soul evements des Metis (1869, 1885); pendaison de Louis Riel; debut de l''industrialisation', 1),
    (c_interp, s4, '1840-1896 -- Realite sociale : La formation du regime federal canadien -- libre-echange britannique; capitalisme et industrialisation; developpement ferroviaire; urbanisation; conditions de travail et mouvement ouvrier; immigration; relations federales-provinciales; droits des Autochtones et des Metis', 2),

    -- Periode 6 : 1896-1945
    (c_caract, s4, '1896-1945 -- Caracteriser la periode : gouvernement Laurier; immigration massive; Premiere Guerre mondiale (conscription 1917); autonomie progressive du Canada (Statut de Westminster 1931); crise economique des annees 1930; Deuxieme Guerre mondiale (conscription 1942)', 3),
    (c_interp, s4, '1896-1945 -- Realite sociale : Les nationalismes et l''autonomie du Canada -- nationalisme canadien-francais vs imperialisme britannique; Bonne Entente; agriculture et industrie; mouvement ouvrier; condition feminine (suffrage 1918 federal); deuxieme industrialisation; mesures sociales de crise', 4),

    -- Periode 7 : 1945-1980
    (c_caract, s4, '1945-1980 -- Caracteriser la periode : baby-boom; arrivee de la television; election du gouvernement Lesage (1960); Revolution tranquille; creation du ministere de l''Education; nationalisation de l''electricite; referendum de 1980; Charte de la langue francaise (loi 101, 1977)', 5),
    (c_interp, s4, '1945-1980 -- Realite sociale : La modernisation du Quebec et la Revolution tranquille -- essor de l''etat-providence; laicisation; syndicalisme; mouvement feministe (droit de vote provincial 1940); affirmation nationale; crise d''Octobre (1970); travaux hydro-electriques; immigration et pluriculturalite', 6),

    -- Periode 8 : De 1980 a nos jours
    (c_caract, s4, 'De 1980 a nos jours -- Caracteriser la periode : rapatriement de la constitution (1982, non-signe par le Quebec); accords du lac Meech et de Charlottetown; referendum de 1995; mondialisation et ALENA; crise d''Oka (1990); Paix des Braves (2002); debats identitaires (laicite, pluralisme)', 7),
    (c_interp, s4, 'De 1980 a nos jours -- Realite sociale : Les choix de societe dans le Quebec contemporain -- enjeux politiques (federalisme vs souverainete); enjeux economiques (tertiarisation, mondialisation, disparites regionales); enjeux sociaux (sante, education, immigration, vieillissement); enjeux environnementaux; droits des Autochtones et reconciliation', 8);

end $$;