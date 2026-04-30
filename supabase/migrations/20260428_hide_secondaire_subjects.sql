-- Hide secondary-only subjects from all UI (primaire-only mode)
update subjects
set is_active = false
where slug in ('histoire', 'monde-contemporain', 'geographie');
