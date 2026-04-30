-- Séances de remplissage pour les grilles de conversation

CREATE TABLE conversation_sessions (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  grid_id    uuid NOT NULL,
  etape      smallint CHECK (etape IN (1, 2, 3)),
  created_at timestamptz DEFAULT now()
);
ALTER TABLE conversation_sessions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own" ON conversation_sessions FOR ALL USING (user_id = auth.uid());

-- Élèves par séance (commentaire global à droite de la grille)
CREATE TABLE conversation_session_students (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id uuid NOT NULL REFERENCES conversation_sessions(id) ON DELETE CASCADE,
  name       text NOT NULL,
  sort_order integer NOT NULL DEFAULT 0,
  comment    text
);
ALTER TABLE conversation_session_students ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own" ON conversation_session_students FOR ALL USING (
  EXISTS (
    SELECT 1 FROM conversation_sessions cs
    WHERE cs.id = session_id AND cs.user_id = auth.uid()
  )
);

-- Résultats par élève × critère
CREATE TABLE conversation_session_scores (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id   uuid NOT NULL REFERENCES conversation_session_students(id) ON DELETE CASCADE,
  criterion_id uuid NOT NULL,
  level_id     bigint,
  UNIQUE (student_id, criterion_id)
);
ALTER TABLE conversation_session_scores ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own" ON conversation_session_scores FOR ALL USING (
  EXISTS (
    SELECT 1 FROM conversation_session_students css
    JOIN conversation_sessions cs ON cs.id = css.session_id
    WHERE css.id = student_id AND cs.user_id = auth.uid()
  )
);
