-- Ajoute l'étape (1, 2 ou 3) à chaque grille d'observation
ALTER TABLE causeries_grids
  ADD COLUMN IF NOT EXISTS etape smallint CHECK (etape IN (1, 2, 3));
