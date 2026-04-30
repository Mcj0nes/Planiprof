CREATE TABLE IF NOT EXISTS sci_obs_grids (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  etape      smallint,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE sci_obs_grids ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'sci_obs_grids' AND policyname = 'own') THEN
    CREATE POLICY "own" ON sci_obs_grids FOR ALL USING (user_id = auth.uid());
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS sci_obs_students (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  grid_id    uuid NOT NULL REFERENCES sci_obs_grids(id) ON DELETE CASCADE,
  name       text NOT NULL DEFAULT '',
  sort_order int  NOT NULL DEFAULT 0
);
ALTER TABLE sci_obs_students ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'sci_obs_students' AND policyname = 'own') THEN
    CREATE POLICY "own" ON sci_obs_students FOR ALL USING (
      EXISTS (SELECT 1 FROM sci_obs_grids g WHERE g.id = grid_id AND g.user_id = auth.uid())
    );
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS sci_obs_scores (
  student_id uuid NOT NULL REFERENCES sci_obs_students(id) ON DELETE CASCADE,
  criterion  text NOT NULL,
  score      smallint NOT NULL CHECK (score BETWEEN 1 AND 4),
  PRIMARY KEY (student_id, criterion)
);
ALTER TABLE sci_obs_scores ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'sci_obs_scores' AND policyname = 'own') THEN
    CREATE POLICY "own" ON sci_obs_scores FOR ALL USING (
      EXISTS (
        SELECT 1 FROM sci_obs_students s
        JOIN sci_obs_grids g ON g.id = s.grid_id
        WHERE s.id = student_id AND g.user_id = auth.uid()
      )
    );
  END IF;
END $$;
