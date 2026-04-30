-- Jugements professionnels par étape et par élève (vue d'ensemble causeries)
CREATE TABLE IF NOT EXISTS causeries_etape_jugements (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  etape        smallint NOT NULL CHECK (etape IN (1, 2, 3)),
  student_name text NOT NULL,
  score        smallint NOT NULL CHECK (score BETWEEN 1 AND 4),
  UNIQUE (user_id, etape, student_name)
);

ALTER TABLE causeries_etape_jugements ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own" ON causeries_etape_jugements FOR ALL USING (user_id = auth.uid());
