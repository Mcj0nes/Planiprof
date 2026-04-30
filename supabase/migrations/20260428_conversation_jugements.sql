CREATE TABLE IF NOT EXISTS conversation_jugements (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  grid_id      uuid NOT NULL,
  etape        smallint,
  student_name text NOT NULL,
  type         text NOT NULL CHECK (type IN ('lecture', 'oral')),
  jugement     text
);

ALTER TABLE conversation_jugements ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'conversation_jugements' AND policyname = 'own'
  ) THEN
    CREATE POLICY "own" ON conversation_jugements FOR ALL USING (user_id = auth.uid());
  END IF;
END $$;
