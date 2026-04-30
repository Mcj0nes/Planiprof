CREATE TABLE IF NOT EXISTS exposes2_grids (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  etape      smallint,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE exposes2_grids ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'exposes2_grids' AND policyname = 'own') THEN
    CREATE POLICY "own" ON exposes2_grids FOR ALL USING (user_id = auth.uid());
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS exposes2_students (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  grid_id    uuid NOT NULL REFERENCES exposes2_grids(id) ON DELETE CASCADE,
  name       text NOT NULL DEFAULT '',
  sort_order int  NOT NULL DEFAULT 0
);
ALTER TABLE exposes2_students ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'exposes2_students' AND policyname = 'own') THEN
    CREATE POLICY "own" ON exposes2_students FOR ALL USING (
      EXISTS (SELECT 1 FROM exposes2_grids g WHERE g.id = grid_id AND g.user_id = auth.uid())
    );
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS exposes2_scores (
  student_id uuid NOT NULL REFERENCES exposes2_students(id) ON DELETE CASCADE,
  criterion  text NOT NULL,
  score      smallint NOT NULL CHECK (score BETWEEN 1 AND 4),
  PRIMARY KEY (student_id, criterion)
);
ALTER TABLE exposes2_scores ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'exposes2_scores' AND policyname = 'own') THEN
    CREATE POLICY "own" ON exposes2_scores FOR ALL USING (
      EXISTS (
        SELECT 1 FROM exposes2_students s
        JOIN exposes2_grids g ON g.id = s.grid_id
        WHERE s.id = student_id AND g.user_id = auth.uid()
      )
    );
  END IF;
END $$;
