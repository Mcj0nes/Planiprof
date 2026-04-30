-- ============================================================
-- PLANIPROF -- Seed: Monde contemporain, 5e secondaire
-- Source: Precision des apprentissages au secondaire
--   Monde contemporain (Ministere de l'Education, 2012)
-- Niveau : 5e secondaire
-- ============================================================

do $$
declare
  mc_id    int;
  s5       int;

  c_interp int;
  c_pos    int;

begin

  insert into subjects (name_fr, name_en, slug, color)
    values ('Monde contemporain', 'Contemporary World', 'monde-contemporain', '#DC2626')
    on conflict (slug) do nothing;

  select id into mc_id from subjects where slug = 'monde-contemporain';
  select id into s5 from grade_levels where education_level = 'secondaire' and grade = 5;

  delete from plan_assignments pa
    using content_items ci
    join competencies co on co.id = ci.competency_id
    where ci.id = pa.content_item_id
      and co.subject_id = mc_id
      and ci.grade_level_id = s5;

  delete from content_items ci
    using competencies co
    where ci.competency_id = co.id
      and co.subject_id = mc_id
      and ci.grade_level_id = s5;

  delete from competencies where subject_id = mc_id;

  insert into competencies (subject_id, name_fr, color, sort_order)
    values (mc_id, 'Interpreter un probleme du monde contemporain', '#DC2626', 1)
    returning id into c_interp;

  insert into competencies (subject_id, name_fr, color, sort_order)
    values (mc_id, 'Prendre position sur un enjeu du monde contemporain', '#B91C1C', 2)
    returning id into c_pos;


  -- 5E SECONDAIRE -- 5 themes

  insert into content_items (competency_id, grade_level_id, name_fr, sort_order) values

    -- Theme 1 : Environnement
    (c_interp, s5, 'Environnement (angle : La gestion de l''environnement) -- Problemes environnementaux (degradation, GES, changements climatiques, penurie d''eau, biodiversite); empreinte ecologique; organisations internationales (PNUE, WWF, Greenpeace); accords (protocoles de Montreal et de Kyoto); mesures des etats', 1),
    (c_pos,    s5, 'Environnement -- Enjeu : Utilisation et consommation des ressources OU Harmonisation des normes environnementales; analyse des acteurs, interets et prises de position; principes de developpement durable et de precaution', 2),

    -- Theme 2 : Population
    (c_interp, s5, 'Population (angle : L''intensification des mouvements migratoires) -- Repartition de la population mondiale; types de migration (economique, humanitaire, climatique); impacts demographiques et socioeconomiques; urbanisation et monde du travail; organisations internationales (HCR, OIM)', 3),
    (c_pos,    s5, 'Population -- Enjeu : Migrations et monde du travail OU Gestion de l''expansion urbaine; analyse des politiques migratoires et d''immigration; droits des migrants; responsabilite des etats et de la communaute internationale', 4),

    -- Theme 3 : Pouvoir
    (c_interp, s5, 'Pouvoir (angle : Le partage du pouvoir dans le monde) -- Systemes politiques; organisations internationales (ONU, Assemblee generale, Conseil de securite, CIJ, CPI); mondialisation economique et multinationales; accords multilateraux; zones economiques; regroupements politiques (UE, OTAN)', 5),
    (c_pos,    s5, 'Pouvoir -- Enjeu : Redistribution du pouvoir dans la gouvernance mondiale OU Tensions entre souverainete des etats et cooperation internationale; analyse des rapports de force, des institutions et de leurs limites', 6),

    -- Theme 4 : Richesse
    (c_interp, s5, 'Richesse (angle : La repartition de la richesse) -- Creation de la richesse et facteurs explicatifs; disparites Nord-Sud (PIB, IDH, indice de Gini); colonisation et neocolonisation; mondialisation economique; endettement des etats; role des organisations internationales (FMI, Banque mondiale, OMC)', 7),
    (c_pos,    s5, 'Richesse -- Enjeu : Equilibre entre justice sociale et developpement economique OU Controle des ressources; analyse des inegalites mondiales, des politiques de redistribution, du commerce equitable et de l''altermondialisation', 8),

    -- Theme 5 : Tensions et conflits
    (c_interp, s5, 'Tensions et conflits (angle : Les interventions exterieures en territoire souverain) -- Sources de tensions (ressources, droits, identites); zones de tensions et conflits armes; role de l''ONU (Conseil de securite, missions de paix, TPI, HCR); ONG humanitaires; alliances internationales (OTAN); conventions de Geneve', 9),
    (c_pos,    s5, 'Tensions et conflits -- Enjeu : Application du principe d''assistance humanitaire OU Interet des intervenants versus interet des populations; analyse du principe de non-ingerence, de la responsabilite de proteger et des processus de paix', 10);

end $$;