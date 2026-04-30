-- Retire ÉCR du menu (remplacé par CCQ)
ALTER TABLE subjects ADD COLUMN IF NOT EXISTS is_active boolean NOT NULL DEFAULT true;
UPDATE subjects SET is_active = false WHERE slug = 'ethique';
