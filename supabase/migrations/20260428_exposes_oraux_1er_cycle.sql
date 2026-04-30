CREATE TABLE IF NOT EXISTS exposes1_grids (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  etape      smallint,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE exposes1_grids ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'exposes1_grids' AND policyname = 'own') THEN
    CREATE POLICY "own" ON exposes1_grids FOR ALL USING (user_id = auth.uid());
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS exposes1_students (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  grid_id    uuid NOT NULL REFERENCES exposes1_grids(id) ON DELETE CASCADE,
  name       text NOT NULL DEFAULT '',
  sort_order int  NOT NULL DEFAULT 0
);
ALTER TABLE exposes1_students ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'exposes1_students' AND policyname = 'own') THEN
    CREATE POLICY "own" ON exposes1_students FOR ALL USING (
      EXISTS (SELECT 1 FROM exposes1_grids g WHERE g.id = grid_id AND g.user_id = auth.uid())
    );
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS exposes1_scores (
  student_id uuid NOT NULL REFERENCES exposes1_students(id) ON DELETE CASCADE,
  criterion  text NOT NULL,
  score      smallint NOT NULL CHECK (score BETWEEN 1 AND 4),
  PRIMARY KEY (student_id, criterion)
);
ALTER TABLE exposes1_scores ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'exposes1_scores' AND policyname = 'own') THEN
    CREATE POLICY "own" ON exposes1_scores FOR ALL USING (
      EXISTS (
        SELECT 1 FROM exposes1_students s
        JOIN exposes1_grids g ON g.id = s.grid_id
        WHERE s.id = student_id AND g.user_id = auth.uid()
      )
    );
  END IF;
END $$;
