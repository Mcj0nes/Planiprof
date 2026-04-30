-- ============================================================
-- Causeries mathématiques – grille d'observation interactive
-- 3e cycle du primaire (5e et 6e année)
-- ============================================================

CREATE TABLE causeries_grids (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title      text NOT NULL DEFAULT 'Causeries mathématiques',
  created_at timestamptz DEFAULT now()
);

CREATE TABLE causeries_students (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  grid_id    uuid REFERENCES causeries_grids(id) ON DELETE CASCADE NOT NULL,
  name       text NOT NULL DEFAULT '',
  sort_order int  NOT NULL
);

CREATE TABLE causeries_scores (
  student_id uuid REFERENCES causeries_students(id) ON DELETE CASCADE NOT NULL,
  criterion  text NOT NULL,
  score      smallint NOT NULL CHECK (score BETWEEN 1 AND 4),
  PRIMARY KEY (student_id, criterion)
);

-- RLS
ALTER TABLE causeries_grids    ENABLE ROW LEVEL SECURITY;
ALTER TABLE causeries_students ENABLE ROW LEVEL SECURITY;
ALTER TABLE causeries_scores   ENABLE ROW LEVEL SECURITY;

CREATE POLICY "users manage own causeries grids"
  ON causeries_grids FOR ALL
  USING (auth.uid() = user_id);

CREATE POLICY "users manage own causeries students"
  ON causeries_students FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM causeries_grids g
      WHERE g.id = grid_id AND g.user_id = auth.uid()
    )
  );

CREATE POLICY "users manage own causeries scores"
  ON causeries_scores FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM causeries_students s
      JOIN causeries_grids g ON g.id = s.grid_id
      WHERE s.id = student_id AND g.user_id = auth.uid()
    )
  );
