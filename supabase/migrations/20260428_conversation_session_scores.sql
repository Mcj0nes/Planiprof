-- Ajout de la table des résultats par élève × critère
-- (conversation_sessions et conversation_session_students existent déjà)

CREATE TABLE IF NOT EXISTS conversation_session_scores (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id   uuid NOT NULL REFERENCES conversation_session_students(id) ON DELETE CASCADE,
  criterion_id uuid NOT NULL,
  level_id     bigint,
  UNIQUE (student_id, criterion_id)
);

ALTER TABLE conversation_session_scores ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'conversation_session_scores' AND policyname = 'own'
  ) THEN
    CREATE POLICY "own" ON conversation_session_scores FOR ALL USING (
      EXISTS (
        SELECT 1 FROM conversation_session_students css
        JOIN conversation_sessions cs ON cs.id = css.session_id
        WHERE css.id = student_id AND cs.user_id = auth.uid()
      )
    );
  END IF;
END $$;

-- S'assurer que la colonne comment existe sur conversation_session_students
ALTER TABLE conversation_session_students
  ADD COLUMN IF NOT EXISTS comment text;
