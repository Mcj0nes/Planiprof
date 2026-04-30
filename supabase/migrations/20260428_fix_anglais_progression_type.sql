-- Fix: set progression_type = 'progression' for all anglais content items
update content_items
set progression_type = 'progression'
where competency_id in (
  select id from competencies
  where subject_id = (select id from subjects where slug = 'anglais')
);
