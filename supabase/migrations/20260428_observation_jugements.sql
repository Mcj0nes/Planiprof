-- Remplace causeries_etape_jugements par une table générique
-- pour tous les types de grilles d'observation

CREATE TABLE IF NOT EXISTS observation_jugements (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  grid_type    text NOT NULL,
  etape        smallint NOT NULL CHECK (etape IN (1, 2, 3)),
  student_name text NOT NULL,
  score        smallint NOT NULL CHECK (score BETWEEN 1 AND 4),
  UNIQUE (user_id, grid_type, etape, student_name)
);

ALTER TABLE observation_jugements ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'observation_jugements' AND policyname = 'own'
  ) THEN
    CREATE POLICY "own" ON observation_jugements FOR ALL USING (user_id = auth.uid());
  END IF;
END $$;

-- Migrer les données existantes si l'ancienne table existe
-- EXECUTE évite la validation de la table au moment du parsing
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.tables
    WHERE table_schema = 'public' AND table_name = 'causeries_etape_jugements'
  ) THEN
    EXECUTE '
      INSERT INTO observation_jugements (user_id, grid_type, etape, student_name, score)
      SELECT user_id, ''Causeries'', etape, student_name, score
      FROM causeries_etape_jugements
      ON CONFLICT DO NOTHING
    ';
    DROP TABLE causeries_etape_jugements;
  END IF;
END $$;
